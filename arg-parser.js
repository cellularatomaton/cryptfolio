#!/usr/bin/env node
'use strict';

const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
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

const args = parser.parseArgs();
const FILTER_IN = args.filter_in || '';
const FILTER_OUT = args.filter_out || '';

module.exports = {    
    PORTFOLIO_SIZE : parseInt(args.size) || 25,
    PORTFOLIO_NOTIONAL : parseInt(args.notional) || 100000,
    FILTER_IN_ARRAY : FILTER_IN.length > 0 ? FILTER_IN.split(',') : [],
    FILTER_OUT_ARRAY : FILTER_OUT.length > 0 ? FILTER_OUT.split(',') : [],
    OUTPUT_FORMAT : args.output || 'cli'
  };