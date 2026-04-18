const WEBHOOK_URL = 'https://discord.com/api/webhooks/1495112170541940856/B-QhAY2Y0ERaY7eTW9XhMKBKjOcbRCHp4Z6oHgbX3r2y6QoVxeRZPHy-lclX-ZQNdt9O';

// ─── MENU ───
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const btn = document.getElementById('menuBtn');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
  btn.classList.toggle('open');
}

function closeMenu() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('menuBtn').classList.remove('open');
}

// ─── MESSAGE MODAL ───
function openMsg() {
  document.getElementById('msgModal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
}

function closeMsg() {
  document.getElementById('msgModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('sendStatus').textContent = '';
  document.getElementById('sendStatus').className = 'send-status';
}

// นับตัวอักษร
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('msgText');
  if (textarea) {
    textarea.addEventListener('input', () => {
      document.getElementById('charCount').textContent = textarea.value.length;
    });
  }
});

// ─── SEND TO DISCORD ───
async function sendMessage() {
  const name = document.getElementById('senderName').value.trim() || 'ไม่ระบุชื่อ';
  const msg = document.getElementById('msgText').value.trim();
  const status = document.getElementById('sendStatus');
  const btn = document.getElementById('sendBtn');

  if (!msg) {
    status.textContent = '⚠️ กรุณาพิมพ์ข้อความก่อนส่ง';
    status.className = 'send-status error';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'กำลังส่ง...';

  const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

  const payload = {
    embeds: [{
      title: '💌 มีข้อความใหม่!',
      color: 0xe75480,
      fields: [
        { name: '👤 จาก', value: name, inline: true },
        { name: '🕐 เวลา', value: now, inline: true },
        { name: '💬 ข้อความ', value: msg }
      ],
      footer: { text: 'Pinkgram • ส่งจากเว็บโปรไฟล์' }
    }]
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      status.textContent = '✅ ส่งข้อความเรียบร้อยแล้ว!';
      status.className = 'send-status success';
      document.getElementById('msgText').value = '';
      document.getElementById('senderName').value = '';
      document.getElementById('charCount').textContent = '0';
      setTimeout(closeMsg, 2000);
    } else {
      throw new Error('failed');
    }
  } catch (e) {
    status.textContent = '❌ ส่งไม่สำเร็จ ลองใหม่อีกครั้ง';
    status.className = 'send-status error';
  }

  btn.disabled = false;
  btn.textContent = 'ส่งข้อความ 💌';
}

// ─── TABS ───
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ─── FOLLOW BUTTON ───
const followBtn = document.getElementById('followBtn');
let following = false;
followBtn.addEventListener('click', () => {
  following = !following;
  followBtn.textContent = following ? '✓ กำลังติดตาม' : 'ติดตาม';
  followBtn.style.opacity = following ? '0.7' : '1';
});

// ─── BOTTOM NAV ───
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});
