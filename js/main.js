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

    // Update the URL hash without causing a page reload or scroll
    if (window.location.hash !== `#${tabId}`) {
        window.location.hash = `#${tabId}`;
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
window.addEventListener('DOMContentLoaded', loadTabFromHash);
window.addEventListener('hashchange', loadTabFromHash);
// Toggle dark mode with persistence
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save the current state to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    
    // Update the button icon
    const darkModeBtn = document.querySelector('button[onclick="toggleDarkMode()"]');
    if (darkModeBtn) {
        darkModeBtn.textContent = isDarkMode ? '☀️' : '🌙';
    }
    
    // Track usage
    trackUsage('UI', 'dark_mode_toggle', isDarkMode ? 'enabled' : 'disabled');
}

// Initialize dark mode on page load
function initializeDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    const darkModeBtn = document.querySelector('button[onclick="toggleDarkMode()"]');
    
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        if (darkModeBtn) darkModeBtn.textContent = '☀️';
    } else {
        if (darkModeBtn) darkModeBtn.textContent = '🌙';
    }
}
// Initialize page functionality
window.onload = function() {
    initializeDarkMode(); // Initialize dark mode from localStorage
    changeLanguage(); // This ensures the correct language is set on page load
    getMyIPDetails(); // Automatically fetch IP details when the page loads
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
function refreshIPDetails() {
    window.location.reload();
}

// Scroll reveal animations
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced loading states for buttons
function addButtonLoadingState(button, text = 'Loading...') {
    button.classList.add('loading');
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = text;
    
    return () => {
        button.classList.remove('loading');
        button.disabled = false;
        button.textContent = originalText;
    };
}

// Smooth scroll to elements
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add glassmorphism effect to elements
function applyGlassmorphism(selector, isDark = false) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.add(isDark ? 'glass-dark' : 'glass');
    });
}

