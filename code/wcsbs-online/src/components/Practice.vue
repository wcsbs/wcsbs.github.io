<template>
  <div>
    <b-card class="text-center" :header="practiceObj.name">
      <b-card-text>
        <b-input-group prepend="最新报数：" class="mt-3">
          <b-form-input
            readonly
            v-model="practiceCountObj.latestCount"
          ></b-form-input>
        </b-input-group>
        <b-input-group prepend="总计报数：" class="mt-3">
          <b-form-input
            readonly
            v-model="practiceCountObj.accumulatedCount"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="warning" v-on:click="toggleReportingCount()">
              {{ practiceObj.showReportingCount ? "完成报数" : "我要报数" }}
            </b-button>
            <b-button
              variant="info"
              v-on:click="
                practiceObj.showDescription = !practiceObj.showDescription
              "
            >
              <b-icon
                v-if="practiceObj.showDescription"
                icon="chevron-double-up"
              ></b-icon>
              <b-icon v-else icon="chevron-double-down"></b-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <b-form @submit="onSubmit" v-if="practiceObj.showReportingCount">
          <b-input-group prepend="选择日期：" class="mt-3">
            <v-date-picker
              v-model="practiceObj.newCountReportedAt"
              :input-props="{
                readonly: true
              }"
            />
          </b-input-group>
          <b-input-group prepend="输入报数：" class="mt-3">
            <b-form-input
              id="input-count"
              v-model="practiceObj.newCount"
              type="number"
              required
              placeholder="输入报数"
            ></b-form-input>
            <b-input-group-append>
              <b-button type="submit" variant="primary">提交</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form>
        <b-form-textarea
          v-if="practiceObj.showDescription"
          v-model="practiceObj.description"
          placeholder="Auto height textarea"
          rows="3"
          max-rows="8"
        ></b-form-textarea>
        <b-button block variant="info" href="" target="_blank"
          >查看报数记录</b-button
        >
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import Parse from "parse";

export default {
  name: "Practice",
  components: {
    DatePicker
  },
  props: {
    practice: { type: Object, required: true },
    practiceCount: { type: Object, required: true }
  },
  data: function() {
    return {
      practiceObj: {
        name: this.practice.get("name"),
        description: this.practice.get("description"),
        showDescription: false,
        showReportingCount: false,
        newCountReportedAt: "",
        newCount: ""
      },
      practiceCountObj: {
        latestCount: this.practiceCount.dummy
          ? "未报数"
          : `${this.practiceCount.get("count")} @ ${this.toLocalDateString(
              this.practiceCount.get("reportedAt")
            )}`,
        accumulatedCount: this.practiceCount.dummy
          ? "未报数"
          : this.practiceCount.get("accumulatedCount")
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
    toLocalDateString(date) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric"
      };
      return date.toLocaleDateString("zh-CN", options);
    },
    toggleReportingCount() {
      this.practiceObj.showReportingCount = !this.practiceObj
        .showReportingCount;
      this.practiceObj.newCountReportedAt = undefined;
      this.practiceObj.newCount = undefined;
    },
    onSubmit(evt) {
      evt.preventDefault();
      const options = {
        okText: "确认",
        cancelText: "取消"
      };
      const message = {
        title: this.practiceObj.name,
        body: `新增报数${this.practiceObj.newCount} @ ${this.toLocalDateString(
          this.practiceObj.newCountReportedAt
        )}？`
      };
      const practiceId = this.practice.id;
      const reportedAt = this.practiceObj.newCountReportedAt;
      const count = parseInt(this.practiceObj.newCount);
      const thisComponent = this;

      console.log(
        `home:reportPracticeCount - practiceId: ${practiceId} reportedAt: ${reportedAt} count: ${count}`
      );

      this.$dialog
        .confirm(message, options)
        .then(function(dialog) {
          console.log(`${JSON.stringify(dialog)}`);
          Parse.Cloud.run("home:reportPracticeCount", {
            practiceId,
            reportedAt,
            count
          })
            .then(result => {
              console.log(
                `reportPracticeCount - result: ${JSON.stringify(result)}`
              );

              thisComponent.practiceCountObj = {
                latestCount: `${result.get(
                  "count"
                )} @ ${thisComponent.toLocalDateString(
                  result.get("reportedAt")
                )}`,
                accumulatedCount: result.get("accumulatedCount")
              };
            })
            .catch(e => {
              console.log(`error in updateAttendance: ${e}`);
            });
        })
        .catch(e => {
          console.log(`error: ${e}`);
        });
    }
  }
};
</script>
