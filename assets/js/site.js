(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("img").forEach(function (image) {
      image.addEventListener("error", function () {
        image.style.opacity = "0";
      });
    });

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;

      function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          showSlide(index);
        });
      });

      if (slides.length > 1) {
        setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (input && input.value.trim()) {
          form.action = form.getAttribute("action") || "search.html";
        } else if (input) {
          event.preventDefault();
          input.focus();
        }
      });
    });

    var filterList = document.querySelector("[data-filter-list]");

    if (filterList) {
      var cards = Array.prototype.slice.call(filterList.querySelectorAll("[data-movie-card]"));
      var simpleInput = document.querySelector("[data-filter-input]");
      var categorySelect = document.querySelector("[data-category-filter]");
      var yearSelect = document.querySelector("[data-year-filter]");
      var params = new URLSearchParams(window.location.search);
      var queryFromUrl = params.get("q") || "";

      if (simpleInput && queryFromUrl) {
        simpleInput.value = queryFromUrl;
      }

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function applyFilter() {
        var query = normalize(simpleInput ? simpleInput.value : "");
        var category = categorySelect ? categorySelect.value : "";
        var year = yearSelect ? yearSelect.value : "";

        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-filter-text"));
          var cardCategory = card.getAttribute("data-category") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var matchesText = !query || text.indexOf(query) !== -1;
          var matchesCategory = !category || cardCategory === category;
          var matchesYear = !year || cardYear === year;
          card.classList.toggle("is-hidden", !(matchesText && matchesCategory && matchesYear));
        });
      }

      if (simpleInput) {
        simpleInput.addEventListener("input", applyFilter);
      }

      if (categorySelect) {
        categorySelect.addEventListener("change", applyFilter);
      }

      if (yearSelect) {
        yearSelect.addEventListener("change", applyFilter);
      }

      document.querySelectorAll("[data-filter-form], [data-advanced-filter]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          applyFilter();
        });
      });

      applyFilter();
    }
  });
})();
