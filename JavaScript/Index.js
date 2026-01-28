// ===========================
// NAVIGATION & MOBILE MENU
// ===========================

class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.navbar__toggle');
        this.menu = document.querySelector('.navbar__menu');
        this.links = document.querySelectorAll('.navbar__link');
        this.init();
    }

    init() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
            this.links.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }
    }

    toggleMenu() {
        const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
        this.toggle.setAttribute('aria-expanded', !isExpanded);
        this.menu.style.display = isExpanded ? 'none' : 'flex';
    }

    closeMenu() {
        this.toggle.setAttribute('aria-expanded', 'false');
        this.menu.style.display = 'none';
    }
}

// ===========================
// SMOOTH SCROLL NAVIGATION
// ===========================

class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleScroll(e));
        });
    }

    handleScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// ===========================
// INTERSECTION OBSERVER - FADE IN ANIMATIONS
// ===========================

class AnimateOnScroll {
    constructor() {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.options);

        // Observe all sections and elements with animation class (exclude header/navbar)
        const animateElements = document.querySelectorAll(
            'section:not(#home), .project-card, .skill-item, .about__image'
        );
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.transition = 'all 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}

// ===========================
// FORM HANDLING
// ===========================

class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact__form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateForm(data)) {
            this.showMessage('Please fill in all fields correctly', 'error');
            return;
        }

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showMessage('Message sent successfully!', 'success');
            this.form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
            data.name && 
            data.name.trim().length > 0 &&
            data.email && 
            emailRegex.test(data.email) &&
            data.message && 
            data.message.trim().length > 0
        );
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message--${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// ===========================
// PROJECT CAROUSEL
// ===========================

class ProjectCarousel {
    constructor() {
        this.carousel = document.querySelector('.projects__carousel');
        this.prevBtn = document.querySelector('.projects__button--prev');
        this.nextBtn = document.querySelector('.projects__button--next');
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        if (this.carousel && this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => this.scroll('prev'));
            this.nextBtn.addEventListener('click', () => this.scroll('next'));
        }
    }

    scroll(direction) {
        const scrollAmount = this.carousel.clientWidth * 0.8;
        const currentScroll = this.carousel.scrollLeft;

        this.carousel.scrollTo({
            left: direction === 'next' 
                ? currentScroll + scrollAmount 
                : currentScroll - scrollAmount,
            behavior: 'smooth'
        });
    }
}

// ===========================
// ACTIVE NAVIGATION INDICATOR
// ===========================

class ActiveNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.navbar__link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateActiveLink());
        this.updateActiveLink();
    }

    updateActiveLink() {
        let currentSection = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
                link.style.color = '#FC3C3C';
            }
        });
    }
}

// ===========================
// SCROLL TO TOP BUTTON
// ===========================

class ScrollToTop {
    constructor() {
        this.button = this.createButton();
        this.init();
    }

    createButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Scroll to top');
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #FC3C3C;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 999;
        `;
        document.body.appendChild(button);
        return button;
    }

    init() {
        window.addEventListener('scroll', () => this.toggleButton());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    toggleButton() {
        if (window.scrollY > 300) {
            this.button.style.opacity = '1';
            this.button.style.pointerEvents = 'auto';
        } else {
            this.button.style.opacity = '0';
            this.button.style.pointerEvents = 'none';
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===========================
// NUMBER COUNTER ANIMATION
// ===========================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-counter]');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ===========================
// LAZY LOADING IMAGES
// ===========================

class LazyLoadImages {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// ===========================
// SKILLS CLICK ANIMATIONS
// ===========================

class SkillsAnimator {
    constructor() {
        this.items = document.querySelectorAll('.skill-item');
        this.descriptionWrap = document.querySelector('.skills__description');
        this.descriptionEl = this.descriptionWrap ? this.descriptionWrap.querySelector('p') : null;
        this.active = null;
        this.init();
    }

    init() {
        if (!this.items || this.items.length === 0) return;

        this.items.forEach(item => {
            item.addEventListener('click', () => this.handleClick(item));
        });
    }

    handleClick(item) {
        // Toggle off if clicking the already active item
        if (this.active === item) {
            this.hideDescription();
            this.items.forEach(i => i.classList.remove('skill-item--active'));
            this.active = null;
            return;
        }

        // Animate the clicked item out briefly
        item.classList.add('animate-out');

        // Clear active on others
        this.items.forEach(i => i.classList.remove('skill-item--active'));

        setTimeout(() => {
            // Update description content
            const desc = item.dataset.desc || item.textContent;
            if (!this.descriptionEl && this.descriptionWrap) {
                this.descriptionEl = document.createElement('p');
                this.descriptionWrap.appendChild(this.descriptionEl);
            }
            if (this.descriptionEl) {
                this.descriptionEl.textContent = desc;
                // show with animation
                this.descriptionWrap.classList.add('is-visible');
            }

            // restore item visibility and mark active
            item.classList.remove('animate-out');
            item.classList.add('skill-item--active');
            this.active = item;
        }, 260);
    }

    hideDescription() {
        if (this.descriptionWrap) this.descriptionWrap.classList.remove('is-visible');
    }
}

// ===========================
// KEYBOARD NAVIGATION
// ===========================

class KeyboardNavigation {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
                const mobileMenu = new MobileMenu();
                mobileMenu.closeMenu();
            }

            // Skip to main content (accessibility)
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    mainContent.focus();
                }
            }
        });
    }
}

// ===========================
// PARALLAX EFFECT
// ===========================

class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (this.elements.length > 0) {
            window.addEventListener('scroll', () => this.updateParallax());
        }
    }

    updateParallax() {
        this.elements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const offset = window.scrollY * speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    }
}

// ===========================
// PAGE LOAD ANIMATIONS
// ===========================

class PageLoadAnimation {
    constructor() {
        this.init();
    }

    init() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(20px);
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .navbar {
                animation: slideInUp 0.6s ease-out;
            }

            .hero {
                animation: fadeIn 0.8s ease-out;
            }

            .btn {
                transition: all 0.3s ease;
            }

            .btn:active {
                transform: scale(0.98);
            }

            a {
                transition: color 0.3s ease;
            }

            img {
                transition: opacity 0.3s ease;
            }

            img.loaded {
                opacity: 1;
            }

            .navbar__link.active {
                font-weight: bold;
                border-bottom: 2px solid #FC3C3C;
                padding-bottom: 0.25rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===========================
// INITIALIZE ALL MODULES
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new MobileMenu();
    new SmoothScroll();
    new AnimateOnScroll();
    new ContactForm();
    new ProjectCarousel();
    new ActiveNavigation();
    new ScrollToTop();
    new CounterAnimation();
    new LazyLoadImages();
    new SkillsAnimator();
    new KeyboardNavigation();
    new ParallaxEffect();
    new PageLoadAnimation();

    console.log('✓ Portfolio initialized successfully');
});

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animate element with custom duration
function animateElement(element, duration = 600) {
    element.style.animation = `slideInUp ${duration}ms ease-out`;
}

// Get scroll position with safety check
function getScrollPosition() {
    return window.scrollY || window.pageYOffset || 0;
}
