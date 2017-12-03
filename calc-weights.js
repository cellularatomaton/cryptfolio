#!/usr/bin/env node
'use strict';

// let https = require('https');
let request = require("./http-request");
let ArgumentParser = require('argparse').ArgumentParser;


let parser = new ArgumentParser({
    version: '1.0.0',
    addHelp:true,
    description: 'Cryptfolio: Market Cap Weighted Portfolio Generator.'
  });
  parser.addArgument(
    [ '-s', '--size' ],
    {
      help: 'Portfolio size:  Number of coins / tokens in portfolio.'
    }
  );
  parser.addArgument(
    [ '-n', '--notional' ],
    {
      help: 'Notional:  Fiat value of portfolio.'
    }
  );
  parser.addArgument(
    [ '-i', '--includes'],
    {
      help: 'Includes:  Only use these coins / tokens in building the portfolio.',
      dest: 'filter_in'
    }
  );
  parser.addArgument(
    [ '-e', '--excludes'],
    {
      help: 'Excludes:  Do not use these coins / tokens in building the portfolio.',
      dest: 'filter_out'
    }
  );
  parser.addArgument(
    [ '-o', '--output'],
    {
      help: 'Output format:  "cli" or "markdown"'
    }
  );
var args = parser.parseArgs();

const PORTFOLIO_SIZE = args.size || 25;
const PORTFOLIO_NOTIONAL = args.notional || 100000;
const FILTER_IN = args.filter_in || '';
const FILTER_OUT = args.filter_out || '';
const FILTER_IN_ARRAY = FILTER_IN.length > 0 ? FILTER_IN.split(',') : [];
const FILTER_OUT_ARRAY = FILTER_OUT.length > 0 ? FILTER_OUT.split(',') : [];
const OUTPUT_FORMAT = process.argv[5] || 'cli';

function getMarketCaps(callback) {
    return request('https://api.coinmarketcap.com/v1/ticker/', callback);
}

getMarketCaps(function(response){
    var marketCaps = JSON.parse(response);
    // Get top N market caps:
    let mcs = marketCaps
        .filter(function(mc){
            
            if (FILTER_IN_ARRAY.length > 0){
                if(FILTER_IN_ARRAY.includes(mc.symbol)){
                    return mc.market_cap_usd;
                }
            } else {
                 return mc.market_cap_usd;
            }
        })
        .filter(function(mc){
            
            if (FILTER_OUT_ARRAY.length > 0){
                if(!FILTER_OUT_ARRAY.includes(mc.symbol)){
                    return mc.market_cap_usd;
                }
            } else {
                 return mc.market_cap_usd;
            }
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
        console.log(`${mc.name} | ${mc.market_cap_weight.toFixed(2)}% | $${mc.market_cap_weight_usd.toFixed(2)} | ${mc.market_cap_weight_cxy.toFixed(2)} ${mc.symbol}`);
    });
}
