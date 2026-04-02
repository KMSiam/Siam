// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 600);
    }
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlEl = document.documentElement;

// Check saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'bx bx-moon' : 'bx bx-sun';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
        // Reinit particles for new theme
        initParticles();
    });
}

// ===== MOBILE MENU =====
const toggle = document.getElementById('nav-toggle');
const nav = document.getElementById('nav-menu');

if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('show'));
}

// Close menu on link click
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => nav && nav.classList.remove('show'));
});

// Close menu on overlay click
if (nav) {
    nav.addEventListener('click', (e) => {
        if (e.target === nav) {
            nav.classList.remove('show');
        }
    });
}

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active-link');
        } else {
            navLink?.classList.remove('active-link');
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');

function scrollHeader() {
    if (window.scrollY >= 80) {
        header?.classList.add('scroll-header');
    } else {
        header?.classList.remove('scroll-header');
    }
}

// ===== SCROLL TO TOP =====
const scrollTop = document.getElementById('scroll-top');

function scrollTopShow() {
    if (window.scrollY >= 500) {
        scrollTop?.classList.add('show');
    } else {
        scrollTop?.classList.remove('show');
    }
}

if (scrollTop) {
    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Combined scroll listener with throttling for performance
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            scrollActive();
            scrollHeader();
            scrollTopShow();
            revealOnScroll();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// ===== TYPING EFFECT =====
const typingEl = document.getElementById('typing-text');
const titles = ['CSE Student', 'Web Developer', 'Problem Solver', 'UI/UX Enthusiast', 'App Developer'];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingEl) return;
    
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        typingEl.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let speed = isDeleting ? 40 : 80;
    
    if (!isDeleting && charIndex === currentTitle.length) {
        speed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        speed = 500; // Pause before next word
    }
    
    setTimeout(typeEffect, speed);
}

typeEffect();

// ===== SKILLS TABS =====
document.querySelectorAll('.skills__tab-button').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');
        
        document.querySelectorAll('.skills__tab-button').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.skills__content').forEach(content => content.classList.remove('active'));
        
        tab.classList.add('active');
        const targetEl = document.getElementById(target);
        if (targetEl) {
            targetEl.classList.add('active');
        }
    });
});

// ===== ANIMATED COUNTERS =====
const counters = document.querySelectorAll('[data-count]');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 1500;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            
            counter.textContent = current + '+';
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
    
    countersAnimated = true;
}

// ===== SCROLL REVEAL (Custom) =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 120;
        
        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('revealed');
        }
    });
    
    // Animate counters when about section is visible
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const aboutTop = aboutSection.getBoundingClientRect().top;
        if (aboutTop < window.innerHeight - 200) {
            animateCounters();
        }
    }
}

window.addEventListener('load', revealOnScroll);

// ===== PARTICLE BACKGROUND =====
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouse = { x: null, y: null, radius: 150 };
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    const theme = htmlEl.getAttribute('data-theme');
    const isDark = theme === 'dark';
    
    // Improved colors for light mode
    const particleColor = isDark ? 'rgba(108, 99, 255, 0.4)' : 'rgba(108, 99, 255, 0.6)';
    const lineColor = isDark ? 'rgba(108, 99, 255, 0.1)' : 'rgba(108, 99, 255, 0.2)';
    const accentParticleColor = isDark ? 'rgba(0, 243, 255, 0.4)' : 'rgba(0, 200, 255, 0.6)';
    
    // Reduce particle count on mobile for performance/battery
    const isMobile = window.innerWidth < 768;
    const baseDensity = isMobile ? 35000 : 18000;
    const maxParticles = isMobile ? 30 : 100;
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / baseDensity), maxParticles);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = Math.random() > 0.8 ? accentParticleColor : particleColor;
        }
        
        update() {
            // Standard movement
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Mouse interaction (repulsion)
            if (mouse.x !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    this.x -= directionX * force * 5;
                    this.y -= directionY * force * 5;
                }
            }

            // Boundary checks
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add subtle glow in dark mode
            if (isDark) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = this.color;
            } else {
                ctx.shadowBlur = 0;
            }
        }
    }
    
    // Cancel previous animation
    if (animationId) cancelAnimationFrame(animationId);
    
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    const opacity = 1 - (dist / 150);
                    ctx.strokeStyle = lineColor.replace('0.1', (opacity * 0.1).toString()).replace('0.2', (opacity * 0.2).toString());
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Only draw lines if they aren't too cluttered
        drawLines();
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// Init particles on load
initParticles();
