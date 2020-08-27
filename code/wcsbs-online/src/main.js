import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Parse from "parse";

import { CHECK_AUTH } from "./store/actions.type";
import DateFilter from "./common/date.filter";
import ErrorFilter from "./common/error.filter";

Vue.config.productionTip = false;
Vue.filter("date", DateFilter);
Vue.filter("error", ErrorFilter);

Parse.initialize(
  "ac8UZVIGoUpTW7dIF9no0KsaG8AvEWJV5ykCjJSS", // YOUR APP ID
  "07aVCHnW5psmgZ9fcSM54VAfTgsAwOTHud7HkyZH" // YOUR Javascript  KEY
);
// YOUR SERVER URL
Parse.serverURL = "https://parseapi.back4app.com";

// Ensure we checked auth before each page load.
router.beforeEach((to, from, next) => {
  Promise.all([store.dispatch(CHECK_AUTH)]).then(() => {
    if (
      store.state.auth &&
      store.state.auth.user.state == "needToChangePassword" &&
      to.path != "/profile"
    ) {
      next({
        path: "/profile",
        query: { redirect: to.fullPath }
      });
    } else if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!Parse.User.current()) {
        next({
          path: "/login",
          query: { redirect: to.fullPath }
        });
      } else {
        next();
      }
    } else {
      next(); // make sure to always call next()!
    }
  });
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
