(function () {
  var menuButton = document.querySelector('.mobile-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('.js-filter-input');
  var filterType = document.querySelector('.js-filter-type');
  var filterYear = document.querySelector('.js-filter-year');
  var filterCategory = document.querySelector('.js-filter-category');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card[data-filter-text]'));
  var emptyState = document.querySelector('.empty-state');

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function filterCards() {
    var keyword = normalize(filterInput && filterInput.value);
    var typeValue = normalize(filterType && filterType.value);
    var yearValue = normalize(filterYear && filterYear.value);
    var categoryValue = normalize(filterCategory && filterCategory.value);
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-filter-text'));
      var type = normalize(card.getAttribute('data-type'));
      var year = normalize(card.getAttribute('data-year'));
      var category = normalize(card.getAttribute('data-category'));
      var matched = true;

      if (keyword && text.indexOf(keyword) === -1) {
        matched = false;
      }

      if (typeValue && type.indexOf(typeValue) === -1) {
        matched = false;
      }

      if (yearValue && year !== yearValue) {
        matched = false;
      }

      if (categoryValue && category.indexOf(categoryValue) === -1) {
        matched = false;
      }

      card.classList.toggle('hidden-by-filter', !matched);

      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.style.display = visible ? 'none' : 'block';
    }
  }

  [filterInput, filterType, filterYear, filterCategory].forEach(function (item) {
    if (item) {
      item.addEventListener('input', filterCards);
      item.addEventListener('change', filterCards);
    }
  });
})();
