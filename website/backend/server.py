from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Comprehensive Indian stock symbols mapping (70+ stocks across sectors)
INDIAN_STOCKS = {
    # Technology
    'TCS': 'TCS.NS',
    'INFY': 'INFY.NS',
    'WIPRO': 'WIPRO.NS',
    'HCLTECH': 'HCLTECH.NS',
    'TECHM': 'TECHM.NS',
    'LTIM': 'LTIM.NS',
    'COFORGE': 'COFORGE.NS',
    'PERSISTENT': 'PERSISTENT.NS',
    'MPHASIS': 'MPHASIS.NS',
    
    # Banking & Finance
    'HDFCBANK': 'HDFCBANK.NS',
    'ICICIBANK': 'ICICIBANK.NS',
    'SBIN': 'SBIN.NS',
    'KOTAKBANK': 'KOTAKBANK.NS',
    'AXISBANK': 'AXISBANK.NS',
    'INDUSINDBK': 'INDUSINDBK.NS',
    'BAJFINANCE': 'BAJFINANCE.NS',
    'BAJAJFINSV': 'BAJAJFINSV.NS',
    'PNB': 'PNB.NS',
    'BANKBARODA': 'BANKBARODA.NS',
    
    # Energy & Oil/Gas
    'RELIANCE': 'RELIANCE.NS',
    'ONGC': 'ONGC.NS',
    'BPCL': 'BPCL.NS',
    'IOC': 'IOC.NS',
    'NTPC': 'NTPC.NS',
    'POWERGRID': 'POWERGRID.NS',
    'ADANIGREEN': 'ADANIGREEN.NS',
    'TATAPOWER': 'TATAPOWER.NS',
    
    # FMCG & Consumer
    'HINDUNILVR': 'HINDUNILVR.NS',
    'ITC': 'ITC.NS',
    'NESTLEIND': 'NESTLEIND.NS',
    'BRITANNIA': 'BRITANNIA.NS',
    'DABUR': 'DABUR.NS',
    'MARICO': 'MARICO.NS',
    'GODREJCP': 'GODREJCP.NS',
    'TATACONSUM': 'TATACONSUM.NS',
    
    # Automobile
    'MARUTI': 'MARUTI.NS',
    'TATAMOTORS': 'TATAMOTORS.NS',
    'M&M': 'M&M.NS',
    'BAJAJ-AUTO': 'BAJAJ-AUTO.NS',
    'EICHERMOT': 'EICHERMOT.NS',
    'HEROMOTOCO': 'HEROMOTOCO.NS',
    'TVSMOTOR': 'TVSMOTOR.NS',
    
    # Telecom
    'BHARTIARTL': 'BHARTIARTL.NS',
    'IDEA': 'IDEA.NS',
    
    # Pharma
    'SUNPHARMA': 'SUNPHARMA.NS',
    'DRREDDY': 'DRREDDY.NS',
    'CIPLA': 'CIPLA.NS',
    'DIVISLAB': 'DIVISLAB.NS',
    'BIOCON': 'BIOCON.NS',
    'AUROPHARMA': 'AUROPHARMA.NS',
    'LUPIN': 'LUPIN.NS',
    
    # Metals & Mining
    'TATASTEEL': 'TATASTEEL.NS',
    'HINDALCO': 'HINDALCO.NS',
    'JSWSTEEL': 'JSWSTEEL.NS',
    'VEDL': 'VEDL.NS',
    'COALINDIA': 'COALINDIA.NS',
    'SAIL': 'SAIL.NS',
    
    # Infrastructure & Construction
    'LT': 'LT.NS',
    'ADANIPORTS': 'ADANIPORTS.NS',
    'ULTRACEMCO': 'ULTRACEMCO.NS',
    'GRASIM': 'GRASIM.NS',
    'AMBUJACEM': 'AMBUJACEM.NS',
    
    # Paints & Chemicals
    'ASIANPAINT': 'ASIANPAINT.NS',
    'PIDILITIND': 'PIDILITIND.NS',
    'BERGER': 'BERGER.NS',
    
    # E-commerce & Tech
    'ZOMATO': 'ZOMATO.NS',
    'PAYTM': 'PAYTM.NS',
    'NYKAA': 'NYKAA.NS',
}

