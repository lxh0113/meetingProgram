import { Random } from "mockjs"; // 导出随机函数

function login(req: any) {
  // req是一个请求对象，包含: url，type和body属性

  console.log(req);

  return {
    data: {
      id: 1,
      username: Random.cname(),
      account: 1,
      sex: "male",
      email: Random.email(),
      phone: Random.integer(111111, 9999999),
      avatar: Random.image(),
      likeCount: 1,
      postCount: 1,
      postIds: [1],
      meetingIds: [1],
    },
    code: 200,
    message: "登录成功",
  };
}

export default {
  login,
};
