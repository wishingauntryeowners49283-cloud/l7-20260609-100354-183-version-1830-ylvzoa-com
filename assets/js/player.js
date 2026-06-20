(function () {
  window.initPlayer = function (video, url) {
    if (!video || !url) {
      return;
    }

    var cover = document.querySelector("[data-player-cover]");
    var button = document.querySelector("[data-play-button]");

    function hideCover() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    }

    function startVideo() {
      hideCover();
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }

    if (button) {
      button.addEventListener("click", startVideo);
    }

    if (cover) {
      cover.addEventListener("click", startVideo);
    }

    video.addEventListener("play", hideCover);
  };
})();
