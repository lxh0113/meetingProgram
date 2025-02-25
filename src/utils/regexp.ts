export const emailRegexp = RegExp(
  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
);

export const phoneRegexp = RegExp(
  /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])d{8}$/
);

//   至少包含字母、数字、特殊字符，8-20位
export const passwordRegexp = RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
);

export const captchaRegexp = RegExp(/^d{6}$/);
