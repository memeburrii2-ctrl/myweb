import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInAnonymously, onAuthStateChanged, signOut, updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, deleteDoc, onSnapshot, query, orderBy, where,
  arrayUnion, arrayRemove, serverTimestamp, increment
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── CONFIG ──
const firebaseConfig = {
  apiKey: "AIzaSyC5TOexOb8gjZC7h5sXt9AxCv4zJtiJVfY",
  authDomain: "test-9c725.firebaseapp.com",
  projectId: "test-9c725",
  storageBucket: "test-9c725.firebasestorage.app",
  messagingSenderId: "1050038962565",
  appId: "1:1050038962565:web:e9231b412b5a4289071cec"
};

const ADMIN_UID = 'REPLACE_WITH_YOUR_UID'; // เปลี่ยนเป็น UID ของคุณ
const WEBHOOK_PHOTO = 'https://discord.com/api/webhooks/1495252264233861130/OKUCCeg9f0z6buFGtyW3bVK73tSFSXTGTD1iiXHFqyfu-SM6-92i9wSnW2egMgJ6KyRr';
const WEBHOOK_MSG   = 'https://discord.com/api/webhooks/1495112170541940856/B-QhAY2Y0ERaY7eTW9XhMKBKjOcbRCHp4Z6oHgbX3r2y6QoVxeRZPHy-lclX-ZQNdt9O';

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Check redirect result on page load
getRedirectResult(auth).then(result => {
  if (result?.user) console.log('Google login OK:', result.user.uid);
}).catch(e => console.error('Redirect error:', e));

// ── GLOBALS ──
window.currentUser = null;
let myProfile = null;
let currentFeed = 'all';
let feedUnsub = null;
let currentCmtPostId = null;
let cmtUnsub = null;
let composeFileData = null;
let viewingUid = null;

// ── AVATAR COLOR ──
function getAvatarColor(str) {
  const colors = [
    'linear-gradient(135deg,#7c5cbf,#4ecdc4)',
    'linear-gradient(135deg,#ff6b9d,#7c5cbf)',
    'linear-gradient(135deg,#4ecdc4,#44a08d)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
    'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  ];
  let h = 0;
  for (let c of (str||'A')) h = c.charCodeAt(0) + ((h<<5)-h);
  return colors[Math.abs(h) % colors.length];
}
function getInitial(name) { return (name||'?')[0].toUpperCase(); }
function avHtml(name, cls='av') {
  const bg = getAvatarColor(name);
  return `<div class="${cls}" style="background:${bg}">${getInitial(name)}</div>`;
}

// ── TIME FORMAT ──
function timeAgo(ts) {
  if (!ts) return 'เมื่อกี้';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const s = Math.floor((Date.now()-d)/1000);
  if (s<60) return 'เมื่อกี้';
  if (s<3600) return Math.floor(s/60)+'น. ที่แล้ว';
  if (s<86400) return Math.floor(s/3600)+'ชม. ที่แล้ว';
  return Math.floor(s/86400)+'ว. ที่แล้ว';
}

// ── ESC HTML ──
function esc(t) { return String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── TOAST ──
window.showToast = function(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
};

// ── AUTH STATE ──
onAuthStateChanged(auth, async user => {
  window.currentUser = user;
  if (!user) {
    showScreen('auth');
    return;
  }
  // Load profile
  const pSnap = await getDoc(doc(db,'users',user.uid));
  if (!pSnap.exists()) {
    // First time — need setup (unless anon)
    if (user.isAnonymous) {
      myProfile = { uid: user.uid, name: 'ไม่ระบุตัวตน', isAnon: true };
      await setDoc(doc(db,'users',user.uid), { ...myProfile, createdAt: serverTimestamp() });
      startApp();
    } else {
      showScreen('setup');
    }
  } else {
    myProfile = { uid: user.uid, ...pSnap.data() };
    startApp();
  }
});

function showScreen(s) {
  document.getElementById('authScreen').style.display  = s==='auth'  ? 'flex'  : 'none';
  document.getElementById('setupScreen').style.display = s==='setup' ? 'flex'  : 'none';
  document.getElementById('appScreen').style.display   = s==='app'   ? 'block' : 'none';
}

function startApp() {
  showScreen('app');
  updateMyAvUI();
  loadFeed();
}

function updateMyAvUI() {
  const btn = document.getElementById('myAvBtn');
  if (!btn || !myProfile) return;
  btn.style.background = getAvatarColor(myProfile.name);
  btn.textContent = getInitial(myProfile.name);
  // compose
  const cav = document.getElementById('composeAv');
  const cname = document.getElementById('composeName');
  if (cav) { cav.style.background = getAvatarColor(myProfile.name); cav.textContent = getInitial(myProfile.name); }
  if (cname) cname.textContent = myProfile.isAnon ? 'ไม่ระบุตัวตน' : myProfile.name;
  const cmtAv = document.getElementById('cmtMyAv');
  if (cmtAv) { cmtAv.style.background = getAvatarColor(myProfile.name); cmtAv.textContent = getInitial(myProfile.name); }
}

// ════════════════════════════════════════
// AUTH FUNCTIONS
// ════════════════════════════════════════
window.switchAuthTab = function(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i) => t.classList.toggle('active', (tab==='login'&&i===0)||(tab==='register'&&i===1)));
  document.getElementById('loginForm').style.display    = tab==='login'    ? 'flex' : 'none';
  document.getElementById('registerForm').style.display = tab==='register' ? 'flex' : 'none';
};

