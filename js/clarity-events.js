/**
 * Microsoft Clarity Smart Events Manager
 * Tracks user interactions and behaviors for WizBox Tools
 */

class ClarityEventsManager {
    constructor() {
        this.sessionStartTime = Date.now();
        this.currentTool = null;
        this.toolStartTime = null;
        this.eventQueue = [];
        this.init();
    }

    init() {
        // Wait for Clarity to be available
        this.waitForClarity(() => {
            this.trackPageLoad();
            this.setupErrorTracking();
            this.trackUserAgent();
            this.trackViewportSize();
        });
    }

    // Wait for Clarity to be available
    waitForClarity(callback, attempts = 0) {
        if (typeof clarity !== 'undefined') {
            callback();
        } else if (attempts < 50) {
            setTimeout(() => this.waitForClarity(callback, attempts + 1), 100);
        } else {
            console.warn('Clarity not available after 5 seconds');
        }
    }

    // Core event tracking function
    track(eventName, data = {}) {
        if (typeof clarity !== 'undefined') {
            // Add session metadata
            const enrichedData = {
                ...data,
                timestamp: Date.now(),
                sessionDuration: Date.now() - this.sessionStartTime,
                currentTool: this.currentTool,
                userAgent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            };

            try {
                clarity('event', eventName, enrichedData);
                console.log(`Clarity event tracked: ${eventName}`, enrichedData);
            } catch (error) {
                console.error('Error tracking Clarity event:', error);
                this.eventQueue.push({ eventName, data: enrichedData });
            }
        } else {
            // Queue events if Clarity isn't ready
            this.eventQueue.push({ eventName, data });
        }
    }

    // Page and session events
    trackPageLoad() {
        const loadTime = performance.now();
        this.track('page_load', {
            loadTime: Math.round(loadTime),
            url: window.location.href,
            referrer: document.referrer || 'direct'
        });
    }

    trackPageView(pageName, pageType = 'tool') {
        this.track('page_view', {
            pageName,
            pageType,
            url: window.location.href
        });
    }

    // Tool usage events
    trackToolStart(toolName) {
        this.currentTool = toolName;
        this.toolStartTime = Date.now();
        this.track('tool_start', {
            toolName,
            startTime: this.toolStartTime
        });
    }

    trackToolComplete(toolName, success = true, resultData = {}) {
        const duration = this.toolStartTime ? Date.now() - this.toolStartTime : 0;
        
        this.track('tool_complete', {
            toolName,
            success,
            duration,
            ...resultData
        });

        if (!success) {
            this.track('tool_error', {
                toolName,
                duration,
                ...resultData
            });
        }
    }

    trackToolInput(toolName, inputType, inputValue = '') {
        this.track('tool_input', {
            toolName,
            inputType,
            inputLength: inputValue.length,
            inputType_detail: this.getInputTypeDetail(inputValue)
        });
    }

    // User engagement events
    trackTabSwitch(fromTab, toTab) {
        if (this.currentTool && fromTab !== toTab) {
            const duration = this.toolStartTime ? Date.now() - this.toolStartTime : 0;
            this.track('tab_switch', {
                fromTab,
                toTab,
                timeOnPreviousTab: duration
            });
        }
        this.trackToolStart(toTab);
    }

    trackSearch(query, resultsCount = 0) {
        this.track('search', {
            query: query.toLowerCase(),
            queryLength: query.length,
            resultsCount,
            searchType: this.getSearchType(query)
        });
    }

    trackFeatureUsage(featureName, action = 'use', additionalData = {}) {
        this.track('feature_usage', {
            featureName,
            action,
            ...additionalData
        });
    }

    // Conversion events
    trackNewsletterSignup(email, source = 'unknown') {
        this.track('newsletter_signup', {
            source,
            emailDomain: email.split('@')[1] || 'unknown'
        });
    }

    trackSocialShare(platform, contentType = 'tool_result', toolName = null) {
        this.track('social_share', {
            platform,
            contentType,
            toolName: toolName || this.currentTool
        });
    }

    trackPWAInstall(action = 'prompt_shown') {
        this.track('pwa_install', {
            action,
            timestamp: Date.now()
        });
    }

    // Error and performance tracking
    trackError(errorType, errorMessage, context = {}) {
        this.track('error', {
            errorType,
            errorMessage: errorMessage.substring(0, 200), // Limit message length
            context,
            currentTool: this.currentTool
        });
    }

