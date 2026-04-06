let audio = document.getElementById("audio");
let progress = document.getElementById("progress");

let songs = ["song1.mp3", "song2.mp3"];
let index = 0;

function play(){ audio.play(); }
function pause(){ audio.pause(); }

function next(){
  index = (index + 1) % songs.length;
  audio.src = songs[index];
  audio.play();
}

function prev(){
  index = (index - 1 + songs.length) % songs.length;
  audio.src = songs[index];
  audio.play();
}

function toggleLoop(){
  audio.loop = !audio.loop;
  alert(audio.loop ? "Loop ON" : "Loop OFF");
}

audio.ontimeupdate = ()=>{
  progress.value = (audio.currentTime / audio.duration) * 100;
};

progress.oninput = ()=>{
  audio.currentTime = (progress.value / 100) * audio.duration;
};
