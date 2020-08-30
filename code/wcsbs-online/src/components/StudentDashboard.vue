<template>
  <div class="user-preview">
    <div v-if="dashboard.classes.length === 0" class="user-preview">
      您还没有参加任何佛学课程！
    </div>
    <Class
      v-else
      v-for="(buddhaClass, index) in dashboard.classes"
      :buddhaClass="buddhaClass"
      :key="index"
    />
  </div>
</template>

<script>
import Class from "./Class";

export default {
  name: "StudentDashboard",
  props: {
    dashboard: { type: Object, required: true }
  },
  components: {
    Class
  }
};
</script>
