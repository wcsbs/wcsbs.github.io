import Parse from "parse";
import { FETCH_USERS } from "./actions.type";
import { ADMIN_FETCH_USER } from "./actions.type";
import {
  FETCH_USERS_START,
  FETCH_USERS_END,
  SET_USER,
  UPDATE_USER_IN_LIST
} from "./mutations.type";

const state = {
  user: {},
  users: [],
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
  [FETCH_USERS]({ commit }, params) {
    console.log(`${FETCH_USERS} - params: ${JSON.stringify(params)}`);
    commit(FETCH_USERS_START);
    Parse.Cloud.run("user:list", {})
      .then(users => {
        console.log(`${FETCH_USERS} - user: ${JSON.stringify(users)}`);
        commit(FETCH_USERS_END, users);
      })
      .catch(e => {
        console.log(`error loading user list: ${e.message}`);
        throw new Error(e);
      });
  },
  [ADMIN_FETCH_USER](context, userSlug) {
    console.log(`${ADMIN_FETCH_USER} - userSlug: ${userSlug}`);
    const adminFetchUser = "user:adminFetchUser";
    Parse.Cloud.run(adminFetchUser, { userSlug })
      .then(user => {
        console.log(`${ADMIN_FETCH_USER} - user: ${JSON.stringify(user)}`);
        context.commit(SET_USER, user);
      })
      .catch(e => {
        console.log(`error loading user: ${e.message}`);
        throw new Error(e);
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
    state.usersCount = usersCount;
    state.isLoadingUsers = false;
  },
  [UPDATE_USER_IN_LIST](state, data) {
    state.users = state.users.map(user => {
      if (user.slug !== data.slug) {
        return user;
      }
      // We could just return data, but it seems dangerous to
      // mix the results of different api calls, so we
      // protect ourselves by copying the information.
      user.favorited = data.favorited;
      user.favoritesCount = data.favoritesCount;
      return user;
    });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
