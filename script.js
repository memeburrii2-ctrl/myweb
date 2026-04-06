const audio = document.getElementById("audio");
const progress = document.getElementById("progress");

function playSong() {
  audio.play();
}

function pauseSong() {
  audio.pause();
}

function prevSong() {
  audio.currentTime = 0;
}

function nextSong() {
  audio.currentTime = audio.duration;
}

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});
