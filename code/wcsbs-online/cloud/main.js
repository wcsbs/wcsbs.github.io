const MASTER_KEY = { useMasterKey: true };

const requireAuth = user => {
  if (!user) throw new Error('User must be authenticated!');
};

Parse.Cloud.define(
  'user:signup',
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

