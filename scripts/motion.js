/**
 * Deist Technologies - Tactile Clay Motion & Smooth Scroll Engine
 * Powered by Lenis & GSAP ScrollTrigger
 */
(function initDeistMotion() {
  // 1. Initialize Lenis Smooth Scroll
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      infinite: false
    });

    if (typeof gsap === 'undefined') {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // 2. Initialize GSAP & ScrollTrigger Animations
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      // Background pattern subtle parallax drift
      const pattern = document.querySelector('.bg-ambient-pattern');
      if (pattern && typeof ScrollTrigger !== 'undefined') {
        gsap.to(pattern, {
          y: '6%',
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
          }
        });
      }

      // Hero Elements Staggered Entrance
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const header = document.querySelector('header');
      if (header) {
        heroTimeline.from(header, {
          y: -20,
          opacity: 0,
          duration: 0.75,
          clearProps: 'all'
        }, 0.05);
      }

      // Find the actual hero section containing h1
      const heroH1 = document.querySelector('main h1');
      const heroSection = heroH1 ? heroH1.closest('section') : document.querySelector('main section:nth-of-type(2)');

      if (heroSection) {
        const badges = heroSection.querySelectorAll('.clay-badge, .clay-badge-orange, .clay-debossed');
        if (badges.length > 0) {
          heroTimeline.from(badges, {
            scale: 0.94,
            opacity: 0,
            duration: 0.5,
            stagger: 0.06,
            clearProps: 'all'
          }, 0.15);
        }

        const headings = heroSection.querySelectorAll('h1, h2');
        if (headings.length > 0) {
          heroTimeline.from(headings, {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            clearProps: 'all'
          }, 0.25);
        }

        const paragraphs = heroSection.querySelectorAll('p');
        if (paragraphs.length > 0) {
          heroTimeline.from(paragraphs, {
            y: 16,
            opacity: 0,
            duration: 0.65,
            stagger: 0.08,
            clearProps: 'all'
          }, 0.35);
        }

        const ctas = heroSection.querySelectorAll('.clay-pill-dark, .clay-pill-white');
        if (ctas.length > 0) {
          heroTimeline.from(ctas, {
            y: 14,
            opacity: 0,
            scale: 0.97,
            duration: 0.55,
            stagger: 0.06,
            ease: 'back.out(1.2)',
            clearProps: 'all'
          }, 0.45);
        }

        const heroConsole = heroSection.querySelector('.clay-console');
        if (heroConsole) {
          heroTimeline.from(heroConsole, {
            y: 24,
            opacity: 0,
            duration: 0.75,
            clearProps: 'all'
          }, 0.3);
        }
      }

      // ScrollTrigger Reveal on Clay Cards across downstream sections
      // Use y-translation without forcing opacity: 0 upfront so content is never blank
      if (typeof ScrollTrigger !== 'undefined') {
        const sections = document.querySelectorAll('main section');
        sections.forEach((section) => {
          if (section === heroSection || section.querySelector('h1')) return;

          const cards = section.querySelectorAll('.clay-card, .clay-console');
          if (cards.length > 0) {
            gsap.from(cards, {
              scrollTrigger: {
                trigger: section,
                start: 'top 95%',
                once: true
              },
              y: 22,
              duration: 0.6,
              stagger: 0.06,
              ease: 'power2.out',
              clearProps: 'all'
            });
          }
        });

        window.addEventListener('load', () => {
          ScrollTrigger.refresh();
        });
      }
    });
  }
})();
