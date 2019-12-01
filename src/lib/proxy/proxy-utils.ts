// const httpProxy = require('http-proxy');
const httpProxy = require('http-proxy-middleware');
const winston = require('winston');


export const getProxyInstance = ({upstream, ...config}, events = {}) => {

    // const proxy =  httpProxy.createProxyServer({
    let options = {
        target: upstream,
        ws: true,
        changeOrigin: true,

        logProvider: (provider) => winston,
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