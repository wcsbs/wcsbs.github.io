<template>
  <div>
    <div v-if="isLoadingUsers" class="user-preview">Loading users...</div>
    <div v-else>
      <div v-if="users.length === 0" class="user-preview">
        No users are here... yet.
      </div>
      <VUserPreview
        v-for="(user, index) in users"
        :user="user"
        :key="user.id + index"
      />
      <VPagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VUserPreview from "./VUserPreview";
import VPagination from "./VPagination";
import { FETCH_USERS } from "../store/actions.type";

export default {
  name: "UserList",
  components: {
    VUserPreview,
    VPagination
  },
  props: {
    itemsPerPage: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  computed: {
    listConfig() {
      const { type } = this;
      const filters = {
        offset: (this.currentPage - 1) * this.itemsPerPage,
        limit: this.itemsPerPage
      };
      return {
        type,
        filters
      };
    },
    pages() {
      if (this.isLoadingUsers || this.usersCount <= this.itemsPerPage) {
        return [];
      }
      return [
        ...Array(Math.ceil(this.usersCount / this.itemsPerPage)).keys()
      ].map(e => e + 1);
    },
    ...mapGetters(["usersCount", "isLoadingUsers", "users"])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.offset = (newValue - 1) * this.itemsPerPage;
      this.fetchUsers();
    }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      this.$store.dispatch(FETCH_USERS, this.listConfig);
    },
    resetPagination() {
      this.listConfig.offset = 0;
      this.currentPage = 1;
    }
  }
};
</script>