// Enhanced notification system
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4f46e5',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll reveal
    if (typeof IntersectionObserver !== 'undefined') {
        initScrollReveal();
    }
    
    // Add scroll reveal class to cards and blog posts
    document.querySelectorAll('.card, .blog-post').forEach((el, index) => {
        el.classList.add('scroll-reveal');
        el.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Enhanced form interactions
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement?.classList.remove('focused');
        });
    });
    
    // Add loading states to all buttons with API calls
    document.querySelectorAll('button[onclick*="check"], button[onclick*="perform"], button[onclick*="lookup"]').forEach(button => {
        button.addEventListener('click', function() {
            const resetLoading = addButtonLoadingState(this);
            
            // Reset after 10 seconds maximum (failsafe)
            setTimeout(resetLoading, 10000);
        });
    });
    
    // Initialize tooltips for FA icons
    document.querySelectorAll('[title]').forEach(el => {
        el.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                top: ${e.pageY - 30}px;
                left: ${e.pageX}px;
                animation: fadeInUp 0.2s ease-out;
            `;
            document.body.appendChild(tooltip);
            this._tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                document.body.removeChild(this._tooltip);
                this._tooltip = null;
            }
        });
    });
});

// Search functionality for tools
const toolsData = [
    {
        id: 'what-is-my-ip',
        name: 'What Is My IP',
        description: 'Find your public IP address and location information',
        keywords: ['ip', 'address', 'location', 'public', 'network'],
        icon: 'fas fa-globe'
    },
    {
        id: 'dns-lookup',
        name: 'DNS Lookup',
        description: 'Query DNS records for any domain',
        keywords: ['dns', 'domain', 'lookup', 'records', 'resolve'],
        icon: 'fas fa-search'
    },
    {
        id: 'ssl-checker',
        name: 'SSL Certificate Checker',
        description: 'Verify SSL certificates and security configuration',
        keywords: ['ssl', 'tls', 'certificate', 'security', 'https'],
        icon: 'fas fa-shield-alt'
    },
    {
        id: 'cdn-finder',
        name: 'CDN Finder',
        description: 'Detect content delivery networks used by websites',
        keywords: ['cdn', 'content', 'delivery', 'network', 'performance'],
        icon: 'fas fa-network-wired'
    },
    {
        id: 'ping',
        name: 'Ping Tool',
        description: 'Test network connectivity and measure response times',
        keywords: ['ping', 'connectivity', 'latency', 'network', 'response'],
        icon: 'fas fa-satellite-dish'
    },
    {
        id: 'traceroute',
        name: 'Traceroute',
        description: 'Trace network path to destination hosts',
        keywords: ['traceroute', 'route', 'path', 'network', 'hops'],
        icon: 'fas fa-route'
    },
    {
        id: 'whois-lookup',
        name: 'WHOIS Lookup',
        description: 'Get domain registration and ownership information',
        keywords: ['whois', 'domain', 'registration', 'owner', 'info'],
        icon: 'fas fa-user-check'
    },
    {
        id: 'mx-lookup',
        name: 'MX Record Lookup',
        description: 'Find mail exchange records for email routing',
        keywords: ['mx', 'mail', 'email', 'records', 'exchange'],
        icon: 'fas fa-envelope'
    },
    {
        id: 'security-headers-check',
        name: 'Security Headers Check',
        description: 'Analyze HTTP security headers implementation',
        keywords: ['security', 'headers', 'http', 'protection', 'analyze'],
        icon: 'fas fa-lock'
    },
    {
        id: 'blacklist-lookup',
        name: 'DNS Blacklist Lookup',
        description: 'Check if IP or domain is blacklisted',
        keywords: ['blacklist', 'spam', 'reputation', 'blocked', 'dnsbl'],
        icon: 'fas fa-ban'
    },
    {
        id: 'dmarc-lookup',
        name: 'DMARC Record Lookup',
        description: 'Verify DMARC email authentication records',
        keywords: ['dmarc', 'email', 'authentication', 'security', 'policy'],
        icon: 'fas fa-shield-virus'
    }
];

function searchTools() {
    const query = document.getElementById('toolSearch').value.toLowerCase().trim();
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (query.length === 0) {
        suggestionsContainer.classList.remove('show');
        highlightTabs('');
        return;
    }
    
    // Filter tools based on search query
    const matches = toolsData.filter(tool => {
        return tool.name.toLowerCase().includes(query) ||
               tool.description.toLowerCase().includes(query) ||
               tool.keywords.some(keyword => keyword.includes(query));
    });
    
    // Display suggestions
    if (matches.length > 0) {
        const suggestionsHTML = matches.map(tool => `
            <div class="suggestion-item" onclick="selectTool('${tool.id}')">
                <i class="${tool.icon}"></i>
                <div class="suggestion-content">
                    <div class="suggestion-title">${highlightMatch(tool.name, query)}</div>
                    <div class="suggestion-description">${highlightMatch(tool.description, query)}</div>
                </div>
            </div>
        `).join('');
        
        suggestionsContainer.innerHTML = suggestionsHTML;
        suggestionsContainer.classList.add('show');
    } else {
        suggestionsContainer.innerHTML = `
            <div class="suggestion-item">
                <i class="fas fa-search"></i>
                <div class="suggestion-content">
                    <div class="suggestion-title">No tools found</div>
                    <div class="suggestion-description">Try searching for "DNS", "SSL", "ping", or other network terms</div>
                </div>
            </div>
        `;
        suggestionsContainer.classList.add('show');
    }
    
    // Highlight matching tabs
    highlightTabs(query);
}

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function highlightTabs(query) {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        const tabText = tab.textContent.toLowerCase();
        tab.classList.remove('search-highlight');
        
        if (query && tabText.includes(query)) {
            tab.classList.add('search-highlight');
        }
    });
}

function selectTool(toolId) {
    // Switch to the selected tool
    switchTab(toolId);
    
    // Clear search
    clearSearch();
    
    // Track search usage
    trackUsage('Search', 'tool_selected', toolId);
    
    // Show notification
    const tool = toolsData.find(t => t.id === toolId);
    if (tool) {
        showNotification(`Switched to ${tool.name}`, 'success', 2000);
    }
}

function clearSearch() {
    const searchInput = document.getElementById('toolSearch');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    searchInput.value = '';
    suggestionsContainer.classList.remove('show');
    highlightTabs('');
    
    searchInput.focus();
}

// Handle keyboard navigation in search
document.addEventListener('keydown', function(e) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const suggestions = document.querySelectorAll('.suggestion-item');
    
    if (!suggestionsContainer.classList.contains('show')) return;
    
    let currentIndex = -1;
    suggestions.forEach((item, index) => {
        if (item.classList.contains('selected')) {
            currentIndex = index;
        }
        item.classList.remove('selected');
    });
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % suggestions.length;
        suggestions[currentIndex]?.classList.add('selected');
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1;
        suggestions[currentIndex]?.classList.add('selected');
    } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = document.querySelector('.suggestion-item.selected');
        if (selected) {
            selected.click();
        }
    } else if (e.key === 'Escape') {
        clearSearch();
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
    const searchContainer = document.querySelector('.search-container');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!searchContainer.contains(e.target)) {
        suggestionsContainer.classList.remove('show');
    }
});

// Add search highlight style to CSS dynamically
const searchHighlightStyle = document.createElement('style');
searchHighlightStyle.textContent = `
    .tab.search-highlight {
        background: rgba(79, 70, 229, 0.1) !important;
        border-color: var(--primary-color) !important;
        animation: pulse 1s infinite;
    }
    
    .suggestion-item.selected {
        background: var(--primary-color) !important;
        color: white !important;
    }
`;
document.head.appendChild(searchHighlightStyle);

// Enhanced Quick Access Toolbar
let toolbarExpanded = true;

function initQuickAccessToolbar() {
    const toolbarHTML = `
        <div class="quick-access-toolbar" id="quickAccessToolbar">
            <button class="quick-access-btn toolbar-toggle" onclick="toggleToolbar()" data-tooltip="Toggle Toolbar">
                <i class="fas fa-plus"></i>
            </button>
            <button class="quick-access-btn" onclick="quickAccessTool('ping')" data-tooltip="Ping Tool">
                <i class="fas fa-satellite-dish"></i>
            </button>
            <button class="quick-access-btn secondary" onclick="quickAccessTool('dns-lookup')" data-tooltip="DNS Lookup">
                <i class="fas fa-search"></i>
            </button>
            <button class="quick-access-btn warning" onclick="quickAccessTool('ssl-checker')" data-tooltip="SSL Checker">
                <i class="fas fa-shield-alt"></i>
            </button>
            <button class="quick-access-btn danger" onclick="quickAccessTool('security-headers-check')" data-tooltip="Security Headers">
                <i class="fas fa-lock"></i>
            </button>
            <button class="quick-access-btn" onclick="scrollToTop()" data-tooltip="Back to Top">
                <i class="fas fa-arrow-up"></i>
            </button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toolbarHTML);
}

