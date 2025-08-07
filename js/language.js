// Function to change the language
function changeLanguage() {
    const languageSelect = document.getElementById("languageSelect").value;
    const translation = translations[languageSelect];

    // Update page content with the selected language
    document.getElementById("pageTitle").innerText = translation.pageTitle;
    document.querySelector(`[onclick="switchTab('cdn-finder')"]`).innerText = translation.cdnFinder;
    document.querySelector(`[onclick="switchTab('ssl-checker')"]`).innerText = translation.sslChecker;
    document.querySelector(`[onclick="switchTab('dns-lookup')"]`).innerText = translation.dnsLookup;
    document.querySelector(`[onclick="switchTab('what-is-my-ip')"]`).innerText = translation.myIPDetails;
    document.querySelector(`[onclick="switchTab('blacklist-lookup')"]`).innerText = translation.blacklistLookup;
    document.querySelector(`[onclick="switchTab('dmarc-lookup')"]`).innerText = translation.dmarcLookup;
    document.querySelector(`[onclick="switchTab('whois-lookup')"]`).innerText = translation.whoisLookup;
    document.querySelector(`[onclick="switchTab('ping')"]`).innerText = translation.pingTool;
    document.querySelector(`[onclick="switchTab('traceroute')"]`).innerText = translation.tracerouteTool;
    document.querySelector(`[onclick="switchTab('mx-lookup')"]`).innerText = translation.mxLookup;
    document.querySelector(`[onclick="switchTab('security-headers-check')"]`).innerText = translation.securityHeaders;
}
// Translations for each language
const translations = {
    en: {
        pageTitle: "WizBox Tool Checks - Domain Lookup and Security Tools",
        cdnFinder: "CDN Finder",
        sslChecker: "SSL Certificate Checker",
        dnsLookup: "DNS Lookup",
        myIPDetails: "My IP Details",
        blacklistLookup: "Blacklist Lookup",
        dmarcLookup: "DMARC Record Lookup",
        whoisLookup: "WHOIS Lookup",
        pingTool: "Ping Tool",
        tracerouteTool: "Traceroute Tool",
        mxLookup: "MX Lookup",
        securityHeaders: "Security Headers Check",
    },
    es: {
        pageTitle: "Herramientas de API WizBox - Búsqueda de Dominios y Herramientas de Seguridad",
        cdnFinder: "Buscador de CDN",
        sslChecker: "Comprobador de Certificado SSL",
        dnsLookup: "Consulta de DNS",
        myIPDetails: "Mis Detalles de IP",
        blacklistLookup: "Búsqueda en Lista Negra",
        dmarcLookup: "Búsqueda de Registro DMARC",
        whoisLookup: "Búsqueda WHOIS",
        pingTool: "Herramienta Ping",
        tracerouteTool: "Herramienta Traceroute",
        mxLookup: "Búsqueda MX",
        securityHeaders: "Comprobación de Cabeceras de Seguridad",
    },
    fr: {
        pageTitle: "API d'Outils WizBox - Recherche de Domaines et Outils de Sécurité",
        cdnFinder: "Chercheur de CDN",
        sslChecker: "Vérificateur de Certificat SSL",
        dnsLookup: "Recherche DNS",
        myIPDetails: "Mes Détails IP",
        blacklistLookup: "Recherche de Liste Noire",
        dmarcLookup: "Recherche d'Enregistrement DMARC",
        whoisLookup: "Recherche WHOIS",
        pingTool: "Outil de Ping",
        tracerouteTool: "Outil de Traceroute",
        mxLookup: "Recherche MX",
        securityHeaders: "Vérification des En-têtes de Sécurité",
    },
    de: {
        pageTitle: "WizBox-Tool-API - Domain-Suche und Sicherheitstools",
        cdnFinder: "CDN-Finder",
        sslChecker: "SSL-Zertifikat-Checker",
        dnsLookup: "DNS-Suche",
        myIPDetails: "Meine IP-Details",
        blacklistLookup: "Blacklist-Suche",
        dmarcLookup: "DMARC-Record-Suche",
        whoisLookup: "WHOIS-Suche",
        pingTool: "Ping-Tool",
        tracerouteTool: "Traceroute-Tool",
        mxLookup: "MX-Suche",
        securityHeaders: "Sicherheitsheader-Check",
    },
    zh: {
        pageTitle: "WizBox工具检查 - 域名查找和安全工具",
        cdnFinder: "CDN查找器",
        sslChecker: "SSL证书检查器",
        dnsLookup: "DNS查找",
        myIPDetails: "我的IP详情",
        blacklistLookup: "黑名单查找",
        dmarcLookup: "DMARC记录查找",
        whoisLookup: "WHOIS查找",
        pingTool: "Ping工具",
        tracerouteTool: "路由跟踪工具",
        mxLookup: "MX查找",
        securityHeaders: "安全标头检查",
    }
};