const botones = document.querySelectorAll(".btn-abrir");
const overlays = document.querySelectorAll(".overlay");
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

// Enviar formulario
const formulario = document.querySelector(".form-valoracion");
formulario.addEventListener("submit", (e) => {
  // Previene el envio del formulario
  e.preventDefault();

  //Recibe los datos cargados en los inputs del formulario
  const horas = formulario.horas.value;
  const completado = formulario.completado.value;
  const reseña = formulario.reseña.value;

  // Publica en la consola los datos ingresados por el usuario
  console.log("Valoración:", valorSeleccionado);
  console.log("Horas jugadas:", horas);
  console.log("Completado:", completado);
  console.log("Reseña:", reseña);

  //Alerta al usuario de que sus datos fueron cargados correctamente y resetea el formulario
  alert("¡Gracias por tu valoración!");
  formulario.reset();
  estrellas.forEach(e => e.classList.remove("active"));
  // Reseteamos valor de variable a 0
  valorSeleccionado = 0;
});