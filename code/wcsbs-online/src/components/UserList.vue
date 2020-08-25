<template>
  <div>
    <div v-if="isLoadingUsers" class="user-preview">正在获取用户列表...</div>
    <div v-else>
      <div v-if="users.length === 0" class="user-preview">
        No users are here... yet.
      </div>
      <VUserPreview v-for="user in users" :user="user" :key="user.id" />
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
    }
  }
};
</script>
