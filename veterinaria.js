document.addEventListener('DOMContentLoaded', function() {
  var elemsCarousel = document.querySelectorAll('.carousel');
  M.Carousel.init(elemsCarousel, {
    fullWidth: true,
    indicators: true
  });
  var elemsSidenav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elemsSidenav);
});
