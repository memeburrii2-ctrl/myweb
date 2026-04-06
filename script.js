let audio = document.getElementById("audio");
let progress = document.getElementById("progress");

let songs = ["song1.mp3","song2.mp3"];
let index = 0;

function play(){ audio.play(); }

function next(){
  index=(index+1)%songs.length;
  audio.src=songs[index];
  audio.play();
}

function prev(){
  index=(index-1+songs.length)%songs.length;
  audio.src=songs[index];
  audio.play();
}

audio.ontimeupdate=()=>{
  if(audio.duration){
    progress.value=(audio.currentTime/audio.duration)*100;
  }
}

progress.oninput=()=>{
  if(audio.duration){
    audio.currentTime=(progress.value/100)*audio.duration;
  }
}
