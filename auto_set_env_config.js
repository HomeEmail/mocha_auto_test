const fs = require('fs-extra');
const path = require('path');
const supertest = require('supertest');
//这个文件目的是执行运行测试用例前，应该做的事情，比如获取cookie或者某些头部信息，然后设置到配置文件env.config.json里,为后面的测试用例运行提供正确到参数配置

const filePath = path.join(__dirname,'env.config.json');
const envConfig = fs.readJsonSync(filePath);


const	req = supertest(envConfig.baseUrl);

//下面到代码可根据自己到测试业务逻辑更改
//获取系统cookie并设置项目cookie配置
describe('test', function () {
  // it('set cookie config', function(done){
	// 	const _this = this;
	// 	req.get('/loginKey')
	// 		.set('Accept','application/json')
	// 		.expect('content-type',/json/)
	// 		.expect(200)
	// 		.end(function(err,res){
  //       if(err) return done(err);
  //       const cookies = res.header['set-cookie'];
  //       envConfig.cookie=cookies[0].split(';')[0];
  //       fs.writeJsonSync(filePath,envConfig);
	// 			done();
	// 		});
	// });

});
