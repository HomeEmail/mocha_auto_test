const	supertest = require('supertest');
const fs = require('fs-extra');
const path = require('path');
//这个文件的代码，目的是为了导出常用配置和结合env.config.json文件设置配置信息

const envConfig = fs.readJsonSync(path.join(__dirname,'env.config.json'));
const baseUrl = envConfig.baseUrl||'';
const cookie = envConfig.cookie||'';//多个cookie=['nameOne=valueOne;nameTwo=valueTwo']
//bb = ss.replace(/kie.=..*;/,'aa'); //可以替换

exports.baseUrl = baseUrl;
exports.cookie = cookie;

//可以在下面的代码里设置每个请求都需要都头部信息，对应都配置文件是env.config.json
exports.customReq={
  get:function(url){
    return supertest(baseUrl).get(url).set('Cookie',cookie);
  },
  post:function(url){
    return supertest(baseUrl).post(url).set('Cookie',cookie);
  },
  put:function(url){
    return supertest(baseUrl).put(url).set('Cookie',cookie);
  },
  del:function(url){
    return supertest(baseUrl).del(url).set('Cookie',cookie);
  },
  patch:function(url){
    return supertest(baseUrl).patch(url).set('Cookie',cookie);
  },
  head:function(url){
    return supertest(baseUrl).head(url).set('Cookie',cookie);
  },
  
  
};