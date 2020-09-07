import Parse from "parse";
import Toasted from "vue-toasted";
import Vue from "vue";
import {
  FETCH_SESSIONS,
  FETCH_PRACTICE_COUNTS,
  FILTER_SESSIONS,
  UPDATE_SESSION
} from "./actions.type";
import {
  FETCH_SESSIONS_START,
  FETCH_SESSIONS_END,
  FILTER_SESSIONS_IN_LIST,
  FETCH_PRACTICE_COUNTS_START,
  FETCH_PRACTICE_COUNTS_END
} from "./mutations.type";

Vue.use(Toasted);

const state = {
  classSession: {},
  classSessions: [],
  newSessions: [],
  attendances: [],
  classInfo: {},
  practiceInfo: {},
  isLoadingSessions: false,
  isLoadingPracticeCounts: false
};

const getters = {
  classInfo(state) {
    return state.classInfo;
  },
  classSession(state) {
    return state.classSession;
  },
  attendances(state) {
    return state.attendances;
  },
  classSessions(state) {
    return state.classSessions;
  },
  newSessions(state) {
    return state.newSessions;
  },
  isLoadingSessions(state) {
    return state.isLoadingSessions;
  },
  isLoadingPracticeCounts(state) {
    return state.isLoadingPracticeCounts;
  },
  practiceInfo(state) {
    return state.practiceInfo;
  }
};

const actions = {
  [FETCH_SESSIONS](context, classId) {
    console.log(`${FETCH_SESSIONS} - classId: ${classId}`);
    context.commit(FETCH_SESSIONS_START);

    const fetchSessions = "class:fetchSessions";
    Parse.Cloud.run(fetchSessions, { classId })
      .then(classInfo => {
        console.log(
          `${FETCH_SESSIONS} - #classSessions: ${classInfo.classSessions.length}`
        );
        context.commit(FETCH_SESSIONS_END, classInfo);
      })
      .catch(e => {
        // console.log(`error loading classSession list: ${e.message}`);
        console.log(`error loading classSession list: ${JSON.stringify(e)}`);
        throw new Error(e);
      });
  },
  [FETCH_PRACTICE_COUNTS](context, practiceId) {
    console.log(`${FETCH_PRACTICE_COUNTS} - practiceId: ${practiceId}`);
    context.commit(FETCH_PRACTICE_COUNTS_START);

    const fetchPracticeCounts = "class:fetchPracticeCounts";
    Parse.Cloud.run(fetchPracticeCounts, { practiceId })
      .then(practiceInfo => {
        console.log(
          `${FETCH_PRACTICE_COUNTS} - #practiceCount: ${practiceInfo.counts.length}`
        );
        context.commit(FETCH_PRACTICE_COUNTS_END, practiceInfo);
      })
      .catch(e => {
        // console.log(`error loading classSession list: ${e.message}`);
        console.log(`error loading practice counts: ${JSON.stringify(e)}`);
        throw new Error(e);
      });
  },
  [FILTER_SESSIONS](context, filterText) {
    console.log(
      `${FILTER_SESSIONS} - filterText: ${JSON.stringify(filterText)}`
    );
    context.commit(FILTER_SESSIONS_IN_LIST, filterText);
  },
  [UPDATE_SESSION](classSessionToUpdate) {
    console.log(
      `${UPDATE_SESSION} - classSessionToUpdate: ${JSON.stringify(
        classSessionToUpdate
      )}`
    );
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_PRACTICE_COUNTS_START](state) {
    state.isLoadingPracticeCounts = true;
  },
  [FETCH_PRACTICE_COUNTS_END](state, practiceInfo) {
    state.practiceInfo = practiceInfo;
    state.isLoadingPracticeCounts = false;
  },
  [FETCH_SESSIONS_START](state) {
    state.isLoadingSessions = true;
  },
  [FETCH_SESSIONS_END](state, classInfo) {
    state.classInfo = classInfo;
    state.classSessions = [];
    state.newSessions = [];
    state.attendances = [];
    for (var i = 0; i < classInfo.classSessions.length; i++) {
      const s = classInfo.classSessions[i];
      if (s.get("scheduledAt")) {
        state.classSessions.push(s);
        state.attendances.push(classInfo.attendances[i]);
      } else {
        state.newSessions.push({
          id: s.id,
          name: s.get("name")
        });
      }
    }
    state.newSessions.sort((s1, s2) => {
      var a = parseInt(s1.name.match(/(\d+)/)[0]);
      var b = parseInt(s2.name.match(/(\d+)/)[0]);
      return a > b ? 1 : b > a ? -1 : 0;
    });

    state.isLoadingSessions = false;
  },
  [FILTER_SESSIONS_IN_LIST](state, filterText) {
    state.classSessions = [];
    state.attendances = [];

    for (var i = 0; i < state.classInfo.classSessions.length; i++) {
      const s = state.classInfo.classSessions[i];
      if (s.get("scheduledAt")) {
        if (
          !filterText ||
          filterText == "" ||
          s
            .get("name")
            .toLowerCase()
            .includes(filterText.toLowerCase())
        ) {
          state.classSessions.push(s);
          state.attendances.push(state.classInfo.attendances[i]);
        }
      }
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
