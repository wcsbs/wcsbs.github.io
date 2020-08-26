import Parse from "parse";
import Toasted from "vue-toasted";
import Vue from "vue";
import {
  FETCH_USERS,
  FILTER_USERS,
  UPDATE_USER_BY_ADMIN,
  ADMIN_FETCH_USER
} from "./actions.type";
import {
  FETCH_USERS_START,
  FETCH_USERS_END,
  SET_USER,
  FILTER_USERS_IN_LIST
} from "./mutations.type";
import store from "./index";

Vue.use(Toasted);

const state = {
  user: {},
  users: [],
  allUsers: [],
  isLoadingUsers: true,
  usersCount: 0
};

const getters = {
  user(state) {
    return state.user;
  },
  usersCount(state) {
    return state.usersCount;
  },
  users(state) {
    return state.users;
  },
  isLoadingUsers(state) {
    return state.isLoadingUsers;
  }
};

const actions = {
  [FETCH_USERS]({ commit }) {
    const user = store.state.auth.user;
    console.log(`${FETCH_USERS} - auth.user: ${JSON.stringify(user)}`);
    commit(FETCH_USERS_START);
    Parse.Cloud.run("user:list", { user })
      .then(users => {
        console.log(`${FETCH_USERS} - users: ${JSON.stringify(users)}`);
        commit(FETCH_USERS_END, users);
      })
      .catch(e => {
        console.log(`error loading user list: ${e.message}`);
        throw new Error(e);
      });
  },
  [FILTER_USERS](context, filterText) {
    console.log(`${FILTER_USERS} - filterText: ${JSON.stringify(filterText)}`);
    context.commit(FILTER_USERS_IN_LIST, filterText);
  },
  [ADMIN_FETCH_USER](context, userSlug) {
    console.log(`${ADMIN_FETCH_USER} - userSlug: ${userSlug}`);
    if (!userSlug) {
      context.commit(SET_USER, {});
      return;
    }

    const user = store.state.auth.user;
    console.log(`${ADMIN_FETCH_USER} - auth.user: ${JSON.stringify(user)}`);
    const adminFetchUser = "user:adminFetchUser";
    Parse.Cloud.run(adminFetchUser, { user, userSlug })
      .then(user => {
        console.log(`${ADMIN_FETCH_USER} - user: ${JSON.stringify(user)}`);

        // default user role is StudentUser
        user.isStudent =
          user.roles.length == 0 || user.roles.includes("StudentUser");
        user.isTeachingAssistant = user.roles.includes("TeachingAssistantUser");
        user.isClassAdmin = user.roles.includes("ClassAdminUser");
        user.isSystemAdmin = user.roles.includes("B4aAdminUser");

        context.commit(SET_USER, user);
      })
      .catch(e => {
        console.log(`error loading user: ${e.message}`);
        throw new Error(e);
      });
  },
  [UPDATE_USER_BY_ADMIN](context, userToUpdate) {
    const user = store.state.auth.user;
    console.log(`${UPDATE_USER_BY_ADMIN} - auth.user: ${JSON.stringify(user)}`);
    console.log(
      `${UPDATE_USER_BY_ADMIN} - userToUpdate: ${JSON.stringify(userToUpdate)}`
    );
    const adminUpdateUser = "user:adminUpdateUser";
    const password = userToUpdate.password;
    const confirmPassword = userToUpdate.confirmPassword;

    return new Promise((resolve, reject) => {
      if (password && password.length < 6) {
        Vue.toasted.error("密码不可以少于6位！", { duration: 5000 });
        reject();
        return;
      } else if (password && password != confirmPassword) {
        Vue.toasted.error("密码和确认密码不匹配！", { duration: 5000 });
        reject();
        return;
      }
      Parse.Cloud.run(adminUpdateUser, { user, userToUpdate })
        .then(user => {
          context.commit(SET_USER, user);
          Vue.toasted.show("更新成功！", { icon: "check", duration: 5000 });
          resolve();
        })
        .catch(e => {
          Vue.toasted.error(`更新失败！${e.message}`, { duration: 5000 });
          console.log(`error updating user: ${e.message}`);
          reject();
        });
    });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_USER](state, user) {
    state.user = user;
  },
  [FETCH_USERS_START](state) {
    state.isLoadingUsers = true;
  },
  [FETCH_USERS_END](state, { users, usersCount }) {
    state.users = users;
    state.allUsers = users;
    state.usersCount = usersCount;
    state.isLoadingUsers = false;
  },
  [FILTER_USERS_IN_LIST](state, filterText) {
    if (!filterText || filterText == "") {
      state.users = state.allUsers;
    } else {
      state.users = state.allUsers.filter(user => {
        const text = `${user.name}\t${user.username}\t${user.email}\t${user.phone}`;
        return text.toLowerCase().includes(filterText.toLowerCase());
      });
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};