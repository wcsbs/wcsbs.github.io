<template>
  <div>
    <JsonExcel
      class="btn btn-info btn-block"
      :worksheet="worksheet"
      :fetch="fetchData"
      :before-generate="startDownload"
      :before-finish="finishDownload"
      :name="getFilename()"
    >
      {{ downloading ? `${worksheet}下载中...` : `下载${worksheet}` }}
    </JsonExcel>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Parse from "parse";
import JsonExcel from "vue-json-excel";
import Vue from "vue";
import { v4 as uuidv4 } from "uuid";
Vue.component("JsonExcel", JsonExcel);

export default {
  name: "DownloadReport",
  components: {
    JsonExcel
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
    forSelf: Boolean
  },
  data: function() {
    return {
      downloading: false
    };
  },
  methods: {
    getFilename() {
      const date = new Date();
      const timestamp = new Date(date.toString().split("GMT")[0] + " UTC")
        .toISOString()
        .split(".")[0];
      return `${this.worksheet}_${timestamp}.xls`;
    },
    async fetchData() {
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
      const reportUuid = uuidv4();
      console.log(
        `generateReport - forSelf: ${forSelf} reportUuid: ${reportUuid}`
      );
      const delay = seconds =>
        new Promise(res => setTimeout(res, seconds * 1000));

      var response,
        retry = 3;
      while (retry > 0) {
        response = await Parse.Cloud.run("class:generateReport", {
          classId,
          classTeams,
          practiceId,
          monthlyTotalOnly,
          reportUuid
        })
          .then(result => {
            // console.log(`generateReport - result: ${JSON.stringify(result)}`);
            console.log(`generateReport - #result: ${result.length}`);
            if (!forSelf) {
              var lastTeamIndex = -1;
              for (var i = 0; i < result.length; i++) {
                const record = result[i];
                const index = parseInt(record["组别"]);
                if (index != lastTeamIndex) {
                  record["组员"] = `组长${record["组员"]}`;
                  lastTeamIndex = index;
                }
              }
            }
            if (!result || result.length == 0) {
              result = [{ 错误: "您不是正式学员，不能下载统计报表！" }];
            }
            return result;
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
    },
    startDownload() {
      this.downloading = true;
    },
    finishDownload() {
      this.downloading = false;
    }
  }
};
</script>
