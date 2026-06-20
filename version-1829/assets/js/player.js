
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    document.querySelectorAll('[data-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var mask = player.querySelector('.play-mask');
      var src = video ? video.getAttribute('data-stream') : '';
      var attached = false;
      var hls;

      if (!video || !src) {
        return;
      }

      function attach() {
        if (attached) {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
        attached = true;
      }

      function play() {
        attach();
        if (mask) {
          mask.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            if (mask) {
              mask.classList.remove('is-hidden');
            }
          });
        }
      }

      if (mask) {
        mask.addEventListener('click', play);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });

      video.addEventListener('play', function () {
        if (mask) {
          mask.classList.add('is-hidden');
        }
      });

      video.addEventListener('ended', function () {
        if (mask) {
          mask.classList.remove('is-hidden');
        }
      });

      window.addEventListener('beforeunload', function () {
        if (hls && typeof hls.destroy === 'function') {
          hls.destroy();
        }
      });
    });
  });
})();
