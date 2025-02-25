import Mock from "mockjs";

import user from "./modules/user";

Mock.setup({
  timeout: "200-2000",
});

const { mock } = Mock; // Mock函数

mock(RegExp("/mock/users/login" + ".*"), "get", user.login);
