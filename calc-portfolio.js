const config = require('./config.js');
let marketCap = require('./market-cap.js');
const parser = require("./arg-parser.js");
const fs = require('fs')
const path = require('path');

let load = function(){
    historical_caps = [];
    fs.readdirSync(config.market_cap_dir)
        .forEach(file => {
            // console.log(`Processing: ${file}`);
            if(file.startsWith('20')){
                let filename = `${config.market_cap_dir}/${file}`;
                let date_string = `${file.slice(0,4)}-${file.slice(4,6)}-${file.slice(6)}`;
                let d = new Date(date_string);
                let data = fs.readFileSync(filename, 'utf8');
                let lines = data.split('\n');
                let caps = [];
                lines.forEach(line => {
                    let csvs = line.split(',');
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

let get_portfolio_value = function(portfolio, caps){
    let portfolio_value = 0;
    portfolio.weights.forEach(function(weight){
        let symbol = weight.symbol;
        let new_cap = caps.filter(function(cap){return cap.symbol === symbol;})[0]
        let pos = weight.market_cap_weight_cxy;
        if(new_cap){
            let px = new_cap.price_usd;
            portfolio_value += px * pos;
        }else{
            let px = weight.price_usd;
            portfolio_value += px * pos;
        }
    });
    return portfolio_value;
}

let calc = function(historical_caps, portfolio_size){
    simulation = [];
    historical_caps.forEach(function(cap, index, array){
        let portfolio_value = parser.PORTFOLIO_NOTIONAL;
        if(0 < index){
            // let last_cap = array[index-1];
            let last_portfolio = simulation[index-1].portfolio;
            portfolio_value = get_portfolio_value(last_portfolio, cap.market_caps);
        }
        // console.log(`Portfolio Value: ${portfolio_value}`);
        let portfolio = marketCap(
            cap.market_caps, 
            portfolio_size, 
            portfolio_value, 
            parser.FILTER_IN_ARRAY, 
            parser.FILTER_OUT_ARRAY
        );
        // cap.portfolio = portfolio;
        simulation.push({
            portfolio: portfolio,
            value: portfolio_value,
            date: cap.date,
            date_string: cap.date_string
        });
    })
    return simulation;
}

let h_caps = load();
simulations = [];
[1, 5, 10, 15, 20, 25, 30, 40, 50, 100].forEach(function(size){
    console.log(`Simulating portfolio size: ${size}`);
    let sim = calc(h_caps, size);
    console.log(`Final value: $${sim[sim.length - 1].value}`);
    simulations.push({
        simulation: sim,
        id: `MC_${size}`
    });
});

let simFile = 'data/simulations.json' 
fs.writeFile(simFile, JSON.stringify(simulations, null, 2), 'utf8', function (err) {
    if (err) {
        console.log(`Some error occured - ${simFile} either not saved or corrupted.`);
    } else{
        console.log(`Finished ${simFile}`);
    }
});