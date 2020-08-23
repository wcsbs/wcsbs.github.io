import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Parse from "parse";

import { CHECK_AUTH } from "./store/actions.type";
import ApiService from "./common/api.service";
import DateFilter from "./common/date.filter";
import ErrorFilter from "./common/error.filter";

Vue.config.productionTip = false;
Vue.filter("date", DateFilter);
Vue.filter("error", ErrorFilter);

ApiService.init();
Parse.initialize(
  "ac8UZVIGoUpTW7dIF9no0KsaG8AvEWJV5ykCjJSS", // YOUR APP ID
  "07aVCHnW5psmgZ9fcSM54VAfTgsAwOTHud7HkyZH" // YOUR Javascript  KEY
);
// YOUR SERVER URL
Parse.serverURL = "https://parseapi.back4app.com";

// Ensure we checked auth before each page load.
router.beforeEach((to, from, next) =>
  Promise.all([store.dispatch(CHECK_AUTH)]).then(next)
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
