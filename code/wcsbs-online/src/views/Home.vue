<template>
  <div class="home-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul
              class="nav nav-pills outline-active"
              style="list-style-type:none"
            >
              <li class="nav-item">
                <router-link
                  :to="{ name: 'home' }"
                  exact
                  class="nav-link"
                  active-class="active"
                  >最新信息</router-link
                >
              </li>
              <li v-if="isSystemAdmin" class="nav-item">
                <router-link
                  :to="{ name: 'home-user-management' }"
                  class="nav-link"
                  active-class="active"
                  >用户管理</router-link
                >
              </li>
              <li v-if="isClassAdmin" class="nav-item">
                <router-link
                  :to="{ name: 'home-my-feed' }"
                  class="nav-link"
                  active-class="active"
                  >课程管理</router-link
                >
              </li>
              <li v-if="isClassAdmin" class="nav-item">
                <router-link
                  :to="{ name: 'home-my-feed' }"
                  class="nav-link"
                  active-class="active"
                  >实修管理</router-link
                >
              </li>
              <li v-if="isStudent" class="nav-item">
                <router-link
                  :to="{ name: 'home-my-feed' }"
                  class="nav-link"
                  active-class="active"
                  >闻思修</router-link
                >
              </li>
              <li v-if="isTeachingAssistant" class="nav-item">
                <router-link
                  :to="{ name: 'home-my-feed' }"
                  class="nav-link"
                  active-class="active"
                  >课程助理</router-link
                >
              </li>
              <li class="nav-item pull-xs-right">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'settings' }"
                >
                  <i class="ion-gear-a"></i>&nbsp;{{ currentUser.name }}
                </router-link>
              </li>
            </ul>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
//import RwvTag from "@/components/VTag";
import { FETCH_TAGS } from "@/store/actions.type";

export default {
  name: "home",
  components: {
    //RwvTag
  },
  mounted() {
    this.$store.dispatch(FETCH_TAGS);
  },
  computed: {
    ...mapGetters([
      "currentUser",
      "isAuthenticated",
      "isSystemAdmin",
      "isClassAdmin",
      "isTeachingAssistant",
      "isStudent"
    ])
  }
};
</script>
