let audio = document.getElementById("audio");
let progress = document.getElementById("progress");

let songs = ["song1.mp3","song2.mp3"];
let index = 0;

function play(){ audio.play(); }
function pause(){ audio.pause(); }

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
  progress.value=(audio.currentTime/audio.duration)*100;
}

progress.oninput=()=>{
  audio.currentTime=(progress.value/100)*audio.duration;
}

/* scroll animation */
let elements=document.querySelectorAll(".fade");

function show(){
  elements.forEach(el=>{
    let top=el.getBoundingClientRect().top;
    if(top<window.innerHeight-50){
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll",show);
show();
