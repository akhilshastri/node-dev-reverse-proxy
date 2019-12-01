import {getProxyInstance} from './proxy-utils';
import express from 'express';
const chalk = require('chalk');

const app = express();

const localServer = ({local})=>{
    app.listen(local.port,(e)=>{
        if(e){
            console.log(
               `
               ${ chalk.red(e.message) }
               ${ chalk.yellow(e.stack) }
               `
            );
            return;
        }
        console.log(
            ` ${ chalk.green('localhost:' + local.port + ' is configured')}`
        );
    })
};

const buildMiddleware=({proxy})=>{
    proxy.forEach(itm=>{
        const [url,handller] = itm.mapping;
        debugger;
        app.use(
            url,
            itm.instance
        );

    })

};

export const run = (config)=>{

    config.proxy = config.proxy.map(itm=>{
        return ({
            mapping:itm,
            instance:getProxyInstance({itm,upstream:config.upstream})
        })

    });
debugger;
    buildMiddleware(config);
    localServer(config);
    console.log(config);
} ;