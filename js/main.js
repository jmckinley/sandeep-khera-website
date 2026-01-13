/**
 * Sandeep Khera Website - Main JavaScript
 * Handles navigation, interactions, and form functionality
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownItems = document.querySelectorAll('.has-dropdown');

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNav() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 1024) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Mobile Dropdown Toggle
     */
    function initDropdowns() {
        dropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');

            // For mobile: toggle dropdown on click
            link.addEventListener('click', function(e) {
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    item.classList.toggle('active');
                }
            });
        });
    }

    /**
     * Header Scroll Effect
     */
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Form Handling
     */
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');

        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            // Email validation
            const emailField = this.querySelector('[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }

            if (isValid) {
                // Show success message
                const submitBtn = this.querySelector('[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Simulate form submission (replace with actual endpoint)
                setTimeout(() => {
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.classList.add('success');

                    // Reset form
                    this.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('success');
                    }, 3000);
                }, 1000);
            }
        });

        // Remove error class on input
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }

    /**
     * Booking Form / Discovery Call Button
     */
    function initBookingButtons() {
        const bookingButtons = document.querySelectorAll('[href*="booking"], [href*="discovery"]');

        bookingButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Check if it's an internal anchor link
                const href = this.getAttribute('href');
                if (href.startsWith('#') || href.includes('#booking')) {
                    // Allow normal scroll behavior
                    return;
                }

                // For external booking links, you can add tracking or modal here
                // This is a placeholder for actual booking integration
            });
        });
    }

    /**
     * Intersection Observer for Animations
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.pillar-card, .service-card, .testimonial-card, .process-step');

        if (!animatedElements.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    /**
     * Active Navigation Link
     */
    function initActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /**
     * FAQ Accordion (for FAQ sections)
     */
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (!question || !answer) return;

            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        });
    }

    /**
     * Handle window resize
     */
    function initResizeHandler() {
        let resizeTimer;

        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(function() {
                // Reset mobile nav state on resize to desktop
                if (window.innerWidth >= 1024) {
                    navToggle?.setAttribute('aria-expanded', 'false');
                    navMenu?.classList.remove('active');
                    document.body.style.overflow = '';

                    // Reset dropdown states
                    dropdownItems.forEach(item => {
                        item.classList.remove('active');
                    });
                }
            }, 250);
        });
    }

    /**
     * Initialize all functionality
     */
    function init() {
        initMobileNav();
        initDropdowns();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initBookingButtons();
        initScrollAnimations();
        initActiveNavLink();
        initFAQAccordion();
        initResizeHandler();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
