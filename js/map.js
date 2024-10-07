// Fetch My IP details
async function getMyIPDetails() {
    const resultDiv = document.getElementById('myipResult');
    const mapDiv = document.getElementById('map');
    const spinner = document.getElementById('myipSpinner'); // Ensure spinner is present

    resultDiv.innerHTML = '';
    mapDiv.style.display = 'none';  // Hide map initially
    spinner.style.display = 'block';  // Show spinner

    try {
        const response = await fetch('https://ipapi.co/json/');  // You can replace with any other IP geolocation API
        const data = await response.json();
        spinner.style.display = 'none';  // Hide spinner after data is fetched

        if (data.error) {
            resultDiv.innerHTML = `<span class="error">${data.reason}</span>`;
        } else {
            const { ip, city, region, country_name, latitude, longitude, org } = data;

            resultDiv.innerHTML = `
                <p>My Public IPv4: ${ip}</p>
                <p>Location: ${city}, ${region}, ${country_name}</p>
                <p>ISP: ${org}</p>
                <p>Coordinates: ${latitude}, ${longitude}</p>
            `;

            // Show the map and set the location
            mapDiv.style.display = 'block';
            showMap(latitude, longitude);
        }
    } catch (error) {
        spinner.style.display = 'none';  // Hide spinner on error
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}
// Function to show map
function showMap(lat, lon) {
    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup(`Your location: ${lat}, ${lon}`)
        .openPopup();
}