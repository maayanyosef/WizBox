// PWA Installation and Mobile Optimizations for WizBox Tools
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.checkDisplayMode();
        this.optimizeForMobile();
    }

    // Register service worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('WizBox: Service Worker registered successfully:', registration.scope);
                
                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });
            } catch (error) {
                console.error('WizBox: Service Worker registration failed:', error);
            }
        }
    }

    // Setup install prompt handling
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('WizBox: PWA was installed');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstalledMessage();
        });
    }

    // Show install button
    showInstallButton() {
        const installBtn = this.createInstallButton();
        document.body.appendChild(installBtn);
    }

    // Create install button
    createInstallButton() {
        const button = document.createElement('button');
        button.id = 'pwa-install-btn';
        button.className = 'btn btn-primary';
        button.innerHTML = '<i class="fas fa-mobile-alt"></i> Install App';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            border-radius: 50px;
            padding: 12px 20px;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            animation: pulse 2s infinite;
            backdrop-filter: blur(10px);
        `;

        button.addEventListener('click', () => this.installPWA());
        return button;
    }

    // Install PWA
    async installPWA() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('WizBox: User accepted PWA install');
        } else {
            console.log('WizBox: User dismissed PWA install');
        }
        
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    // Hide install button
    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }

    // Show installed message
    showInstalledMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-toast';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            WizBox Tools installed successfully!
        `;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

    // Show update available notification
    showUpdateAvailable() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div>New version available!</div>
            <button onclick="window.location.reload()">Update</button>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: var(--primary-color);
            color: white;
            padding: 10px 20px;
            z-index: 1001;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        document.body.appendChild(notification);
    }

    // Check if app is installed
    checkDisplayMode() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('WizBox: Running in standalone mode');
            this.addStandaloneStyles();
        }
    }

    // Add styles for standalone mode
    addStandaloneStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body { 
                padding-top: env(safe-area-inset-top); 
                padding-bottom: env(safe-area-inset-bottom); 
            }
            header { 
                padding-top: calc(var(--spacing-xl) + env(safe-area-inset-top)); 
            }
        `;
        document.head.appendChild(style);
    }

    // Mobile optimizations
    optimizeForMobile() {
        this.preventZoomOnInputFocus();
        this.addTouchGestures();
        this.optimizeViewport();
        this.handleOrientationChange();
    }

    // Prevent zoom on input focus (iOS)
    preventZoomOnInputFocus() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (window.innerWidth <= 768) {
                input.style.fontSize = '16px';
            }
        });
    }

    // Add touch gestures
    addTouchGestures() {
        let startY = 0;
        let currentY = 0;
        let isScrolling = false;

        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isScrolling = true;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            currentY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', () => {
            if (!isScrolling) return;
            
            const diff = startY - currentY;
            
            // Pull to refresh (if scrolled to top)
            if (diff < -100 && window.scrollY === 0) {
                this.handlePullToRefresh();
            }
            
            isScrolling = false;
        });
    }

    // Handle pull to refresh
    handlePullToRefresh() {
        const refreshIndicator = document.createElement('div');
        refreshIndicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
        refreshIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 1000;
        `;
        
        document.body.appendChild(refreshIndicator);
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // Optimize viewport
    optimizeViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && window.innerWidth <= 768) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
        }
    }

    // Handle orientation change
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.optimizeForMobile();
            }, 100);
        });
    }

    // Add performance monitoring
    monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('WizBox Performance:', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    totalTime: perfData.loadEventEnd - perfData.navigationStart
                });
            });
        }
    }
}

// Initialize PWA Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
});

// Add CSS animations for PWA elements
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .pwa-toast {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    #pwa-install-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
    }
`;
document.head.appendChild(pwaStyles);