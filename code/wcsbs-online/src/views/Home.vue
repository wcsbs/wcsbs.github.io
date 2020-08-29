<template>
  <div>
    <div v-if="isLoadingDashboards" class="user-preview">
      正在获取主页数据...
    </div>
    <div v-else>
      <div v-if="home.studentDashboard" class="user-preview">
        <StudentDashboard :dashboard="home.studentDashboard" />
      </div>
      <div v-else><h1>TODO</h1></div>
    </div>
  </div>
</template>

<script>
import StudentDashboard from "@/components/StudentDashboard";
import { mapGetters } from "vuex";
import { FETCH_DASHBOARDS } from "../store/actions.type";
import store from "@/store";

export default {
  name: "Home",
  components: {
    StudentDashboard
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
  },
  computed: {
    ...mapGetters(["home", "isLoadingDashboards"])
  },
  mounted() {
    //this.$forceUpdate();
  }
};
</script>
