import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import MRegion from 'region-selector'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(MRegion);
Vue.config.productionTip = false;
//日期格式化
Vue.filter('formatDate', function (value, caret) {
  let d = new Date(value);
  if (!caret) caret = "-";
  return d.getFullYear() + caret + (d.getMonth() + 1) + caret + d.getDate();
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');