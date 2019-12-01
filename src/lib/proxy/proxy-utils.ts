// const httpProxy = require('http-proxy');
const httpProxy = require('http-proxy-middleware');

export const getProxyInstance = ({upstream,...config}, events = {})=>{

  // const proxy =  httpProxy.createProxyServer({
  const proxyInstance =  httpProxy({
        target:upstream,
        ws: true,
        changeOrigin: true,
    });

  if(events){
      Object.entries(events).forEach(([key,fun])=>{
          proxyInstance.on(key,fun);
      });
  }

  return proxyInstance;
};