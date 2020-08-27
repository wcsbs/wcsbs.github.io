<template>
  <div>
    <div v-if="isLoadingUsers" class="user-preview">正在获取用户列表...</div>
    <div v-else>
      <button @click="createUser" class="btn btn-outline-danger pull-xs-right">
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
      <div v-if="users.length === 0" class="user-preview">
        没有找到用户！
      </div>
      <VUserPreview
        v-else
        v-for="(user, index) in users"
        :user="user"
        :key="index"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VUserPreview from "./VUserPreview";
import { FILTER_USERS } from "../store/actions.type";

export default {
  name: "UserList",
  components: {
    VUserPreview
  },
  computed: {
    ...mapGetters(["usersCount", "isLoadingUsers", "users"])
  },
  mounted() {
    this.filterText = "";
  },
  data: function() {
    return {
      filterText: ""
    };
  },
  methods: {
    filterUsers(filterText) {
      this.$store.dispatch(FILTER_USERS, filterText);
    },
    clearFilter() {
      this.filterText = "";
      this.$store.dispatch(FILTER_USERS, this.filterText);
    },
    createUser() {
      this.$router.push({ name: "userCreate" });
    }
  }
};
</script>
