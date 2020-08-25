/* eslint-disable no-undef */
const MASTER_KEY = { useMasterKey: true };

const requireAuth = user => {
  if (!user) throw new Error("User must be authenticated!");
};

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
    id: user.id,
    name: user.get("name"),
    username: user.get("username"),
    phone: user.get("phone"),
    email: user.get("email"),
    roles: roles.map(r => r.get("name"))
  };
  return user;
});

Parse.Cloud.define("user:list", async ({ user }) => {
  requireAuth(user);
  var userQuery = new Parse.Query(Parse.User);
  userQuery.ascending("name");
  const results = await userQuery.find(MASTER_KEY);
  const usersCount = results.length;
  const users = results.map(user => {
    return {
      id: user.id,
      name: user.get("name"),
      username: user.get("username"),
      phone: user.get("phone"),
      email: user.get("email")
    };
  });
  return { users, usersCount };
});

Parse.Cloud.define("user:adminFetchUser", async ({ params: { userSlug } }) => {
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", userSlug);
  var user = await userQuery.first(MASTER_KEY);

  var userRoleQuery = new Parse.Query(Parse.Role);
  userRoleQuery.equalTo("users", user);
  const roles = await userRoleQuery.find(MASTER_KEY);

  user = {
    id: user.id,
    name: user.get("name"),
    username: user.get("username"),
    phone: user.get("phone"),
    email: user.get("email"),
    roles: roles.map(r => r.get("name"))
  };
  return user;
});

Parse.Cloud.define("user:adminUpdateUser", async ({ params: { user } }) => {
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", user.id);
  var parseUser = await userQuery.first(MASTER_KEY);

  parseUser.set("name", user.name);
  parseUser.set("phone", user.phone);
  if (user.password) {
    parseUser.set("password", user.password);
  }
  user = await parseUser.save(null, MASTER_KEY);

  var userRoleQuery = new Parse.Query(Parse.Role);
  userRoleQuery.equalTo("users", user);
  const roles = await userRoleQuery.find(MASTER_KEY);

  user = {
    id: user.id,
    name: user.get("name"),
    username: user.get("username"),
    phone: user.get("phone"),
    email: user.get("email"),
    roles: roles.map(r => r.get("name"))
  };
  return user;
});
