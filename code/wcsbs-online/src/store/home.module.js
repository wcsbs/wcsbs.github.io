import Parse from "parse";
import Toasted from "vue-toasted";
import Vue from "vue";
import { FETCH_DASHBOARDS } from "./actions.type";
import { FETCH_DASHBOARDS_START, FETCH_DASHBOARDS_END } from "./mutations.type";
import store from "./index";

Vue.use(Toasted);

const state = {
  home: {},
  isLoadingDashboards: true
};

const getters = {
  home(state) {
    return state.home;
  },
  isLoadingDashboards(state) {
    return state.isLoadingDashboards;
  }
};

function processAdminDashboard(dashboard) {
  var c, i;
  for (i = 0; i < dashboard.classes.length; i++) {
    c = dashboard.classes[i];
    c.classSnapshot = JSON.parse(c.snapshot.get("json"));

    c.attendances = c.attendances.map(e => JSON.parse(e.get("json")));
    c.counts = c.counts.map(e => JSON.parse(e.get("json")));
  }
}

const actions = {
  [FETCH_DASHBOARDS]({ commit }) {
    const user = store.state.auth.user;
    console.log(`${FETCH_DASHBOARDS} - auth.user: ${JSON.stringify(user)}`);
    commit(FETCH_DASHBOARDS_START);
    return new Promise((resolve, reject) => {
      Parse.Cloud.run("home:loadDashboards", { user })
        .then(result => {
          console.log(
            `${FETCH_DASHBOARDS} - result: ${JSON.stringify(result)}`
            // `${FETCH_DASHBOARDS} - result: ${result}`
          );
          if (result.systemAdminDashboard) {
            processAdminDashboard(result.systemAdminDashboard);
          }
          if (result.classAdminDashboard) {
            processAdminDashboard(result.classAdminDashboard);
          }
          commit(FETCH_DASHBOARDS_END, result);
          resolve();
        })
        .catch(e => {
          console.log(`error loading dashboards: ${e.message}`);
          reject();
        });
    });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_DASHBOARDS_START](state) {
    state.isLoadingDashboards = true;
  },
  [FETCH_DASHBOARDS_END](state, result) {
    state.home = result;
    state.isLoadingDashboards = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
