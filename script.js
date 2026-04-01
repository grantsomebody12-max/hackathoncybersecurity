window.addEventListener("scroll", () => {
  document.querySelector("nav").style.background =
    window.scrollY > 50
      ? "rgba(0,0,0,0.8)"
      : "rgba(0,0,0,0.4)";
});