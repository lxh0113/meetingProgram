import { type NavList } from "../types/home.d";

const userNavList: NavList = [
  { path: "/home", icon: "iconfont icon-list", text: "工作台" },
  { path: "/forum", icon: "iconfont icon-forum", text: "论坛" },
  { path: "/ai", icon: "iconfont icon-Ai", text: "智会精灵" },
  { path: "/message", icon: "iconfont icon-message", text: "消息中心" },
  { path: "/user", icon: "iconfont icon-information", text: "个人中心" },
];

const adminNavList: NavList = [
  { path: "/back/user", icon: "iconfont icon-user", text: "用户管理" },
  { path: "/back/meeting", icon: "iconfont icon-meeting", text: "会议管理" },
  { path: "/back/badwords", icon: "iconfont icon-error", text: "违禁词管理" },
  { path: "/back/forum", icon: "iconfont icon-forum", text: "论坛管理" }
];

export const getNavList = (identity: number): NavList => {
  if (identity === 1) return userNavList;
  else if (identity === 2) return adminNavList;
  else return [];
};
