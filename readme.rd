## 使用mocha、chai和supertest做api测试
1. 把clone下来的测试项目根文件夹改成你自己的项目命名：如mocha_test
1. 命令行控制台 `cd` 到mocha_test目录
1. 执行`npm run generate`将会生成test文件夹以及测试文件（注意再次执行此命令，不会覆盖以存在的同名文件）
1. 编写`test`目录里的测试文件js代码，完善测试用例
1. 命令行控制台 `cd` 到mocha_test目录
执行
npm run start
将自动跑run.js的测试命令

执行测试命令，自动跑test文件夹下的测试文件js
npx mocha --timeout 25000 --colors
加上报告输出，默认输出到/mocha_test/mochawesome-report/mochawesome.html
npx mocha --timeout 25000 --colors --reporter mochawesome
指定运行的测试文件js
npx mocha ./test/user_test.js --timeout 25000 --colors --reporter mochawesome
指定报告输出路径
mocha test.js --reporter mochawesome --reporter-options reportDir=customReportDir,reportFilename=customReportFilename

#### 使用faker生成模拟数据  
