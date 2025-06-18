// Chart Management
let chartInstances = {};

// Chart Colors - Updated to match new theme
const chartColors = {
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#334155',
    success: '#22c55e',
    successDark: '#16a34a',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    light: '#f8fafc',
    dark: '#0f172a',
    white: '#ffffff'
};

// Chart gradients
function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// Initialize all charts
function initializeCharts() {
    // Initialize overview charts first
    createRevenueChart();
    createCategoryChart();
}

// Revenue Trend Chart
function createRevenueChart(filters = null) {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (chartInstances['revenue-chart']) {
        chartInstances['revenue-chart'].destroy();
    }
    
    const data = generateRevenueData(filters);
    const gradient = createGradient(ctx.getContext('2d'), 'rgba(34, 197, 94, 0.8)', 'rgba(34, 197, 94, 0.1)');
    
    chartInstances['revenue-chart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Revenue',
                data: data.values,
                borderColor: chartColors.success,
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: chartColors.success,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: chartColors.success,
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Revenue: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Category Sales Chart
function createCategoryChart(filters = null) {
    const ctx = document.getElementById('category-chart');
    if (!ctx) return;
    
    if (chartInstances['category-chart']) {
        chartInstances['category-chart'].destroy();
    }
    
    const data = generateCategoryData(filters);
    
    chartInstances['category-chart'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    chartColors.primary,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.info,
                    chartColors.danger
                ],
                borderWidth: 0,
                hoverBorderWidth: 4,
                hoverBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.raw / data.total) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1000
            }
        }
    });
}

