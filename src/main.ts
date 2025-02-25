import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";


import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入mock文件
// import './mock'

const app = createApp(App);

app.use(createPinia().use(piniaPluginPersistedstate));
app.use(router);

app.use(ElementPlus, { size: "large", locale: zhCn, zIndex: 3000 });

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount("#app");

/**
 * 测试环境下 引入自定义的mockRequest
 * 因为mockRequest不是默认导出的：export default{}
 * 所以引入时需要加大括号，这种可以引入多个
 */


