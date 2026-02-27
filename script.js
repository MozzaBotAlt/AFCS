// Display current date
document.addEventListener('DOMContentLoaded', function() {
  const dateElement = document.getElementById('date');
  if (dateElement) {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    };
    const now = new Date();
    dateElement.textContent = now.toLocaleDateString('en-US', options) + ' UTC';
  }
});
