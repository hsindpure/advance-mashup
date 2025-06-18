// Main Dashboard JavaScript
$(document).ready(function() {
    // Wait for Chart.js to load
    if (typeof Chart !== 'undefined') {
        initializeDashboard();
        initializeEventListeners();
        initializeCharts();
        updateKPIs();
    } else {
        // Retry after a short delay
        setTimeout(function() {
            initializeDashboard();
            initializeEventListeners();
            initializeCharts();
            updateKPIs();
        }, 1000);
    }
});

// Dashboard State
let dashboardState = {
    currentTab: 'overview',
    sidebarCollapsed: false,
    filterPanelCollapsed: false,
    selections: [],
    selectionHistory: [],
    currentHistoryIndex: -1,
    lockedSelections: new Set()
};

// Initialize Dashboard
function initializeDashboard() {
    // Set initial active tab
    showTab('overview');
    
    // Initialize responsive behavior
    handleResponsive();
    
    // Window resize handler
    $(window).resize(function() {
        handleResponsive();
        // Resize charts
        Object.values(chartInstances).forEach(chart => {
            if (chart) chart.resize();
        });
    });
}

// Event Listeners
function initializeEventListeners() {
    // Sidebar toggle
    $('#hamburger').click(function() {
        toggleSidebar();
    });
    
    // Navigation items
    $('.nav-item').click(function() {
        const tab = $(this).data('tab');
        switchTab(tab);
    });
    
    // Filter toggle (original button)
    $('#filter-toggle').click(function() {
        toggleFilterPanel();
    });
    
    // Header filter toggle
    $('#header-filter-toggle').click(function() {
        toggleFilterPanel();
        $(this).toggleClass('active');
    });
    
    // Filter changes
    $('#date-filter, #region-filter, #category-filter').change(function() {
        applyFilters();
    });
    
    // Selection tools
    $('#backward-btn').click(function() { navigateHistory('backward'); });
    $('#forward-btn').click(function() { navigateHistory('forward'); });
    $('#lock-btn').click(function() { lockSelections(); });
    $('#unlock-btn').click(function() { unlockSelections(); });
    $('#clear-btn').click(function() { clearAllSelections(); });
    
    // Mobile menu handling
    if (window.innerWidth <= 768) {
        $('.nav-item').click(function() {
            $('#sidebar').removeClass('mobile-open');
        });
        
        // Add mobile hamburger functionality
        $('#hamburger').off('click').click(function() {
            $('#sidebar').toggleClass('mobile-open');
        });
    }
    
    // Close modal on background click
    $('#fullscreen-modal').click(function(e) {
        if (e.target === this) {
            closeFullscreen();
        }
    });
    
    // Keyboard shortcuts
    $(document).keydown(function(e) {
        if (e.key === 'Escape') {
            closeFullscreen();
        }
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            navigateHistory('backward');
        }
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            navigateHistory('forward');
        }
    });
}

// Sidebar Functions
function toggleSidebar() {
    dashboardState.sidebarCollapsed = !dashboardState.sidebarCollapsed;
    $('#sidebar').toggleClass('collapsed', dashboardState.sidebarCollapsed);
    
    // Update hamburger icon
    const icon = dashboardState.sidebarCollapsed ? 'fa-bars' : 'fa-times';
    $('#hamburger i').removeClass('fa-bars fa-times').addClass(icon);
    
    // Trigger chart resize after transition
    setTimeout(() => {
        Object.values(chartInstances).forEach(chart => {
            if (chart) chart.resize();
        });
    }, 300);
}

// Tab Functions
function switchTab(tabName) {
    if (dashboardState.currentTab === tabName) return;
    
    // Update navigation
    $('.nav-item').removeClass('active');
    $(`.nav-item[data-tab="${tabName}"]`).addClass('active');
    
    // Update content
    showTab(tabName);
    
    // Update header
    updateHeader(tabName);
    
    dashboardState.currentTab = tabName;
}

function showTab(tabName) {
    $('.tab-pane').removeClass('active');
    $(`#${tabName}-tab`).addClass('active');
    
    // Initialize charts for the active tab
    setTimeout(() => {
        initializeTabCharts(tabName);
    }, 100);
}

function updateHeader(tabName) {
    const tabInfo = {
        overview: { title: 'Overview Dashboard', subtitle: 'Real-time analytics and insights' },
        sales: { title: 'Sales Analytics', subtitle: 'Sales performance and trends' },
        customers: { title: 'Customer Analytics', subtitle: 'Customer insights and segmentation' },
        products: { title: 'Product Analytics', subtitle: 'Product performance and inventory' },
        analytics: { title: 'Web Analytics', subtitle: 'Traffic and conversion analysis' },
        reports: { title: 'Performance Reports', subtitle: 'Comprehensive business reports' }
    };
    
    const info = tabInfo[tabName] || tabInfo.overview;
    $('#page-title').text(info.title);
    $('#page-subtitle').text(info.subtitle);
}

