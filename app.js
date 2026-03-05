// ESG Data Store
let esgData = {
    energy: [],
    water: [],
    waste: []
};

// Benchmarks for 4-star hotels (per room per year)
const BENCHMARKS = {
    energy: 3500, // kWh per room
    water: 120, // m³ per room
    waste: 350, // kg per room
    carbonPerKwh: 0.233 // kg CO2e per kWh (EU average)
};

const HOTEL_ROOMS = 55;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeUpload();
    initializeManualForm();
    initializeExports();
    loadSampleData();
});

// Tab Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// File Upload
function initializeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadedFilesDiv = document.getElementById('uploadedFiles');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    function handleFiles(files) {
        Array.from(files).forEach(file => {
            processFile(file, uploadedFilesDiv);
        });
    }
}

function processFile(file, container) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'uploaded-file';
    fileDiv.innerHTML = `
        <div class="file-info">
            <span class="file-icon">📄</span>
            <span>${file.name}</span>
        </div>
        <span class="file-status processing">Processing...</span>
    `;
    container.appendChild(fileDiv);
    
    // Simulate file processing
    setTimeout(() => {
        const mockData = generateMockDataFromFile(file.name);
        addDataPoint(mockData);
        
        const statusSpan = fileDiv.querySelector('.file-status');
        statusSpan.textContent = 'Processed ✓';
        statusSpan.classList.remove('processing');
        statusSpan.classList.add('success');
        
        updateDashboard();
    }, 1500);
}

function generateMockDataFromFile(filename) {
    const types = ['energy', 'water', 'waste'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    let consumption, unit, cost;
    
    switch(type) {
        case 'energy':
            consumption = 12000 + Math.random() * 8000;
            unit = 'kWh';
            cost = consumption * 0.18;
            break;
        case 'water':
            consumption = 400 + Math.random() * 300;
            unit = 'm³';
            cost = consumption * 3.5;
            break;
        case 'waste':
            consumption = 1200 + Math.random() * 800;
            unit = 'kg';
            cost = consumption * 0.12;
            break;
    }
    
    return {
        type,
        period: `${year}-${String(month + 1).padStart(2, '0')}`,
        consumption: Math.round(consumption),
        unit,
        cost: Math.round(cost * 100) / 100,
        supplier: 'Mock Supplier Inc.'
    };
}

// Manual Form
function initializeManualForm() {
    const form = document.getElementById('manualForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = {
            type: document.getElementById('dataType').value,
            period: document.getElementById('period').value,
            consumption: parseFloat(document.getElementById('consumption').value),
            unit: document.getElementById('unit').value,
            cost: parseFloat(document.getElementById('cost').value),
            supplier: 'Manual Entry'
        };
        
        addDataPoint(data);
        updateDashboard();
        form.reset();
        
        // Show success feedback
        alert('Data added successfully!');
    });
}

function addDataPoint(data) {
    esgData[data.type].push(data);
    esgData[data.type].sort((a, b) => new Date(a.period) - new Date(b.period));
}

// Dashboard Updates
function updateDashboard() {
    const period = document.getElementById('dashboardPeriod').value;
    const filteredData = filterDataByPeriod(period);
    
    updateKPIs(filteredData);
    updateAnomalies(filteredData);
    updateRecommendations(filteredData);
}

function filterDataByPeriod(period) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const filtered = {
        energy: [],
        water: [],
        waste: []
    };
    
    Object.keys(esgData).forEach(type => {
        filtered[type] = esgData[type].filter(item => {
            const [year, month] = item.period.split('-').map(Number);
            
            switch(period) {
                case 'month':
                    return year === currentYear && month === currentMonth + 1;
                case 'quarter':
                    const quarterMonth = Math.floor(currentMonth / 3) * 3;
                    return year === currentYear && month >= quarterMonth + 1 && month <= quarterMonth + 3;
                case 'year':
                    return year === currentYear;
                default:
                    return true;
            }
        });
    });
    
    return filtered;
}

