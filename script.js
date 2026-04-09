// Global variables
let currentSection = 'home';
const roles = [
    'Developer',
    'UI/UX Designer',
    'Programmer',
    'Web Developer'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

// DOM Elements
// DOM Elements
const mouseHighlighter = document.querySelector('.mouse-highlighter');
const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
const sections = document.querySelectorAll('.section');
const typewriterRoles = document.querySelector('.typewriter-roles');

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeMouseHighlighter();
    initializeNavigation();
    initializeMobileMenu(); // New init call
    initializeTypewriter();
    initializeScrollAnimations();
    initializeContactForm();
    generateParticles();

    // Set initial active section
    updateActiveSection();
});

// Mouse highlighter functionality
function initializeMouseHighlighter() {
    let mouseX = 0;
    let mouseY = 0;
    let highlighterX = 0;
    let highlighterY = 0;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateHighlighter() {
        const dx = mouseX - highlighterX;
        const dy = mouseY - highlighterY;

        highlighterX += dx * 0.1;
        highlighterY += dy * 0.1;

        mouseHighlighter.style.left = highlighterX - 10 + 'px';
        mouseHighlighter.style.top = highlighterY - 10 + 'px';

        requestAnimationFrame(animateHighlighter);
    }

    animateHighlighter();

    // Hide highlighter when mouse leaves window
    document.addEventListener('mouseleave', function () {
        mouseHighlighter.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
        mouseHighlighter.style.opacity = '1';
    });

    // Enhanced highlighter effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .cert-card, .position-card, .skill-tag');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            mouseHighlighter.style.transform = 'scale(2)';
            mouseHighlighter.style.background = 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 70%)';
        });

        element.addEventListener('mouseleave', function () {
            mouseHighlighter.style.transform = 'scale(1)';
            mouseHighlighter.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, rgba(0, 212, 255, 0.2) 40%, transparent 70%)';
        });
    });
}

// Navigation functionality

function initializeNavigation() {
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Calculate precise offset to verify standard/mobile nav height
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                currentSection = targetId;
                updateActiveNavigation();
            }
        });
    });

    // Scroll spy
    window.addEventListener('scroll', debounce(updateActiveSection, 100));
}

function updateActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            if (currentSection !== sectionId) {
                currentSection = sectionId;
                updateActiveNavigation();
                triggerSectionAnimations(section);
            }
        }
    });
}

function updateActiveNavigation() {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Example animation trigger placeholder
function triggerSectionAnimations(section) {
    // Add your animations here
}

initializeNavigation();

function initializeMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    // Note: mobile-links are already part of navLinks for scroll spy, 
    // but we need them specific here for close-on-click
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!menuBtn || !mobileMenu) return;

    // Toggle Menu
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Typewriter effect
function initializeTypewriter() {
    if (!typewriterRoles) return;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterRoles.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterRoles.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause before deleting
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next role
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Start typewriter effect
    typeEffect();
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate child elements with stagger effect
                const animatableElements = entry.target.querySelectorAll(
                    '.timeline-item, .skill-category, .position-card, .project-card, .cert-card'
                );

                animatableElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);

        // Initialize child elements for animation
        const animatableElements = section.querySelectorAll(
            '.timeline-item, .skill-category, .position-card, .project-card, .cert-card'
        );

        animatableElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    });
}

function triggerSectionAnimations(section) {
    // Add specific animations for different sections
    const sectionId = section.getAttribute('id');

    switch (sectionId) {
        case 'skills':
            animateSkillTags(section);
            break;
        case 'projects':
            animateProjectCards(section);
            break;
        case 'certifications':
            animateCertCards(section);
            break;
    }
}

function animateSkillTags(section) {
    const skillTags = section.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.transform = 'scale(1.05)';
            setTimeout(() => {
                tag.style.transform = 'scale(1)';
            }, 200);
        }, index * 50);
    });
}

function animateProjectCards(section) {
    const projectCards = section.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 300);
        }, index * 200);
    });
}

