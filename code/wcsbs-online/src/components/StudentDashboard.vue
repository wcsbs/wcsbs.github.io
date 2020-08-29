<template>
  <div class="user-preview">
    <h3 v-text="dashboard.name" />
    <ul style="list-style-type:none">
      <li>Classess: {{ dashboard.classes }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "StudentDashboard",
  props: {
    dashboard: { type: Object, required: true }
  }
};
</script>