    trackAPICall(endpoint, method = 'GET', duration = 0, success = true, statusCode = 200) {
        this.track('api_call', {
            endpoint,
            method,
            duration,
            success,
            statusCode,
            toolName: this.currentTool
        });
    }

    trackPerformance(metricName, value, unit = 'ms') {
        this.track('performance', {
            metricName,
            value: Math.round(value),
            unit
        });
    }

    // User behavior events
    trackScrollDepth(depth) {
        this.track('scroll_depth', {
            depth: Math.round(depth),
            toolName: this.currentTool
        });
    }

    trackTimeOnTool(toolName, duration) {
        this.track('time_on_tool', {
            toolName,
            duration: Math.round(duration / 1000), // Convert to seconds
            durationCategory: this.getDurationCategory(duration)
        });
    }

    trackUserFlow(fromAction, toAction, context = {}) {
        this.track('user_flow', {
            fromAction,
            toAction,
            ...context
        });
    }

    // Helper functions
    getInputTypeDetail(input) {
        if (!input) return 'empty';
        if (input.includes('.')) return 'domain_or_ip';
        if (/^\d+\.\d+\.\d+\.\d+$/.test(input)) return 'ipv4';
        if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(input)) return 'domain';
        return 'other';
    }

    getSearchType(query) {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('ssl') || lowerQuery.includes('certificate')) return 'ssl';
        if (lowerQuery.includes('dns')) return 'dns';
        if (lowerQuery.includes('ping')) return 'ping';
        if (lowerQuery.includes('whois')) return 'whois';
        if (lowerQuery.includes('cdn')) return 'cdn';
        if (lowerQuery.includes('ip')) return 'ip';
        return 'general';
    }

    getDurationCategory(duration) {
        const seconds = duration / 1000;
        if (seconds < 5) return 'very_short';
        if (seconds < 30) return 'short';
        if (seconds < 120) return 'medium';
        if (seconds < 300) return 'long';
        return 'very_long';
    }

    // Setup automatic tracking
    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (event) => {
            this.trackError('javascript_error', event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError('unhandled_promise', event.reason?.message || 'Unknown promise rejection');
        });
    }

    trackUserAgent() {
        const ua = navigator.userAgent;
        let browser = 'unknown';
        let os = 'unknown';
        let device = 'desktop';

        // Browser detection
        if (ua.includes('Chrome')) browser = 'chrome';
        else if (ua.includes('Firefox')) browser = 'firefox';
        else if (ua.includes('Safari')) browser = 'safari';
        else if (ua.includes('Edge')) browser = 'edge';

        // OS detection
        if (ua.includes('Windows')) os = 'windows';
        else if (ua.includes('Mac')) os = 'mac';
        else if (ua.includes('Linux')) os = 'linux';
        else if (ua.includes('Android')) os = 'android';
        else if (ua.includes('iOS')) os = 'ios';

        // Device type detection
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
            device = 'mobile';
        } else if (/iPad|Android/i.test(ua)) {
            device = 'tablet';
        }

        this.track('user_environment', {
            browser,
            os,
            device,
            isMobile: device !== 'desktop'
        });
    }

    trackViewportSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let screenCategory = 'unknown';

        if (width < 768) screenCategory = 'mobile';
        else if (width < 1024) screenCategory = 'tablet';
        else if (width < 1440) screenCategory = 'desktop';
        else screenCategory = 'large_desktop';

        this.track('viewport_info', {
            width,
            height,
            screenCategory,
            pixelRatio: window.devicePixelRatio || 1
        });
    }

    // Scroll tracking
    setupScrollTracking() {
        let ticking = false;
        let maxScroll = 0;

        const trackScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track scroll milestones
                if (scrollPercent >= 25 && maxScroll < 25) this.trackScrollDepth(25);
                if (scrollPercent >= 50 && maxScroll < 50) this.trackScrollDepth(50);
                if (scrollPercent >= 75 && maxScroll < 75) this.trackScrollDepth(75);
                if (scrollPercent >= 100 && maxScroll < 100) this.trackScrollDepth(100);
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(trackScroll);
                ticking = true;
            }
        });
    }
}

// Initialize Clarity Events Manager
window.clarityEvents = new ClarityEventsManager();

// Setup scroll tracking
window.addEventListener('load', () => {
    window.clarityEvents.setupScrollTracking();
});