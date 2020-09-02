<template>
  <div>
    <h3 v-text="buddhaClass.name" />
    <h4>辅导员：{{ teachers }} 师兄</h4>
    <b-button block variant="info" :href="buddhaClass.url" target="_blank"
      >学习资料网页</b-button
    >
    <div v-if="buddhaClass.classSessions.length === 0" class="user-preview">
      还没有开课，敬请期待！
    </div>
    <div v-else class="user-preview">
      <h4>正在闻思</h4>
      <ClassSession
        v-for="(classSession, index) in buddhaClass.classSessions"
        :classSession="classSession"
        :attendance="buddhaClass.attendances[index]"
        :key="classSession.id + index"
      />
      <b-button block variant="info" :href="buddhaClass.url" target="_blank"
        >查看上课记录</b-button
      >
      <h4 v-if="buddhaClass.practices.length > 0">正在实修</h4>
      <Practice
        v-for="(practice, index) in buddhaClass.practices"
        :practice="practice"
        :key="practice.id + index"
      />
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
    buddhaClass: { type: Object, required: true }
  },
  data: function() {
    return {
      teachers: this.buddhaClass.teachers.join()
    };
  },
  methods: {
    createUser() {
      this.$router.push({ name: "userCreate" });
    }
  }
};
</script>
