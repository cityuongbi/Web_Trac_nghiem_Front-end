import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './axios'
import { useUserStore } from './stores/users'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App);

app.use(createPinia());
app.use(Antd);
app.use(router);

const userStore = useUserStore();
await userStore.getUser();

app.mount('#app');
