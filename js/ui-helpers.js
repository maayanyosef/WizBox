// Tab Switching Logic
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Remove active class from all tabs and contents
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and its content
    document.querySelector(`#${tabId}`).classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

// Show the spinner
function showSpinner(spinnerId) {
    document.getElementById(spinnerId).style.display = 'block';
}

// Hide the spinner
function hideSpinner(spinnerId) {
    document.getElementById(spinnerId).style.display = 'none';
}

// Fetch current IP and display in footer
async function fetchIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        document.getElementById('userIp').innerText = `Your IP is: ${data.ip}`;
    } catch (error) {
        document.getElementById('userIp').innerText = 'Your IP is: Unable to fetch IP';
    }
}

// Call the function when the page loads
fetchIP();