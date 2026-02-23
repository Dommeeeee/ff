const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let current = 0;
let isAnimating = false;


// ===== INIT STARS (slide 0) =====
const starsEl = document.getElementById('stars');
if (starsEl) {
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${2 + Math.random() * 3}s;
      --delay: ${Math.random() * 4}s;
      --op: ${0.3 + Math.random() * 0.5};
    `;
    starsEl.appendChild(star);
  }
}


// ===== GO TO SLIDE =====
function goToSlide(index) {
  if (isAnimating || index === current || index < 0 || index >= totalSlides) return;
  isAnimating = true;

  const direction = index > current ? 1 : -1;
  const prevSlide = slides[current];
  const nextSlide = slides[index];

  // Set initial position of incoming slide
  nextSlide.style.transition = 'none';
  nextSlide.style.transform = `translateX(${direction * 100}%)`;
  nextSlide.style.opacity = '0';
  nextSlide.classList.remove('active', 'exit-left');

  // Force reflow
  nextSlide.getBoundingClientRect();

  // Animate
  nextSlide.style.transition = '';
  nextSlide.style.transform = 'translateX(0)';
  nextSlide.style.opacity = '1';
  nextSlide.classList.add('active');

  prevSlide.style.transform = `translateX(${direction * -100}%)`;
  prevSlide.style.opacity = '0';

  setTimeout(() => {
    prevSlide.classList.remove('active');
    prevSlide.style.transform = '';
    prevSlide.style.opacity = '';
    current = index;
    isAnimating = false;
  }, 580);
}

// ===== CHANGE SLIDE =====
function changeSlide(dir) {
  goToSlide(current + dir);
}

// ===== KEYBOARD =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    changeSlide(1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    changeSlide(-1);
  } else if (e.key === 'Home') {
    goToSlide(0);
  } else if (e.key === 'End') {
    goToSlide(totalSlides - 1);
  }
});

// ===== TOUCH SWIPE =====
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const dt = Date.now() - touchStartTime;
  
  // Check for valid swipe: horizontal distance > vertical, fast enough, and minimum distance
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30 && dt < 500) {
    changeSlide(dx < 0 ? 1 : -1);
  }
}, { passive: true });

// ===== TOUCH TAP AREAS =====
document.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  const screenWidth = window.innerWidth;
  
  // Left 25% = previous, Right 25% = next
  if (touch.clientX < screenWidth * 0.25) {
    changeSlide(-1);
  } else if (touch.clientX > screenWidth * 0.75) {
    changeSlide(1);
  }
}, { passive: true });


