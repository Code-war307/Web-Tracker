import { format } from 'date-fns';

// Mock data storage in memory (resets on reload, but that's expected for a mock)
// We'll pre-populate it with some data so the UI isn't empty.
let websites = [
    {
        id: '1',
        name: 'Production API',
        url: 'https://api.example.com',
        check_interval: 60,
        checks: Array.from({ length: 20 }).map((_, i) => ({
            status: 'UP',
            response_time: Math.floor(Math.random() * 100) + 50,
            checked_at: new Date(Date.now() - i * 60000).toISOString()
        }))
    },
    {
        id: '2',
        name: 'Landing Page',
        url: 'https://example.com',
        check_interval: 300,
        checks: Array.from({ length: 20 }).map((_, i) => ({
            status: Math.random() > 0.8 ? 'DOWN' : 'UP',
            response_time: Math.floor(Math.random() * 300) + 100,
            checked_at: new Date(Date.now() - i * 60000).toISOString()
        }))
    },
    {
        id: '3',
        name: 'Payment Gateway',
        url: 'https://pay.example.com',
        check_interval: 30,
        checks: Array.from({ length: 20 }).map((_, i) => ({
            status: 'UP',
            response_time: Math.floor(Math.random() * 50) + 20,
            checked_at: new Date(Date.now() - i * 30000).toISOString()
        }))
    }
];

// Mock Alerts
let alerts = [
    { id: 1, websiteName: "Landing Page", status: "DOWN", time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), duration: "5m", message: "Connection timeout" },
    { id: 2, websiteName: "Payment Gateway", status: "SLOW", time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), duration: "15m", message: "High latency detected (>300ms)" },
    { id: 3, websiteName: "Production API", status: "DOWN", time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), duration: "2m", message: "502 Bad Gateway" },
];

// Mock Settings
let settings = {
    theme: 'dark',
    refreshInterval: 30, // seconds
    notifications: {
        email: true,
        slack: false,
        sms: true
    }
};

export const getWebsites = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return websites;
};

export const getWebsiteById = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const site = websites.find(w => w.id === id);
    if (!site) throw new Error('Website not found');
    
    // Generate more history for the detail view to make the chart look good
    const detailedChecks = Array.from({ length: 60 }).map((_, i) => ({
        status: site.checks[0]?.status === 'DOWN' && i < 5 ? 'DOWN' : 'UP', // Keep consistency with summary if desired
        response_time: Math.floor(Math.random() * (site.checks[0]?.response_time || 100) * 1.5) + 20,
        checked_at: new Date(Date.now() - i * (site.check_interval || 60) * 1000).toISOString()
    })).reverse();

    return { ...site, checks: detailedChecks };
};

export const addWebsite = async (name, url, interval) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newSite = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        url,
        check_interval: parseInt(interval),
        checks: [{
            status: 'UP',
            response_time: Math.floor(Math.random() * 100),
            checked_at: new Date().toISOString()
        }]
    };
    websites = [...websites, newSite];
    return newSite;
};

export const deleteWebsite = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    websites = websites.filter(w => w.id !== id);
    return true;
};

// --- NEW METHODS FOR ANALYTICS, ALERTS, SETTINGS ---

export const getAnalyticsMetrics = async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Calculate aggregate metrics
    const totalUptime = 99.8; // Mock value
    const avgResponse = websites.reduce((acc, w) => acc + (w.checks[0]?.response_time || 0), 0) / websites.length;
    const incidentCount = alerts.length;

    // Generate historical trend data (last 7 days, 1 point per day)
    const trendData = Array.from({ length: 7 }).map((_, i) => ({
        date: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'EEE'),
        uptime: 98 + Math.random() * 2,
        avgLatency: 50 + Math.random() * 50
    }));

    return {
        totalUptime,
        avgResponse,
        incidentCount,
        trendData
    };
};

export const getAlerts = async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return alerts;
};

export const getSettings = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return settings;
};

export const updateSettings = async (newSettings) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    settings = { ...settings, ...newSettings };
    return settings;
};
