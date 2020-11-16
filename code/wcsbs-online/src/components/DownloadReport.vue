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
      console.log(`generateReport - forSelf: ${forSelf}`);

      return await Parse.Cloud.run("class:generateReport", {
        classId,
        classTeams,
        practiceId,
        monthlyTotalOnly
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
          if (result.length == 0) {
            result = [{ 错误: "您不是正式学员，不能下载统计报表！" }];
          }
          return result;
        })
        .catch(e => {
          console.log(`error in generateReport: ${e}`);
          thisComponent.$dialog.alert(`error in generateReport: ${e}`);
          return e;
        });
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
