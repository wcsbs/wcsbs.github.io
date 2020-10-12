(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e7247ee6"],{"2c634":function(t,e,n){"use strict";var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t.editing?n("b-form",{on:{submit:t.onSubmit,reset:t.onReset}},[n("h4",[t._v(t._s(t.session.name?t.session.name:"创建新课"))]),n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"选择课程："}},[n("select",{directives:[{name:"model",rawName:"v-model",value:t.session.id,expression:"session.id"}],on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.$set(t.session,"id",e.target.multiple?n:n[0])}}},t._l(t.sessionDropdownOptions,(function(e){return n("option",{key:e.id,domProps:{value:e.id}},[t._v(t._s(e.name))])})),0),n("b-input-group-append",[t.session.creating?t._e():n("b-button",{attrs:{type:"reset",variant:"warning"}},[n("b-icon",{attrs:{icon:"x-circle"}})],1)],1)],1),n("b-form-textarea",{attrs:{placeholder:"输入上课通知",rows:"8","max-rows":"20"},model:{value:t.session.description,callback:function(e){t.$set(t.session,"description",e)},expression:"session.description"}}),n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"选择日期："}},[n("v-date-picker",{attrs:{locale:"zh-CN","input-props":{readonly:!0}},model:{value:t.session.scheduledAt,callback:function(e){t.$set(t.session,"scheduledAt",e)},expression:"session.scheduledAt"}}),n("b-input-group-append",[n("b-button",{attrs:{type:"submit",variant:"success"}},[n("b-icon",{attrs:{icon:"check-circle"}})],1)],1)],1)],1):n("b-card",{staticClass:"text-center",attrs:{header:t.session.name}},[n("b-card-text",[n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"上课时间："}},[n("b-form-input",{attrs:{readonly:""},model:{value:t.session.scheduledAtLocalDateTimeString,callback:function(e){t.$set(t.session,"scheduledAtLocalDateTimeString",e)},expression:"session.scheduledAtLocalDateTimeString"}}),n("b-input-group-append",[t.newSessions&&(t.isClassAdmin||t.isTeachingAssistant)?n("b-button",{attrs:{variant:"warning"},on:{click:t.editSession}},[t._v("修改")]):t._e(),n("b-button",{attrs:{variant:"info",href:t.addToGoogleCalendarUrl(),target:"_blank"}},[n("b-icon",{attrs:{icon:"calendar-plus"}})],1)],1)],1),n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"课前学习："}},[n("b-form-input",{attrs:{readonly:""},model:{value:t.session.materialState,callback:function(e){t.$set(t.session,"materialState",e)},expression:"session.materialState"}}),n("b-input-group-append",[n("b-button",{attrs:{variant:"info",href:t.session.url,target:"_blank"}},[n("b-icon",{attrs:{icon:"book"}})],1)],1)],1),t.session.forApplication?t._e():n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"上课出勤："}},[n("b-form-input",{attrs:{readonly:""},model:{value:t.session.attendanceState,callback:function(e){t.$set(t.session,"attendanceState",e)},expression:"session.attendanceState"}}),n("b-input-group-append",[t.needToShowAttendanceButton()?n("b-button",{attrs:{variant:"warning"},on:{click:function(e){return t.updateAttendance()}}},[t._v(t._s(t.attendanceButtonName()))]):t._e(),n("b-button",{attrs:{variant:"info"},on:{click:function(e){t.session.showDescription=!t.session.showDescription}}},[t.session.showDescription?n("b-icon",{attrs:{icon:"chevron-double-up"}}):n("b-icon",{attrs:{icon:"chevron-double-down"}})],1)],1)],1),t.session.showDescription?n("b-form-textarea",{attrs:{placeholder:"",rows:"3","max-rows":"8",readonly:""},model:{value:t.session.description,callback:function(e){t.$set(t.session,"description",e)},expression:"session.description"}}):t._e()],1)],1)],1)},i=[],o=(n("8e6e"),n("ac6a"),n("456d"),n("6762"),n("2fdb"),n("a481"),n("7f7f"),n("bd86")),a=n("bf48"),r=n.n(a),c=n("2f62"),l=n("6d95");function u(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,s)}return n}function d(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?u(Object(n),!0).forEach((function(e){Object(o["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var p={name:"ClassSession",props:{classSession:{type:Object,required:!0},attendance:{type:Object,required:!1},classInfo:{type:Object,required:!1},newSessions:{type:Array,required:!1},forApplication:Boolean},data:function(){return{session:this.classSession.dummy?{creating:!0,editing:!0}:this.initSession(),sessionDropdownOptions:[],editing:this.classSession.dummy}},computed:d({},Object(c["b"])(["isClassAdmin","isTeachingAssistant","isStudent"])),mounted:function(){this.buildSessionDropdownOptions()},methods:{initSession:function(){return{id:this.classSession.id,forApplication:this.classInfo?this.classInfo.forApplication:this.forApplication,name:this.classSession.get("name"),url:this.classSession.get("url"),description:this.classSession.get("description"),scheduledAt:this.classSession.get("scheduledAt"),scheduledAtLocalDateTimeString:this.toLocalDateTimeString(this.classSession.get("scheduledAt")),showDescription:!1,attendanceState:this.toAttendanceStateString(this.attendance),materialState:this.toMaterialStateString(this.attendance)}},buildSessionDropdownOptions:function(){if(this.sessionDropdownOptions=[],this.editing)if(this.classSession.dummy)this.sessionDropdownOptions=this.newSessions;else for(var t={id:this.classSession.id,name:this.classSession.get("name")},e=Object(l["b"])(t.name),n=!1,s=0;s<this.newSessions.length;s++){var i=this.newSessions[s];!n&&Object(l["b"])(i.name)>e&&(this.sessionDropdownOptions.push(t),n=!0),this.sessionDropdownOptions.push(i)}},toLocalDateTimeString:function(t){var e={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric"};return t.toLocaleDateString("zh-CN",e)},toLocalDateString:function(t){var e={year:"numeric",month:"short",day:"numeric"};return t.toLocaleDateString("zh-CN",e)},needToShowAttendanceButton:function(){return!0},toAttendanceStateString:function(t){if(t){if("number"==typeof t.shangKe)return"".concat(t.shangKe,"人已上课");if(t.qingJia)return"已请假";if(1==t.shangKe)return"已上课";if(0==t.shangKe&&void 0==t.qingJia)return"未上课"}return"未报考勤"},toMaterialStateString:function(t){if(this.forApplication)return"请在课前看完传承/法本";var e="未看传承",n="未看法本";return t&&("number"==typeof t.chuanCheng?e="".concat(t.chuanCheng,"人已看传承"):t.chuanCheng&&(e="已看传承"),"number"==typeof t.faBen?n="".concat(t.faBen,"人已看法本"):t.faBen&&(n="已看法本")),"".concat(e,"/").concat(n)},addToGoogleCalendarUrl:function(){var t=this.session.scheduledAt,e=new Date;e.setTime(t.getTime()+144e5),t=t.toISOString().replace(/.000/g,"").replace(/:/g,"").replace(/-/g,""),e=e.toISOString().replace(/.000/g,"").replace(/:/g,"").replace(/-/g,"");var n="".concat(this.session.name,"&details=").concat(this.session.description);return n=encodeURI(n),"https://www.google.com/calendar/render?action=TEMPLATE&text=".concat(n,"&dates=").concat(t,"%2F").concat(e)},attendanceButtonName:function(){var t=new Date;return t<this.classSession.get("scheduledAt")?this.attendance.qingJia?"取消请假":"我要请假":void 0!=this.attendance.shangKe?"我要改考勤":"我要报考勤"},updateAttendance:function(){var t=new Date,e={},n="确认";t<this.classSession.get("scheduledAt")?this.attendance.qingJia?(e.qingJia=!1,n+="取消请假"):(e.qingJia=!0,e.shangKe=!1,n+="请假"):this.attendance.shangKe?(e.shangKe=!1,n+="没有上课"):(e.shangKe=!0,n+="已上课");var s=this.classSession.get("url"),i=this,o={okText:"确认",cancelText:"取消",loader:!0},a={title:this.session.name,body:n+"?"},c=this;this.$dialog.confirm(a,o).then((function(t){console.log("".concat(JSON.stringify(t))),r.a.Cloud.run("home:updateAttendance",{pathname:s,attendance:e}).then((function(e){console.log("updateAttendance - result: ".concat(JSON.stringify(e))),void 0!=e.qingJia&&(i.attendance.qingJia=e.qingJia),void 0!=e.shangKe&&(i.attendance.shangKe=e.shangKe),i.session.attendanceState=i.toAttendanceStateString(i.attendance),t.close()})).catch((function(e){console.log("error in updateAttendance: ".concat(e)),t.close(),c.$dialog.alert("error in updateAttendance: ".concat(e))}))})).catch((function(t){console.log("error: ".concat(t))}))},editSession:function(){this.session=this.initSession(),this.editing=!0,this.buildSessionDropdownOptions()},onReset:function(t){t.preventDefault(),this.editing=!1},onSubmit:function(t){t.preventDefault();var e=this.session.id;console.log("sessionId: ".concat(e));var n=this.classInfo.classSessions.filter((function(t){return t.id===e}))[0],s={okText:"确认",cancelText:"取消",loader:!0},i={title:this.classInfo.name,body:"".concat(this.session.creating?"创建新课":"修改"," 《").concat(n.get("name"),"》 @ ").concat(this.toLocalDateString(this.session.scheduledAt),"？")},o=this.session;o.oldId=this.classSession.id;var a=new Date(o.scheduledAt);a.setHours(n.get("url").includes("rpsxl")?9:14),o.scheduledAt=a;var c=this;this.$dialog.confirm(i,s).then((function(t){r.a.Cloud.run("class:updateClassSession",{session:o}).then((function(e){console.log("updateClassSession - result: ".concat(JSON.stringify(e))),t.close(),window.location.reload()})).catch((function(e){console.log("error in updateClassSession: ".concat(JSON.stringify(e))),t.close(),c.$dialog.alert("error in updateClassSession: ".concat(e))}))})).catch((function(t){console.log("error: ".concat(t))}))}}},h=p,f=n("2877"),g=Object(f["a"])(h,s,i,!1,null,null,null);e["a"]=g.exports},"662a":function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t.isLoadingSessions?n("div",[t._v("\n    正在获取课程详情...\n  ")]):n("div",[n("h3",{domProps:{textContent:t._s(t.classInfo.name)}}),n("div",{staticClass:"input-group mb-3"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.filterText,expression:"filterText"}],staticClass:"form-control",attrs:{type:"text","aria-describedby":"basic-addon2",placeholder:"搜索"},domProps:{value:t.filterText},on:{change:function(e){return t.filterSessions(t.filterText)},input:function(e){e.target.composing||(t.filterText=e.target.value)}}}),n("div",{staticClass:"input-group-append"},[n("button",{staticClass:"btn btn-outline-secondary",attrs:{type:"button"},on:{click:t.clearFilter}},[t._v("\n          清除\n        ")]),t.classInfo.forApplication?n("b-button",{attrs:{variant:"warning"},on:{click:function(e){return t.applyClass()}}},[t._v("我要报名")]):t._e(),t.isClassAdmin||t.isTeachingAssistant?n("b-button",{attrs:{variant:"warning"},on:{click:t.createSession}},[t._v(t._s(t.creatingSession?"取消创建":"创建新课"))]):t._e()],1)]),0===t.classSessions.length?n("div",[t._v("\n      没有找到上课记录！\n    ")]):t._e(),t.creatingSession?n("ClassSession",{attrs:{classInfo:t.classInfo,classSession:t.newClassSession,attendance:t.newAttendance,newSessions:t.newSessions}}):t._e(),t._l(t.classSessions,(function(e,s){return n("ClassSession",{key:e.id+s,attrs:{classInfo:t.classInfo,forApplication:t.classInfo.forApplication,classSession:e,attendance:t.attendances[s],newSessions:t.newSessions}})}))],2)])},i=[],o=(n("8e6e"),n("ac6a"),n("456d"),n("7f7f"),n("bd86")),a=n("2f62"),r=n("2c634"),c=n("6c33"),l=n("4360"),u=n("bf48"),d=n.n(u);function p(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,s)}return n}function h(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?p(Object(n),!0).forEach((function(e){Object(o["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var f={name:"SessionManagement",components:{ClassSession:r["a"]},computed:h({},Object(a["b"])(["isLoadingSessions","classInfo","classSessions","attendances","newSessions","isClassAdmin","isTeachingAssistant","isStudent"])),beforeRouteEnter:function(t,e,n){l["a"].dispatch(c["e"],t.params).then((function(){n()}))},data:function(){return{filterText:"",creatingSession:!1,newClassSession:{dummy:!0},newAttendance:{dummy:!0}}},methods:{filterSessions:function(t){this.$store.dispatch(c["g"],t)},clearFilter:function(){this.filterText="",this.$store.dispatch(c["g"],this.filterText)},createSession:function(){this.creatingSession=!this.creatingSession},applyClass:function(){var t=this.classInfo.id,e={okText:"确认",cancelText:"取消"},n={title:this.classInfo.name,body:"顶礼上师三宝！真的要报名？"},s=this;console.log("applyClass - classId: ".concat(t)),this.$dialog.confirm(n,e).then((function(){d.a.Cloud.run("class:apply",{classId:t}).then((function(t){console.log("class:apply - result: ".concat(JSON.stringify(t))),s.$router.push({name:"home"})})).catch((function(t){console.log("error in class:apply: ".concat(t))}))})).catch((function(t){console.log("error: ".concat(t))}))}}},g=f,b=n("2877"),m=Object(b["a"])(g,s,i,!1,null,null,null);e["default"]=m.exports},a481:function(t,e,n){"use strict";var s=n("cb7c"),i=n("4bf8"),o=n("9def"),a=n("4588"),r=n("0390"),c=n("5f1b"),l=Math.max,u=Math.min,d=Math.floor,p=/\$([$&`']|\d\d?|<[^>]*>)/g,h=/\$([$&`']|\d\d?)/g,f=function(t){return void 0===t?t:String(t)};n("214f")("replace",2,(function(t,e,n,g){return[function(s,i){var o=t(this),a=void 0==s?void 0:s[e];return void 0!==a?a.call(s,o,i):n.call(String(o),s,i)},function(t,e){var i=g(n,t,this,e);if(i.done)return i.value;var d=s(t),p=String(this),h="function"===typeof e;h||(e=String(e));var m=d.global;if(m){var S=d.unicode;d.lastIndex=0}var v=[];while(1){var w=c(d,p);if(null===w)break;if(v.push(w),!m)break;var y=String(w[0]);""===y&&(d.lastIndex=r(p,o(d.lastIndex),S))}for(var O="",A=0,x=0;x<v.length;x++){w=v[x];for(var C=String(w[0]),D=l(u(a(w.index),p.length),0),j=[],_=1;_<w.length;_++)j.push(f(w[_]));var T=w.groups;if(h){var k=[C].concat(j,D,p);void 0!==T&&k.push(T);var I=String(e.apply(void 0,k))}else I=b(C,p,D,j,T,e);D>=A&&(O+=p.slice(A,D)+I,A=D+C.length)}return O+p.slice(A)}];function b(t,e,s,o,a,r){var c=s+t.length,l=o.length,u=h;return void 0!==a&&(a=i(a),u=p),n.call(r,u,(function(n,i){var r;switch(i.charAt(0)){case"$":return"$";case"&":return t;case"`":return e.slice(0,s);case"'":return e.slice(c);case"<":r=a[i.slice(1,-1)];break;default:var u=+i;if(0===u)return n;if(u>l){var p=d(u/10);return 0===p?n:p<=l?void 0===o[p-1]?i.charAt(1):o[p-1]+i.charAt(1):n}r=o[u-1]}return void 0===r?"":r}))}}))}}]);
//# sourceMappingURL=chunk-e7247ee6.fe0e1579.js.map