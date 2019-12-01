import {getProxyInstance} from './proxy-utils';
import express from 'express';
const chalk = require('chalk');

const app = express();
const emptyFn =()=>{};

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
        // const  = itm.mapping;
        debugger;
        app.use(
            itm.url,
            itm.instance
        );

    })

};

export const run = (config)=>{

    config.proxy = config.proxy.map(itm=>{
        const [url,handller] = itm;
        let respFn = typeof handller === "function" ? handller : (handller.resp||emptyFn) ;
        return ({
            url,
            instance:getProxyInstance({itm,upstream:config.upstream},
                {
                    onProxyRes:(proxyRes, req, res)=>{
                        // proxyRes.headers['x-added'] = 'foobar';
                       const resp = respFn({
                            url:proxyRes.url,
                            headers:proxyRes.headers
                       });

                       if(resp.headers)   proxyRes.headers = resp.headers;
                    },
                    logLevel:'debug',
                }
                )
        })

    });
    buildMiddleware(config);
    localServer(config);

} ;