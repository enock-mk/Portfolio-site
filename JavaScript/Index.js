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
    }

    closeMenu() {
        this.toggle.setAttribute('aria-expanded', 'false');
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
        this.observer = null;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.animationCache = new WeakMap();
        this.init();
    }

    init() {
        if (this.isReducedMotion) return; // Skip animations if user prefers reduced motion

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.options);

        const animateElements = document.querySelectorAll(
            'section:not(#home), .project-card, .skill-item, .about__image'
        );
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        if (this.animationCache.has(element)) return;
        element.style.transition = 'all 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        this.animationCache.set(element, true);
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
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate form before submission
        if (!this.validateForm(data)) {
            e.preventDefault();
            this.showMessage('Please fill in all fields correctly', 'error');
            return;
        }

        // Update button state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Formspree will handle submission - allow default form submission
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
            data.name && data.name.trim().length > 0 &&
            data.email && emailRegex.test(data.email) &&
            data.message && data.message.trim().length > 0
        );
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
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
        messageDiv.textContent = message;
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
        this.scrollHandler = Throttle.create(() => this._updateScrollButtons(), 100);
        this.init();
    }

    init() {
        if (this.carousel && this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => this.scroll('prev'), { passive: true });
            this.nextBtn.addEventListener('click', () => this.scroll('next'), { passive: true });
            this.carousel.addEventListener('scroll', this.scrollHandler, { passive: true });
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

    _updateScrollButtons() {
        if (!this.carousel) return;
        const { scrollLeft, scrollWidth, clientWidth } = this.carousel;
        this.prevBtn.disabled = scrollLeft === 0;
        this.nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth;
    }
}

// ===========================
// THROTTLE/DEBOUNCE UTILITIES
// ===========================

class Throttle {
    static create(func, delay = 16) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }
}

// ===========================
// ACTIVE NAVIGATION INDICATOR
// ===========================

class ActiveNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.navbar__link');
        this.sections = document.querySelectorAll('section[id]');
        this.isMobile = window.innerWidth < 768;
        this.updateActiveLink = Throttle.create(() => this._updateActiveLink(), 150);
        this.init();
    }

    init() {
        window.addEventListener('scroll', this.updateActiveLink, { passive: true });
        this._updateActiveLink();
    }

    _updateActiveLink() {
        let currentSection = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
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
        this.toggleButton = Throttle.create(() => this._toggleButton(), 100);
        this.init();
    }

    createButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
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
        window.addEventListener('scroll', this.toggleButton, { passive: true });
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    _toggleButton() {
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
// LAZY LOADING IMAGES
// ===========================

class LazyLoadImages {
    constructor() {
        if ('IntersectionObserver' in window) {
            this.init();
        } else {
            this.loadAllImages();
        }
    }

    init() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
        
        // Ensure all images load (with or without lazy loading)
        this.loadAllImages();
    }

    loadAllImages() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.classList.contains('loaded') && img.src) {
                img.classList.add('loaded');
            }
        });
    }
}

// ===========================
// SKILLS CLICK ANIMATIONS
// ===========================

class SkillsAnimator {
    constructor() {
        this.items = document.querySelectorAll('.skill-item');
        this.descriptionWrap = document.querySelector('.skills__description');
        this.descriptionEl = this.descriptionWrap?.querySelector('p');
        this.active = null;
        this.init();
    }

    init() {
        this.items.forEach(item => {
            item.addEventListener('click', () => this.handleClick(item));
        });
    }

    handleClick(item) {
        if (this.active === item) {
            this.hideDescription();
            this.items.forEach(i => i.classList.remove('skill-item--active'));
            this.active = null;
            return;
        }

        item.classList.add('animate-out');
        this.items.forEach(i => i.classList.remove('skill-item--active'));

        setTimeout(() => {
            const desc = item.dataset.desc || item.textContent;
            if (!this.descriptionEl && this.descriptionWrap) {
                this.descriptionEl = document.createElement('p');
                this.descriptionWrap.appendChild(this.descriptionEl);
            }
            if (this.descriptionEl) {
                this.descriptionEl.textContent = desc;
                this.descriptionWrap.classList.add('is-visible');
            }

            item.classList.remove('animate-out');
            item.classList.add('skill-item--active');
            this.active = item;
        }, 260);
    }

    hideDescription() {
        if (this.descriptionWrap) {
            this.descriptionWrap.classList.remove('is-visible');
        }
    }
}

// ===========================
// COUNTER ANIMATION
// ===========================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-counter]');
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        if (this.isReducedMotion) {
            // Skip animation for users with reduced motion preference
            this.counters.forEach(counter => {
                counter.textContent = counter.getAttribute('data-counter');
            });
            return;
        }

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
        const duration = 1500; // Reduced from 2000 for mobile
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
// KEYBOARD NAVIGATION
// ===========================

class KeyboardNavigation {
    constructor(mobileMenu) {
        this.mobileMenu = mobileMenu;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu) {
                this.mobileMenu.closeMenu();
            }
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.querySelector('main')?.focus();
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
        this.isMobile = window.innerWidth < 768;
        this.updateParallax = Throttle.create(() => this._updateParallax(), 16);
        if (this.elements.length > 0 && !this.isMobile) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', this.updateParallax, { passive: true });
    }

    _updateParallax() {
        this.elements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            element.style.transform = `translateY(${window.scrollY * speed}px)`;
        });
    }
}

// ===========================
// INITIALIZE ALL MODULES (Deferred Loading)
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = new MobileMenu();
    new SmoothScroll();
    new AnimateOnScroll();
    new ContactForm();
    new ProjectCarousel();
    new ActiveNavigation();
    new ScrollToTop();
    new LazyLoadImages();
    new SkillsAnimator();
    new KeyboardNavigation(mobileMenu);
    new ParallexEffect();

    // Defer counter animations to avoid blocking main thread
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            new CounterAnimation();
        });
    } else {
        setTimeout(() => {
            new CounterAnimation();
        }, 1000);
    }
});
