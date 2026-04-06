// ทำให้ Element ค่อยๆ ลอยขึ้นมาและชัดขึ้น (Fade-in effect) ตอนโหลดหน้าเว็บ
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.fade-in-element');
    
    elements.forEach((el, index) => {
        // ซ่อนไว้ก่อน
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        // หน่วงเวลาให้แต่ละกล่องโผล่มาไม่พร้อมกัน (ทีละนิด)
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200); 
    });
});
