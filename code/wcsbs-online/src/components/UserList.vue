<template>
  <div>
    <div v-if="isLoadingUsers" class="user-preview">正在获取用户列表...</div>
    <div v-else>
      <div v-if="users.length === 0" class="user-preview">
        No users are here... yet.
      </div>
      <button
        v-else
        @click="createUser"
        class="btn btn-outline-danger pull-xs-right"
      >
        创建新用户
      </button>
      <input
        v-model="filterText"
        v-on:change="filterUsers(filterText)"
        type="text"
        placeholder="搜索用户"
      />
      <button @click="clearFilter">
        清除
      </button>
      <VUserPreview v-for="(user, index) in users" :user="user" :key="index" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VUserPreview from "./VUserPreview";
import { FETCH_USERS, FILTER_USERS } from "../store/actions.type";

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
  data: function() {
    return {
      filterText: ""
    };
  },
  methods: {
    fetchUsers() {
      this.$store.dispatch(FETCH_USERS);
    },
    filterUsers(filterText) {
      this.$store.dispatch(FILTER_USERS, filterText);
    },
    clearFilter() {
      this.filterText = "";
      this.$store.dispatch(FILTER_USERS, this.filterText);
    },
    createUser() {
      this.$router.push({ name: "createUser" });
    }
  }
};
</script>
