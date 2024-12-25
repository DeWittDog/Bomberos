document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.querySelector(".calendar-container");
  const calendar = document.getElementById("calendar");
  const startButton = document.getElementById("start");
  const usernameInput = document.getElementById("username");
  const welcomeMessage = document.getElementById("welcome-message");
  const submitButton = document.getElementById("submit");

  const maxDaysPerPerson = 4;
  const maxQuotaPerDay = 5;

  // Estado del sistema
  const daysState = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    quota: 0,
    selectedBy: [], // Almacena los nombres de los usuarios que seleccionaron este día
  }));
  let selectedDays = [];
  let currentUser = "";

  // Iniciar sesión con nombre
  startButton.addEventListener("click", function () {
    const username = usernameInput.value.trim();
    if (!username) {
      alert("Por favor, ingrese su nombre.");
      return;
    }
    currentUser = username;
    welcomeMessage.textContent = `Hola, ${currentUser}. Selecciona tus días:`;
    calendarContainer.style.display = "block";
    generateCalendar();
  });

  // Generar el calendario
  function generateCalendar() {
    calendar.innerHTML = ""; // Limpiar el calendario existente
    daysState.forEach((dayState) => {
      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.textContent = dayState.day;
      dayElement.dataset.day = dayState.day;

      const quotaElement = document.createElement("span");
      quotaElement.className = "quota";
      quotaElement.textContent = `(${dayState.quota}/${maxQuotaPerDay})`;
      dayElement.appendChild(quotaElement);

      if (dayState.quota >= maxQuotaPerDay) {
        dayElement.classList.add("disabled");
      } else if (dayState.selectedBy.includes(currentUser)) {
        dayElement.classList.add("selected");
      }

      dayElement.addEventListener("click", function () {
        handleDaySelection(dayState, dayElement);
      });

      calendar.appendChild(dayElement);
    });
  }

  // Manejar la selección de días
  function handleDaySelection(dayState, dayElement) {
    if (dayState.quota >= maxQuotaPerDay && !dayState.selectedBy.includes(currentUser)) {
      alert("Este día ya alcanzó el cupo máximo.");
      return;
    }

    if (selectedDays.includes(dayState.day)) {
      // Deseleccionar
      selectedDays = selectedDays.filter((day) => day !== dayState.day);
      dayElement.classList.remove("selected");
      dayState.quota -= 1;
      dayState.selectedBy = dayState.selectedBy.filter((user) => user !== currentUser);
    } else {
      if (selectedDays.length >= maxDaysPerPerson) {
        alert(`Solo puedes seleccionar hasta ${maxDaysPerPerson} días.`);
        return;
      }
      // Seleccionar
      selectedDays.push(dayState.day);
      dayElement.classList.add("selected");
      dayState.quota += 1;
      dayState.selectedBy.push(currentUser);
    }

    // Actualizar la cuota visualmente
    dayElement.querySelector(".quota").textContent = `(${dayState.quota}/${maxQuotaPerDay})`;
  }

  // Manejar el envío del formulario
  submitButton.addEventListener("click", function () {
    if (selectedDays.length === 0) {
      alert("Debe seleccionar al menos un día.");
      return;
    }
    alert(`Usuario: ${currentUser}\nDías seleccionados: ${selectedDays.join(", ")}`);
    // Aquí puedes enviar los datos al servidor o almacenarlos de forma persistente
  });
});

