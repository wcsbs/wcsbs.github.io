<template>
  <div>
    <b-card class="text-center" :header="classTeam.name">
      <b-card-text v-if="classTeam.dummy">
        将删除 {{ classTeam.members.length }} 名学员
      </b-card-text>
      <b-card-text v-else-if="classTeam.id == null">
        共有 {{ classTeam.members.length }} 名学员未分组
      </b-card-text>
      <b-card-text v-else>
        本组共有 {{ classTeam.members.length }} 名学员
      </b-card-text>
      <b-input-group
        v-for="(member, index) in classTeam.members"
        :key="member.id + index"
        :prepend="
          classTeam.id == null || classTeam.dummy
            ? '学员'
            : !classTeam.dummy && index == 0
            ? '组长：'
            : '组员：'
        "
        class="mt-3"
      >
        <b-form-input
          readonly
          :value="`(${index + 1}) ${member.name}`"
        ></b-form-input>
        <b-input-group-append>
          <b-form-select
            v-if="classTeam.id == null"
            v-model="member.assignedTeamId"
            :options="classTeamOptions"
            v-on:change="assignTeam($event, index)"
          ></b-form-select>
          <b-button
            v-if="!classTeam.dummy && classTeam.id && index > 0"
            variant="info"
            v-on:click="setLeader(index)"
            >设为组长</b-button
          >
          <b-button variant="warning" v-on:click="removeMember(index)">{{
            classTeam.dummy ? "恢复" : "删除"
          }}</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { RESET_STUDENTS } from "../store/actions.type";

export default {
  name: "ClassTeam",
  props: {
    classTeam: { type: Object, required: true }
  },
  data: function() {
    return {
      canAddSubmodule: false
    };
  },
  computed: {
    ...mapGetters([
      "classInfo",
      "classTeams",
      "classTeamsChanged",
      "classTeamOptions",
      "removedStudents"
    ])
  },
  mounted() {
    this.refreshUI();
  },
  methods: {
    assignTeam(value, index) {
      console.log(`selected: ${value} index: ${index}`);
      const member = this.classTeam.members[index];
      this.classTeam.members.splice(index, 1);

      for (var i = 0; i < this.classTeams.length; i++) {
        const team = this.classTeams[i];
        if (team.id == member.assignedTeamId) {
          member.assignedTeamId = null;
          team.members.push(member);
          break;
        }
      }
      this.$store.dispatch(RESET_STUDENTS, { changed: true });
    },
    removeMember(index) {
      const member = this.classTeam.members[index];
      this.classTeam.members.splice(index, 1);

      if (this.classTeam.id) {
        this.classTeams[0].members.push(member);
      } else {
        this.removedStudents.push(member);
      }

      this.$store.dispatch(RESET_STUDENTS, { changed: true });
    },
    setLeader(index) {
      const member = this.classTeam.members[index];
      this.classTeam.members.splice(index, 1);
      this.classTeam.members.splice(0, 0, member);

      this.$store.dispatch(RESET_STUDENTS, { changed: true });
    },
    refreshUI() {}
  }
};
</script>
