import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// import veauryVitePlugins from 'veaury/vite/index.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: "sass" })],
      imports: ["vue", "vue-router"],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: "sass" })],
    }),
    // veauryVitePlugins({
    //   type: 'vue',
    //   // @vitejs/plugin-vue的配置项
    //   // vueOptions: {...},
    //   // @vitejs/plugin-react的配置项
    //   // reactOptions: {...}, 
    //   // @vitejs/plugin-vue-jsx的配置项
    //   // vueJsxOptions: {...}
    // })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ` @use "@/styles/theme.scss" as *;
            @use "@/styles/element/index.scss" as *;
          `,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 字符串简写写法：http://localhost:5173/oauth -> https://aip.baidubce.com/oauth
      "/open/api/v2": "https://www.das-ai.com",
      "/dasChat": "https://www.das-ai.com/dasChat",
       "/oauth": "https://aip.baidubce.com",
       "/text2audio": "https://tsn.baidu.com",
       "/server_api": "http://vop.baidu.com",
      // "/rag": {
      //   target:"http://10.251.39.158:8000/",
      //   rewrite:(path)=>path.replace(/^\/rag/, "")
      // }
    },
  },
});
