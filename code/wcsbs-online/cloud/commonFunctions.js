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
  for (var i = 0; i < csvHeader.length; i++) {
    const key = csvHeader[i];
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

const prepareReportGeneration = function(isRxl, isPractice, year) {
  const csvHeaders = [
    [
      "组别",
      "组员",
      "8-Feb",
      "15-Feb",
      "22-Feb",
      "29-Feb",
      "FEB2020TOTAL",
      "7-Mar",
      "14-Mar",
      "21-Mar",
      "28-Mar",
      "MAR2020 TOTAL",
      "4-Apr",
      "11-Apr",
      "18-Apr",
      "25-Apr",
      "APR2020 TOTAL",
      "2-May",
      "9-May",
      "16-May",
      "23-May",
      "30-May",
      "MAY2020 TOTAL",
      "6-Jun",
      "13-Jun",
      "20-Jun",
      "27-Jun",
      "JUN2020 TOTAL",
      "4-Jul",
      "11-Jul",
      "18-Jul",
      "25-Jul",
      "JUL2020 TOTAL",
      "1-Aug",
      "8-Aug",
      "15-Aug",
      "22-Aug",
      "29-Aug",
      "AUG2020 TOTAL",
      "5-Sep",
      "12-Sep",
      "19-Sep",
      "26-Sep",
      "SEP2020 TOTAL",
      "3-Oct",
      "10-Oct",
      "17-Oct",
      "24-Oct",
      "31-Oct",
      "OCT2020 TOTAL",
      "7-Nov",
      "14-Nov",
      "21-Nov",
      "28-Nov",
      "NOV2020 TOTAL",
      "5-Dec",
      "12-Dec",
      "19-Dec",
      "26-Dec",
      "DEC2020 TOTAL"
    ],
    [
      "组别",
      "组员",
      "24FEB-01MAR",
      "FEB2020TOTAL",
      "2-8MAR",
      "9-15MAR",
      "16-22MAR",
      "23-29MAR",
      "MAR2020 TOTAL",
      "30MAR-5APR",
      "6-12APR",
      "13-19APR",
      "20-26APR",
      "APR2020 TOTAL",
      "27APR-3MAY",
      "4-10MAY",
      "11-17MAY",
      "18-24MAY",
      "25-31MAY",
      "MAY2020 TOTAL",
      "1-7JUN",
      "8-14JUN",
      "15-21JUN",
      "22-28JUN",
      "JUN2020 TOTAL",
      "29JUN-5JUL",
      "6-12JUL",
      "13-19JUL",
      "20-26JUL",
      "JUL2020 TOTAL",
      "27JUL-2AUG",
      "3-9AUG",
      "10-16AUG",
      "17-23AUG",
      "24-30AUG",
      "AUG2020 TOTAL",
      "31AUG-6SEP",
      "7-13SEP",
      "14-20SEP",
      "21-27SEP",
      "SEP2020 TOTAL",
      "28SEP-4OCT",
      "5-11OCT",
      "12-18OCT",
      "19-25OCT",
      "26OCT-1NOV",
      "OCT2020 TOTAL",
      "2-8NOV",
      "9-15NOV",
      "16-22NOV",
      "23-29NOV",
      "NOV2020 TOTAL",
      "30NOV-6DEC",
      "7-13DEC",
      "14-20DEC",
      "21-27DEC",
      "DEC2020 TOTAL"
    ]
  ];

  const csvHeader = csvHeaders[(year - 2020) * 2 + (isPractice ? 1 : 0)];
  const mapDates = getDatesFromCsvHeader(csvHeader, isRxl, isPractice, year);
  return { csvHeader, mapDates };
};

module.exports = {
  requireAuth,
  requireRole,
  reportPracticeCountV2,
  updateAttendanceV2,
  getDatesFromCsvHeader,
  prepareReportGeneration
};
