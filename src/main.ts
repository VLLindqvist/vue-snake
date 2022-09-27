import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import Vue3Lottie from "vue3-lottie";
import "vue3-lottie/dist/style.css";

import "flowbite";
import "./globalstyles.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(MotionPlugin);
app.use(Vue3Lottie);
app.mount("#app");
