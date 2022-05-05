#!/usr/bin/env node

import fs from "fs";
import createIndexTemplate from "./createIndexTemplate.js";
import createDbTemplate from "./createDbTemplate.js";
import createPackagejson from "./createPackagejson.js";
import { execa } from "execa";
import chalk from "chalk";

// inquirer 用户交互
import inquirer from "inquirer";
//这里使用了esm模块支持顶层await 如果不支持的话就用立即执行函数async
const r = await inquirer.prompt([
  /* Pass your questions in here */
  {
    type: "input",
    name: "packageName",
    message: "set package name",
    validate(val) {
      //校验
      if (val) return true;
      return "Please enter package name";
    },
  },
  {
    type: "input",
    name: "port",
    default() {
      return 8080;
    },
    message: "set port number",
  },
  {
    type: "checkbox",
    name: "middleware",
    choices: [
      { name: "jwt", checked: true },
      { name: "mongodb", disabled: true },
    ],
  },
]);
// 用户输入
const inputConfig = {
  packageName: r.packageName,
  port: r.port || 8080,
  middleware: {
    jwt: r.middleware.includes("jwt"),
  },
};

//把根路径抽离一下
function getRootPath() {
  return `./${inputConfig.packageName}`;
}

//先删除文件夹
fs.rmSync(
  `./${getRootPath()}`,
  {
    recursive: true,
    force: true,
  },
  (err) => {
    console.log(err.message);
  }
);



// 创建文件夹 hei
console.log(chalk.gray(`create ${getRootPath()} file`));
fs.mkdirSync(getRootPath());



// 创建入口文件index.js和数据库文件                   //传入用户输入的数据
console.log(chalk.gray(`create ${getRootPath()}/index.js`));
console.log(chalk.gray(`create ${getRootPath()}/db.js`));
fs.writeFileSync(`${getRootPath()}/index.js`, createIndexTemplate(inputConfig.middleware.jwt, inputConfig.port));
fs.writeFileSync(`${getRootPath()}/db.js`, createDbTemplate());



// 创建package.json
console.log(chalk.gray(`create ${getRootPath()}/package.json`));
fs.writeFileSync(
  `${getRootPath()}/package.json`,
  createPackagejson(inputConfig.middleware.jwt, inputConfig.packageName)
);



// 4. 安装依赖
console.log(chalk.gray(`Install dependencies ...`));

await execa("npm i", {
  //设置执行路径
  cwd: getRootPath(),
  //执行的时候有个输出
  stdio: [2, 2, 2],
});
console.log(chalk.gray(`Install over`));
console.log(chalk.gray(`cd ${getRootPath()}`));
console.log(chalk.gray(`node index.js`));
console.log(chalk.gray(`open the`), chalk.red(`http://localhost:${inputConfig.port}/ \n`));

