<template>
  <div>
    <h3 v-text="buddhaClass.name" />
    <h4>
      <center>
        <ul style="list-style-type:none">
          <li>辅导员：{{ teachers }} 师兄</li>
          <li v-if="buddhaClass.snapshotObj">
            学生人数：{{ buddhaClass.snapshotObj.studentCount }}
          </li>
          <li>
            学习资料：
            <a :href="buddhaClass.url" target="_blank">网页链接</a>
          </li>
        </ul>
      </center>
    </h4>
    <div v-if="forApplication">
      <b-button block variant="info" @click="listSession">查看详情</b-button>
      <hr />
    </div>
    <div v-else>
      <div v-if="buddhaClass.classSessions.length === 0">
        还没有开课，敬请期待！
      </div>
      <div v-else>
        <h4>正在闻思</h4>
        <ClassSession
          v-for="(classSession, index) in buddhaClass.classSessions"
          :classSession="classSession"
          :attendance="buddhaClass.attendances[index]"
          :key="classSession.id + index"
          :forApplication="forApplication"
        />
        <b-button block variant="info" @click="listSession"
          >查看上课记录</b-button
        >
        <hr />
        <h4 v-if="buddhaClass.practices.length > 0">正在实修</h4>
        <Practice
          v-for="(practice, index) in buddhaClass.practices"
          :practice="practice"
          :latestPracticeCount="buddhaClass.counts[index]"
          :key="practice.id + index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ClassSession from "./ClassSession";
import Practice from "./Practice";

export default {
  name: "Class",
  components: {
    ClassSession,
    Practice
  },
  props: {
    buddhaClass: { type: Object, required: true },
    forApplication: Boolean
  },
  data: function() {
    return {
      teachers: this.buddhaClass.teachers.join()
    };
  },
  methods: {
    listSession() {
      this.$router.push({
        name: "session-management",
        params: {
          classId: this.buddhaClass.id,
          forApplication: this.forApplication
        }
      });
    }
  }
};
</script>
