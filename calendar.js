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
    selectedBy: [], // Usuarios que seleccionaron este día
  }));
  let selectedDays = [];
  let currentUser = "";
  const registeredUsers = loadRegisteredUsers(); // Cargar usuarios registrados

  // Obtener el mes actual
  const currentMonth = new Date().getMonth() + 1; // Enero = 0, así que sumamos 1

  // Cargar usuarios registrados desde localStorage
  function loadRegisteredUsers() {
    const data = JSON.parse(localStorage.getItem("registeredUsers")) || {};
    const storedMonth = data.month;
    const users = data.users || [];

    // Si el mes almacenado no coincide con el mes actual, reiniciar
    if (storedMonth !== currentMonth) {
      return { month: currentMonth, users: new Set() };
    }

    return { month: storedMonth, users: new Set(users) };
  }

  // Guardar usuarios registrados en localStorage
  function saveRegisteredUsers() {
    const data = {
      month: currentMonth,
      users: Array.from(registeredUsers.users),
    };
    localStorage.setItem("registeredUsers", JSON.stringify(data));
  }

  // Manejo del botón "Iniciar"
  startButton.addEventListener("click", function () {
    const username = usernameInput.value.trim(); // Eliminar espacios
    if (!username) {
      alert("Por favor, ingrese su nombre.");
      return;
    }

    // Verificar si el usuario ya está registrado
    if (registeredUsers.users.has(username)) {
      alert(`El usuario "${username}" ya se ha registrado este mes. No puede inscribirse nuevamente.`);
      return;
    }

    currentUser = username; // Guardar nombre del usuario
    welcomeMessage.textContent = `Hola, ${currentUser}. Selecciona tus días:`;
    calendarContainer.style.display = "block"; // Mostrar calendario
    generateCalendar(); // Generar calendario dinámico
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
    
    // Agregar el usuario a la lista de registrados
    registeredUsers.users.add(currentUser);
    saveRegisteredUsers(); // Guardar el estado actualizado

    // Reiniciar la selección para el siguiente usuario
    currentUser = "";
    selectedDays = [];
    usernameInput.value = "";
    calendarContainer.style.display = "none";
  });
});

