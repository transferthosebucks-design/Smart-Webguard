// Simple Enhanced Popup Script
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Simple Enhanced Popup Loading...");
    
    loadThreatHistory();
    setupEventListeners();
});

async function loadThreatHistory() {
    try {
        const response = await chrome.runtime.sendMessage({ action: "getThreatHistory" });
        const threats = response.history || [];
        
        displayThreats(threats);
        document.getElementById('threatCount').textContent = threats.length;
        
        console.log("✅ Threat history loaded:", threats.length);
    } catch (error) {
        console.error("❌ Error loading history:", error);
        document.getElementById('threatHistory').innerHTML = '<div class="empty">Error loading history</div>';
    }
}

function displayThreats(threats) {
    const container = document.getElementById('threatHistory');
    
    if (threats.length === 0) {
        container.innerHTML = '<div class="empty">🛡️ No threats detected</div>';
        return;
    }
    
    const threatsHTML = threats.slice(0, 5).map(threat => {
        const date = new Date(threat.timestamp);
        const timeAgo = getTimeAgo(date);
        
        return `
            <div class="threat-item">
                <div class="threat-url">${truncateUrl(threat.url, 30)}</div>
                <div class="threat-details">
                    <span>${threat.threatScore}/100</span>
                    <span>${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = threatsHTML;
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
    
    return date.toLocaleDateString();
}

function setupEventListeners() {
    document.getElementById('clearHistory').addEventListener('click', async function() {
        if (confirm('Clear all threat history?')) {
            try {
                await chrome.runtime.sendMessage({ action: "clearThreatHistory" });
                loadThreatHistory();
            } catch (error) {
                console.error("❌ Error clearing history:", error);
            }
        }
    });
    
    document.getElementById('refresh').addEventListener('click', function() {
        loadThreatHistory();
    });
}

console.log("✅ Simple Enhanced Popup Script Loaded");
