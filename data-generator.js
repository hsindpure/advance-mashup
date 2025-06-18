// Data Generation Functions for Dashboard
// Note: This generates random data as requested for demonstration purposes

// Utility functions for random data generation
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function getDateRange(days) {
    const dates = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return dates;
}

function getMonthRange(months) {
    const monthNames = [];
    const today = new Date();
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        monthNames.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
    }
    return monthNames;
}

// KPI Data Generation
function generateKPIData(filters = null) {
    // Base values - would normally come from API
    const baseRevenue = 2500000;
    const baseOrders = 15420;
    const baseCustomers = 8950;
    const baseConversionRate = 3.2;
    
    // Apply filter multipliers (simulating filtered data)
    let multiplier = 1;
    if (filters) {
        if (filters.dateRange === '7d') multiplier = 0.2;
        else if (filters.dateRange === '90d') multiplier = 2.8;
        else if (filters.dateRange === '1y') multiplier = 12;
        
        if (filters.region !== 'all') multiplier *= 0.25;
        if (filters.category !== 'all') multiplier *= 0.3;
    }
    
    return {
        revenue: Math.round(baseRevenue * multiplier),
        orders: Math.round(baseOrders * multiplier),
        customers: Math.round(baseCustomers * multiplier),
        conversionRate: parseFloat((baseConversionRate * (0.8 + Math.random() * 0.4)).toFixed(1))
    };
}

// Revenue Trend Data
function generateRevenueData(filters = null) {
    const months = getMonthRange(12);
    const values = [];
    
    let baseValue = 180000;
    for (let i = 0; i < months.length; i++) {
        // Simulate growth trend with seasonal variation
        const growth = 1 + (i * 0.05);
        const seasonal = 0.9 + Math.sin(i * Math.PI / 6) * 0.1;
        const random = 0.85 + Math.random() * 0.3;
        
        values.push(Math.round(baseValue * growth * seasonal * random));
    }
    
    return {
        labels: months,
        values: values
    };
}

// Category Sales Data
function generateCategoryData(filters = null) {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
    const values = [
        getRandomNumber(180000, 250000),
        getRandomNumber(120000, 180000),
        getRandomNumber(80000, 120000),
        getRandomNumber(100000, 150000),
        getRandomNumber(60000, 100000)
    ];
    
    return {
        labels: categories,
        values: values,
        total: values.reduce((sum, val) => sum + val, 0)
    };
}

// Daily Sales Data
function generateDailySalesData(filters = null) {
    const days = getDateRange(30);
    const values = [];
    
    for (let i = 0; i < days.length; i++) {
        // Simulate weekday/weekend pattern
        const dayOfWeek = i % 7;
        const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0;
        
        values.push(Math.round(getRandomNumber(15000, 35000) * weekendMultiplier));
    }
    
    return {
        labels: days,
        values: values
    };
}

// Regional Sales Data
function generateRegionalSalesData(filters = null) {
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const values = [
        getRandomNumber(150000, 200000),
        getRandomNumber(120000, 180000),
        getRandomNumber(100000, 160000),
        getRandomNumber(130000, 190000),
        getRandomNumber(110000, 170000)
    ];
    
    return {
        labels: regions,
        values: values
    };
}

// Sales vs Target Data
function generateTargetData(filters = null) {
    const months = getMonthRange(12);
    const targets = [];
    const actuals = [];
    
    for (let i = 0; i < months.length; i++) {
        const target = 200000 + (i * 5000);
        const actual = target * (0.85 + Math.random() * 0.3);
        
        targets.push(target);
        actuals.push(Math.round(actual));
    }
    
    return {
        labels: months,
        target: targets,
        actual: actuals
    };
}

// Customer Acquisition Data
function generateAcquisitionData(filters = null) {
    const months = getMonthRange(12);
    const values = [];
    
    for (let i = 0; i < months.length; i++) {
        const baseValue = 320;
        const growth = 1 + (i * 0.08);
        const seasonal = 0.9 + Math.sin(i * Math.PI / 6) * 0.15;
        const random = 0.8 + Math.random() * 0.4;
        
        values.push(Math.round(baseValue * growth * seasonal * random));
    }
    
    return {
        labels: months,
        values: values
    };
}

