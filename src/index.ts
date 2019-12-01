#!/usr/bin/env node

import {run} from './lib/proxy';

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const pkg = require('../package.json');



clear();
console.log(
    chalk.red(
        figlet.textSync('upstream-cli', { horizontalLayout: 'full' })
    )
);

program
    .version(pkg.version)
    .description("HTTP proxy to connect/intercept upstream/api server")
    .option('-i, --init', 'Init Proxy Config in current folder')
    .option('-s, --start', 'Starts local server')
// option('-p, --peppers', 'Add peppers')
//     .option('-P, --pineapple', 'Add pineapple')
//     .option('-b, --bbq', 'Add bbq sauce')
//     .option('-c, --cheese <type>', 'Add the specified type of cheese [marble]')
//     .option('-C, --no-cheese', 'You do not want any cheese')

    .parse(process.argv);



// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbq) console.log('  - bbq');
// const cheese: string = true === program.cheese ? 'marble' : program.cheese || 'no';
// console.log('  - %s cheese', cheese);

console.log(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}


function start(){
    const cwd = process.cwd();
    console.log('cwd',cwd);
    const config = require(path.join(cwd,'./upstream.js'));
    // console.log(JSON.stringify(config, null, 2));
    run(config)
}

if (program.start){
    start()
}
// typecoverage
// bable/rollup
// cache ..?
// glob support for URL

// https://rushjs.io/pages/maintainer/setup_new_repo/