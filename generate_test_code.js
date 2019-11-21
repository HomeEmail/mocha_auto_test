const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const {parse_swagger2} = require('./parse_swagger2.js');

const envConfigFilePath = path.join(__dirname,'env.config.json');
const envConfig = fs.readJsonSync(envConfigFilePath);

function getTestCodeItem(params){
  let obj = {
    tag:'',
    url:'/api/demo',
    method:'get',
    reqAccept:'application/json', //application/x-www-form-urlencoded
    resContentType:'\\*\\/\\*',
    query:{},//for get method
    data:{},//for post method
    summary:'接口名称',
    status:200,
    ...params,
  };
  if(obj.resContentType=='*/*'){
    //obj.resContentType='\\*\\/\\*';
    obj.resContentType=null;
  }
  return `
  it('should return a ${obj.status} response', function (done) {
    const _this = this;
    addContext(_this,'${obj.summary}');
		customReq.${obj.method}('${obj.url}')
      .set('Accept', '${obj.reqAccept}')
      ${obj.reqAccept=='application/x-www-form-urlencoded'?`.type('form')`:``}
      .query(${JSON.stringify(obj.query)})
			.send(${JSON.stringify(obj.data)})
      ${obj.resContentType ? `.expect('content-type',/${obj.resContentType}/)`:``}
			.expect(${obj.status})
			.end(function (err, res) {
				addContext(_this, { //将接口返回的数据显示在报告上
					title: 'output',
					value: {body:res.body,res},
				});
				if (err) return done(err);
				console.log('output std:',res.error,res.body);
        //这里完善测试代码 例如：expect(res.body.code).to.equal(1);
        //...
				done();
			});
	});
  `;
};
function generateCode(param){
  let obj={
    tag:'test',
    ...param,
  };
  let codeItems=[];
  codeItems.push(getTestCodeItem(obj));
let code = `
const should = require('chai').should(),
  expect = require('chai').expect,
  supertest = require('supertest');
const addContext = require('mochawesome/addContext');
const faker = require('faker');
//设置语言环境
faker.locale='zh_CN'; //en

const {cookie,baseUrl,customReq} = require('../common.js');
//customReq 自定义封装的请求，如把常用的cookie设置封装进去，不用每个请求都设置cookie

const	req = supertest(baseUrl);

describe('${obj.method.toUpperCase()} ${obj.url}', function () {

  before(function (done) {
    done();
  });
  
  ${codeItems.join('')}

});
`;
  return code;
}

/**
 *
 *
 * @param {*} [ary=[]] 从swagger json文件提取的api对象数组
 * @param {boolean} [force=false] 是否强制覆盖同名文件
 */
function createCodeFiles(ary=[],force=false){
  for(let i=0,len=ary.length;i<len;i++){
    let filename = ary[i].url.replace(/\//ig,'_');
    filename=filename.replace(/^_/,'');
    filename=filename+'_test.js';
    let filePath = path.join(__dirname,'test',filename);
    if(!force&&fs.pathExistsSync(filePath)){
      break;
    }
    fs.outputFileSync(filePath,generateCode(ary[i]),{encoding:'utf8'});
  }
}


function requestSync(method='GET', url) {
  return new Promise(function (resolve, reject) {
    var options = {
      method: method||'GET',
      url: url,
    };
    request(options, function (error, response, body) {
      if (error) reject(error);;
      resolve(body);
    });
  });
};

async function getApiObj(){
  //const url = 'http://10.117.156.177:13000/unicomInterface/v2/api-docs';
  const url = envConfig.apiJsonUrl;
  if(!url){
    throw new Error('need a swagger api json url');
    return 0;
  }
  const result = await requestSync('GET',url);
  const obj = JSON.parse(result);
  // console.log(obj);
  return obj;
}
async function handleObj(rewriteConfig=true){
  const obj = await getApiObj();
  if(obj.swagger.indexOf('2.')<=-1){
    throw new Error('only support swagger api 2.0');
    return 0;
  }
  let baseUrl = obj.host+obj.basePath;
  if(obj.host.indexOf('http')<=-1){
    baseUrl='http://'+baseUrl;
  }
  if(rewriteConfig){
    envConfig.baseUrl = baseUrl;
    fs.writeJsonSync(envConfigFilePath,envConfig);//重写配置文件baseUrl
  }
  //console.log(baseUrl);
  const apis = parse_swagger2(obj);
  //console.log(apis);
  return apis;
}

async function main(){
  const apis= await handleObj(true);//ture 重写配置文件的baseUrl配置
  createCodeFiles(apis,true);//false 同名文件不会覆盖
}
main();