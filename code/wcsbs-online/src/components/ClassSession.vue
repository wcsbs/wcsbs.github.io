<template>
  <div>
    <b-card class="text-center" :header="session.name">
      <b-card-text>
        上课时间：{{ session.scheduledAtLocalDateTimeString }}
        <b-input-group prepend="课前准备：" class="mt-3">
          <b-form-input readonly v-model="session.materialState"></b-form-input>
          <b-input-group-append>
            <b-button variant="info" :href="session.url" target="_blank"
              >看传承/法本</b-button
            >
          </b-input-group-append>
        </b-input-group>
        <b-input-group prepend="个人出勤：" class="mt-3">
          <b-form-input
            readonly
            v-model="session.attendanceState"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="warning">{{ attendanceButtonName() }}</b-button>
            <b-button
              variant="info"
              v-on:click="session.showDescription = !session.showDescription"
            >
              {{
                session.showDescription ? "收起上课通知" : "显示上课通知"
              }}</b-button
            >
          </b-input-group-append>
        </b-input-group>
        <b-form-textarea
          v-if="session.showDescription"
          v-model="session.description"
          placeholder="Auto height textarea"
          rows="3"
          max-rows="8"
        ></b-form-textarea>
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
        scheduledAtLocalDateTimeString: this.toLocalDateTimeString(
          this.classSession.get("scheduledAt")
        ),
        showDescription: false,
        attendanceState: "未报考勤",
        materialState: "未看传承/未看法本"
      }
    };
  },
  methods: {
    toLocalDateTimeString(date) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };
      return date.toLocaleDateString("zh-CN", options);
    },
    attendanceButtonName() {
      const d = new Date();
      if (d < this.classSession.get("scheduledAt")) {
        return "我要请假";
      } else {
        return "我要报考勤";
      }
    }
  }
};
</script>
