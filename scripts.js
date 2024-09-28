document.addEventListener("DOMContentLoaded", function () {
  // Manejo del menú hamburguesa
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");

  // Alternar la visibilidad del menú al hacer clic en el icono
  menuIcon.addEventListener("click", function () {
    navLinks.classList.toggle("show");
  });

  // Obtener todos los enlaces del menú
  const menuLinks = document.querySelectorAll(".navbar ul li a");

  // Añadir evento de clic a cada enlace del menú
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetHref = this.getAttribute("href");

      // Verificar si el enlace es interno (ancla que comienza con '#')
      if (targetHref.startsWith("#")) {
        e.preventDefault(); // Prevenir comportamiento por defecto solo en enlaces internos

        // Cerrar el menú
        navLinks.classList.remove("show");

        // Realizar scroll suave a la sección objetivo
        const targetSection = document.querySelector(targetHref);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop,
            behavior: "smooth",
          });
        }
      } else {
        // Para enlaces externos, cerrar el menú y permitir la navegación normal
        navLinks.classList.remove("show");
        // No prevenir la acción por defecto
      }
    });
  });

  // Cerrar el menú si se hace clic fuera del menú o del ícono del menú
  document.addEventListener("click", function (event) {
    const isClickInsideMenu = navLinks.contains(event.target);
    const isClickOnMenuIcon = menuIcon.contains(event.target);

    if (!isClickInsideMenu && !isClickOnMenuIcon) {
      navLinks.classList.remove("show");
    }
  });

  // Manejo de la lógica para el enlace "Home"
  const homeLink = document.getElementById("home-link");
  homeLink.addEventListener("click", function (event) {
    event.preventDefault();

    if (window.innerWidth <= 768) {
      document
        .getElementById("video-vertical")
        .scrollIntoView({ behavior: "smooth" });
    } else {
      document
        .getElementById("videoVideo")
        .scrollIntoView({ behavior: "smooth" });
    }
  });

  // Limpia el almacenamiento local para mostrar el formulario cada vez que se carga la página
  localStorage.removeItem("formSubmitted");

  // Forzar la reproducción automática de videos
  const videoHorizontal = document.getElementById("videoVideo");
  const videoVertical = document.getElementById("video-vertical");

  if (videoHorizontal) {
    videoHorizontal.play().catch((error) => {
      console.error("Error al reproducir video horizontal:", error);
    });
  }

  if (videoVertical) {
    videoVertical.play().catch((error) => {
      console.error("Error al reproducir video vertical:", error);
    });
  }

  // Inicialmente ocultar los eslóganes
  const sloganContainer = document.querySelector(".slogan-container");
  sloganContainer.style.display = "none";

  // Mostrar eslóganes después de que el formulario se haya mostrado completamente
  const formContainer = document.querySelector(".form-container");

  if (formContainer) {
    formContainer.addEventListener("transitionend", function () {
      setTimeout(function () {
        sloganContainer.style.display = "block";
        sloganContainer.classList.add("delayed-appearance");
      }, 500);
    });
  } else {
    setTimeout(function () {
      sloganContainer.style.display = "block";
      sloganContainer.classList.add("delayed-appearance");
    }, 3500);
  }

  // Efecto parallax en la sección "Conócenos"
  const parallaxContainer = document.getElementById("Conocenos");

  function applyParallaxEffect() {
    const scrolled = window.pageYOffset;
    const limit = parallaxContainer.offsetTop + parallaxContainer.offsetHeight;

    if (scrolled > parallaxContainer.offsetTop && scrolled <= limit) {
      const parallaxSpeed = 0.1;
      parallaxContainer.style.backgroundPositionY = `${
        (scrolled - parallaxContainer.offsetTop) * parallaxSpeed
      }%`;
    }
  }

  // Aplicar el efecto parallax al hacer scroll
  window.addEventListener("scroll", applyParallaxEffect);

  // Formularios
  const closeBtn = document.getElementById("close-btn");

  if (formContainer) {
    closeBtn.addEventListener("click", function () {
      const formPopup = document.getElementById("form");
      formPopup.style.display = "none";
      sloganContainer.style.display = "block";
    });

    formContainer.addEventListener("submit", function (event) {
      event.preventDefault();

      const loadingAnimation = document.getElementById("loading-animation");
      const successMessage = document.getElementById("success-message");

      loadingAnimation.style.display = "block";

      const formData = {
        question1: document.getElementById("nombre").value,
        question2: document.getElementById("email").value,
        question3: document.getElementById("whatsapp").value,
        question4: document.getElementById("proyecto").value,
        question5: document.getElementById("presupuesto").value,
        question6: document.getElementById("financiado").value,
      };

      fetch(
        "https://script.google.com/macros/s/AKfycbyFcwrhHvYB1OEQV2Da6JkU8PzPzLDx2MaVCHzxURRDlPtKJ8pnCHY5n6vcOpO2Rlemag/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then(() => {
          setTimeout(() => {
            loadingAnimation.style.display = "none";
            successMessage.style.display = "block";

            setTimeout(() => {
              successMessage.style.opacity = "0";
              setTimeout(() => {
                successMessage.style.display = "none";
                successMessage.style.opacity = "1";
              }, 1000);
            }, 3500);

            document.getElementById("form").style.display = "none";
            sloganContainer.style.display = "block";
          }, 3500);
        })
        .catch((error) => {
          console.error("Error:", error);
          loadingAnimation.style.display = "none";
          alert("Hubo un error al enviar el formulario.");
        });
    });
  }

  // Sugerencia de dominio de correo electrónico al escribir en los campos de email
  const popularDomains = [
    "gmail.com",
    "hotmail.com",
    "yahoo.com",
    "outlook.com",
  ];
  let isSuggesting = false;

  // Función para aplicar el autocompletado a un campo de email
  function applyEmailAutocomplete(emailInput) {
    emailInput.addEventListener("input", function (event) {
      const value = emailInput.value;
      const atIndex = value.indexOf("@");

      // Si se está sugiriendo o el usuario está borrando, permitir que borre sin interferir
      if (isSuggesting || event.inputType === "deleteContentBackward") {
        isSuggesting = false;
        return;
      }

      // Solo iniciar la sugerencia si hay un "@" en el valor
      if (atIndex > -1) {
        const domainInput = value.slice(atIndex + 1); // Texto después de "@"
        const matchingDomain = popularDomains.find((domain) =>
          domain.startsWith(domainInput)
        );

        // Si se encuentra un dominio que coincide con la entrada, sugerirlo
        if (matchingDomain && domainInput.length > 0) {
          isSuggesting = true;
          const userInput = value.slice(0, atIndex + 1); // Texto antes y hasta "@"
          emailInput.value = userInput + matchingDomain;

          // Desactivar temporalmente la validación del campo para que no interfiera con la sugerencia
          emailInput.setAttribute("type", "text");

          // Seleccionar el texto sugerido para que pueda ser sobrescrito si el usuario continúa escribiendo
          emailInput.setSelectionRange(
            userInput.length + domainInput.length,
            emailInput.value.length
          );

          setTimeout(() => {
            isSuggesting = false;
            // Volver a activar la validación del campo como tipo "email"
            emailInput.setAttribute("type", "email");
          }, 0);
        }
      }
    });

    // Autocompletar cuando se presiona "Tab"
    emailInput.addEventListener("keydown", function (event) {
      if (event.key === "Tab") {
        const value = emailInput.value;
        const atIndex = value.indexOf("@");

        // Si ya hay un "@" pero no hay un dominio completo, autocompletar con "Tab"
        if (atIndex > -1 && !value.slice(atIndex + 1).includes(".")) {
          event.preventDefault(); // Evitar que se realice el tab por defecto
          const userInput = value.slice(0, atIndex);
          const domainInput = value.slice(atIndex + 1);
          const matchingDomain = popularDomains.find((domain) =>
            domain.startsWith(domainInput)
          );

          if (matchingDomain) {
            emailInput.value = userInput + "@" + matchingDomain;
          }
        }
      }
    });
  }

  // Aplica el autocompletado a los campos de email en ambos formularios
  const emailInputPopup = document.getElementById("email"); // Campo de email del formulario emergente (popup)
  const emailInputContactanos = document.getElementById("correo"); // Campo de email del formulario de "Contáctanos"

  // Aplica la funcionalidad de autocompletado a ambos campos, si están presentes
  if (emailInputPopup) {
    applyEmailAutocomplete(emailInputPopup);
  }

  if (emailInputContactanos) {
    applyEmailAutocomplete(emailInputContactanos);
  }

  // Mostrar slogan en pantallas pequeñas después de 4 segundos
  setTimeout(function () {
    if (window.innerWidth <= 768) {
      const sloganContainers = document.querySelectorAll(".slogan-container");
      sloganContainers.forEach(function (sloganContainer) {
        sloganContainer.style.display = "flex";
      });
    }
  }, 4000);
});