window.loginGoogle = async function() {
  try {
    await signInWithRedirect(auth, new GoogleAuthProvider());
  } catch(e) { showToast('Login ไม่สำเร็จ: ' + e.message); }
};

window.loginEmail = async function() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const err   = document.getElementById('loginError');
  if (!email||!pass) { err.textContent='กรุณากรอกให้ครบ'; return; }
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch(e) {
    err.textContent = e.code==='auth/wrong-password' ? 'รหัสผ่านไม่ถูกต้อง' : e.code==='auth/user-not-found' ? 'ไม่พบบัญชีนี้' : 'เกิดข้อผิดพลาด';
  }
};

window.registerEmail = async function() {
  const name  = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass  = document.getElementById('regPass').value;
  const err   = document.getElementById('regError');
  if (!name||!email||!pass) { err.textContent='กรุณากรอกให้ครบ'; return; }
  if (pass.length<6) { err.textContent='รหัสผ่านต้องมีอย่างน้อย 6 ตัว'; return; }
  // Check 3-account limit per email
  const emailSnap = await getDocs(query(collection(db,'users'),where('email','==',email)));
  if (emailSnap.size>=3) { err.textContent='อีเมลนี้มีแอคเคาท์ครบ 3 แล้ว'; return; }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db,'users',cred.user.uid), {
      uid: cred.user.uid, name, email, bio:'', birthdate:'',
      followers:[], following:[], postCount:0,
      createdAt: serverTimestamp()
    });
  } catch(e) {
    err.textContent = e.code==='auth/email-already-in-use' ? 'อีเมลนี้ถูกใช้แล้ว' : 'เกิดข้อผิดพลาด';
  }
};

window.loginAnon = async function() {
  try { await signInAnonymously(auth); } catch(e) { showToast('เกิดข้อผิดพลาด'); }
};

// ════════════════════════════════════════
// SETUP PROFILE
// ════════════════════════════════════════
window.previewSetupAv = function() {
  const val = document.getElementById('setupName').value;
  const av  = document.getElementById('setupAv');
  av.textContent = getInitial(val||'?');
  av.style.background = getAvatarColor(val||'?');
};

