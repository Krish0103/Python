// ===========================================
// AUTHENTICATION & INITIALIZATION
// ===========================================

// Portfolio holdings configuration (user's existing holdings)
const portfolioHoldings = [
    { symbol: 'RELIANCE', quantity: 10, avg_price: 2540 },
    { symbol: 'TCS', quantity: 5, avg_price: 3620 },
    { symbol: 'HDFCBANK', quantity: 15, avg_price: 1580 },
    { symbol: 'INFY', quantity: 20, avg_price: 1450 }
];

// Watchlist stocks
const watchlistStocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'WIPRO'];

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set user info
    const userEmail = sessionStorage.getItem('userEmail') || 'demo@groww.in';
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        const displayName = userEmail.split('@')[0];
        userNameElement.textContent = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize data loading
    initializeData();
    
    // Setup logout button
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// ===========================================
// NAVIGATION HANDLING
// ===========================================

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item:not(.logout)');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active to current
            this.classList.add('active');
            const page = this.getAttribute('data-page');
            
            const targetSection = document.getElementById(`${page}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Load section-specific data
                loadSectionData(page);
            }
            
            // Update page title
            updatePageTitle(page);
        });
    });
}

function updatePageTitle(page) {
    const titles = {
        'overview': 'Dashboard',
        'portfolio': 'Portfolio',
        'stocks': 'Explore Stocks',
        'mutualfunds': 'Mutual Funds',
        'watchlist': 'Watchlist',
        'orders': 'Orders',
        'profile': 'Profile'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titles[page] || 'Dashboard';
    }
}

function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// ===========================================
// SEARCH FUNCTIONALITY
// ===========================================

let searchInstance = null;

function initializeSearch() {
    searchInstance = new StockSearch('stock-search-input', 'search-results');
}

// ===========================================
// DATA LOADING FUNCTIONS
// ===========================================

// Portfolio chart instance
let portfolioChartInstance = null;

async function checkBackendHealth() {
    try {
        const health = await stockAPI.healthCheck();
        console.log('✅ Backend is healthy:', health.message);
        
        // Show market status
        const marketStatusDiv = document.createElement('div');
        marketStatusDiv.className = 'market-status';
        marketStatusDiv.style.cssText = 'position: fixed; top: 70px; right: 20px; padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; z-index: 100;';
        
        const isOpen = isMarketOpen();
        marketStatusDiv.textContent = isOpen ? '🟢 Market Open' : '🔴 Market Closed';
        marketStatusDiv.style.backgroundColor = isOpen ? '#e8f5e9' : '#ffebee';
        marketStatusDiv.style.color = isOpen ? '#2e7d32' : '#c62828';
        
        document.body.appendChild(marketStatusDiv);
        
        return true;
    } catch (error) {
        console.error('❌ Backend is not responding:', error);
        
        // Show error banner
        const errorBanner = document.createElement('div');
        errorBanner.style.cssText = 'position: fixed; top: 60px; left: 0; right: 0; background: #fff3cd; color: #856404; padding: 15px; text-align: center; z-index: 1000; border-bottom: 2px solid #ffc107;';
        errorBanner.innerHTML = `
            <strong>⚠️ Backend Server Not Running</strong><br>
            <small>Please start the server: <code>cd backend && python server.py</code></small>
        `;
        document.body.prepend(errorBanner);
        
        return false;
    }
}

async function initializeData() {
    const isBackendHealthy = await checkBackendHealth();
    
    if (isBackendHealthy) {
        // Load all initial data
        await Promise.all([
            loadPortfolioData(),
            loadMarketIndices(),
            loadTrendingStocks(),
            loadWatchlist(),
            loadMutualFunds()
        ]);
        
        // Load overview charts
        await loadPortfolioOverviewChart();
        setupPeriodSelector(); // Wire up period buttons
        await loadHoldingsWithCharts();
        await loadMarketIndicesWithCharts();
        await loadTrendingStocksOverview();
        
        // Start auto-refresh
        startAutoRefresh();
        
        console.log('✅ All data loaded successfully!');
    } else {
        // Show demo mode message
        showDemoDataWarning();
    }
}

function loadSectionData(page) {
    switch(page) {
        case 'overview':
            loadPortfolioData();
            loadMarketIndices();
            break;
        case 'portfolio':
            loadPortfolioData();
            break;
        case 'stocks':
            loadTrendingStocks();
            break;
        case 'watchlist':
            loadWatchlist();
            break;
        case 'mutualfunds':
            loadMutualFunds();
            break;
    }
}

// ===========================================
// PORTFOLIO DATA
// ===========================================

async function loadPortfolioData() {
    try {
        const portfolioData = await stockAPI.calculatePortfolio(portfolioHoldings);
        
        // Update overview cards
        updateElement('portfolio-value', formatCurrency(portfolioData.current_value));
        updateElement('total-invested', formatCurrency(portfolioData.total_invested));
        updateElement('total-pnl', formatChange(portfolioData.total_pnl), getChangeClass(portfolioData.total_pnl));
        updateElement('total-pnl-percent', formatPercentChange(portfolioData.total_pnl_percent));
        
        // Update holdings grid
        updateHoldingsGrid(portfolioData.holdings);
        
        // Update portfolio table
        updatePortfolioTable(portfolioData.holdings);
        
        console.log('✅ Portfolio data loaded');
    } catch (error) {
        console.error('❌ Error loading portfolio:', error);
    }
}

function updateHoldingsGrid(holdings) {
    const grid = document.querySelector('.holdings-grid');
    if (!grid) return;
    
    grid.innerHTML = holdings.slice(0, 4).map(stock => `
        <div class="stock-card clickable" onclick="showStockDetailModal('${stock.symbol}')">
            <div class="stock-header">
                <div>
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-quantity">${stock.quantity} shares</div>
                </div>
                <button class="icon-btn" onclick="event.stopPropagation()">⋯</button>
            </div>
            <div class="stock-price">${formatCurrency(stock.current_price)}</div>
            <div class="stock-change ${getChangeClass(stock.pnl)}">${formatPercentChange(stock.pnl_percent)}</div>
            <div class="stock-value">Current: ${formatCurrency(stock.current_value)}</div>
        </div>
    `).join('');
}

// ===========================================
// OVERVIEW CHARTS
// ===========================================

async function loadPortfolioOverviewChart(period = '1mo') {
    try {
        const canvas = document.getElementById('portfolio-overview-chart');
        if (!canvas) return;

        // Get portfolio history data (simulated for now, can be enhanced)
        const symbols = portfolioHoldings.map(h => h.symbol);
        
        // Fetch data for first stock as base
        const chartData = await stockAPI.getStockChartData(symbols[0], period);
        
        if (portfolioChartInstance) {
            portfolioChartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(0, 208, 156, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 208, 156, 0.01)');

        portfolioChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Portfolio Value',
                    data: chartData.datasets.price.map(p => p * 1.05), // Simulated portfolio growth
                    borderColor: '#00d09c',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#00d09c',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return 'Value: ₹' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '₹' + (value / 1000).toFixed(0) + 'K';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 8
                        }
                    }
                }
            }
        });

        console.log('✅ Portfolio overview chart loaded');
    } catch (error) {
        console.error('❌ Error loading portfolio chart:', error);
    }
}

// Setup period selector for portfolio chart
function setupPeriodSelector() {
    const periodBtns = document.querySelectorAll('.period-btn');
    const periodMap = {
        '1D': '1d',
        '1W': '5d',
        '1M': '1mo',
        '3M': '3mo',
        '1Y': '1y'
    };
    
    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            periodBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');
            
            // Get period value and reload chart
            const periodLabel = btn.textContent.trim();
            const periodValue = periodMap[periodLabel] || '1mo';
            loadPortfolioOverviewChart(periodValue);
        });
    });
}

async function loadHoldingsWithCharts() {
    try {
        const grid = document.getElementById('holdings-grid-overview');
        if (!grid) return;

        const portfolioData = await stockAPI.calculatePortfolio(portfolioHoldings);
        
        const holdingsHTML = await Promise.all(
            portfolioData.holdings.slice(0, 4).map(async (stock) => {
                // Get mini chart data
                const chartData = await stockAPI.getStockChartData(stock.symbol, '5d').catch(() => null);
                
                const miniChartId = `mini-chart-${stock.symbol}`;
                
                return `
                    <div class="holding-card-enhanced" onclick="showStockDetailModal('${stock.symbol}')">
                        <div class="holding-header">
                            <div>
                                <div class="holding-symbol">${stock.symbol}</div>
                                <div class="holding-name-small">${stock.quantity} shares @ ₹${stock.avg_price.toFixed(2)}</div>
                            </div>
                            <button class="icon-btn-sm" onclick="event.stopPropagation()">⋯</button>
                        </div>
                        <div class="holding-chart-mini">
                            <canvas id="${miniChartId}" height="60"></canvas>
                        </div>
                        <div class="holding-stats">
                            <div class="holding-value">
                                <span class="label">Current</span>
                                <span class="value">${formatCurrency(stock.current_value)}</span>
                            </div>
                            <div class="holding-pnl ${getChangeClass(stock.pnl)}">
                                <span class="label">P&L</span>
                                <span class="value">${formatPercentChange(stock.pnl_percent)}</span>
                            </div>
                        </div>
                    </div>
                `;
            })
        );

        grid.innerHTML = holdingsHTML.join('');

        // Render mini charts
        for (const stock of portfolioData.holdings.slice(0, 4)) {
            await renderMiniChart(stock.symbol, `mini-chart-${stock.symbol}`, '5d');
        }

        console.log('✅ Holdings with charts loaded');
    } catch (error) {
        console.error('❌ Error loading holdings charts:', error);
    }
}

async function renderMiniChart(symbol, canvasId, period = '5d') {
    try {
        const chartData = await stockAPI.getStockChartData(symbol, period);
        const canvas = document.getElementById(canvasId);
        
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const isPositive = chartData.datasets.price[chartData.datasets.price.length - 1] >= chartData.datasets.price[0];
        
        const color = isPositive ? '#00d09c' : '#eb5b3c';
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.datasets.price,
                    borderColor: color,
                    backgroundColor: isPositive ? 'rgba(0, 208, 156, 0.1)' : 'rgba(235, 91, 60, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    y: { display: false },
                    x: { display: false }
                }
            }
        });
    } catch (error) {
        console.error(`Error rendering mini chart for ${symbol}:`, error);
    }
}

async function loadMarketIndicesWithCharts() {
    try {
        const data = await stockAPI.getMarketIndices();
        const grid = document.getElementById('indices-grid-overview');
        
        if (!grid || !data.indices) return;
        
        grid.innerHTML = data.indices.map(index => `
            <div class="index-card-enhanced">
                <div class="index-header">
                    <div class="index-name">${index.name}</div>
                    <div class="index-value">${formatCurrency(index.value, false)}</div>
                </div>
                <div class="index-change ${getChangeClass(index.change)}">
                    ${formatChange(index.change)} (${formatPercentChange(index.change_percent)})
                </div>
                <div class="index-sparkline">
                    <canvas id="index-chart-${index.name}" height="40"></canvas>
                </div>
            </div>
        `).join('');

        // Render sparklines (simplified for demo)
        data.indices.forEach(index => {
            renderIndexSparkline(index.name, index.change_percent);
        });

        console.log('✅ Market indices with charts loaded');
    } catch (error) {
        console.error('❌ Error loading indices charts:', error);
    }
}

function renderIndexSparkline(indexName, changePercent) {
    const canvas = document.getElementById(`index-chart-${indexName}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isPositive = changePercent >= 0;
    const color = isPositive ? '#00d09c' : '#eb5b3c';

    // Generate sample sparkline data
    const dataPoints = Array.from({ length: 20 }, () => Math.random() * 100);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                data: dataPoints,
                borderColor: color,
                backgroundColor: isPositive ? 'rgba(0, 208, 156, 0.1)' : 'rgba(235, 91, 60, 0.1)',
                borderWidth: 1.5,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                y: { display: false },
                x: { display: false }
            }
        }
    });
}

