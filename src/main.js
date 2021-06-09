import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from 'mitt';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFrownOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faFrownOpen);

import { Row, Column, Hidden } from "vue-grid-responsive";

const eventBus = mitt();
const app = createApp(App);
app.config.globalProperties.eventBus = eventBus;

app.component("row", Row);
app.component("column", Column);
app.component("hidden", Hidden);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router).mount("#app");
