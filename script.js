// PAGE
function goPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0,0);
}

// MENU
function toggleMenu(){
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("open");
}

function closeMenu(){
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

// MODAL
function openMsg(){
  document.getElementById("modal").classList.add("open");
  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow="hidden";
}

function closeMsg(){
  document.getElementById("modal").classList.remove("open");
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow="";
}

// COUNT
const msg=document.getElementById("msg");
const count=document.getElementById("count");

msg.addEventListener("input",()=>{
  count.textContent=msg.value.length;
});

// SEND
function send(){
  const text=msg.value.trim();
  if(!text)return;

  const btn=document.getElementById("sendBtn");
  btn.innerText="กำลังส่ง...";
  btn.disabled=true;

  setTimeout(()=>{
    alert("ส่งแล้ว 💌");
    closeMsg();
    msg.value="";
    count.textContent=0;
    btn.innerText="ส่งข้อความ";
    btn.disabled=false;
  },800);
}

// ESC ปิด
document.addEventListener("keydown",e=>{
  if(e.key==="Escape") closeMsg();
});
