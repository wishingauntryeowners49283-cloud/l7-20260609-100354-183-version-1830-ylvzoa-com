(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = document.body.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var searchForms = document.querySelectorAll("#siteSearchForm, #heroSearchForm");
    searchForms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = "./search.html";
        }
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length > 1) {
      var current = 0;
      var activate = function (index) {
        current = index;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === current);
        });
      };
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          activate(index);
        });
      });
      window.setInterval(function () {
        activate((current + 1) % slides.length);
      }, 5600);
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll(".local-filter"));
    var items = Array.prototype.slice.call(document.querySelectorAll(".searchable-item"));
    var applyFilter = function (value) {
      var query = String(value || "").trim().toLowerCase();
      items.forEach(function (item) {
        var text = [
          item.getAttribute("data-title"),
          item.getAttribute("data-region"),
          item.getAttribute("data-type"),
          item.getAttribute("data-genre"),
          item.getAttribute("data-year"),
          item.textContent
        ].join(" ").toLowerCase();
        item.classList.toggle("is-hidden", query && text.indexOf(query) === -1);
      });
    };

    var params = new URLSearchParams(window.location.search);
    var queryValue = params.get("q") || "";
    filterInputs.forEach(function (input) {
      if (input.id === "searchPageInput" && queryValue) {
        input.value = queryValue;
      }
      input.addEventListener("input", function () {
        applyFilter(input.value);
      });
    });
    if (queryValue && filterInputs.length) {
      applyFilter(queryValue);
    }

    var sortSelects = Array.prototype.slice.call(document.querySelectorAll(".local-sort"));
    sortSelects.forEach(function (select) {
      select.addEventListener("change", function () {
        var grid = document.querySelector(".sortable-grid");
        if (!grid) {
          return;
        }
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".searchable-item"));
        cards.sort(function (a, b) {
          if (select.value === "title") {
            return String(a.getAttribute("data-title") || "").localeCompare(String(b.getAttribute("data-title") || ""), "zh-CN");
          }
          return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
        });
        cards.forEach(function (card) {
          grid.appendChild(card);
        });
      });
    });

    var player = document.querySelector(".movie-player");
    if (player) {
      var video = player.querySelector(".movie-video");
      var button = player.querySelector(".player-button");
      var message = player.querySelector(".player-message");
      var stream = video ? video.getAttribute("data-stream") : "";
      var attached = false;
      var hlsInstance = null;

      var showMessage = function (text) {
        if (message) {
          message.textContent = text;
          message.hidden = false;
        }
      };

      var attach = function () {
        if (!video || !stream || attached) {
          return;
        }
        attached = true;
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              showMessage("视频加载遇到问题，请稍后再试");
            }
          });
        } else {
          video.src = stream;
        }
      };

      var play = function () {
        attach();
        if (!video) {
          return;
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            showMessage("请再次点击播放按钮开始观看");
          });
        }
      };

      if (button) {
        button.addEventListener("click", play);
      }
      if (video) {
        video.addEventListener("click", function () {
          attach();
        });
        video.addEventListener("play", function () {
          if (button) {
            button.classList.add("hidden");
          }
        });
        video.addEventListener("pause", function () {
          if (button && video.currentTime === 0) {
            button.classList.remove("hidden");
          }
        });
        video.addEventListener("error", function () {
          showMessage("视频加载遇到问题，请稍后再试");
        });
      }

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  });
})();
