// ================= script.js =================

let noCount = 0;

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const text = document.getElementById("text");
const question = document.getElementById("question");

const messages = [
  "เอ้าาา ลองคิดดีๆ 🥺",
  "ไม่จริงป่ะ 😭",
  "ตอบใหม่ได้มั้ย...",
  "กูเสียใจนะ 😢",
  "งั้นกูรักมึงฝ่ายเดียวก็ได้ 💔",
  "ใจร้ายว่ะ 🥹",
  "ตอบว่ารักเถอะนะ 😭💖"
];

function no(){
  noCount++;

  // อ้อน
  text.innerText = messages[Math.min(noCount-1, messages.length-1)];

  // ทำให้ปุ่ม YES ใหญ่ขึ้น
  let yesSize = 18 + (noCount * 5);
  yesBtn.style.fontSize = yesSize + "px";

  // ทำให้ปุ่ม NO เล็กลง
  let noSize = 18 - (noCount * 2);
  if(noSize < 10) noSize = 10;
  noBtn.style.fontSize = noSize + "px";

  // ขยับปุ่ม NO หนี
  noBtn.style.transform = `translate(${Math.random()*100-50}px, ${Math.random()*50-25}px)`;
}

function yes(){
  question.innerText = "รู้อยู่แล้ว 😳💖";
  text.innerText = "รักมึงเหมือนกัน";
  
  yesBtn.style.display = "none";
  noBtn.style.display = "none";
}
