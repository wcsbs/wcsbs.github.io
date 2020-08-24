<template>
  <div class="user-preview">
    <router-link :to="userLink" class="preview-link">
      <h6 v-text="user.name" />
      <ul style="list-style-type:none">
        <li>电邮地址：{{ user.email }}</li>
        <li>电话号码：{{ user.phone }}</li>
      </ul>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "VUserPreview",
  components: {},
  props: {
    user: { type: Object, required: true }
  },
  computed: {
    userLink() {
      return {
        name: "user",
        params: {
          slug: this.user.id
        }
      };
    }
  }
};
</script>
