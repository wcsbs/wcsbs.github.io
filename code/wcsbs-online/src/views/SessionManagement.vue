<template>
  <div>
    <div v-if="isLoadingSessions" class="classSession-preview">
      正在获取上课列表...
    </div>
    <div v-else>
      <h3 v-text="classInfo.name" />
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          aria-describedby="basic-addon2"
          v-model="filterText"
          v-on:change="filterSessions(filterText)"
          placeholder="搜索"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="clearFilter"
          >
            清除
          </button>
          <button
            v-if="isClassAdmin || isTeachingAssistant"
            class="btn btn-outline-secondary"
            type="button"
            @click="createSession"
          >
            {{ creatingSession ? "取消创建" : "创建新课" }}
          </button>
        </div>
      </div>
      <div v-if="classSessions.length === 0">
        没有找到上课记录！
      </div>
      <ClassSession
        v-if="creatingSession"
        :classInfo="classInfo"
        :classSession="newClassSession"
        :attendance="newAttendance"
        :newSessions="newSessions"
        :editing="true"
      />
      <ClassSession
        v-for="(classSession, index) in classSessions"
        :classSession="classSession"
        :attendance="attendances[index]"
        :key="classSession.id + index"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ClassSession from "@/components/ClassSession";
import { FETCH_SESSIONS, FILTER_SESSIONS } from "../store/actions.type";
import store from "@/store";

export default {
  name: "SessionManagement",
  components: {
    ClassSession
  },
  computed: {
    ...mapGetters([
      "isLoadingSessions",
      "classInfo",
      "classSessions",
      "attendances",
      "newSessions",
      "isClassAdmin",
      "isTeachingAssistant"
    ])
  },
  beforeRouteEnter(to, from, next) {
    // console.log(`beforeRouteEnter - to: ${JSON.stringify(to)}`);
    store.dispatch(FETCH_SESSIONS, to.params["buddhaClassId"]).then(() => {
      next();
    });
  },
  data: function() {
    return {
      filterText: "",
      creatingSession: false,
      newClassSession: { dummy: true },
      newAttendance: { dummy: true }
    };
  },
  methods: {
    filterSessions(filterText) {
      this.$store.dispatch(FILTER_SESSIONS, filterText);
    },
    clearFilter() {
      this.filterText = "";
      this.$store.dispatch(FILTER_SESSIONS, this.filterText);
    },
    createSession() {
      this.creatingSession = !this.creatingSession;
    }
  }
};
</script>