window.addEventListener("load", function () {
  setTimeout(function () {
    document.querySelector("header").classList.add("delayed-appearance");
    document.querySelector("footer").classList.add("delayed-appearance");
    document.querySelector(".whatsapp-tab").classList.add("delayed-appearance");
    document.querySelector(".form-popup").classList.add("delayed-appearance");
  }, 3500);
});

// Activar "Leer más" en pantallas pequeñas
function toggleText(button) {
  const parent = button.parentElement;
  const shortText = parent.querySelector(".text-short");
  const fullText = parent.querySelector(".text-full");

  if (fullText.style.display === "none" || fullText.style.display === "") {
    fullText.style.display = "block";
    shortText.style.display = "none";
    button.textContent = "Leer menos";
  } else {
    fullText.style.display = "none";
    shortText.style.display = "block";
    button.textContent = "Leer más...";
  }
}

// Submenús de servicios
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".sub-menu").forEach((submenu) => {
    submenu.style.display = "none";
  });

  document.querySelectorAll(".toggle-icon").forEach((toggle) => {
    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      const parentBox = this.closest(".service-box");
      const submenu = parentBox.querySelector(".sub-menu");
      const arrow = this.querySelector("i");

      document.querySelectorAll(".service-box").forEach((box) => {
        if (box !== parentBox) {
          const boxSubmenu = box.querySelector(".sub-menu");
          if (boxSubmenu) {
            boxSubmenu.style.display = "none";
          }
          box.classList.remove("expanded");
          box.style.height = "190px";
          const boxArrow = box.querySelector(".toggle-icon i");
          if (boxArrow) {
            boxArrow.style.transform = "rotate(0deg)";
          }
        }
      });

      if (submenu.style.display === "none" || submenu.style.display === "") {
        submenu.style.display = "block";
        parentBox.classList.add("expanded");
        parentBox.style.height = "auto";
        arrow.style.transform = "rotate(180deg)";
        submenu.querySelectorAll("ul").forEach((subSubmenu) => {
          subSubmenu.style.display = "none";
        });
      } else {
        submenu.style.display = "none";
        parentBox.classList.remove("expanded");
        parentBox.style.height = "225px";
        arrow.style.transform = "rotate(0deg)";
      }
    });

    toggle.addEventListener("mouseenter", function () {
      const arrow = this.querySelector("i");
      const isExpanded = arrow.style.transform === "rotate(180deg)";
      const animationKeyframes = isExpanded
        ? [
            { transform: "rotate(180deg) translateY(0)" },
            { transform: "rotate(180deg) translateY(-5px)" },
            { transform: "rotate(180deg) translateY(0)" },
          ]
        : [
            { transform: "rotate(0deg) translateY(0)" },
            { transform: "rotate(0deg) translateY(-5px)" },
            { transform: "rotate(0deg) translateY(0)" },
          ];
      arrow.animate(animationKeyframes, {
        duration: 600,
        iterations: 3,
      });
    });
  });

  document.querySelectorAll(".sub-menu h4").forEach((header) => {
    header.addEventListener("click", function (event) {
      event.stopPropagation();
      const subMenu = this.nextElementSibling;
      const arrow = this.querySelector(".toggle-submenu i");

      if (subMenu && subMenu.tagName === "UL") {
        if (subMenu.style.display === "block") {
          subMenu.style.display = "none";
          arrow.style.transform = "rotate(0deg)";
        } else {
          this.parentElement.querySelectorAll("ul").forEach((sub) => {
            sub.style.display = "none";
          });

          subMenu.style.display = "block";
          arrow.style.transform = "rotate(180deg)";
        }
      }
    });
  });

  document.addEventListener("click", function (event) {
    const isClickInsideBox = event.target.closest(".service-box");

    if (!isClickInsideBox) {
      document.querySelectorAll(".service-box").forEach((box) => {
        const submenu = box.querySelector(".sub-menu");
        if (submenu) {
          submenu.style.display = "none";
        }
        box.classList.remove("expanded");
        box.style.height = "190px";
        const arrow = box.querySelector(".toggle-icon i");
        if (arrow) {
          arrow.style.transform = "rotate(0deg)";
        }
      });
    }
  });
});

