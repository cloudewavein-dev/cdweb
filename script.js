// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(21, 24, 40, 0.9)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(21, 24, 40, 0.6)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle (simple implementation for now)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(21, 24, 40, 0.95)';
                navLinks.style.padding = '2rem';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }

    // FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Scroll to Top Progress Circle
    const progressContainer = document.getElementById('progress-circle');
    const progressBar = document.getElementById('progress-bar');

    if (progressContainer && progressBar) {
        // SVG circle path length for r=45 is ~283
        const totalLength = 283;

        window.addEventListener('scroll', () => {
            // Calculate scroll percentage
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = scrollTop / docHeight;
            
            // Show or hide the button based on scroll position
            if (scrollTop > 100) {
                progressContainer.classList.add('visible');
            } else {
                progressContainer.classList.remove('visible');
                // Ensure the hover state doesn't keep it transformed when hidden
                progressContainer.style.transform = 'translateY(20px)';
            }

            // Restore correct transform if visible but not hovered (to fix JS style override)
            if (progressContainer.classList.contains('visible') && !progressContainer.matches(':hover')) {
                progressContainer.style.transform = 'translateY(0)';
            }

            // Update the stroke-dashoffset to show progress
            const drawLength = totalLength * scrollPercent;
            progressBar.style.strokeDashoffset = totalLength - drawLength;
        });

        // Scroll to top on click
        progressContainer.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Handle hover state manually due to inline style transform overrides
        progressContainer.addEventListener('mouseenter', () => {
            if (progressContainer.classList.contains('visible')) {
                progressContainer.style.transform = 'translateY(-5px)';
            }
        });
        progressContainer.addEventListener('mouseleave', () => {
            if (progressContainer.classList.contains('visible')) {
                progressContainer.style.transform = 'translateY(0)';
            }
        });
    }

    // Scroll Reveal Animation Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: Stop observing once revealed if you only want it to animate once
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15, // Trigger when 15% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Slightly before the bottom
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }
});
