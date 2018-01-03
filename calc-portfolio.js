const config = require('./config.js');
const marketCap = require('./market-cap.js');
const parser = require("./arg-parser.js");
const fs = require('fs')
const path = require('path');

const load = function(){
    historical_caps = [];
    fs.readdirSync(config.market_cap_dir)
        .forEach(file => {
            // console.log(`Processing: ${file}`);
            if(file.startsWith('20')){
                const filename = `${config.market_cap_dir}/${file}`;
                const date_string = `${file.slice(0,4)}-${file.slice(4,6)}-${file.slice(6)}`;
                const d = new Date(date_string);
                const data = fs.readFileSync(filename, 'utf8');
                const lines = data.split('\n');
                const caps = [];
                lines.forEach(line => {
                    const csvs = line.split(',');
                    caps.push({
                        name : csvs[0],
                        symbol : csvs[1],
                        market_cap_usd : parseFloat(csvs[2]),
                        market_cap_btc : parseFloat(csvs[3]),
                        price_usd : parseFloat(csvs[4]),
                        price_btc : parseFloat(csvs[5]),
                        supply : parseFloat(csvs[6]),
                        volume_usd : parseFloat(csvs[7]),
                        volume_btc : parseFloat(csvs[8])
                    });
                });
                historical_caps.push({
                    market_caps: caps,
                    date: d,
                    date_string: date_string
                });
            }else{
                console.log(`Skipping incompatible filename.`);
            }
        });
    return historical_caps;
}

const get_portfolio_value = function(portfolio, caps){
    let portfolio_value = 0;
    portfolio.weights.forEach(function(weight){
        const symbol = weight.symbol;
        const new_cap = caps.filter(function(cap){return cap.symbol === symbol;})[0]
        const pos = weight.market_cap_weight_cxy;
        if(new_cap){
            const px = new_cap.price_usd;
            portfolio_value += px * pos;
        }else{
            const px = weight.price_usd;
            portfolio_value += px * pos;
        }
    });
    return portfolio_value;
}

const calc_uniform = function(historical_caps, portfolio_size){
    const sim = [];
    historical_caps.forEach(function(cap, index, array){
        let portfolio_value = parser.PORTFOLIO_NOTIONAL;
        if(0 < index){
            // let last_cap = array[index-1];
            const last_portfolio = sim[index-1].portfolio;
            portfolio_value = get_portfolio_value(last_portfolio, cap.market_caps);
        }
        // console.log(`Portfolio Value: ${portfolio_value}`);
        const portfolio = marketCap(
            cap.market_caps, 
            portfolio_size, 
            portfolio_value, 
            parser.FILTER_IN_ARRAY, 
            parser.FILTER_OUT_ARRAY,
            'uniform'
        );
        console.log(`Uniform: ${portfolio.weights[0].market_cap_weight}`);
        // cap.portfolio = portfolio;
        sim.push({
            portfolio: portfolio,
            value: portfolio_value,
            date: cap.date,
            date_string: cap.date_string
        });
    })
    return sim;
}

const calc_weighted = function(historical_caps, portfolio_size){
    const sim = [];
    historical_caps.forEach(function(cap, index, array){
        let portfolio_value = parser.PORTFOLIO_NOTIONAL;
        if(0 < index){
            // let last_cap = array[index-1];
            const last_portfolio = sim[index-1].portfolio;
            portfolio_value = get_portfolio_value(last_portfolio, cap.market_caps);
        }
        // console.log(`Portfolio Value: ${portfolio_value}`);
        const portfolio = marketCap(
            cap.market_caps, 
            portfolio_size, 
            portfolio_value, 
            parser.FILTER_IN_ARRAY, 
            parser.FILTER_OUT_ARRAY
        );
        // cap.portfolio = portfolio;
        sim.push({
            portfolio: portfolio,
            value: portfolio_value,
            date: cap.date,
            date_string: cap.date_string
        });
    })
    return sim;
}

const h_caps = load();
simulations = [];
[1, 5, 10, 15, 20, 25].forEach(function(size){
    console.log(`Simulating uniformly weighted portfolio size: ${size}`);
    const sim = calc_uniform(h_caps, size);
    console.log(`Final value: $${sim[sim.length - 1].value}`);
    simulations.push({
        simulation: sim,
        id: `U_${size}`
    });
});

[5, 15, 25].forEach(function(size){
    console.log(`Simulating market cap weighted portfolio size: ${size}`);
    const sim = calc_weighted(h_caps, size);
    console.log(`Final value: $${sim[sim.length - 1].value}`);
    simulations.push({
        simulation: sim,
        id: `MC_${size}`
    });
});

const simFile = 'data/simulations.json' 
fs.writeFile(simFile, JSON.stringify(simulations, null, 2), 'utf8', function (err) {
    if (err) {
        console.log(`Some error occured - ${simFile} either not saved or corrupted.`);
    } else{
        console.log(`Finished ${simFile}`);
    }
});