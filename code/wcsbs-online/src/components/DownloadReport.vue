<template>
  <div>
    <JsonExcelWrapper
      v-for="(reportName, index) in reportNames"
      :key="componentKeys[index]"
      class="btn btn-info btn-block"
      :worksheet="worksheet + reportName"
      :doFetchData="index ? fetchDetails : fetchSummary"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Parse from "parse";
import JsonExcelWrapper from "@/components/JsonExcelWrapper";
import { sha256 } from "js-sha256";

export default {
  name: "DownloadReport",
  components: {
    JsonExcelWrapper
  },
  computed: {
    ...mapGetters([
      "isLoadingStats",
      "classInfo",
      "classTeams",
      "isClassAdmin",
      "isSystemAdmin"
    ])
  },
  props: {
    classTeam: { type: Object, required: false },
    worksheet: String,
    practiceId: String,
    forSelf: Boolean,
    hasSubmodules: Boolean
  },
  data: function() {
    return {
      reportNames: [""],
      buttonNames: ["", ""],
      componentKeys: [0, 10000]
    };
  },
  mounted() {
    if (this.hasSubmodules || this.classInfo.practiceModuleId) {
      this.reportNames = ["概要", "详情"];
    }
  },
  methods: {
    async fetchSummary() {
      console.log("fetchSummary");
      return this.fetchData(false);
    },
    async fetchDetails() {
      console.log("fetchDetails");
      return this.fetchData(true);
    },
    async fetchData(loadingDetails) {
      const thisComponent = this;
      const classTeam = this.classTeam;
      const classId = this.classInfo.id;
      const practiceId = this.forSelf
        ? this.practiceId
        : this.classInfo.practiceId;
      const forSelf = this.forSelf;
      const classTeams = forSelf
        ? undefined
        : classTeam
        ? [classTeam]
        : this.classTeams;
      const monthlyTotalOnly = !classTeam && !this.forSelf;
      const params = {
        classId,
        classTeams,
        practiceId,
        monthlyTotalOnly: false,
        loadingDetails
      };
      const loggedInUser = Parse.User.current();
      // console.log(`generateReport - loggedInUser.id: ${loggedInUser.id}`);

      params.reportHash = sha256(
        `${forSelf ? loggedInUser.id : ""}${JSON.stringify(params)}`
      );
      console.log(
        `generateReport - forSelf: ${forSelf} monthlyTotalOnly: ${monthlyTotalOnly} reportHash: ${params.reportHash}`
      );
      const delay = seconds =>
        new Promise(res => setTimeout(res, seconds * 1000));

      var response,
        retry = 3;
      while (retry > 0) {
        response = await Parse.Cloud.run("class:generateReport", params)
          .then(result => {
            // console.log(`generateReport - result: ${JSON.stringify(result)}`);
            console.log(`generateReport - #result: ${result.length}`);
            if (!result || result.length == 0) {
              result = [{ 错误: "您不是正式学员，不能下载统计报表！" }];
            }
            if (forSelf) {
              return result;
            }

            const reportLines = [];
            var lastTeamIndex = -1;
            for (var i = 0; i < result.length; i++) {
              const record = result[i];
              const index = parseInt(record["组别"]);
              if (index != lastTeamIndex) {
                record["组员"] = `组长${record["组员"]}`;
                lastTeamIndex = index;
              }

              if (monthlyTotalOnly) {
                const newRecord = {};
                for (var key in record) {
                  const value = record[key];
                  if (key.includes("-")) {
                    continue;
                  }
                  if (key.endsWith("TOTAL") && !key.startsWith("20")) {
                    key = key.replace(" TOTAL", "");
                  }
                  newRecord[key] = value;
                }
                reportLines.push(newRecord);
              } else {
                reportLines.push(record);
              }
            }

            return reportLines;
          })
          .catch(e => {
            console.log(`error in generateReport: ${e}`);
            return e;
          });

        if (Array.isArray(response)) {
          break;
        }

        retry--;

        //{"message":"XMLHttpRequest failed: \"Unable to connect to the Parse API\"","code":100}
        if (retry == 0 || response.code != 100) {
          thisComponent.$dialog.alert(`error in generateReport: ${response}`);
          response = [{ 错误: `下载失败：${JSON.stringify(response)}` }];
          break;
        }

        await delay(60);
        console.log("Waited 60s");
      }

      return response;
    }
  }
};
</script>
