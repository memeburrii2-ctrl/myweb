const audio = document.getElementById("audio");
const progress = document.getElementById("progress");

function playSong(){
  if(audio) audio.play();
}

function pauseSong(){
  if(audio) audio.pause();
}

/* progress */
if(audio && progress){

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

}
