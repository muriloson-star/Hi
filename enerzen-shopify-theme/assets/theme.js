/* ============================================================
   EnerZen Natural — theme.js
   ============================================================ */

(function () {
  'use strict';

  /* ---------- FAQ Accordion ---------- */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item   = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (i) {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      /* Keyboard support */
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /* ---------- Mobile Hamburger ---------- */
  function initMobileNav() {
    var hamburger = document.querySelector('.hamburger');
    var mobileNav = document.getElementById('mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ---------- Smooth Scroll with sticky-header offset ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href   = a.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var header = document.querySelector('.header');
        var offset = header ? header.offsetHeight : 80;
        var top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ---------- Scroll-in Animation ---------- */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    var selectors = [
      '.benefit-card',
      '.product-card',
      '.testimonial-card',
      '.use-case',
      '.step',
      '.scent-card',
      '.botanical__item',
    ].join(', ');

    document.querySelectorAll(selectors).forEach(function (el) {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  /* ---------- Cart Count (live, no page reload) ---------- */
  function syncCartCount() {
    var el = document.querySelector('.header__cart');
    if (!el) return;

    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        var badge = el.querySelector('.header__cart-count');
        if (cart.item_count > 0) {
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'header__cart-count';
            el.appendChild(badge);
          }
          badge.textContent = cart.item_count;
        } else if (badge) {
          badge.remove();
        }
      })
      .catch(function () {});
  }

  /* ---------- "Add to Cart" quick-add (progressive enhancement) ---------- */
  function initQuickAdd() {
    document.querySelectorAll('[data-quick-add]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var variantId = btn.dataset.variantId;
        if (!variantId) return;

        var originalText = btn.textContent;
        btn.textContent = 'Adding…';
        btn.disabled = true;

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 }),
        })
          .then(function (r) { return r.json(); })
          .then(function () {
            btn.textContent = 'Added ✓';
            syncCartCount();
            setTimeout(function () {
              btn.textContent = originalText;
              btn.disabled = false;
            }, 2000);
          })
          .catch(function () {
            btn.textContent = 'Error — try again';
            btn.disabled = false;
          });
      });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initFAQ();
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
    syncCartCount();
    initQuickAdd();
  });

})();
