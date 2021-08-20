import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    // e.g: http://localhost:8080/#/continuewith?sessionid=asfdg33dfsv24e
    path: '/continuewith',
    component: Home,
    props: route => ({ propsessionid: route.query.sessionid })
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
