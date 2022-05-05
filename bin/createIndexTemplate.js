import ejs from "ejs";
import fs from "fs";
import path from "path"
import { fileURLToPath } from "url";

//因为用的esm 所以没有__dirname 只能自己造
// 然后使用path.resolve() 方法将路径或路径片段的序列解析为绝对路径。
const __dirname = fileURLToPath(import.meta.url);

// 传一个jwt一个端口号 默认开启jwt 端口8080
export default (jwt = true, port = 8080) => {
  //把ejs内容拿过来
  const Template = fs.readFileSync(path.resolve(__dirname, "../template/index.ejs"));

  //这里需要变为字符串
  const code = ejs.render(Template.toString(), { jwt, port });

  return code;
};
