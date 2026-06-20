(function() {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function() {
      mobilePanel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
  var current = 0;
  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }
  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showSlide(index);
    });
  });
  if (slides.length > 1) {
    showSlide(0);
    setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  var filterForm = document.querySelector('[data-filter-form]');
  if (filterForm) {
    var keyword = filterForm.querySelector('[data-filter-keyword]');
    var region = filterForm.querySelector('[data-filter-region]');
    var year = filterForm.querySelector('[data-filter-year]');
    var genre = filterForm.querySelector('[data-filter-genre]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var empty = document.querySelector('.no-result');
    var query = new URLSearchParams(window.location.search).get('q') || '';
    if (keyword && query) {
      keyword.value = query;
    }
    function match(card) {
      var text = [card.dataset.title, card.dataset.region, card.dataset.year, card.dataset.genre, card.dataset.category].join(' ').toLowerCase();
      var q = keyword ? keyword.value.trim().toLowerCase() : '';
      var r = region ? region.value : '';
      var y = year ? year.value : '';
      var g = genre ? genre.value : '';
      return (!q || text.indexOf(q) !== -1) && (!r || card.dataset.region === r) && (!y || card.dataset.year === y) && (!g || card.dataset.genre.indexOf(g) !== -1);
    }
    function applyFilter() {
      var visible = 0;
      cards.forEach(function(card) {
        var ok = match(card);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }
    filterForm.addEventListener('input', applyFilter);
    filterForm.addEventListener('change', applyFilter);
    filterForm.addEventListener('submit', function(event) {
      event.preventDefault();
      applyFilter();
    });
    applyFilter();
  }
})();
