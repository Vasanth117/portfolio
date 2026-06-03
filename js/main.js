document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       CUSTOM CURSOR TRACKING
       ========================================================================== */
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    // Smooth cursor follow delay (lerp)
    const cursorLerp = 0.15;
    const dotLerp = 0.3;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursors in requestAnimationFrame for smooth execution
    function animateCursor() {
        // Lerp coordinates
        cursorX += (mouseX - cursorX) * cursorLerp;
        cursorY += (mouseY - cursorY) * cursorLerp;
        
        dotX += (mouseX - dotX) * dotLerp;
        dotY += (mouseY - dotY) * dotLerp;

        if (cursor && cursorDot) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
        }

        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Add hover states
    const hoverables = document.querySelectorAll('a, button, [role="button"], .project-card, .skill-box, .cert-card, .filter-btn, .mobile-menu-toggle');
    
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorDot.classList.add('hovered');
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorDot.classList.remove('hovered');
        });
    });

    // Hide custom cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        if (cursor && cursorDot) {
            cursor.style.opacity = '0';
            cursorDot.style.opacity = '0';
        }
    });

    document.addEventListener('mouseenter', () => {
        if (cursor && cursorDot) {
            cursor.style.opacity = '1';
            cursorDot.style.opacity = '1';
        }
    });


    /* ==========================================================================
       3D TILT EFFECT ON CARDS
       ========================================================================== */
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        const imgContainer = card.querySelector('.project-image-container');
        const reflection = card.querySelector('.gloss-reflection');

        card.addEventListener('mousemove', (e) => {
            if (!imgContainer) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse position inside card
            const y = e.clientY - rect.top;
            
            const width = rect.width;
            const height = rect.height;
            
            // Normalize values from -1 to 1
            const xc = ((width / 2) - x) / (width / 2);
            const yc = ((height / 2) - y) / (height / 2);
            
            // Calculate tilt angle (max 10 degrees)
            const rotateX = yc * 10;
            const rotateY = -xc * 10;

            // Apply 3D Rotate transform
            imgContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Shift Reflection gloss
            if (reflection) {
                // Shift gradient horizontal sweep
                const percentX = (x / width) * 100;
                reflection.style.transform = `translate3d(${-50 + (percentX - 50) * 0.5}%, 0, 0)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!imgContainer) return;
            // Reset to default transforms on mouse leave
            imgContainer.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            
            if (reflection) {
                reflection.style.transform = 'translate3d(-50%, 0, 0)';
            }
        });
    });


    /* ==========================================================================
       SCROLL OBSERVER FOR THEME INVERSION
       ========================================================================== */
    const connectSection = document.getElementById('connect');

    if (connectSection) {
        // Trigger inversion when the connect section is 30% visible in the viewport
        const observerOptions = {
            root: null,
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.body.classList.add('invert-colors');
                } else {
                    document.body.classList.remove('invert-colors');
                }
            });
        }, observerOptions);

        observer.observe(connectSection);
    }


    /* ==========================================================================
       CERTIFICATIONS CATEGORY FILTER
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certCards = document.querySelectorAll('.cert-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active state to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            certCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Hide with transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Re-trigger layout
                        card.offsetHeight; 
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    } else {
                        card.style.display = 'none';
                    }
                }, 250);
            });
        });
    });


    /* ==========================================================================
       MOBILE NAVIGATION TOGGLE
       ========================================================================== */
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuToggle && navOverlay) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navOverlay.classList.toggle('active');
            
            // Toggle hamburger layout
            const bars = menuToggle.querySelectorAll('.menu-bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                bars[0].style.transform = 'rotate(0deg) translate(0, 0)';
                bars[1].style.transform = 'rotate(0deg) translate(0, 0)';
            }
        });

        // Close overlay when link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                
                const bars = menuToggle.querySelectorAll('.menu-bar');
                bars[0].style.transform = 'rotate(0deg) translate(0, 0)';
                bars[1].style.transform = 'rotate(0deg) translate(0, 0)';
            });
        });
    }

    /* ==========================================================================
       SKILL BOX GLOW HOVER COORDINATES
       ========================================================================== */
    const skillBoxes = document.querySelectorAll('.skill-box');
    
    skillBoxes.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Feed coordinates dynamically to the background glow center
            const glowColor = box.getAttribute('data-glow-color') || 'rgba(255,255,255,0.05)';
            box.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowColor} 0%, var(--bg-secondary) 75%)`;
        });

        box.addEventListener('mouseleave', () => {
            box.style.background = 'var(--bg-secondary)';
        });
    });
});
