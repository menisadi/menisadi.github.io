(function () {
  const button = document.getElementById("back-to-top");
  if (!button) return;

  const revealOffset = 320;

  const toggleButton = () => {
    if (window.scrollY > revealOffset) {
      button.classList.add("is-visible");
    } else {
      button.classList.remove("is-visible");
    }
  };

  const scrollToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  button.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", toggleButton, { passive: true });

  toggleButton();
})();
