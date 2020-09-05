<template>
  <div>
    <b-form v-if="editing" @submit="onSubmit">
      <h4>{{ session.name ? session.name : "创建新课" }}</h4>
      <b-input-group prepend="选择课程：" class="mt-3">
        <select v-model="session.id">
          <option
            v-for="newSession in newSessions"
            v-bind:key="newSession.id"
            v-bind:value="newSession.id"
          >
            {{ newSession.name }}
          </option>
        </select>
      </b-input-group>
      <b-form-textarea
        v-model="session.description"
        placeholder="输入上课通知"
        rows="8"
        max-rows="20"
      ></b-form-textarea>
      <b-input-group prepend="选择日期：" class="mt-3">
        <v-date-picker
          v-model="session.scheduledAt"
          :input-props="{
            readonly: true
          }"
        />
        <b-input-group-append>
          <b-button type="submit" variant="primary">提交</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form>
    <b-card v-else class="text-center" :header="session.name">
      <b-card-text>
        <b-input-group prepend="上课时间：" class="mt-3">
          <b-form-input
            readonly
            v-model="session.scheduledAtLocalDateTimeString"
          ></b-form-input>
          <b-input-group-append v-if="!editing">
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
    attendance: { type: Object, required: true },
    classInfo: { type: Object, required: false },
    newSessions: { type: Array, required: false },
    editing: Boolean
  },
  data: function() {
    return {
      session: this.classSession.dummy
        ? {}
        : {
            id: this.classSession.get("objectId"),
            name: this.classSession.get("name"),
            url: this.classSession.get("url"),
            description: this.classSession.get("description"),
            scheduledAt: this.classSession.get("scheduledAt"),
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
    toLocalDateString(date) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric"
      };
      return date.toLocaleDateString("zh-CN", options);
    },
    needToShowAttendanceButton(scheduledAt) {
      const today = new Date();
      // console.log(`today: ${today} scheduledAt: ${scheduledAt}`);
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
      var eventStart = this.session.scheduledAt;
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
    },
    onSubmit(evt) {
      evt.preventDefault();
      const sesionId = this.session.id;
      const classSession = this.classInfo.classSessions.filter(
        e => e.id === sesionId
      )[0];

      const options = {
        okText: "确认",
        cancelText: "取消"
      };
      const message = {
        title: this.classInfo.name,
        body: `创建新课 《${classSession.get(
          "name"
        )}》 @ ${this.toLocalDateString(this.session.scheduledAt)}？`
      };

      const thisComponent = this;
      const session = this.session;
      var dt = new Date(session.scheduledAt);
      dt.setHours(9); //TODO: allow setting time
      session.scheduledAt = dt;

      this.$dialog
        .confirm(message, options)
        .then(function() {
          Parse.Cloud.run("class:updateClassSession", { session })
            .then(result => {
              console.log(
                `updateClassSession - result: ${JSON.stringify(result)}`
              );

              thisComponent.$router.go();
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
