# 基于nodejs的api自动测试技术方案
api测试，方案很多，比如用postman，这里介绍一种基于nodejs的测试方案。此方案测试人员可以用，开发者也可以用来做单元测试。此方案需要写点代码，基本上有过编程语言基础都测试人员都能掌握。
## 方案流程概括
1. 下载工程代码
2. 改配置文件
3. 执行脚步生成测试用例代码文件
4. 改写完善测试用例
5. 执行运行测试脚步
6. 等一会，自动生成了测试报告，完毕
7. 其他：可以把工程放到git上，配置jenkins执行脚本，可以做到自动测试

## mocha、chai和supertest的介绍
- mocha
- chai
- supertest
- 介绍 https://webfem.com/post/mocha-test

技术文档参考：

- http请求库supertest http://visionmedia.github.io/superagent/#get-requests
- 断言库chai https://blog.csdn.net/riddle1981/article/details/87360624
- 测试框架mocha https://mochajs.cn/
- 模拟数据生成库faker https://github.com/FotoVerite/Faker.js

## 使用步骤
### clone测试工程代码
1. 从github下载测试样例工程代码到本地电脑,下载地址：`https://github.com/HomeEmail/mocha_auto_test`
    
2. git命令下载
```
git clone https://github.com/HomeEmail/mocha_auto_test.git
```
### 项目文件组织介绍
```
|-- mocha_auto_test
    |-- .DS_Store
    |-- .gitignore
    |-- auto_set_env_config.js      //执行运行测试用例前，应该做的事情
    |-- common.js                   //导出公共变量或方法
    |-- env.config.json             //配置文件
    |-- generate_test_code.js       //这个文件目的是生成测试用例代码文件
    |-- package-lock.json
    |-- package.json
    |-- parse_swagger2.js           //这个文件目的是解析swagger api的json对象，返回自定义的格式数组
    |-- readme.rd
    |-- run.js                      //此文件都目的是运行测试用例
    |-- test                        //此文件夹下放测试用例文件(自动生成或者手动添加)
```
- `auto_set_env_config.js `     这个文件目的是执行运行测试用例前，应该做的事情，比如获取cookie或者某些头部信息，然后设置到配置文件env.config.json里,为后面的测试用例运行提供正确到参数配置
- `common.js` 这个文件的代码，目的是为了导出常用配置和结合env.config.json文件设置配置信息
- `env.config.json` 配置文件(有如下字段，apiJsonUrl：swagger api json对象的请求地址；baseUrl：测试api的路径前缀，generate_test_code.js文件会改变此字段值;cookie:请求的头部cookie,多个cookie设置例如['nameOne=valueOne;nameTwo=valueTwo']，auto_set_env_config.js文件会改变此字段值;如有其他配置字段请自行添加)


### 详细操作步骤
1. 把clone下来的测试项目根文件夹改成你自己的项目命名：如mocha_test
1. 修改配置文件`env.config.json`,将字段`apiJsonUrl`设置为你的swagger api 路径，例如：`http://xx/xx/v2/api-docs`;注意：目前只支持2.0的规范;此字段为的是下面自动生成测试用例文件而配置。如果不需要这一步，可以直接在test文件夹里添加测试用例文件，例如：`xx_test.js`
1. 命令行控制台 `cd` 到mocha_test目录
1. 执行`npm run generate`将会生成test文件夹以及测试文件，一个api路径生成一个测试用例文件（注意再次执行此命令，不会覆盖以存在的同名文件）；如你不需要自动生成测试用例文件，可忽略这一步
1. 新增或修改`test`目录里的测试文件js，完善测试用例代码；可以使用faker生成模拟数据，方便测试验证
1. 检查配置文件`env.config.json`里的字段baseUrl是否正确，此字段是测试api的路径前缀;检查其他配置信息，比如共用的请求头部等等
1. 命令行控制台 `cd` 到mocha_test目录
1. 执行`npm run start` 将自动跑run.js的测试命令

### 其他命令示例
- 执行测试命令，自动跑test文件夹下的测试文件js
```
npx mocha --timeout 25000 --colors
```
- 加上报告输出，默认输出到`/项目根目录/mochawesome-report/mochawesome.html`
```
npx mocha --timeout 25000 --colors --reporter mochawesome
```
- 指定运行的测试文件js
```
npx mocha ./test/user_test.js --timeout 25000 --colors --reporter mochawesome
```
- 指定报告输出路径
```
mocha test.js --reporter mochawesome --reporter-options reportDir=customReportDir,reportFilename=customReportFilename
```

## 配置jenkins
参考通用的jenkins项目配置；
配置jenkins执行脚本,未完待续...
```
npx mocha --timeout 25000 --colors --reporter mochawesome
```

