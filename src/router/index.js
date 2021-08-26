import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import WrapSession from "../views/WrapSession.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: (route) => ({
      propsaccounts: route.params.selectedaccount,
    }),
  },
  {
    path: "/continuewith/:sessionid",
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
