# 🧪 Testing Guide for New Features

## ✅ Pre-flight Check

1. **Backend Status**: ✅ Server running on http://localhost:5000
2. **Dependencies**: ✅ Flask, yfinance, pandas, Chart.js CDN
3. **New Files**:
   - ✅ `js/chart.js` (Chart & Search functionality)
   - ✅ `FEATURES.md` (Complete feature documentation)
   - ✅ `TEST.md` (This file)

---

## 🎯 Test Plan

### Test 1: Search Functionality

**Steps:**
1. Open [index.html](index.html) in browser
2. Login with `demo@groww.in` / `demo123`
3. Look at the dashboard header - you'll see a search box
4. Click the search box

**Test Cases:**
```
✓ Type "REL" → Should show RELIANCE
✓ Type "HDFC" → Should show HDFCBANK
✓ Type "TCS" → Should show TCS
✓ Type "BANK" → Should show multiple banks (HDFCBANK, ICICIBANK, etc.)
✓ Type "ZO" → Should show ZOMATO
✓ Type invalid symbol → Should show "No stocks found"
```

**Expected Results:**
- Search results appear in dropdown below search box
- Each result shows:
  - Symbol (e.g., RELIANCE)
  - Full name (e.g., Reliance Industries Limited)
  - Sector (e.g., Energy)
  - Current price in green/red with change %
- Results update as you type (300ms debounce)
- Hover effect on results

---

### Test 2: Stock Detail Modal

**Steps:**
1. In the search box, type "RELIANCE"
2. Click on the search result
3. Modal should open with chart

**Test Cases:**
```
✓ Modal slides up with smooth animation
✓ Shows stock symbol: RELIANCE
✓ Shows company name: Reliance Industries Limited
✓ Shows current price: ₹XXXX.XX
✓ Shows change amount and percentage (green/red)
✓ Chart loads within 2-3 seconds
✓ Chart shows price line (green gradient)
✓ Chart shows MA20 (orange dashed) - if available
✓ Chart shows MA50 (blue dashed) - if available
✓ Period buttons: 1D, 5D, 1M, 3M, 6M, 1Y, 5Y are visible
✓ 1M button is active by default
```

**Expected Results:**
- Beautiful modal with chart
- Green price line with gradient fill
- Hovering over chart shows tooltips with exact values
- X axis shows dates
- Y axis shows prices in ₹

---

### Test 3: Chart Period Selection

**Steps:**
1. Open RELIANCE chart (from Test 2)
2. Click different period buttons

**Test Cases:**
```
✓ Click "1D" → Shows 1 day data (intraday if available)
✓ Click "5D" → Shows 5 days
✓ Click "1M" → Shows 1 month (default)
✓ Click "3M" → Shows 3 months
✓ Click "6M" → Shows 6 months
✓ Click "1Y" → Shows 1 year
✓ Click "5Y" → Shows 5 years
```

**Expected Results:**
- Chart updates smoothly
- Active button turns green (primary color)
- Chart title updates to show period
- More data points = more detailed chart

---

### Test 4: Clickable Stock Cards

**Steps:**
1. From dashboard, scroll to "Your Holdings" section
2. Click on any stock card (e.g., RELIANCE, TCS)

**Test Cases:**
```
✓ Clicking portfolio holding → Opens modal with chart
✓ Clicking stock in "Explore Stocks" section → Opens modal
✓ Clicking stock in watchlist → Opens modal (if implemented)
✓ Stock cards have hover effect (lift up)
✓ Stock cards show cursor pointer
```

**Expected Results:**
- Any stock card click opens the detail modal
- Chart loads for that specific stock
- Buy/Watchlist buttons visible in modal

---

### Test 5: Chart Analytics

**Steps:**
1. Open any stock chart (e.g., TCS)
2. Hover over different points on the chart

**Test Cases:**
```
✓ Hover shows tooltip with date and price
✓ Tooltip shows all 3 lines (Price, MA20, MA50) if available
✓ Tooltip formatted as: "₹XXXX.XX"
✓ Legend shows all datasets
✓ Can click legend to hide/show datasets
```

**Expected Results:**
- Interactive tooltips
- Clean formatting
- Smooth hover animation

---

### Test 6: Moving Averages

**Steps:**
1. Open a stock with long history (e.g., RELIANCE)
2. Select "1Y" period
3. Look for orange and blue dashed lines

**Test Cases:**
```
✓ MA20 (orange dashed line) visible for periods >= 20 days
✓ MA50 (blue dashed line) visible for periods >= 50 days
✓ MA lines follow price trend
✓ Can hover to see exact MA values
✓ Legend shows "MA 20" and "MA 50"
```

**Expected Results:**
- Moving averages help identify trends
- Lines are smooth (tension: 0.4)
- Properly color-coded

---

### Test 7: Search All Stock Types

**Test Different Sectors:**
```
Technology:
✓ "TCS" → Tata Consultancy Services
✓ "INFY" → Infosys
✓ "WIPRO" → Wipro

Banking:
✓ "HDFC" → HDFC Bank
✓ "ICICI" → ICICI Bank
✓ "SBI" or "SBIN" → State Bank of India

Pharma:
✓ "SUN" → Sun Pharma
✓ "CIPLA" → Cipla
✓ "DRREDDY" → Dr. Reddy's

Auto:
✓ "MARUTI" → Maruti Suzuki
✓ "TATA" → Tata Motors
✓ "M&M" → Mahindra & Mahindra

E-commerce:
✓ "ZOMATO" → Zomato
✓ "PAYTM" → Paytm
✓ "NYKAA" → Nykaa
```

