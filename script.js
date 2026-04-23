window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
        // Trigger initial reveal on load
        reveal();
        // Start typing animation
        typeName();
        // Initialize Background Particles
        initParticles();
    }, 500);
});

// Typewriter Animation
const nameText = "Mahadharshini P";
let nameIndex = 0;
function typeName() {
    const target = document.getElementById("typewriter-name");
    if (target && nameIndex < nameText.length) {
        target.innerHTML += nameText.charAt(nameIndex);
        nameIndex++;
        setTimeout(typeName, 150); // Speed of typing
    }
}

// Background Glitter Particles
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            const theme = document.documentElement.getAttribute('data-theme');
            // Pink glitter in dark mode, teal/soft in light mode
            ctx.fillStyle = theme === 'dark' ? `rgba(242, 145, 163, ${this.opacity})` : `rgba(114, 140, 138, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function createParticles() {
        const particleCount = 70;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
}

// Sticky Navigation
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

// Dark/Light Mode logic
const themeToggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement;
const themeIcon = themeToggleBtn.querySelector('i');

// Check local storage for theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
rootElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    rootElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Reveal logic & Progress Bar Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach(revealEl => {
        const elementTop = revealEl.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            revealEl.classList.add('active');
            
            // If it's the skills section, animate progress bars
            if (revealEl.id === 'skills' || revealEl.querySelector('.progress')) {
                const progressBars = revealEl.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }
        }
    });
}

window.addEventListener('scroll', reveal);
