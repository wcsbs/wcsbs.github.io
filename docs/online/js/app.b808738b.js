(function(t){function e(e){for(var r,a,i=e[0],u=e[1],s=e[2],l=0,d=[];l<i.length;l++)a=i[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&d.push(o[a][0]),o[a]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(t[r]=u[r]);f&&f(e);while(d.length)d.shift()();return c.push.apply(c,s||[]),n()}function n(){for(var t,e=0;e<c.length;e++){for(var n=c[e],r=!0,a=1;a<n.length;a++){var u=n[a];0!==o[u]&&(r=!1)}r&&(c.splice(e--,1),t=i(i.s=n[0]))}return t}var r={},o={app:0},c=[];function a(t){return i.p+"js/"+({}[t]||t)+"."+{"chunk-0321db5a":"df09f611","chunk-2d0bac97":"5bd10d24","chunk-2d0bd246":"016d940d","chunk-2d0cedd0":"d4a60ce4","chunk-2d0f1193":"3255b57b","chunk-2d207fb4":"e5680b8c","chunk-2d0b3289":"954271bb","chunk-2d0d6d35":"3a15ce88","chunk-2d2086b7":"19680f80","chunk-2d217357":"aa7b16b4","chunk-2d22c101":"e753255b","chunk-52fabea2":"3c7e3c5e","chunk-704fe663":"31703208","chunk-fee37f4e":"802321d9"}[t]+".js"}function i(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(t){var e=[],n=o[t];if(0!==n)if(n)e.push(n[2]);else{var r=new Promise((function(e,r){n=o[t]=[e,r]}));e.push(n[2]=r);var c,u=document.createElement("script");u.charset="utf-8",u.timeout=120,i.nc&&u.setAttribute("nonce",i.nc),u.src=a(t);var s=new Error;c=function(e){u.onerror=u.onload=null,clearTimeout(l);var n=o[t];if(0!==n){if(n){var r=e&&("load"===e.type?"missing":e.type),c=e&&e.target&&e.target.src;s.message="Loading chunk "+t+" failed.\n("+r+": "+c+")",s.name="ChunkLoadError",s.type=r,s.request=c,n[1](s)}o[t]=void 0}};var l=setTimeout((function(){c({type:"timeout",target:u})}),12e4);u.onerror=u.onload=c,document.head.appendChild(u)}return Promise.all(e)},i.m=t,i.c=r,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i.oe=function(t){throw console.error(t),t};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],s=u.push.bind(u);u.push=e,u=u.slice();for(var l=0;l<u.length;l++)e(u[l]);var f=s;c.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},1:function(t,e){},2:function(t,e){},3:function(t,e){},4:function(t,e){},4360:function(t,e,n){"use strict";var r,o,c,a,i,u,s=n("2b0e"),l=n("2f62"),f=n("bd86"),d=n("5ce5"),p=n("6c33"),m="setArticles",h="setLoading",b="logOut",g="setArticle",v="setUser",O="setComments",w="setError",j="setProfile",y="setTags",k="addTag",P="removeTag",x="updateArticleInList",A="resetModuleState",C={tags:[],articles:[],isLoading:!0,articlesCount:0},R={articlesCount:function(t){return t.articlesCount},articles:function(t){return t.articles},isLoading:function(t){return t.isLoading},tags:function(t){return t.tags}},S=(r={},Object(f["a"])(r,p["m"],(function(t,e){var n=t.commit;return n(h),d["a"].query(e.type,e.filters).then((function(t){var e=t.data;n(m,e)})).catch((function(t){throw new Error(t)}))})),Object(f["a"])(r,p["r"],(function(t){var e=t.commit;return d["d"].get().then((function(t){var n=t.data;e(y,n.tags)})).catch((function(t){throw new Error(t)}))})),r),E=(o={},Object(f["a"])(o,h,(function(t){t.isLoading=!0})),Object(f["a"])(o,m,(function(t,e){var n=e.articles,r=e.articlesCount;t.articles=n,t.articlesCount=r,t.isLoading=!1})),Object(f["a"])(o,y,(function(t,e){t.tags=e})),Object(f["a"])(o,x,(function(t,e){t.articles=t.articles.map((function(t){return t.slug!==e.slug||(t.favorited=e.favorited,t.favoritesCount=e.favoritesCount),t}))})),o),T={state:C,getters:R,actions:S,mutations:E},_=n("bf48"),L=n.n(_),U={errors:null,user:{},isAuthenticated:!1},q={currentUser:function(t){return t.user},isAuthenticated:function(t){return t.isAuthenticated}},D=function(){var t=L.a.User.current(),e=document.getElementById("member-func"),n=document.getElementById("non-member-func");t?(e.setAttribute("style","display: block;"),n.setAttribute("style","display: none;")):(n.setAttribute("style","display: block;"),e.setAttribute("style","display: none;"))},F=(c={},Object(f["a"])(c,p["s"],(function(t,e){console.log(p["s"]);var n=e.email,r=e.password;return new Promise((function(e){L.a.User.logIn(n,r).then((function(n){console.log("user logged in: ".concat(n.id)),L.a.Cloud.run("user:getRoles",{}).then((function(r){t.commit(v,r),e(n)}))})).catch((function(e){alert("登录失败！"+e.message),t.commit(w,e.errors)}))}))})),Object(f["a"])(c,p["v"],(function(t,e){return t.commit(b),new Promise((function(t){L.a.User.requestPasswordReset(e.email).then((function(){alert("请求成功！请登录您的电邮，根据电邮指示完成密码重置后，再来登录"),t()})).catch((function(t){alert("重置密码失败！"+t.message)}))}))})),Object(f["a"])(c,p["t"],(function(t){t.commit(b)})),Object(f["a"])(c,p["u"],(function(t,e){var n=e.username,r=e.email,o=e.password,c=e.phone;return new Promise((function(e,a){L.a.Cloud.run("user:signup",{name:n,email:r,password:o,phone:c}).then((function(n){var r=n.data;alert("用户注册成功！请确认您的电邮地址，再来登录"),t.commit(b),e(r)})).catch((function(e){alert("用户注册失败！"+e.message),t.commit(w,e.errors),a(e)}))}))})),Object(f["a"])(c,p["g"],(function(t){console.log("".concat(p["g"]," - ").concat(t,": ").concat(U.user.username," roles: ").concat(U.user.roles))})),Object(f["a"])(c,p["w"],(function(t,e){var n=L.a.User.current();e.password&&n.set("password",e.password),n.set("name",e.username),n.set("phone",e.phone),n.save()})),c),I=(a={},Object(f["a"])(a,w,(function(t,e){t.errors=e})),Object(f["a"])(a,v,(function(t,e){console.log(v),D(),t.isAuthenticated=!0,t.user=e,t.errors={}})),Object(f["a"])(a,b,(function(t){D(),t.isAuthenticated=!1,t.user={},t.errors={},L.a.User.current()&&L.a.User.logOut().then((function(){console.log("user logged out")}))})),a),M={state:U,actions:F,mutations:I,getters:q},H=(n("8e6e"),n("ac6a"),n("456d"),n("96cf"),n("3b8d"));function V(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function W(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?V(Object(n),!0).forEach((function(e){Object(f["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):V(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var J,Y={article:{author:{},title:"",description:"",body:"",tagList:[]},comments:[]},$=W({},Y),B=(i={},Object(f["a"])(i,p["l"],function(){var t=Object(H["a"])(regeneratorRuntime.mark((function t(e,n,r){var o,c;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(void 0===r){t.next=2;break}return t.abrupt("return",e.commit(g,r));case 2:return t.next=4,d["a"].get(n);case 4:return o=t.sent,c=o.data,e.commit(g,c.article),t.abrupt("return",c);case 8:case"end":return t.stop()}}),t)})));return function(e,n,r){return t.apply(this,arguments)}}()),Object(f["a"])(i,p["n"],function(){var t=Object(H["a"])(regeneratorRuntime.mark((function t(e,n){var r,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,d["b"].get(n);case 2:return r=t.sent,o=r.data,e.commit(O,o.comments),t.abrupt("return",o.comments);case 6:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()),Object(f["a"])(i,p["h"],function(){var t=Object(H["a"])(regeneratorRuntime.mark((function t(e,n){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,d["b"].post(n.slug,n.comment);case 2:e.dispatch(p["n"],n.slug);case 3:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()),Object(f["a"])(i,p["i"],function(){var t=Object(H["a"])(regeneratorRuntime.mark((function t(e,n){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,d["b"].destroy(n.slug,n.commentId);case 2:e.dispatch(p["n"],n.slug);case 3:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()),Object(f["a"])(i,p["j"],function(){var t=Object(H["a"])(regeneratorRuntime.mark((function t(e,n){var r,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,d["c"].add(n);case 2:r=t.sent,o=r.data,e.commit(x,o.article,{root:!0}),e.commit(g,o.article);case 6:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()),Object(f["a"])(i,p["k"],function(){var t=Object(H["a"])(regeneratorRuntime.mark((function t(e,n){var r,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,d["c"].remove(n);case 2:r=t.sent,o=r.data,e.commit(x,o.article,{root:!0}),e.commit(g,o.article);case 6:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()),Object(f["a"])(i,p["e"],(function(t){var e=t.state;return d["a"].create(e.article)})),Object(f["a"])(i,p["a"],(function(t,e){return d["a"].destroy(e)})),Object(f["a"])(i,p["b"],(function(t){var e=t.state;return d["a"].update(e.article.slug,e.article)})),Object(f["a"])(i,p["c"],(function(t,e){t.commit(k,e)})),Object(f["a"])(i,p["d"],(function(t,e){t.commit(P,e)})),Object(f["a"])(i,p["f"],(function(t){var e=t.commit;e(A)})),i),Z=(u={},Object(f["a"])(u,g,(function(t,e){t.article=e})),Object(f["a"])(u,O,(function(t,e){t.comments=e})),Object(f["a"])(u,k,(function(t,e){t.article.tagList=t.article.tagList.concat([e])})),Object(f["a"])(u,P,(function(t,e){t.article.tagList=t.article.tagList.filter((function(t){return t!==e}))})),Object(f["a"])(u,A,(function(){for(var t in $)s["a"].set($,t,Y[t])})),u),z={article:function(t){return t.article},comments:function(t){return t.comments}},G={state:$,actions:B,mutations:Z,getters:z},N={errors:{},profile:{}},K={profile:function(t){return t.profile}},Q=(J={},Object(f["a"])(J,p["o"],(function(t,e){var n=e.username;return d["e"].get("profiles",n).then((function(e){var n=e.data;return t.commit(j,n.profile),n})).catch((function(){}))})),Object(f["a"])(J,p["p"],(function(t,e){var n=e.username;return d["e"].post("profiles/".concat(n,"/follow")).then((function(e){var n=e.data;return t.commit(j,n.profile),n})).catch((function(){}))})),Object(f["a"])(J,p["q"],(function(t,e){var n=e.username;return d["e"].delete("profiles/".concat(n,"/follow")).then((function(e){var n=e.data;return t.commit(j,n.profile),n})).catch((function(){}))})),J),X=Object(f["a"])({},j,(function(t,e){t.profile=e,t.errors={}})),tt={state:N,actions:Q,mutations:X,getters:K};s["a"].use(l["a"]);e["a"]=new l["a"].Store({modules:{home:T,auth:M,article:G,profile:tt}})},5:function(t,e){},"56d7":function(t,e,n){"use strict";n.r(e);n("ac6a"),n("5df3"),n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("RwvHeader"),n("router-view"),n("RwvFooter")],1)},c=[],a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("nav",{staticClass:"navbar navbar-light"},[n("div",{staticClass:"container"},[n("router-link",{staticClass:"navbar-brand",attrs:{to:{name:"home"}}},[t._v("\n      闻思修\n    ")]),t.isAuthenticated?n("ul",{staticClass:"nav navbar-nav pull-xs-right",staticStyle:{"list-style-type":"none"}},[n("li",{staticClass:"nav-item"},[n("router-link",{staticClass:"nav-link",attrs:{"active-class":"active",exact:"",to:{name:"settings"}}},[n("i",{staticClass:"ion-gear-a"}),t._v(" 设置\n        ")])],1)]):n("ul",{staticClass:"nav navbar-nav pull-xs-right",staticStyle:{"list-style-type":"none"}},[n("li",{staticClass:"nav-item"},[n("router-link",{staticClass:"nav-link",attrs:{"active-class":"active",exact:"",to:{name:"login"}}},[n("i",{staticClass:"ion-compose"}),t._v("登录\n        ")])],1),n("li",{staticClass:"nav-item"},[n("router-link",{staticClass:"nav-link",attrs:{"active-class":"active",exact:"",to:{name:"register"}}},[n("i",{staticClass:"ion-compose"}),t._v("注册\n        ")])],1)])],1)])},i=[],u=(n("8e6e"),n("456d"),n("bd86")),s=n("2f62");function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function f(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){Object(u["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var d={name:"RwvHeader",computed:f({},Object(s["b"])(["currentUser","isAuthenticated"]))},p=d,m=n("2877"),h=Object(m["a"])(p,a,i,!1,null,null,null),b=h.exports,g=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div")},v=[],O={name:"RwvFooter"},w=O,j=Object(m["a"])(w,g,v,!1,null,null,null),y=j.exports,k={name:"App",components:{RwvHeader:b,RwvFooter:y}},P=k,x=Object(m["a"])(P,o,c,!1,null,null,null),A=x.exports,C=n("8c4f");r["a"].use(C["a"]);var R=new C["a"]({routes:[{path:"/",component:function(){return n.e("chunk-704fe663").then(n.bind(null,"bb51"))},children:[{path:"",name:"home",component:function(){return Promise.all([n.e("chunk-0321db5a"),n.e("chunk-2d0bac97")]).then(n.bind(null,"3961"))}},{path:"my-feed",name:"home-my-feed",component:function(){return Promise.all([n.e("chunk-0321db5a"),n.e("chunk-2d207fb4")]).then(n.bind(null,"a39e"))}},{path:"tag/:tag",name:"home-tag",component:function(){return Promise.all([n.e("chunk-0321db5a"),n.e("chunk-2d0cedd0")]).then(n.bind(null,"60ee"))}}]},{name:"login",path:"/login",component:function(){return n.e("chunk-2d2086b7").then(n.bind(null,"a55b"))}},{name:"forgotPassword",path:"/forgotPassword",component:function(){return n.e("chunk-2d22c101").then(n.bind(null,"f243"))}},{name:"register",path:"/register",component:function(){return n.e("chunk-2d0d6d35").then(n.bind(null,"73cf"))}},{name:"settings",path:"/settings",component:function(){return n.e("chunk-2d0b3289").then(n.bind(null,"26d3"))}},{path:"/@:username",component:function(){return n.e("chunk-2d217357").then(n.bind(null,"c66d"))},children:[{path:"",name:"profile",component:function(){return Promise.all([n.e("chunk-0321db5a"),n.e("chunk-2d0f1193")]).then(n.bind(null,"9ed5"))}},{name:"profile-favorites",path:"favorites",component:function(){return Promise.all([n.e("chunk-0321db5a"),n.e("chunk-2d0bd246")]).then(n.bind(null,"2b77"))}}]},{name:"article",path:"/articles/:slug",component:function(){return n.e("chunk-52fabea2").then(n.bind(null,"3ad6"))},props:!0},{name:"article-edit",path:"/editor/:slug?",props:!0,component:function(){return n.e("chunk-fee37f4e").then(n.bind(null,"04d0"))}}]}),S=n("4360"),E=n("9483");Object(E["a"])("".concat("","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},cached:function(){console.log("Content has been cached for offline use.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}});var T=n("bf48"),_=n.n(T),L=n("6c33"),U=n("5ce5"),q=n("70f2"),D=n.n(q),F=function(t){return D()(new Date(t),"MMMM D, YYYY")},I=function(t){return"".concat(t[0])};r["a"].config.productionTip=!1,r["a"].filter("date",F),r["a"].filter("error",I),U["e"].init(),_.a.initialize("ac8UZVIGoUpTW7dIF9no0KsaG8AvEWJV5ykCjJSS","07aVCHnW5psmgZ9fcSM54VAfTgsAwOTHud7HkyZH"),_.a.serverURL="https://parseapi.back4app.com",R.beforeEach((function(t,e,n){return Promise.all([S["a"].dispatch(L["g"])]).then(n)})),new r["a"]({router:R,store:S["a"],render:function(t){return t(A)}}).$mount("#app")},"5ce5":function(t,e,n){"use strict";n.d(e,"d",(function(){return h})),n.d(e,"a",(function(){return b})),n.d(e,"b",(function(){return g})),n.d(e,"c",(function(){return v}));var r=n("2b0e"),o=n("bc3a"),c=n.n(o),a=n("a7fe"),i=n.n(a),u="id_token",s=function(){return window.localStorage.getItem(u)},l=function(t){window.localStorage.setItem(u,t)},f=function(){window.localStorage.removeItem(u)},d={getToken:s,saveToken:l,destroyToken:f},p="https://conduit.productionready.io/api",m={init:function(){r["a"].use(i.a,c.a),r["a"].axios.defaults.baseURL=p},setHeader:function(){r["a"].axios.defaults.headers.common["Authorization"]="Token ".concat(d.getToken())},query:function(t,e){return r["a"].axios.get(t,e).catch((function(t){throw new Error("[RWV] ApiService ".concat(t))}))},get:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return r["a"].axios.get("".concat(t,"/").concat(e)).catch((function(t){throw new Error("[RWV] ApiService ".concat(t))}))},post:function(t,e){return r["a"].axios.post("".concat(t),e)},update:function(t,e,n){return r["a"].axios.put("".concat(t,"/").concat(e),n)},put:function(t,e){return r["a"].axios.put("".concat(t),e)},delete:function(t){return r["a"].axios.delete(t).catch((function(t){throw new Error("[RWV] ApiService ".concat(t))}))}},h=(e["e"]=m,{get:function(){return m.get("tags")}}),b={query:function(t,e){return m.query("articles"+("feed"===t?"/feed":""),{params:e})},get:function(t){return m.get("articles",t)},create:function(t){return m.post("articles",{article:t})},update:function(t,e){return m.update("articles",t,{article:e})},destroy:function(t){return m.delete("articles/".concat(t))}},g={get:function(t){if("string"!==typeof t)throw new Error("[RWV] CommentsService.get() article slug required to fetch comments");return m.get("articles","".concat(t,"/comments"))},post:function(t,e){return m.post("articles/".concat(t,"/comments"),{comment:{body:e}})},destroy:function(t,e){return m.delete("articles/".concat(t,"/comments/").concat(e))}},v={add:function(t){return m.post("articles/".concat(t,"/favorite"))},remove:function(t){return m.delete("articles/".concat(t,"/favorite"))}}},6:function(t,e){},"6c33":function(t,e,n){"use strict";n.d(e,"e",(function(){return r})),n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return c})),n.d(e,"c",(function(){return a})),n.d(e,"d",(function(){return i})),n.d(e,"f",(function(){return u})),n.d(e,"g",(function(){return s})),n.d(e,"h",(function(){return l})),n.d(e,"i",(function(){return f})),n.d(e,"j",(function(){return d})),n.d(e,"k",(function(){return p})),n.d(e,"l",(function(){return m})),n.d(e,"m",(function(){return h})),n.d(e,"n",(function(){return b})),n.d(e,"o",(function(){return g})),n.d(e,"p",(function(){return v})),n.d(e,"q",(function(){return O})),n.d(e,"r",(function(){return w})),n.d(e,"s",(function(){return j})),n.d(e,"v",(function(){return y})),n.d(e,"t",(function(){return k})),n.d(e,"u",(function(){return P})),n.d(e,"w",(function(){return x}));var r="publishArticle",o="deleteArticle",c="editArticle",a="addTagToArticle",i="removeTagFromArticle",u="resetArticleState",s="checkAuth",l="createComment",f="destroyComment",d="addFavorite",p="removeFavorite",m="fetchArticle",h="fetchArticles",b="fetchComments",g="fetchProfile",v="fetchProfileFollow",O="fetchProfileUnfollow",w="fetchTags",j="login",y="resetPassword",k="logout",P="register",x="updateUser"},7:function(t,e){},8:function(t,e){},9:function(t,e){}});
//# sourceMappingURL=app.b808738b.js.map