/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const MASTER_KEY = { useMasterKey: true };
const MAX_QUERY_COUNT = 3000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
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
  reportedAt,
  count,
  practiceSessions
) {
  requireAuth(user);

  const userId = user.id;
  logger.info(
    `reportPracticeCountV2 - userId: ${userId} practiceId: ${practiceId} reportedAt: ${reportedAt} count: ${count} practiceSessions: ${JSON.stringify(
      practiceSessions
    )}`
  );

  var query = new Parse.Query("Practice");
  query.equalTo("objectId", practiceId);
  const practice = await query.first();
  var relation = practice.relation("counts");
  var newCount = false;
  var delta = count == undefined ? 0 : count;

  query = relation.query();
  query.equalTo("userId", userId);
  query.equalTo("reportedAt", reportedAt);
  var currentPracticeCount = await query.first();

  if (currentPracticeCount) {
    delta -= currentPracticeCount.get("count");
    if (count == undefined) {
      await currentPracticeCount.destroy();
      currentPracticeCount = undefined;
    }
  } else {
    if (count != undefined) {
      currentPracticeCount = new Parse.Object("UserPracticeCount");
      currentPracticeCount.set("userId", userId);
      currentPracticeCount.set("reportedAt", reportedAt);
      newCount = true;
    }
  }

  if (currentPracticeCount) {
    currentPracticeCount.set("count", count);
    currentPracticeCount = await currentPracticeCount.save(null, MASTER_KEY);
  }

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
    if (currentPracticeCount) {
      relation.add(currentPracticeCount);
    }

    relation.add(accumulatedCount);
    await practice.save(null, MASTER_KEY);
  }

  var resultPracticeSessions = [];
  if (currentPracticeCount && practiceSessions) {
    relation = currentPracticeCount.relation("practiceSessions");
    query = relation.query();
    query.ascending("index");
    var parsePracticeSessions = await query.limit(MAX_QUERY_COUNT).find();

    const length =
      parsePracticeSessions.length > practiceSessions.length
        ? parsePracticeSessions.length
        : practiceSessions.length;
    for (var i = 0; i < length; i++) {
      var parsePracticeSession = undefined;
      if (i < parsePracticeSessions.length) {
        parsePracticeSession = parsePracticeSessions[i];
      } else {
        parsePracticeSession = new Parse.Object("UserPracticeSession");
      }
      resultPracticeSessions.push(parsePracticeSession);

      if (i < practiceSessions.length) {
        parsePracticeSession.set("index", i + 1);
        parsePracticeSession.set(
          "submoduleId",
          practiceSessions[i].submoduleId
        );
        parsePracticeSession.set("duration", practiceSessions[i].duration);
        parsePracticeSession = await parsePracticeSession.save(
          null,
          MASTER_KEY
        );

        if (i >= parsePracticeSessions.length) {
          relation.add(parsePracticeSession);
        }
      } else {
        relation.remove(parsePracticeSession);
        await parsePracticeSession.destroy();
      }
    }
    currentPracticeCount = await currentPracticeCount.save(null, MASTER_KEY);
  }

  relation = practice.relation("counts");
  query = relation.query();
  query.equalTo("userId", userId);
  query.descending("reportedAt");
  currentPracticeCount = await query.first();

  return {
    id: currentPracticeCount._getId(),
    count: currentPracticeCount.get("count"),
    reportedAt: currentPracticeCount.get("reportedAt"),
    accumulatedCount: accumulatedCount.get("count"),
    sessions: resultPracticeSessions ? resultPracticeSessions.length : 0
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

const getDatesFromCsvHeader = function(csvHeader, isRxl, isPractice) {
  var key,
    year,
    yearStr,
    mapDates = {};
  for (var i = 0; i < csvHeader.length; i++) {
    key = csvHeader[i];
    if (key.startsWith("20") && key.endsWith("TOTAL")) {
      yearStr = key.substring(0, 4);
      year = parseInt(yearStr);
      break;
    }
  }

  for (i = 0; i < csvHeader.length; i++) {
    key = csvHeader[i];
    if (key.startsWith(yearStr) && key.endsWith("TOTAL")) {
      year += 1;
      yearStr = year.toString();
      continue;
    }
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

const prepareReportGeneration = function(isRxl, isPractice) {
  const csvHeaders = [
    [
      "组别",
      "组员",
      "7-Dec",
      "14-Dec",
      "21-Dec",
      "28-Dec",
      "DEC2019 TOTAL",
      "2019 TOTAL",
      "4-Jan",
      "11-Jan",
      "18-Jan",
      "25-Jan",
      "JAN2020 TOTAL",
      "8-Feb",
      "15-Feb",
      "22-Feb",
      "29-Feb",
      "FEB2020 TOTAL",
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
      "DEC2020 TOTAL",
      "2020 TOTAL",
      "TOTAL"
    ],
    [
      "组别",
      "组员",
      "24FEB-01MAR",
      "FEB2020 TOTAL",
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
      "DEC2020 TOTAL",
      "2020 TOTAL"
    ]
  ];

  const csvHeader = csvHeaders[isPractice ? 1 : 0];
  var mapDates = getDatesFromCsvHeader(csvHeader, isRxl, isPractice);

  // JiaXing practices started on 30/6/19
  if (!isRxl && isPractice) {
    var endDate = mapDates["24FEB-01MAR"];
    var sunday = new Date("30 JUN 2019");
    var insertAt = 2;

    logger.info(
      `prepareReportGeneration - sunday: ${sunday} endDate: ${endDate}`
    );

    var lastMonth, lastYear;
    while (sunday < endDate) {
      var saturday = new Date(sunday.getTime() - DAY_IN_MS);
      var monday = new Date(sunday.getTime() - 6 * DAY_IN_MS);

      const re = /[\s,]+/;
      const monElements = toLocalDateString(monday).split(re);
      const satElements = toLocalDateString(saturday).split(re);
      const sunElements = toLocalDateString(sunday).split(re);
      const newCsvHeader = `${monElements[1]}${
        monElements[0] != sunElements[0] ? monElements[0].toUpperCase() : ""
      }-${sunElements[1]}${sunElements[0].toUpperCase()}`;

      if (!lastMonth) {
        lastMonth = satElements[0];
        lastYear = satElements[2];
      } else {
        if (lastMonth != satElements[0]) {
          csvHeader.splice(
            insertAt,
            0,
            `${lastMonth.toUpperCase()}${lastYear} TOTAL`
          );
          insertAt += 1;
          lastMonth = satElements[0];

          if (lastYear != satElements[2]) {
            csvHeader.splice(insertAt, 0, `${lastYear} TOTAL`);
            insertAt += 1;
            lastYear = satElements[2];
          }
        }
      }

      csvHeader.splice(insertAt, 0, newCsvHeader);
      insertAt += 1;

      sunday = new Date(sunday.getTime() + 7 * DAY_IN_MS);
    }

    mapDates = getDatesFromCsvHeader(csvHeader, isRxl, isPractice);
  }

  return { csvHeader, mapDates };
};

const formatCount = function(count) {
  if (count != undefined) {
    return count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  return "";
};

const formatMinutes = function(minutes) {
  if (minutes != undefined) {
    minutes = (minutes / 60).toFixed(2);
    return minutes.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  return "";
};

const toLocalDateString = function(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  return date.toLocaleDateString("en-UK", options);
};

const sendEmail = function(toEmail, ccEmail, subject, body) {
  logger.info(`sending email to ${toEmail}`);

  const mail = require("nodejs-nodemailer-outlook");
  mail.sendEmail({
    auth: {
      user: process.env.OUTLOOK_USER,
      pass: process.env.OUTLOOK_PASS
    },
    from: process.env.OUTLOOK_USER,
    to: toEmail,
    cc: ccEmail,
    subject: subject,
    text: body,
    onError: e => logger.info(`Error - ${e}`),
    onSuccess: i => logger.info(`Success - ${JSON.stringify(i)}`)
  });

  return `sent email to ${toEmail}`;
};

const getLastWeek = function(addGmt8Offset) {
  var curr = new Date();
  var sunday = curr.getDate() - curr.getDay(); // Sunday is the day of the month - the day of the week
  if (curr.getDay() == 0) {
    // today is Sunday; we need last Sunday
    sunday -= 7;
  }

  curr.setDate(sunday);
  sunday = curr;
  sunday.setHours(23, 59, 59, 0);

  const monday = new Date(sunday.getTime() - 7 * DAY_IN_MS);
  monday.setHours(0, 0, 0, 0);

  if (addGmt8Offset) {
    const gmt8Offset = 8 * 60 * 60 * 1000; //8 hours in ms
    monday.setTime(monday.getTime() + gmt8Offset);
    sunday.setTime(sunday.getTime() + gmt8Offset);
  }

  return { monday, sunday };
};

const loadClassWithTeams = async function(classId) {
  var query = new Parse.Query("Class");
  query.equalTo("objectId", classId);
  const parseClass = await query.first();

  const classInfo = {
    parseClass,
    classTeams: []
  };

  query = new Parse.Query("Team");
  query.equalTo("classId", classId);
  query.ascending("index");
  const parseTeams = await query.limit(MAX_QUERY_COUNT).find();

  for (var i = 0; i < parseTeams.length; i++) {
    const parseTeam = parseTeams[i];
    const team = {
      parseTeam,
      members: []
    };

    var membersOrder = parseTeam.get("membersOrder");
    if (membersOrder) {
      membersOrder = membersOrder.split(",");
      for (var j = 0; j < membersOrder.length; j++) {
        query = new Parse.Query("User");
        query.equalTo("objectId", membersOrder[j]);
        const parseUser = await query.find(MASTER_KEY);
        team.members.push(parseUser[0]);
      }
    }
    classInfo.classTeams.push(team);
  }

  return classInfo;
};

const loadStudentAttendanceV2 = async function(userId, classSession) {
  var result = {};
  if (classSession) {
    var query = new Parse.Query("UserSessionAttendance");
    query.equalTo("userId", userId);
    query.equalTo("sessionId", classSession._getId());
    const parseUserSessionAttendance = await query.first();

    if (parseUserSessionAttendance) {
      result.attendance = parseUserSessionAttendance.get("attendance");
      result.onLeave = parseUserSessionAttendance.get("onLeave");
    }
  }

  logger.info(
    `loadStudentAttendanceV2 - userId: ${userId} sessionId: ${
      classSession ? classSession._getId() : undefined
    } result: ${JSON.stringify(result)}`
  );

  return result;
};

const loadUserMissedReportingStates = async function(
  parseUser,
  parseClass,
  lastSession,
  lastWeek
) {
  const results = [];
  const userId = parseUser._getId();
  logger.info(`loadUserMissedReportingStates - userId: ${userId}`);

  if (lastSession) {
    const attendance = await loadStudentAttendanceV2(userId, lastSession);
    var reported =
      attendance && (attendance.onLeave || attendance.attendance != undefined);
    if (!reported) {
      results.push("共修出席");
    }
  }

  var query = parseClass.relation("practices").query();
  query.ascending("index");
  const parsePractices = await query.find();

  for (var i = 0; i < parsePractices.length; i++) {
    const parsePractice = parsePractices[i];
    query = parsePractice.relation("counts").query();
    query.equalTo("userId", userId);
    query.greaterThanOrEqualTo("reportedAt", lastWeek.monday);
    query.lessThanOrEqualTo("reportedAt", lastWeek.sunday);
    const parseCounts = await query.find();
    if (!parseCounts.length) {
      query = parsePractice.relation("counts").query();
      query.equalTo("userId", userId);
      query.equalTo("reportedAt", undefined);
      const parseCount = await query.first();
      if (!parseCount || !parseCount.get("completed")) {
        results.push(parsePractice.get("name"));
      }
    }
  }

  return results;
};

const remindClassReporting = async function(classId) {
  const lastWeek = getLastWeek(true);
  const lastWeekForEmail = getLastWeek(false);
  logger.info(
    `remindClassReporting - classId: ${classId} lastWeek: ${JSON.stringify(
      lastWeek
    )}`
  );

  const emailsSent = [];
  const classInfo = await loadClassWithTeams(classId);
  const parseClass = classInfo.parseClass;
  const subject = `${parseClass.get("name")}学修报数提醒`;

  var query = parseClass.relation("sessionsV2").query();
  query.greaterThanOrEqualTo("scheduledAt", lastWeek.monday);
  query.lessThanOrEqualTo("scheduledAt", lastWeek.sunday);
  const lastSession = await query.first();

  var leaderEmail;
  for (var i = 0; i < classInfo.classTeams.length; i++) {
    const team = classInfo.classTeams[i];
    for (var j = 0; j < team.members.length; j++) {
      const parseUser = team.members[j];
      const email = parseUser.get("email");
      if (j == 0) {
        leaderEmail = email;
      }
      if (email) {
        const states = await loadUserMissedReportingStates(
          parseUser,
          parseClass,
          lastSession,
          lastWeek
        );
        if (states.length) {
          const statesStr = states.join("，");
          const body = `${parseUser.get(
            "name"
          )}师兄，\n\n顶礼上师三宝！温馨提醒：您还没有完成上周（${toLocalDateString(
            lastWeekForEmail.monday
          )} - ${toLocalDateString(
            lastWeekForEmail.sunday
          )}）以下项目的报数：${statesStr}。请点以下链接，登录网站并完成报数：\n\nhttps://wcsbs.herokuapp.com/online/ \n\n新加坡智悲佛学会\nWCSBS`;

          const result = sendEmail(email, leaderEmail, subject, body);
          logger.info(
            `sent email to ${email} cc ${leaderEmail} result: ${result}`
          );
          emailsSent.push({ email, result });
        }
      }
    }
  }
  return { lastWeek, lastWeekForEmail, emailsSent };
};

module.exports = {
  requireAuth,
  requireRole,
  reportPracticeCountV2,
  updateAttendanceV2,
  getDatesFromCsvHeader,
  prepareReportGeneration,
  formatCount,
  formatMinutes,
  sendEmail,
  remindClassReporting,
  toLocalDateString,
  getLastWeek,
  loadStudentAttendanceV2
};
