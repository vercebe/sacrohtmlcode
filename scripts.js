document.addEventListener("DOMContentLoaded", function () {
  // Manejo del menú hamburguesa
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");

  // Alternar la visibilidad del menú al hacer clic en el icono
  menuIcon.addEventListener("click", function () {
    navLinks.classList.toggle("show");
  });

  // Cerrar el menú al hacer clic en cualquier enlace del menú
  const menuLinks = document.querySelectorAll(".navbar ul li a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.classList.remove("show");
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
      const parallaxSpeed = window.innerWidth < 768 ? 0.1 : 0.1;
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

  // Sugerencia de dominio de correo electrónico al escribir en el campo de email
  const emailInput = document.getElementById("email");
  const popularDomains = [
    "gmail.com",
    "hotmail.com",
    "yahoo.com",
    "outlook.com",
  ];
  let isSuggesting = false;

  emailInput.addEventListener("input", function (event) {
    const value = emailInput.value;
    const atIndex = value.indexOf("@");

    if (isSuggesting || event.inputType === "deleteContentBackward") {
      isSuggesting = false;
      return;
    }

    if (atIndex > -1) {
      const domainInput = value.slice(atIndex + 1);
      const matchingDomain = popularDomains.find((domain) =>
        domain.startsWith(domainInput)
      );

      if (matchingDomain && domainInput.length > 0) {
        isSuggesting = true;
        const userInput = value.slice(0, atIndex + 1);
        emailInput.value = userInput + matchingDomain;

        emailInput.setSelectionRange(
          userInput.length + domainInput.length,
          emailInput.value.length
        );

        setTimeout(() => {
          isSuggesting = false;
        }, 0);
      }
    }
  });

  // Autocompletar cuando se presiona "Tab"
  emailInput.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      const value = emailInput.value;
      const atIndex = value.indexOf("@");

      if (atIndex > -1 && !value.slice(atIndex + 1).includes(".")) {
        event.preventDefault();
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

  // Smooth scroll para enlaces de navegación
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetID = this.getAttribute("href");
      const targetSection = document.querySelector(targetID);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

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

//activar leer más pantallas pequeñas
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

//submenus servicios
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
