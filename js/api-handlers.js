// CDN Finder Function with Emoji for CDN Providers
async function checkCDN() {
    const domain = document.getElementById("cdnDomain").value;
    const resultDiv = document.getElementById("cdnResult");
    resultDiv.innerHTML = "";  // Clear previous results
    showSpinner('cdnSpinner');  // Show spinner while request is made

    // Track tool start
    if (window.clarityEvents) {
        window.clarityEvents.trackToolStart('cdn_finder');
        window.clarityEvents.trackToolInput('cdn_finder', 'domain', domain);
    }

    try {
        const response = await fetch(`${BASE_URL}/cdn/${domain}`);
        const result = await response.json();
        hideSpinner('cdnSpinner');  // Hide spinner once response is received

        if (result.error) {
            resultDiv.innerHTML = `<span class="error">${result.error}</span>`;
        } else {
            let cdnDetected = result.cdn_detected;

            // If the result is not an array, convert it to an array (if possible)
            if (typeof cdnDetected === 'string') {
                // If it's a string, convert it to an array
                cdnDetected = [cdnDetected];
            } else if (!Array.isArray(cdnDetected)) {
                // If it's neither a string nor an array, display an error
                resultDiv.innerHTML = `Invalid response format for CDN detection.`;
                return;
            }

            // Mapping of CDN Providers to Emojis
            const cdnEmojis = {
                "Cloudflare": "☁️",
                "Akamai": "🌐",
                "Fastly": "🚀",
                "Amazon CloudFront": "📦",
                "Google Cloud CDN": "☁️",
                "Microsoft Azure CDN": "🖥️"
            };

            // If CDN detected, display with emoji
            if (cdnDetected.length > 0) {
                let resultHTML = `<h4>CDN Detected:</h4>`;
                resultHTML += `<ul>`;
                cdnDetected.forEach(cdn => {
                    const emoji = cdnEmojis[cdn] || "🌍"; // Fallback emoji
                    resultHTML += `<li>${emoji} ${cdn}</li>`;
                });
                resultHTML += `</ul>`;
                resultDiv.innerHTML = resultHTML;
            } else {
                resultDiv.innerHTML = `No CDN detected for this domain.`;
            }
            
            // Track successful completion
            if (window.clarityEvents) {
                window.clarityEvents.trackToolComplete('cdn_finder', true, {
                    domain: domain,
                    cdnsDetected: cdnDetected.length,
                    cdnProviders: cdnDetected
                });
            }
        }
    } catch (error) {
        hideSpinner('cdnSpinner');
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
        
        // Track error
        if (window.clarityEvents) {
            window.clarityEvents.trackToolComplete('cdn_finder', false, {
                error: error.message,
                domain: domain
            });
            window.clarityEvents.trackError('api_error', error.message, {
                tool: 'cdn_finder',
                domain: domain
            });
        }
    }
}
// SSL Checker Function
async function checkSSL() {
    const domain = document.getElementById("sslDomain").value;
    const resultDiv = document.getElementById("sslResult");
    resultDiv.innerHTML = "";  // Clear previous results
    showSpinner('sslSpinner');

    // Track tool start
    if (window.clarityEvents) {
        window.clarityEvents.trackToolStart('ssl_checker');
        window.clarityEvents.trackToolInput('ssl_checker', 'domain', domain);
    }

    try {
        const response = await fetch(`${BASE_URL}/ssl/${domain}`);
        const result = await response.json();
        hideSpinner('sslSpinner');

        if (result.error) {
            resultDiv.innerHTML = `<span class="error">${result.error}</span>`;
        } else {
            // Prepare the result content with emojis
            resultDiv.innerHTML = `
                <h4>🔒 SSL Certificate Details</h4>
                <p><strong>Common Name (CN):</strong> ${result.ssl_info.subject.commonName || "N/A"}</p>
                <p><strong>Organization (O):</strong> ${result.ssl_info.subject.organizationName || "Not Part Of Certificate"}</p>
                <p><strong>Organizational Unit (OU):</strong> ${result.ssl_info.subject.organizationalUnitName || "Not Part Of Certificate"}</p>

                <h4>🔑 Issued By</h4>
                <p><strong>Common Name (CN):</strong> ${result.ssl_info.issuer.commonName || "N/A"}</p>
                <p><strong>Organization (O):</strong> ${result.ssl_info.issuer.organizationName || "N/A"}</p>
                <p><strong>Organizational Unit (OU):</strong> ${result.ssl_info.issuer.organizationalUnitName || "Not Part Of Certificate"}</p>

                <h4>📅 Validity Period</h4>
                <p><strong>Issued On:</strong> ${result.ssl_info.valid_from}</p>
                <p><strong>Expires On:</strong> ${result.ssl_info.valid_to}</p>

                <h4>🔏 SHA-256 Fingerprints</h4>
                <p><strong>Certificate:</strong> ${result.ssl_info.serialNumber}</p>
                <p><strong>Public Key:</strong> ${result.ssl_info.publicKey || "N/A"}</p>
            `;
            
            // Track successful completion
            if (window.clarityEvents) {
                window.clarityEvents.trackToolComplete('ssl_checker', true, {
                    domain: domain,
                    issuer: result.ssl_info.issuer?.commonName,
                    validFrom: result.ssl_info.valid_from,
                    validTo: result.ssl_info.valid_to
                });
            }
        }
    } catch (error) {
        hideSpinner('sslSpinner');
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
        
        // Track error
        if (window.clarityEvents) {
            window.clarityEvents.trackToolComplete('ssl_checker', false, {
                error: error.message,
                domain: domain
            });
            window.clarityEvents.trackError('api_error', error.message, {
                tool: 'ssl_checker',
                domain: domain
            });
        }
    }
}
// DNS Lookup Function
async function performDNSLookup() {
    const domain = document.getElementById("dnsDomain").value;
    const recordType = document.getElementById("dnsRecordType").value;
    const resultDiv = document.getElementById("dnsResult");
    resultDiv.innerHTML = "";  // Clear previous results
    showSpinner('dnsSpinner');

    // Track tool start
    if (window.clarityEvents) {
        window.clarityEvents.trackToolStart('dns_lookup');
        window.clarityEvents.trackToolInput('dns_lookup', 'domain', domain);
        window.clarityEvents.trackToolInput('dns_lookup', 'record_type', recordType);
    }

    try {
        const response = await fetch(`${BASE_URL}/dns/${domain}?record_type=${recordType}`);
        const result = await response.json();
        hideSpinner('dnsSpinner');

        if (result.error) {
            resultDiv.innerHTML = `<span class="error">${result.error}</span>`;
        } else {
            const tableHTML = formatDNSResultTable(result, recordType);
            resultDiv.innerHTML = tableHTML;
            
            // Track successful completion
            if (window.clarityEvents) {
                window.clarityEvents.trackToolComplete('dns_lookup', true, {
                    domain: domain,
                    recordType: recordType,
                    recordCount: result[`${recordType}_record`]?.length || 0
                });
            }
        }
    } catch (error) {
        hideSpinner('dnsSpinner');
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}
// Function to format DNS result into an HTML table
function formatDNSResultTable(result, recordType) {
    let tableHTML = `<h4>DNS Results for ${result.domain} (${recordType} Records)</h4>`;
    tableHTML += `<table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Record Type</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>`;

    result[`${recordType}_record`].forEach((record, index) => {
        tableHTML += `<tr>
                        <td>${index + 1}</td>
                        <td>${recordType}</td>
                        <td>${record}</td>
                      </tr>`;
    });

    tableHTML += `  </tbody>
                 </table>`;
    return tableHTML;
}
// DNS Blacklist Lookup
async function checkBlacklist() {
    const domain = document.getElementById("blacklistDomain").value;
    const resultDiv = document.getElementById("blacklistResult");
    resultDiv.innerHTML = "";
    showSpinner('blacklistSpinner');
    try {
        const response = await fetch(`${BASE_URL}/blacklist/${domain}`);
        const result = await response.json();
        hideSpinner('blacklistSpinner');
        if (result.error) {
            resultDiv.innerHTML = `<span class="error">${result.error}</span>`;
        } else {
            resultDiv.innerHTML = result.blacklisted ? `Blacklisted: ${result.blacklists.join(', ')}` : `Not blacklisted`;
        }
    } catch (error) {
        hideSpinner('blacklistSpinner');
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}
// DMARC Record Lookup
async function checkDMARC() {
    const domain = document.getElementById("dmarcDomain").value;
    const resultDiv = document.getElementById("dmarcResult");
    resultDiv.innerHTML = "";
    showSpinner('dmarcSpinner');
    try {
        const response = await fetch(`${BASE_URL}/dmarc/${domain}`);
        const result = await response.json();
        hideSpinner('dmarcSpinner');
        if (result.error) {
            resultDiv.innerHTML = `<span class="error">${result.error}</span>`;
        } else {
            resultDiv.innerHTML = `DMARC Record: ${result.DMARC_record.join(', ')}`;
        }
    } catch (error) {
        hideSpinner('dmarcSpinner');
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}
// WHOIS Lookup Function
async function performWHOISLookup() {
    const domain = document.getElementById("whoisDomain").value;
    const resultDiv = document.getElementById("whoisResult");
    const spinner = document.getElementById("whoisSpinner");

    resultDiv.innerHTML = "";  // Clear previous results
    spinner.style.display = 'block';  // Show spinner

    try {
        const response = await fetch(`${BASE_URL}/whois/${domain}`);
        const result = await response.json();

        spinner.style.display = 'none';  // Hide spinner

        if (result.error) {
            resultDiv.innerHTML = `<span class="error">${result.error}</span>`;
        } else {
            // Create an HTML table to display the WHOIS information
            resultDiv.innerHTML = formatWhoisResult(result);
        }
    } catch (error) {
        spinner.style.display = 'none';  // Hide spinner
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}
// Helper function to format the WHOIS result into an HTML table
function formatWhoisResult(result) {
    const domainProfile = result['Domain Profile'] || {};
    const whoisRecord = result['Whois Record'] || {};

    // Handle cases where data may be null or undefined
    const registrar = domainProfile['Registrar'] || 'Unknown';
    const whoisServer = domainProfile['Whois Server'] || 'Unknown';
    const status = domainProfile['Status'] ? domainProfile['Status'].join(', ') : 'Unknown';
    const createdOn = domainProfile['Dates']?.['Created on'] || 'None';
    const expiresOn = domainProfile['Dates']?.['Expires on'] || 'None';
    const updatedOn = domainProfile['Dates']?.['Updated on'] || 'None';

    const domainName = whoisRecord['Domain Name'] || 'Unknown';
    const registryDomainId = whoisRecord['Registry Domain ID'] || 'Unknown';
    const registrarUpdatedDate = whoisRecord['Updated Date'] || 'None';
    const creationDate = whoisRecord['Creation Date'] || 'None';
    const expirationDate = whoisRecord['Registrar Registration Expiration Date'] || 'None';
    const registrarContact = whoisRecord['Registrar'] || 'Unknown';
    const nameServers = whoisRecord['Name Servers'] ? whoisRecord['Name Servers'].join(', ') : 'Unknown';

    // Website logo (using favicon)
    const websiteLogo = `https://${domainName}/favicon.ico`;

    let html = `
        <h3>Domain Profile - <img src="${websiteLogo}" alt="Website logo for ${domainName}" width="15" height="15"> </h3>
        <table class="whois-table">
            <tr><td>Registrar</td><td>${registrar}</td></tr>
            <tr><td>Whois Server</td><td>${whoisServer}</td></tr>
            <tr><td>Status</td><td>${status}</td></tr>
            <tr><td>Created on</td><td>${createdOn}</td></tr>
            <tr><td>Expires on</td><td>${expiresOn}</td></tr>
            <tr><td>Updated on</td><td>${updatedOn}</td></tr>
        </table>

        <h3>Whois Record</h3>
        <table class="whois-table">
            <tr><td>Domain Name</td><td>${domainName}</td></tr>
            <tr><td>Registry Domain ID</td><td>${registryDomainId}</td></tr>
            <tr><td>Updated Date</td><td>${registrarUpdatedDate}</td></tr>
            <tr><td>Creation Date</td><td>${creationDate}</td></tr>
            <tr><td>Expiration Date</td><td>${expirationDate}</td></tr>
            <tr><td>Status</td><td>${status}</td></tr>
        </table>

        <h3>Name Servers</h3>
        <table class="whois-table">
            <tr><td>${nameServers}</td></tr>
        </table>
    `;

    return html;
}
// Ping
async function performPing() {
    const host = document.getElementById("pingHost").value;
    const resultDiv = document.getElementById("pingResult");
    resultDiv.innerHTML = "";
    showSpinner('pingSpinner');

    // Track tool start
    if (window.clarityEvents) {
        window.clarityEvents.trackToolStart('ping_tool');
        window.clarityEvents.trackToolInput('ping_tool', 'host', host);
    }

    try {
        const response = await fetch(`${BASE_URL}/ping/${host}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        hideSpinner('pingSpinner');
        resultDiv.innerHTML = `<pre>${result.result}</pre>`;
        
        // Track successful completion
        if (window.clarityEvents) {
            window.clarityEvents.trackToolComplete('ping_tool', true, {
                host: host,
                responseLength: result.result?.length || 0
            });
        }
    } catch (error) {
        hideSpinner('pingSpinner');
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}
// Traceroute
async function performTraceroute() {
    const host = document.getElementById("tracerouteHost").value;
    const resultDiv = document.getElementById("tracerouteResult");
    resultDiv.innerHTML = "";
    showSpinner('tracerouteSpinner');
    try {
        const response = await fetch(`${BASE_URL}/traceroute/${host}`);
        const result = await response.json();
        hideSpinner('tracerouteSpinner');
        resultDiv.innerHTML = `<pre>${result.result}</pre>`;
    } catch (error) {
        hideSpinner('tracerouteSpinner');
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}
// MX Record Lookup
async function checkMXRecords() {
    const domain = document.getElementById("mxDomain").value;
    const resultDiv = document.getElementById("mxResult");
    resultDiv.innerHTML = "";  // Clear previous results
    showSpinner('mxSpinner');

    try {
        const response = await fetch(`${BASE_URL}/mx/${domain}`);
        const result = await response.json();
        hideSpinner('mxSpinner');

        if (result.error) {
            resultDiv.innerHTML = `<span class="error">${result.error}</span>`;
        } else {
            // Format the MX records into a table
            let tableHTML = `
                <h4>📧 MX Records for ${result.domain}</h4>
                <table class="mx-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Class</th>
                            <th>TTL</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            result.mx_records.forEach(record => {
                const [type, classType, ttl, , ipInfo] = record;
                const ipAddress = ipInfo[0];  // Accessing the first element in the inner array, which contains the IP address

                tableHTML += `
                    <tr>
                        <td>${type}</td>
                        <td>${classType}</td>
                        <td>${ttl}</td>
                        <td>${ipAddress}</td>
                    </tr>
                `;
            });

            tableHTML += `</tbody></table>`;

            resultDiv.innerHTML = tableHTML;
        }
    } catch (error) {
        hideSpinner('mxSpinner');
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}
// Security Headers Check with explanations for fixing missing headers
async function checkSecurityHeaders() {
    const domain = document.getElementById("securityHeadersDomain").value;
    const resultDiv = document.getElementById("securityHeadersResult");
    resultDiv.innerHTML = "";  // Clear previous results
    showSpinner('securityHeadersSpinner');

    // Object containing explanations for each security header
    const securityFixes = {
        "Content-Security-Policy": "Add a Content-Security-Policy header to control resources the browser is allowed to load for the page. \nExample:<pre>Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com;</pre>",
        "X-Frame-Options": "Add the X-Frame-Options header to prevent clickjacking attacks. \nExample:<pre>X-Frame-Options: DENY</pre>",
        "X-Content-Type-Options": "Add the X-Content-Type-Options header to prevent browsers from interpreting files as a different MIME type. \nExample:<pre>X-Content-Type-Options: nosniff</pre>",
        "Strict-Transport-Security": "Add the Strict-Transport-Security header to enforce secure (HTTP over SSL/TLS) connections to the server. \nExample:<pre>Strict-Transport-Security: max-age=31536000; includeSubDomains</pre>",
        "Referrer-Policy": "Add the Referrer-Policy header to control how much referrer information is sent with requests. \nExample:<pre>Referrer-Policy: no-referrer</pre>",
        "X-XSS-Protection": "Add the X-XSS-Protection header to enable the Cross-Site Scripting (XSS) filter built into most browsers. \nExample:<pre>X-XSS-Protection: 1; mode=block</pre>",
        "Permissions-Policy": "Add the Permissions-Policy header to control which browser features are allowed to be used on your site. \nExample:<pre>Permissions-Policy: geolocation=(self), camera=()</pre>"
    };

    try {
        const response = await fetch(`${BASE_URL}/security-headers/${domain}`);
        const result = await response.json();
        hideSpinner('securityHeadersSpinner');

        if (result.error) {
            resultDiv.innerHTML = `<span class="error">${result.error}</span>`;
        } else {
            // Create a table for found and missing security headers
            let tableHTML = `
                <h4>🔒 Security Headers for ${result.domain}</h4>
                <table class="security-headers-table">
                    <thead>
                        <tr>
                            <th>Header</th>
                            <th>Status</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // Green for found headers (iterate over found_headers object)
            Object.keys(result.found_headers).forEach(header => {
                tableHTML += `
                    <tr>
                        <td>${header}</td>
                        <td style="color: green; font-weight: bold;">✅ Present</td>
                        <td>${result.found_headers[header]}</td>
                    </tr>
                `;
            });

            // Red for missing headers (iterate over missing_headers array) with explanations
            result.missing_headers.forEach(header => {
                const explanation = securityFixes[header] || "No explanation available";
                tableHTML += `
                    <tr>
                        <td>${header}</td>
                        <td style="color: red; font-weight: bold;">❌ Missing</td>
                        <td>N/A</td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <strong>How to fix:</strong> <pre>${explanation}</pre>
                        </td>
                    </tr>
                `;
            });

            tableHTML += `</tbody></table>`;
            resultDiv.innerHTML = tableHTML;
        }
    } catch (error) {
        hideSpinner('securityHeadersSpinner');
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}