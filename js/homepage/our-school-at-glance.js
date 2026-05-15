(function () {
  var wrapper = document.getElementById("osgWrapper");
  var video = document.getElementById("osgVideo");
  var playBtn = document.getElementById("osgPlayBtn");
  var pauseArea = document.getElementById("osgPauseArea");

  // Only wire up the video player if all its elements exist on this page
  if (wrapper && video && playBtn && pauseArea) {
    var playingClass = "our-school-glance--playing";

    function playVideo() {
      video.play();
      wrapper.classList.add(playingClass);
    }

    function pauseVideo() {
      video.pause();
      wrapper.classList.remove(playingClass);
    }

    playBtn.addEventListener("click", function () {
      playVideo();
    });

    pauseArea.addEventListener("click", function () {
      pauseVideo();
    });

    // Also restore UI when video ends naturally
    video.addEventListener("ended", function () {
      wrapper.classList.remove(playingClass);
      video.currentTime = 0;
    });
  }

})();
