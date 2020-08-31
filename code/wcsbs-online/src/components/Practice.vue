<template>
  <div>
    <b-card class="text-center" :header="practiceObj.name">
      <b-card-text>
        <b-input-group prepend="最新报数：" class="mt-3">
          <b-form-input
            readonly
            v-model="practiceObj.practiceReportingState"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="warning">我要报数</b-button>
            <b-button
              variant="info"
              v-on:click="
                practiceObj.showDescription = !practiceObj.showDescription
              "
            >
              {{
                practiceObj.showDescription ? "收起详情" : "显示详情"
              }}</b-button
            >
          </b-input-group-append>
        </b-input-group>
        <b-form-textarea
          v-if="practiceObj.showDescription"
          v-model="practiceObj.description"
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
  name: "Practice",
  props: {
    practice: { type: Object, required: true }
  },
  data: function() {
    return {
      practiceObj: {
        id: this.practice.get("objectId"),
        name: this.practice.get("name"),
        description: this.practice.get("description"),
        showDescription: false,
        practiceReportingState: "未报数"
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
    }
  }
};
</script>
