import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from "mitt";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { faCopy, faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import store from "./store";

library.add(faCheckSquare, faExclamationTriangle, faCopy, faQuestionCircle);

const eventBus = mitt();
const app = createApp(App);
app.config.globalProperties.eventBus = eventBus;

app
  .use(router)
  .use(store)
  .mount("#app");
