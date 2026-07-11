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

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
        });
    }

    // Dropdown click toggle (keeps menu open when mouse leaves)
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Is this dropdown already active?
            const isActive = dropdown.classList.contains('active');
            
            // Close all dropdowns first
            dropdowns.forEach(d => d.classList.remove('active'));
            
            // If it wasn't active before, open it
            if (!isActive) {
                dropdown.classList.add('active');
            }
        });
    });

    // Mobile nested mega menu accordion
    const megaTitles = document.querySelectorAll('.mega-title');
    megaTitles.forEach(title => {
        title.addEventListener('click', (e) => {
            // Only trigger on mobile view where the icons are visible
            if (window.innerWidth <= 992) {
                const column = title.closest('.mega-column');
                // Toggle active state
                column.classList.toggle('active');
            }
        });
    });

    // Close dropdowns if user clicks outside of them
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    // Light/Dark Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // SVG Paths
    const moonPath = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
    const sunPath = "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";
    
    // Check initial state (set by head script) to update icon
    if (document.documentElement.getAttribute('data-theme') === 'light' && themeIcon) {
        themeIcon.innerHTML = `<path d="${sunPath}"></path>`;
    }

    if (themeToggle && themeIcon) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            
            if (isLight) {
                // Switch to Dark Mode
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeIcon.innerHTML = `<path d="${moonPath}"></path>`;
            } else {
                // Switch to Light Mode
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeIcon.innerHTML = `<path d="${sunPath}"></path>`;
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
