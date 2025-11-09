// Seleccionamos todos los elementos con clase 'card' del DOM
const cards = document.querySelectorAll('.card');

// Seleccionamos el botón de navegación siguiente
const next = document.querySelector('.next');

// Seleccionamos el botón de navegación anterior
const prev = document.querySelector('.prev');

// Variable que mantiene el índice de la carta actualmente centrada
let current = 0;

// Función principal que actualiza las posiciones y estilos de todas las cartas
function updateCarousel() {
  // Iteramos sobre cada carta del carrusel
  cards.forEach((card, i) => {
    // Calculamos la posición relativa de cada carta respecto a la carta actual
    // El módulo (%) asegura que los valores sean circulares (0 a cards.length-1)
    const offset = (i - current + cards.length) % cards.length;
    
    // Asignamos z-index: la carta más cercana al centro tiene mayor z-index
    // Esto asegura que las cartas más importantes se muestren encima
    card.style.zIndex = cards.length - offset;

    // CARTA CENTRAL (offset = 0)
    if (offset === 0) {
      // La carta activa se centra, tamaño normal, sin rotación
      card.style.transform = `translateX(-50%) scale(1) rotateY(0deg)`;
      card.style.opacity = '1';        // Totalmente visible
      card.style.filter = 'blur(0)';   // Sin desenfoque
    } 
    
    // CARTA INMEDIATA A LA DERECHA (offset = 1)
    else if (offset === 1) {
      // Se mueve a la derecha, ligeramente más pequeña, rotada hacia la izquierda
      card.style.transform = `translateX(70%) scale(0.85) rotateY(-20deg)`;
      card.style.opacity = '0.7';      // Semi-transparente
      card.style.filter = 'blur(1px)'; // Ligeramente desenfocada
    } 
    
    // CARTA INMEDIATA A LA IZQUIERDA (offset = cards.length - 1)
    // Ejemplo: si hay 5 cartas, offset será 4
    else if (offset === cards.length - 1) {
      // Se mueve a la izquierda, ligeramente más pequeña, rotada hacia la derecha
      card.style.transform = `translateX(-170%) scale(0.85) rotateY(20deg)`;
      card.style.opacity = '0.7';      // Semi-transparente
      card.style.filter = 'blur(1px)'; // Ligeramente desenfocada
    } 
    
    // SEGUNDA CARTA A LA DERECHA (offset = 2)
    else if (offset === 2) {
      // Más alejada a la derecha, más pequeña, más rotación
      card.style.transform = `translateX(140%) scale(0.7) rotateY(-30deg)`;
      card.style.opacity = '0.4';      // Más transparente
      card.style.filter = 'blur(3px)'; // Más desenfocada
    } 
    
    // SEGUNDA CARTA A LA IZQUIERDA (offset = cards.length - 2)
    // Ejemplo: si hay 5 cartas, offset será 3  
    else if (offset === cards.length - 2) {
      // Más alejada a la izquierda, más pequeña, más rotación
      card.style.transform = `translateX(-240%) scale(0.7) rotateY(30deg)`;
      card.style.opacity = '0.4'; // Más transparente
      card.style.filter = 'blur(3px)'; // Más desenfocada
    } 
    
    // TODAS LAS DEMÁS CARTAS (más alejadas del centro)
    else {
      // Se ocultan completamente
      card.style.transform = `translateX(-50%) scale(0.5) rotateY(0deg)`;
      card.style.opacity = '0'; // Invisible
      card.style.filter = 'blur(5px)'; // Muy desenfocada
    }
  });
}

next.addEventListener('click', () => {
  // Avanzamos al siguiente índice de forma circular
  // El módulo (%) hace que después del último elemento vuelva al primero
  current = (current + 1) % cards.length;
  updateCarousel(); // Actualizamos las posiciones
});

prev.addEventListener('click', () => {
  // Retrocedemos al índice anterior de forma circular
  // Sumamos cards.length antes del módulo para evitar números negativos
  current = (current - 1 + cards.length) % cards.length;
  updateCarousel(); // Actualizamos las posiciones
});

// Llamada inicial para posicionar las cartas al cargar la página
updateCarousel();