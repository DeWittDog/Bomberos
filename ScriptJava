document.addEventListener("DOMContentLoaded", function () {
  const calendar = document.getElementById("calendar");
  const submitButton = document.getElementById("submit");
  const maxDaysPerPerson = 4;
  const maxQuotaPerDay = 5;

  // Estado del calendario
  const daysState = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    quota: 0, // Personas inscritas en este día
  }));
  let selectedDays = [];

  // Generar calendario
  daysState.forEach((dayState, index) => {
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.textContent = dayState.day;
    dayElement.dataset.day = dayState.day;

    const quotaElement = document.createElement("span");
    quotaElement.className = "quota";
    quotaElement.textContent = `(${dayState.quota}/${maxQuotaPerDay})`;
    dayElement.appendChild(quotaElement);

    dayElement.addEventListener("click", function () {
      handleDaySelection(dayState, dayElement);
    });

    calendar.appendChild(dayElement);
  });

  // Manejar la selección de días
  function handleDaySelection(dayState, dayElement) {
    if (dayState.quota >= maxQuotaPerDay) {
      alert("Este día ya alcanzó el cupo máximo.");
      return;
    }

    if (selectedDays.includes(dayState.day)) {
      // Deseleccionar
      selectedDays = selectedDays.filter((day) => day !== dayState.day);
      dayElement.classList.remove("selected");
      dayState.quota -= 1;
    } else {
      if (selectedDays.length >= maxDaysPerPerson) {
        alert(`Solo puedes seleccionar hasta ${maxDaysPerPerson} días.`);
        return;
      }
      // Seleccionar
      selectedDays.push(dayState.day);
      dayElement.classList.add("selected");
      dayState.quota += 1;
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
    alert(`Días seleccionados: ${selectedDays.join(", ")}`);
    // Aquí puedes enviar los datos al servidor
  });
});
