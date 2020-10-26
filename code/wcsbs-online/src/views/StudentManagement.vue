<template>
  <div>
    <div v-if="isLoadingStudents">
      正在获取学员详情...
    </div>
    <div v-else>
      <h3>{{ classInfo.name }} -- 学员管理</h3>
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          aria-describedby="basic-addon2"
          v-model="filterText"
          v-on:change="filterStudents(filterText)"
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
          <b-button
            variant="warning"
            v-if="isClassAdmin || isSystemAdmin"
            @click="createClassTeam"
            >{{ creatingClassTeam ? "取消创建" : "创建新组" }}</b-button
          >
        </div>
      </div>
      <div v-if="classTeams.length === 0">
        没有找到学员记录！
      </div>
      <ClassTeam
        v-if="creatingClassTeam"
        :classInfo="classInfo"
        :classTeam="newClassTeam"
      />
      <ClassTeam
        v-for="(classTeam, index) in classTeams"
        :classInfo="classInfo"
        :forAdmin="classInfo.forAdmin"
        :classTeam="classTeam"
        :key="classTeam.id + index"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ClassTeam from "@/components/ClassTeam";
import { FETCH_STUDENTS, FILTER_STUDENTS } from "../store/actions.type";
import store from "@/store";

export default {
  name: "StudentManagement",
  components: {
    ClassTeam
  },
  computed: {
    ...mapGetters([
      "isLoadingStudents",
      "classInfo",
      "classTeams",
      "isClassAdmin",
      "isSystemAdmin",
      "isStudent"
    ])
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch(FETCH_STUDENTS, to.params).then(() => {
      next();
    });
  },
  data: function() {
    return {
      filterText: "",
      creatingClassTeam: false,
      newClassTeam: { dummy: true }
    };
  },
  methods: {
    filterStudents(filterText) {
      this.$store.dispatch(FILTER_STUDENTS, filterText);
    },
    clearFilter() {
      this.filterText = "";
      this.$store.dispatch(FILTER_STUDENTS, this.filterText);
    },
    createClassTeam() {
      this.creatingClassTeam = !this.creatingClassTeam;
    }
  }
};
</script>
