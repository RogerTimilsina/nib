document.addEventListener('DOMContentLoaded', () => {

    // --- Loading Screen ---
    const loadingScreen = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
        // Add a small delay for effect, then hide
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500); // Adjust delay as needed
    });


    // --- Sticky Header ---
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        // Close menu when a link is clicked (optional)
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                 if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                 }
            });
        });
    }


    // --- Smooth Scrolling for internal links ---
    document.querySelectorAll('a.scroll-link, a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if it's a real section link, not just '#'
             const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                   targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                     // Close mobile menu if open
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                    }
                }
            }
        });
    });

    // --- Fade-in animation on scroll ---
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove visibility if you want fade-out on scroll up
                 entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // --- Simple Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg && closeBtn && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                lightbox.style.display = "block";
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt; // Use alt text for caption
            });
        });

        // Close lightbox
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = "none";
        });

        // Close on clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = "none";
            }
        });
    }

    // --- Optional: Simple Ember Particle Effect in Footer ---
    const canvas = document.getElementById('emberCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let canvasWidth = canvas.offsetWidth;
        let canvasHeight = canvas.offsetHeight;
        canvas.width = canvasWidth; // Set canvas internal resolution
        canvas.height = canvasHeight;


        class Particle {
            constructor() {
                this.x = Math.random() * canvasWidth;
                this.y = canvasHeight + Math.random() * 50; // Start below screen
                this.size = Math.random() * 2 + 0.5; // Tiny embers
                this.speedY = Math.random() * 1 + 0.5; // Upward speed
                this.speedX = (Math.random() - 0.5) * 0.5; // Slight horizontal drift
                this.opacity = 1;
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                this.opacity -= 0.005; // Fade out slowly

                // Reset particle if it goes off screen or fades
                if (this.y < -10 || this.opacity <= 0) {
                    this.y = canvasHeight + Math.random() * 10;
                    this.x = Math.random() * canvasWidth;
                    this.opacity = 1;
                     this.size = Math.random() * 2 + 0.5;
                     this.speedY = Math.random() * 1 + 0.5;
                     this.speedX = (Math.random() - 0.5) * 0.5;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(255, 69, 0, ${this.opacity})`; // Ember color with opacity
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                // Optional glow
                 ctx.shadowBlur = 5;
                 ctx.shadowColor = 'rgba(255, 100, 0, 0.5)';

            }
        }

        function initParticles() {
            particles = [];
             const particleCount = Math.min(50, Math.floor(canvasWidth / 20)); // Fewer particles on smaller screens
             for (let i = 0; i < particleCount; i++) {
                 particles.push(new Particle());
             }
        }

        function animateParticles() {
             ctx.clearRect(0, 0, canvasWidth, canvasHeight);
             ctx.shadowBlur = 0; // Reset shadow blur for clearing
             particles.forEach(particle => {
                 particle.update();
                 particle.draw();
             });
             requestAnimationFrame(animateParticles);
         }


        // Debounce resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
             clearTimeout(resizeTimeout);
             resizeTimeout = setTimeout(() => {
                 canvasWidth = canvas.offsetWidth;
                 canvasHeight = canvas.offsetHeight;
                 canvas.width = canvasWidth;
                 canvas.height = canvasHeight;
                 initParticles(); // Reinitialize particles for new size
             }, 250);
         });


         initParticles();
         animateParticles();

    }

});