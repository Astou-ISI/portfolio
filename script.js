document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. EFFET DE TEXTE DYNAMIQUE (Typing Effect)
    // ==========================================================================
    const words = ["Développeuse Web", "Entrepreneure Tech", "Spécialiste Full-Stack"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 150;
    const erasingDelay = 70;
    const newWordDelay = 2000;
    const typingTextSpan = document.querySelector(".typing-text");

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typingTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, newWordDelay);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? erasingDelay : typingDelay);
        }
    }
    if (typingTextSpan) setTimeout(type, 1000);

    // ==========================================================================
    // 2. EFFET AU DÉFILEMENT DE LA NAVBAR (Changement de style)
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // 3. MENU RESPONSIVE (Hamburger Menu)
    // ==========================================================================
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const allNavLinks = document.querySelectorAll('.nav-links li a');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    // Fermeture du menu lors du clic sur un lien (Mobile)
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });

    // ==========================================================================
    // 4. ANIMATION AU SCROLL (Apparition progressive & Barres de progression)
    // ==========================================================================
    const revealSections = document.querySelectorAll('.scroll-reveal');
    const progressBars = document.querySelectorAll('.progress-done');

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Si la section "about" est visible, déclencher l'animation des barres de compétences
                if(entry.target.id === 'about') {
                    progressBars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-done') + '%';
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealSections.forEach(section => {
        scrollObserver.observe(section);
    });

    // Gestion du lien actif de la navbar au défilement
    const sections = document.querySelectorAll('header, section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 5. GESTION DU THÈME (Clair / Sombre)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Vérification de la préférence sauvegardée de l'utilisateur
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            theme = 'light';
        } else {
            theme = 'dark';
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // ==========================================================================
    // 6. BOUTON RETOUR EN HAUT (Back To Top)
    // ==========================================================================
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================================================
    // 7. VALIDATION COMPLÈTE DU FORMULAIRE DE CONTACT
    // ==========================================================================
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        // Champs à valider
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            const formGroup = input.parentElement;
            
            // Validation standard
            if (!input.value.trim()) {
                formGroup.classList.add('error');
                isFormValid = false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                formGroup.classList.add('error');
                isFormValid = false;
            } else {
                formGroup.classList.remove('error');
            }
        });

        // Si tout est valide, simuler l'envoi de l'email
        if (isFormValid) {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Envoi en cours... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Merci ! Votre message a bien été envoyé avec succès.');
                form.reset();
                submitBtn.innerHTML = 'Envoyer le message <i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
                
                // Réinitialiser les labels
                inputs.forEach(input => input.blur());
            }, 1500);
        }
    });

    // Enlever l'erreur lors de la frappe
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.parentElement.classList.remove('error');
            }
        });
    });

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }
});