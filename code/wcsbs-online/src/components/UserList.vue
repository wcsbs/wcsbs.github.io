<template>
  <div>
    <div v-if="isLoadingUsers" class="user-preview">正在获取用户列表...</div>
    <div v-else>
      <div v-if="users.length === 0" class="user-preview">
        No users are here... yet.
      </div>
      <button @click="createUser" class="btn pull-xs-right">创建新用户</button>
      <VUserPreview v-for="(user, index) in users" :user="user" :key="index" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VUserPreview from "./VUserPreview";
import { FETCH_USERS } from "../store/actions.type";

export default {
  name: "UserList",
  components: {
    VUserPreview
  },
  computed: {
    ...mapGetters(["usersCount", "isLoadingUsers", "users"])
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      this.$store.dispatch(FETCH_USERS);
    },
    createUser() {
      this.$router.push({ name: "createUser" });
    }
  }
};
</script>
