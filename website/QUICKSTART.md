# Quick Start Guide 🚀

Get your Groww clone running in 3 minutes!

## Step-by-Step Instructions

### 1️⃣ Install Python Dependencies

Open terminal in the project folder and run:

```bash
cd backend
pip install -r requirements.txt
```

**Wait for installation to complete** (takes 1-2 minutes)

### 2️⃣ Start the Backend Server

```bash
python server.py
```

**Look for this confirmation:**
```
🚀 Starting Groww Stock Market API Server...
📊 Server running on http://localhost:5000
💹 Real-time stock data powered by yfinance
```

### 3️⃣ Open the Website

**Options:**
- Double-click `index.html` in File Explorer
- Right-click `index.html` → Open with → Chrome/Firefox
- Drag `index.html` into browser window

### 4️⃣ Login with Demo Credentials

**On the login page, enter:**
- Email: `demo@groww.in`
- Password: `demo123`

### 5️⃣ Explore! 🎉

You should now see:
- ✅ Live stock prices updating automatically
- ✅ Market indices (NIFTY 50, SENSEX)
- ✅ Your portfolio with real-time P&L
- ✅ Market status indicator (Open/Closed)

---

## Troubleshooting

### ❌ Backend won't start

**Error: `No module named 'flask'`**
```bash
# Install dependencies again
pip install flask flask-cors yfinance pandas
```

**Error: `Port 5000 already in use`**
```bash
# Windows: Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### ❌ Frontend shows "Backend not running"

1. Check if backend terminal is still running
2. Look for errors in backend terminal
3. Try restarting the backend server
4. Test: Open http://localhost:5000/api/health in browser

### ❌ Stock prices not showing

1. Check your internet connection
2. Wait 10-15 seconds for data to load
3. Check browser console (F12) for errors
4. Verify backend terminal shows no errors

---

## Important Notes

📌 **Always keep the backend terminal open** while using the website

📌 **Market hours**: 9:15 AM - 3:30 PM IST (Mon-Fri)  
   Outside these hours, data may be stale

📌 **First load**: Takes 10-15 seconds to fetch all stock data

📌 **Auto-refresh**: Portfolio updates every 30 seconds automatically

---

## What You'll See

### Landing Page
- Hero section with call-to-action
- 6 product cards (Stocks, Mutual Funds, IPO, etc.)
- Pricing information
- Features showcase

### Dashboard (After Login)
1. **Overview**: Portfolio summary + Top holdings
2. **Portfolio**: Detailed holdings table with P&L
3. **Stocks**: Trending stocks with live prices
4. **Mutual Funds**: ETF schemes with returns
5. **Watchlist**: Track your favorite stocks
6. **Orders**: Order history
7. **Profile**: User settings

---

## Need Help?

1. Read [README.md](README.md) for detailed documentation
2. Check [backend/README.md](backend/README.md) for API docs
3. Look at browser console (F12) for error messages
4. Check backend terminal for server logs

---

**Enjoy exploring real-time stock data! 📈💰**
