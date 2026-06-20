
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
      var index = 0;
      var timer;

      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }

      function start() {
        clearInterval(timer);
        timer = setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
          start();
        });
      });

      slider.addEventListener('mouseenter', function () {
        clearInterval(timer);
      });
      slider.addEventListener('mouseleave', start);
      show(0);
      start();
    });

    document.querySelectorAll('[data-site-search-box]').forEach(function (box) {
      var input = box.querySelector('[data-site-search]');
      var resultBox = box.querySelector('[data-search-results]');
      var list = window.SiteSearchData || [];
      if (!input || !resultBox || !list.length) {
        return;
      }

      function render(items) {
        if (!items.length) {
          resultBox.innerHTML = '<a href="./categories.html"><span></span><div><strong>没有找到匹配影片</strong><span>进入分类页继续浏览</span></div></a>';
          resultBox.classList.add('is-open');
          return;
        }
        resultBox.innerHTML = items.slice(0, 8).map(function (item) {
          return '<a href="' + item.url + '"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '"><div><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.genre) + '</span></div></a>';
        }).join('');
        resultBox.classList.add('is-open');
      }

      input.addEventListener('input', function () {
        var keyword = input.value.trim().toLowerCase();
        if (!keyword) {
          resultBox.classList.remove('is-open');
          resultBox.innerHTML = '';
          return;
        }
        var matched = list.filter(function (item) {
          return (item.title + ' ' + item.region + ' ' + item.genre + ' ' + item.tags + ' ' + item.year).toLowerCase().indexOf(keyword) !== -1;
        });
        render(matched);
      });

      document.addEventListener('click', function (event) {
        if (!box.contains(event.target)) {
          resultBox.classList.remove('is-open');
        }
      });
    });

    document.querySelectorAll('[data-card-list]').forEach(function (list) {
      var panel = list.parentElement.querySelector('.filter-panel');
      if (!panel) {
        return;
      }
      var input = panel.querySelector('[data-card-search]');
      var region = panel.querySelector('[data-region-filter]');
      var year = panel.querySelector('[data-year-filter]');
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var selectedRegion = region ? region.value : 'all';
        var selectedYear = year ? year.value : 'all';
        cards.forEach(function (card) {
          var haystack = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-year')).toLowerCase();
          var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var okRegion = selectedRegion === 'all' || card.getAttribute('data-region') === selectedRegion;
          var okYear = selectedYear === 'all' || card.getAttribute('data-year') === selectedYear;
          card.classList.toggle('is-hidden-card', !(okKeyword && okRegion && okYear));
        });
      }

      [input, region, year].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
