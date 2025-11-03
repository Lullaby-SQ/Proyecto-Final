const botones = document.querySelectorAll(".btn-abrir");
const overlays = document.querySelectorAll(".overlay-biblioteca");
const body = document.body;
const cerrarBtns = document.querySelectorAll(".btn-cerrar");

// Abrir modal - COn ligera animación
botones.forEach((boton, index) => {
  boton.addEventListener("click", function () {
    overlays[index].style.display = "flex";
    body.style.overflow = "hidden";
    setTimeout(() => overlays[index].style.opacity = "1", 10);
  });
});

// Cerrar modal - Con ligera animación
cerrarBtns.forEach((cerrarBtn, index) => {
  cerrarBtn.addEventListener("click", function () {
    overlays[index].style.opacity = "0";
    body.style.overflow = "auto";
    setTimeout(() => overlays[index].style.display = "none", 500);
  });
});

// Valoración por estrellas
const estrellas = document.querySelectorAll(".estrella");
// Reseteamos valor de variable a 0
let valorSeleccionado = 0;
estrellas.forEach((estrella, index) => {
  estrella.addEventListener("click", () => {
    // Guarda el numero de estrellas en una variable, en la cual la variable será la posicion + 1 ya que la posición de una lista empieza en 0
    valorSeleccionado = index + 1;
    // Recorre las estrellas y le aplica la clase "active" a toda aquella cuya posición sea menor o igual a la posición de la estrella clickeada
    estrellas.forEach((e, i) => e.classList.toggle("active", i <= index));
  });
});