// Indicador de scroll
document.addEventListener("DOMContentLoaded", function () {
  const scrollIndicator = document.getElementById("scroll-indicator");
  let isScrolling;
  let idleTimer;
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Función para mostrar la flecha con parpadeo
  function showIndicator() {
    scrollIndicator.style.opacity = "1";
    scrollIndicator.classList.add("show");

    let flashCount = 0;
    const flashInterval = setInterval(() => {
      flashCount++;
      if (flashCount <= 3) {
        scrollIndicator.style.opacity = flashCount % 2 === 0 ? "1" : "0"; // Parpadea
      } else {
        clearInterval(flashInterval);
        scrollIndicator.style.opacity = "0"; // Oculta la flecha inmediatamente después de parpadear
        scrollIndicator.classList.remove("show");
      }
    }, 500);
  }

  // Función para verificar la posición del scroll
  function checkScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const footerHeight = 100;

    if (scrollTop + windowHeight < documentHeight - footerHeight) {
      showIndicator(); // Muestra la flecha si no está al final
    } else {
      scrollIndicator.classList.remove("show");
    }
  }

  // Función para gestionar la inactividad
  function startIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      checkScrollPosition(); // Mostrar flecha después de 12 segundos de inactividad
      startIdleTimer(); // Volver a iniciar el temporizador
    }, 12000); // 12 segundos de inactividad
  }

  // Detectar si el usuario se está moviendo
  function detectMovement() {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollTop !== lastScrollTop) {
      clearTimeout(idleTimer); // Reiniciar el temporizador de inactividad al moverse
      startIdleTimer(); // Iniciar el temporizador nuevamente
      lastScrollTop = currentScrollTop; // Actualizar la posición
    }
  }

  // Detectar si el usuario para de hacer scroll
  window.addEventListener("scroll", function () {
    clearTimeout(isScrolling);
    clearTimeout(idleTimer); // Reiniciar el temporizador de inactividad

    isScrolling = setTimeout(() => {
      checkScrollPosition(); // Mostrar flecha cuando se detiene el scroll
      startIdleTimer(); // Iniciar temporizador de inactividad
    }, 2000); // Después de 2 segundos de detenerse

    detectMovement(); // Detectar movimiento del usuario
  });

  // Detectar clics en el menú de navegación
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", function () {
      setTimeout(checkScrollPosition, 500); // Mostrar flecha después de hacer clic en la navegación
    });
  });

  // Detectar envío o cierre del formulario
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function () {
      setTimeout(checkScrollPosition, 500); // Mostrar flecha después de enviar el formulario
    });

    const closeButton = document.querySelector(".close-popup");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        setTimeout(checkScrollPosition, 500); // Mostrar flecha después de cerrar el formulario
      });
    }
  }

  // Mostrar flecha si el usuario para al cargar la página
  checkScrollPosition();
  startIdleTimer(); // Iniciar temporizador de inactividad cuando se carga la página
});

