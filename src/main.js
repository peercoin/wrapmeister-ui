import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)




import { Row, Column, Hidden } from "vue-grid-responsive";

const app = createApp(App);

app.component("row", Row);
app.component("column", Column);
app.component("hidden", Hidden);
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router).mount("#app");
