import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from 'mitt';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";

library.add(faCheckSquare);

const eventBus = mitt();
const app = createApp(App);
app.config.globalProperties.eventBus = eventBus;

app.use(router).mount("#app");
