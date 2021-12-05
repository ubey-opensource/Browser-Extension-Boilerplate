//#region 依赖导入
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader").VueLoaderPlugin;
const friendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
//#endregion

//#region webpack打包逻辑
/**
 * 获取所有需要webpack构建的js文件
 * src/page与content根下默认所有js文件都进行bundle,子文件下不会
 * @returns {{Object}} webpack entry 对应的对象
 */
function getEntryObject() {
  let entry = {};
  //获取src/page根下所有的js文件
  const pageDirPath = path.resolve(__Project, "page");
  const contentDirPath = path.resolve(__Project, "content");
  const pageFiles = getFilesOrFolders(pageDirPath, true);
  const contentFiles = getFilesOrFolders(contentDirPath, true);

  //遍历 获取到的文件数组,转换成对象格式
  pageFiles.forEach((item) => {
    let pageFileMatch = item.match(/(.*?)\.js/);
    if (pageFileMatch)
      entry[pageFileMatch[1]] = path.resolve(pageDirPath, item);
  });
  contentFiles.forEach((item) => {
    let pageFileMatch = item.match(/(.*?)\.js/);
    if (pageFileMatch)
      entry[`content-${pageFileMatch[1]}`] = path.resolve(contentDirPath, item);
  });
  console.log(entry);
  return entry;
}

/**
 * 将入口文件传入 并产出所有html-webpack-plugin 的配置项
 * @param entry options.entry 入口文件
 * @returns {HtmlWebpackPlugin[]} html-webpack-plugin 组成的数组
 */
function addHtmlforjs(entry) {
  return [].concat(
    Object.keys(entry)
      //排除content.js
      .filter((item) => item !== "background" && !/^content/.test(item))
      .map(
        (item) =>
          new HtmlWebpackPlugin({
            template: path.resolve(__Project, "index.html"),
            filename: `${item}/${item}.html`,
            chunks: [item],
          })
      )
  );
}

/**
 *
 * @param {string} folderPath 要获取的文件夹的路径
 * @param {boolean} getFile 是否是要获取所有文件 true 获取所有文件 false 获取所有文件夹
 * @returns {string[]}
 */
function getFilesOrFolders(folderPath, getFile) {
  return fs.readdirSync(folderPath).filter((item) => {
    const fileOrFolderPath = path.resolve(folderPath, item);
    const stat = fs.statSync(fileOrFolderPath);
    return getFile ? stat.isFile() : stat.isDirectory();
  });
}

/**
 * @callback {callback = (value: string, index: number, array: string[]) => boolean}
 * @param {string} folderPath 需要添加别名的文件夹[会给所有子文件夹加上别名,本身并不会加]
 * @param {callback=} filter 过滤
 */
function addAlias(folderPath, filter) {
  const tmp = {};
  let folders = getFilesOrFolders(folderPath, false);
  if (folders && folders.length > 0) {
    folders.filter(filter || (() => true)).forEach((item) => {
      tmp[`@${item}`] = path.resolve(folderPath, item);
    });
  }
  return tmp;
}

/**
 *
 * @param {string} suff
 * @returns {string}
 */
function outputfileName(suff) {
  return (pathData) => {
    let path = `[name]/[name].${suff}`;
    if (pathData.chunk.name === "background") path = `[name].${suff}`;
    else if (/^content/.test(pathData.chunk.name))
      path = `content/${pathData.chunk.name.replace(/^content-/, "")}.${suff}`;
    return path;
  };
}
//#endregion

//#region 基础变量设置
//项目目录
const __Project = path.resolve(__dirname, "src");

/**
 * 路径别名
 */
const alias = {
  "@": __Project,
};

/**
 * Module.Rules
 */
const rules = [
  //vue文件
  {
    test: /\.vue$/,
    loader: "vue-loader",
    exclude: /node_modules/,
  },

  // css文件

  {
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, "css-loader"],
    exclude: /node_modules/,
  },

  //scss文件

  {
    test: /\.s[ac]ss$/i,
    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
    exclude: /node_modules/,
  },

  // 图片文件
  {
    test: /\.(png|jpg|gif|svg)$/,
    use: {
      loader: "url-loader",
      options: {
        limit: 20 * 1024,
        esModule: false,
        name: "assets/images/[hash:10].[ext]",
      },
    },
    exclude: /(node_modules|icon)/,
  },

  // html文件

  {
    test: /\.html$/,
    loader: "html-loader",
    options: {
      esModule: false,
    },
    exclude: /node_modules/,
  },

  // js文件

  {
    test: /\.js$/,
    use: {
      loader: "babel-loader",
    },
    exclude: /node_modules/,
  },

  // 字体文件

  {
    test: /\.(ttf|woff|woff2)$/,
    use: {
      loader: "url-loader",
      options: {
        limit: 20 * 1024,
        esModule: false,
        name: "assets/fonts/[name].[hash:10].[ext]",
      },
    },
    exclude: /node_modules/,
  },
];

//#endregion

/**
 * webpack 插件
 * @type {Object[]}
 */
const options = {
  entry: getEntryObject(),
  devtool: false,
  output: {
    path: path.resolve(__dirname, "build"),
    filename: outputfileName("js"),
  },
  module: {
    rules: rules,
  },
  resolve: {
    alias: alias,
    extensions: [".js", ".vue", ".scss"],
  },
  plugins: [
    // 清理打包出来的文件夹
    new CleanWebpackPlugin(),
    // 打包时显示进度
    new webpack.ProgressPlugin(),
    new friendlyErrorsWebpackPlugin(),
    //拷贝静态资源
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/_locales",
          to: "./_locales",
        },
        {
          from: "src/manifest.json",
          to: "./manifest.json",
        },
        {
          from: "src/assets/",
          to: "./assets",
        },
      ],
    }), // 拷贝静态资源
    new VueLoaderPlugin(),
    // 提取scss或者vue中的样式到单独的文件
    new MiniCssExtractPlugin({
      filename: outputfileName("css"),
    }),
    //全局注入jQuery
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
    }),
  ],
};

//#region options补充
/**
 * 为所有需要打包出来的js文件添加一个html文件
 */
options.plugins = options.plugins.concat(addHtmlforjs(options.entry));

/**
 * 文件夹路径别名
 * @type {{"@": string}}
 */
options.resolve.alias = {
  ...options.resolve.alias,
  ...addAlias(path.resolve(__Project, "resource")),
  ...addAlias(path.resolve(__Project, "pageView")),
};
//#endregion

module.exports = options;
