import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home"),
      meta: { requiresAuth: true }
    },
    {
      path: "/user-management",
      name: "home-user-management",
      component: () => import("@/views/HomeUserManagement"),
      meta: { requiresAuth: true }
    },
    {
      path: "/my-feed",
      name: "home-my-feed",
      component: () => import("@/views/HomeMyFeed"),
      meta: { requiresAuth: true }
    },
    {
      name: "login",
      path: "/login",
      component: () => import("@/views/Login")
    },
    {
      name: "forgotPassword",
      path: "/forgotPassword",
      component: () => import("@/views/ForgotPassword")
    },
    {
      name: "register",
      path: "/register",
      component: () => import("@/views/Register")
    },
    {
      name: "settings",
      path: "/settings",
      meta: { requiresAuth: true },
      component: () => import("@/views/Settings")
    },
    {
      name: "user",
      path: "/users/:slug",
      meta: { requiresAuth: true },
      component: () => import("@/views/User"),
      props: true
    },
    {
      name: "createUser",
      path: "/createUser",
      meta: { requiresAuth: true },
      component: () => import("@/views/User")
    }
  ]
});
