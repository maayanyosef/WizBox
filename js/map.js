// Fetch My IP details with fallback to a different provider
async function getMyIPDetails() {
    const resultDiv = document.getElementById('myipResult');
    const mapDiv = document.getElementById('map');
    const spinner = document.getElementById('myipSpinner'); // Ensure spinner is present

    resultDiv.innerHTML = '';
    mapDiv.style.display = 'none';  // Hide map initially
    spinner.style.display = 'block';  // Show spinner

    try {
        // Use ipwho.is as the primary provider (supports CORS)
        const response = await fetch('https://ipwho.is/');
        if (!response.ok) {
            throw new Error(`Primary provider failed with status: ${response.status}`);
        }
        const data = await response.json();
        spinner.style.display = 'none';  // Hide spinner after data is fetched
        displayIPDetails(data);
    } catch (error) {
        console.error('Primary IP provider failed, switching to backup.', error);

        // If the primary provider fails, try the backup provider (api64.ipify.org)
        try {
            const backupResponse = await fetch('https://api64.ipify.org?format=json');
            if (!backupResponse.ok) {
                throw new Error(`Backup provider failed with status: ${backupResponse.status}`);
            }
            const backupData = await backupResponse.json();
            spinner.style.display = 'none';  // Hide spinner after data is fetched
            displayBackupIPDetails(backupData); // Display data from backup provider
        } catch (backupError) {
            spinner.style.display = 'none';  // Hide spinner on error
            resultDiv.innerHTML = `<span class="error">Error: Unable to fetch IP details from both providers.</span>`;
            console.error('Both IP providers failed.', backupError);
        }
    }
}

// Function to display IP details from ipwho.is on the page
function displayIPDetails(data) {
    const resultDiv = document.getElementById('myipResult');
    const mapDiv = document.getElementById('map');
    const { ip, city, region, country, latitude, longitude, connection } = data;

    resultDiv.innerHTML = `
        <p>My Public IPv4: ${ip}</p>
        <p>Location: ${city}, ${region}, ${country}</p>
        <p>ISP: ${connection.isp || 'N/A'}</p>
        <p>Coordinates: ${latitude}, ${longitude}</p>
    `;

    // Show the map and set the location
    mapDiv.style.display = 'block';
    showMap(latitude, longitude);
}

// Function to display IP details from the backup provider api64.ipify.org
function displayBackupIPDetails(data) {
    const resultDiv = document.getElementById('myipResult');
    resultDiv.innerHTML = `
        <p>My Public IPv4: ${data.ip}</p>
        <p>Location information is not available from this provider.</p>
    `;
}

// Function to show map with location details
function showMap(lat, lon) {
    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup(`Your location: ${lat}, ${lon}`)
        .openPopup();
}