// Efecto zoom
window.addEventListener("scroll", function () {
  const scrollPos = window.pageYOffset;

  // Zoom in on the slogan
  const sloganText = document.querySelector(".slogan1");
  const zoomInFactor = 1 + scrollPos / 8000; // Adjust zoom factor for slogan
  sloganText.style.transform = `scale(${zoomInFactor})`;
});

// Envío del formulario de contacto
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    // Mostrar la animación de carga (opcional)
    document.getElementById("loading-animation").style.display = "block";

    // Capturar los datos del formulario
    var formData = new FormData();
    formData.append("nombre", document.getElementById("nombre1").value); // Usar el id "nombre1" pero enviar como "nombre"
    formData.append("correo", document.getElementById("correo").value);
    formData.append("mensaje", document.getElementById("mensaje").value);

    // Enviar los datos a Google Apps Script
    fetch(
      "https://script.google.com/macros/s/AKfycbzqzfxmZoYygKHuE4OB9vwHjM6tClBX-g4WN8W2TvSQEEyXqDbURIxM23Tcl45JqVVxnQ/exec",
      {
        method: "POST",
        body: formData,
        mode: "no-cors", // Usar no-cors para evitar restricciones de CORS
      }
    )
      .then(() => {
        // Ocultar la animación de carga y mostrar el mensaje de éxito
        document.getElementById("loading-animation").style.display = "none";
        document.getElementById("success-message").style.display = "block";

        // Después de 5 segundos, ocultar el mensaje de éxito
        setTimeout(() => {
          document.getElementById("success-message").style.display = "none";
        }, 5000); // El mensaje de éxito se oculta después de 5 segundos
      })
      .catch((error) => {
        // Ocultar la animación de carga y mostrar el mensaje de error
        document.getElementById("loading-animation").style.display = "none";
        document.getElementById("error-message").style.display = "block";
        document.getElementById("error-message").textContent =
          "Error al enviar: " + error.message;

        console.error("Error al enviar el formulario:", error);
      });

    // Reiniciar el formulario
    document.getElementById("contactForm").reset();
  });
