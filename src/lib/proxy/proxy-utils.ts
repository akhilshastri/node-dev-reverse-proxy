// const httpProxy = require('http-proxy');
const httpProxy = require('http-proxy-middleware');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
       // new winston.transports.File({ filename: 'combined.log' })
    ]
});

export const getProxyInstance = ({upstream, ...config}, events = {}) => {

    // const proxy =  httpProxy.createProxyServer({
    let options = {
        target: upstream,
        ws: true,
        changeOrigin: true,
        logLevel:'debug',
        logProvider: (provider) => logger,
        ...events
    };
    const proxyInstance = httpProxy(options);

    // if(events){
    //     Object.entries(events).forEach(([key,fun])=>{
    //         proxyInstance.on(key,fun);
    //     });
    // }

    return proxyInstance;
};