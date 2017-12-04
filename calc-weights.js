#!/usr/bin/env node
'use strict';

const request = require("./http-request");
const marketCap = require('./market-cap.js');
const parser = require("./arg-parser.js");

function getMarketCaps(callback) {
    return request('https://api.coinmarketcap.com/v1/ticker/', callback);
}

function renderCli(res){
    res.weights.forEach(function(mc){
        console.log(
            `${mc.name}` + ` `.repeat(res.longest_name - mc.name.length) + `\t` + 
            `${(mc.market_cap_weight*100).toFixed(2)}` + `%\t` +
            `$${mc.market_cap_weight_usd.toFixed(2)}` + ` `.repeat(res.longest_usd - mc.market_cap_weight_usd.toFixed(2).length) + `\t` +
            `${mc.market_cap_weight_cxy.toFixed(2)} ${mc.symbol}` 
        );
    });
}

function renderMarkdown(res){
    console.log(`Coin | Weight | USD | Position`);
    console.log(`-----|--------|-----|---------`);
    res.weights.forEach(function(mc){
        console.log(`${mc.name} | ${mc.market_cap_weight.toFixed(2)}% | $${mc.market_cap_weight_usd.toFixed(2)} | ${mc.market_cap_weight_cxy.toFixed(2)} ${mc.symbol}`);
    });
}

getMarketCaps(function(response){
    var jsonArray = JSON.parse(response);
    let results = marketCap(
        jsonArray, 
        parser.PORTFOLIO_SIZE, 
        parser.PORTFOLIO_NOTIONAL, 
        parser.FILTER_IN_ARRAY, 
        parser.FILTER_OUT_ARRAY
    );
    console.log(`Total MarketCap: $${results.total_cap}`);
    if(parser.OUTPUT_FORMAT === 'markdown'){
        renderMarkdown(results);
    }else{
        renderCli(results);
    }
});