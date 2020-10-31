/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const MASTER_KEY = { useMasterKey: true };
const MAX_QUERY_COUNT = 3000;
const logger = require("parse-server").logger;
const commonFunctions = require("./commonFunctions.js");

const requireAuth = commonFunctions.requireAuth;
const requireRole = commonFunctions.requireRole;

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
      const url = session.get("url");
      query.equalTo("url", url);
      var submodule = await query.first();

      const content = { submodules: [] };
      if (submodule) {
        content.submodules.push(submodule.id);

        if (url.includes("dymqx")) {
          const description = session.get("description");

          if (description && description.length > 0) {
            const match = description.match(/(\d+)/);
            if (match) {
              const index = parseInt(match[0]);
              query = new Parse.Query("Submodule");
              query.equalTo("index", index);
              query.equalTo("moduleId", submodule.get("moduleId"));
              submodule = await query.first();
              content.submodules.push(submodule.id);
              logger.info(
                `upgradeClassSessionToV2 - content: ${JSON.stringify(content)}`
              );
            }
          }
        }
      }
      sessionV2.set("content", content);

      sessionV2 = await sessionV2.save(null, MASTER_KEY);

      allV2Sessions.push(sessionV2);
    }

    return { count: allV2Sessions.length };
  }
);

Parse.Cloud.define(
  "admin:updateClassSessionV2",
  async ({ user, params: { user: userWithRoles } }) => {
    requireAuth(user);
    requireRole(userWithRoles, "B4aAdminUser");

    var query = new Parse.Query("ClassSessionV2");
    query.descending("scheduledAt");
    var allSessions = await query.limit(MAX_QUERY_COUNT).find();
    var updatedSessions = [];

    for (var i = 0; i < allSessions.length; i++) {
      const session = allSessions[i];
      var content = session.get("content");
      if (content.submodules.length == 1) {
        continue;
      }

      const description = session.get("description");
      if (description && description.length > 0) {
        const match = description.match(/(\d+)/);
        if (match) {
          const index = parseInt(match[0]);
          query = new Parse.Query("Submodule");
          query.equalTo("index", index);
          query.equalTo("moduleId", "ZwfTADbqUK");
          submodule = await query.first();
          content.submodules[1] = submodule.id;
        }
        session.set("content", content);

        const sessionV2 = await session.save(null, MASTER_KEY);
        updatedSessions.push(sessionV2);
      }
    }

    return { count: updatedSessions.length, allV2Sessions: updatedSessions };
  }
);

Parse.Cloud.define(
  "admin:importCsv",
  async ({
    user,
    params: { user: userWithRoles, classId, practiceId, csv }
  }) => {
    requireAuth(user);
    requireRole(userWithRoles, "B4aAdminUser");

    var query = new Parse.Query("Class");
    query.equalTo("objectId", classId);
    var parseClass = await query.first();

    const csvHeader = [];
    for (var key in csv[0]) {
      csvHeader.push(key);
    }
    var mapDates = commonFunctions.getDatesFromCsvHeader(
      csvHeader,
      parseClass.get("url").includes("rpsxl"),
      practiceId,
      2020
    );

    var teams = [];
    var users = [];
    var results = [];

    for (var i = 0; i < csv.length; i++) {
      const record = csv[i];
      var name = record["组员"];
      if (!name || name.length == 0) {
        continue;
      }
      const index = parseInt(record["组别"]);
      name = name.replace("组长", "");
      query = new Parse.Query(Parse.User);
      query.equalTo("name", name);

      var parseUser = await query.first();
      if (!parseUser) {
        parseUser = new Parse.User();
        parseUser.set("name", name);
        parseUser.set("username", `${classId}_T${index}_U${i}`);
        parseUser.set("password", "wcsbs2020");
        parseUser.set("emailVerified", true);
        parseUser = await parseUser.save(null, MASTER_KEY);
        users.push(parseUser);

        parseClass.relation("students").add(parseUser);
      }

      query = new Parse.Query("Team");
      query.equalTo("classId", classId);
      query.equalTo("index", index);
      team = await query.first();

      if (!team) {
        team = new Parse.Object("Team");
        team.set("classId", classId);
        team.set("leaderId", parseUser.id);
        team.set("index", index);
        team.set("name", `第${index}组`);
        team = await team.save(null, MASTER_KEY);
        teams.push(team);
      }

      team.relation("members").add(parseUser);
      team = await team.save(null, MASTER_KEY);

      var result = { user: parseUser, count: 0 };
      for (key in record) {
        const date = mapDates[key];
        if (date) {
          const countStr = record[key].split(/[,.]/).join("");
          const count =
            countStr && countStr.length > 0 ? parseInt(countStr) : 0;
          if (practiceId) {
            if (count > 0) {
              result.count = await commonFunctions.reportPracticeCountV2(
                parseUser,
                practiceId,
                undefined,
                date,
                count
              );
            }
          } else {
            query = parseClass.relation("sessionsV2").query();
            query.equalTo("scheduledAt", date);
            const classSession = await query.first();

            if (classSession) {
              var attendance = { attendance: count > 0 };
              attendance = await commonFunctions.updateAttendanceV2(
                parseUser,
                classId,
                classSession.id,
                attendance
              );
              if (attendance.attendance) {
                result.count += 1;
              }
            }
          }
        }
      }
      results.push(result);
    }
    parseClass = await parseClass.save(null, MASTER_KEY);

    return { mapDates, teams, users, results };
  }
);
