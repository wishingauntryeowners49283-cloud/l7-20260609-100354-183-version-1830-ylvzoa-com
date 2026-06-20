(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var toggle = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
    }

    var slides = selectAll(".hero-slide");
    var dots = selectAll(".hero-dot");
    if (slides.length > 1) {
        var current = 0;
        function showSlide(index) {
            slides[current].classList.remove("active");
            dots[current].classList.remove("active");
            current = (index + slides.length) % slides.length;
            slides[current].classList.add("active");
            dots[current].classList.add("active");
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    function normalize(text) {
        return String(text || "").toLowerCase().trim();
    }

    function renderSearch(form, query) {
        var box = form.querySelector(".search-results");
        if (!box) {
            return;
        }
        var q = normalize(query);
        if (!q || !window.SEARCH_INDEX) {
            box.classList.remove("open");
            box.innerHTML = "";
            return;
        }
        var hits = window.SEARCH_INDEX.filter(function (item) {
            var text = normalize([item.title, item.year, item.region, item.type, item.genre, item.tags].join(" "));
            return text.indexOf(q) !== -1;
        }).slice(0, 10);
        if (!hits.length) {
            box.innerHTML = '<a href="./categories.html">没有匹配结果，浏览全部分类</a>';
            box.classList.add("open");
            return;
        }
        box.innerHTML = hits.map(function (item) {
            return '<a href="' + item.url + '"><strong>' + item.title + '</strong><br><span>' + item.year + ' · ' + item.region + ' · ' + item.type + '</span></a>';
        }).join("");
        box.classList.add("open");
    }

    selectAll(".site-search-form").forEach(function (form) {
        var input = form.querySelector(".global-search-input");
        if (!input) {
            return;
        }
        input.addEventListener("input", function () {
            renderSearch(form, input.value);
        });
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            if (input.value.trim()) {
                renderSearch(form, input.value);
            }
        });
        document.addEventListener("click", function (event) {
            if (!form.contains(event.target)) {
                var box = form.querySelector(".search-results");
                if (box) {
                    box.classList.remove("open");
                }
            }
        });
    });

    var filterGrid = document.querySelector(".filter-grid");
    if (filterGrid) {
        var cards = selectAll(".movie-card", filterGrid);
        var search = document.querySelector(".local-search");
        var year = document.querySelector(".local-year");
        var type = document.querySelector(".local-type");
        var sort = document.querySelector(".local-sort");
        var empty = document.querySelector(".empty-state");

        function cardText(card) {
            return normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-year"),
                card.getAttribute("data-type"),
                card.getAttribute("data-region"),
                card.getAttribute("data-tags")
            ].join(" "));
        }

        function updateFilter() {
            var q = normalize(search && search.value);
            var y = year ? year.value : "all";
            var t = type ? type.value : "all";
            var visible = 0;
            cards.forEach(function (card) {
                var ok = true;
                if (q && cardText(card).indexOf(q) === -1) {
                    ok = false;
                }
                if (y !== "all" && card.getAttribute("data-year") !== y) {
                    ok = false;
                }
                if (t !== "all" && card.getAttribute("data-type") !== t) {
                    ok = false;
                }
                card.style.display = ok ? "" : "none";
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("open", visible === 0);
            }
        }

        function sortCards() {
            var mode = sort ? sort.value : "default";
            var ordered = cards.slice();
            if (mode === "year") {
                ordered.sort(function (a, b) {
                    return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
                });
            }
            if (mode === "title") {
                ordered.sort(function (a, b) {
                    return a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"), "zh-Hans-CN");
                });
            }
            ordered.forEach(function (card) {
                filterGrid.appendChild(card);
            });
            cards = ordered;
            updateFilter();
        }

        [search, year, type].forEach(function (el) {
            if (el) {
                el.addEventListener("input", updateFilter);
                el.addEventListener("change", updateFilter);
            }
        });
        if (sort) {
            sort.addEventListener("change", sortCards);
        }
    }
}());