function updateKPIs(data) {
    // Energy
    const energyTotal = data.energy.reduce((sum, item) => sum + item.consumption, 0);
    const energyCost = data.energy.reduce((sum, item) => sum + item.cost, 0);
    document.getElementById('energyValue').textContent = `${formatNumber(energyTotal)} kWh`;
    document.getElementById('energyCost').textContent = `€${formatNumber(energyCost)}`;
    
    const energyPerRoom = energyTotal / HOTEL_ROOMS;
    const energyBenchmarkPct = (energyPerRoom / BENCHMARKS.energy) * 100;
    document.getElementById('energyBenchmark').style.width = `${Math.min(energyBenchmarkPct, 100)}%`;
    updateTrend('energyTrend', calculateTrend(esgData.energy));
    
    // Water
    const waterTotal = data.water.reduce((sum, item) => sum + item.consumption, 0);
    const waterCost = data.water.reduce((sum, item) => sum + item.cost, 0);
    document.getElementById('waterValue').textContent = `${formatNumber(waterTotal)} m³`;
    document.getElementById('waterCost').textContent = `€${formatNumber(waterCost)}`;
    
    const waterPerRoom = waterTotal / HOTEL_ROOMS;
    const waterBenchmarkPct = (waterPerRoom / BENCHMARKS.water) * 100;
    document.getElementById('waterBenchmark').style.width = `${Math.min(waterBenchmarkPct, 100)}%`;
    updateTrend('waterTrend', calculateTrend(esgData.water));
    
    // Waste
    const wasteTotal = data.waste.reduce((sum, item) => sum + item.consumption, 0);
    const wasteCost = data.waste.reduce((sum, item) => sum + item.cost, 0);
    document.getElementById('wasteValue').textContent = `${formatNumber(wasteTotal)} kg`;
    document.getElementById('wasteCost').textContent = `€${formatNumber(wasteCost)}`;
    
    const wastePerRoom = wasteTotal / HOTEL_ROOMS;
    const wasteBenchmarkPct = (wastePerRoom / BENCHMARKS.waste) * 100;
    document.getElementById('wasteBenchmark').style.width = `${Math.min(wasteBenchmarkPct, 100)}%`;
    updateTrend('wasteTrend', calculateTrend(esgData.waste));
    
    // Carbon Footprint
    const carbonTotal = energyTotal * BENCHMARKS.carbonPerKwh;
    const carbonPerRoom = carbonTotal / HOTEL_ROOMS;
    document.getElementById('carbonValue').textContent = `${formatNumber(carbonTotal)} kg CO₂e`;
    document.getElementById('carbonPerRoom').textContent = `${formatNumber(carbonPerRoom)} kg/room`;
    
    const carbonBenchmarkPct = (carbonPerRoom / (BENCHMARKS.energy * BENCHMARKS.carbonPerKwh)) * 100;
    document.getElementById('carbonBenchmark').style.width = `${Math.min(carbonBenchmarkPct, 100)}%`;
    updateTrend('carbonTrend', calculateTrend(esgData.energy)); // Use energy trend as proxy
}

function calculateTrend(dataArray) {
    if (dataArray.length < 2) return 0;
    
    const recent = dataArray.slice(-2);
    const diff = recent[1].consumption - recent[0].consumption;
    const percentChange = (diff / recent[0].consumption) * 100;
    
    return percentChange;
}

function updateTrend(elementId, trend) {
    const element = document.getElementById(elementId);
    
    if (trend > 5) {
        element.textContent = `+${trend.toFixed(1)}%`;
        element.className = 'kpi-trend negative';
    } else if (trend < -5) {
        element.textContent = `${trend.toFixed(1)}%`;
        element.className = 'kpi-trend positive';
    } else {
        element.textContent = '—';
        element.className = 'kpi-trend neutral';
    }
}

function updateAnomalies(data) {
    const container = document.getElementById('anomaliesContainer');
    const anomalies = detectAnomalies(data);
    
    if (anomalies.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No anomalies detected. Everything looks normal.</p></div>';
        return;
    }
    
    container.innerHTML = anomalies.map(anomaly => `
        <div class="anomaly-card ${anomaly.severity}">
            <div class="anomaly-icon">${anomaly.icon}</div>
            <div class="anomaly-content">
                <div class="anomaly-title">${anomaly.title}</div>
                <div class="anomaly-description">${anomaly.description}</div>
                <span class="anomaly-severity ${anomaly.severity}">${anomaly.severity}</span>
            </div>
        </div>
    `).join('');
}

