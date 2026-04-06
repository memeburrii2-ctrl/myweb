const audio = document.getElementById("audio");
const progress = document.getElementById("progress");

/* player */
function playSong(){ audio.play(); }
function pauseSong(){ audio.pause(); }
function prevSong(){ audio.currentTime = 0; }
function nextSong(){ audio.currentTime = audio.duration; }

/* progress */
audio.addEventListener("timeupdate", ()=>{
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", ()=>{
  audio.currentTime = (progress.value / 100) * audio.duration;
});

/* scroll animation */
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", ()=>{
  reveals.forEach(el=>{
    let top = el.getBoundingClientRect().top;
    if(top < window.innerHeight - 100){
      el.classList.add("active");
    }
  });
});
