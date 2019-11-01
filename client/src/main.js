import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import axios from "axios";
import i18n from "./i18n";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "vue-material/dist/vue-material.min.css";
import "swiper/dist/css/swiper.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbvue/build/css/mdb.css";
import BootstrapVue from "bootstrap-vue";
import VueMaterial from "vue-material";
import VueAwesomeSwiper from "vue-awesome-swiper";

Vue.use(BootstrapVue);
Vue.use(VueMaterial);
Vue.use(VueAwesomeSwiper /* { default global options } */);
Vue.use(require("vue-moment"));

Vue.config.productionTip = false;

const token = window.localStorage.getItem("token");
if (token) axios.defaults.headers.common["x-auth-token"] = token;
else delete axios.defaults.headers.common["x-auth-token"];

new Vue({
  router,
  store,
  icons: {
    iconfont: "mdiSvg"
  },
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
