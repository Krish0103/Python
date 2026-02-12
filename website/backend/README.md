# Groww Stock Market API Backend

Python Flask backend that fetches real-time stock market data using yfinance.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python server.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Stock Data

#### Get Single Stock Data
```
GET /api/stock/{symbol}
Example: GET /api/stock/RELIANCE
```

Returns:
- Current price
- Price change and percentage
- Volume, market cap
- Day high/low
- 52-week high/low
- P/E ratio

#### Get Trending Stocks
```
GET /api/stocks/trending
```

Returns list of trending stocks with current prices.

#### Get Stock History
```
GET /api/stock/history/{symbol}?period=1mo
Example: GET /api/stock/history/TCS?period=1mo
```

Periods: `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `5y`

### Market Indices

#### Get Market Indices
```
GET /api/indices
```

Returns NIFTY 50, SENSEX, NIFTY BANK, NIFTY IT data.

### Portfolio

#### Calculate Portfolio
```
POST /api/portfolio/calculate
Content-Type: application/json

{
  "holdings": [
    {"symbol": "RELIANCE", "quantity": 10, "avg_price": 2540},
    {"symbol": "TCS", "quantity": 5, "avg_price": 3620}
  ]
}
```

Returns:
- Total invested amount
- Current portfolio value
- Total P&L and percentage
- Individual holding details

### Search

#### Search Stocks
```
GET /api/search?q=RELIANCE
```

Returns matching stock symbols and names.

### Mutual Funds

#### Get Mutual Funds (ETFs)
```
GET /api/mutual-funds
```

Returns ETF data as proxy for mutual funds.

### Health Check

```
GET /api/health
```

## Supported Indian Stocks

- RELIANCE (Reliance Industries)
- TCS (Tata Consultancy Services)
- HDFCBANK (HDFC Bank)
- INFY (Infosys)
- ICICIBANK (ICICI Bank)
- WIPRO (Wipro)
- ADANIPORTS (Adani Ports)
- ASIANPAINT (Asian Paints)
- BAJFINANCE (Bajaj Finance)
- ITC (ITC Limited)
- SBIN (State Bank of India)
- BHARTIARTL (Bharti Airtel)
- LT (Larsen & Toubro)
- MARUTI (Maruti Suzuki)
- HINDUNILVR (Hindustan Unilever)

## Notes

- All Indian stocks use `.NS` suffix (NSE - National Stock Exchange)
- Data is fetched in real-time from Yahoo Finance
- Market hours: 9:15 AM - 3:30 PM IST (Mon-Fri)
- Prices are in Indian Rupees (₹)

## CORS

CORS is enabled for all origins to allow frontend communication.

## Error Handling

All endpoints return proper HTTP status codes:
- `200` - Success
- `404` - Stock/Data not found
- `500` - Server error

Error response format:
```json
{
  "error": "Error message here"
}
```
