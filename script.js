// -----------------------------
// LOADING SCREEN
// -----------------------------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
});

// -----------------------------
// NAV TOGGLE
// -----------------------------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-open');
  });

  // Close nav when a link is clicked
  document.querySelectorAll('.nav__links a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('nav-open'));
  });
}

// -----------------------------
// SMOOTH SCROLL
// -----------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// -----------------------------
// REVEAL ON SCROLL
// -----------------------------
function reveal() {
  const reveals = document.querySelectorAll('.reveal');
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 120;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add('active');

      // If the element has progress bars, animate them once
      const progressBars = reveals[i].querySelectorAll('.progress-bar span');
      if (progressBars && progressBars.length) {
        progressBars.forEach((bar) => {
          const width = bar.getAttribute('data-width');
          if (width) bar.style.width = width;
        });
      }
    }
  }
}

window.addEventListener('scroll', reveal);
reveal();

// -----------------------------
// CONTACT FORM -> API
// -----------------------------
const contactForm = document.getElementById('contact-form');

async function submitMessageToApi(formData) {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    }),
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = typeof data === 'string' ? data : (data.error || 'request_failed');
    throw new Error(msg);
  }

  return data;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button');
    const originalText = submitBtn ? submitBtn.innerText : 'Send';

    const formData = {
      name: document.getElementById('contact-name')?.value || '',
      email: document.getElementById('contact-email')?.value || '',
      subject: document.getElementById('contact-subject')?.value || '',
      message: document.getElementById('contact-message')?.value || '',
    };

    try {
      if (submitBtn) {
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
      }

      await submitMessageToApi(formData);

      if (submitBtn) {
        submitBtn.innerText = 'Message Sent!';
        submitBtn.style.background = '#4CAF50';
      }

      contactForm.reset();
    } catch (err) {
      console.error('Failed to send message:', err);
      if (submitBtn) {
        submitBtn.innerText = 'Failed — Try Again';
        submitBtn.style.background = '#d9534f';
      }
    } finally {
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerText = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }
      }, 3000);
    }
  });
}

// -----------------------------
// TYPEWRITER EFFECT
// -----------------------------
const typewriterElement = document.getElementById('typewriter-name');
if (typewriterElement) {
  const name = "Mahadharshini P";
  let i = 0;
  function type() {
    if (i < name.length) {
      typewriterElement.innerHTML += name.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }
  type();
}

// Debug helper for browser console
window.viewMessages = async function () {
  const res = await fetch('/api/messages?limit=50&offset=0');
  const data = await res.json();
  console.table(data.items || []);
};
