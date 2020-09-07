/* eslint-disable no-undef */
const MASTER_KEY = { useMasterKey: true };
const MAX_QUERY_COUNT = 300;

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
  const rolesToReturn =
    roles.length > 0 ? roles.map(r => r.get("name")) : ["StudentUser"];

  return {
    id: user.id,
    name: user.get("name"),
    username: user.get("username"),
    phone: user.get("phone"),
    email: user.get("email"),
    state: user.get("state"),
    roles: rolesToReturn
  };
});

Parse.Cloud.define(
  "user:adminFetchUsers",
  async ({ user, params: { user: userWithRoles } }) => {
    requireAuth(user);
    requireRole(userWithRoles, "B4aAdminUser");

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
  }
);

Parse.Cloud.define(
  "user:adminFetchUser",
  async ({ user, params: { user: userWithRoles, userSlug } }) => {
    requireAuth(user);
    requireRole(userWithRoles, "B4aAdminUser");

    var userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("objectId", userSlug);
    userWithRoles = await userQuery.first(MASTER_KEY);

    var userRoleQuery = new Parse.Query(Parse.Role);
    userRoleQuery.equalTo("users", userWithRoles);
    const roles = await userRoleQuery.find(MASTER_KEY);

    userWithRoles = {
      id: userWithRoles.id,
      name: userWithRoles.get("name"),
      username: userWithRoles.get("username"),
      phone: userWithRoles.get("phone"),
      email: userWithRoles.get("email"),
      state: userWithRoles.get("state"),
      roles: roles.map(r => r.get("name"))
    };
    return userWithRoles;
  }
);

Parse.Cloud.define(
  "user:adminUpdateUser",
  async ({ user, params: { user: userWithRoles, userToUpdate } }) => {
    requireAuth(user);
    requireRole(userWithRoles, "B4aAdminUser");

    const array = [
      { enabled: userToUpdate.isSystemAdmin, roleName: "B4aAdminUser" },
      { enabled: userToUpdate.isClassAdmin, roleName: "ClassAdminUser" },
      {
        enabled: userToUpdate.isTeachingAssistant,
        roleName: "TeachingAssistantUser"
      },
      { enabled: userToUpdate.isStudent, roleName: "StudentUser" }
    ];

    var parseUser;
    if (userToUpdate.id) {
      var userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo("objectId", userToUpdate.id);
      parseUser = await userQuery.first(MASTER_KEY);
    } else {
      parseUser = new Parse.User(MASTER_KEY);
    }

    parseUser.set("username", userToUpdate.username);
    parseUser.set("name", userToUpdate.name);
    parseUser.set("phone", userToUpdate.phone);
    parseUser.set("email", userToUpdate.email);

    if (userToUpdate.state === "blocked") {
      parseUser.set("emailVerified", false); // blocking user form login
    } else {
      if (userToUpdate.password) {
        parseUser.set("password", userToUpdate.password);
        userToUpdate.state = "needToChangePassword"; // user needs to update password in next login
      }
      if (!parseUser.get("emailVerified")) {
        parseUser.set("emailVerified", true); // re-enable user form login
      }
    }

    if (userToUpdate.state) {
      parseUser.set("state", userToUpdate.state);
    } else {
      parseUser.unset("state");
    }

    userToUpdate = await parseUser.save(null, MASTER_KEY);

    var userRoleQuery = new Parse.Query(Parse.Role);
    userRoleQuery.equalTo("users", userToUpdate);
    var roles = await userRoleQuery.find(MASTER_KEY);
    var roleNames = [];

    for (n = 0; n < array.length; n++) {
      i = array[n];
      if (i.enabled) {
        roleNames.push(i.roleName);
      }

      const existing = roles.some(r => r.get("name") === i.roleName);
      if (i.enabled != existing) {
        var roleQuery = new Parse.Query(Parse.Role);
        roleQuery.equalTo("name", i.roleName);
        var role = await roleQuery.first(MASTER_KEY);
        const relation = role.relation("users");

        if (i.enabled) {
          relation.add(userToUpdate);
        } else {
          relation.remove(userToUpdate);
        }
        await role.save(null, MASTER_KEY);
      }
    }

    return {
      id: userToUpdate.id,
      name: userToUpdate.get("name"),
      username: userToUpdate.get("username"),
      phone: userToUpdate.get("phone"),
      email: userToUpdate.get("email"),
      state: userToUpdate.get("state"),
      roles: roleNames
    };
  }
);