function animateCertCards(section) {
    const certCards = section.querySelectorAll('.cert-card');
    certCards.forEach((card, index) => {
        setTimeout(() => {
            const icon = card.querySelector('.cert-icon');
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
                setTimeout(() => {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                }, 500);
            }
        }, index * 300);
    });
}

const contactForm = document.querySelector('#contact-form');
const formSubmitURL = 'https://formsubmit.co/aswiniselvam0502@gmail.com';

function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        if (!validateForm(data)) return;

        submitForm(formData);
    });

    // Floating label animation (optional)
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.value.trim() !== '') {
                this.setAttribute('data-has-value', '');
            } else {
                this.removeAttribute('data-has-value');
            }
        });
    });
}

function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!data.subject || data.subject.trim().length < 5) {
        errors.push('Subject must be at least 5 characters long');
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }

    if (errors.length > 0) {
        showNotification('Please fix the following errors:\n' + errors.join('\n'), 'error');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(formData) {
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Add FormSubmit hidden fields
    formData.append('_replyto', formData.get('email'));
    formData.append('_subject', 'New message from portfolio website');
    formData.append('_captcha', 'false');

    fetch(formSubmitURL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(() => {
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showNotification("Thank you for your message! I\'ll get back to you soon", "success");
    }).catch(() => {
        showNotification("Failed to send email. Try again later.", "error");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        maxWidth: '400px',
        fontSize: '0.875rem',
        lineHeight: '1.4'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeContactForm);


// Generate dynamic particles
function generateParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    // Create additional particle effects
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';

        // Random position and properties
        const size = Math.random() * 4 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;

        Object.assign(particle.style, {
            position: 'absolute',
            width: size + 'px',
            height: size + 'px',
            background: `rgba(0, 212, 255, ${Math.random() * 0.5 + 0.1})`,
            borderRadius: '50%',
            left: x + 'px',
            top: y + 'px',
            animation: `floatParticle ${duration}s linear infinite`,
            pointerEvents: 'none'
        });

        particlesContainer.appendChild(particle);
    }

    // Add CSS animation for particles if not exists
    if (!document.querySelector('#particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Performance optimization utilities
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Keyboard navigation support
document.addEventListener('keydown', function (e) {
    // Arrow key navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();

        const currentIndex = Array.from(sections).findIndex(section =>
            section.getAttribute('id') === currentSection
        );

        let newIndex;
        if (e.key === 'ArrowDown') {
            newIndex = (currentIndex + 1) % sections.length;
        } else {
            newIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        }

        sections[newIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Handle window resize
window.addEventListener('resize', debounce(function () {
    // Recalculate positions and animations if needed
    updateActiveSection();
}, 250));

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/669616/pexels-photo-669616.jpeg?auto=compress&cs=tinysrgb&w=600'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Add smooth reveal animation for elements entering viewport
function addRevealAnimation() {
    const revealElements = document.querySelectorAll(
        '.about-text, .personal-info, .timeline-content, .contact-method'
    );

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(element);
    });
}

// Initialize reveal animations
document.addEventListener('DOMContentLoaded', addRevealAnimation);

// Add parallax effect for background elements
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.floating-shapes .shape');

    window.addEventListener('scroll', throttle(function () {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    }, 16));
}

// Initialize parallax
document.addEventListener('DOMContentLoaded', initializeParallax);

// Error handling for missing elements
function safeQuerySelector(selector, context = document) {
    try {
        return context.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

function safeQuerySelectorAll(selector, context = document) {
    try {
        return context.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Elements not found: ${selector}`);
        return [];
    }
}

// Enhanced accessibility
function enhanceAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = 'position:absolute;top:-40px;left:6px;background:#000;color:#fff;padding:8px;text-decoration:none;z-index:10001;';
    skipLink.addEventListener('focus', () => skipLink.style.top = '6px');
    skipLink.addEventListener('blur', () => skipLink.style.top = '-40px');
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main landmark
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.setAttribute('id', 'main-content');
        mainContent.setAttribute('role', 'main');
    }

    // Improve focus management
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });

    document.addEventListener('mousedown', function () {
        document.body.classList.remove('using-keyboard');
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

console.log('Portfolio website initialized successfully!');