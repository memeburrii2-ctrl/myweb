// ================= script.js =================

const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");

let isPlaying = false;

function togglePlay(){
  if(!isPlaying){
    audio.play();
    playBtn.innerHTML = "❚❚";
  }else{
    audio.pause();
    playBtn.innerHTML = "▶";
  }
  isPlaying = !isPlaying;
}

function prevSong(){
  audio.currentTime = 0;
}

function nextSong(){
  audio.currentTime = audio.duration;
}

audio.addEventListener("timeupdate", ()=>{
  if(audio.duration){
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress.addEventListener("input", ()=>{
  if(audio.duration){
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});
