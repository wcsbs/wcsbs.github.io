<template>
  <div class="dashboard-preview">
    <router-link :to="dashboardLink" class="preview-link">
      <h3 v-text="dashboard.name" />
      <ul style="list-style-type:none">
        <li>Classess: {{ dashboard.classes }}</li>
      </ul>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "UserPreview",
  components: {},
  props: {
    dashboard: { type: Object, required: true }
  },
  computed: {
    dashboardLink() {
      return {
        name: "dashboard",
        params: {
          slug: this.dashboard.id
        }
      };
    }
  }
};
</script>
