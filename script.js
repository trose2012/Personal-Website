const burger = document.querySelector(".burgerDiv");
const nav = document.querySelector(".elements");

function toggler() {
  nav.classList.toggle("active");
  burger.classList.toggle("active");
}

burger.addEventListener("click", toggler);