import { createApp } from 'vue'
import { createPinia } from 'pinia';
import * as icons from 'lucide-vue-next'
import './style.css'
import App from './App.vue'

const app = createApp(App);
const pinia = createPinia();

for (const [name, component] of Object.entries(icons)) {
  app.component(`Lucide${name}`, component)
}

app.use(pinia);
app.mount('#app');