// Filter Functions
function toggleFilterPanel() {
    dashboardState.filterPanelCollapsed = !dashboardState.filterPanelCollapsed;
    $('#filter-content').toggleClass('collapsed', dashboardState.filterPanelCollapsed);
    $('#filter-toggle').toggleClass('rotated', dashboardState.filterPanelCollapsed);
}

function applyFilters() {
    const filters = {
        dateRange: $('#date-filter').val(),
        region: $('#region-filter').val(),
        category: $('#category-filter').val()
    };
    
    console.log('Applying filters:', filters);
    
    // Add to selection history
    addToSelectionHistory('filter', filters);
    
    // Update charts with filtered data
    updateChartsWithFilters(filters);
    
    // Update KPIs
    updateKPIs(filters);
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call delay
    setTimeout(() => {
        hideLoadingState();
    }, 500);
}

// Selection Tools Functions
function navigateHistory(direction) {
    if (direction === 'backward' && dashboardState.currentHistoryIndex > 0) {
        dashboardState.currentHistoryIndex--;
        applyHistoryState(dashboardState.selectionHistory[dashboardState.currentHistoryIndex]);
    } else if (direction === 'forward' && dashboardState.currentHistoryIndex < dashboardState.selectionHistory.length - 1) {
        dashboardState.currentHistoryIndex++;
        applyHistoryState(dashboardState.selectionHistory[dashboardState.currentHistoryIndex]);
    }
    
    updateSelectionToolsState();
}

function lockSelections() {
    const currentFilters = {
        dateRange: $('#date-filter').val(),
        region: $('#region-filter').val(),
        category: $('#category-filter').val()
    };
    
    Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key] !== 'all') {
            dashboardState.lockedSelections.add(key);
        }
    });
    
    updateSelectionToolsState();
    showNotification('Selections locked', 'success');
}

function unlockSelections() {
    dashboardState.lockedSelections.clear();
    updateSelectionToolsState();
    showNotification('Selections unlocked', 'success');
}

function clearAllSelections() {
    // Only clear unlocked selections
    if (!dashboardState.lockedSelections.has('dateRange')) {
        $('#date-filter').val('30d');
    }
    if (!dashboardState.lockedSelections.has('region')) {
        $('#region-filter').val('all');
    }
    if (!dashboardState.lockedSelections.has('category')) {
        $('#category-filter').val('all');
    }
    
    applyFilters();
    showNotification('Selections cleared', 'info');
}

function addToSelectionHistory(type, data) {
    const historyEntry = {
        type: type,
        data: data,
        timestamp: new Date().toISOString()
    };
    
    // Remove any history after current index
    dashboardState.selectionHistory = dashboardState.selectionHistory.slice(0, dashboardState.currentHistoryIndex + 1);
    
    // Add new entry
    dashboardState.selectionHistory.push(historyEntry);
    dashboardState.currentHistoryIndex = dashboardState.selectionHistory.length - 1;
    
    // Limit history size
    if (dashboardState.selectionHistory.length > 50) {
        dashboardState.selectionHistory.shift();
        dashboardState.currentHistoryIndex--;
    }
    
    updateSelectionToolsState();
}

function applyHistoryState(historyEntry) {
    if (historyEntry.type === 'filter') {
        const filters = historyEntry.data;
        if (!dashboardState.lockedSelections.has('dateRange')) {
            $('#date-filter').val(filters.dateRange);
        }
        if (!dashboardState.lockedSelections.has('region')) {
            $('#region-filter').val(filters.region);
        }
        if (!dashboardState.lockedSelections.has('category')) {
            $('#category-filter').val(filters.category);
        }
        
        updateChartsWithFilters(filters);
        updateKPIs(filters);
    }
}

function updateSelectionToolsState() {
    // Update button states
    $('#backward-btn').prop('disabled', dashboardState.currentHistoryIndex <= 0);
    $('#forward-btn').prop('disabled', dashboardState.currentHistoryIndex >= dashboardState.selectionHistory.length - 1);
    $('#lock-btn').toggleClass('active', dashboardState.lockedSelections.size > 0);
    $('#unlock-btn').prop('disabled', dashboardState.lockedSelections.size === 0);
}

// Chart Functions
function updateChartsWithFilters(filters) {
    // Update all charts based on current tab
    const currentTab = dashboardState.currentTab;
    initializeTabCharts(currentTab, filters);
}

