const webpack = require("webpack");
const config = require("../webpack.config");
const EnvEnum = require("./EnvEnum");

//全局变量
const ENVPORT = 3001;

//为webpack添加环境配置
if (process.env.NODE_ENV) config.mode = "production";

/**
 * 开发模式下使用监听
 */
if (process.env.NODE_ENV === EnvEnum.DEVELOPMENT) config.watch = true;

/**
 * 构建
 */
webpack(config, (err, stat) => {
    if (err) console.error(err);
})