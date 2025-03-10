import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: () => import("../views/login/index.vue"),
    },
    {
      path: "/register",
      component: () => import("../views/register/index.vue"),
    },
    {
      path:"/jisit/:id",
      component:()=>import("../views/jisit/index.vue")
    },
    {
      path:"/map",
      component:()=>import("../views/components/Map.vue")
    },
    {
      path: "/back",
      component: () => import("../views/back/index.vue"),
      redirect:"/back/user",
      children: [
        {
          path: "user",
          component: () => import("../views/back/user/index.vue"),
        },
        {
          path: "meeting",
          component: () => import("../views/back/meeting/index.vue"),
        },
        {
          path: "badwords",
          component: () => import("../views/back/badwords/index.vue"),
        },
        {
          path: "forum",
          component: () => import("../views/back/forum/index.vue"),
        },
      ],
    },
    {
      path: "/",
      component: () => import("../views/home/index.vue"),
      redirect: "/home",
      children: [
        {
          path: "home",
          component: () => import("../views/workBench/index.vue"),
        },
        {
          path: "forum",
          children: [
            {
              path: "",
              component: () => import("../views/forum/index.vue"),
            },
            {
              path: "publish",
              component: () =>
                import("../views/forum/components/publishForum.vue"),
            },
            {
              path: "rank",
              component: () => import("../views/forum/components/Rank.vue") },
            {
              path: "publish/:id",
              component: () =>
                import("../views/forum/components/publishForum.vue"),
            },
            {
              path: ":id",
              component: () =>
                import("../views/forum/components/viewForum.vue"),
            },
            {
              path: "my",
              component: () => import("../views/forum/my/index.vue"),
            },
          ],
        },
        {
          path: "ai",
          component: () => import("../views/AI/index.vue"),
        },
        {
          path: "message",
          component: () => import("../views/message/index.vue"),
        },
        {
          path: "user",
          component: () => import("../views/user/index.vue"),
        },
      ],
    },
  ],
});

export default router;
