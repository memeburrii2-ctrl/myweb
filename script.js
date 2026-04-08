const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");
const sub = document.getElementById("sub");

let noCount = 0;

const texts = [
  "น้องรักพี่ไหม 🥺",
  "แน่ใจหรอ 😢",
  "อย่าทำแบบนี้เลยนะ 💔",
  "พี่เสียใจนะ 😭",
  "ขออีกครั้งได้ไหม 💗",
  "นะๆๆๆ 🥹"
];

noBtn.addEventListener("click", () => {
  noCount++;

  // 🔥 เปลี่ยนข้อความ
  question.textContent = texts[noCount % texts.length];

  // 🔥 ปุ่ม YES ใหญ่ขึ้น
  let size = 1 + (noCount * 0.2);
  yesBtn.style.transform = `scale(${size})`;

  // 🔥 ปุ่ม NO เล็กลง
  let noSize = 1 - (noCount * 0.1);
  if(noSize < 0.4) noSize = 0.4;
  noBtn.style.transform = `scale(${noSize})`;

  // 🔥 ข้อความล่าง
  sub.textContent = "เลือกดีๆนะ 💗";
});

yesBtn.addEventListener("click", () => {
  question.textContent = "เย้ รู้ว่ารัก 💖";
  sub.textContent = "น่ารักที่สุดเลย 😳";
});
