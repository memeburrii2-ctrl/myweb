let noCount = 0;

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const text = document.getElementById("text");

const messages = [
  "ลองคิดดีๆ 🥺",
  "ไม่จริงป่ะ 😭",
  "ตอบใหม่ได้มั้ย...",
  "กูเสียใจนะ 😢",
  "งั้นกูรักมึงฝ่ายเดียวก็ได้ 💔",
  "ใจร้ายว่ะ 🥹",
  "รักเถอะนะ 😭💖"
];

function no(){
  noCount++;

  text.innerText = messages[Math.min(noCount-1, messages.length-1)];

  // yes ใหญ่ขึ้น
  let yesSize = 18 + (noCount * 5);
  yesBtn.style.fontSize = yesSize + "px";

  // no เล็กลง
  let noSize = 18 - (noCount * 2);
  if(noSize < 10) noSize = 10;
  noBtn.style.fontSize = noSize + "px";

  // ขยับหนี
  noBtn.style.transform =
    `translate(${Math.random()*100-50}px, ${Math.random()*50-25}px)`;
}

function yes(){
  document.getElementById("question").innerText = "รู้อยู่แล้ว 💖";
  text.innerText = "รักเหมือนกันนะ";
  yesBtn.style.display = "none";
  noBtn.style.display = "none";
}

/* 🦋 butterfly system */
const container = document.querySelector(".butterflies");

function createButterfly(){
  const b = document.createElement("div");
  b.classList.add("butterfly");

  b.style.left = Math.random() * 100 + "vw";

  const duration = 6 + Math.random() * 5;
  b.style.animationDuration = duration + "s";

  const size = 10 + Math.random() * 10;
  b.style.width = size + "px";
  b.style.height = size + "px";

  container.appendChild(b);

  setTimeout(()=> b.remove(), duration * 1000);
}

setInterval(createButterfly, 700);
