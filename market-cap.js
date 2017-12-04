#!/usr/bin/env node
'use strict';

let calc = function(market_caps, portfolio_size, portfolio_notional, filter_in, filter_out){
    // Get top N market caps:
    let market_cap_weights = market_caps
    .filter(function(mc){
        if (filter_in.length > 0){
            if(filter_in.includes(mc.symbol)){
                return mc.market_cap_usd;
            }
        } else {
             return mc.market_cap_usd;
        }
    })
    .filter(function(mc){
        if (filter_out.length > 0){
            if(!filter_out.includes(mc.symbol)){
                return mc.market_cap_usd;
            }
        } else {
             return mc.market_cap_usd;
        }
    })
    .sort(function(a, b){
        return b.market_cap_usd - a.market_cap_usd;
    })
    .slice(0, portfolio_size);

    let totalCap = 0;
    let longestName = 0;
    market_cap_weights.forEach(function(mc){
        totalCap += parseInt(mc.market_cap_usd);
        longestName = Math.max(longestName, mc.name.length);
    });

    market_cap_weights.forEach(function(mc){
        mc.market_cap_weight = mc.market_cap_usd / totalCap;
        mc.market_cap_weight_usd = mc.market_cap_weight * portfolio_notional;
        mc.market_cap_weight_cxy = mc.market_cap_weight_usd / mc.price_usd;
    });

    return {
        weights: market_cap_weights,
        total_cap: totalCap,
        longest_name: longestName,
        longest_usd: market_cap_weights[0].market_cap_weight_usd.toFixed(2).length
    };
}

module.exports = calc;