async function loadTrendingStocksOverview() {
    try {
        const data = await stockAPI.getTrendingStocks();
        const grid = document.getElementById('trending-stocks-overview');
        
        if (!grid || !data.stocks) return;
        
        grid.innerHTML = data.stocks.slice(0, 6).map(stock => `
            <div class="trending-stock-card" onclick="showStockDetailModal('${stock.symbol}')">
                <div class="trending-header">
                    <div>
                        <div class="trending-symbol">${stock.symbol}</div>
                        <div class="trending-name">${stock.name.substring(0, 20)}...</div>
                    </div>
                    <button class="watchlist-btn-sm" onclick="event.stopPropagation(); toggleWatchlist('${stock.symbol}')">
                        ⭐
                    </button>
                </div>
                <div class="trending-price">${formatCurrency(stock.price)}</div>
                <div class="trending-change ${getChangeClass(stock.change)}">${formatPercentChange(stock.change_percent)}</div>
                <div class="trending-mini-chart">
                    <canvas id="trending-${stock.symbol}" height="50"></canvas>
                </div>
            </div>
        `).join('');

        // Render mini charts for trending stocks
        for (const stock of data.stocks.slice(0, 6)) {
            await renderMiniChart(stock.symbol, `trending-${stock.symbol}`, '5d');
        }

        console.log('✅ Trending stocks overview loaded');
    } catch (error) {
        console.error('❌ Error loading trending stocks:', error);
    }
}

