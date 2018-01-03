# Historical performance testing:
In order to see how the various portfolio strategies perform over the past few years, we will first need to pull down coinmarketcap.com data.  At the time of this writing, there is not yet support for historical market caps over the coinmarketcap.com api.  This process should be updated if that should change in the future.  Currently we scrape the historical pages of the site using Cheerio.

## Scrape historical data:
`node scrape-caps.js`

Next  we run a command that simulates the various portfolio strategies, and writes the output to a json file.  Notice that the same seet of cli arguments from market-cap.js are available (README_CLI.md for more info).

## Create portfolio file:
`node calc-portfolio.js --excludes ETC,QTUM,BCC,USDT,BTG,TRX`

Once that process finishes, you can launch the web based chart output by hitting localhost:3000.

## Start GUI:
`cd app`
`DEBUG=app:* npm start`
`open http://localhost:3000`

The view which opens will show you how various Market Cap Weighted and Uniformly Weighted portfolios perform historically.  Clicking on the legend in the left graph will populate the weights in the right graph.