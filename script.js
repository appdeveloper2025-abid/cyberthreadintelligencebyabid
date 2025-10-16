class CyberThreatVisualizer {
    constructor() {
        this.map = null;
        this.threatTypesChart = null;
        this.severityChart = null;
        this.timelineChart = null;
        this.threatData = [];
        this.filteredData = [];
        this.liveFeedActive = false;
        this.liveFeedInterval = null;
        this.soundEnabled = true;
        this.markers = [];
        this.init();
    }

    init() {
        this.initMap();
        this.initCharts();
        this.bindEvents();
        this.loadMockData();
        this.initAudio();
    }

    initAudio() {
        this.alertSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    }

    initMap() {
        this.map = L.map('map').setView([20, 0], 2);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);
    }

    initCharts() {
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                }
            }
        };

        // Threat Types Chart
        const threatCtx = document.getElementById('threatTypesChart').getContext('2d');
        this.threatTypesChart = new Chart(threatCtx, {
            type: 'doughnut',
            data: {
                labels: ['Malware', 'Phishing', 'DDoS', 'Botnet', 'Ransomware'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
                    borderColor: '#333',
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });

        // Severity Chart
        const severityCtx = document.getElementById('severityChart').getContext('2d');
        this.severityChart = new Chart(severityCtx, {
            type: 'bar',
            data: {
                labels: ['Low', 'Medium', 'High', 'Critical'],
                datasets: [{
                    label: 'Threats',
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#00ff88', '#feca57', '#ff9ff3', '#ff6b6b'],
                    borderColor: '#333',
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#333' }
                    },
                    x: {
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#333' }
                    }
                }
            }
        });

        // Timeline Chart
        const timelineCtx = document.getElementById('timelineChart').getContext('2d');
        this.timelineChart = new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Threats per Hour',
                    data: [],
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#333' }
                    },
                    x: {
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#333' }
                    }
                }
            }
        });
    }

    bindEvents() {
        document.getElementById('refreshData').addEventListener('click', () => {
            this.loadMockData();
        });

        document.getElementById('startLiveFeed').addEventListener('click', () => {
            this.toggleLiveFeed();
        });

        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('toggleSound').addEventListener('click', () => {
            this.toggleSound();
        });

        document.getElementById('severityFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('typeFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('searchInput').addEventListener('input', () => {
            this.applyFilters();
        });
    }

    updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    // Mock data generator (simulates API responses)
    generateMockThreat() {
        const threatTypes = ['Malware', 'Phishing', 'DDoS', 'Botnet', 'Ransomware', 'SQL Injection', 'Brute Force'];
        const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
        const countries = [
            { name: 'USA', lat: 39.8283, lng: -98.5795 },
            { name: 'China', lat: 35.8617, lng: 104.1954 },
            { name: 'Russia', lat: 61.5240, lng: 105.3188 },
            { name: 'Germany', lat: 51.1657, lng: 10.4515 },
            { name: 'Brazil', lat: -14.2350, lng: -51.9253 },
            { name: 'India', lat: 20.5937, lng: 78.9629 },
            { name: 'Japan', lat: 36.2048, lng: 138.2529 },
            { name: 'UK', lat: 55.3781, lng: -3.4360 },
            { name: 'France', lat: 46.6034, lng: 1.8883 },
            { name: 'Australia', lat: -25.2744, lng: 133.7751 }
        ];

        const country = countries[Math.floor(Math.random() * countries.length)];
        const now = new Date();
        const randomHoursAgo = Math.floor(Math.random() * 24);
        const timestamp = new Date(now.getTime() - randomHoursAgo * 60 * 60 * 1000);
        
        return {
            id: Date.now() + Math.random(),
            type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
            severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
            country: country.name,
            lat: country.lat + (Math.random() - 0.5) * 10,
            lng: country.lng + (Math.random() - 0.5) * 10,
            timestamp: timestamp.toISOString(),
            ip: this.generateRandomIP()
        };
    }

    generateRandomIP() {
        return Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
    }

    async loadMockData() {
        this.updateStatus('Loading threat data...');
        
        // Clear existing data
        this.threatData = [];
        this.clearMarkers();

        // Generate mock threats
        const threatCount = 50 + Math.floor(Math.random() * 50);
        for (let i = 0; i < threatCount; i++) {
            this.threatData.push(this.generateMockThreat());
        }

        this.filteredData = [...this.threatData];
        this.visualizeThreats();
        this.updateCharts();
        this.updateStats();
        this.updateThreatFeed();
        this.updateStatus(`Loaded ${this.threatData.length} threats`);
    }

    clearMarkers() {
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
    }

    toggleLiveFeed() {
        const button = document.getElementById('startLiveFeed');
        
        if (this.liveFeedActive) {
            clearInterval(this.liveFeedInterval);
            this.liveFeedActive = false;
            button.textContent = '▶️ Start Live Feed';
            button.classList.remove('active');
        } else {
            this.liveFeedActive = true;
            button.textContent = '⏸️ Stop Live Feed';
            button.classList.add('active');
            this.liveFeedInterval = setInterval(() => {
                this.addNewThreat();
            }, 3000);
        }
    }

    addNewThreat() {
        const newThreat = this.generateMockThreat();
        this.threatData.unshift(newThreat);
        
        if (this.threatData.length > 200) {
            this.threatData = this.threatData.slice(0, 200);
        }
        
        this.applyFilters();
        this.playAlert(newThreat.severity);
    }

    playAlert(severity) {
        if (this.soundEnabled && (severity === 'Critical' || severity === 'High')) {
            this.alertSound.play().catch(() => {});
        }
    }

    toggleSound() {
        const button = document.getElementById('toggleSound');
        this.soundEnabled = !this.soundEnabled;
        
        if (this.soundEnabled) {
            button.textContent = '🔊 Sound: ON';
            button.classList.remove('muted');
        } else {
            button.textContent = '🔇 Sound: OFF';
            button.classList.add('muted');
        }
    }

    applyFilters() {
        const severityFilter = document.getElementById('severityFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        this.filteredData = this.threatData.filter(threat => {
            const severityMatch = severityFilter === 'all' || threat.severity === severityFilter;
            const typeMatch = typeFilter === 'all' || threat.type === typeFilter;
            const searchMatch = searchTerm === '' || 
                threat.ip.toLowerCase().includes(searchTerm) ||
                threat.country.toLowerCase().includes(searchTerm);
            
            return severityMatch && typeMatch && searchMatch;
        });
        
        this.visualizeThreats();
        this.updateCharts();
        this.updateStats();
        this.updateThreatFeed();
    }

    exportData() {
        const dataStr = JSON.stringify(this.threatData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cyber-threats-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    visualizeThreats() {
        this.clearMarkers();
        
        const severityColors = {
            'Low': '#00ff88',
            'Medium': '#feca57',
            'High': '#ff9ff3',
            'Critical': '#ff6b6b'
        };

        this.filteredData.forEach(threat => {
            const marker = L.circleMarker([threat.lat, threat.lng], {
                color: severityColors[threat.severity],
                fillColor: severityColors[threat.severity],
                fillOpacity: 0.7,
                radius: this.getSeverityRadius(threat.severity),
                weight: 2
            }).addTo(this.map);

            this.markers.push(marker);

            marker.bindPopup(`
                <div style="color: #000; font-weight: bold;">
                    <strong>🚨 ${threat.type}</strong><br>
                    <strong>Severity:</strong> ${threat.severity}<br>
                    <strong>Location:</strong> ${threat.country}<br>
                    <strong>IP:</strong> ${threat.ip}<br>
                    <strong>Time:</strong> ${new Date(threat.timestamp).toLocaleString()}
                </div>
            `);
        });
    }

    getSeverityRadius(severity) {
        const radii = { 'Low': 5, 'Medium': 8, 'High': 12, 'Critical': 16 };
        return radii[severity] || 5;
    }

    updateCharts() {
        // Update threat types chart
        const typeCounts = {};
        const severityCounts = { 'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0 };

        this.filteredData.forEach(threat => {
            typeCounts[threat.type] = (typeCounts[threat.type] || 0) + 1;
            severityCounts[threat.severity]++;
        });

        // Update threat types chart
        const typeLabels = Object.keys(typeCounts);
        const typeData = Object.values(typeCounts);
        
        this.threatTypesChart.data.labels = typeLabels;
        this.threatTypesChart.data.datasets[0].data = typeData;
        this.threatTypesChart.update();

        // Update severity chart
        this.severityChart.data.datasets[0].data = [
            severityCounts.Low,
            severityCounts.Medium,
            severityCounts.High,
            severityCounts.Critical
        ];
        this.severityChart.update();

        // Update timeline chart
        this.updateTimelineChart();
    }

    updateTimelineChart() {
        const hourlyData = {};
        const now = new Date();
        
        // Initialize last 24 hours
        for (let i = 23; i >= 0; i--) {
            const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
            const hourKey = hour.getHours().toString().padStart(2, '0') + ':00';
            hourlyData[hourKey] = 0;
        }
        
        // Count threats per hour (simulated)
        this.filteredData.forEach(threat => {
            const hour = new Date(threat.timestamp).getHours().toString().padStart(2, '0') + ':00';
            if (hourlyData[hour] !== undefined) {
                hourlyData[hour]++;
            }
        });
        
        this.timelineChart.data.labels = Object.keys(hourlyData);
        this.timelineChart.data.datasets[0].data = Object.values(hourlyData);
        this.timelineChart.update();
    }

    updateStats() {
        const totalThreats = this.filteredData.length;
        const criticalThreats = this.filteredData.filter(t => t.severity === 'Critical').length;
        const countries = new Set(this.filteredData.map(t => t.country)).size;
        const lastUpdate = new Date().toLocaleTimeString();
        
        document.getElementById('totalThreats').textContent = totalThreats;
        document.getElementById('criticalThreats').textContent = criticalThreats;
        document.getElementById('countriesAffected').textContent = countries;
        document.getElementById('lastUpdate').textContent = lastUpdate;
    }

    updateThreatFeed() {
        const feedContainer = document.getElementById('threatList');
        feedContainer.innerHTML = '';
        
        const recentThreats = this.filteredData.slice(0, 10);
        
        recentThreats.forEach(threat => {
            const threatItem = document.createElement('div');
            threatItem.className = `threat-item ${threat.severity.toLowerCase()}`;
            
            threatItem.innerHTML = `
                <div class="threat-info">
                    <strong>${threat.type}</strong> - ${threat.severity}<br>
                    <small>${threat.country} (${threat.ip})</small>
                </div>
                <div class="threat-time">
                    ${new Date(threat.timestamp).toLocaleTimeString()}
                </div>
            `;
            
            feedContainer.appendChild(threatItem);
        });
    }

    // Method to integrate with real APIs (commented for demo)
    /*
    async fetchFromAbuseIPDB(ip) {
        const apiKey = 'YOUR_API_KEY';
        const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
            headers: {
                'Key': apiKey,
                'Accept': 'application/json'
            }
        });
        return response.json();
    }

    async fetchFromAlienVault(indicator) {
        const response = await fetch(`https://otx.alienvault.com/api/v1/indicators/IPv4/${indicator}/general`);
        return response.json();
    }
    */
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CyberThreatVisualizer();
    initMobileNavigation();
});

// Mobile navigation functionality
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Prevent context menu on right click for better UX
document.addEventListener('contextmenu', e => e.preventDefault());