window.saveProfile = async function() {
  const name  = document.getElementById('setupName').value.trim();
  const bio   = document.getElementById('setupBio').value.trim();
  const birth = document.getElementById('setupBirth').value;
  if (!name) { showToast('กรุณาใส่ชื่อ'); return; }
  const user = auth.currentUser;
  await setDoc(doc(db,'users',user.uid), {
    uid: user.uid, name, bio, birthdate: birth,
    email: user.email||'', followers:[], following:[], postCount:0,
    createdAt: serverTimestamp()
  });
  myProfile = { uid: user.uid, name, bio, birthdate: birth };
  startApp();
};

// ════════════════════════════════════════
// FEED
// ════════════════════════════════════════
window.switchFeed = function(btn, type) {
  document.querySelectorAll('.feed-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  currentFeed = type;
  loadFeed();
};

function loadFeed() {
  if (feedUnsub) feedUnsub();
  document.getElementById('feedList').innerHTML = '<div class="loading-wrap"><div class="spin"></div><span>กำลังโหลด...</span></div>';
  const q = query(collection(db,'posts'), orderBy('createdAt','desc'));
  feedUnsub = onSnapshot(q, snap => {
    let posts = snap.docs.map(d=>({id:d.id,...d.data()}));
    if (currentFeed==='following' && myProfile?.following?.length) {
      posts = posts.filter(p=>myProfile.following.includes(p.uid)||p.uid===currentUser?.uid);
    }
    renderFeed(posts);
  });
}

function renderFeed(posts) {
  // Pinned
  const pinned = posts.filter(p=>p.pinned);
  const normal = posts.filter(p=>!p.pinned);
  document.getElementById('pinnedPosts').innerHTML = pinned.map(p=>renderPost(p,true)).join('');
  if (!normal.length) {
    document.getElementById('feedList').innerHTML = '<div class="empty-state"><p>ยังไม่มีโพสต์ เป็นคนแรกได้เลย!</p></div>';
    return;
  }
  document.getElementById('feedList').innerHTML = normal.map(p=>renderPost(p,false)).join('');
}

function renderPost(p, isPinned) {
  const isOwner  = p.uid === currentUser?.uid;
  const isAdmin  = currentUser?.uid === ADMIN_UID;
  const liked    = (p.likes||[]).includes(currentUser?.uid);
  const reposted = (p.reposts||[]).includes(currentUser?.uid);
  const likeN    = (p.likes||[]).length;
  const cmtN     = p.commentCount||0;
  const repostN  = (p.reposts||[]).length;

  let displayName = p.isAnon ? 'ไม่ระบุตัวตน' : esc(p.name||'?');
  let avName      = p.isAnon ? '?' : (p.name||'?');
  let badges = '';
  if (p.pinned) badges += `<span class="pin-badge">📌 ปักหมุด</span>`;
  if (p.uid===ADMIN_UID) badges += `<span class="admin-badge">ADMIN</span>`;
  if (p.isAnon) badges += `<span class="anon-badge">ไม่ระบุ</span>`;
  // Admin sees real anon info
  let anonInfo = '';
  if (p.isAnon && isAdmin) anonInfo = `<span style="font-size:.62rem;color:var(--muted);font-family:'Space Mono',monospace"> [${p.uid?.substr(0,8)}]</span>`;

  const imgHtml = p.imageUrl ? `<img src="${esc(p.imageUrl)}" class="post-img" onclick="window.open('${esc(p.imageUrl)}','_blank')"/>` : '';

  const menuItems = `
    ${isOwner||isAdmin ? `<button class="dropdown-item danger" onclick="deletePost('${p.id}',this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>ลบโพสต์</button>` : ''}
    ${isAdmin ? `<button class="dropdown-item" onclick="pinPost('${p.id}','${p.pinned?'unpin':'pin'}',this)">${p.pinned?'📌 เอาออกจากปักหมุด':'📌 ปักหมุด'}</button>` : ''}
    ${!isOwner ? `<button class="dropdown-item" onclick="followUser('${p.uid}',this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>ติดตาม</button>` : ''}
    <button class="dropdown-item" onclick="copyLink('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>คัดลอกลิงก์</button>
  `;

  return `
  <div class="post-card ${isPinned?'post-pinned':''}" id="post_${p.id}">
    <div class="post-top">
      ${avHtml(avName,'av')}
      <div class="post-meta">
        <div class="post-name" onclick="goProfile('${p.uid}')">${displayName}${anonInfo} ${badges}</div>
        <div class="post-time">${timeAgo(p.createdAt)}</div>
      </div>
      <div class="dropdown">
        <button class="post-more" onclick="toggleMenu(this)">···</button>
        <div class="dropdown-menu" style="display:none">${menuItems}</div>
      </div>
    </div>
    <div class="post-body">
      <div class="post-text">${esc(p.text)}</div>
      ${imgHtml}
      <div class="post-actions">
        <button class="act-btn ${liked?'liked':''}" onclick="toggleLike('${p.id}')">
          <svg viewBox="0 0 24 24" fill="${liked?'currentColor':'none'}" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          ${likeN||''}
        </button>
        <button class="act-btn" onclick="openCmt('${p.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          ${cmtN||''}
        </button>
        <button class="act-btn ${reposted?'reposted':''}" onclick="toggleRepost('${p.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
          ${repostN||''}
        </button>
      </div>
    </div>
  </div>`;
}

// ════════════════════════════════════════
// POST ACTIONS
// ════════════════════════════════════════
window.toggleLike = async function(postId) {
  if (!currentUser) return;
  const ref = doc(db,'posts',postId);
  const snap = await getDoc(ref);
  const likes = snap.data()?.likes||[];
  if (likes.includes(currentUser.uid)) {
    await updateDoc(ref,{likes:arrayRemove(currentUser.uid)});
  } else {
    await updateDoc(ref,{likes:arrayUnion(currentUser.uid)});
  }
};

window.toggleRepost = async function(postId) {
  if (!currentUser) return;
  const ref = doc(db,'posts',postId);
  const snap = await getDoc(ref);
  const reposts = snap.data()?.reposts||[];
  if (reposts.includes(currentUser.uid)) {
    await updateDoc(ref,{reposts:arrayRemove(currentUser.uid)});
  } else {
    await updateDoc(ref,{reposts:arrayUnion(currentUser.uid)});
    showToast('รีโพสต์แล้ว ✓');
  }
};

window.deletePost = async function(postId, btn) {
  closeAllMenus();
  if (!confirm('ลบโพสต์นี้?')) return;
  await deleteDoc(doc(db,'posts',postId));
  showToast('ลบแล้ว');
};

window.pinPost = async function(postId, action, btn) {
  closeAllMenus();
  await updateDoc(doc(db,'posts',postId),{pinned:action==='pin'});
  showToast(action==='pin'?'ปักหมุดแล้ว':'เอาออกแล้ว');
};

window.copyLink = function(postId) {
  closeAllMenus();
  navigator.clipboard?.writeText(location.href+'#'+postId);
  showToast('คัดลอกลิงก์แล้ว');
};

window.toggleMenu = function(btn) {
  const menu = btn.nextElementSibling;
  const isOpen = menu.style.display!=='none';
  closeAllMenus();
  if (!isOpen) menu.style.display='block';
};

function closeAllMenus() {
  document.querySelectorAll('.dropdown-menu').forEach(m=>m.style.display='none');
}
document.addEventListener('click',e=>{
  if (!e.target.closest('.dropdown')) closeAllMenus();
});

// ════════════════════════════════════════
// COMPOSE
// ════════════════════════════════════════
window.openCompose = function() {
  updateMyAvUI();
  document.getElementById('composeModal').classList.add('open');
  document.getElementById('composeOverlay').classList.add('open');
  document.getElementById('composeText').focus();
};
window.closeCompose = function() {
  document.getElementById('composeModal').classList.remove('open');
  document.getElementById('composeOverlay').classList.remove('open');
  document.getElementById('composeText').value='';
  document.getElementById('charLeft').textContent='500';
  removeImg();
};

document.getElementById('composeText')?.addEventListener('input',function(){
  document.getElementById('charLeft').textContent=500-this.value.length;
});

window.onComposeFile = function(e) {
  const file=e.target.files[0]; if(!file) return;
  composeFileData=file;
  const reader=new FileReader();
  reader.onload=ev=>{
    document.getElementById('composeImg').src=ev.target.result;
    const wrap=document.getElementById('composeImgPreview');
    wrap.style.display='block'; wrap.style.position='relative';
  };
  reader.readAsDataURL(file);
};

window.removeImg = function() {
  composeFileData=null;
  document.getElementById('composeImgPreview').style.display='none';
  document.getElementById('composeFile').value='';
};

window.submitPost = async function() {
  if (!currentUser||!myProfile) return;
  const text=document.getElementById('composeText').value.trim();
  if (!text&&!composeFileData) return;
  const btn=document.getElementById('postBtnTxt').parentElement;
  btn.disabled=true;
  document.getElementById('postBtnTxt').textContent='กำลังโพสต์...';

  let imageUrl='';
  // Upload image via Discord webhook → get attachment URL
  if (composeFileData) {
    try {
      const fd=new FormData();
      fd.append('file',composeFileData,composeFileData.name);
      fd.append('payload_json',JSON.stringify({content:'📸 รูปจากโพสต์'}));
      const res=await fetch(WEBHOOK_PHOTO,{method:'POST',body:fd});
      const data=await res.json();
      imageUrl=data?.attachments?.[0]?.url||'';
    } catch(e){}
  }

  await addDoc(collection(db,'posts'),{
    text, imageUrl,
    uid: currentUser.uid,
    name: myProfile.name,
    isAnon: myProfile.isAnon||false,
    likes:[], reposts:[], commentCount:0,
    pinned:false,
    createdAt: serverTimestamp()
  });

  // Update post count
  await updateDoc(doc(db,'users',currentUser.uid),{postCount:increment(1)}).catch(()=>{});

  closeCompose();
  showToast('โพสต์แล้ว ✨');
  btn.disabled=false;
  document.getElementById('postBtnTxt').textContent='โพสต์';
};

// ════════════════════════════════════════
// COMMENTS
// ════════════════════════════════════════
window.openCmt = function(postId) {
  currentCmtPostId=postId;
  updateMyAvUI();
  document.getElementById('cmtModal').classList.add('open');
  document.getElementById('cmtOverlay').classList.add('open');
  document.getElementById('cmtList').innerHTML='<div class="loading-wrap"><div class="spin"></div></div>';

  if (cmtUnsub) cmtUnsub();
  const q=query(collection(db,'posts',postId,'comments'),orderBy('createdAt','asc'));
  cmtUnsub=onSnapshot(q,snap=>{
    const cmts=snap.docs.map(d=>({id:d.id,...d.data()}));
    renderCmts(cmts);
  });
};
window.closeCmt = function() {
  document.getElementById('cmtModal').classList.remove('open');
  document.getElementById('cmtOverlay').classList.remove('open');
  if (cmtUnsub) { cmtUnsub(); cmtUnsub=null; }
  currentCmtPostId=null;
};

function renderCmts(cmts) {
  const list=document.getElementById('cmtList');
  if (!cmts.length) { list.innerHTML='<div class="empty-state"><p>ยังไม่มีคอมเมนต์</p></div>'; return; }
  list.innerHTML=cmts.map(c=>`
    <div class="cmt-item">
      ${avHtml(c.isAnon?'?':c.name,'av-sm cmt-av')}
      <div class="cmt-bubble">
        <div class="cmt-name">${c.isAnon?'ไม่ระบุตัวตน':esc(c.name)}</div>
        <div class="cmt-text">${esc(c.text)}</div>
        <div class="cmt-time">${timeAgo(c.createdAt)}</div>
      </div>
    </div>`).join('');
  list.scrollTop=list.scrollHeight;
}

window.submitCmt = async function() {
  if (!currentUser||!currentCmtPostId) return;
  const input=document.getElementById('cmtInput');
  const text=input.value.trim(); if(!text) return;
  input.valu
