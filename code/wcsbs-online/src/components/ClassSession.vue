<template>
  <div>
    <b-card class="text-center" :header="session.name">
      <b-card-text>
        <b-input-group prepend="上课时间：" class="mt-3">
          <b-form-input
            readonly
            v-model="session.scheduledAtLocalDateTimeString"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              variant="info"
              :href="addToGoogleCalendarUrl()"
              target="_blank"
            >
              <b-icon icon="calendar-plus"></b-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <b-input-group prepend="课前学习：" class="mt-3">
          <b-form-input readonly v-model="session.materialState"></b-form-input>
          <b-input-group-append>
            <b-button variant="info" :href="session.url" target="_blank">
              <b-icon icon="book"></b-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <b-input-group prepend="上课出勤：" class="mt-3">
          <b-form-input
            readonly
            v-model="session.attendanceState"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              variant="warning"
              v-if="session.showAttendanceButton"
              v-on:click="updateAttendance()"
              >{{ attendanceButtonName() }}</b-button
            >
            <b-button
              variant="info"
              v-on:click="session.showDescription = !session.showDescription"
            >
              <b-icon
                v-if="session.showDescription"
                icon="chevron-double-up"
              ></b-icon>
              <b-icon v-else icon="chevron-double-down"></b-icon>
            </b-button>
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
import Parse from "parse";

export default {
  name: "ClassSession",
  props: {
    classSession: { type: Object, required: true },
    attendance: { type: Object, required: true }
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
        showAttendanceButton: this.needToShowAttendanceButton(
          this.classSession.get("scheduledAt")
        ),
        attendanceState: this.toAttendanceStateString(this.attendance),
        materialState: this.toMaterialStateString(this.attendance)
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
    needToShowAttendanceButton(scheduledAt) {
      const today = new Date();
      console.log(`today: ${today} scheduledAt: ${scheduledAt}`);
      //student must submit attendance with 3 days
      return today.getTime() < scheduledAt.getTime() + 3 * 24 * 60 * 60 * 1000;
    },
    toAttendanceStateString(attendance) {
      if (attendance) {
        if (attendance.qingJia) {
          return "已请假";
        }
        if (attendance.shangKe == true) {
          return "已上课";
        }
        if (attendance.shangKe == false && attendance.qingJia == undefined) {
          return "未上课";
        }
      }

      return "未报考勤";
    },
    toMaterialStateString(attendance) {
      var chuanCheng = "未看传承";
      var faBen = "未看法本";
      if (attendance) {
        if (attendance.chuanCheng) {
          chuanCheng = "已看传承";
        }
        if (attendance.faBen == true) {
          faBen = "已看法本";
        }
      }

      return `${chuanCheng}/${faBen}`;
    },
    addToGoogleCalendarUrl() {
      var eventStart = this.classSession.get("scheduledAt");
      var eventEnd = new Date();
      eventEnd.setTime(eventStart.getTime() + 4 * 60 * 60 * 1000);
      eventStart = eventStart
        .toISOString()
        .replace(/.000/g, "")
        .replace(/:/g, "")
        .replace(/-/g, "");
      eventEnd = eventEnd
        .toISOString()
        .replace(/.000/g, "")
        .replace(/:/g, "")
        .replace(/-/g, "");
      var url = `${this.session.name}&details=${this.session.description}`;
      url = encodeURI(url);
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${url}&dates=${eventStart}%2F${eventEnd}`;
    },
    attendanceButtonName() {
      const d = new Date();
      if (d < this.classSession.get("scheduledAt")) {
        if (this.attendance.qingJia) {
          return "取消请假";
        }
        return "我要请假";
      } else {
        if (this.attendance.shangKe != undefined) {
          return "我要改考勤";
        }
        return "我要报考勤";
      }
    },
    updateAttendance() {
      const d = new Date();
      const attendance = {};
      var msg = "确认";
      if (d < this.classSession.get("scheduledAt")) {
        if (this.attendance.qingJia) {
          attendance.qingJia = false;
          msg += "取消请假";
        } else {
          attendance.qingJia = true;
          attendance.shangKe = false;
          msg += "请假";
        }
      } else {
        if (this.attendance.shangKe) {
          attendance.shangKe = false;
          msg += "没有上课";
        } else {
          attendance.shangKe = true;
          msg += "已上课";
        }
      }

      const pathname = this.classSession.get("url");
      const classSession = this;
      const options = {
        okText: "确认",
        cancelText: "取消"
      };
      const message = {
        title: this.session.name,
        body: msg + "?"
      };
      this.$dialog
        .confirm(message, options)
        .then(function(dialog) {
          console.log(`${JSON.stringify(dialog)}`);
          Parse.Cloud.run("home:updateAttendance", { pathname, attendance })
            .then(result => {
              console.log(
                `updateAttendance - result: ${JSON.stringify(result)}`
              );
              if (result.qingJia != undefined) {
                classSession.attendance.qingJia = result.qingJia;
              }
              if (result.shangKe != undefined) {
                classSession.attendance.shangKe = result.shangKe;
              }
              classSession.session.attendanceState = classSession.toAttendanceStateString(
                classSession.attendance
              );
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