// Daily Sales Chart
function createDailySalesChart(filters = null) {
    const ctx = document.getElementById('daily-sales-chart');
    if (!ctx) return;
    
    if (chartInstances['daily-sales-chart']) {
        chartInstances['daily-sales-chart'].destroy();
    }
    
    const data = generateDailySalesData(filters);
    
    chartInstances['daily-sales-chart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Daily Sales',
                data: data.values,
                backgroundColor: chartColors.primary,
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Sales: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Regional Sales Chart
function createRegionalSalesChart(filters = null) {
    const ctx = document.getElementById('regional-sales-chart');
    if (!ctx) return;
    
    if (chartInstances['regional-sales-chart']) {
        chartInstances['regional-sales-chart'].destroy();
    }
    
    const data = generateRegionalSalesData(filters);
    
    chartInstances['regional-sales-chart'] = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Sales',
                data: data.values,
                borderColor: chartColors.success,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                pointBackgroundColor: chartColors.success,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Sales vs Target Chart
function createTargetChart(filters = null) {
    const ctx = document.getElementById('target-chart');
    if (!ctx) return;
    
    if (chartInstances['target-chart']) {
        chartInstances['target-chart'].destroy();
    }
    
    const data = generateTargetData(filters);
    
    chartInstances['target-chart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Actual Sales',
                data: data.actual,
                borderColor: chartColors.success,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: chartColors.success,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Target',
                data: data.target,
                borderColor: chartColors.warning,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointBackgroundColor: chartColors.warning,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'line'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Customer Acquisition Chart
function createAcquisitionChart(filters = null) {
    const ctx = document.getElementById('acquisition-chart');
    if (!ctx) return;
    
    if (chartInstances['acquisition-chart']) {
        chartInstances['acquisition-chart'].destroy();
    }
    
    const data = generateAcquisitionData(filters);
    
    chartInstances['acquisition-chart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'New Customers',
                data: data.values,
                borderColor: chartColors.info,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: chartColors.info,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `New Customers: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Customer Segments Chart
function createSegmentsChart(filters = null) {
    const ctx = document.getElementById('segments-chart');
    if (!ctx) return;
    
    if (chartInstances['segments-chart']) {
        chartInstances['segments-chart'].destroy();
    }
    
    const data = generateSegmentsData(filters);
    
    chartInstances['segments-chart'] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    chartColors.success,
                    chartColors.warning,
                    chartColors.danger,
                    chartColors.info
                ],
                borderWidth: 0,
                hoverBorderWidth: 4,
                hoverBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.raw / data.total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1000
            }
        }
    });
}

// Top Products Chart
function createTopProductsChart(filters = null) {
    const ctx = document.getElementById('top-products-chart');
    if (!ctx) return;
    
    if (chartInstances['top-products-chart']) {
        chartInstances['top-products-chart'].destroy();
    }
    
    const data = generateTopProductsData(filters);
    
    chartInstances['top-products-chart'] = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Sales',
                data: data.values,
                backgroundColor: chartColors.primary,
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Sales: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Inventory Chart
function createInventoryChart(filters = null) {
    const ctx = document.getElementById('inventory-chart');
    if (!ctx) return;
    
    if (chartInstances['inventory-chart']) {
        chartInstances['inventory-chart'].destroy();
    }
    
    const data = generateInventoryData(filters);
    
    chartInstances['inventory-chart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'In Stock',
                data: data.inStock,
                backgroundColor: chartColors.success,
                borderRadius: 4,
                borderSkipped: false,
            }, {
                label: 'Low Stock',
                data: data.lowStock,
                backgroundColor: chartColors.warning,
                borderRadius: 4,
                borderSkipped: false,
            }, {
                label: 'Out of Stock',
                data: data.outOfStock,
                backgroundColor: chartColors.danger,
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Traffic Sources Chart
function createTrafficChart(filters = null) {
    const ctx = document.getElementById('traffic-chart');
    if (!ctx) return;
    
    if (chartInstances['traffic-chart']) {
        chartInstances['traffic-chart'].destroy();
    }
    
    const data = generateTrafficData(filters);
    
    chartInstances['traffic-chart'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    chartColors.primary,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.info,
                    chartColors.danger
                ],
                borderWidth: 0,
                hoverBorderWidth: 4,
                hoverBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.raw / data.total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1000
            }
        }
    });
}

// Conversion Funnel Chart
function createFunnelChart(filters = null) {
    const ctx = document.getElementById('funnel-chart');
    if (!ctx) return;
    
    if (chartInstances['funnel-chart']) {
        chartInstances['funnel-chart'].destroy();
    }
    
    const data = generateFunnelData(filters);
    
    chartInstances['funnel-chart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Users',
                data: data.values,
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.info,
                    chartColors.success
                ],
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const percentage = data.percentages[context.dataIndex];
                            return `${context.raw.toLocaleString()} users (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Performance Metrics Chart
function createPerformanceChart(filters = null) {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;
    
    if (chartInstances['performance-chart']) {
        chartInstances['performance-chart'].destroy();
    }
    
    const data = generatePerformanceData(filters);
    
    chartInstances['performance-chart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Revenue',
                data: data.revenue,
                borderColor: chartColors.success,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                yAxisID: 'y',
                borderWidth: 3,
                tension: 0.4
            }, {
                label: 'Conversion Rate',
                data: data.conversion,
                borderColor: chartColors.warning,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                yAxisID: 'y1',
                borderWidth: 3,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// ROI Analysis Chart
function createROIChart(filters = null) {
    const ctx = document.getElementById('roi-chart');
    if (!ctx) return;
    
    if (chartInstances['roi-chart']) {
        chartInstances['roi-chart'].destroy();
    }
    
    const data = generateROIData(filters);
    
    chartInstances['roi-chart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'ROI %',
                data: data.values,
                backgroundColor: data.values.map(value => 
                    value >= 0 ? chartColors.success : chartColors.danger
                ),
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `ROI: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Chart.js 4.x compatibility fixes
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.interaction.intersect = false;
Chart.defaults.interaction.mode = 'index';

// Handle Chart.js horizontalBar type (deprecated in v4)
Chart.register({
    id: 'horizontalBar',
    beforeInit: function(chart) {
        if (chart.config.type === 'horizontalBar') {
            chart.config.type = 'bar';
            chart.config.options.indexAxis = 'y';
        }
    }
});
