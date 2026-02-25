console.info(
  "Copyright (C) 2025  Ali Mozzabot I, This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions. "
);

document.addEventListener("DOMContentLoaded", function () {
  
  const baseurl = "https://localhost:8000";
  
  fetch(baseurl, {
    method: "GET",
  })
    .then(response => {
    // Log status code and status text
      if (response.status == 200) {
        console.log(`Status Code: ${response.status}, OK`);
      } else { console.warn(`Status Code: ${response.status}, Error`); }
  })
    .catch(error => {
      console.error('Error fetching base URL:', error);
    });

  // Async function to fetch the date
  async function fetchDate() {
    try {
      const res = await fetch(baseurl + 'api/date');
      const data = await res.json();
      console.log(data);
      const date = new Date(data.date);
      if (isNaN(date)) {
        document.getElementById('date').textContent = 'Invalid date received';
      } else {
        document.getElementById('date').textContent = date.toString();
      }
      console.log(date)
    } catch (error) { console.error(error); }
  }
  fetchDate();
});
