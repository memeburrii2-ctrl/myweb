// ════════════════════════════════════════
//  WEBHOOKS — แยก 2 ห้อง
// ════════════════════════════════════════
const WEBHOOK_MSG   = 'https://discord.com/api/webhooks/1495112170541940856/B-QhAY2Y0ERaY7eTW9XhMKBKjOcbRCHp4Z6oHgbX3r2y6QoVxeRZPHy-lclX-ZQNdt9O';
const WEBHOOK_PHOTO = 'https://discord.com/api/webhooks/1495252264233861130/OKUCCeg9f0z6buFGtyW3bVK73tSFSXTGTD1iiXHFqyfu-SM6-92i9wSnW2egMgJ6KyRr';

// ════════════════════════════════════════
//  AGE COUNTER — เกิด 15/09/2549
// ════════════════════════════════════════
const BIRTH = new Date('2006-09-15T00:00:00+07:00');

function updateAge() {
  const diff = (Date.now() - BIRTH) / (365.25 * 24 * 3600 * 1000);
  const str  = diff.toFixed(1);
  const el1  = document.getElementById('ageCounter');
  const el2  = document.getElementById('aboutAge');
  const el3  = document.getElementById('aboutAgeInline');
  if (el1) el1.textContent = str;
  if (el2) el2.textContent = str;
  if (el3) el3.textContent = str;
}
updateAge();
setInterval(updateAge, 100);

// ════════════════════════════════════════
//  FOLLOWER COUNT — บันทึก localStorage
// ════════════════════════════════════════
let followers = parseInt(localStorage.getItem('followers') || '0', 10);
let isFollowing = localStorage.getItem('isFollowing') === 'true';

function renderFollowers() {
  const n = followers;
  const fmt = n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toString();
  document.querySelectorAll('#followerNum, #sbFollowNum').forEach(el => {
    if (el) el.textContent = fmt;
  });
  const btn = document.getElementById('followBtn');
  if (btn) {
    if (isFollowing) {
      btn.textContent = 'ติดตามแล้ว';
      btn.classList.add('following');
    } else {
      btn.textContent = 'ติดตาม';
      btn.classList.remove('following');
    }
  }
}

function handleFollow() {
  if (isFollowing) {
    isFollowing = false;
    followers = Math.max(0, followers - 1);
  } else {
    isFollowing = true;
    followers += 1;
  }
  localStorage.setItem('isFollowing', isFollowing);
  localStorage.setItem('followers', followers);
  renderFollowers();
}

renderFollowers();

// ════════════════════════════════════════
//  MUSIC PLAYER
//  ── เพิ่มเพลงได้ที่ TRACKS ──
// ════════════════════════════════════════
const TRACKS = [
  { title: 'แพ้ใจ', artist: 'เสก โลโซ', src: 'แพ้ใจ เสก โลโซ.mp3' },
  { title: 'ชื่อเพลงที่สอง', artist: 'ศิลปินที่สอง', src: 'เพลงที่สอง.mp3' }
];
let curTrack = 0, isPlaying = false;
const audio = document.getElementById('audioPlayer');

function renderPlaylist() {
  const pl = document.getElementById('playlist');
  if (!pl) return;
  if (!TRACKS.length) {
    pl.innerHTML = '<div style="text-align:center;color:var(--muted);padding:20px;font-size:.82rem">เพิ่มเพลงได้ที่ script.js → TRACKS</div>';
    return;
  }
  pl.innerHTML = TRACKS.map((t, i) => `
    <div class="track-item ${i === curTrack ? 'active' : ''}" onclick="loadTrack(${i}, true)">
      <span class="track-num">${i === curTrack && isPlaying ? '▶' : i + 1}</span>
      <div class="track-info">
        <div class="track-name">${t.title}</div>
        <div class="track-art">${t.artist}</div>
      </div>
    </div>`).join('');
}

function loadTrack(i, autoplay = false) {
  if (!TRACKS.length) return;
  curTrack = i;
  const t = TRACKS[i];
  document.getElementById('musicTitle').textContent  = t.title;
  document.getElementById('musicArtist').textContent = t.artist;
  audio.src = t.src;
  if (autoplay) { audio.play(); isPlaying = true; updatePlayBtn(); }
  renderPlaylist();
}

function togglePlay() {
  if (!TRACKS.length) return;
  if (!audio.src || audio.src === window.location.href) { loadTrack(0, true); return; }
  isPlaying ? audio.pause() : audio.play();
  isPlaying = !isPlaying;
  updatePlayBtn();
}

