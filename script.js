const menu = document.getElementById("menu");

function toggleMenu(){
  if(menu.style.right === "0px"){
    menu.style.right = "-220px";
  }else{
    menu.style.right = "0px";
  }
}

/* 🎵 music */
const audio = document.getElementById("audio");
const disc = document.getElementById("disc");
const icon = document.getElementById("icon");
const progress = document.getElementById("progress");

let isPlaying = false;

function togglePlay(){
  if(isPlaying){
    audio.pause();
    disc.style.animationPlayState = "paused";
    icon.textContent = "▶";
  }else{
    audio.play();
    disc.style.animationPlayState = "running";
    icon.textContent = "||";
  }
  isPlaying = !isPlaying;
}

audio.addEventListener("timeupdate", ()=>{
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

progress.addEventListener("input", ()=>{
  audio.currentTime = (progress.value / 100) * audio.duration;
});

function next(){
  alert("ใส่ playlist ก่อน 😏");
}

function prev(){
  alert("ยังไม่มีเพลงก่อนหน้า");
}
