
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.src;
          lazyImage.srcset = lazyImage.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to event handlers here
  }
});



document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});



document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
});







    let editions_iphone_hide = document.querySelector(".editions_iphone_hide");
    window.addEventListener("scroll", function () {
      editions_iphone_hide.style.opacity = 1 - +window.pageYOffset / 250 + "";
    });






// active class of menu items onscroll
window.addEventListener('scroll', () => {
    let scrollDistance = window.scrollY;

        document.querySelectorAll('.section').forEach((el, i) => {
            if (el.offsetTop - document.querySelector('nav').clientHeight <= scrollDistance) {
                document.querySelectorAll('nav ul li a.text-opacity-50').forEach((el) => {
                    if (el.classList.contains('active_menu')) {
                        el.classList.remove('active_menu');
                    }
                });

                document.querySelectorAll('nav ul li')[i].querySelector('a.text-opacity-50').classList.add('active_menu');
            }
        });
});







window.addEventListener('scroll', () => {
    let scrollDistanceNav_opis = window.scrollY;

        document.querySelectorAll('.section').forEach((el, i) => {
            if (el.offsetTop - document.querySelector('.nav_opis').clientHeight <= scrollDistanceNav_opis) {
                document.querySelectorAll('.nav_opis span').forEach((el) => {
                    if (el.classList.contains('active_opis')) {
                        el.classList.remove('active_opis');
                    }
                });

                document.querySelectorAll('.nav_opis div')[i].querySelector('span').classList.add('active_opis');
            }
        });
});
