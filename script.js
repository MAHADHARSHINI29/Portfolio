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

// --- DATABASE & FORM HANDLING ---

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Capture Data
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value,
            timestamp: new Date().toLocaleString()
        };

        // 2. Save to "Local Database" (LocalStorage)
        saveToLocalDatabase(formData);

        // 3. UI Feedback
        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.innerText;
        
        submitBtn.innerText = "Message Sent!";
        submitBtn.style.background = "#4CAF50"; // Green for success
        
        contactForm.reset();

        setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.style.background = ""; // Reset to CSS variable
        }, 3000);
    });
}

// Client-side Database Helper
function saveToLocalDatabase(data) {
    // Get existing messages or initialize empty array
    let messages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];
    
    // Add new message
    messages.push(data);
    
    // Save back to storage
    localStorage.setItem('portfolio_messages', JSON.stringify(messages));
    
    console.log("Database Update: New message stored successfully.");
}

/** 
 * COMMAND: View your database messages
 * Type 'viewMessages()' in the browser console to see everyone who messaged you.
 */
function viewMessages() {
    const messages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];
    if (messages.length === 0) {
        console.log("No messages in database yet.");
        return;
    }
    console.table(messages);
}

/**
 * --- FUTURE CLOUD DATABASE SETUP (SUPABASE) ---
 * To move this to a real live database:
 * 1. Create a Supabase account and a 'messages' table.
 * 2. Uncomment and configure the block below.
 * 
 * const supabaseUrl = 'YOUR_SUPABASE_URL';
 * const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
 * const supabase = supabase.createClient(supabaseUrl, supabaseKey);
 * 
 * async function saveToCloud(data) {
 *    const { error } = await supabase.from('messages').insert([data]);
 *    if (error) console.error('Error saving to cloud:', error);
 * }
 */

