(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function setupMobileNavigation() {
    var button = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHeroCarousel() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var previous = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function setupFiltering() {
    var scope = document.querySelector('[data-filter-scope]');
    var list = document.querySelector('[data-filter-list]');
    if (!scope || !list) {
      return;
    }
    var input = scope.querySelector('[data-filter-input]');
    var typeSelect = scope.querySelector('[data-filter-type]');
    var categorySelect = scope.querySelector('[data-filter-category]');
    var resultCount = document.querySelector('[data-result-count]');
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);

    if (input && params.get('q')) {
      input.value = params.get('q');
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var query = normalize(input ? input.value : '');
      var type = normalize(typeSelect ? typeSelect.value : '');
      var category = normalize(categorySelect ? categorySelect.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var searchText = normalize(card.getAttribute('data-search'));
        var cardType = normalize(card.getAttribute('data-type'));
        var cardCategory = normalize(card.getAttribute('data-category'));
        var matchQuery = !query || searchText.indexOf(query) !== -1;
        var matchType = !type || cardType.indexOf(type) !== -1;
        var matchCategory = !category || cardCategory === category;
        var shouldShow = matchQuery && matchType && matchCategory;
        card.classList.toggle('is-hidden', !shouldShow);
        if (shouldShow) {
          visible += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = '共 ' + visible + ' 部影片';
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', applyFilter);
    }
    if (categorySelect) {
      categorySelect.addEventListener('change', applyFilter);
    }
    applyFilter();
  }

  function setupPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]'));
    shells.forEach(function (shell) {
      var video = shell.querySelector('video[data-hls-src]');
      var button = shell.querySelector('[data-player-button]');
      if (!video) {
        return;
      }
      var source = video.getAttribute('data-hls-src');
      var hlsInstance = null;
      var isReady = false;

      function prepareSource() {
        if (isReady || !source) {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          video.src = source;
        }
        isReady = true;
      }

      function playVideo() {
        prepareSource();
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            shell.classList.remove('is-playing');
          });
        }
      }

      prepareSource();

      if (button) {
        button.addEventListener('click', function () {
          shell.classList.add('is-playing');
          playVideo();
        });
      }

      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });

      video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
          shell.classList.remove('is-playing');
        }
      });

      video.addEventListener('ended', function () {
        shell.classList.remove('is-playing');
      });

      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    setupMobileNavigation();
    setupHeroCarousel();
    setupFiltering();
    setupPlayers();
  });
})();
