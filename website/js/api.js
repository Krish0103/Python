// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Service for fetching real stock data
class StockAPI {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
        this.cache = new Map();
        this.cacheTimeout = 60000; // 1 minute cache
    }

    // Generic fetch method with error handling
    async fetch(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // POST request method
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // Get single stock data
    async getStock(symbol) {
        return await this.fetch(`/stock/${symbol}`);
    }

    // Get trending stocks
    async getTrendingStocks() {
        return await this.fetch('/stocks/trending');
    }

    // Get market indices
    async getMarketIndices() {
        return await this.fetch('/indices');
    }

    // Get stock history for charts
    async getStockHistory(symbol, period = '1mo') {
        return await this.fetch(`/stock/history/${symbol}?period=${period}`);
    }

    // Get optimized chart data
    async getStockChartData(symbol, period = '1mo') {
        return await this.fetch(`/stock/chart/${symbol}?period=${period}`);
    }

    // Calculate portfolio value
    async calculatePortfolio(holdings) {
        return await this.post('/portfolio/calculate', { holdings });
    }

    // Search stocks
    async searchStocks(query) {
        return await this.fetch(`/search?q=${encodeURIComponent(query)}`);
    }

    // Get mutual funds
    async getMutualFunds() {
        return await this.fetch('/mutual-funds');
    }

    // Health check
    async healthCheck() {
        return await this.fetch('/health');
    }

    // Batch fetch multiple stocks
    async getBatchStocks(symbols) {
        const promises = symbols.map(symbol => 
            this.getStock(symbol).catch(err => {
                console.error(`Error fetching ${symbol}:`, err);
                return null;
            })
        );
        const results = await Promise.all(promises);
        return results.filter(result => result !== null);
    }
}

// Create global API instance
const stockAPI = new StockAPI();

// Utility functions

// Format currency in Indian Rupees
function formatCurrency(amount, showSymbol = true) {
    const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    return showSymbol ? `₹${formatted}` : formatted;
}

// Format change with + or - sign
function formatChange(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatCurrency(change)}`;
}

// Format percentage change
function formatPercentChange(percent) {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
}

// Get CSS class for positive/negative values
function getChangeClass(value) {
    return value >= 0 ? 'positive' : 'negative';
}

// Format large numbers (e.g., market cap)
function formatLargeNumber(num) {
    if (num >= 10000000) { // 1 Crore
        return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) { // 1 Lakh
        return `₹${(num / 100000).toFixed(2)} L`;
    } else {
        return formatCurrency(num);
    }
}

// Check if market is open (IST 9:15 AM - 3:30 PM, Mon-Fri)
function isMarketOpen() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset);
    
    const day = istTime.getUTCDay();
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();
    
    // Check if weekday
    if (day === 0 || day === 6) return false;
    
    // Check if between 9:15 AM and 3:30 PM
    const currentMinutes = hours * 60 + minutes;
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    return currentMinutes >= marketOpen && currentMinutes <= marketClose;
}

// Show loading spinner
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="loading-spinner">Loading...</div>';
    }
}

// Show error message
function showError(element, message) {
    if (element) {
        element.innerHTML = `<div class="error-message">⚠️ ${message}</div>`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        stockAPI,
        formatCurrency,
        formatChange,
        formatPercentChange,
        getChangeClass,
        formatLargeNumber,
        isMarketOpen
    };
}
