// ฟังก์ชันสำหรับสลับเพลง (Demo เท่านั้น)
const playlist = [
    { title: "Somebody Else", artist: "The 1975", art: "path/to/album_cover1.jpg" },
    { title: "Daylight", artist: "NIKI", art: "path/to/album_cover2.jpg" },
    { title: "Lo-Fi Nights", artist: "Chill Beats", art: "path/to/album_cover3.jpg" }
];

let currentTrackIndex = 0;
let isPlaying = false;

// UI Elements
const trackNameEl = document.getElementById('track-name');
const artistNameEl = document.getElementById('artist-name');
const albumArtEl = document.getElementById('album-art');
const playPauseBtnEl = document.getElementById('play-pause-btn');

function updatePlayer() {
    const track = playlist[currentTrackIndex];
    trackNameEl.textContent = track.title;
    artistNameEl.textContent = track.artist;
    albumArtEl.src = track.art;
}

// ควบคุมการเล่น/หยุด
playPauseBtnEl.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playPauseBtnEl.innerHTML = isPlaying ? '&#x23F8;' : '&#x23F5;'; // สลับ ⏸ / ⏵
});

// เปลี่ยนเพลง
document.getElementById('prev-btn').addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    updatePlayer();
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    updatePlayer();
});

// เพิ่มเมนูแฮมเบอร์เกอร์ (Demo)
document.getElementById('menu-btn').addEventListener('click', () => {
    alert('ใส่เมนูที่นี่ได้เลย!');
});

// ทำให้ Element ค่อยๆ Fade-in ตอนโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    updatePlayer(); // แสดงเพลงแรกก่อน

    const elements = document.querySelectorAll('.fade-in-element');
    
    // ตั้งค่าหน่วงเวลาให้แต่ละอันลอยขึ้นมาทีละนิด
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 250); // เพิ่มทีละ 0.25 วินาที
    });
});
