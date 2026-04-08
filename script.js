window.onload = () => {

  let noCount = 0;

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const text = document.getElementById("text");
  const question = document.getElementById("question");

  const messages = [
    "ลองคิดอีกทีนะ 🥺",
    "พี่เสียใจนะ 😢",
    "ไม่รักจริงหรอ...",
    "ใจร้ายจังเลย 😭",
    "รักพี่หน่อยนะ 💔",
    "งั้นพี่รักน้องก็ได้ 🥹"
  ];

  yesBtn.onclick = () => {
    question.innerText = "พี่ก็รักน้องนะ 💖";
    text.innerText = "น่ารักที่สุดเลย";

    yesBtn.style.display = "none";
    noBtn.style.display = "none";

    createHearts();
  };

  noBtn.onclick = () => {
    noCount++;

    text.innerText = messages[Math.min(noCount-1, messages.length-1)];

    // ขยายปุ่มรัก
    yesBtn.style.transform = `scale(${1 + noCount * 0.2})`;

    // ปุ่มไม่จาง
    noBtn.style.opacity = 0.6 - (noCount * 0.1);

    // ขยับหนี
    noBtn.style.transform =
      `translate(${Math.random()*150-75}px, ${Math.random()*80-40}px)`;
  };

  // 🦋
  const container = document.querySelector(".butterflies");

  function createButterfly(){
    const b = document.createElement("div");
    b.classList.add("butterfly");

    b.style.left = Math.random()*100 + "vw";
    b.style.animationDuration = (5 + Math.random()*5) + "s";

    container.appendChild(b);

    setTimeout(()=>b.remove(),10000);
  }

  setInterval(createButterfly, 800);

  // 💖
  function createHearts(){
    for(let i=0;i<20;i++){
      const h = document.createElement("div");
      h.innerText="💖";
      h.style.position="fixed";
      h.style.left=Math.random()*100+"vw";
      h.style.top="100vh";
      h.style.fontSize="20px";

      document.body.appendChild(h);

      h.animate([
        {transform:"translateY(0)",opacity:1},
        {transform:"translateY(-120vh)",opacity:0}
      ],{duration:3000});

      setTimeout(()=>h.remove(),3000);
    }
  }

};
