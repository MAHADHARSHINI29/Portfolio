window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
        // Trigger initial reveal on load
        reveal();
        // Start typing animation
        typeName();
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
