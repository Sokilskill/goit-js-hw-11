export default (() => {
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 700 ||
      document.documentElement.scrollTop > 700
    ) {
      document.getElementById('scroll-to-top-btn').classList.add('visible');
    } else {
      document.getElementById('scroll-to-top-btn').classList.remove('visible');
    }
  }
})();
