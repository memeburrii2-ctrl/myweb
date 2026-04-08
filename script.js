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

function play(){
  audio.play();
}

function pause(){
  audio.pause();
}

function next(){
  alert("ใส่หลายเพลงก่อน 😏");
}

function prev(){
  alert("ยังไม่มีเพลงก่อนหน้า");
}
