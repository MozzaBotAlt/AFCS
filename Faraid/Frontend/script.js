console.info(
  "Copyright (C) 2025  Ali Mozzabot I, This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions. "
);

document.addEventListener("DOMContentLoaded", function () {
  
  const baseurl = "https://localhost:8000";

  fetch(baseurl)
    .then((response) => console.log(response))
    .catch((err) => console.error(err));

  async function fetchDate() {
    try {
      const res = await fetch(baseurl + "/date");
      const data = await res.json();
      console.log(data);
      const date = new Date(data.date);
      if (isNaN(date)) {
        document.getElementById("date").textContent = "Invalid date received";
      } else {
        document.getElementById("date").textContent = date.toString();
      }
      console.log(date);
    } catch (error) {
      console.error(error);
    }
  }
  fetchDate();
});
