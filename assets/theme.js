/* =====================================================================
   VERDURA theme — interactions
   Vanilla JS, no dependencies. Everything is defensive (null-checked)
   so individual features never break the rest of the page.
   ===================================================================== */
(function () {
  'use strict';

  var routes = (window.theme && window.theme.routes) || {};
  var strings = (window.theme && window.theme.strings) || {};
  var moneyFormat = (window.theme && window.theme.moneyFormat) || '${{amount}}';

  /* --------------------------- helpers --------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function formatMoney(cents) {
    var value = (cents / 100).toFixed(2);
    return moneyFormat.replace(/\{\{\s*amount\s*\}\}/, value)
                      .replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100));
  }

  /* ----------------------- mobile nav drawer --------------------- */
  function initMobileNav() {
    var toggle = $('[data-menu-toggle]');
    var nav = $('[data-mobile-nav]');
    var overlay = $('[data-overlay]');
    if (!toggle || !nav) return;

    function open() { nav.classList.add('is-open'); if (overlay) overlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function close() { nav.classList.remove('is-open'); if (overlay) overlay.classList.remove('is-open'); document.body.style.overflow = ''; }

    toggle.addEventListener('click', open);
    $all('[data-menu-close]', nav).forEach(function (b) { b.addEventListener('click', close); });
    if (overlay) overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* --------------------------- accordions ------------------------ */
  function initAccordions() {
    $all('[data-accordion-item]').forEach(function (item) {
      var btn = $('[data-accordion-trigger]', item);
      var panel = $('[data-accordion-panel]', item);
      if (!btn || !panel) return;
      btn.addEventListener('click', function () {
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      });
    });
  }

  /* ----------------------- product galleries --------------------- */
  function initGalleries() {
    $all('[data-gallery]').forEach(function (gallery) {
      var main = $('[data-gallery-main] img', gallery) || $('[data-gallery-main]', gallery);
      $all('[data-gallery-thumb]', gallery).forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var src = thumb.getAttribute('data-full') || thumb.querySelector('img').src;
          if (main && main.tagName === 'IMG') { main.src = src; }
          $all('[data-gallery-thumb]', gallery).forEach(function (t) { t.classList.remove('is-active'); });
          thumb.classList.add('is-active');
        });
      });
    });
  }

  /* --------------------- quantity selectors ---------------------- */
  function initQuantity() {
    $all('[data-qty]').forEach(function (wrap) {
      var input = $('input', wrap);
      if (!input) return;
      $all('[data-qty-change]', wrap).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var dir = parseInt(btn.getAttribute('data-qty-change'), 10);
          var val = Math.max(1, (parseInt(input.value, 10) || 1) + dir);
          input.value = val;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    });
  }

  /* ------------------------- variant picker ---------------------- */
  function initVariants() {
    $all('[data-product-form]').forEach(function (form) {
      var dataEl = $('[data-variant-json]', form);
      if (!dataEl) return;
      var variants;
      try { variants = JSON.parse(dataEl.textContent); } catch (e) { return; }

      var idInput = $('[name="id"]', form);
      var priceEl = $('[data-price]');
      var compareEl = $('[data-compare-price]');
      var atcBtn = $('[data-atc]', form);

      function currentSelections() {
        return $all('[data-variant-pill].is-selected', form).map(function (p) { return p.getAttribute('data-value'); });
      }
      function findVariant() {
        var sel = currentSelections();
        return variants.find(function (v) {
          return v.options.every(function (opt, i) { return !sel[i] || opt === sel[i]; });
        });
      }
      function update() {
        var v = findVariant() || variants[0];
        if (!v) return;
        if (idInput) idInput.value = v.id;
        if (priceEl) priceEl.textContent = formatMoney(v.price);
        if (compareEl) {
          if (v.compare_at_price && v.compare_at_price > v.price) {
            compareEl.textContent = formatMoney(v.compare_at_price);
            compareEl.hidden = false;
          } else { compareEl.hidden = true; }
        }
        if (atcBtn) {
          atcBtn.disabled = !v.available;
          atcBtn.querySelector('[data-atc-text]') &&
            (atcBtn.querySelector('[data-atc-text]').textContent = v.available ? strings.addToCart : strings.soldOut);
        }
      }

      $all('[data-variant-option]', form).forEach(function (group) {
        $all('[data-variant-pill]', group).forEach(function (pill) {
          pill.addEventListener('click', function () {
            $all('[data-variant-pill]', group).forEach(function (p) { p.classList.remove('is-selected'); });
            pill.classList.add('is-selected');
            update();
          });
        });
      });
      update();
    });
  }

  /* ----------------------------- CART ---------------------------- */
  var cartDrawer = {
    el: null,
    init: function () {
      this.el = $('[data-cart-drawer]');
      var overlay = $('[data-cart-overlay]');
      var self = this;

      $all('[data-cart-open]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          if (self.el) { e.preventDefault(); self.open(); }
        });
      });
      $all('[data-cart-close]').forEach(function (b) { b.addEventListener('click', function () { self.close(); }); });
      if (overlay) overlay.addEventListener('click', function () { self.close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') self.close(); });

      // qty change / remove inside drawer (event delegation)
      if (this.el) {
        this.el.addEventListener('click', function (e) {
          var remove = e.target.closest('[data-cart-remove]');
          if (remove) { e.preventDefault(); self.changeLine(remove.getAttribute('data-key'), 0); }
          var step = e.target.closest('[data-cart-qty]');
          if (step) {
            var key = step.getAttribute('data-key');
            var dir = parseInt(step.getAttribute('data-cart-qty'), 10);
            var cur = parseInt(step.getAttribute('data-current'), 10) || 1;
            self.changeLine(key, Math.max(0, cur + dir));
          }
        });
      }
    },
    open: function () { if (!this.el) return; this.el.classList.add('is-open'); var o = $('[data-cart-overlay]'); if (o) o.classList.add('is-open'); document.body.style.overflow = 'hidden'; },
    close: function () { if (!this.el) return; this.el.classList.remove('is-open'); var o = $('[data-cart-overlay]'); if (o) o.classList.remove('is-open'); document.body.style.overflow = ''; },

    changeLine: function (key, qty) {
      fetch(routes.cart_change_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: key, quantity: qty })
      }).then(function (r) { return r.json(); })
        .then(function (cart) { cartDrawer.render(cart); });
    },

    render: function (cart) {
      updateCartCount(cart.item_count);
      var itemsEl = $('[data-cart-items]', this.el);
      var footerEl = $('[data-cart-footer]', this.el);
      var emptyEl = $('[data-cart-empty]', this.el);
      if (!itemsEl) return;

      if (cart.item_count === 0) {
        itemsEl.innerHTML = '';
        if (emptyEl) emptyEl.hidden = false;
        if (footerEl) footerEl.hidden = true;
        return;
      }
      if (emptyEl) emptyEl.hidden = true;
      if (footerEl) footerEl.hidden = false;

      itemsEl.innerHTML = cart.items.map(function (item) {
        return '' +
          '<div class="cart-line">' +
            '<a href="' + item.url + '"><img src="' + (item.image ? item.image.replace(/(\.[^.]*)$/, '_160x$1') : '') + '" alt="" loading="lazy"></a>' +
            '<div>' +
              '<a href="' + item.url + '" class="cart-line__title">' + item.product_title + '</a>' +
              (item.variant_title ? '<div class="cart-line__variant">' + item.variant_title + '</div>' : '') +
              '<div class="qty-selector" style="margin-top:.5rem">' +
                '<button data-cart-qty="-1" data-key="' + item.key + '" data-current="' + item.quantity + '" aria-label="Decrease">−</button>' +
                '<input value="' + item.quantity + '" readonly aria-label="Quantity">' +
                '<button data-cart-qty="1" data-key="' + item.key + '" data-current="' + item.quantity + '" aria-label="Increase">+</button>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div class="price">' + formatMoney(item.final_line_price) + '</div>' +
              '<button class="cart-line__remove" data-cart-remove data-key="' + item.key + '">' + 'Remove' + '</button>' +
            '</div>' +
          '</div>';
      }).join('');

      var subtotalEl = $('[data-cart-subtotal]', this.el);
      if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);

      updateFreeShipBar(cart.total_price);
    }
  };

  function updateCartCount(count) {
    $all('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });
  }

  function updateFreeShipBar(totalPrice) {
    var bar = $('[data-free-ship]');
    if (!bar) return;
    var threshold = parseInt(bar.getAttribute('data-threshold'), 10) * 100;
    if (!threshold) return;
    var pct = Math.min(100, (totalPrice / threshold) * 100);
    var fill = $('[data-free-ship-fill]', bar);
    var label = $('[data-free-ship-label]', bar);
    if (fill) fill.style.width = pct + '%';
    if (label) {
      label.textContent = totalPrice >= threshold
        ? (bar.getAttribute('data-reached') || 'Free shipping unlocked!')
        : (bar.getAttribute('data-remaining') || 'away from free shipping').replace('{amount}', formatMoney(threshold - totalPrice));
    }
  }

  /* ------------------------ add to cart (AJAX) ------------------- */
  function initAddToCart() {
    $all('[data-product-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        if (!cartDrawer.el) return; // fall back to normal POST → /cart
        e.preventDefault();
        var btn = $('[data-atc]', form);
        var label = btn ? btn.querySelector('[data-atc-text]') : null;
        var original = label ? label.textContent : '';
        if (label) label.textContent = strings.adding || 'Adding…';
        if (btn) btn.disabled = true;

        fetch(routes.cart_add_url + '.js', { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
          .then(function (r) { return r.json(); })
          .then(function () { return fetch(routes.cart_url + '.js').then(function (r) { return r.json(); }); })
          .then(function (cart) {
            cartDrawer.render(cart);
            cartDrawer.open();
          })
          .catch(function () { form.submit(); })
          .finally(function () {
            if (label) label.textContent = original;
            if (btn) btn.disabled = false;
          });
      });
    });
  }

  /* ------------------------- sticky add-to-cart ------------------ */
  function initStickyAtc() {
    var sticky = $('[data-sticky-atc]');
    var anchor = $('[data-atc]');
    if (!sticky || !anchor) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        sticky.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
    }, { threshold: 0 });
    observer.observe(anchor.closest('[data-product-form]') || anchor);
  }

  /* ------------------------ reveal on scroll --------------------- */
  function initReveal() {
    var els = $all('.reveal');
    if (!els.length || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------- boot ---------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initAccordions();
    initGalleries();
    initQuantity();
    initVariants();
    cartDrawer.init();
    initAddToCart();
    initStickyAtc();
    initReveal();
  });
})();
