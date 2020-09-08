<template>
  <div>
    <div v-if="isLoadingDashboards">
      正在获取主页数据...
    </div>
    <div v-else>
      <div v-if="home.studentDashboard">
        <h2>{{ currentUser.name }}的闻思修</h2>
        <hr />
        <StudentDashboard :dashboard="home.studentDashboard" />
      </div>
      <div v-if="home.classAdminDashboard">
        <h2>{{ currentUser.name }}辅导的课程</h2>
        <hr />
        <AdminDashboard :dashboard="home.classAdminDashboard" />
      </div>
      <div v-if="home.systemAdminDashboard">
        <h2>学会全部课程</h2>
        <hr />
        <AdminDashboard :dashboard="home.systemAdminDashboard" />
      </div>
    </div>
  </div>
</template>

<script>
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { mapGetters } from "vuex";
import { FETCH_DASHBOARDS } from "../store/actions.type";
import store from "@/store";

export default {
  name: "Home",
  components: {
    StudentDashboard,
    AdminDashboard
  },
  computed: {
    ...mapGetters([
      "home",
      "currentUser",
      "isLoadingDashboards",
      "isSystemAdmin"
    ])
  },
  beforeRouteEnter(to, from, next) {
    console.log(`from: ${from.path}`);
    if (!from || !from.path || !from.path.startsWith("/home")) {
      store.dispatch(FETCH_DASHBOARDS).then(() => {
        next();
      });
    } else {
      next();
    }
  }
};
</script>
