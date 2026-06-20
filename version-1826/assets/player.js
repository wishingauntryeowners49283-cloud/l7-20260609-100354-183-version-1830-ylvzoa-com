(function() {
  function mountPlayer(box) {
    var video = box.querySelector('video');
    var cover = box.querySelector('.player-cover');
    var source = video ? video.getAttribute('data-video') : '';
    var hls;
    var loaded = false;
    function load() {
      if (!video || !source) {
        return;
      }
      if (!loaded) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        loaded = true;
      }
      if (cover) {
        cover.classList.add('hide');
      }
      video.controls = true;
      var playResult = video.play();
      if (playResult && playResult.catch) {
        playResult.catch(function() {});
      }
    }
    if (cover) {
      cover.addEventListener('click', load);
    }
    if (video) {
      video.addEventListener('click', function() {
        if (!loaded || video.paused) {
          load();
        }
      });
      video.addEventListener('play', function() {
        if (cover) {
          cover.classList.add('hide');
        }
      });
    }
    window.addEventListener('beforeunload', function() {
      if (hls) {
        hls.destroy();
      }
    });
  }
  Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(mountPlayer);
})();
