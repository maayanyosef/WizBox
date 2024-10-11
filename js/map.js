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

// Function to display IP details on the page including browser and OS details
function displayIPDetails(data) {
    const resultDiv = document.getElementById('myipResult');
    const mapDiv = document.getElementById('map');
    const { ip, city, region, country, latitude, longitude, connection } = data;

    // Fetch browser and operating system details
    const browser = `${navigator.appName} ${navigator.appVersion}`;
    const operatingSystem = navigator.platform;

    resultDiv.innerHTML = `
        <p><i class="fas fa-globe"></i> <strong>Your IP address:</strong> ${ip}</p>
        <p><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${city}, ${region}, ${country}</p>
        <p><i class="fas fa-desktop"></i> <strong>Operating system:</strong> ${operatingSystem}</p>
        <p><i class="fas fa-browser"></i> <strong>Your browser:</strong> ${browser}</p>
        <p><i class="fas fa-building"></i> <strong>Your ISP:</strong> ${connection.isp || 'N/A'}</p>
        <p><i class="fas fa-shield-alt"></i> <strong>Proxy:</strong> ${data.proxy ? 'Used' : 'Not used'}</p>
        <p><i class="fas fa-map-pin"></i> <strong>Coordinates:</strong> ${latitude}, ${longitude}</p>
    `;

    // Show the map and set the location
    mapDiv.style.display = 'block';
    showMap(latitude, longitude);
}

// Function to display IP details from the backup provider api64.ipify.org
function displayBackupIPDetails(data) {
    const resultDiv = document.getElementById('myipResult');
    resultDiv.innerHTML = `
        <p><strong>Your IP address:</strong> ${data.ip}</p>
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
