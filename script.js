const WEBHOOK = 'https://discord.com/api/webhooks/1495112170541940856/B-QhAY2Y0ERaY7eTW9XhMKBKjOcbRCHp4Z6oHgbX3r2y6QoVxeRZPHy-lclX-ZQNdt9O';

// ── PAGES ──
let history = ['page-home'];

function goPage(id) {
  document.querySelector('.page.active')?.classList.remove('active');
  document.getElementById(id).classList.add('active');
  if (history[history.length - 1] !== id) history.push(id);
  window.scrollTo(0, 0);
}

function goBack() {
  if (history.length > 1) history.pop();
  goPage(history[history.length - 1]);
}

// ── MENU ──
function toggleMenu() {
  ['sidebar','overlay','menuBtn'].forEach(id => document.getElementById(id)?.classList.toggle('open'));
}
function closeMenu() {
  ['sidebar','overlay','menuBtn'].forEach(id => document.getElementById(id)?.classList.remove('open'));
}

// ── MODAL ──
function openMsg() {
  document.getElementById('msgModal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
  // reset to form view
  document.getElementById('formView').style.display = '';
  document.getElementById('successView').classList.add('hidden');
  document.getElementById('sendBtnText').textContent = 'ส่งข้อความ 💌';
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

document.getElementById('msgText').addEventListener('input', function () {
  document.getElementById('charCount').textContent = this.value.length;
});

// ── SEND ──
async function sendMessage() {
  const name = document.getElementById('senderName').value.trim() || 'ไม่ระบุชื่อ';
  const msg  = document.getElementById('msgText').value.trim();
  const btn  = document.getElementById('sendBtn');
  const txt  = document.getElementById('sendBtnText');

  if (!msg) {
    const ta = document.getElementById('msgText');
    ta.style.borderColor = '#e75480';
    ta.placeholder = '⚠️ กรุณาพิมพ์ข้อความก่อนนะคะ...';
    setTimeout(() => { ta.style.borderColor = ''; ta.placeholder = 'พิมพ์ข้อความที่นี่...'; }, 2000);
    return;
  }

  btn.disabled = true;
  txt.innerHTML = '<span class="spinner"></span>กำลังส่ง...';

  const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

  try {
    const res = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '💌 มีข้อความใหม่เข้ามา!',
          color: 0xe75480,
          fields: [
            { name: '👤 จาก', value: name, inline: true },
            { name: '🕐 เวลา', value: now, inline: true },
            { name: '💬 ข้อความ', value: msg }
          ],
          footer: { text: 'Pinkgram • ส่งจากเว็บโปรไฟล์ 🌸' }
        }]
      })
    });

    if (res.ok) {
      // show success
      document.getElementById('formView').style.display = 'none';
      document.getElementById('successView').classList.remove('hidden');
      setTimeout(closeMsg, 3200);
    } else throw new Error();
  } catch {
    txt.textContent = '❌ ส่งไม่สำเร็จ ลองใหม่อีกครั้ง';
    btn.disabled = false;
    setTimeout(() => { txt.textContent = 'ส่งข้อความ 💌'; }, 2500);
  }
}

// ── TABS ──
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
  });
});

// ── BOTTOM NAV ──
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}
