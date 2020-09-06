(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e7247ee6"],{"2c634":function(e,t,n){"use strict";var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.editing?n("b-form",{on:{submit:e.onSubmit,reset:e.onReset}},[n("h4",[e._v(e._s(e.session.name?e.session.name:"创建新课"))]),e.session.creating?n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"选择课程："}},[n("select",{directives:[{name:"model",rawName:"v-model",value:e.session.id,expression:"session.id"}],on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){var t="_value"in e?e._value:e.value;return t}));e.$set(e.session,"id",t.target.multiple?n:n[0])}}},e._l(e.newClassSessions,(function(t){return n("option",{key:t.key,domProps:{value:t.key}},[e._v(e._s(t.value))])})),0)]):e._e(),n("b-form-textarea",{attrs:{placeholder:"输入上课通知",rows:"8","max-rows":"20"},model:{value:e.session.description,callback:function(t){e.$set(e.session,"description",t)},expression:"session.description"}}),n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"选择日期："}},[n("v-date-picker",{attrs:{"input-props":{readonly:!0}},model:{value:e.session.scheduledAt,callback:function(t){e.$set(e.session,"scheduledAt",t)},expression:"session.scheduledAt"}}),n("b-input-group-append",[n("b-button",{attrs:{type:"submit",variant:"primary"}},[e._v("提交")]),e.session.creating?e._e():n("b-button",{attrs:{type:"reset",variant:"primary"}},[e._v("取消")])],1)],1)],1):n("b-card",{staticClass:"text-center",attrs:{header:e.session.name}},[n("b-card-text",[n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"上课时间："}},[n("b-form-input",{attrs:{readonly:""},model:{value:e.session.scheduledAtLocalDateTimeString,callback:function(t){e.$set(e.session,"scheduledAtLocalDateTimeString",t)},expression:"session.scheduledAtLocalDateTimeString"}}),n("b-input-group-append",[e.isClassAdmin||e.isTeachingAssistant?n("b-button",{attrs:{variant:"warning"},on:{click:e.editSession}},[e._v("修改")]):e._e(),n("b-button",{attrs:{variant:"info",href:e.addToGoogleCalendarUrl(),target:"_blank"}},[n("b-icon",{attrs:{icon:"calendar-plus"}})],1)],1)],1),n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"课前学习："}},[n("b-form-input",{attrs:{readonly:""},model:{value:e.session.materialState,callback:function(t){e.$set(e.session,"materialState",t)},expression:"session.materialState"}}),n("b-input-group-append",[n("b-button",{attrs:{variant:"info",href:e.session.url,target:"_blank"}},[n("b-icon",{attrs:{icon:"book"}})],1)],1)],1),n("b-input-group",{staticClass:"mt-3",attrs:{prepend:"上课出勤："}},[n("b-form-input",{attrs:{readonly:""},model:{value:e.session.attendanceState,callback:function(t){e.$set(e.session,"attendanceState",t)},expression:"session.attendanceState"}}),n("b-input-group-append",[e.session.showAttendanceButton?n("b-button",{attrs:{variant:"warning"},on:{click:function(t){return e.updateAttendance()}}},[e._v(e._s(e.attendanceButtonName()))]):e._e(),n("b-button",{attrs:{variant:"info"},on:{click:function(t){e.session.showDescription=!e.session.showDescription}}},[e.session.showDescription?n("b-icon",{attrs:{icon:"chevron-double-up"}}):n("b-icon",{attrs:{icon:"chevron-double-down"}})],1)],1)],1),e.session.showDescription?n("b-form-textarea",{attrs:{placeholder:"Auto height textarea",rows:"3","max-rows":"8"},model:{value:e.session.description,callback:function(t){e.$set(e.session,"description",t)},expression:"session.description"}}):e._e()],1)],1)],1)},i=[],a=(n("a481"),n("7f7f"),n("bf48")),o=n.n(a),r={name:"ClassSession",props:{classSession:{type:Object,required:!0},attendance:{type:Object,required:!0},classInfo:{type:Object,required:!1},newSessions:{type:Array,required:!1},isStudent:{type:Boolean,default:!0},isClassAdmin:Boolean,isTeachingAssistant:Boolean},data:function(){return{session:this.classSession.dummy?{creating:!0,editing:!0}:this.initSession(),newClassSessions:[],editing:this.classSession.dummy}},mounted:function(){this.buildNewClassSessions()},methods:{initSession:function(){return{id:this.classSession.id,name:this.classSession.get("name"),url:this.classSession.get("url"),description:this.classSession.get("description"),scheduledAt:this.classSession.get("scheduledAt"),scheduledAtLocalDateTimeString:this.toLocalDateTimeString(this.classSession.get("scheduledAt")),showDescription:!1,showAttendanceButton:this.needToShowAttendanceButton(this.classSession.get("scheduledAt")),attendanceState:this.toAttendanceStateString(this.attendance),materialState:this.toMaterialStateString(this.attendance)}},buildNewClassSessions:function(){this.editing?(this.newClassSessions=this.newSessions.map((function(e){return{key:e.id,value:e.name}})),console.log("".concat(JSON.stringify(this.newClassSessions)))):this.newClassSessions=[]},toLocalDateTimeString:function(e){var t={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric"};return e.toLocaleDateString("zh-CN",t)},toLocalDateString:function(e){var t={year:"numeric",month:"short",day:"numeric"};return e.toLocaleDateString("zh-CN",t)},needToShowAttendanceButton:function(e){if(this.isStudent){var t=new Date;return t.getTime()<e.getTime()+2592e5}return!1},toAttendanceStateString:function(e){if(e){if(e.qingJia)return"已请假";if(1==e.shangKe)return"已上课";if(0==e.shangKe&&void 0==e.qingJia)return"未上课"}return"未报考勤"},toMaterialStateString:function(e){var t="未看传承",n="未看法本";return e&&(e.chuanCheng&&(t="已看传承"),1==e.faBen&&(n="已看法本")),"".concat(t,"/").concat(n)},addToGoogleCalendarUrl:function(){var e=this.session.scheduledAt,t=new Date;t.setTime(e.getTime()+144e5),e=e.toISOString().replace(/.000/g,"").replace(/:/g,"").replace(/-/g,""),t=t.toISOString().replace(/.000/g,"").replace(/:/g,"").replace(/-/g,"");var n="".concat(this.session.name,"&details=").concat(this.session.description);return n=encodeURI(n),"https://www.google.com/calendar/render?action=TEMPLATE&text=".concat(n,"&dates=").concat(e,"%2F").concat(t)},attendanceButtonName:function(){var e=new Date;return e<this.classSession.get("scheduledAt")?this.attendance.qingJia?"取消请假":"我要请假":void 0!=this.attendance.shangKe?"我要改考勤":"我要报考勤"},updateAttendance:function(){var e=new Date,t={},n="确认";e<this.classSession.get("scheduledAt")?this.attendance.qingJia?(t.qingJia=!1,n+="取消请假"):(t.qingJia=!0,t.shangKe=!1,n+="请假"):this.attendance.shangKe?(t.shangKe=!1,n+="没有上课"):(t.shangKe=!0,n+="已上课");var s=this.classSession.get("url"),i=this,a={okText:"确认",cancelText:"取消"},r={title:this.session.name,body:n+"?"};this.$dialog.confirm(r,a).then((function(e){console.log("".concat(JSON.stringify(e))),o.a.Cloud.run("home:updateAttendance",{pathname:s,attendance:t}).then((function(e){console.log("updateAttendance - result: ".concat(JSON.stringify(e))),void 0!=e.qingJia&&(i.attendance.qingJia=e.qingJia),void 0!=e.shangKe&&(i.attendance.shangKe=e.shangKe),i.session.attendanceState=i.toAttendanceStateString(i.attendance)})).catch((function(e){console.log("error in updateAttendance: ".concat(e))}))})).catch((function(e){console.log("error: ".concat(e))}))},editSession:function(){this.session=this.initSession(),this.editing=!0},onReset:function(e){e.preventDefault(),this.editing=!1},onSubmit:function(e){e.preventDefault();var t=this.session.id;console.log("sessionId: ".concat(t));var n=this.classInfo.classSessions.filter((function(e){return e.id===t}))[0],s={okText:"确认",cancelText:"取消"},i={title:this.classInfo.name,body:"".concat(this.session.creating?"创建新课":"修改"," 《").concat(n.get("name"),"》 @ ").concat(this.toLocalDateString(this.session.scheduledAt),"？")},a=this,r=this.session,c=new Date(r.scheduledAt);c.setHours(9),r.scheduledAt=c,this.$dialog.confirm(i,s).then((function(){o.a.Cloud.run("class:updateClassSession",{session:r}).then((function(e){console.log("updateClassSession - result: ".concat(JSON.stringify(e))),a.$router.go()})).catch((function(e){console.log("error in updateAttendance: ".concat(e))}))})).catch((function(e){console.log("error: ".concat(e))}))}}},c=r,l=n("2877"),u=Object(l["a"])(c,s,i,!1,null,null,null);t["a"]=u.exports},"662a":function(e,t,n){"use strict";n.r(t);var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.isLoadingSessions?n("div",{staticClass:"classSession-preview"},[e._v("\n    正在获取上课列表...\n  ")]):n("div",[n("h3",{domProps:{textContent:e._s(e.classInfo.name)}}),n("div",{staticClass:"input-group mb-3"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.filterText,expression:"filterText"}],staticClass:"form-control",attrs:{type:"text","aria-describedby":"basic-addon2",placeholder:"搜索"},domProps:{value:e.filterText},on:{change:function(t){return e.filterSessions(e.filterText)},input:function(t){t.target.composing||(e.filterText=t.target.value)}}}),n("div",{staticClass:"input-group-append"},[n("button",{staticClass:"btn btn-outline-secondary",attrs:{type:"button"},on:{click:e.clearFilter}},[e._v("\n          清除\n        ")]),e.isClassAdmin||e.isTeachingAssistant?n("button",{staticClass:"btn btn-outline-secondary",attrs:{type:"button"},on:{click:e.createSession}},[e._v("\n          "+e._s(e.creatingSession?"取消创建":"创建新课")+"\n        ")]):e._e()])]),0===e.classSessions.length?n("div",[e._v("\n      没有找到上课记录！\n    ")]):e._e(),e.creatingSession?n("ClassSession",{attrs:{classInfo:e.classInfo,classSession:e.newClassSession,attendance:e.newAttendance,newSessions:e.newSessions}}):e._e(),e._l(e.classSessions,(function(t,s){return n("ClassSession",{key:t.id+s,attrs:{classInfo:e.classInfo,classSession:t,attendance:e.attendances[s],newSessions:e.newSessions,isClassAdmin:e.isClassAdmin,isTeachingAssistant:e.isTeachingAssistant,isStudent:e.isStudent}})}))],2)])},i=[],a=(n("8e6e"),n("ac6a"),n("456d"),n("bd86")),o=n("2f62"),r=n("2c634"),c=n("6c33"),l=n("4360");function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,s)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach((function(t){Object(a["a"])(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var h={name:"SessionManagement",components:{ClassSession:r["a"]},computed:d({},Object(o["b"])(["isLoadingSessions","classInfo","classSessions","attendances","newSessions","isClassAdmin","isTeachingAssistant","isStudent"])),beforeRouteEnter:function(e,t,n){l["a"].dispatch(c["d"],e.params["buddhaClassId"]).then((function(){n()}))},data:function(){return{filterText:"",creatingSession:!1,newClassSession:{dummy:!0},newAttendance:{dummy:!0}}},methods:{filterSessions:function(e){this.$store.dispatch(c["f"],e)},clearFilter:function(){this.filterText="",this.$store.dispatch(c["f"],this.filterText)},createSession:function(){this.creatingSession=!this.creatingSession}}},p=h,g=n("2877"),f=Object(g["a"])(p,s,i,!1,null,null,null);t["default"]=f.exports},a481:function(e,t,n){"use strict";var s=n("cb7c"),i=n("4bf8"),a=n("9def"),o=n("4588"),r=n("0390"),c=n("5f1b"),l=Math.max,u=Math.min,d=Math.floor,h=/\$([$&`']|\d\d?|<[^>]*>)/g,p=/\$([$&`']|\d\d?)/g,g=function(e){return void 0===e?e:String(e)};n("214f")("replace",2,(function(e,t,n,f){return[function(s,i){var a=e(this),o=void 0==s?void 0:s[t];return void 0!==o?o.call(s,a,i):n.call(String(a),s,i)},function(e,t){var i=f(n,e,this,t);if(i.done)return i.value;var d=s(e),h=String(this),p="function"===typeof t;p||(t=String(t));var m=d.global;if(m){var v=d.unicode;d.lastIndex=0}var b=[];while(1){var w=c(d,h);if(null===w)break;if(b.push(w),!m)break;var y=String(w[0]);""===y&&(d.lastIndex=r(h,a(d.lastIndex),v))}for(var A="",C=0,x=0;x<b.length;x++){w=b[x];for(var T=String(w[0]),_=l(u(o(w.index),h.length),0),O=[],k=1;k<w.length;k++)O.push(g(w[k]));var D=w.groups;if(p){var $=[T].concat(O,_,h);void 0!==D&&$.push(D);var j=String(t.apply(void 0,$))}else j=S(T,h,_,O,D,t);_>=C&&(A+=h.slice(C,_)+j,C=_+T.length)}return A+h.slice(C)}];function S(e,t,s,a,o,r){var c=s+e.length,l=a.length,u=p;return void 0!==o&&(o=i(o),u=h),n.call(r,u,(function(n,i){var r;switch(i.charAt(0)){case"$":return"$";case"&":return e;case"`":return t.slice(0,s);case"'":return t.slice(c);case"<":r=o[i.slice(1,-1)];break;default:var u=+i;if(0===u)return n;if(u>l){var h=d(u/10);return 0===h?n:h<=l?void 0===a[h-1]?i.charAt(1):a[h-1]+i.charAt(1):n}r=a[u-1]}return void 0===r?"":r}))}}))}}]);
//# sourceMappingURL=chunk-e7247ee6.5656175b.js.map