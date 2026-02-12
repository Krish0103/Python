# Groww Clone - Investment Platform with Real-Time Data 📈

A full-featured clone of Groww.in with **live stock market data** powered by yfinance web scraping.

## 🌟 Features

### Frontend
- **Landing Page**: Hero section, product showcase, pricing cards
- **Authentication**: Secure login system with demo credentials
- **Dashboard**: 7 comprehensive sections
  - Overview: Portfolio summary, holdings, market indices
  - Portfolio: Detailed holdings with real-time P&L tracking
  - Stocks: Explore trending stocks with live prices
  - Mutual Funds: ETF data with returns
  - Watchlist: Track favorite stocks with live price updates
  - Orders: Order history and tracking
  - Profile: User settings and preferences

### Backend (yfinance Integration) 🚀
- **Real-time Stock Data**: Live prices from Yahoo Finance
- **Portfolio Calculations**: Automatic P&L with current market prices
- **Market Indices**: NIFTY 50, SENSEX, NIFTY BANK, NIFTY IT
- **Auto-refresh**: Updates every 30-60 seconds during market hours
- **15+ Indian Stocks**: RELIANCE, TCS, HDFC, INFY, ICICI, and more
- **RESTful API**: Clean endpoints for all data operations

## 📦 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser

### Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Packages installed:**
- `flask` - Web server framework
- `flask-cors` - Cross-origin resource sharing
- `yfinance` - Yahoo Finance data scraper
- `pandas` - Data processing
- `numpy` - Numerical operations

### Step 2: Start the Backend Server

```bash
python server.py
```

**Expected output:**
```
🚀 Starting Groww Stock Market API Server...
📊 Server running on http://localhost:5000
💹 Real-time stock data powered by yfinance
```

### Step 3: Open the Website

1. Open `index.html` in your web browser
2. Click "Get Started" or "Login"
3. Use demo credentials:
   - **Email**: `demo@groww.in`
   - **Password**: `demo123`
4. Explore the dashboard with **live stock prices**!

## 🏗️ Project Structure

```
website/
├── index.html              # Landing page
├── login.html              # Authentication page
├── dashboard.html          # Main dashboard
├── styles.css              # Complete styling (1000+ lines)
├── script.js               # Login functionality
├── dashboard.js            # Dashboard logic (API integrated)
├── js/
│   └── api.js             # API service & utilities
├── backend/
│   ├── server.py          # Flask backend server (yfinance)
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # Backend API documentation
└── README.md              # This file
```

## 🔍 How It Works

### Web Scraping with yfinance

The backend uses **yfinance** library to scrape real-time stock data from Yahoo Finance:

```python
import yfinance as yf

# Fetch stock data
stock = yf.Ticker('RELIANCE.NS')
info = stock.info
history = stock.history(period='1d')

# Get current price
current_price = history['Close'].iloc[-1]
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stock/{symbol}` | Get detailed stock data |
| GET | `/api/stocks/trending` | Get trending stocks (top 10) |
| GET | `/api/indices` | Get market indices |
| GET | `/api/stock/history/{symbol}?period=1mo` | Get historical data |
| POST | `/api/portfolio/calculate` | Calculate portfolio P&L |
| GET | `/api/mutual-funds` | Get mutual funds (ETFs) |
| GET | `/api/search?q={query}` | Search stocks |
| GET | `/api/health` | Health check |

### Real-time Updates

- **Portfolio**: Auto-refreshes every 30 seconds
- **Market Indices**: Updates every 60 seconds
- **Watchlist**: Refreshes every 30 seconds when active
- **Market Hours**: 9:15 AM - 3:30 PM IST (Mon-Fri)
- **Status Indicator**: Shows if market is open/closed

## 📊 Supported Stocks

The backend supports **15+ major Indian stocks** on NSE:

| Sector | Stocks |
|--------|--------|
| **Technology** | TCS, INFY (Infosys), WIPRO |
| **Banking** | HDFCBANK, ICICIBANK, SBIN |
| **Conglomerate** | RELIANCE, ITC, LT |
| **Auto** | MARUTI |
| **FMCG** | HINDUNILVR, ASIANPAINT |
| **Finance** | BAJFINANCE |
| **Telecom** | BHARTIARTL |
| **Ports** | ADANIPORTS |

All stocks use NSE (National Stock Exchange) with `.NS` suffix.

## 🌐 Market Data

### Indices Tracked
- **NIFTY 50** (^NSEI) - Top 50 Indian companies
- **SENSEX** (^BSESN) - Bombay Stock Exchange
- **NIFTY BANK** (^NSEBANK) - Banking sector
- **NIFTY IT** (^CNXIT) - IT sector