const loadStudentAttendance = async function(userId, classSession) {
  const logger = require("parse-server").logger;
  logger.info(
    `loadStudentAttendance - userId: ${userId} classSession: ${JSON.stringify(
      classSession
    )}`
  );

  var result = {};
  if (classSession) {
    var query = classSession.relation("attendances").query();
    query.equalTo("userId", userId);
    const attendance = await query.first();

    logger.info(`loadStudentAttendance - attendance: ${attendance}`);

    if (attendance) {
      result = {
        chuanCheng: attendance.get("chuanCheng"),
        faBen: attendance.get("faBen"),
        fuDao: attendance.get("fuDao"),
        shangKe: attendance.get("shangKe"),
        qingJia: attendance.get("qingJia")
      };

      logger.info(`loadStudentAttendance - result: ${JSON.stringify(result)}`);
    }
  }
  return result;
};

const loadStudentPracticeCounts = async function(userId, practices) {
  const logger = require("parse-server").logger;
  logger.info(`loadStudentPracticeCounts - userId: ${userId}`);

  var result = [];
  if (practices && practices.length > 0) {
    for (var i = 0; i < practices.length; i++) {
      var practiceCount = {};
      const relation = practices[i].relation("counts");
      var query = relation.query();
      query.equalTo("userId", userId);
      query.equalTo("reportedAt", undefined);
      const accumulatedCount = await query.first();

      if (accumulatedCount) {
        query = relation.query();
        query.equalTo("userId", userId);
        query.descending("reportedAt");
        const latestCount = await query.first();

        practiceCount.count = latestCount.get("count");
        practiceCount.reportedAt = latestCount.get("reportedAt");
        practiceCount.accumulatedCount = accumulatedCount.get("count");
      }
      result.push(practiceCount);
    }
  }

  return result;
};

// eslint-disable-next-line no-unused-vars
const populateSessions = async function(parseClass) {
  const logger = require("parse-server").logger;
  var relation = parseClass.relation("sessions");

  var query = new Parse.Query("ClassSession");
  var allSessions = await query.limit(MAX_QUERY_COUNT).find();
  for (var i = 0; i < allSessions.length; i++) {
    relation.add(allSessions[i]);
    logger.info(
      `populateSessions - i: ${i} classSession: ${allSessions[i].get("name")}`
    );
  }
  await parseClass.save(null, MASTER_KEY);
};

const loadStudentDashboard = async function(parseUser) {
  const logger = require("parse-server").logger;
  const userId = parseUser._getId();
  const dashboard = {
    enrolledClasses: [],
    newClasses: []
  };
  var query = new Parse.Query("Class");
  query.equalTo("students", parseUser);
  var parseClasses = await query.find();
  const enrolledClassList = [];

  for (var i = 0; i < parseClasses.length; i++) {
    const parseClass = parseClasses[i];
    const classInfo = {
      id: parseClass._getId(),
      name: parseClass.get("name"),
      url: parseClass.get("url"),
      classSessions: [],
      attendances: [],
      practices: [],
      counts: []
    };
    enrolledClassList.push(parseClass._getId());

    query = parseClass.relation("classAdminUsers").query();
    const classAdminUsers = await query.find();
    classInfo.teachers = classAdminUsers.map(u => u.get("name"));

    query = parseClass.relation("sessions").query();
    var d = new Date();
    query.greaterThan("scheduledAt", d);
    query.ascending("scheduledAt");
    const nextSession = await query.first();
    if (nextSession) {
      classInfo.classSessions.push(nextSession);
      const attendance = await loadStudentAttendance(userId, nextSession);
      logger.info(
        `loadStudentDashboard - attendance: ${JSON.stringify(attendance)}`
      );
      classInfo.attendances.push(attendance);
    }

    query = parseClass.relation("sessions").query();
    query.lessThanOrEqualTo("scheduledAt", d);
    query.descending("scheduledAt");
    const lastSession = await query.first();
    if (lastSession) {
      classInfo.classSessions.push(lastSession);
      const attendance = await loadStudentAttendance(userId, lastSession);
      logger.info(
        `loadStudentDashboard - attendance: ${JSON.stringify(attendance)}`
      );
      classInfo.attendances.push(attendance);
    }

    query = parseClass.relation("practices").query();
    classInfo.practices = await query.find();
    classInfo.counts = await loadStudentPracticeCounts(
      userId,
      classInfo.practices
    );

    dashboard.enrolledClasses.push(classInfo);
    // await populateSessions(parseClass);
  }

  query = new Parse.Query("Class");
  query.equalTo("openForApplication", true);
  // query.exclude("objectId", enrolledClassList); TODO: how to do SQL NOT IN [a, b, c]
  parseClasses = await query.find();

  for (i = 0; i < parseClasses.length; i++) {
    const parseClass = parseClasses[i];
    const id = parseClass._getId();
    if (enrolledClassList.includes(id)) {
      continue;
    }
    const classInfo = {
      id: id,
      name: parseClass.get("name"),
      url: parseClass.get("url")
    };

    query = parseClass.relation("classAdminUsers").query();
    const classAdminUsers = await query.find();
    classInfo.teachers = classAdminUsers.map(u => u.get("name"));

    dashboard.newClasses.push(classInfo);
  }

  return dashboard;
};

