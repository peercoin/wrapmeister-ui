import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from "mitt";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  faQuestionCircle,
  faArrowCircleLeft,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faTelegramPlane,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import store from "./store";

library.add(
  faCheckSquare,
  faExclamationTriangle,
  faCopy,
  faDiscord,
  faQuestionCircle,
  faGithub,
  faTelegramPlane,
  faTimes,
  faArrowCircleLeft,
  faTimesCircle
);

const eventBus = mitt();
const app = createApp(App);
app.config.globalProperties.eventBus = eventBus;

app
  .use(router)
  .use(store)
  .mount("#app");
