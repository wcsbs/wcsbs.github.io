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

module.exports = {
  requireAuth,
  requireRole,
  reportPracticeCountV2
};
