import { createRouter, createWebHashHistory } from "vue-router";
import WrapperView from "../views/WrapperView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: WrapperView,
  },
  {
    path: "/account/:selectedaccount+",
    name: "HomeAccount",
    component: WrapperView,
    props: (route) => ({
      propsaccounts: route.params.selectedaccount,
    }),
  },
  {
    path: "/account/:selectedaccount+/network/:network/wrap",
    name: "StartWrap",
    component: () => import("../views/WrapSessionView.vue"),
    props: (route) => ({
      propsessionid: "",
      propsaccounts: route.params.selectedaccount,
      propnetwork: route.params.network,
    }),
  },
  {
    path: "/continuewith/account/:selectedaccount+/session/:sessionid",
    name: "ContinueWith",
    component: () => import("../views/WrapSessionView.vue"),
    props: (route) => ({
      propsessionid: route.params.sessionid,
      propsaccounts: route.params.selectedaccount,
      //network is obtained by getsession
    }),
  },
  {
    path: "/account/:selectedaccount+/network/:network/unwrap",
    name: "StartUnwrap",
    component: () => import("../views/UnwrapView.vue"),
    props: (route) => ({
      propsaccounts: route.params.selectedaccount,
      propnetwork: route.params.network,
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
    component: () => import("../views/SignWrapSessionView.vue"),
  },
  {
    path: "/nominate/:selectedaccount+",
    name: "NominateAndVote",
    component: () => import("../views/NominateVoteView.vue"),
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
