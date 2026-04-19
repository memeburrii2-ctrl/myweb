// ════════════════════════════════════════
//  WEBHOOKS (แยก รูป vs ข้อความ)
// ════════════════════════════════════════
const WEBHOOK_MSG   = 'https://discord.com/api/webhooks/1495112170541940856/B-QhAY2Y0ERaY7eTW9XhMKBKjOcbRCHp4Z6oHgbX3r2y6QoVxeRZPHy-lclX-ZQNdt9O';
const WEBHOOK_PHOTO = 'https://discord.com/api/webhooks/1495252264233861130/OKUCCeg9f0z6buFGtyW3bVK73tSFSXTGTD1iiXHFqyfu-SM6-92i9wSnW2egMgJ6KyRr';

// ════════════════════════════════════════
//  AGE COUNTER - เกิด 15/09/2006
// ════════════════════════════════════════
const BIRTH = new Date('2006-09-15T00:00:00+07:00');

function updateAge() {
  const diffMs = Date.now() - BIRTH.getTime();
  const years  = diffMs / (365.25 * 24 * 3600 * 1000);
  const el = document.getElementById('ageCounter');
  if (el) el.textContent = years.toFixed(1);
}
updateAge();
setInterval(updateAge, 500);

// ════════════════════════════════════════
//  FOLLOW BUTTON (เก็บสถานะ + นับจำนวน)
// ════════════════════════════════════════
const BASE_FOLLOWERS = 0;
let followCount  = parseInt(localStorage.getItem('followCount') ?? BASE_FOLLOWERS);
let isFollowed   = localStorage.getItem('isFollowed') === 'true';

// ถ้ายังไม่เคยตั้งค่า ให้ใช้ BASE_FOLLOWERS
if (localStorage.getItem('followCount') === null) followCount = BASE_FOLLOWERS;

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

function renderFollowState() {
  const btn = document.getElementById('followBtn');
  const cnt = document.getElementById('followerCount');
  if (!btn || !cnt) return;
  cnt.textContent = formatCount(followCount);
  if (isFollowed) {
    btn.textContent = 'ติดตามแล้ว ✓';
    btn.classList.add('followed');
  } else {
    btn.textContent = 'ติดตาม';
    btn.classList.remove('followed');
  }
}

function handleFollow() {
  if (!isFollowed) {
    isFollowed = true;
    followCount += 1;
  } else {
    isFollowed = false;
    followCount -= 1;
  }
  localStorage.setItem('isFollowed', isFollowed);
  localStorage.setItem('followCount', followCount);
  renderFollowState();

  // ripple animation on stat
  const cnt = document.getElementById('followerCount');
  cnt?.animate([{transform:'scale(1.4)',color:'#4ecdc4'},{transform:'scale(1)',color:''}], {duration:400,easing:'ease-out'});
}

renderFollowState();

// ════════════════════════════════════════
//  SEND PICKER
// ════════════════════════════════════════
function openSendPicker() {
  document.getElementById('pickerSheet').classList.add('open');
  document.getElementById('pickerOverlay').classList.add('open');
}
function closeSendPicker() {
  document.getElementById('pickerSheet').classList.remove('open');
  document.getElementById('pickerOverlay').classList.remove('open');
}

// ════════════════════════════════════════
//  MUSIC PLAYER
// ════════════════════════════════════════
const TRACKS = [
  { title: 'แพ้ใจ', artist: 'เสก โลโซ', src: 'แพ้ใจ เสก โลโซ.mp3' },
];

let curTrack = 0;
let isPlaying = false;
const audio = document.getElementById('audioPlayer');

function renderPlaylist() {
  const pl = document.getElementById('playlist');
  if (!pl) return;
  if (TRACKS.length === 0) {
    pl.innerHTML = `<div style="text-align:center;color:var(--muted);padding:24px;font-size:.85rem">
      ยังไม่มีเพลง — เพิ่มเพลงได้ที่ script.js → TRACKS
    </div>`;
    return;
  }
  pl.innerHTML = TRACKS.map((t, i) => `
    <div class="track-item ${i===curTrack?'active':''}" onclick="loadTrack(${i},true)">
      <span class="track-num">${i===curTrack && isPlaying ? '▶' : i+1}</span>
      <div class="track-info">
        <div class="track-name">${t.title}</div>
        <div class="track-art">${t.artist}</div>
      </div>
    </div>
  `).join('');
}