function detectAnomalies(data) {
    const anomalies = [];
    
    // Check energy consumption
    const energyTotal = data.energy.reduce((sum, item) => sum + item.consumption, 0);
    const energyPerRoom = energyTotal / HOTEL_ROOMS;
    
    if (energyPerRoom > BENCHMARKS.energy * 1.3) {
        anomalies.push({
            icon: '⚡',
            title: 'High Energy Consumption',
            description: `Energy consumption is 30% above the 4-star hotel average. Current: ${formatNumber(energyPerRoom)} kWh/room vs. benchmark: ${formatNumber(BENCHMARKS.energy)} kWh/room.`,
            severity: 'critical'
        });
    } else if (energyPerRoom > BENCHMARKS.energy * 1.15) {
        anomalies.push({
            icon: '⚡',
            title: 'Elevated Energy Consumption',
            description: `Energy consumption is 15% above average. Consider implementing energy-saving measures.`,
            severity: 'warning'
        });
    }
    
    // Check water consumption
    const waterTotal = data.water.reduce((sum, item) => sum + item.consumption, 0);
    const waterPerRoom = waterTotal / HOTEL_ROOMS;
    
    if (waterPerRoom > BENCHMARKS.water * 1.25) {
        anomalies.push({
            icon: '💧',
            title: 'High Water Usage',
            description: `Water consumption is significantly above average. Check for leaks or inefficient fixtures.`,
            severity: 'critical'
        });
    }
    
    // Check for unusual spikes
    if (esgData.energy.length >= 2) {
        const trend = calculateTrend(esgData.energy);
        if (trend > 25) {
            anomalies.push({
                icon: '📈',
                title: 'Unusual Consumption Spike',
                description: `Energy consumption increased by ${trend.toFixed(1)}% compared to the previous period. Investigate potential causes.`,
                severity: 'warning'
            });
        }
    }
    
    return anomalies;
}

