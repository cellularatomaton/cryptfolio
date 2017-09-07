# Cryptfolio
Simple node.js tool for calculating market cap weighted portfolios.  Uses the coinmarketcap.com api for market cap data. This tool takes in a portfolio size (i.e. number of coins in portfolio) and a USD denominated notional value, and returns the market cap weighted portfolio for those parameters. 

## Requirments
A working Node.js install

## Example usage
From within cryptfolio directory:

```bash
node calc-weights.js [PortfolioSize] [NotionalValue]
```

So, if you wanted to create a market cap weighted portfolio of the top 10 coins with an investment of $100,000 USD, it would be invoked like:

```bash
node calc-weights.js 10 100000
```

Which results in the following output (at the time of this writing):

```
Total MarketCap: $141214009123
Bitcoin         	53.95%	$188816.01	41.02 BTC
Ethereum        	21.98%	$76939.99 	234.18 ETH
Bitcoin Cash    	7.59%	$26566.36 	41.06 BCH
Ripple          	6.09%	$21310.95 	95035.50 XRP
Litecoin        	2.95%	$10326.35 	130.93 LTC
NEM             	1.89%	$6606.29  	22306.57 XEM
Dash            	1.83%	$6397.80  	18.70 DASH
Monero          	1.26%	$4425.28  	37.30 XMR
IOTA            	1.25%	$4383.93  	6889.09 MIOTA
Ethereum Classic	1.21%	$4227.04  	236.18 ETC
```