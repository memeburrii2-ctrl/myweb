const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for(let i=0;i<80;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    size:Math.random()*2,
    speedY:Math.random()*0.5 + 0.2
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="white";

  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();

    p.y += p.speedY;

    if(p.y > canvas.height){
      p.y = 0;
      p.x = Math.random()*canvas.width;
    }
  });

  requestAnimationFrame(draw);
}

draw();
