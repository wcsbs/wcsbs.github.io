<template>
  <div>
    <b-form v-if="editing" @submit="onSubmit" @reset="onReset">
      <h4>{{ session.name ? session.name : "创建新课" }}</h4>
      <b-input-group prepend="选择课程：" class="mt-3">
        <select v-model="session.id">
          <option
            v-for="newSession in sessionDropdownOptions"
            v-bind:key="newSession.id"
            v-bind:value="newSession.id"
            >{{ newSession.name }}</option
          >
        </select>
        <b-input-group-append>
          <b-button v-if="!session.creating" type="reset" variant="warning">
            <b-icon icon="x-circle"></b-icon>
          </b-button>
        </b-input-group-append>
      </b-input-group>
      <b-form-textarea
        v-model="session.description"
        placeholder="输入上课通知"
        rows="8"
        max-rows="20"
      ></b-form-textarea>
      <b-input-group prepend="选择日期：" class="mt-3">
        <v-date-picker
          locale="zh-CN"
          v-model="session.scheduledAt"
          :input-props="{
            readonly: true
          }"
        />
        <b-input-group-append>
          <b-button type="submit" variant="success">
            <b-icon icon="check-circle"></b-icon>
          </b-button>
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
          <b-input-group-append>
            <b-button
              variant="warning"
              v-if="newSessions && (isClassAdmin || isTeachingAssistant)"
              v-on:click="editSession"
              >修改</b-button
            >
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
        <b-input-group
          v-if="!session.forApplication"
          prepend="上课出勤："
          class="mt-3"
        >
          <b-form-input
            readonly
            v-model="session.attendanceState"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              variant="warning"
              v-if="needToShowAttendanceButton()"
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
          readonly
        ></b-form-textarea>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import Parse from "parse";
import { mapGetters } from "vuex";

export default {
  name: "ClassSession",
  props: {
    classSession: { type: Object, required: true },
    attendance: { type: Object, required: false },
    classInfo: { type: Object, required: false },
    newSessions: { type: Array, required: false },
    forApplication: Boolean
  },
  data: function() {
    return {
      session: this.classSession.dummy
        ? { creating: true, editing: true }
        : this.initSession(),
      sessionDropdownOptions: [],
      editing: this.classSession.dummy
    };
  },
  computed: {
    ...mapGetters(["isClassAdmin", "isTeachingAssistant", "isStudent"])
  },
  mounted() {
    this.buildSessionDropdownOptions();
  },
  methods: {
    initSession() {
      return {
        id: this.classSession.id,
        forApplication: this.classInfo
          ? this.classInfo.forApplication
          : this.forApplication,
        name: this.classSession.get("name"),
        url: this.classSession.get("url"),
        description: this.classSession.get("description"),
        scheduledAt: this.classSession.get("scheduledAt"),
        scheduledAtLocalDateTimeString: this.toLocalDateTimeString(
          this.classSession.get("scheduledAt")
        ),
        showDescription: false,
        attendanceState: this.toAttendanceStateString(this.attendance),
        materialState: this.toMaterialStateString(this.attendance)
      };
    },
    buildSessionDropdownOptions() {
      this.sessionDropdownOptions = [];
      if (!this.editing) {
        return;
      }
      if (this.classSession.dummy) {
        this.sessionDropdownOptions = this.newSessions;
      } else {
        const currentSession = {
          id: this.classSession.id,
          name: this.classSession.get("name")
        };
        console.log(`${JSON.stringify(currentSession)}`);
        const order = parseInt(currentSession.name.match(/(\d+)/)[0]);
        var currentSessionPushed = false;
        for (var i = 0; i < this.newSessions.length; i++) {
          const s = this.newSessions[i];
          if (
            !currentSessionPushed &&
            parseInt(s.name.match(/(\d+)/)[0]) > order
          ) {
            this.sessionDropdownOptions.push(currentSession);
            currentSessionPushed = true;
          }
          this.sessionDropdownOptions.push(s);
        }
      }
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
    needToShowAttendanceButton() {
      const scheduledAt = this.classSession.get("scheduledAt");
      if (this.isStudent) {
        const today = new Date();
        //student must submit attendance with 3 days
        return (
          today.getTime() < scheduledAt.getTime() + 3 * 24 * 60 * 60 * 1000
        );
      }
      return false;
    },
    toAttendanceStateString(attendance) {
      if (attendance) {
        if (typeof attendance.shangKe == "number") {
          return `${attendance.shangKe}人已上课`;
        }
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
      if (this.forApplication) {
        return "请在课前看完传承/法本";
      }
      var chuanCheng = "未看传承";
      var faBen = "未看法本";
      if (attendance) {
        if (typeof attendance.chuanCheng == "number") {
          chuanCheng = `${attendance.chuanCheng}人已看传承`;
        } else if (attendance.chuanCheng) {
          chuanCheng = "已看传承";
        }
        if (typeof attendance.faBen == "number") {
          faBen = `${attendance.faBen}人已看法本`;
        } else if (attendance.faBen) {
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
        cancelText: "取消",
        loader: true // default: false - when set to true, the proceed button shows a loader when clicked; and a dialog object will be passed to the then() callback
      };
      const message = {
        title: this.session.name,
        body: msg + "?"
      };
      const thisComponent = this;

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
              dialog.close();
            })
            .catch(e => {
              console.log(`error in updateAttendance: ${e}`);
              dialog.close();
              thisComponent.$dialog.alert(`error in updateAttendance: ${e}`);
            });
        })
        .catch(e => {
          console.log(`error: ${e}`);
        });
    },
    editSession() {
      this.session = this.initSession();
      this.editing = true;
      this.buildSessionDropdownOptions();
    },
    onReset(evt) {
      evt.preventDefault();
      this.editing = false;
    },
    onSubmit(evt) {
      evt.preventDefault();
      const sessionId = this.session.id;
      console.log(`sessionId: ${sessionId}`);

      const classSession = this.classInfo.classSessions.filter(
        e => e.id === sessionId
      )[0];

      const options = {
        okText: "确认",
        cancelText: "取消",
        loader: true // default: false - when set to true, the proceed button shows a loader when clicked; and a dialog object will be passed to the then() callback
      };
      const message = {
        title: this.classInfo.name,
        body: `${
          this.session.creating ? "创建新课" : "修改"
        } 《${classSession.get("name")}》 @ ${this.toLocalDateString(
          this.session.scheduledAt
        )}？`
      };

      const session = this.session;
      session.oldId = this.classSession.id;
      var dt = new Date(session.scheduledAt);
      dt.setHours(9); //TODO: allow setting time
      session.scheduledAt = dt;
      const thisComponent = this;

      this.$dialog
        .confirm(message, options)
        .then(function(dialog) {
          Parse.Cloud.run("class:updateClassSession", { session })
            .then(result => {
              console.log(
                `updateClassSession - result: ${JSON.stringify(result)}`
              );
              dialog.close();
              // thisComponent.$router.go();
              window.location.reload();
            })
            .catch(e => {
              console.log(`error in updateClassSession: ${JSON.stringify(e)}`);
              dialog.close();
              thisComponent.$dialog.alert(`error in updateClassSession: ${e}`);
            });
        })
        .catch(e => {
          console.log(`error: ${e}`);
        });
    }
  }
};
</script>
