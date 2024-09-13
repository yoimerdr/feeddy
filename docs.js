(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var url = location.href;
    var index = url.lastIndexOf('/');
    if (index === -1)
      return;

    var name = url.substring(index + 1);
    if (!name)
      return;

    if (!name.endsWith(".html") || name === 'index.html')
      return;
    var current = document.querySelector('.tsd-navigation a[href="' + name + '"]')
    if (!current)
      return;

    current.classList.add('current');

    var menu = document.querySelector("div.site-menu");
    if (!menu)
      return;

    menu.scrollTo({
      top: current.offsetTop - current.clientHeight,
      behavior: 'smooth',
    })
  })
})()
