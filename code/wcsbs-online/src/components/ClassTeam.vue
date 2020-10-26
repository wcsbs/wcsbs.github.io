<template>
  <div>
    <b-card class="text-center" :header="classTeam.name">
      <b-card-text>
        <b-input-group
          v-for="(member, index) in classTeam.members"
          :key="member.id + index"
          :prepend="classTeam.leader && index == 0 ? '组长：' : '组员：'"
          class="mt-3"
        >
          <b-form-input
            readonly
            :value="`(${index + 1}) ${member.name}`"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="warning" v-on:click="removeMember(index)"
              >删除</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import Parse from "parse";
import { mapGetters } from "vuex";

export default {
  name: "ClassTeam",
  props: {
    classInfo: { type: Object, required: true },
    classTeam: { type: Object, required: true },
    forAdmin: Boolean
  },
  data: function() {
    return {
      canAddSubmodule: false
    };
  },
  computed: {
    ...mapGetters(["isClassAdmin", "isTeachingAssistant", "classTeams"])
  },
  mounted() {
    this.refreshUI();
  },
  methods: {
    removeMember(index) {
      const member = this.classTeam.members[index];
      this.classTeam.members.splice(index, 1);
      this.classTeams[0].members.push(member);
    },
    refreshUI() {}
  }
};
</script>
