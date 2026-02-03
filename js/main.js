/* ============================================================
   AXM v1 — CORE INTERACTIONS
   Part 1: Mobile Nav, Chat Widget, Form Handling
============================================================ */


/* --------------------------------------------
   MOBILE NAV TOGGLE
-------------------------------------------- */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

// Highlight current page in the shared nav (no manual "active" classes needed)
(function setActiveNavLink() {
    if (!navLinks) return;
    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const links = navLinks.querySelectorAll('a[href]');
    links.forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (!href) return;
        // Exact match, plus a small safety: treat empty/"/" as index
        const isActive = href === current || (current === '' && href === 'index.html');
        a.classList.toggle('active', isActive);
    });
})();

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}


/* --------------------------------------------
   CHAT WIDGET TOGGLE
-------------------------------------------- */
const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');

if (chatButton && chatWindow) {
    chatButton.addEventListener('click', () => {
        chatWindow.style.display = 'flex';
    });
}

if (chatClose && chatWindow) {
    chatClose.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });
}


/* --------------------------------------------
   FORM SUCCESS HANDLING (Booking + Contact)
-------------------------------------------- */
function handleFormSubmission(formId, successId) {
    const form = document.getElementById(formId);
    const successMsg = document.getElementById(successId);

    if (!form || !successMsg) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show success message
        successMsg.style.display = 'block';

        // Clear fields
        form.reset();

        // Hide message after a delay
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3500);
    });
}

handleFormSubmission('bookingForm', 'bookingSuccess');
handleFormSubmission('contactForm', 'contactSuccess');


/* --------------------------------------------
   BASIC UTILITIES
-------------------------------------------- */
function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}
/* ============================================================
   AXM v1 — INTERACTION LAYER
   Part 2: Tagline Rotation + Hero Micro‑Motion
============================================================ */


/* --------------------------------------------
   ROTATING SECONDARY TAGLINE
-------------------------------------------- */

const taglineLines = document.querySelectorAll('.axm-hero-tagline-secondary');
let taglineIndex = 0;

function rotateTagline() {
    if (taglineLines.length === 0) return;

    // Remove active class from current line
    taglineLines[taglineIndex].classList.remove('active');

    // Move to next line
    taglineIndex = (taglineIndex + 1) % taglineLines.length;

    // Activate next line
    taglineLines[taglineIndex].classList.add('active');
}

// Rotate every 4 seconds
setInterval(rotateTagline, 4000);



/* --------------------------------------------
   HERO MICRO‑MOTION (SUBTLE)
   - Slight fade/slide on load
   - No gimmicks, no chaos
-------------------------------------------- */

function heroIntroMotion() {
    const heroTitle = document.querySelector('.axm-hero-title');
    const primaryTagline = document.querySelector('.axm-hero-tagline-primary');

    if (!heroTitle || !primaryTagline) return;

    heroTitle.style.opacity = 0;
    heroTitle.style.transform = 'translateY(12px)';

    primaryTagline.style.opacity = 0;
    primaryTagline.style.transform = 'translateY(12px)';

    setTimeout(() => {
        heroTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        heroTitle.style.opacity = 1;
        heroTitle.style.transform = 'translateY(0)';
    }, 150);

    setTimeout(() => {
        primaryTagline.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        primaryTagline.style.opacity = 1;
        primaryTagline.style.transform = 'translateY(0)';
    }, 350);
}

window.addEventListener('load', heroIntroMotion);
/* ============================================================
   AXM v1 — FINAL INTERACTION POLISH
   Part 3: Scroll Reveals, Button Micro‑Pulse, Card Enhancements,
           Chat Message Handling
============================================================ */


/* --------------------------------------------
   SCROLL‑BASED SECTION REVEAL
-------------------------------------------- */

const revealElements = document.querySelectorAll('.axm-section, .axm-service-card, .axm-product-card');

function handleScrollReveal() {
    const triggerPoint = window.innerHeight * 0.85;

    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerPoint) {
            el.classList.add('axm-reveal');
        }
    });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);


/* --------------------------------------------
   BUTTON MICRO‑PULSE (subtle)
-------------------------------------------- */

const primaryButtons = document.querySelectorAll('.axm-btn-primary');

primaryButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.03)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });
});


/* --------------------------------------------
   CARD HOVER ENHANCEMENT (JS-assisted)
-------------------------------------------- */

const cards = document.querySelectorAll('.axm-service-card, .axm-product-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = 'translateY(-6px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});


/* --------------------------------------------
   CHAT WIDGET — BASIC MESSAGE HANDLING
   (Front-end only, no backend)
-------------------------------------------- */

const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');

function appendChatMessage(text, sender = 'user') {
    if (!chatBody) return;

    const msg = document.createElement('div');
    msg.classList.add('axm-chat-msg', sender);
    msg.textContent = text;

    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            const userText = chatInput.value.trim();
            appendChatMessage(userText, 'user');

            // Placeholder auto-response
            setTimeout(() => {
                appendChatMessage('Thanks for reaching out. AXM will follow up shortly.', 'system');
            }, 600);

            chatInput.value = '';
        }
    });
}


/* --------------------------------------------
   FINAL UTILITIES
-------------------------------------------- */

function addClass(el, cls) {
    if (el) el.classList.add(cls);
}

function removeClass(el, cls) {
    if (el) el.classList.remove(cls);
}

function toggleClass(el, cls) {
    if (el) el.classList.toggle(cls);
}
