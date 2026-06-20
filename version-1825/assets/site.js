(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var index = 0;
      var show = function (next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
        });
      });
      show(0);
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    var filterArea = document.querySelector('[data-filter-area]');
    if (filterArea) {
      var keyword = filterArea.querySelector('[data-filter-keyword]');
      var type = filterArea.querySelector('[data-filter-type]');
      var year = filterArea.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(filterArea.querySelectorAll('[data-card]'));
      var apply = function () {
        var q = keyword ? keyword.value.trim().toLowerCase() : '';
        var t = type ? type.value : '';
        var y = year ? year.value : '';
        cards.forEach(function (card) {
          var hay = (card.getAttribute('data-keywords') || '').toLowerCase();
          var cardType = card.getAttribute('data-type') || '';
          var cardYear = card.getAttribute('data-year') || '';
          var ok = true;
          if (q && hay.indexOf(q) === -1) {
            ok = false;
          }
          if (t && cardType.indexOf(t) === -1) {
            ok = false;
          }
          if (y && cardYear !== y) {
            ok = false;
          }
          card.classList.toggle('hidden-card', !ok);
        });
      };
      [keyword, type, year].forEach(function (el) {
        if (el) {
          el.addEventListener('input', apply);
          el.addEventListener('change', apply);
        }
      });
    }

    var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var poster = shell.querySelector('[data-play]');
      var started = false;
      var start = function () {
        if (!video) {
          return;
        }
        var src = video.getAttribute('data-stream') || '';
        if (!src) {
          return;
        }
        if (!started) {
          started = true;
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(src);
            hls.attachMedia(video);
          } else {
            video.src = src;
          }
        }
        shell.classList.add('playing');
        video.controls = true;
        var playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {});
        }
      };
      if (poster) {
        poster.addEventListener('click', start);
      }
      shell.addEventListener('click', function (event) {
        if (event.target === shell) {
          start();
        }
      });
    });
  });
})();
