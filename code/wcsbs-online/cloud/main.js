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

Parse.Cloud.define("user:login", async ({ params: { username, password } }) => {
  const loggedInUser = await Parse.User.logIn(username, password);
  // const userRoleQuery = loggedInUser.relation(Parse.Role).query();
  var userRoleQuery = new Parse.Query(Parse.Role);
  userRoleQuery.equalTo("users", loggedInUser);
  const roles = await userRoleQuery.find(MASTER_KEY);

  const user = {
    id: loggedInUser.id,
    username: loggedInUser.get("name"),
    phone: loggedInUser.get("phone"),
    email: loggedInUser.get("email"),
    roles: roles.map(r => r.get("name"))
  };
  return user;
});
