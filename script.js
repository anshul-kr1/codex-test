(() => {
  const body = document.body;
  body.classList.remove('no-js');
  body.classList.add('js-enabled');

  setCurrentYear();
  initNavigation();
  initScrollReveal();
  initGalleryModal();
  initParticles();
  initMotionToggle();
  initTiltCards();
  initParallax();

  function setCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  function initMotionToggle() {
    const motionPreference = getMotionPreference();
    
    if (motionPreference.matches) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    }

    const handleMotionChange = (event) => {
      if (event.matches) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-reduced-motion');
      }
    };

    attachMotionListener(motionPreference, handleMotionChange);
  }

  function initNavigation() {
    const nav = document.getElementById('primary-nav');
    const toggle = document.querySelector('.menu-toggle');
    if (!nav || !toggle) {
      return;
    }

    const navLinks = nav.querySelectorAll('a');

    nav.classList.toggle('is-open', window.innerWidth >= 880);

    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-open');
      nav.classList.remove('is-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      const nextState = !isOpen;
      toggle.setAttribute('aria-expanded', String(nextState));
      toggle.classList.toggle('is-open', nextState);
      nav.classList.toggle('is-open', nextState);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 879px)').matches) {
          closeMenu();
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 880) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
        nav.classList.add('is-open');
      } else {
        nav.classList.remove('is-open');
      }
    });
  }

  function initTiltCards() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (!tiltCards.length) {
      return;
    }

    const motionPreference = getMotionPreference();
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (motionPreference.matches || isTouchDevice) {
      return;
    }

    let animationFrame = null;

    const handleMouseMove = throttle((event) => {
      if (animationFrame) {
        return;
      }

      animationFrame = requestAnimationFrame(() => {
        tiltCards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;
          
          const angleX = (event.clientY - cardCenterY) / rect.height;
          const angleY = (cardCenterX - event.clientX) / rect.width;
          
          const maxTilt = parseFloat(getComputedStyle(document.documentElement)
            .getPropertyValue('--tilt-max')) || 6;
          
          const rotateX = angleX * maxTilt;
          const rotateY = angleY * maxTilt;
          
          const inner = card.querySelector('.tilt-card-inner');
          if (inner) {
            inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          }
        });
        
        animationFrame = null;
      });
    }, 16);

    const handleMouseLeave = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      
      tiltCards.forEach(card => {
        const inner = card.querySelector('.tilt-card-inner');
        if (inner) {
          inner.style.transform = '';
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    tiltCards.forEach(card => {
      card.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero__layer');
    if (!parallaxElements.length) {
      return;
    }

    const motionPreference = getMotionPreference();
    if (motionPreference.matches) {
      return;
    }

    let ticking = false;
    const smoothing = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--parallax-smoothing')) || 0.08;

    const parallaxData = Array.from(parallaxElements).map(el => ({
      element: el,
      currentY: 0,
      targetY: 0,
      speed: el.classList.contains('hero__layer--one') ? 0.5 :
              el.classList.contains('hero__layer--two') ? 0.3 : 0.1
    }));

    function updateParallax() {
      const scrollY = window.pageYOffset;
      
      parallaxData.forEach(data => {
        data.targetY = scrollY * data.speed;
      });
    }

    function animate() {
      parallaxData.forEach(data => {
        data.currentY += (data.targetY - data.currentY) * smoothing;
        data.element.style.transform = `translateY(${data.currentY}px)`;
      });

      ticking = false;
    }

    function onScroll() {
      updateParallax();
      
      if (!ticking) {
        requestAnimationFrame(animate);
        ticking = true;
      }
    }

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

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

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealFadeElements = document.querySelectorAll('.reveal-fade:not(.is-visible)');
    const revealUpElements = document.querySelectorAll('.reveal-up:not(.is-visible)');
    const revealScaleElements = document.querySelectorAll('.reveal-scale:not(.is-visible)');
    
    if (!revealElements.length && !revealFadeElements.length && !revealUpElements.length && !revealScaleElements.length) {
      return;
    }

    const motionPreference = getMotionPreference();

    if (!('IntersectionObserver' in window) || motionPreference.matches) {
      const allRevealElements = [...revealElements, ...revealFadeElements, ...revealUpElements, ...revealScaleElements];
      allRevealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      observerOptions
    );

    const allElements = [...revealElements, ...revealFadeElements, ...revealUpElements, ...revealScaleElements];
    allElements.forEach((element) => observer.observe(element));
  }

  function initGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (!modal) {
      return;
    }

    const overlay = modal.querySelector('[data-modal-overlay]');
    const closeBtn = modal.querySelector('[data-modal-close]');
    const image = modal.querySelector('.modal__image');
    const titleEl = modal.querySelector('.modal__title');
    const descEl = modal.querySelector('.modal__description');
    const triggers = document.querySelectorAll('[data-gallery-trigger]');

    if (!overlay || !closeBtn || !image || !titleEl || !descEl || !triggers.length) {
      return;
    }

    const focusableSelector =
      'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    let lastFocusedElement = null;
    let focusableNodes = [];

    const updateFocusableNodes = () => {
      focusableNodes = Array.from(modal.querySelectorAll(focusableSelector));
    };

    const trapFocus = (event) => {
      if (event.key !== 'Tab' || focusableNodes.length === 0) {
        return;
      }

      const first = focusableNodes[0];
      const last = focusableNodes[focusableNodes.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    const openModal = (data) => {
      if (!data || !data.image) {
        return;
      }
      lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      image.src = data.image;
      image.alt = data.alt || data.title || '';
      titleEl.textContent = data.title || '';
      descEl.textContent = data.description || '';
      modal.removeAttribute('hidden');
      modal.setAttribute('aria-hidden', 'false');
      body.classList.add('modal-open');
      updateFocusableNodes();
      requestAnimationFrame(() => {
        if (focusableNodes.length) {
          focusableNodes[0].focus();
        }
      });
      document.addEventListener('keydown', handleKeydown);
      modal.addEventListener('keydown', trapFocus);
    };

    const closeModal = () => {
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('hidden', '');
      body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleKeydown);
      modal.removeEventListener('keydown', trapFocus);
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    };

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        openModal({
          image: trigger.dataset.image,
          title: trigger.dataset.title,
          description: trigger.dataset.description,
          alt: trigger.dataset.alt,
        });
      });
    });
  }

  function initParticles() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas || !canvas.getContext) {
      return;
    }

    const ctx = canvas.getContext('2d');
    const motionPreference = getMotionPreference();

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let animationFrame = null;

    const config = {
      count: 70,
      minRadius: 0.6,
      maxRadius: 2.1,
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * (config.maxRadius - config.minRadius) + config.minRadius,
      alpha: Math.random() * 0.4 + 0.2,
      depth: Math.random() * 0.8 + 0.2,
      drift: Math.random() * 0.4 - 0.2,
      speed: Math.random() * 0.35 + 0.12,
    });

    const createParticles = () => {
      particles = Array.from({ length: config.count }, createParticle);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#e7e3da';

      particles.forEach((particle) => {
        particle.y -= particle.speed * (particle.depth * 1.6);
        particle.x += particle.drift * particle.depth;

        if (particle.y < -20) {
          particle.y = height + 20;
          particle.x = Math.random() * width;
        }

        if (particle.x < -40 || particle.x > width + 40) {
          particle.x = Math.random() * width;
        }

        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * (1 + particle.depth * 0.6), 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });

      ctx.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (animationFrame != null) {
        return;
      }
      draw();
    };

    const stop = () => {
      if (animationFrame != null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
        ctx.clearRect(0, 0, width, height);
      }
    };

    resize();

    if (!motionPreference.matches) {
      start();
    }

    const handleMotionChange = (event) => {
      if (event.matches) {
        stop();
      } else {
        start();
      }
    };

    attachMotionListener(motionPreference, handleMotionChange);

    window.addEventListener('resize', () => {
      resize();
      if (!motionPreference.matches && animationFrame == null) {
        start();
      }
    });
  }

  function getMotionPreference() {
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-reduced-motion: reduce)');
    }
    return {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    };
  }

  function attachMotionListener(mediaQueryList, callback) {
    if (!mediaQueryList || typeof callback !== 'function') {
      return;
    }

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', callback);
    } else if (typeof mediaQueryList.addListener === 'function') {
      mediaQueryList.addListener(callback);
    }
  }
})();