function updatePortfolioTable(holdings) {
    const tbody = document.querySelector('.portfolio-section .portfolio-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = holdings.map(stock => `
        <tr>
            <td>
                <div class="stock-name">
                    <strong>${stock.symbol}</strong>
                </div>
            </td>
            <td>${stock.quantity}</td>
            <td>${formatCurrency(stock.avg_price)}</td>
            <td>${formatCurrency(stock.current_price)}</td>
            <td>${formatCurrency(stock.current_value)}</td>
            <td class="${getChangeClass(stock.pnl)}">
                ${formatChange(stock.pnl)}<br>
                <small>(${formatPercentChange(stock.pnl_percent)})</small>
            </td>
        </tr>
    `).join('');
}

// ===========================================
// MARKET INDICES
// ===========================================

async function loadMarketIndices() {
    try {
        const data = await stockAPI.getMarketIndices();
        const grid = document.querySelector('.indices-grid');
        
        if (!grid || !data.indices) return;
        
        grid.innerHTML = data.indices.map(index => `
            <div class="index-card">
                <div class="index-name">${index.name}</div>
                <div class="index-value">${formatCurrency(index.value, false)}</div>
                <div class="index-change ${getChangeClass(index.change)}">
                    ${formatChange(index.change)} (${formatPercentChange(index.change_percent)})
                </div>
            </div>
        `).join('');
        
        console.log('✅ Market indices loaded');
    } catch (error) {
        console.error('❌ Error loading indices:', error);
    }
}

// ===========================================
// STOCKS DATA
// ===========================================

async function loadTrendingStocks() {
    try {
        const data = await stockAPI.getTrendingStocks();
        const grid = document.querySelector('.stocks-section .stocks-grid');
        
        if (!grid || !data.stocks) return;
        
        grid.innerHTML = data.stocks.map(stock => `
            <div class="stock-card" onclick="showStockDetailModal('${stock.symbol}')">
                <div class="stock-header">
                    <div>
                        <div class="stock-symbol">${stock.symbol}</div>
                        <div class="stock-name-small">${stock.name.substring(0, 25)}...</div>
                    </div>
                    <button class="watchlist-btn" onclick="event.stopPropagation(); toggleWatchlist('${stock.symbol}')">⭐</button>
                </div>
                <div class="stock-price">${formatCurrency(stock.price)}</div>
                <div class="stock-change ${getChangeClass(stock.change)}">${formatPercentChange(stock.change_percent)}</div>
                <button class="cta-btn btn-small" onclick="event.stopPropagation(); buyStock('${stock.symbol}', ${stock.price})">Buy</button>
            </div>
        `).join('');
        
        console.log('✅ Trending stocks loaded');
    } catch (error) {
        console.error('❌ Error loading stocks:', error);
    }
}

// ===========================================
// WATCHLIST DATA
// ===========================================

async function loadWatchlist() {
    try {
        const stocks = await stockAPI.getBatchStocks(watchlistStocks);
        const tbody = document.querySelector('.watchlist-section .watchlist-table tbody');
        
        if (!tbody) return;
        
        tbody.innerHTML = stocks.map(stock => `
            <tr>
                <td>
                    <div class="stock-name">
                        <strong>${stock.symbol}</strong><br>
                        <small>${stock.name.substring(0, 30)}...</small>
                    </div>
                </td>
                <td>${formatCurrency(stock.current_price)}</td>
                <td class="${getChangeClass(stock.change)}">
                    ${formatChange(stock.change)}
                </td>
                <td class="${getChangeClass(stock.change_percent)}">
                    ${formatPercentChange(stock.change_percent)}
                </td>
                <td>
                    <button class="cta-btn btn-small" onclick="buyStock('${stock.symbol}', ${stock.current_price})">Buy</button>
                    <button class="btn-secondary btn-small" onclick="removeFromWatchlist('${stock.symbol}')">Remove</button>
                </td>
            </tr>
        `).join('');
        
        console.log('✅ Watchlist loaded');
    } catch (error) {
        console.error('❌ Error loading watchlist:', error);
    }
}

// ===========================================
// MUTUAL FUNDS DATA
// ===========================================

async function loadMutualFunds() {
    try {
        const data = await stockAPI.getMutualFunds();
        const grid = document.querySelector('.mutual-funds-section .funds-grid');
        
        if (!grid || !data.funds) return;
        
        grid.innerHTML = data.funds.map(fund => `
            <div class="fund-card">
                <div class="fund-header">
                    <div>
                        <div class="fund-name">${fund.name}</div>
                        <div class="fund-type">${fund.type}</div>
                    </div>
                    <div class="fund-rating">⭐⭐⭐⭐</div>
                </div>
                <div class="fund-nav">NAV: ${formatCurrency(fund.current_nav)}</div>
                <div class="fund-returns">
                    <div class="return-item">
                        <span>1Y Return</span>
                        <span class="${getChangeClass(fund.one_year_return)}">${formatPercentChange(fund.one_year_return)}</span>
                    </div>
                    <div class="return-item">
                        <span>3Y Return</span>
                        <span class="${getChangeClass(fund.three_year_return)}">${formatPercentChange(fund.three_year_return)}</span>
                    </div>
                </div>
                <button class="cta-btn" onclick="investInFund('${fund.name}', ${fund.current_nav})">Invest Now</button>
            </div>
        `).join('');
        
        console.log('✅ Mutual funds loaded');
    } catch (error) {
        console.error('❌ Error loading mutual funds:', error);
    }
}

// ===========================================
// AUTO-REFRESH
// ===========================================

function startAutoRefresh() {
    // Refresh portfolio every 30 seconds
    setInterval(() => {
        const overviewSection = document.getElementById('overview-section');
        if (overviewSection && overviewSection.classList.contains('active')) {
            loadPortfolioData();
            loadMarketIndices();
        }
    }, 30000);
    
    // Refresh watchlist every 30 seconds
    setInterval(() => {
        const watchlistSection = document.getElementById('watchlist-section');
        if (watchlistSection && watchlistSection.classList.contains('active')) {
            loadWatchlist();
        }
    }, 30000);
    
    console.log('✅ Auto-refresh started');
}

// ===========================================
// USER ACTIONS
// ===========================================

function buyStock(symbol, price) {
    alert(`🎉 Buy order placed for ${symbol} at ${formatCurrency(price)}\n\nThis is a demo. In production, this would open the order placement screen.`);
}

function investInFund(fundName, nav) {
    alert(`💰 Investment initiated in ${fundName}\nNAV: ${formatCurrency(nav)}\n\nThis is a demo. In production, this would open the investment screen.`);
}

function toggleWatchlist(symbol) {
    const index = watchlistStocks.indexOf(symbol);
    if (index > -1) {
        watchlistStocks.splice(index, 1);
        alert(`❌ ${symbol} removed from watchlist`);
    } else {
        watchlistStocks.push(symbol);
        alert(`✅ ${symbol} added to watchlist`);
    }
    loadWatchlist();
}

function removeFromWatchlist(symbol) {
    const index = watchlistStocks.indexOf(symbol);
    if (index > -1) {
        watchlistStocks.splice(index, 1);
        loadWatchlist();
    }
}

// ===========================================
// FILTERS & TABS
// ===========================================

// Stock filters
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn')) {
        // Remove active from all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        const filter = e.target.dataset.filter;
        console.log('Filter selected:', filter);
        // In production, this would filter the stocks based on the selected category
    }
    
    if (e.target.classList.contains('tab-btn')) {
        // Remove active from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        const tab = e.target.dataset.tab;
        console.log('Tab selected:', tab);
        // In production, this would switch between different fund categories
    }
});

// ===========================================
// UTILITIES
// ===========================================

function updateElement(id, value, className = '') {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        if (className) {
            element.className = `value ${className}`;
        }
    }
}

function showDemoDataWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; max-width: 300px;';
    warning.innerHTML = `
        <strong>📊 Demo Mode</strong><br>
        <small>Backend not connected. Start server for live data.</small>
    `;
    document.body.appendChild(warning);
}

// Animation observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Observe cards for animation
setTimeout(() => {
    document.querySelectorAll('.stock-card, .fund-card, .index-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}, 100);
