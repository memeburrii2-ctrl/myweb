window.onload = () => {

  let noCount = 0;

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const text = document.getElementById("text");
  const question = document.getElementById("question");

  const messages = [
    "ลองคิดดีๆ 🥺",
    "ไม่จริงป่ะ 😭",
    "ตอบใหม่ได้มั้ย...",
    "กูเสียใจนะ 😢",
    "ใจร้ายว่ะ 🥹",
    "รักเถอะนะ 😭💖"
  ];

  // 👉 YES
  yesBtn.onclick = () => {
    question.innerText = "รู้อยู่แล้ว 💖";
    text.innerText = "รักเหมือนกันนะ";

    yesBtn.style.display = "none";
    noBtn.style.display = "none";

    createHearts();
  };

  // 👉 NO
  noBtn.onclick = () => {
    noCount++;

    text.innerText = messages[Math.min(noCount-1, messages.length-1)];

    // yes ใหญ่ขึ้น
    let yesSize = 18 + (noCount * 6);
    yesBtn.style.fontSize = yesSize + "px";

    // no เล็กลง
    let noSize = 18 - (noCount * 2);
    if(noSize < 10) noSize = 10;
    noBtn.style.fontSize = noSize + "px";

    // หนี
    noBtn.style.transform =
      `translate(${Math.random()*120-60}px, ${Math.random()*60-30}px)`;
  };

  // 🦋 butterflies
  const container = document.querySelector(".butterflies");

  function createButterfly(){
    const b = document.createElement("div");
    b.classList.add("butterfly");

    b.style.left = Math.random() * 100 + "vw";

    const duration = 6 + Math.random() * 5;
    b.style.animationDuration = duration + "s";

    container.appendChild(b);

    setTimeout(()=> b.remove(), duration * 1000);
  }

  setInterval(createButterfly, 700);


  // 💖 hearts effect
  function createHearts(){
    for(let i=0;i<20;i++){
      const h = document.createElement("div");
      h.innerText = "💖";
      h.style.position = "fixed";
      h.style.left = Math.random()*100+"vw";
      h.style.top = "100vh";
      h.style.fontSize = "20px";
      h.style.zIndex = "999";

      document.body.appendChild(h);

      let duration = 3 + Math.random()*2;

      h.animate([
        {transform:"translateY(0)", opacity:1},
        {transform:"translateY(-120vh)", opacity:0}
      ],{
        duration:duration*1000
      });

      setTimeout(()=>h.remove(), duration*1000);
    }
  }

};
