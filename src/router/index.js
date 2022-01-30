import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Wrapper from "../views/Wrapper.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Wrapper,
  },  
  {
    path: "/home",
    name: "Wrapper",
    component: Wrapper,
  },
  {
    path: "/account/:selectedaccount+",
    name: "HomeAccount",
    component: Home,
    props: (route) => ({
      propsaccounts: route.params.selectedaccount,
    }),
  },
  {
    path: "/continuewith/account/:selectedaccount+/session/:sessionid",
    name: "ContinueWith",
    component: () => import("../views/WrapSession.vue"),
    props: (route) => ({
      propsessionid: route.params.sessionid,
      propsaccounts: route.params.selectedaccount,
    }),
  },
  {
    path: "/signwith/account/:selectedaccount+/session/:sessionid",
    name: "SignWith",
    props: (route) => ({
      propsessionid: route.params.sessionid,
      propsaccounts: route.params.selectedaccount,
    }),
    // route level code-splitting
    // this generates a separate chunk (xxx.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/SignWrapSession.vue"),
  },
  {
    path: "/nominate/:selectedaccount+",
    name: "NominateAndVote",
    component: () => import("../views/NominateVote.vue"),
    props: (route) => ({
      propsaccounts: route.params.selectedaccount,
    }),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