function updatePlayBtn() {
  document.getElementById('playIcon').style.display  = isPlaying ? 'none' : 'block';
  document.getElementById('pauseIcon').style.display = isPlaying ? 'block' : 'none';
  document.getElementById('musicDisc')?.classList.toggle('playing', isPlaying);
}

function nextTrack() { if (TRACKS.length) loadTrack((curTrack + 1) % TRACKS.length, isPlaying); }
function prevTrack() { if (TRACKS.length) loadTrack((curTrack - 1 + TRACKS.length) % TRACKS.length, isPlaying); }

audio?.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('timeCur').textContent = fmt(audio.currentTime);
  document.getElementById('timeTot').textContent = fmt(audio.duration);
});
audio?.addEventListener('ended', nextTrack);

document.getElementById('progressBar')?.addEventListener('click', function (e) {
  if (!audio.duration) return;
  const r = this.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

function fmt(s) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
renderPlaylist();

// ════════════════════════════════════════
//  PAGES
// ════════════════════════════════════════
let pageHist = ['page-home'];

function goPage(id) {
  document.querySelector('.page.active')?.classList.remove('active');
  document.getElementById(id)?.classList.add('active');
  if (pageHist[pageHist.length - 1] !== id) pageHist.push(id);
  window.scrollTo(0, 0);
  if (id === 'page-music') renderPlaylist();
}
function goBack() {
  if (pageHist.length > 1) pageHist.pop();
  goPage(pageHist[pageHist.length - 1]);
}

// ════════════════════════════════════════
//  MENU
// ════════════════════════════════════════
function toggleMenu() {
  ['sidebar', 'overlay', 'menuBtn'].forEach(id => document.getElementById(id)?.classList.toggle('open'));
}
function closeMenu() {
  ['sidebar', 'overlay', 'menuBtn'].forEach(id => document.getElementById(id)?.classList.remove('open'));
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

document.getElementById('msgText')?.addEventListener('input', function () {
  document.getElementById('charCount').textContent = this.value.length;
});

async function sendMessage() {
  const name = document.getElementById('senderName').value.trim() || 'ไม่ระบุชื่อ';
  const msg  = document.getElementById('msgText').value.trim();
  const btn  = document.getElementById('sendBtn');
  const txt  = document.getElementById('sendBtnText');
  if (!msg) {
    document.getElementById('msgText').style.borderColor = 'var(--accent)';
    setTimeout(() => document.getElementById('msgText').style.borderColor = '', 2000);
    return;
  }
  btn.disabled = true;
  txt.innerHTML = '<span class="spinner"></span>กำลังส่ง...';
  const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  try {
    const res = await fetch(WEBHOOK_MSG, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{ title: '📩 ข้อความใหม่!', color: 0x7c5cbf,
          fields: [{ name: 'จาก', value: name, inline: true }, { name: 'เวลา', value: now, inline: true }, { name: 'ข้อความ', value: msg }],
          footer: { text: 'ipxngsxk.github.io/myweb' } }]
      })
    });
    if (res.ok) {
      document.getElementById('formView').style.display = 'none';
      document.getElementById('successView').classList.remove('hidden');
      setTimeout(closeMsg, 3000);
    } else throw new Error();
  } catch {
    txt.textContent = 'ส่งไม่สำเร็จ';
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
  const file = e.target.files[0]; if (!file) return;
  selectedFile = file;
  document.getElementById('fileLabelText').textContent = file.name;
  const reader = new FileReader();
  reader.onload = ev => {
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
    const fd = new FormData();
    fd.append('file', selectedFile, selectedFile.name);
    fd.append('payload_json', JSON.stringify({
      embeds: [{ title: '🖼️ รูปใหม่เข้ามา!', color: 0x4ecdc4,
        fields: [{ name: 'จาก', value: name, inline: true }, { name: 'เวลา', value: now, inline: true }, { name: 'คำบรรยาย', value: caption }],
        image: { url: `attachment://${selectedFile.name}` },
        footer: { text: 'ipxngsxk.github.io/myweb' } }]
    }));
    const res = await fetch(WEBHOOK_PHOTO, { method: 'POST', body: fd });
    if (res.ok) {
      document.getElementById('photoFormView').style.display = 'none';
      document.getElementById('photoSuccessView').classList.remove('hidden');
      setTimeout(closePhoto, 3000);
    } else throw new Error();
  } catch {
    txt.textContent = 'ส่งไม่สำเร็จ';
    btn.disabled = false;
    setTimeout(() => txt.textContent = 'ส่งรูป', 2500);
  }
}

// ════════════════════════════════════════
//  TABS / NAV
// ════════════════════════════════════════
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
  });
});
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}
