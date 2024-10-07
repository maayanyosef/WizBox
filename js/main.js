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
// Example function to switch tabs (Adjust this based on your needs)
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Remove active class from all tabs and contents
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and its content
    document.querySelector(`#${tabId}`).classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`).classList.add('active');

    // Track the usage of the tab
    trackUsage('Tab', 'click', tabId);
}
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
// Tab Switching
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Remove active class from all tabs
    tabs.forEach(tab => tab.classList.remove('active'));

    // Hide all tab content
    tabContents.forEach(content => content.classList.remove('active'));

    // Show the clicked tab's content and highlight the active tab
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`).classList.add('active');
}
// Handle keyboard navigation for tabs
function handleKeyPress(event, tabId) {
    if (event.key === 'Enter' || event.key === ' ') {
        switchTab(tabId);
    }
}