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

  var DEFAULT_ENDPOINT = 'https://thesis-signup.pages.dev/api/subscribe';
  var form = document.getElementById('signup');
  if (!form || !window.fetch || !window.JSON) return;
  var endpoint = form.getAttribute('data-endpoint') || DEFAULT_ENDPOINT;
  var status = form.querySelector('.signup-status');
  var btn = form.querySelector('[type="submit"]');
  var email = form.elements.email;
  var FAIL = 'Something went wrong. Please try again later.';
  var OFFLINE = 'We couldn’t reach the sign-up service. Please try again later. The Toolkit is free to download either way.';
  var MSG = {
    200: 'Thanks — you’re signed up.',
    503: 'Sign-up is temporarily unavailable. The Toolkit is free to download either way.',
    429: 'Too many tries. Please wait a few minutes and try again.',
    400: 'Please check your email address and tick at least one topic.'
  };

  function say(text, isError) {
    status.textContent = text;
    status.classList.toggle('is-error', !!isError);
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var boxes = form.querySelectorAll('input[name="topics"]');
    var topics = [];
    boxes.forEach(function (b) { if (b.checked) topics.push(b.value); });
    email.removeAttribute('aria-invalid');

    if (!topics.length) {
      say('Please tick at least one topic.', true);
      boxes[0].focus();
      return;
    }
    email.value = email.value.trim();
    if (!email.value || !email.checkValidity()) {
      email.setAttribute('aria-invalid', 'true');
      say('Please enter a valid email address.', true);
      email.focus();
      return;
    }

    say('');
    btn.disabled = true;
    fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        first_name: form.elements.first_name.value.trim(),
        topics: topics,
        company: form.elements.company.value
      })
    }).then(function (res) {
      say(MSG[res.status] || FAIL, res.status !== 200);
      if (res.status === 200) form.reset();
    }, function () {
      say(OFFLINE, true);
    }).then(function () {
      btn.disabled = false;
    });
  });
})();
