<template>
  <div>
    <h3 v-text="buddhaClass.name" />
    <h4>辅导员：{{ teachers }} 师兄</h4>
    <b-button block variant="info" :href="buddhaClass.url" target="_blank"
      >学习资料总汇</b-button
    >
    <div v-if="buddhaClass.classSessions.length === 0" class="user-preview">
      还没有开课，敬请期待！
    </div>
    <div v-else class="user-preview">
      <ClassSession
        v-for="(classSession, index) in buddhaClass.classSessions"
        :classSession="classSession"
        :key="index"
      />
    </div>
  </div>
</template>

<script>
import ClassSession from "./ClassSession";

export default {
  name: "Class",
  components: {
    ClassSession
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
