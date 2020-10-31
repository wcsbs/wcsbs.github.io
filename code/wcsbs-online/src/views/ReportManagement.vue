<template>
  <div>
    <div v-if="isLoadingStats">正在获取统计信息...</div>
    <div v-else>
      <h3>
        {{ classInfo.name }} --
        {{
          !classInfo.practiceId
            ? "出席统计"
            : `${classInfo.practiceName}实修统计`
        }}
      </h3>
      <div v-if="classInfo.canDownloadClassReport">
        <b-button block variant="info" @click="downloadReportForClass()"
          >下载中组报表</b-button
        >
        <hr />
      </div>
      <div
        v-for="(classTeam, index) in classTeams"
        :key="classTeam.id + classTeam.name + index"
      >
        <div v-if="index > 0">
          <ClassTeam :classTeam="classTeam" />
          <b-button
            block
            variant="info"
            @click="downloadReportForTeam(classTeam)"
            >下载{{ classTeam.name }}报表</b-button
          >
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ClassTeam from "@/components/ClassTeam";
import { FETCH_STATS } from "../store/actions.type";
import store from "@/store";
import Parse from "parse";

export default {
  name: "ReportManagement",
  components: {
    ClassTeam
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
  beforeRouteEnter(to, from, next) {
    store.dispatch(FETCH_STATS, to.params).then(() => {
      next();
    });
  },
  methods: {
    downloadReportForTeam(classTeam) {
      console.log(
        `downloadReportForTeam - classTeam: ${classTeam} practiceId: ${this.classInfo.practiceId}`
      );
      const thisComponent = this;
      const classId = this.classInfo.id;
      const practiceId = this.classInfo.practiceId;
      const classTeams = classTeam ? [classTeam] : this.classTeams;
      Parse.Cloud.run("class:generateReport", {
        classId,
        classTeams,
        practiceId
      })
        .then(result => {
          console.log(`generateReport - result: ${JSON.stringify(result)}`);
        })
        .catch(e => {
          console.log(`error in generateReport: ${e}`);
          thisComponent.$dialog.alert(`error in generateReport: ${e}`);
        });
    },
    downloadReportForClass() {
      console.log(
        `downloadReportForClass - classId: ${this.classInfo.id} practiceId: ${this.classInfo.practiceId}`
      );
      this.downloadReportForTeam(undefined);
    }
  }
};
</script>
