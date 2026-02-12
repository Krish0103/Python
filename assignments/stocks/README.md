# Portfolio Value at Risk (VaR) Analysis

## Overview
This project calculates and compares **Value at Risk (VaR)** for a 2-stock portfolio using three different methodologies:

1. **Historical Method** - Uses actual historical returns
2. **Variance-Covariance (Parametric) Method** - Assumes normal distribution
3. **Monte Carlo Simulation Method** - Uses random sampling with 10,000 simulations

## Portfolio Configuration
- **Stock 1:** Apple (AAPL)
- **Stock 2:** Microsoft (MSFT)
- **Weights:** 50% each (equal-weighted)
- **Initial Investment:** $100,000
- **Confidence Level:** 95%
- **Time Horizon:** 1 day

## Files
- `portfolio_var_analysis.ipynb` - Main Jupyter notebook with complete analysis
- `requirements.txt` - Required Python packages
- `README.md` - This file

## Installation

```bash
pip install -r requirements.txt
```

## Usage

1. Open the Jupyter notebook:
```bash
jupyter notebook portfolio_var_analysis.ipynb
```

2. Run all cells sequentially (Cell → Run All)

3. The notebook will:
   - Download 2 years of historical stock data
   - Calculate portfolio returns and statistics
   - Compute VaR using all three methods
   - Generate comprehensive visualizations
   - Perform backtesting
   - Export results to CSV files

## Output Files
After running the notebook, the following files will be generated:
- `var_comparison.csv` - VaR values from all three methods
- `portfolio_summary.csv` - Portfolio statistics summary

## Understanding VaR

**Value at Risk (VaR)** answers the question: 
> "What is the maximum loss I can expect with X% confidence over a given time period?"

For example, a 1-day VaR of $2,500 at 95% confidence means:
- There is a 95% probability that the portfolio will not lose more than $2,500 in one day
- There is a 5% probability that losses could exceed $2,500

## Method Comparison

### Historical VaR
- **Pros:** No assumptions about distribution, uses actual data
- **Cons:** Limited by available historical data
- **Best for:** When you have sufficient historical data

### Parametric VaR (Variance-Covariance)
- **Pros:** Fast computation, analytical solution
- **Cons:** Assumes normal distribution (may underestimate tail risk)
- **Best for:** Normally distributed returns, quick calculations

### Monte Carlo VaR
- **Pros:** Flexible, captures complex relationships
- **Cons:** Computationally intensive, results vary
- **Best for:** Complex portfolios, non-linear instruments

## Visualizations
The notebook generates:
1. Normalized stock price comparison
2. Portfolio returns distribution
3. Individual stock returns
4. Correlation heatmap
5. VaR comparison bar charts
6. Distribution plots for each method
7. Q-Q plot for normality testing
8. Backtesting results

## Key Insights
- All three methods typically produce different VaR estimates
- The difference reflects each method's assumptions and approach
- **Best practice:** Use multiple methods and understand why they differ
- Regular backtesting is essential to validate VaR models

## Backtesting
The notebook includes backtesting functionality that:
- Counts how many times actual losses exceeded VaR predictions
- Compares actual exception rate vs expected rate
- Assesses model accuracy

## Customization
You can easily modify:
- **Tickers:** Change `tickers = ['AAPL', 'MSFT']` to any stocks
- **Weights:** Adjust `weights = np.array([0.5, 0.5])`
- **Investment:** Modify `initial_investment = 100000`
- **Confidence Level:** Change `confidence_level = 0.95` (e.g., 0.99 for 99%)
- **Time Period:** Adjust `start_date` and `end_date`

## Requirements
- Python 3.7+
- Internet connection (for downloading stock data from Yahoo Finance)

## Notes
- Stock data is fetched from Yahoo Finance using yfinance
- The analysis uses adjusted closing prices
- Results will vary based on the current date and market conditions

## References
- **Historical VaR:** Non-parametric approach using empirical distribution
- **Parametric VaR:** Based on normal distribution and portfolio theory
- **Monte Carlo VaR:** Simulation-based approach using Cholesky decomposition

## License
Free to use for educational purposes.

---
**Created:** February 2026  
**Author:** Portfolio Risk Analysis Project