function loadTrack(i, autoplay = false) {
  if (TRACKS.length === 0) return;
  curTrack = i;
  const t = TRACKS[i];
  document.getElementById('musicTitle').textContent = t.title;
  document.getElementById('musicArtist').textContent = t.artist;
  audio.src = t.src;
  if (autoplay) { audio.play(); isPlaying = true; updatePlayBtn(); }
  renderPlaylist();
}

function togglePlay() {
  if (TRACKS.length === 0) return;
  if (!audio.src || audio.src === window.location.href) { loadTrack(0, true); return; }
  if (isPlaying) { audio.pause(); isPlaying = false; }
  else { audio.play(); isPlaying = true; }
  updatePlayBtn();
}

function updatePlayBtn() {
  document.getElementById('playIcon').style.display  = isPlaying ? 'none' : 'block';
  document.getElementById('pauseIcon').style.display = isPlaying ? 'block' : 'none';
  document.getElementById('musicDisc')?.classList.toggle('playing', isPlaying);
}

function nextTrack() { if (TRACKS.length===0) return; loadTrack((curTrack+1)%TRACKS.length, isPlaying); }
function prevTrack() { if (TRACKS.length===0) return; loadTrack((curTrack-1+TRACKS.length)%TRACKS.length, isPlaying); }

audio?.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('timeCur').textContent = fmt(audio.currentTime);
  document.getElementById('timeTot').textContent = fmt(audio.duration);
});
audio?.addEventListener('ended', nextTrack);

function fmt(s) {
  const m = Math.floor(s/60), sec = Math.floor(s%60);
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

document.getElementById('progressFill')?.parentElement?.addEventListener('click', function(e) {
  if (!audio.duration) return;
  const rect = this.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
});

renderPlaylist();

// ════════════════════════════════════════
//  PAGES
// ════════════════════════════════════════
let pageHistory = ['page-home'];

function goPage(id) {
  document.querySelector('.page.active')?.classList.remove('active');
  document.getElementById(id)?.classList.add('active');
  if (pageHistory[pageHistory.length-1] !== id) pageHistory.push(id);
  window.scrollTo(0,0);
  if (id === 'page-music') renderPlaylist();
}
function goBack() {
  if (pageHistory.length > 1) pageHistory.pop();
  goPage(pageHistory[pageHistory.length-1]);
}

// ════════════════════════════════════════
//  MENU
// ════════════════════════════════════════
function toggleMenu() {
  ['sidebar','overlay','menuBtn'].forEach(id => document.getElementById(id)?.classList.toggle('open'));
}
function closeMenu() {
  ['sidebar','overlay','menuBtn'].forEach(id => document.getElementById(id)?.classList.remove('open'));
}

// ════════════════════════════════════════
//  MESSAGE MODAL
// ════════════════════════════════════════
function openMsg() {
  document.getElementById('msgModal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('formView').style.display = '';
  document.getElementById('successView').classList.add('hidden');
  document.getElementById('sendBtnText').textContent = 'ส่งข้อความ';
  document.getElementById('sendBtn').disabled = false;
}
function closeMsg() {
  document.getElementById('msgModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  setTimeout(() => {
    document.getElementById('senderName').value = '';
    document.getElementById('msgText').value = '';
    document.getElementById('charCount').textContent = '0';
    document.getElementById('successView').classList.add('hidden');
    document.getElementById('formView').style.display = '';
  }, 400);
}
document.getElementById('msgText')?.addEventListener('input', function() {
  document.getElementById('charCount').textContent = this.value.length;
});

async function sendMessage() {
  const name = document.getElementById('senderName').value.trim() || 'ไม่ระบุชื่อ';
  const msg  = document.getElementById('msgText').value.trim();
  const btn  = document.getElementById('sendBtn');
  const txt  = document.getElementById('sendBtnText');
  if (!msg) {
    const ta = document.getElementById('msgText');
    ta.style.borderColor = '#7c5cbf';
    setTimeout(() => ta.style.borderColor = '', 2000);
    return;
  }
  btn.disabled = true;
  txt.innerHTML = '<span class="spinner"></span>กำลังส่ง...';
  const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  try {
    const res = await fetch(WEBHOOK_MSG, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ embeds: [{ title: '📩 ข้อความใหม่!', color: 0x7c5cbf,
        fields: [{name:'จาก',value:name,inline:true},{name:'เวลา',value:now,inline:true},{name:'ข้อความ',value:msg}],
        footer:{text:'ipxngsxk website'} }] })
    });
    if (res.ok) {
      document.getElementById('formView').style.display = 'none';
      document.getElementById('successView').classList.remove('hidden');
      setTimeout(closeMsg, 3000);
    } else throw new Error();
  } catch {
    txt.textContent = 'ส่งไม่สำเร็จ ลองใหม่';
    btn.disabled = false;
    setTimeout(() => txt.textContent = 'ส่งข้อความ', 2500);
  }
}

