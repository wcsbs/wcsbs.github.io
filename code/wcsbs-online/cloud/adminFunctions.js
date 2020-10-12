/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const MASTER_KEY = { useMasterKey: true };
const MAX_QUERY_COUNT = 3000;
const logger = require("parse-server").logger;

const requireAuth = user => {
  if (!user) throw new Error("User must be authenticated!");
  Parse.Cloud.useMasterKey();
};

const requireRole = (userWithRoles, role) => {
  if (!userWithRoles) throw new Error("User must be authenticated!");
  if (!userWithRoles.roles.includes(role)) {
    throw new Error(`User must be ${role}!`);
  }
};

Parse.Cloud.define(
  "admin:upgradeClassSessionToV2",
  async ({ user, params: { user: userWithRoles } }) => {
    requireAuth(user);
    requireRole(userWithRoles, "B4aAdminUser");

    var query = new Parse.Query("ClassSession");
    query.descending("scheduledAt");
    var allSessions = await query.limit(MAX_QUERY_COUNT).find();
    var allV2Sessions = [];
    for (var i = 0; i < allSessions.length; i++) {
      const session = allSessions[i];
      if (!session.get("scheduledAt")) {
        break;
      }

      var sessionV2 = new Parse.Object("ClassSessionV2");
      sessionV2.set("name", session.get("name"));
      sessionV2.set("description", session.get("description"));
      sessionV2.set("scheduledAt", session.get("scheduledAt"));

      query = new Parse.Query("Submodule");
      query.equalTo("url", session.get("url"));
      var submodule = await query.first();

      const content = { modules: [] };
      if (submodule) {
        content.modules.push(submodule.id);
      }
      sessionV2.set("content", content);

      // sessionV2 = await sessionV2.save(null, MASTER_KEY);
      logger.info(
        `upgradeClassSessionToV2 - sessionV2: ${JSON.stringify(sessionV2)}`
      );

      allV2Sessions.push(sessionV2);
    }

    return { allV2Sessions };
  }
);