function updateRecommendations(data) {
    const container = document.getElementById('recommendationsContainer');
    const recommendations = generateRecommendations(data);
    
    if (recommendations.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Add more data to receive personalized recommendations.</p></div>';
        return;
    }
    
    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="recommendation-header">
                <div class="recommendation-icon">${rec.icon}</div>
                <div class="recommendation-content">
                    <div class="recommendation-title">${rec.title}</div>
                </div>
            </div>
            <div class="recommendation-description">${rec.description}</div>
            <div class="recommendation-impact">
                ${rec.savings ? `
                    <div class="impact-item">
                        <div class="impact-label">Annual Savings</div>
                        <div class="impact-value positive">€${formatNumber(rec.savings)}</div>
                    </div>
                ` : ''}
                ${rec.reduction ? `
                    <div class="impact-item">
                        <div class="impact-label">Reduction</div>
                        <div class="impact-value">${rec.reduction}</div>
                    </div>
                ` : ''}
                ${rec.roi ? `
                    <div class="impact-item">
                        <div class="impact-label">ROI Period</div>
                        <div class="impact-value">${rec.roi}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function generateRecommendations(data) {
    const recommendations = [];
    
    const energyTotal = data.energy.reduce((sum, item) => sum + item.consumption, 0);
    const waterTotal = data.water.reduce((sum, item) => sum + item.consumption, 0);
    
    // LED Lighting
    if (energyTotal > 0) {
        recommendations.push({
            icon: '💡',
            title: 'Switch to LED Lighting',
            description: 'Replace all incandescent and halogen bulbs with LED lighting throughout the hotel. LEDs use 75% less energy and last 25 times longer.',
            savings: Math.round(energyTotal * 0.15 * 0.18),
            reduction: '15% energy',
            roi: '18 months'
        });
    }
    
    // Water-Saving Fixtures
    if (waterTotal > 0) {
        recommendations.push({
            icon: '🚿',
            title: 'Install Water-Saving Fixtures',
            description: 'Upgrade to low-flow showerheads, faucet aerators, and dual-flush toilets. Can reduce water consumption by up to 30% with minimal guest impact.',
            savings: Math.round(waterTotal * 0.25 * 3.5),
            reduction: '25% water',
            roi: '24 months'
        });
    }
    
    // Smart Thermostat
    if (energyTotal > 5000) {
        recommendations.push({
            icon: '🌡️',
            title: 'Implement Smart Room Controls',
            description: 'Install smart thermostats and occupancy sensors in guest rooms. Automatically adjust temperature when rooms are unoccupied.',
            savings: Math.round(energyTotal * 0.20 * 0.18),
            reduction: '20% HVAC costs',
            roi: '30 months'
        });
    }
    
    // Waste Management
    recommendations.push({
        icon: '♻️',
        title: 'Optimize Waste Sorting',
        description: 'Implement a comprehensive recycling program with clearly labeled bins in guest rooms and back-of-house areas. Partner with local recycling services.',
        savings: 800,
        reduction: '40% waste to landfill',
        roi: '12 months'
    });
    
    // Energy Monitoring
    if (energyTotal > 8000) {
        recommendations.push({
            icon: '📊',
            title: 'Real-Time Energy Monitoring',
            description: 'Install sub-meters to track energy consumption by area (guest rooms, kitchen, laundry). Identify and address inefficiencies quickly.',
            savings: Math.round(energyTotal * 0.12 * 0.18),
            reduction: '12% energy',
            roi: '36 months'
        });
    }
    
    return recommendations.slice(0, 5);
}

// Export Functions
function initializeExports() {
    document.getElementById('exportGreenKey').addEventListener('click', () => exportGreenKey());
    document.getElementById('exportGreenGlobe').addEventListener('click', () => exportGreenGlobe());
    document.getElementById('exportCSV').addEventListener('click', () => exportCSV());
}

function exportGreenKey() {
    const exportData = {
        certification: 'Green Key',
        hotel: {
            name: 'Demo Hotel',
            stars: 4,
            rooms: HOTEL_ROOMS
        },
        reporting_period: new Date().getFullYear(),
        environmental_data: {
            energy: {
                total_kwh: esgData.energy.reduce((sum, item) => sum + item.consumption, 0),
                per_room: esgData.energy.reduce((sum, item) => sum + item.consumption, 0) / HOTEL_ROOMS,
                renewable_percentage: 0
            },
            water: {
                total_m3: esgData.water.reduce((sum, item) => sum + item.consumption, 0),
                per_room: esgData.water.reduce((sum, item) => sum + item.consumption, 0) / HOTEL_ROOMS
            },
            waste: {
                total_kg: esgData.waste.reduce((sum, item) => sum + item.consumption, 0),
                recycling_rate: 35
            }
        },
        generated: new Date().toISOString()
    };
    
    downloadJSON(exportData, 'green-key-export.json');
}

function exportGreenGlobe() {
    const exportData = {
        certification: 'Green Globe',
        hotel_info: {
            name: 'Demo Hotel',
            classification: '4-star',
            total_rooms: HOTEL_ROOMS
        },
        sustainability_metrics: {
            energy_consumption_kwh: esgData.energy.reduce((sum, item) => sum + item.consumption, 0),
            water_consumption_m3: esgData.water.reduce((sum, item) => sum + item.consumption, 0),
            waste_generated_kg: esgData.waste.reduce((sum, item) => sum + item.consumption, 0),
            carbon_footprint_kg: esgData.energy.reduce((sum, item) => sum + item.consumption, 0) * BENCHMARKS.carbonPerKwh
        },
        report_date: new Date().toISOString()
    };
    
    downloadJSON(exportData, 'green-globe-export.json');
}

function exportCSV() {
    let csv = 'Type,Period,Consumption,Unit,Cost,Supplier\n';
    
    ['energy', 'water', 'waste'].forEach(type => {
        esgData[type].forEach(item => {
            csv += `${type},${item.period},${item.consumption},${item.unit},${item.cost},${item.supplier}\n`;
        });
    });
    
    downloadCSV(csv, 'esg-data-export.csv');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, filename);
}

function downloadCSV(data, filename) {
    const blob = new Blob([data], { type: 'text/csv' });
    downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility Functions
function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0
    }).format(num);
}

// Load Sample Data
function loadSampleData() {
    const sampleData = [
        { type: 'energy', period: '2026-01', consumption: 15200, unit: 'kWh', cost: 2736, supplier: 'EDF' },
        { type: 'energy', period: '2026-02', consumption: 14800, unit: 'kWh', cost: 2664, supplier: 'EDF' },
        { type: 'water', period: '2026-01', consumption: 520, unit: 'm³', cost: 1820, supplier: 'Veolia' },
        { type: 'water', period: '2026-02', consumption: 485, unit: 'm³', cost: 1697.5, supplier: 'Veolia' },
        { type: 'waste', period: '2026-01', consumption: 1450, unit: 'kg', cost: 174, supplier: 'SUEZ' },
        { type: 'waste', period: '2026-02', consumption: 1380, unit: 'kg', cost: 165.6, supplier: 'SUEZ' }
    ];
    
    sampleData.forEach(data => addDataPoint(data));
    updateDashboard();
}

// Dashboard Period Selector
document.getElementById('dashboardPeriod').addEventListener('change', updateDashboard);
