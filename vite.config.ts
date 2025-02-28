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
});
