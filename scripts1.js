let currentSlideIndex = 0;
const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
const totalSlides = slides.length;

// Función para mover al slide específico
const moveToSlide = (index) => {
  const offset = index * -100;
  track.style.transform = `translateX(${offset}%)`;

  // Actualizar la clase active
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
};

// Función para avanzar al siguiente slide automáticamente
const autoSlide = () => {
  currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
  moveToSlide(currentSlideIndex);
};

// Avanzar automáticamente cada 5 segundos
setInterval(autoSlide, 9000);

// Opcionales: botones de control
const prevButton = document.querySelector(".carousel-control.prev");
const nextButton = document.querySelector(".carousel-control.next");

prevButton.addEventListener("click", () => {
  currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
  moveToSlide(currentSlideIndex);
});

nextButton.addEventListener("click", () => {
  currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
  moveToSlide(currentSlideIndex);
});
