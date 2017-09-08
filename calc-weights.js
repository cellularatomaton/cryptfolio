var https = require('https');

const PORTFOLIO_SIZE = process.argv[2] || 25;
const PORTFOLIO_NOTIONAL = process.argv[3] || 100000;
const OUTPUT_FORMAT = process.argv[4] || 'cli';

function getMarketCaps(callback) {
    return https.get('https://api.coinmarketcap.com/v1/ticker/', function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            var parsed = JSON.parse(body);
            callback(parsed);
        });
        response.on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });
    });
}

getMarketCaps(function(marketCaps){
    // Get top N market caps:
    let mcs = marketCaps
        .filter(function(mc){
            return mc.market_cap_usd;
        })
        .sort(function(a, b){
            return b.market_cap_usd - a.market_cap_usd;
        })
        .slice(0, PORTFOLIO_SIZE);
    // Calculate total market cap size:
    let totalCap = 0;
    let longestName = 0;
    mcs.forEach(function(mc){
        totalCap += parseInt(mc.market_cap_usd);
        longestName = Math.max(longestName, mc.name.length);
    });
    console.log(`Total MarketCap: $${totalCap}`);
    if(OUTPUT_FORMAT === 'markdown'){
        renderMarkdown(mcs, totalCap);
    }else{
        renderCli(mcs, totalCap, longestName);
    }
});


function renderCli(mcs, totalCap, longestName){
    // Calculate weight for each market:
    let longestUsd = 0;
    mcs.forEach(function(mc){
        mc.market_cap_weight = 100 * mc.market_cap_usd / totalCap;
        mc.market_cap_weight_usd = mc.market_cap_weight * PORTFOLIO_NOTIONAL / 100;
        mc.market_cap_weight_cxy = mc.market_cap_weight_usd / mc.price_usd;
        if(longestUsd === 0){
            longestUsd = mc.market_cap_weight_usd.toFixed(2).length;
        }
        console.log(
            mc.name + " ".repeat(longestName - mc.name.length) + "\t" + 
            mc.market_cap_weight.toFixed(2) + "%\t" +
            "$" + mc.market_cap_weight_usd.toFixed(2) + " ".repeat(longestUsd - mc.market_cap_weight_usd.toFixed(2).length) + "\t" +
            mc.market_cap_weight_cxy.toFixed(2) + " " + mc.symbol 
        );
    });
}

function renderMarkdown(mcs, totalCap){
    // Calculate weight for each market:
    let longestUsd = 0;
    console.log(`Coin | Weight | USD | Position`);
    console.log(`-----|--------|-----|---------`);
    mcs.forEach(function(mc){
        mc.market_cap_weight = 100 * mc.market_cap_usd / totalCap;
        mc.market_cap_weight_usd = mc.market_cap_weight * PORTFOLIO_NOTIONAL / 100;
        mc.market_cap_weight_cxy = mc.market_cap_weight_usd / mc.price_usd;
        if(longestUsd === 0){
            longestUsd = mc.market_cap_weight_usd.toFixed(2).length;
        }
        console.log(`${mc.name} | %${mc.market_cap_weight.toFixed(2)} | $${mc.market_cap_weight_usd.toFixed(2)} | ${mc.market_cap_weight_cxy.toFixed(2)} ${mc.symbol}`);
    });
}
