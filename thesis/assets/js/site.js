(function () {
  var hasIO = 'IntersectionObserver' in window;

  if (hasIO) {
    var links = document.querySelectorAll('.bar-nav a[href^="#"]');
    var map = {};
    links.forEach(function (a) {
      var s = document.getElementById(a.getAttribute('href').slice(1));
      if (s) map[s.id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        map[e.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  var book = document.querySelector('.hero .book');
  if (book) {
    if (!hasIO) {
      book.classList.add('turn');
    } else {
      var bo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        book.classList.add('turn');
        bo.disconnect();
      }, { threshold: 0.35 });
      bo.observe(book);
    }
  }
})();
