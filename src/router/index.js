import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import WrapSession from "../views/WrapSession.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/account/:selectedaccount",
    name: "HomeAccount",
    component: Home,
    props: (route) => ({
      propsaccounts: route.params.selectedaccount,
    }),
  },
  {
    path: "/continuewith/account/:selectedaccount/session/:sessionid",
    name: "ContinueWith",
    component: WrapSession,
    props: (route) => ({
      propsessionid: route.params.sessionid,
      propsaccounts: route.params.selectedaccount,
    }),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
