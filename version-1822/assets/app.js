(function() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function() {
      panel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let index = 0;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function() {
        show(index + 1);
      }, 5200);
    }
  }

  const scopes = document.querySelectorAll('[data-filter-scope]');
  scopes.forEach(function(scope) {
    const input = scope.querySelector('[data-filter-input]');
    const year = scope.querySelector('[data-year-filter]');
    const category = scope.querySelector('[data-category-filter]');
    const cards = Array.from(scope.querySelectorAll('.movie-card'));
    const empty = scope.querySelector('[data-empty-result]');

    function apply() {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const yearValue = year ? year.value : '';
      const categoryValue = category ? category.value : '';
      let visible = 0;

      cards.forEach(function(card) {
        const haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-category'),
          card.getAttribute('data-region'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        const matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        const matchYear = !yearValue || card.getAttribute('data-year') === yearValue;
        const matchCategory = !categoryValue || card.getAttribute('data-category') === categoryValue;
        const keep = matchKeyword && matchYear && matchCategory;
        card.style.display = keep ? '' : 'none';
        if (keep) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', apply);
      const query = new URLSearchParams(window.location.search).get('q');
      if (query) {
        input.value = query;
      }
    }
    if (year) {
      year.addEventListener('change', apply);
    }
    if (category) {
      category.addEventListener('change', apply);
    }
    apply();
  });
}());
