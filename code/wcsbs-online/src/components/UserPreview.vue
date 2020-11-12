<template>
  <div class="user-preview">
    <router-link :to="userLink" class="preview-link">
      <h3 v-text="displayName()" />
      <ul style="list-style-type: none">
        <li>用户名：{{ user.username }}</li>
        <li>用户角色：{{ displayRoles() }}</li>
        <li>电邮地址：{{ user.email }}</li>
        <li>电话号码：{{ user.phone }}</li>
      </ul>
    </router-link>
  </div>
</template>

<script>
import user from "../store/user.module";

export default {
  name: "UserPreview",
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
  },
  methods: {
    displayName() {
      if (!this.user.state && this.user.emailVerified) {
        return this.user.name;
      }
      var state;
      if (this.user.state == "blocked") {
        state = "账号已禁用";
      } else if (!this.user.emailVerified) {
        state = "电邮地址待验证";
      } else {
        state = "密码需更改";
      }
      return `${this.user.name} (${state})`;
    },
    displayRoles() {
      return user.getDisplayRoles(this.user.roles);
    }
  }
};
</script>
