/* eslint-disable no-undef */
const MASTER_KEY = { useMasterKey: true };

Parse.Cloud.define(
  "user:signup",
  async ({ params: { name, email, password, phone } }) => {
    return new Parse.User({
      name,
      email,
      password,
      username: email,
      phone
    }).save(MASTER_KEY);
  }
);

Parse.Cloud.define("user:getRoles", async ({ user }) => {
  var userRoleQuery = new Parse.Query(Parse.Role);
  userRoleQuery.equalTo("users", user);
  const roles = await userRoleQuery.find(MASTER_KEY);

  user = {
    username: user.get("name"),
    phone: user.get("phone"),
    email: user.get("email"),
    roles: roles.map(r => r.get("name"))
  };
  return user;
});
