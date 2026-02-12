// Stock Chart Component using Chart.js
class StockChart {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.chart = null;
        this.currentSymbol = null;
    }

    async loadChart(symbol, period = '1mo') {
        try {
            showLoading(document.getElementById(this.canvasId)?.parentElement);
            
            const data = await stockAPI.getStockChartData(symbol, period);
            this.currentSymbol = symbol;
            
            this.renderChart(data);
            
        } catch (error) {
            console.error('Error loading chart:', error);
            showError(document.getElementById(this.canvasId)?.parentElement, 'Failed to load chart data');
        }
    }

    renderChart(data) {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) return;

        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = canvas.getContext('2d');
        
        // Create gradient for price line
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 208, 156, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 208, 156, 0.01)');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: `${data.symbol} Price`,
                        data: data.datasets.price,
                        borderColor: '#00d09c',
                        backgroundColor: gradient,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#00d09c',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    },
                    {
                        label: 'MA 20',
                        data: data.datasets.ma20,
                        borderColor: '#ff9800',
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 0,
                        hidden: data.datasets.ma20.filter(x => x > 0).length < 20
                    },
                    {
                        label: 'MA 50',
                        data: data.datasets.ma50,
                        borderColor: '#2196f3',
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 0,
                        hidden: data.datasets.ma50.filter(x => x > 0).length < 50
                    }
                ]
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
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '₹' + context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: `${data.symbol} - ${data.period.toUpperCase()}`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toFixed(0);
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
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            }
        });
    }

    changePeriod(period) {
        if (this.currentSymbol) {
            this.loadChart(this.currentSymbol, period);
        }
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// Stock Search Component
class StockSearch {
    constructor(inputId, resultsId) {
        this.inputId = inputId;
        this.resultsId = resultsId;
        this.input = document.getElementById(inputId);
        this.resultsContainer = document.getElementById(resultsId);
        this.debounceTimer = null;
        
        this.init();
    }

    init() {
        if (!this.input || !this.resultsContainer) return;

        this.input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(this.debounceTimer);
            
            if (query.length < 2) {
                this.hideResults();
                return;
            }

            this.debounceTimer = setTimeout(() => {
                this.search(query);
            }, 300);
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.resultsContainer.contains(e.target)) {
                this.hideResults();
            }
        });
    }

    async search(query) {
        try {
            this.showLoading();
            
            const data = await stockAPI.searchStocks(query);
            
            if (data.results && data.results.length > 0) {
                this.displayResults(data.results);
            } else {
                this.showNoResults();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError();
        }
    }

    displayResults(results) {
        this.resultsContainer.innerHTML = results.map(stock => `
            <div class="search-result-item" data-symbol="${stock.symbol}">
                <div class="result-main">
                    <div class="result-symbol">${stock.symbol}</div>
                    <div class="result-name">${stock.name}</div>
                </div>
                <div class="result-details">
                    <div class="result-sector">${stock.sector || 'N/A'}</div>
                    ${stock.price ? `
                        <div class="result-price ${stock.change_percent >= 0 ? 'positive' : 'negative'}">
                            ₹${stock.price} 
                            <span>(${stock.change_percent >= 0 ? '+' : ''}${stock.change_percent.toFixed(2)}%)</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const symbol = item.dataset.symbol;
                this.onSelectStock(symbol);
            });
        });

        this.showResults();
    }

    showResults() {
        this.resultsContainer.classList.add('visible');
    }

    hideResults() {
        this.resultsContainer.classList.remove('visible');
    }

    showLoading() {
        this.resultsContainer.innerHTML = '<div class="search-loading">Searching...</div>';
        this.showResults();
    }

    showNoResults() {
        this.resultsContainer.innerHTML = '<div class="search-no-results">No stocks found</div>';
        this.showResults();
    }

    showError() {
        this.resultsContainer.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
        this.showResults();
    }

    onSelectStock(symbol) {
        // Override this method to handle stock selection
        console.log('Stock selected:', symbol);
        this.hideResults();
        this.input.value = symbol;
        
        // Show stock detail modal
        showStockDetailModal(symbol);
    }
}

// Stock Detail Modal
async function showStockDetailModal(symbol) {
    const modal = document.getElementById('stock-detail-modal');
    if (!modal) {
        createStockDetailModal();
        return showStockDetailModal(symbol);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Load stock data
    try {
        const stockData = await stockAPI.getStock(symbol);
        
        document.getElementById('modal-stock-symbol').textContent = symbol;
        document.getElementById('modal-stock-name').textContent = stockData.name;
        document.getElementById('modal-stock-price').textContent = formatCurrency(stockData.current_price);
        document.getElementById('modal-stock-change').textContent = formatChange(stockData.change);
        document.getElementById('modal-stock-change-percent').textContent = formatPercentChange(stockData.change_percent);
        document.getElementById('modal-stock-change').className = `modal-change ${getChangeClass(stockData.change)}`;

        // Load chart
        const chart = new StockChart('modal-stock-chart');
        chart.loadChart(symbol, '1mo');

        // Store chart instance
        modal.chartInstance = chart;

        // Setup period buttons
        document.querySelectorAll('.chart-period-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                chart.changePeriod(this.dataset.period);
            });
        });

    } catch (error) {
        console.error('Error loading stock detail:', error);
    }
}

function closeStockDetailModal() {
    const modal = document.getElementById('stock-detail-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        if (modal.chartInstance) {
            modal.chartInstance.destroy();
        }
    }
}

function createStockDetailModal() {
    const modalHTML = `
        <div id="stock-detail-modal" class="stock-modal">
            <div class="modal-overlay" onclick="closeStockDetailModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h2 id="modal-stock-symbol"></h2>
                        <p id="modal-stock-name"></p>
                    </div>
                    <button class="modal-close" onclick="closeStockDetailModal()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="modal-price-info">
                        <div class="modal-price" id="modal-stock-price">₹0.00</div>
                        <div class="modal-change-info">
                            <span id="modal-stock-change">₹0.00</span>
                            <span id="modal-stock-change-percent">(0.00%)</span>
                        </div>
                    </div>
                    <div class="chart-controls">
                        <button class="chart-period-btn" data-period="1d">1D</button>
                        <button class="chart-period-btn" data-period="5d">5D</button>
                        <button class="chart-period-btn active" data-period="1mo">1M</button>
                        <button class="chart-period-btn" data-period="3mo">3M</button>
                        <button class="chart-period-btn" data-period="6mo">6M</button>
                        <button class="chart-period-btn" data-period="1y">1Y</button>
                        <button class="chart-period-btn" data-period="5y">5Y</button>
                    </div>
                    <div class="modal-chart-container">
                        <canvas id="modal-stock-chart"></canvas>
                    </div>
                    <div class="modal-actions">
                        <button class="cta-btn" onclick="buyStock('${symbol}')">Buy</button>
                        <button class="btn-secondary" onclick="toggleWatchlist('${symbol}')">Add to Watchlist</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.StockChart = StockChart;
    window.StockSearch = StockSearch;
    window.showStockDetailModal = showStockDetailModal;
    window.closeStockDetailModal = closeStockDetailModal;
}
