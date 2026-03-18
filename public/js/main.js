document.addEventListener('DOMContentLoaded', function() {
  initNavScroll();
  initScrollAnimations();
  initParallax();
  initBouncingImages();
  initThemeToggle();
});

function initNavScroll() {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .section-header').forEach(el => {
    observer.observe(el);
  });
}

function initParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroImage = document.querySelector('.hero-image');
  if (!heroImage) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.15;
        
        if (scrolled < window.innerHeight) {
          heroImage.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  }, { passive: true });
}

function initBouncingImages() {
  const canvas = document.getElementById('bouncing-canvas');
  const container = document.getElementById('bouncing-container');
  
  if (!canvas || !container) return;
  
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const images = [
    { src: '/uploads/悲剧的诞生.jpg', name: '悲剧的诞生' },
    { src: '/uploads/候场.jpg', name: '候场' },
    { src: '/uploads/白夜行.jpg', name: '白夜行' },
    { src: '/uploads/鼠疫.jpg', name: '鼠疫' },
    { src: '/uploads/ddr2.jpg', name: 'DDR2' },
    { src: '/uploads/cyberpunk.jpg', name: 'Cyberpunk' },
    { src: '/uploads/极乐迪斯科.jpg', name: '极乐迪斯科' },
    { src: '/uploads/巫师3.jpg', name: '巫师3' },
    { src: '/uploads/坂本龙一.jpg', name: '坂本龙一' },
    { src: '/uploads/王菲.jpg', name: '王菲' },
    { src: '/uploads/古尔德.jpg', name: '古尔德' },
    { src: '/uploads/men i trust.jpg', name: 'Men I Trust' },
    { src: '/uploads/星际穿越.webp', name: '星际穿越' },
    { src: '/uploads/肖申克的就输.webp', name: '肖申克的救赎' },
    { src: '/uploads/爱乐之城.webp', name: '爱乐之城' },
    { src: '/uploads/两杆大烟枪.png', name: '两杆大烟枪' }
  ];
  
  let balls = [];
  let animationId = null;
  let imagesLoaded = 0;
  let loadedImages = [];
  let hoveredBall = null;
  let mouseX = 0;
  let mouseY = 0;
  
  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  
  function loadImages() {
    images.forEach((imgData, index) => {
      const img = new Image();
      img.onload = () => {
        loadedImages[index] = img;
        imagesLoaded++;
        
        if (imagesLoaded === images.length) {
          initBalls();
          if (!prefersReducedMotion) {
            startAnimation();
          } else {
            drawStaticBalls();
          }
        }
      };
      img.onerror = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
          initBalls();
          if (!prefersReducedMotion) {
            startAnimation();
          } else {
            drawStaticBalls();
          }
        }
      };
      img.src = imgData.src;
    });
  }
  
  function initBalls() {
    balls = [];
    const baseHeight = 130;
    const speed = 1.5;
    
    images.forEach((imgData, index) => {
      const img = loadedImages[index];
      if (!img) return;
      
      const aspectRatio = img.width / img.height;
      const height = baseHeight;
      const width = height * aspectRatio;
      
      const angle = Math.random() * Math.PI * 2;
      
      const ball = {
        x: width / 2 + Math.random() * (canvas.width - width),
        y: height / 2 + Math.random() * (canvas.height - height),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: width,
        height: height,
        img: img,
        name: imgData.name,
        isPaused: false
      };
      
      balls.push(ball);
    });
  }
  
  function drawBall(ball) {
    ctx.save();
    ctx.translate(ball.x, ball.y);
    
    if (ball.isPaused) {
      ctx.shadowColor = 'rgba(225, 29, 72, 0.6)';
      ctx.shadowBlur = 30;
    } else {
      ctx.shadowColor = 'rgba(225, 29, 72, 0.3)';
      ctx.shadowBlur = 20;
    }
    
    const cornerRadius = 8;
    const halfW = ball.width / 2;
    const halfH = ball.height / 2;
    
    ctx.beginPath();
    ctx.moveTo(-halfW + cornerRadius, -halfH);
    ctx.lineTo(halfW - cornerRadius, -halfH);
    ctx.quadraticCurveTo(halfW, -halfH, halfW, -halfH + cornerRadius);
    ctx.lineTo(halfW, halfH - cornerRadius);
    ctx.quadraticCurveTo(halfW, halfH, halfW - cornerRadius, halfH);
    ctx.lineTo(-halfW + cornerRadius, halfH);
    ctx.quadraticCurveTo(-halfW, halfH, -halfW, halfH - cornerRadius);
    ctx.lineTo(-halfW, -halfH + cornerRadius);
    ctx.quadraticCurveTo(-halfW, -halfH, -halfW + cornerRadius, -halfH);
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(ball.img, -halfW, -halfH, ball.width, ball.height);
    
    ctx.restore();
  }
  
  function isPointInBall(px, py, ball) {
    const halfW = ball.width / 2;
    const halfH = ball.height / 2;
    return px >= ball.x - halfW && px <= ball.x + halfW &&
           py >= ball.y - halfH && py <= ball.y + halfH;
  }
  
  function updateBall(ball) {
    if (ball.isPaused) return;
    
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    const halfW = ball.width / 2;
    const halfH = ball.height / 2;
    
    if (ball.x - halfW <= 0) {
      ball.x = halfW;
      ball.vx *= -1;
    } else if (ball.x + halfW >= canvas.width) {
      ball.x = canvas.width - halfW;
      ball.vx *= -1;
    }
    
    if (ball.y - halfH <= 0) {
      ball.y = halfH;
      ball.vy *= -1;
    } else if (ball.y + halfH >= canvas.height) {
      ball.y = canvas.height - halfH;
      ball.vy *= -1;
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    balls.forEach(ball => {
      updateBall(ball);
      drawBall(ball);
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  function drawStaticBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    balls.forEach((ball, index) => {
      ball.x = canvas.width / 2 + (index % 4 - 1.5) * 180;
      ball.y = canvas.height / 2 + (Math.floor(index / 4) - 0.5) * 200;
      drawBall(ball);
    });
  }
  
  function startAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    animate();
  }
  
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  container.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    let foundHover = false;
    balls.forEach(ball => {
      if (isPointInBall(mouseX, mouseY, ball)) {
        ball.isPaused = true;
        foundHover = true;
        canvas.style.cursor = 'pointer';
      } else {
        ball.isPaused = false;
      }
    });
    
    if (!foundHover) {
      canvas.style.cursor = 'default';
    }
  });
  
  container.addEventListener('mouseleave', () => {
    balls.forEach(ball => {
      ball.isPaused = false;
    });
    canvas.style.cursor = 'default';
  });
  
  window.addEventListener('resize', () => {
    resizeCanvas();
    if (balls.length > 0 && prefersReducedMotion) {
      drawStaticBalls();
    }
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!prefersReducedMotion && !animationId) {
          startAnimation();
        }
      } else {
        stopAnimation();
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(container);
  
  resizeCanvas();
  loadImages();
}

function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  if (!toggle) return;
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    toggle.checked = true;
  } else {
    body.classList.remove('light-mode');
    toggle.checked = false;
  }
  
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