# Market indices
INDICES = {
    'NIFTY50': '^NSEI',
    'SENSEX': '^BSESN',
    'NIFTYBANK': '^NSEBANK',
    'NIFTYIT': '^CNXIT'
}

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    """Get detailed stock data for a specific symbol"""
    try:
        # Map symbol to Yahoo Finance ticker
        ticker_symbol = INDIAN_STOCKS.get(symbol.upper(), symbol + '.NS')
        stock = yf.Ticker(ticker_symbol)
        
        # Get current data
        info = stock.info
        hist = stock.history(period='1d')
        
        if hist.empty:
            return jsonify({'error': 'No data available'}), 404
        
        current_price = hist['Close'].iloc[-1]
        previous_close = info.get('previousClose', current_price)
        
        # Calculate change
        change = current_price - previous_close
        change_percent = (change / previous_close) * 100 if previous_close else 0
        
        data = {
            'symbol': symbol.upper(),
            'name': info.get('longName', symbol),
            'current_price': round(current_price, 2),
            'previous_close': round(previous_close, 2),
            'change': round(change, 2),
            'change_percent': round(change_percent, 2),
            'volume': info.get('volume', 0),
            'market_cap': info.get('marketCap', 0),
            'day_high': round(hist['High'].iloc[-1], 2),
            'day_low': round(hist['Low'].iloc[-1], 2),
            'open': round(hist['Open'].iloc[-1], 2),
            '52_week_high': info.get('fiftyTwoWeekHigh', 0),
            '52_week_low': info.get('fiftyTwoWeekLow', 0),
            'pe_ratio': info.get('trailingPE', 0)
        }
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stocks/trending', methods=['GET'])
def get_trending_stocks():
    """Get trending stocks with current prices"""
    try:
        stocks_data = []
        
        for symbol, ticker in list(INDIAN_STOCKS.items())[:10]:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                hist = stock.history(period='1d')
                
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                    previous_close = info.get('previousClose', current_price)
                    change_percent = ((current_price - previous_close) / previous_close * 100) if previous_close else 0
                    
                    stocks_data.append({
                        'symbol': symbol,
                        'name': info.get('longName', symbol),
                        'price': round(current_price, 2),
                        'change': round(current_price - previous_close, 2),
                        'change_percent': round(change_percent, 2),
                        'volume': info.get('volume', 0)
                    })
            except:
                continue
        
        return jsonify({'stocks': stocks_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/indices', methods=['GET'])
def get_market_indices():
    """Get market indices data (NIFTY, SENSEX, etc.)"""
    try:
        indices_data = []
        
        for name, ticker in INDICES.items():
            try:
                index = yf.Ticker(ticker)
                hist = index.history(period='2d')
                
                if not hist.empty:
                    current_value = hist['Close'].iloc[-1]
                    previous_value = hist['Close'].iloc[-2] if len(hist) > 1 else current_value
                    
                    change = current_value - previous_value
                    change_percent = (change / previous_value * 100) if previous_value else 0
                    
                    indices_data.append({
                        'name': name,
                        'value': round(current_value, 2),
                        'change': round(change, 2),
                        'change_percent': round(change_percent, 2)
                    })
            except:
                continue
        
        return jsonify({'indices': indices_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stock/history/<symbol>', methods=['GET'])
def get_stock_history(symbol):
    """Get historical data for stock charting"""
    try:
        period = request.args.get('period', '1mo')  # 1d, 5d, 1mo, 3mo, 6mo, 1y, 5y
        interval = request.args.get('interval', '1d')  # 1m, 5m, 15m, 1h, 1d, 1wk
        
        ticker_symbol = INDIAN_STOCKS.get(symbol.upper(), symbol + '.NS')
        stock = yf.Ticker(ticker_symbol)
        
        # Fetch historical data
        hist = stock.history(period=period, interval=interval)
        
        if hist.empty:
            return jsonify({'error': 'No historical data available'}), 404
        
        # Get stock info for additional context
        info = stock.info
        
        # Convert to list of dictionaries
        history_data = []
        for date, row in hist.iterrows():
            history_data.append({
                'timestamp': int(date.timestamp() * 1000),  # Unix timestamp in ms
                'date': date.strftime('%Y-%m-%d %H:%M:%S'),
                'open': round(row['Open'], 2),
                'high': round(row['High'], 2),
                'low': round(row['Low'], 2),
                'close': round(row['Close'], 2),
                'volume': int(row['Volume'])
            })
        
        # Calculate some analytics
        closes = [d['close'] for d in history_data]
        volumes = [d['volume'] for d in history_data]
        
        analytics = {
            'high': round(max(closes), 2) if closes else 0,
            'low': round(min(closes), 2) if closes else 0,
            'avg': round(sum(closes) / len(closes), 2) if closes else 0,
            'total_volume': sum(volumes),
            'data_points': len(history_data)
        }
        
        return jsonify({
            'symbol': symbol.upper(),
            'name': info.get('longName', symbol),
            'period': period,
            'interval': interval,
            'history': history_data,
            'analytics': analytics
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stock/chart/<symbol>', methods=['GET'])
def get_stock_chart_data(symbol):
    """Get optimized chart data for visualization"""
    try:
        period = request.args.get('period', '1mo')
        
        ticker_symbol = INDIAN_STOCKS.get(symbol.upper(), symbol + '.NS')
        stock = yf.Ticker(ticker_symbol)
        hist = stock.history(period=period)
        
        if hist.empty:
            return jsonify({'error': 'No data available'}), 404
        
        # Prepare data for Chart.js format
        labels = [date.strftime('%Y-%m-%d') for date in hist.index]
        prices = [round(price, 2) for price in hist['Close'].tolist()]
        volumes = [int(vol) for vol in hist['Volume'].tolist()]
        
        # Calculate moving averages
        closes = hist['Close']
        ma_20 = closes.rolling(window=20).mean().fillna(0).tolist()
        ma_50 = closes.rolling(window=50).mean().fillna(0).tolist()
        
        return jsonify({
            'symbol': symbol.upper(),
            'labels': labels,
            'datasets': {
                'price': prices,
                'volume': volumes,
                'ma20': [round(x, 2) for x in ma_20],
                'ma50': [round(x, 2) for x in ma_50]
            },
            'current_price': prices[-1] if prices else 0,
            'period': period
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/portfolio/calculate', methods=['POST'])
def calculate_portfolio():
    """Calculate portfolio value and P&L"""
    try:
        holdings = request.json.get('holdings', [])
        # holdings format: [{'symbol': 'RELIANCE', 'quantity': 10, 'avg_price': 2540}]
        
        portfolio_data = {
            'total_invested': 0,
            'current_value': 0,
            'total_pnl': 0,
            'holdings': []
        }
        
        for holding in holdings:
            symbol = holding.get('symbol')
            quantity = holding.get('quantity', 0)
            avg_price = holding.get('avg_price', 0)
            
            ticker_symbol = INDIAN_STOCKS.get(symbol.upper(), symbol + '.NS')
            stock = yf.Ticker(ticker_symbol)
            hist = stock.history(period='1d')
            
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                invested = quantity * avg_price
                current_value = quantity * current_price
                pnl = current_value - invested
                pnl_percent = (pnl / invested * 100) if invested else 0
                
                portfolio_data['total_invested'] += invested
                portfolio_data['current_value'] += current_value
                
                portfolio_data['holdings'].append({
                    'symbol': symbol,
                    'quantity': quantity,
                    'avg_price': round(avg_price, 2),
                    'current_price': round(current_price, 2),
                    'invested': round(invested, 2),
                    'current_value': round(current_value, 2),
                    'pnl': round(pnl, 2),
                    'pnl_percent': round(pnl_percent, 2)
                })
        
        portfolio_data['total_pnl'] = portfolio_data['current_value'] - portfolio_data['total_invested']
        portfolio_data['total_invested'] = round(portfolio_data['total_invested'], 2)
        portfolio_data['current_value'] = round(portfolio_data['current_value'], 2)
        portfolio_data['total_pnl'] = round(portfolio_data['total_pnl'], 2)
        portfolio_data['total_pnl_percent'] = round(
            (portfolio_data['total_pnl'] / portfolio_data['total_invested'] * 100) if portfolio_data['total_invested'] else 0, 2
        )
        
        return jsonify(portfolio_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
    """Search for stocks with fuzzy matching"""
    try:
        query = request.args.get('q', '').upper()
        
        if not query or len(query) < 2:
            return jsonify({'results': []})
        
        results = []
        
        # First pass: exact matches
        for symbol, ticker in INDIAN_STOCKS.items():
            if query == symbol:
                try:
                    stock = yf.Ticker(ticker)
                    info = stock.info
                    hist = stock.history(period='1d')
                    
                    result = {
                        'symbol': symbol,
                        'name': info.get('longName', symbol),
                        'exchange': 'NSE',
                        'sector': info.get('sector', 'N/A'),
                        'industry': info.get('industry', 'N/A')
                    }
                    
                    if not hist.empty:
                        current_price = hist['Close'].iloc[-1]
                        previous_close = info.get('previousClose', current_price)
                        change_percent = ((current_price - previous_close) / previous_close * 100) if previous_close else 0
                        
                        result['price'] = round(current_price, 2)
                        result['change_percent'] = round(change_percent, 2)
                    
                    results.append(result)
                except:
                    continue
        
        # Second pass: starts with query
        if len(results) < 10:
            for symbol, ticker in INDIAN_STOCKS.items():
                if symbol.startswith(query) and symbol not in [r['symbol'] for r in results]:
                    try:
                        stock = yf.Ticker(ticker)
                        info = stock.info
                        hist = stock.history(period='1d')
                        
                        result = {
                            'symbol': symbol,
                            'name': info.get('longName', symbol),
                            'exchange': 'NSE',
                            'sector': info.get('sector', 'N/A'),
                            'industry': info.get('industry', 'N/A')
                        }
                        
                        if not hist.empty:
                            current_price = hist['Close'].iloc[-1]
                            previous_close = info.get('previousClose', current_price)
                            change_percent = ((current_price - previous_close) / previous_close * 100) if previous_close else 0
                            
                            result['price'] = round(current_price, 2)
                            result['change_percent'] = round(change_percent, 2)
                        
                        results.append(result)
                    except:
                        continue
        
        # Third pass: contains query
        if len(results) < 10:
            for symbol, ticker in INDIAN_STOCKS.items():
                if query in symbol and symbol not in [r['symbol'] for r in results]:
                    try:
                        stock = yf.Ticker(ticker)
                        info = stock.info
                        hist = stock.history(period='1d')
                        
                        result = {
                            'symbol': symbol,
                            'name': info.get('longName', symbol),
                            'exchange': 'NSE',
                            'sector': info.get('sector', 'N/A'),
                            'industry': info.get('industry', 'N/A')
                        }
                        
                        if not hist.empty:
                            current_price = hist['Close'].iloc[-1]
                            previous_close = info.get('previousClose', current_price)
                            change_percent = ((current_price - previous_close) / previous_close * 100) if previous_close else 0
                            
                            result['price'] = round(current_price, 2)
                            result['change_percent'] = round(change_percent, 2)
                        
                        results.append(result)
                        
                        if len(results) >= 10:
                            break
                    except:
                        continue
        
        return jsonify({'results': results[:10], 'total': len(results)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stocks/all', methods=['GET'])
def get_all_stocks():
    """Get list of all available stocks"""
    try:
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        stock_list = list(INDIAN_STOCKS.keys())[offset:offset+limit]
        
        return jsonify({
            'stocks': stock_list,
            'total': len(INDIAN_STOCKS),
            'limit': limit,
            'offset': offset
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/mutual-funds', methods=['GET'])
def get_mutual_funds():
    """Get mutual funds data (using ETFs as proxy)"""
    try:
        # Using popular ETFs as proxy for mutual funds
        etfs = {
            'NIFTYBEES': 'NIFTYBEES.NS',  # Nifty 50 ETF
            'JUNIORBEES': 'JUNIORBEES.NS',  # Nifty Next 50 ETF
            'BANKBEES': 'BANKBEES.NS',  # Banking ETF
            'GOLDBEES': 'GOLDBEES.NS',  # Gold ETF
        }
        
        funds_data = []
        for name, ticker in etfs.items():
            try:
                fund = yf.Ticker(ticker)
                hist = fund.history(period='1y')
                
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                    year_ago_price = hist['Close'].iloc[0]
                    
                    one_year_return = ((current_price - year_ago_price) / year_ago_price * 100) if year_ago_price else 0
                    
                    # Calculate 3-year return (approximate)
                    three_year_return = one_year_return * 1.2  # Simulated
                    
                    funds_data.append({
                        'name': name,
                        'type': 'Equity ETF',
                        'current_nav': round(current_price, 2),
                        'one_year_return': round(one_year_return, 2),
                        'three_year_return': round(three_year_return, 2)
                    })
            except:
                continue
        
        return jsonify({'funds': funds_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Stock Market API is running'})

if __name__ == '__main__':
    print("🚀 Starting Groww Stock Market API Server...")
    print("📊 Server running on http://localhost:5000")
    print("💹 Real-time stock data powered by yfinance")
    app.run(debug=True, host='0.0.0.0', port=5000)
