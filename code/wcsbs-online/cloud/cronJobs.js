/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const sendEmail = require("./commonFunctions.js").sendEmail;
const logger = require("parse-server").logger;

Parse.Cloud.job("removeInvalidLogin", async function(request, status) {
  var date = new Date();
  var timeNow = date.getTime();

  logger.info("Job removeInvalidLogin started at " + date);
  try {
    var intervalOfTime = 7 * 24 * 60 * 60 * 1000; // the time set is 7 days in milliseconds
    var timeThen = timeNow - intervalOfTime;

    // Limit date
    var queryDate = new Date();
    queryDate.setTime(timeThen);

    // The query object
    var query = new Parse.Query(Parse.User);

    // Query the logins that still unverified after 7 days
    query.equalTo("emailVerified", false);
    query.lessThanOrEqualTo("createdAt", queryDate);

    const results = await query.find({ useMasterKey: true });

    results.forEach(user => {
      if (user.get("state") != "blocked") {
        const email = user.get("email");
        if (email) {
          const subject = "用户账号注销通知";
          const body = `${user.get(
            "name"
          )}师兄，\n\n顶礼上师三宝！因为您没有在一周以内完成电邮地址验证，您用${email}注册的账号已经被注销。如果您还想访问学修平台，请点击以下链接重新注册用户账户：\n\nhttps://wcsbs.herokuapp.com/online/#/register \n\n新加坡智悲佛学会\nWCSBS`;

          const sendEmailResult = sendEmail(email, subject, body);
          logger.info(`sent email to ${email} result: ${sendEmailResult}`);
        }
      }

      user
        .destroy({ useMasterKey: true })
        .then(destroyed => {
          logger.info(
            "Successfully destroyed object" + JSON.stringify(destroyed)
          );
        })
        .catch(error => {
          logger.info("Error: " + error.code + " - " + error.message);
        });
    });
  } catch (e) {
    logger.info("Exception: " + JSON.stringify(e));
  }

  logger.info("Job removeInvalidLogin finished at " + new Date());
});
