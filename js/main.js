// Define the base URL as a parameter
const BASE_URL = 'https://app.wizbox.tools';
// Function to handle keypress for accessibility (space or enter key)
function handleKeyPress(event, tabId) {
    if (event.key === 'Enter' || event.key === ' ') {
        switchTab(tabId);
    }
}
// Google Analytics event tracking function
function trackUsage(eventCategory, eventAction, eventLabel = '') {
    gtag('event', eventAction, {
        'event_category': eventCategory,
        'event_label': eventLabel,
    });
}
// Function to switch tabs and update the URL hash
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Remove active class from all tabs and contents
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to the selected tab and its content
    const activeTabContent = document.getElementById(tabId);
    const activeTabButton = Array.from(tabs).find(tab => tab.getAttribute('onclick').includes(tabId));

    if (activeTabContent && activeTabButton) {
        activeTabContent.classList.add('active');
        activeTabButton.classList.add('active');
    }

    // Update the URL hash
    if (window.location.hash !== `#${tabId}`) {
        window.history.pushState(null, null, `#${tabId}`);
    }
}

// Function to load the appropriate tab based on the URL hash when the page loads
function loadTabFromHash() {
    const hash = window.location.hash.substring(1); // Get the hash value without the '#'
    if (hash) {
        switchTab(hash);
    } else {
        // Default to the first tab if no hash is present
        switchTab('what-is-my-ip');
    }
}

// Event listener to handle page load and hash changes
window.addEventListener('load', loadTabFromHash);
window.addEventListener('hashchange', loadTabFromHash);
// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
// Change the language of the page
window.onload = function() {
    changeLanguage();
};
// Open the side panel
function openSidePanel() {
    document.getElementById("sidePanel").style.width = "260px";
}
// Close the side panel
function closeSidePanel() {
    document.getElementById("sidePanel").style.width = "0";
}
// Handle keyboard navigation for tabs
function handleKeyPress(event, tabId) {
    if (event.key === 'Enter' || event.key === ' ') {
        switchTab(tabId);
    }
}