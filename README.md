# 浏览器插件的一个快速开发模板

你可以使用 **npm install或者yarn** 安装需要的以来程序

这个模板是基于vue3.0的

**assets** 是静态目录,会将里面的内容直接拷贝到build目录下

**resource** 内的资源会经过webpack打包整合到build/assets下

导入文件时 **pageView与resource**目录下所有子目录都可以使用 **@目录名** 来引用

```javascript
// 我要引入popup下面的App.vue
import App from "@popup/App"

//或者我要引入iconfont.css
import "@fonts/iconfont/iconfont.css"
```

