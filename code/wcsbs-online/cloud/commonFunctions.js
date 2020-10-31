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

const reportPracticeCountV2 = async function(
  user,
  practiceId,
  practiceSubmoduleId,
  reportedAt,
  count
) {
  requireAuth(user);

  userId = user.id;
  logger.info(
    `reportPracticeCountV2 - userId: ${userId} practiceId: ${practiceId} practiceSubmoduleId: ${practiceSubmoduleId} reportedAt: ${reportedAt} count: ${count}`
  );

  var query = new Parse.Query("Practice");
  query.equalTo("objectId", practiceId);
  const practice = await query.first();
  const relation = practice.relation("counts");
  var newCount = false;
  var delta = count;

  query = relation.query();
  query.equalTo("userId", userId);
  query.equalTo("submoduleId", practiceSubmoduleId);
  query.equalTo("reportedAt", reportedAt);
  var currentPracticeCount = await query.first();

  if (!currentPracticeCount) {
    currentPracticeCount = new Parse.Object("UserPracticeCount");
    currentPracticeCount.set("userId", userId);
    currentPracticeCount.set("reportedAt", reportedAt);
    currentPracticeCount.set("submoduleId", practiceSubmoduleId);
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
};

const updateAttendanceV2 = async function(
  user,
  classId,
  sessionId,
  attendance
) {
  requireAuth(user);

  var count = attendance.attendance ? 1 : 0;
  const result = {};
  var query = new Parse.Query("UserSessionAttendance");
  query.equalTo("userId", user.id);
  query.equalTo("sessionId", sessionId);
  var sessionAttendance = await query.first();

  if (!sessionAttendance) {
    sessionAttendance = new Parse.Object("UserSessionAttendance");
    sessionAttendance.set("userId", user.id);
    sessionAttendance.set("sessionId", sessionId);
  } else {
    if (sessionAttendance.get("attendance")) {
      count -= 1;
    }
  }

  sessionAttendance.set("attendance", attendance.attendance);
  sessionAttendance.set("onLeave", attendance.onLeave);

  sessionAttendance = await sessionAttendance.save(null, MASTER_KEY);

  result.attendance = sessionAttendance.get("attendance");
  result.onLeave = sessionAttendance.get("onLeave");

  query = new Parse.Query("UserActivityStats");
  var key = {
    userId: user.id,
    classId
  };
  key = JSON.stringify(key);
  query.equalTo("key", key);
  var stats = await query.first();
  if (stats) {
    count += stats.get("count");
  } else {
    stats = new Parse.Object("UserActivityStats");
    stats.set("key", key);
  }
  stats.set("count", count);
  result.stats = await stats.save(null, MASTER_KEY);

  return result;
};

const getDatesFromCsvHeader = function(csvHeader, isRxl, isPractice, year) {
  var mapDates = {};
  for (var key in csvHeader) {
    const start = key.indexOf("-");
    if (start > 0) {
      var value = key;
      if (key.length - start > 4) {
        //this must be a range for a week - taking last date
        value = key.substring(start + 1);
      }
      const date = new Date(`${value} ${year}`);
      if (!isPractice) {
        // RXL starts at 9am SGT while DYM at 2pm SGT
        date.setHours(isRxl ? 1 : 6);
      }
      mapDates[key] = date;
    }
  }
  return mapDates;
};

module.exports = {
  requireAuth,
  requireRole,
  reportPracticeCountV2,
  updateAttendanceV2,
  getDatesFromCsvHeader
};
