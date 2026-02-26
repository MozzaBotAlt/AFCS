console.info(
  "Copyright (C) 2025  Ali Mozzabot I, This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions. "
);

document.addEventListener("DOMContentLoaded", function () {
  // no backend server in static mode; just show the current local date
  const now = new Date();
  const dateEl = document.getElementById('date');
  if (dateEl) {
    dateEl.textContent = now.toString();
  }
});