### Data Details
- Source: Yahoo Finance API via yfinance
- Currency: Indian Rupees (₹)
- Update Frequency: Real-time during market hours
- Historical Data: Available (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y)
- Includes: Price, volume, market cap, P/E ratio, 52-week high/low

## 💻 Technical Architecture

### Backend (Flask + yfinance)
```
┌─────────────────┐
│   Frontend      │
│ (HTML/CSS/JS)   │
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│  Flask Server   │
│  (server.py)    │
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────┐
│    yfinance     │
│   (scraper)     │
└────────┬────────┘
         │ Web Scraping
         ▼
┌─────────────────┐
│ Yahoo Finance   │
│   (Data Source) │
└─────────────────┘
```

### Frontend Architecture
- **API Service** (`js/api.js`): Centralized API calls with error handling
- **Dashboard** (`dashboard.js`): UI updates and user interactions
- **Authentication**: Session storage-based login
- **Responsive**: Mobile-first CSS with flexbox/grid

### Performance Optimization
- ✅ Batch API calls for multiple stocks
- ✅ 1-minute cache for frequently accessed data
- ✅ Lazy loading of dashboard sections
- ✅ Optimistic UI updates
- ✅ Debounced search queries

## 📱 Responsive Design

```css
/* Breakpoints */
Mobile:  < 768px   (Stack layout)
Tablet:  768-1024px (2-column grid)
Desktop: > 1024px  (Full grid layout)
```

## 🚀 Future Enhancements

1. **Charts**: Interactive price charts using Chart.js
2. **Real Auth**: JWT-based authentication with database
3. **Advanced Orders**: Limit orders, stop-loss, GTT
4. **News Feed**: Stock-specific news from RSS feeds
5. **Alerts**: Price alerts via email/SMS
6. **Tax Calculator**: Capital gains calculations
7. **Options Trading**: F&O data integration
8. **Technical Indicators**: SMA, EMA, RSI, MACD

## 🐛 Troubleshooting

### Backend Not Starting

**Problem:** Port 5000 already in use

```bash
# Windows: Check port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <process_id> /F

# Or use different port in server.py
app.run(debug=True, host='0.0.0.0', port=5001)
# Then update API_BASE_URL in js/api.js
```

### "Backend server not running" Error

**Solutions:**
1. Ensure backend is running: `python backend/server.py`
2. Check terminal for error messages
3. Test health endpoint: http://localhost:5000/api/health
4. Verify CORS is enabled in server.py
5. Check browser console for network errors

### Stock Data Not Loading

**Possible Causes:**
- ❌ No internet connection (yfinance needs internet)
- ❌ Invalid stock symbol (use NSE format: SYMBOL.NS)
- ❌ Outside market hours (data may be stale)
- ❌ Yahoo Finance rate limiting (wait a few minutes)
- ❌ Symbol not supported (add to INDIAN_STOCKS dict)

### yfinance Installation Issues

```bash
# Upgrade pip
pip install --upgrade pip

# Specific version
pip install yfinance==0.2.36

# SSL certificate errors
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org yfinance

# Alternative: Use conda
conda install -c conda-forge yfinance
```

### CORS Errors

If you see CORS errors in browser console:

```python
# In server.py, ensure this line exists:
from flask_cors import CORS
CORS(app)  # Enable CORS for all routes
```

## 💡 Usage Tips

1. **First Time**: Always start backend before opening website
2. **Market Hours**: Best experience during IST 9:15 AM - 3:30 PM (Mon-Fri)
3. **Refresh**: Click nav items to refresh section data
4. **Watchlist**: Add stocks via ⭐ button in Stocks section
5. **Portfolio**: Edit holdings in `dashboard.js` (portfolioHoldings array)

## 📄 License

MIT License - Free for educational use

## ⚠️ Disclaimer

- **Educational Project**: For learning purposes only
- **Not Financial Advice**: Don't use for real trading decisions
- **Data Accuracy**: Yahoo Finance data may be delayed up to 15 minutes
- **No Liability**: Authors not responsible for any losses
- **Not Affiliated**: Not associated with Groww.in or any financial institution

## 🤝 Contributing

Contributions welcome! Areas to improve:
- Add more Indian stocks
- Implement charting library
- Add unit tests
- Improve error handling
- Add more market indices
- Optimize API caching

## 📞 Support

If you encounter issues:
1. Check this README's troubleshooting section
2. Review backend logs in terminal
3. Check browser console for errors
4. Ensure all dependencies are installed
5. Verify Python version (3.8+)

## 🎓 Learning Resources

- [yfinance Documentation](https://pypi.org/project/yfinance/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Yahoo Finance](https://finance.yahoo.com/)
- [NSE India](https://www.nseindia.com/)

---

**Built with ❤️ for learning web scraping and financial APIs**

**Tech Stack**: HTML5 • CSS3 • JavaScript • Python • Flask • yfinance • pandas
