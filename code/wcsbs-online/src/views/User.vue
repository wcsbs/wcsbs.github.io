<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">用户信息</h1>
          <form @submit.prevent="updateUser()">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="user.username"
                  placeholder="用户名"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="user.name"
                  placeholder="姓名"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="email"
                  v-model="user.email"
                  placeholder="电邮地址"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="phone"
                  v-model="user.phone"
                  placeholder="电话号码"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  v-model="user.password"
                  placeholder="密码"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                更新用户信息
              </button>
              <router-link
                class="navbar-brand"
                :to="{ name: 'home-user-management' }"
              >
                返回
              </router-link>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ADMIN_FETCH_USER } from "@/store/actions.type";
import { UPDATE_USER_BY_ADMIN } from "@/store/actions.type";
import store from "@/store";

export default {
  name: "RwvUser",
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch(ADMIN_FETCH_USER, to.params.slug).then(() => {
      next();
    });
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    updateUser() {
      this.$store.dispatch(UPDATE_USER_BY_ADMIN, this.user).then(() => {
        // this.$router.push({ name: "home-user-management" });
      });
    }
  }
};
</script>
