# Cryptfolio
Simple node.js tool for calculating market cap weighted portfolios.  Uses the coinmarketcap.com api for market cap data. This tool takes in a portfolio size (i.e. number of coins in portfolio) and a USD denominated notional value, and returns the market cap weighted portfolio for those parameters. 

## Requirments
A working Node.js and npm install

## Installation
`npm install`

## Example usage
From within cryptfolio directory:

`node calc-weights.js --help`

Which outputs:

```
usage: calc-weights.js [-h] [-v] [-s SIZE] [-n NOTIONAL] [-i INCLUDES]
                       [-e EXCLUDES] [-o OUTPUT]

Cryptfolio: Market Cap Weighted Portfolio Generator.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -s SIZE, --size SIZE  Portfolio size: Number of coins / tokens in portfolio.
  -n NOTIONAL, --notional NOTIONAL
                        Notional: Fiat value of portfolio.
  -i INCLUDES, --includes INCLUDES
                        Includes: Only use these coins / tokens in building
                        the portfolio.
  -e EXCLUDES, --excludes EXCLUDES
                        Excludes: Do not use these coins / tokens in building
                        the portfolio.
  -o OUTPUT, --output OUTPUT
                        Output format: "cli" or "markdown"
```

If you want to create a market cap weighted portfolio of the top 10 coins with an investment of $100,000 USD, it would be invoked like:

`node calc-weights.js --size 10 --notional 100000`

Which results in the following output (at the time of this writing):

```
Total MarketCap: $178397980208
Bitcoin         	58.62%	$58621.11	9.35 BTC
Ethereum        	16.82%	$16817.08	53.62 ETH
Bitcoin Cash    	12.56%	$12562.56	9.41 BCH
Ripple          	4.59%	$4585.72 	21598.64 XRP
Litecoin        	1.89%	$1892.53 	30.15 LTC
Dash            	1.48%	$1476.10 	4.31 DASH
NEO             	1.06%	$1057.95 	36.44 NEO
Monero          	1.02%	$1017.66 	8.60 XMR
Ethereum Classic	1.00%	$998.43  	54.57 ETC
NEM             	0.97%	$970.87  	5044.90 XEM
```

If you want to specify which Cryptocurrencies to include, you can invoke this with comma seperated includes:

`node calc-weights.js --notional 100000 --includes BTC,ETH,BCH,XRP,LTC`

Which results in:

```
Total MarketCap: $168708710275
Bitcoin     	62.45%	$62445.67	9.88 BTC
Ethereum    	17.67%	$17665.77	56.70 ETH
Bitcoin Cash	13.06%	$13058.58	9.95 BCH
Ripple      	4.84%	$4836.20 	22839.09 XRP
Litecoin    	1.99%	$1993.78 	31.88 LTC
```

If you want to exclude specific coins / tokens, you can invoke this with comma seperated excludes:

`node calc-weights.js --size 25 --notional 100000 --excludes NEO,ETC,BCC`

```
Total MarketCap: $183449038317
Bitcoin       	56.71%	$56714.44	9.09 BTC
Ethereum      	16.35%	$16350.45	52.15 ETH
Bitcoin Cash  	12.30%	$12304.78	9.15 BCH
Ripple        	4.43%	$4433.64 	21003.95 XRP
Litecoin      	1.84%	$1835.20 	29.32 LTC
Dash          	1.43%	$1429.57 	4.19 DASH
Monero        	0.98%	$978.78  	8.36 XMR
NEM           	0.94%	$940.59  	4905.99 XEM
IOTA          	0.86%	$860.61  	1515.15 MIOTA
Qtum          	0.47%	$466.96  	40.15 QTUM
OmiseGO       	0.40%	$400.49  	55.62 OMG
Cardano       	0.38%	$377.02  	14133.12 ADA
Lisk          	0.36%	$360.83  	62.55 LSK
Zcash         	0.36%	$359.71  	1.42 ZEC
Tether        	0.33%	$327.00  	323.83 USDT
Stellar Lumens	0.30%	$295.87  	9042.48 XLM
EOS           	0.29%	$289.79  	254.21 EOS
Hshare        	0.23%	$234.16  	23.02 HSR
Waves         	0.23%	$225.83  	54.51 WAVES
Stratis       	0.17%	$168.43  	53.76 STRAT
Ark           	0.15%	$151.63  	53.41 ARK
Populous      	0.14%	$138.98  	22.49 PPT
Bytecoin      	0.12%	$118.64  	99893.43 BCN
Ardor         	0.12%	$118.57  	544.57 ARDR
Steem         	0.12%	$118.03  	134.11 STEEM
```