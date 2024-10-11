// Function to copy content to clipboard and open Claude AI in a new tab
function copyAndOpenClaude() {
    const contentContainer = document.getElementById('file-content');
    const textToCopy = contentContainer.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Open Claude AI in a new tab after copying the content
        window.open('https://claude.ai/', '_blank');
        alert('All file content has been copied to the clipboard.\n\nA new tab has been opened to Claude AI. Once there, paste the content by pressing Ctrl + V (or Cmd + V on Mac) in the input field.');
    }).catch(err => {
        console.error('Failed to copy content: ', err);
        alert('Failed to copy content. Please try again.');
    });
}
// Function to copy content to clipboard and open Google Gemini in a new tab
function copyAndOpenGemini() {
    const contentContainer = document.getElementById('file-content');
    const textToCopy = contentContainer.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Open Google Gemini in a new tab after copying the content
        window.open('https://gemini.google.com/', '_blank');
        alert('All file content has been copied to the clipboard.\n\nA new tab has been opened to Google Gemini. Once there, paste the content by pressing Ctrl + V (or Cmd + V on Mac) in the input field.');
    }).catch(err => {
        console.error('Failed to copy content: ', err);
        alert('Failed to copy content. Please try again.');
    });
}
// Function to copy content to clipboard and open ChatGPT in a new tab
function copyAndOpenChatGPT() {
    const contentContainer = document.getElementById('file-content');
    const textToCopy = contentContainer.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Open ChatGPT in a new tab after copying the content
        window.open('https://chat.openai.com/', '_blank');
        alert('All file content has been copied to the clipboard.\n\nA new tab has been opened to ChatGPT. Once there, paste the content by pressing Ctrl + V (or Cmd + V on Mac) in the input field.');
    }).catch(err => {
        console.error('Failed to copy content: ', err);
        alert('Failed to copy content. Please try again.');
    });
}
// List of image file extensions to exclude
const excludedExtensions = ['.png', '.gif', '.jpg', '.jpeg', '.svg', '.bmp', '.ico', '.webp'];
// Function to extract the owner and repo from different input formats
function parseRepoInput(input) {
    let repoPath;
    try {
        const url = new URL(input);
        repoPath = url.pathname.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
    } catch (e) {
        repoPath = input.trim(); // If input is not a URL, use it directly
    }
    const [owner, repo] = repoPath.split('/');
    return { owner, repo };
}

// Variable to store GitHub credentials
let githubCredentials = {
    username: '',
    token: ''
};
// Function to open the modal
function openCredentialModal() {
    document.getElementById('githubCredentialModal').style.display = 'flex';
}
// Function to close the modal
function closeCredentialModal() {
    document.getElementById('githubCredentialModal').style.display = 'none';
}
// Function to save GitHub credentials
function saveGithubCredentials() {
    const username = document.getElementById('githubUsername').value;
    const token = document.getElementById('githubToken').value;
    if (username && token) {
        githubCredentials.username = username;
        githubCredentials.token = token;
        closeCredentialModal();
        alert('GitHub credentials saved. Please try loading the repository again.');
    } else {
        alert('Please enter both your GitHub username and personal access token.');
    }
}

// Function to fetch repo contents with authentication using Bearer token (if available)
async function fetchRepoContents(owner, repo, path = '') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = githubCredentials.token ? {
        'Authorization': `token ${githubCredentials.token}`
    } : {};

    const response = await fetch(url, { headers });
    if (response.ok) {
        return await response.json();
    } else if (response.status === 403) {
        // Check if the error is due to rate limiting
        const errorData = await response.json();
        if (errorData.message.includes('API rate limit exceeded')) {
            openCredentialModal(); // Open the modal to ask for GitHub credentials
        }
        throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
    } else {
        throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
    }
}
// Function to fetch file content with authentication using Bearer token (if available)
async function fetchFileContent(owner, repo, filePath) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const headers = githubCredentials.token ? {
        'Authorization': `token ${githubCredentials.token}`
    } : {};
    const response = await fetch(url, { headers });
    if (response.ok) {
        const data = await response.json();
        const content = atob(data.content.replace(/\n/g, '')); // Decode base64 content
        return content;
    } else if (response.status === 403) {
        // Check if the error is due to rate limiting
        const errorData = await response.json();
        if (errorData.message.includes('API rate limit exceeded')) {
            openCredentialModal(); // Open the modal to ask for GitHub credentials
        }
        throw new Error(`Error fetching file content: ${response.status} ${response.statusText}`);
    } else {
        throw new Error(`Error fetching file content: ${response.status} ${response.statusText}`);
    }
}
// Function to fetch the file content
async function fetchFileContent(owner, repo, filePath) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        const content = atob(data.content.replace(/\n/g, '')); // Decode base64 content
        return content;
    } else {
        throw new Error(`Error fetching file content: ${response.status} ${response.statusText}`);
    }
}
// Function to determine the language for syntax highlighting based on file extension
function getLanguageFromExtension(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    const languageMap = {
        'js': 'javascript',
        'py': 'python',
        'java': 'java',
        'c': 'c',
        'cpp': 'cpp',
        'cs': 'csharp',
        'rb': 'ruby',
        'php': 'php',
        'html': 'markup',
        'css': 'css',
        'json': 'json',
        'md': 'markdown',
        'sh': 'bash',
        'go': 'go',
        'ts': 'typescript',
        // Add more mappings as needed
    };
    return languageMap[extension] || '';
}
// Function to recursively traverse the repository and count all non-image files
async function traverseRepo(owner, repo, path = '', totalFiles = { count: 0 }) {
    const contents = await fetchRepoContents(owner, repo, path);
    for (const item of contents) {
        if (item.type === 'dir') {
            await traverseRepo(owner, repo, item.path, totalFiles);
        } else if (item.type === 'file') {
            // Check if the file extension is excluded
            const isExcluded = excludedExtensions.some(ext => item.name.toLowerCase().endsWith(ext));
            if (isExcluded) {
                continue; // Skip image files
            }
            totalFiles.count += 1; // Increment total files to be fetched
        }
    }
    return totalFiles;
}
// Cache expiration time in milliseconds (e.g., 1 hour)
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