Parse.Cloud.define(
  "home:loadDashboards",
  async ({ user, params: { user: userWithRoles } }) => {
    requireAuth(user);

    const result = {};
    if (userWithRoles.roles.includes("StudentUser")) {
      result.studentDashboard = await loadStudentDashboard(user);
    }

    return result;
  }
);

Parse.Cloud.define(
  "home:getAttendance",
  async ({ user, params: { pathname } }) => {
    requireAuth(user);

    pathname = pathname.replace("/wcsbs", "");
    var query = new Parse.Query("ClassSession");
    query.contains("url", pathname);
    const classSession = await query.first();
    return loadStudentAttendance(user.id, classSession);
  }
);

Parse.Cloud.define(
  "home:updateAttendance",
  async ({ user, params: { pathname, attendance } }) => {
    requireAuth(user);

    const result = {};
    pathname = pathname.replace("/wcsbs", "");
    var query = new Parse.Query("ClassSession");
    query.contains("url", pathname);
    const classSession = await query.first();

    if (classSession) {
      const relation = classSession.relation("attendances");
      query = relation.query();

      query.equalTo("userId", user.id);
      var parseAttendance = await query.first();

      const creatingAttendance = !parseAttendance;
      if (creatingAttendance) {
        parseAttendance = new Parse.Object("Attendance");
        parseAttendance.set("userId", user.id);
      }

      if (attendance) {
        parseAttendance.set("chuanCheng", attendance.chuanCheng);
        parseAttendance.set("faBen", attendance.faBen);
        parseAttendance.set("fuDao", attendance.fuDao);
        parseAttendance.set("shangKe", attendance.shangKe);
        parseAttendance.set("qingJia", attendance.qingJia);
      }

      parseAttendance = await parseAttendance.save(null, MASTER_KEY);

      if (creatingAttendance) {
        relation.add(parseAttendance);
        await classSession.save(null, MASTER_KEY);
      }

      result.chuanCheng = parseAttendance.get("chuanCheng");
      result.faBen = parseAttendance.get("faBen");
      result.fuDao = parseAttendance.get("fuDao");
      result.shangKe = parseAttendance.get("shangKe");
      result.qingJia = parseAttendance.get("qingJia");
    }

    return result;
  }
);

