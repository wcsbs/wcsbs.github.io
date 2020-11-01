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
    worksheet: String
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
      const practiceId = this.classInfo.practiceId;
      const classTeams = classTeam ? [classTeam] : this.classTeams;
      const monthlyTotalOnly = !classTeam;

      return await Parse.Cloud.run("class:generateReport", {
        classId,
        classTeams,
        practiceId,
        monthlyTotalOnly
      })
        .then(result => {
          // console.log(`generateReport - result: ${JSON.stringify(result)}`);
          console.log(`generateReport - #result: ${result.length}`);
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
