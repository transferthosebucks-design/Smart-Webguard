// Enhanced Popup Script - ThreatGuard with History and Analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Enhanced ThreatGuard Popup Loading...");
    
    // Initialize popup
    initializePopup();
    
    // Load threat history
    loadThreatHistory();
    
    // Setup event listeners
    setupEventListeners();
});

function initializePopup() {
    console.log("📊 Initializing popup components...");
    
    // Update current tab status
    updateCurrentTabStatus();
    
    // Set up periodic updates
    setInterval(updateCurrentTabStatus, 5000); // Update every 5 seconds
}

async function updateCurrentTabStatus() {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];
        
        if (currentTab) {
            // Update scanned pages count (mock data for now)
            const scannedPages = Math.floor(Math.random() * 100) + 50;
            document.getElementById('scannedPages').textContent = scannedPages;
            
            // Update threats blocked count
            const result = await chrome.storage.local.get(['threatHistory']);
            const threats = result.threatHistory || [];
            document.getElementById('threatsBlocked').textContent = threats.length;
        }
    } catch (error) {
        console.error("❌ Error updating tab status:", error);
    }
}

async function loadThreatHistory() {
    console.log("📂 Loading threat history...");
    
    try {
        const response = await chrome.runtime.sendMessage({ action: "getThreatHistory" });
        const threats = response.history || [];
        
        displayThreatHistory(threats);
        console.log("✅ Threat history loaded:", threats.length, "threats");
        
    } catch (error) {
        console.error("❌ Error loading threat history:", error);
        displayError("Failed to load threat history");
    }
}

function displayThreatHistory(threats) {
    const historyContainer = document.getElementById('threatHistory');
    
    if (threats.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <div>🛡️ No threats detected yet</div>
                <div>Your protection is working perfectly!</div>
            </div>
        `;
        return;
    }
    
    const threatsHTML = threats.map(threat => {
        const date = new Date(threat.timestamp);
        const timeAgo = getTimeAgo(date);
        
        return `
            <div class="threat-item">
                <h4>${truncateUrl(threat.url, 40)}</h4>
                <div class="threat-details">
                    <span class="threat-score">${threat.threatScore}/100</span>
                    <span class="threat-time">${timeAgo}</span>
                </div>
                <div class="threat-details">
                    <span>${threat.riskLevel.toUpperCase()}</span>
                    <span>${threat.category}</span>
                </div>
            </div>
        `;
    }).join('');
    
    historyContainer.innerHTML = threatsHTML;
}

function displayError(message) {
    const historyContainer = document.getElementById('threatHistory');
    historyContainer.innerHTML = `
        <div class="empty-state">
            <div>❌ ${message}</div>
            <div>Please try again</div>
        </div>
    `;
}

function truncateUrl(url, maxLength) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    
    return date.toLocaleDateString();
}

function setupEventListeners() {
    console.log("🎯 Setting up event listeners...");
    
    // Clear history button
    document.getElementById('clearHistory').addEventListener('click', async function() {
        if (confirm('Are you sure you want to clear all threat history?')) {
            try {
                await chrome.runtime.sendMessage({ action: "clearThreatHistory" });
                console.log("🗑️ Threat history cleared");
                loadThreatHistory(); // Reload the display
                updateCurrentTabStatus(); // Update stats
            } catch (error) {
                console.error("❌ Error clearing history:", error);
            }
        }
    });
    
    // Refresh button
    document.getElementById('refreshData').addEventListener('click', function() {
        console.log("🔄 Refreshing data...");
        loadThreatHistory();
        updateCurrentTabStatus();
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'r' && e.ctrlKey) {
            e.preventDefault();
            document.getElementById('refreshData').click();
        }
    });
}

// Add some interactivity to risk indicators
document.addEventListener('DOMContentLoaded', function() {
    const riskItems = document.querySelectorAll('.risk-item');
    
    riskItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Add animation to scanner indicator
document.addEventListener('DOMContentLoaded', function() {
    const scannerIndicator = document.querySelector('.scanner-indicator');
    
    if (scannerIndicator) {
        // Change color based on scanning status
        setInterval(() => {
            const colors = ['#10b981', '#3b82f6', '#f59e0b'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            scannerIndicator.style.background = randomColor;
        }, 3000);
    }
});

console.log("✅ Enhanced ThreatGuard Popup Script Loaded");