**Expected Results:**
- All 70+ stocks are searchable
- Search finds partial matches
- Results show sector information

---

### Test 8: Modal Actions

**Steps:**
1. Open any stock modal
2. Test action buttons

**Test Cases:**
```
✓ Click "Buy" button → Shows alert (demo mode)
✓ Click "Add to Watchlist" → Shows confirmation
✓ Click X button → Closes modal
✓ Click outside modal (on overlay) → Closes modal
✓ Press ESC key → Should close modal (if implemented)
```

**Expected Results:**
- Buttons are functional
- Modal closes gracefully
- No console errors

---

### Test 9: Responsive Design

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar
3. Test different screen sizes

**Test Cases:**
```
Desktop (> 1024px):
✓ Modal is 900px wide
✓ Chart is 400px tall
✓ All period buttons in one row

Tablet (768px - 1024px):
✓ Modal is 90% width
✓ Chart still readable
✓ Buttons may wrap

Mobile (< 768px):
✓ Modal is 95% width
✓ Chart height reduced to 300px
✓ Period buttons wrap and centered
✓ Search dropdown adjusts width
✓ Action buttons stack vertically
```

**Expected Results:**
- Everything works on all devices
- No horizontal scrolling
- Touch-friendly buttons

---

### Test 10: Error Handling

**Test Cases:**
```
✓ Search with no backend running → Shows error message
✓ Try to load chart for invalid symbol → Shows error
✓ Slow network → Shows loading spinner
✓ Chart fails to load → Graceful error message
✓ No data available → "No data available" message
```

**Expected Results:**
- User-friendly error messages
- No app crashes
- Console logs errors for debugging

---

## 🔍 Backend API Testing

### Using Browser or curl:

```bash
# Test search
http://localhost:5000/api/search?q=HDFC

# Expected: JSON with results array
# {
#   "results": [
#     {
#       "symbol": "HDFCBANK",
#       "name": "HDFC Bank Limited",
#       "sector": "Financial Services",
#       "price": 1650.50,
#       "change_percent": 1.25
#     }
#   ],
#   "total": 1
# }

# Test chart data
http://localhost:5000/api/stock/chart/RELIANCE?period=1mo

# Expected: Chart.js optimized data
# {
#   "symbol": "RELIANCE",
#   "labels": ["2024-01-10", "2024-01-11", ...],
#   "datasets": {
#     "price": [2540.50, 2555.00, ...],
#     "volume": [5000000, 4500000, ...],
#     "ma20": [2530.00, 2535.00, ...],
#     "ma50": [2520.00, 2522.00, ...]
#   }
# }

# Test historical data
http://localhost:5000/api/stock/history/TCS?period=1mo

# Expected: Full OHLCV data
# {
#   "symbol": "TCS",
#   "history": [
#     {
#       "timestamp": 1705132800000,
#       "date": "2024-01-13 00:00:00",
#       "open": 3620.00,
#       "high": 3650.00,
#       "low": 3610.00,
#       "close": 3635.00,
#       "volume": 2500000
#     },
#     ...
#   ],
#   "analytics": {
#     "high": 3700.00,
#     "low": 3550.00,
#     "avg": 3625.00
#   }
# }

# Get all stocks
http://localhost:5000/api/stocks/all?limit=10

# Expected: List of symbols
# {
#   "stocks": ["TCS", "INFY", "RELIANCE", ...],
#   "total": 70,
#   "limit": 10,
#   "offset": 0
# }
```

---

## ✅ Success Criteria

### All Tests Pass When:
1. ✅ Search returns results instantly
2. ✅ Charts load and display correctly
3. ✅ Period buttons change timeframe
4. ✅ Stock cards are clickable
5. ✅ Moving averages calculate properly
6. ✅ Modal opens/closes smoothly
7. ✅ All 70+ stocks are searchable
8. ✅ Responsive on mobile/tablet
9. ✅ No console errors
10. ✅ Backend APIs return proper JSON

---

## 🐛 Common Issues & Fixes

### Issue: "Backend not running" error
**Fix:** Run `cd backend && py server.py`

### Issue: Chart not loading
**Fix:** Check browser console, verify Chart.js CDN loaded

### Issue: Search not working
**Fix:** Verify `js/chart.js` is loaded after `js/api.js`

### Issue: Modal not opening
**Fix:** Check console for JavaScript errors

### Issue: Stocks not found
**Fix:** Verify stock symbol exists in INDIAN_STOCKS dict

---

## 🎯 Quick Start Testing

**Fastest way to test everything:**

1. Open [index.html](index.html)
2. Login: `demo@groww.in` / `demo123`
3. Search: Type "REL" → Click "RELIANCE"
4. Chart should open with 1-month data
5. Click "1Y" button → See yearly trend
6. Hover over chart → See tooltips
7. Click X to close
8. Click any stock card → Opens chart again
9. ✅ **All features working!**

---

## 📊 Performance Benchmarks

### Expected Load Times:
- Search results: < 500ms
- Chart data fetch: < 2s
- Chart render: < 500ms
- Modal animation: 300ms
- Backend response: < 1s (during market hours)

### Network Requests:
- Search: ~1-5 KB response
- Chart data: ~5-20 KB (depends on period)
- Historical data: ~10-50 KB

---

**Happy Testing! 🚀**

If all tests pass, your Groww clone is production-ready with professional search and charting features!
