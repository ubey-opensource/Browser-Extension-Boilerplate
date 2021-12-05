//#region 依赖导入
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const path = require("path");
const config = require("../webpack.config");
const EnvEnum = require("./EnvEnum");
//#endregion
//全局变量
const ENVPORT = 3001;

//#region 构建
config.mode = process.env.NODE_ENV;
if (process.env.NODE_ENV === EnvEnum.PRODUCTION) {
  // 生产模式
  webpack(config, (err, stat) => {
    if (err) console.error(err);
  });
} else {
  // 开发者模式

  // config.devtool = "inline-cheap-source-map"; // 文件映射: 打开之后在开发者工具中看到的是源码，会适当增加打包时间
  const compiler = webpack(config);
  //#region WebpackDevServer
  const server = new WebpackDevServer(
    {
      hot: true,
      static: {
        directory: path.join(__dirname, "../build"),
      },
      webSocketServer: false,
      client: {
        reconnect: false,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      compress: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },
    compiler
  );
  //#endregion
  server.start();
}
//#endregion
