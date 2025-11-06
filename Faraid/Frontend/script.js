document.addEventListener('DOMContentLoaded', function() {
    baseurl='localhost:8000'

    fetch(baseurl)
        .then(response => console.log(response))
        .catch(err => console.error(err));

    fetch(baseurl + api/data)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});