// Function to get cached data
function getCachedData(key) {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        const currentTime = Date.now();
        // Check if the cached data is still valid
        if (currentTime - timestamp < CACHE_EXPIRATION_TIME) {
            return data;
        } else {
            // Remove expired data
            localStorage.removeItem(key);
        }
    }
    return null;
}
// Function to set data in the cache
function setCacheData(key, data) {
    const cacheEntry = {
        timestamp: Date.now(),
        data: data
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
}
// Function to fetch repo contents with caching logic
async function fetchRepoContentsWithCache(owner, repo, path = '') {
    const cacheKey = `repoContents_${owner}_${repo}_${path}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
        console.log(`Using cached data for ${path}`);
        return cachedData;
    } else {
        const data = await fetchRepoContents(owner, repo, path);
        setCacheData(cacheKey, data);
        return data;
    }
}
// Function to fetch file content with caching logic
async function fetchFileContentWithCache(owner, repo, filePath) {
    const cacheKey = `fileContent_${owner}_${repo}_${filePath}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
        console.log(`Using cached file content for ${filePath}`);
        return cachedData;
    } else {
        const content = await fetchFileContent(owner, repo, filePath);
        setCacheData(cacheKey, content);
        return content;
    }
}
// Updated function to recursively traverse the repository and fetch all file contents with caching
async function traverseRepoWithProgress(owner, repo, path = '', fileContents = {}, totalFiles = { count: 0 }, fetchedFiles = { count: 0 }) {
    const contents = await fetchRepoContentsWithCache(owner, repo, path);
    for (const item of contents) {
        if (item.type === 'dir') {
            await traverseRepoWithProgress(owner, repo, item.path, fileContents, totalFiles, fetchedFiles);
        } else if (item.type === 'file') {
            // Check if the file extension is excluded
            const isExcluded = excludedExtensions.some(ext => item.name.toLowerCase().endsWith(ext));
            if (isExcluded) {
                continue; // Skip image files
            }
            try {
                const content = await fetchFileContentWithCache(owner, repo, item.path);
                fileContents[item.path] = content;
            } catch (err) {
                console.error(`Failed to fetch ${item.path}: ${err.message}`);
                fileContents[item.path] = `Error fetching file content: ${err.message}`;
            }
            fetchedFiles.count += 1;
            updateProgressBar(fetchedFiles.count, totalFiles.count);
        }
    }
    return fileContents;
}
// Function to initialize jsTree with the repository structure
function initializeJsTree(owner, repo) {
    $('#file-tree').jstree({
        'core': {
            'data': async function (node, callback) {
                let path = '';
                if (node.id !== '#') {
                    path = node.data.path;
                }
                try {
                    const data = await fetchRepoContents(owner, repo, path);
                    const treeData = data.map(item => {
                        // Exclude image files from the tree
                        const isExcluded = excludedExtensions.some(ext => item.name.toLowerCase().endsWith(ext));
                        if (isExcluded && item.type === 'file') {
                            return null; // Exclude image files
                        }

                        if (item.type === 'dir') {
                            return {
                                "text": item.name,
                                "children": true, // Indicates that the node has children
                                "data": { "path": item.path, "type": "dir" }
                            };
                        } else if (item.type === 'file') {
                            return {
                                "text": item.name,
                                "icon": "jstree-file",
                                "data": { "path": item.path, "type": "file" }
                            };
                        } else {
                            return {
                                "text": item.name,
                                "icon": "jstree-file",
                                "data": { "path": item.path, "type": item.type }
                            };
                        }
                    }).filter(item => item !== null); // Remove null entries

                    callback(treeData);
                } catch (err) {
                    showError(err.message);
                    callback([]);
                }
            },
            'themes': {
                'icons': true
            }
        },
        "plugins" : [ "wholerow", "search" ]
    });
    // Initialize jsTree search plugin
    let searchTimeout = null;
    $('#searchBar').keyup(function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            var v = $('#searchBar').val();
            $('#file-tree').jstree(true).search(v);
        }, 300);
    });

    // Event listener for when a node is selected (optional, since all contents are already displayed)
    $('#file-tree').on("select_node.jstree", function (e, data) {
        // Optional: Highlight the selected file in the content area
        // Not necessary for LLM copying, but can enhance user experience
    });
}
// Function to display all file contents with syntax highlighting
function displayAllFileContents(fileContents) {
    const contentContainer = document.getElementById('file-content');
    contentContainer.innerHTML = ''; // Clear existing content

    for (const [filePath, content] of Object.entries(fileContents)) {
        const language = getLanguageFromExtension(filePath);
        const fileSection = document.createElement('div');
        fileSection.innerHTML = `
            <h3>### File: ${escapeHtml(filePath)}</h3>
            <pre><code class="language-${language}">${escapeHtml(content)}</code></pre>
            <hr>
        `;
        contentContainer.appendChild(fileSection);
    }

    // After adding all code blocks, initialize Prism.js
    Prism.highlightAll();
}
// Function to load the repository data and render it in the file tree and display all contents
async function loadRepo() {
    const repoInput = document.getElementById('repoInput').value;
    const { owner, repo } = parseRepoInput(repoInput);
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const copyButton = document.getElementById('copyButton');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    // Reset previous state
    $('#file-tree').jstree("destroy").empty();
    document.getElementById('file-content').innerHTML = ''; // Clear the file content section
    copyButton.style.display = 'none'; // Hide the copy button until content is loaded
    errorMessage.textContent = ''; // Clear previous errors
    progressBar.style.width = '0%';
    progressContainer.style.display = 'none';

    if (!owner || !repo) {
        alert('Please enter a valid GitHub repository in the format "https://github.com/username/repo-name" or "username/repo-name".');
        return;
    }
    try {
        loadingSpinner.style.display = 'block'; // Show loading spinner
        progressContainer.style.display = 'block'; // Show progress bar

        // First, traverse the repo to get the total number of files
        const totalFilesObj = await traverseRepo(owner, repo);
        const totalFiles = totalFilesObj.count;
        if (totalFiles === 0) {
            throw new Error('No non-image files found in the repository.');
        }

        // Now, traverse the repo again to fetch file contents with progress
        const fileContents = {};
        await traverseRepoWithProgress(owner, repo, '', fileContents, totalFiles, { count: 0 });

        displayAllFileContents(fileContents);

        // Initialize and display the file tree
        initializeJsTree(owner, repo);

        copyButton.style.display = 'block'; // Show the copy button after content is loaded
    } catch (err) {
        console.error(err);
        errorMessage.textContent = err.message;
    } finally {
        loadingSpinner.style.display = 'none'; // Hide loading spinner
        progressContainer.style.display = 'none'; // Hide progress bar
    }
}
// Function to escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Function to copy all displayed file content and file tree structure to clipboard
function copyAllContent() {
    const contentContainer = document.getElementById('file-content');
    const fileTreeContainer = document.getElementById('file-tree');

    // Combine both the file tree and file content into a single text block
    const fileTreeText = fileTreeContainer ? fileTreeContainer.innerText : '';
    const fileContentText = contentContainer ? contentContainer.innerText : '';

    const textToCopy = `### Files Tree:\n${fileTreeText}\n\n### Files Content:\n${fileContentText}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Files Tree and file content have been copied to the clipboard.');
    }).catch(err => {
        console.error('Failed to copy content: ', err);
        alert('Failed to copy content. Please try again.');
    });
}
// Function to update the progress bar
function updateProgressBar(fetched, total) {
    const progressBar = document.getElementById('progressBar');
    const percentage = ((fetched / total) * 100).toFixed(2);
    progressBar.style.width = `${percentage}%`;
}

// Function to show error messages
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
}

// Add event listener to the Load Repository button
document.getElementById('loadRepoButton').addEventListener('click', loadRepo);