const shell = require('shelljs');
const path = require('path');
//此文件都目的是运行测试用例
let projectDir = __dirname;
let testDir = path.join(projectDir, 'test');
//console.log('testDir', testDir);
shell.cd(projectDir);
main();
function main() {
  //下面的代码根据自己都测试逻辑业务进行调整，先运行什么，再运行什么
  //先执行获取并设置cookie配置
  let autoSetEnvConfig = path.join(projectDir, 'auto_set_env_config.js');
  let command1 = 'npx mocha ' + autoSetEnvConfig + ' --timeout 25000 --colors';
  const shellString1 = shell.exec(command1);
  console.log('Exit code:', shellString1.code); //0没错，1有错
  console.log('command output:', shellString1.stdout);
  console.log('command stderr:', shellString1.stderr);
  if (shellString1.code) {
    return 0;
  }
  console.log('------------------------------------------------------------------------------------');

  //运行全部测试用例
  let command = 'npx mocha ' + testDir + ' --timeout 25000 --colors --reporter mochawesome';
  const shellString = shell.exec(command);
  console.log('Exit code:', shellString.code);
  console.log('command output:', shellString.stdout);
  console.log('command stderr:', shellString.stderr);
}