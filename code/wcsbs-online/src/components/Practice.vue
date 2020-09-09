<template>
  <div>
    <b-card class="text-center" :header="practiceObj.name">
      <b-card-text>
        <b-input-group
          :prepend="practiceCountObj.countStats ? '统计日期：' : '最新报数：'"
          class="mt-3"
        >
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
            <b-button
              v-if="isStudent"
              variant="warning"
              v-on:click="toggleReportingCount()"
              >{{
                practiceObj.showReportingCount ? "完成报数" : "我要报数"
              }}</b-button
            >
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
              :min-date="minDateForCountReporting()"
              :max-date="new Date()"
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
        <div v-if="practiceCounts">
          <h5>总计有 {{ items.length }} 条报数记录</h5>
          <b-table striped hover :items="items" :fields="fields"></b-table>
        </div>
      </b-card-text>
    </b-card>
    <b-button
      v-if="!practiceCounts"
      block
      variant="info"
      @click="listPracticeCount"
      >查看详情</b-button
    >
    <hr />
  </div>
</template>

<script>
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import Parse from "parse";
import { mapGetters } from "vuex";

export default {
  name: "Practice",
  components: {
    DatePicker
  },
  props: {
    practice: { type: Object, required: true },
    latestPracticeCount: { type: Object, required: false },
    practiceCounts: { type: Array, required: false }
  },
  computed: {
    ...mapGetters(["isStudent"])
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
      practiceCountObj: this.buildPracticeObj(this.latestPracticeCount),
      fields: [
        {
          key: "reportedAt",
          label: "日期",
          sortable: true
        },
        {
          key: "count",
          label: "报数",
          sortable: true
        }
      ],
      items: this.practiceCounts
        ? this.practiceCounts
            .filter(x => x.get("reportedAt"))
            .map(e => {
              return {
                reportedAt: this.toLocalDateString(e.get("reportedAt")),
                count: e.get("count")
              };
            })
        : []
    };
  },
  methods: {
    buildPracticeObj(latestPracticeCount) {
      console.log(`buildPracticeObj - ${JSON.stringify(latestPracticeCount)}`);
      return latestPracticeCount && latestPracticeCount.count
        ? {
            latestCount:
              latestPracticeCount && latestPracticeCount.reportedAt
                ? `${latestPracticeCount.count} @ ${this.toLocalDateString(
                    latestPracticeCount.reportedAt
                  )}`
                : "未报数",
            accumulatedCount:
              latestPracticeCount && latestPracticeCount.reportedAt
                ? latestPracticeCount.accumulatedCount
                : "未报数"
          }
        : {
            countStats: true,
            latestCount: latestPracticeCount
              ? `${this.toLocalDateString(
                  new Date(latestPracticeCount.reportedAt)
                )}`
              : "未报数",
            accumulatedCount: latestPracticeCount
              ? latestPracticeCount.accumulatedCount
              : "未报数"
          };
    },
    minDateForCountReporting() {
      const today = new Date();
      //student must report count with 3 days
      return new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
    },
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
        .then(function() {
          Parse.Cloud.run("home:reportPracticeCount", {
            practiceId,
            reportedAt,
            count
          })
            .then(result => {
              console.log(
                `reportPracticeCount - result: ${JSON.stringify(result)}`
              );

              thisComponent.practiceCountObj = thisComponent.buildPracticeObj(
                result
              );

              if (thisComponent.practiceCounts) {
                thisComponent.$router.go();
              }
            })
            .catch(e => {
              console.log(`error in updateAttendance: ${e}`);
            });
        })
        .catch(e => {
          console.log(`error: ${e}`);
        });
    },
    listPracticeCount() {
      const practiceId = this.practice.id;
      this.$router.push({
        name: "count-list",
        params: { practiceId: practiceId }
      });
    }
  }
};
</script>
