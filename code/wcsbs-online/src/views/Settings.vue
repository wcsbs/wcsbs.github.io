<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">我的个人信息</h1>
          <form @submit.prevent="updateSettings()">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="currentUser.name"
                  placeholder="姓名"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="phone"
                  v-model="currentUser.phone"
                  placeholder="电话"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  v-model="currentUser.password"
                  placeholder="密码"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                更新个人信息
              </button>
              <router-link class="navbar-brand" :to="{ name: 'home' }">
                返回
              </router-link>
            </fieldset>
          </form>
          <!-- Line break for logout button -->
          <hr />
          <button @click="logout" class="btn btn-outline-danger pull-xs-right">
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT, UPDATE_USER } from "@/store/actions.type";

export default {
  name: "RwvSettings",
  computed: {
    ...mapGetters(["currentUser"])
  },
  methods: {
    updateSettings() {
      this.$store.dispatch(UPDATE_USER, this.currentUser).then(() => {
        // #todo, nice toast and no redirect
        this.$router.push({ name: "home" });
      });
    },
    logout() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({ name: "home" });
      });
    }
  }
};
</script>