// ════════════════════════════════════════
//  PHOTO MODAL
// ════════════════════════════════════════
let selectedFile = null;

function openPhoto() {
  document.getElementById('photoModal').classList.add('open');
  document.getElementById('photoOverlay').classList.add('open');
  document.getElementById('photoFormView').style.display = '';
  document.getElementById('photoSuccessView').classList.add('hidden');
  document.getElementById('photoSendTxt').textContent = 'ส่งรูป';
  document.getElementById('photoSendBtn').disabled = false;
  selectedFile = null;
  document.getElementById('photoPreviewWrap').style.display = 'none';
  document.getElementById('photoFile').value = '';
  document.getElementById('fileLabelText').textContent = 'แตะเพื่อเลือกรูป';
}
function closePhoto() {
  document.getElementById('photoModal').classList.remove('open');
  document.getElementById('photoOverlay').classList.remove('open');
  setTimeout(() => {
    document.getElementById('photoSender').value = '';
    document.getElementById('photoCaption').value = '';
    document.getElementById('photoSuccessView').classList.add('hidden');
    document.getElementById('photoFormView').style.display = '';
    selectedFile = null;
  }, 400);
}

function onFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile = file;
  document.getElementById('fileLabelText').textContent = file.name;
  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById('photoPreview').src = ev.target.result;
    document.getElementById('photoPreviewWrap').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

async function sendPhoto() {
  const name    = document.getElementById('photoSender').value.trim() || 'ไม่ระบุชื่อ';
  const caption = document.getElementById('photoCaption').value.trim() || 'ไม่มีคำบรรยาย';
  const btn     = document.getElementById('photoSendBtn');
  const txt     = document.getElementById('photoSendTxt');

  if (!selectedFile) {
    document.getElementById('fileLabel').style.borderColor = 'var(--accent)';
    setTimeout(() => document.getElementById('fileLabel').style.borderColor = '', 2000);
    return;
  }

  btn.disabled = true;
  txt.innerHTML = '<span class="spinner"></span>กำลังส่ง...';

  const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

  try {
    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    formData.append('payload_json', JSON.stringify({
      embeds: [{
        title: '🖼️ มีรูปใหม่เข้ามา!',
        color: 0x4ecdc4,
        fields: [
          { name: 'จาก', value: name, inline: true },
          { name: 'เวลา', value: now, inline: true },
          { name: 'คำบรรยาย', value: caption }
        ],
        image: { url: `attachment://${selectedFile.name}` },
        footer: { text: 'ipxngsxk website' }
      }]
    }));

    const res = await fetch(WEBHOOK_PHOTO, { method: 'POST', body: formData });
    if (res.ok) {
      document.getElementById('photoFormView').style.display = 'none';
      document.getElementById('photoSuccessView').classList.remove('hidden');
      setTimeout(closePhoto, 3000);
    } else throw new Error();
  } catch {
    txt.textContent = 'ส่งไม่สำเร็จ ลองใหม่';
    btn.disabled = false;
    setTimeout(() => txt.textContent = 'ส่งรูป', 2500);
  }
}

// ════════════════════════════════════════
//  NAV
// ════════════════════════════════════════
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
             }