// Customer Segments Data
function generateSegmentsData(filters = null) {
    const segments = ['High Value', 'Medium Value', 'Low Value', 'New Customers'];
    const values = [
        getRandomNumber(1200, 1800),
        getRandomNumber(2500, 3500),
        getRandomNumber(3500, 4500),
        getRandomNumber(1800, 2800)
    ];
    
    return {
        labels: segments,
        values: values,
        total: values.reduce((sum, val) => sum + val, 0)
    };
}

// Top Products Data
function generateTopProductsData(filters = null) {
    const products = [
        'Wireless Headphones',
        'Smart Watch',
        'Laptop Stand',
        'Bluetooth Speaker',
        'Phone Case',
        'Desk Lamp',
        'Keyboard',
        'Mouse Pad'
    ];
    
    const values = products.map(() => getRandomNumber(25000, 85000));
    
    // Sort by value descending
    const combined = products.map((product, index) => ({
        label: product,
        value: values[index]
    })).sort((a, b) => b.value - a.value).slice(0, 5);
    
    return {
        labels: combined.map(item => item.label),
        values: combined.map(item => item.value)
    };
}

// Inventory Data
function generateInventoryData(filters = null) {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
    
    return {
        labels: categories,
        inStock: categories.map(() => getRandomNumber(80, 150)),
        lowStock: categories.map(() => getRandomNumber(5, 25)),
        outOfStock: categories.map(() => getRandomNumber(0, 10))
    };
}

// Traffic Sources Data
function generateTrafficData(filters = null) {
    const sources = ['Direct', 'Search', 'Social Media', 'Email', 'Referral'];
    const values = [
        getRandomNumber(15000, 25000),
        getRandomNumber(20000, 35000),
        getRandomNumber(8000, 15000),
        getRandomNumber(5000, 12000),
        getRandomNumber(3000, 8000)
    ];
    
    return {
        labels: sources,
        values: values,
        total: values.reduce((sum, val) => sum + val, 0)
    };
}

// Conversion Funnel Data
function generateFunnelData(filters = null) {
    const stages = ['Visitors', 'Product Views', 'Add to Cart', 'Purchases'];
    const visitors = getRandomNumber(45000, 55000);
    const productViews = Math.round(visitors * 0.65);
    const addToCart = Math.round(productViews * 0.25);
    const purchases = Math.round(addToCart * 0.35);
    
    const values = [visitors, productViews, addToCart, purchases];
    const percentages = values.map((value, index) => 
        index === 0 ? 100 : ((value / visitors) * 100).toFixed(1)
    );
    
    return {
        labels: stages,
        values: values,
        percentages: percentages
    };
}

// Performance Metrics Data
function generatePerformanceData(filters = null) {
    const months = getMonthRange(12);
    const revenue = [];
    const conversion = [];
    
    for (let i = 0; i < months.length; i++) {
        revenue.push(getRandomNumber(180000, 280000));
        conversion.push(getRandomFloat(2.8, 4.2, 1));
    }
    
    return {
        labels: months,
        revenue: revenue,
        conversion: conversion
    };
}

// ROI Analysis Data
function generateROIData(filters = null) {
    const channels = ['Google Ads', 'Facebook', 'Email', 'Content', 'SEO', 'Referral'];
    const values = [
        getRandomFloat(15, 45, 1),
        getRandomFloat(8, 25, 1),
        getRandomFloat(25, 55, 1),
        getRandomFloat(5, 20, 1),
        getRandomFloat(35, 75, 1),
        getRandomFloat(10, 30, 1)
    ];
    
    return {
        labels: channels,
        values: values
    };
}

// Initialize random seed for consistent demo data
Math.seedrandom = function(seed) {
    Math.random = function() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
};

// Use a fixed seed for consistent demo data
Math.seedrandom(12345);
