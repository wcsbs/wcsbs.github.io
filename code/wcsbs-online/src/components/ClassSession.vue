<template>
  <div>
    <b-card class="text-center" :header="session.name">
      <b-card-text
        >上课时间：{{ session.scheduledAt.toLocaleString() }}
        <b-button :href="session.url" target="_blank">看传承/法本</b-button>
        <br />
        <b-form-textarea
          v-model="session.description"
          placeholder="Auto height textarea"
          rows="3"
          max-rows="8"
        ></b-form-textarea>
        <b-button>我要请假</b-button>
        <b-button>我要报考勤</b-button>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "ClassSession",
  props: {
    classSession: { type: Object, required: true }
  },
  data: function() {
    return {
      session: {
        id: this.classSession.get("objectId"),
        name: this.classSession.get("name"),
        url: this.classSession.get("url"),
        description: this.classSession.get("description"),
        scheduledAt: this.classSession.get("scheduledAt")
      }
    };
  },
  methods: {
    createUser() {
      this.$router.push({ name: "userCreate" });
    }
  }
};
</script>
