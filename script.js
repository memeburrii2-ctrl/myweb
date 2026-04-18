const WEBHOOK_URL = 'https://discord.com/api/webhooks/1495112170541940856/B-QhAY2Y0ERaY7eTW9XhMKBKjOcbRCHp4Z6oHgbX3r2y6QoVxeRZPHy-lclX-ZQNdt9O';

// ─── PAGE NAVIGATION ───
let prevPage = 'page-home';

function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  prevPage = document.querySelector('.page.active')?.id || 'page-home';
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goBack() {
  goPage(prevPage);
}

// ─── MENU ───
function toggleMenu() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
  document.getElementById('menuBtn').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('open');
  document.getElementById('menuBtn')?.classList.remove('open');
}

// ─── MESSAGE MODAL ───
function openMsg() {
  document.getElementById('msgModal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('successScreen').classList.remove('show');
  document.querySelector('.modal-header').style.display = '';
  document.querySelector('.modal-body').style.display = '';
}

function closeMsg() {
  document.getElementById('msgModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  // reset
  setTimeout(() => {
    document.getElementById('msgText').value = '';
    document.getElementById('senderName').value = '';
    document.getElementById('charCount').textContent = '0';
    document.getElementById('sendBtnText').textContent = 'ส่งข้อความ 💌';
    document.getElementById('sendBtn').disabled = false;
    document.getElementById('successScreen').classList.remove('show');
    document.querySelector('.modal-header').style.display = '';
    document.querySelector('.modal-body').style.display = '';
  }, 400);
}

document.getElementById('msgText').addEventListener('input', function () {
  document.getElementById('charCount').textContent = this.value.length;
});

// ─── SEND TO DISCORD ───
async function sendMessage() {
  const name = document.getElementById('senderName').value.trim() || 'ไม่ระบุชื่อ';
  const msg = document.getElementById('msgText').value.trim();
  const btn = document.getElementById('sendBtn');
  const btnText = document.getElementById('sendBtnText');

  if (!msg) {
    document.getElementById('msgText').style.borderColor = '#e75480';
    document.getElementById('msgText').placeholder = '⚠️ กรุณาพิมพ์ข้อความก่อน...';
    setTimeout(() => {
      document.getElementById('msgText').style.borderColor = '';
      document.getElementById('msgText').placeholder = 'พิมพ์ข้อความที่นี่...';
    }, 2000);
    return;
  }

  // Loading state
  btn.disabled = true;
  btnText.innerHTML = '<span class="btn-spinner"></span>กำลังส่ง...';

  const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

  const payload = {
    embeds: [{
      title: '💌 มีข้อความใหม่เข้ามา!',
      color: 0xe75480,
      fields: [
        { name: '👤 จาก', value: name, inline: true },
        { name: '🕐 เวลา', value: now, inline: true },
        { name: '💬 ข้อความ', value: msg }
      ],
      footer: { text: 'Pinkgram • ส่งจากเว็บโปรไฟล์ 🌸' },
      thumbnail: { url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/72x72/1f338.png' }
    }]
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      // Hide form, show success
      document.querySelector('.modal-header').style.display = 'none';
      document.querySelector('.modal-body').style.display = 'none';
      document.getElementById('successScreen').classList.add('show');
      setTimeout(closeMsg, 3000);
    } else {
      throw new Error();
    }
  } catch {
    btnText.textContent = '❌ ส่งไม่สำเร็จ ลองใหม่';
    btn.disabled = false;
    setTimeout(() => { btnText.textContent = 'ส่งข้อความ 💌'; }, 2500);
  }
}

// ─── TABS ───
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ─── BOTTOM NAV ───
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}
