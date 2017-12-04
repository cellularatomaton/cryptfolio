#!/usr/bin/env node
'use strict';

let config = require('./config.js');
let get = require('./http-request.js');
let mkdirp = require('./mkdirp.js');
let cheerio = require('cheerio');
let fs = require('fs');

mkdirp(config.market_cap_dir);

get('https://coinmarketcap.com/historical/', function(response, err){
    if(!err){
        let $ = cheerio.load(response);
        let paths = [];
        $(".container")
        .find(".row")
        .find(".col-lg-10")
        .find(".row")
        .find(".col-sm-4")
        .find(".list-unstyled")
        .find(".text-center")
        .find("a")
        .each(function(){
            const link = $(this);
            const text = link.text();
            const href = link.attr("href");
            console.log(text + " -> " + href);
            paths.push(href);
        });
        console.log("Crawling paths...");
        setTimeout(function(){crawlPaths(paths, 0);}, 500);
    }
});

let crawlPaths = function(paths, index){
    console.log(`Paths count: ${paths.length}, Index: ${index}`);
    if(index < paths.length){
        const path = paths[index];
        let fileDate = path.split('/')[2];
        let fileToWrite = `${config.market_cap_dir}/${fileDate}`;
        if(!fs.existsSync(fileToWrite)){
            get(`https://coinmarketcap.com${path}`, function(response, err){
                console.log("Got response...")
                let $ = cheerio.load(response);
                let dataToWrite = '';
                $("#currencies-all")
                .find("tbody")
                .find("tr")
                .each(function(){
                    const row = $(this);
                    const name = row.find(".currency-name").find(".currency-name-container").text();
                    const sym = row.find(".col-symbol").text();
                    const mc_usd = row.find(".market-cap").attr("data-usd");
                    const mc_btc = row.find(".market-cap").attr("data-btc");
                    const px_usd = row.find(".price").attr("data-usd");
                    const px_btc = row.find(".price").attr("data-btc");
                    const supply = row.find(".circulating-supply").find("a").attr("data-supply");
                    const volume_usd = row.find(".volume").attr("data-usd");
                    const volume_btc = row.find(".volume").attr("data-btc");
                    const line = `${name},${sym},${mc_usd},${mc_btc},${px_usd},${px_btc},${supply},${volume_usd},${volume_btc}\n`; 
                    // console.log(line);
                    dataToWrite += line;
                });
                
                console.log(`Writing ${fileToWrite}`);
                fs.writeFile(fileToWrite, dataToWrite.trim(), 'utf8', function (err) {
                    if (err) {
                    console.log('Some error occured - file either not saved or corrupted file saved.');
                    } else{
                        console.log(`Finished ${fileToWrite}`);
                    }
                });
                setTimeout(function(){crawlPaths(paths, index + 1)}, 250);
            });
        }else{
            console.log(`File already exists: ${fileToWrite}`);
            crawlPaths(paths, index + 1);
        }
    }
}