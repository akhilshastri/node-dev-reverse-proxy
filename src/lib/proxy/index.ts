import {getProxyInstance} from './proxy-utils';
import express from 'express';

const modifyResponse = require('./modify-response');
const chalk = require('chalk');
const cheerio = require('cheerio');
const morgan = require('morgan');
const cookiejar = require('cookiejar');
const EventEmitter = require('events');

class ResponseEmitter extends EventEmitter {}

const app = express();
const emptyFn =()=>{};

app.use(morgan('tiny')) ;

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
                        const setCookieHeaders = proxyRes.headers['set-cookie'] || [] ;
                        const modifiedSetCookieHeaders = setCookieHeaders
                                                .map(str => new cookiejar.Cookie(str));

                        const responseEmitter = new ResponseEmitter();
                        const resp = respFn({
                            url:proxyRes.url,
                            headers:proxyRes.headers,
                            $:cheerio,
                            body: responseEmitter,
                            cookie : modifiedSetCookieHeaders
                        });
                        modifyResponse(res,proxyRes,(body)=>{
                            const respbody = {body} ;
                            responseEmitter.emit('done',respbody);
                            return respbody.body ;
                        });

                       if(resp.headers) proxyRes.headers = resp.headers;
                       if(resp.cookie)  proxyRes.headers['set-cookie'] = resp.cookie.map(cookie => cookie.toString());
                    }
                }
                )
        })

    });
    buildMiddleware(config);
    localServer(config);

} ;