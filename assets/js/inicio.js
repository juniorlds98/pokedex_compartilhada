function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("open");
}

// Fecha o menu ao clicar em um item
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("#mobileMenu li");
  items.forEach(item => {
    item.addEventListener("click", () => {
      document.getElementById("mobileMenu").classList.remove("open");
    });
  });
});