function initializeTabCharts(tabName, filters = null) {
    switch(tabName) {
        case 'overview':
            if (!chartInstances['revenue-chart'] || filters) {
                createRevenueChart(filters);
            }
            if (!chartInstances['category-chart'] || filters) {
                createCategoryChart(filters);
            }
            break;
        case 'sales':
            if (!chartInstances['daily-sales-chart'] || filters) {
                createDailySalesChart(filters);
            }
            if (!chartInstances['regional-sales-chart'] || filters) {
                createRegionalSalesChart(filters);
            }
            if (!chartInstances['target-chart'] || filters) {
                createTargetChart(filters);
            }
            break;
        case 'customers':
            if (!chartInstances['acquisition-chart'] || filters) {
                createAcquisitionChart(filters);
            }
            if (!chartInstances['segments-chart'] || filters) {
                createSegmentsChart(filters);
            }
            break;
        case 'products':
            if (!chartInstances['top-products-chart'] || filters) {
                createTopProductsChart(filters);
            }
            if (!chartInstances['inventory-chart'] || filters) {
                createInventoryChart(filters);
            }
            break;
        case 'analytics':
            if (!chartInstances['traffic-chart'] || filters) {
                createTrafficChart(filters);
            }
            if (!chartInstances['funnel-chart'] || filters) {
                createFunnelChart(filters);
            }
            break;
        case 'reports':
            if (!chartInstances['performance-chart'] || filters) {
                createPerformanceChart(filters);
            }
            if (!chartInstances['roi-chart'] || filters) {
                createROIChart(filters);
            }
            break;
    }
}

// KPI Functions
function updateKPIs(filters = null) {
    const data = generateKPIData(filters);
    
    $('#total-revenue').text(formatCurrency(data.revenue));
    $('#total-orders').text(formatNumber(data.orders));
    $('#total-customers').text(formatNumber(data.customers));
    $('#conversion-rate').text(formatPercentage(data.conversionRate));
}

// Fullscreen Functions
function fullscreenChart(chartId) {
    const chart = chartInstances[chartId];
    if (!chart) return;
    
    // Get chart title
    const chartContainer = $(`#${chartId}`).closest('.chart-container');
    const title = chartContainer.find('.chart-info h3').text();
    
    $('#modal-title').text(title);
    $('#fullscreen-modal').addClass('active');
    
    // Clone chart to modal
    const modalCanvas = document.getElementById('modal-chart');
    const modalCtx = modalCanvas.getContext('2d');
    
    // Destroy existing modal chart
    if (window.modalChartInstance) {
        window.modalChartInstance.destroy();
    }
    
    // Create new chart in modal
    window.modalChartInstance = new Chart(modalCtx, {
        type: chart.config.type,
        data: chart.data,
        options: {
            ...chart.options,
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function closeFullscreen() {
    $('#fullscreen-modal').removeClass('active');
    if (window.modalChartInstance) {
        window.modalChartInstance.destroy();
        window.modalChartInstance = null;
    }
}

// Export Functions
function exportChart(chartId, filename) {
    const chart = chartInstances[chartId];
    if (!chart) return;
    
    // Get chart data
    const data = chart.data;
    const worksheetData = [];
    
    // Add headers
    const headers = ['Label'];
    if (data.datasets) {
        data.datasets.forEach(dataset => {
            headers.push(dataset.label || 'Value');
        });
    }
    worksheetData.push(headers);
    
    // Add data rows
    if (data.labels) {
        data.labels.forEach((label, index) => {
            const row = [label];
            if (data.datasets) {
                data.datasets.forEach(dataset => {
                    row.push(dataset.data[index] || 0);
                });
            }
            worksheetData.push(row);
        });
    }
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Auto-size columns
    const colWidths = headers.map(() => ({ wch: 15 }));
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Chart Data');
    
    // Save file
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    showNotification('Chart exported successfully', 'success');
}

// Utility Functions
function handleResponsive() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        $('#sidebar').removeClass('collapsed').addClass('mobile-closed');
        $('.main-content').css('margin-left', '0');
    } else {
        $('#sidebar').removeClass('mobile-closed mobile-open');
        if (dashboardState.sidebarCollapsed) {
            $('#sidebar').addClass('collapsed');
        }
    }
}

function showLoadingState() {
    $('.chart-wrapper').each(function() {
        $(this).append('<div class="loading-overlay"><div class="loading"></div></div>');
    });
}

function hideLoadingState() {
    $('.loading-overlay').remove();
}

function showNotification(message, type = 'info') {
    const notification = $(`
        <div class="notification notification-${type}">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
            <span>${message}</span>
        </div>
    `);
    
    $('body').append(notification);
    
    setTimeout(() => {
        notification.addClass('show');
    }, 100);
    
    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

function formatPercentage(value) {
    return `${value.toFixed(1)}%`;
}

// CSS for notifications
const notificationCSS = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10000;
    border-left: 4px solid #10b981;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left-color: #10b981;
    color: #059669;
}

.notification-error {
    border-left-color: #ef4444;
    color: #dc2626;
}

.notification-info {
    border-left-color: #3b82f6;
    color: #2563eb;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}
</style>
`;

$('head').append(notificationCSS);
