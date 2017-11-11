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
HotBox:cryptfolio wmoore$ node calc-weights.js 10 100000
Total MarketCap: $141026919736
Bitcoin         	53.91%	$53908.96	11.74 BTC
Ethereum        	22.00%	$21997.27	67.00 ETH
Bitcoin Cash    	7.60%	$7598.91 	11.75 BCH
Ripple          	6.08%	$6080.47 	27189.02 XRP
Litecoin        	2.94%	$2940.67 	37.46 LTC
NEM             	1.88%	$1881.71 	6381.76 XEM
Dash            	1.83%	$1830.40 	5.35 DASH
IOTA            	1.28%	$1279.64 	1970.92 MIOTA
Monero          	1.27%	$1274.04 	10.67 XMR
Ethereum Classic	1.21%	$1207.93 	67.57 ETC
```

If you want to specify which Cryptocurrencies to include, you can invoke this with comma seperation:

```bash
node calc-weights.js 10 100000 ETH,BTC,BCH,LTC
```

Which results in:

```
Total MarketCap: $160563578647
Bitcoin         66.64%  $999.55 0.16 BTC
Ethereum        18.17%  $272.55 0.89 ETH
Bitcoin Cash    13.15%  $197.18 0.16 BCH
Litecoin        2.05%   $30.71  0.50 LTC
```