function toggleToolbar() {
    const toolbar = document.getElementById('quickAccessToolbar');
    const toggleBtn = toolbar.querySelector('.toolbar-toggle i');
    
    toolbarExpanded = !toolbarExpanded;
    
    if (toolbarExpanded) {
        toolbar.classList.remove('collapsed');
        toggleBtn.className = 'fas fa-plus';
    } else {
        toolbar.classList.add('collapsed');
        toggleBtn.className = 'fas fa-times';
    }
    
    trackUsage('UI', 'toolbar_toggle', toolbarExpanded ? 'expanded' : 'collapsed');
}

function quickAccessTool(toolId) {
    // Navigate to tool page
    const toolUrls = {
        'ping': '/ping.html',
        'dns-lookup': '/dns-lookup.html',
        'ssl-checker': '/ssl-checker.html',
        'security-headers-check': '/security-headers-check.html',
        'whois-lookup': '/whois-lookup.html',
        'traceroute': '/traceroute.html'
    };
    
    if (toolUrls[toolId]) {
        window.location.href = toolUrls[toolId];
    } else if (typeof switchTab === 'function') {
        // If we're on the main page with tabs
        switchTab(toolId);
    }
    
    trackUsage('QuickAccess', 'tool_accessed', toolId);
    showNotification(`Opening ${toolId.replace('-', ' ').toUpperCase()}`, 'info', 1500);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    trackUsage('UI', 'scroll_to_top');
}

// Social Sharing Functions
function initSocialSharing() {
    // Add social sharing buttons after tool results
    document.addEventListener('DOMContentLoaded', function() {
        const resultContainers = document.querySelectorAll('.result, #result');
        resultContainers.forEach(container => {
            // Create observer to add sharing when results appear
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && container.innerHTML.trim() !== '') {
                        addSocialSharingToResult(container);
                    }
                });
            });
            
            observer.observe(container, { childList: true, subtree: true });
        });
    });
}

function addSocialSharingToResult(resultContainer) {
    // Don't add if already exists
    if (resultContainer.querySelector('.social-share')) return;
    
    const currentUrl = window.location.href;
    const pageTitle = document.title;
    
    const socialHTML = `
        <div class="social-share">
            <span class="social-share-label">Share result:</span>
            <a href="#" class="social-btn twitter" onclick="shareOnTwitter('${pageTitle}', '${currentUrl}')" title="Share on Twitter">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-btn linkedin" onclick="shareOnLinkedIn('${pageTitle}', '${currentUrl}')" title="Share on LinkedIn">
                <i class="fab fa-linkedin"></i>
            </a>
            <a href="#" class="social-btn facebook" onclick="shareOnFacebook('${currentUrl}')" title="Share on Facebook">
                <i class="fab fa-facebook"></i>
            </a>
            <a href="#" class="social-btn copy" onclick="copyResultUrl()" title="Copy Link">
                <i class="fas fa-copy"></i>
            </a>
        </div>
    `;
    
    resultContainer.insertAdjacentHTML('afterend', socialHTML);
}

function shareOnTwitter(title, url) {
    const text = `Check out this result from WizBox Tools: ${title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    trackUsage('Social', 'share_twitter', title);
}

function shareOnLinkedIn(title, url) {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
    trackUsage('Social', 'share_linkedin', title);
}

function shareOnFacebook(url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    trackUsage('Social', 'share_facebook');
}

function copyResultUrl() {
    navigator.clipboard.writeText(window.location.href).then(function() {
        showNotification('Link copied to clipboard!', 'success', 2000);
        trackUsage('Social', 'copy_link');
    }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Link copied to clipboard!', 'success', 2000);
        trackUsage('Social', 'copy_link');
    });
}

// Newsletter Integration Functions
function initNewsletterIntegration() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSignup);
    });
}

function handleNewsletterSignup(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const button = form.querySelector('button');
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    const resetButton = addButtonLoadingState(button, 'Subscribing...');
    
    // Simulate API call (replace with actual integration)
    setTimeout(() => {
        resetButton();
        showNotification('Successfully subscribed to updates!', 'success');
        form.reset();
        trackUsage('Newsletter', 'subscribe', email);
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced features after a short delay to ensure DOM is fully loaded
    setTimeout(() => {
        initQuickAccessToolbar();
        initSocialSharing();
        initNewsletterIntegration();
        
        
        // Add enhanced functionality to existing elements
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(6px) scale(1.02)';
            });
            tab.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
        
    }, 500);
});