Parse.Cloud.define(
  "home:reportPracticeCount",
  async ({ user, params: { practiceId, reportedAt, count } }) => {
    const logger = require("parse-server").logger;
    requireAuth(user);

    userId = user.id;
    logger.info(
      `home:reportPracticeCount - userId: ${userId} practiceId: ${practiceId} reportedAt: ${reportedAt} count: ${count}`
    );

    var query = new Parse.Query("Practice");
    query.equalTo("objectId", practiceId);
    const practice = await query.first();
    const relation = practice.relation("counts");
    var newCount = false;
    var delta = count;

    query = relation.query();
    query.equalTo("userId", userId);
    query.equalTo("reportedAt", reportedAt);
    var currentPracticeCount = await query.first();

    if (!currentPracticeCount) {
      currentPracticeCount = new Parse.Object("UserPracticeCount");
      currentPracticeCount.set("userId", userId);
      currentPracticeCount.set("reportedAt", reportedAt);
      newCount = true;
    } else {
      delta -= currentPracticeCount.get("count");
    }

    currentPracticeCount.set("count", count);
    currentPracticeCount = await currentPracticeCount.save(null, MASTER_KEY);

    query = relation.query();
    query.equalTo("userId", userId);
    query.equalTo("reportedAt", undefined);
    var accumulatedCount = await query.first();

    if (accumulatedCount) {
      count = accumulatedCount.get("count") + delta;
    } else {
      accumulatedCount = new Parse.Object("UserPracticeCount");
      accumulatedCount.set("userId", userId);
      accumulatedCount.set("reportedAt", undefined);
      newCount = true;
    }

    accumulatedCount.set("count", count);
    accumulatedCount = await accumulatedCount.save(null, MASTER_KEY);

    if (newCount) {
      relation.add(currentPracticeCount);
      relation.add(accumulatedCount);
      await practice.save(null, MASTER_KEY);
    }

    return {
      id: currentPracticeCount._getId(),
      count: currentPracticeCount.get("count"),
      reportedAt: currentPracticeCount.get("reportedAt"),
      accumulatedCount: accumulatedCount.get("count")
    };
  }
);

Parse.Cloud.define(
  "class:fetchPracticeCounts",
  async ({ user, params: { practiceId } }) => {
    const logger = require("parse-server").logger;
    requireAuth(user);

    userId = user.id;
    logger.info(
      `home:fetchPracticeCounts - userId: ${userId} practiceId: ${practiceId}`
    );

    var query = new Parse.Query("Practice");
    query.equalTo("objectId", practiceId);
    const practice = await query.first();
    const result = {
      practice: practice,
      counts: []
    };
    const relation = practice.relation("counts");

    query = relation.query();
    query.equalTo("userId", userId);
    query.descending("reportedAt");
    result.counts = await query.limit(MAX_QUERY_COUNT).find();

    return result;
  }
);

Parse.Cloud.define(
  "class:fetchSessions",
  async ({ user, params: { classId, forApplication } }) => {
    requireAuth(user);

    var query = new Parse.Query("Class");
    query.equalTo("objectId", classId);
    const parseClass = await query.first();

    const classInfo = {
      id: parseClass._getId(),
      name: parseClass.get("name"),
      url: parseClass.get("url"),
      forApplication: forApplication,
      classSessions: [],
      attendances: []
    };

    query = parseClass.relation("sessions").query();
    query.descending("scheduledAt");
    const classSessions = await query.limit(MAX_QUERY_COUNT).find();

    for (var i = 0; i < classSessions.length; i++) {
      const classSession = classSessions[i];
      classInfo.classSessions.push(classSession);

      if (forApplication) {
        classInfo.attendances.push(undefined);
      } else {
        const attendance = await loadStudentAttendance(user.id, classSession);
        classInfo.attendances.push(attendance);
      }
    }

    return classInfo;
  }
);

Parse.Cloud.define("class:apply", async ({ user, params: { classId } }) => {
  requireAuth(user);

  var query = new Parse.Query("Class");
  query.equalTo("objectId", classId);
  const parseClass = await query.first(MASTER_KEY);

  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", user.id);
  var parseUser = await userQuery.first(MASTER_KEY);

  parseClass.relation("students").add(parseUser);

  return await parseClass.save(null, MASTER_KEY);
});

Parse.Cloud.define(
  "class:updateClassSession",
  async ({ user, params: { session } }) => {
    requireAuth(user);
    const logger = require("parse-server").logger;
    logger.info(
      `updateClassSession - userId: ${user.id} session: ${JSON.stringify(
        session
      )}`
    );

    var result = {};
    var query = new Parse.Query("ClassSession");
    query.equalTo("objectId", session.id);
    var classSession = await query.first();

    if (classSession) {
      classSession.set("scheduledAt", session.scheduledAt);
      classSession.set("description", session.description);
      await classSession.save(null, MASTER_KEY);

      result = classSession;
    }

    if (session.id != session.oldId) {
      query = new Parse.Query("ClassSession");
      query.equalTo("objectId", session.oldId);
      classSession = await query.first();

      if (classSession) {
        classSession.unset("scheduledAt");
        await classSession.save(null, MASTER_KEY);
      }
    }

    return result;
  }
);
