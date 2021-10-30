import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Monitor, { trackEvent } from '@monitor/buried-point';

import { sync } from 'vuex-router-sync';

sync(store, router, { moduleName: 'router' });

Vue.use(Monitor, {
  token: 'xxx',
  uid: () => store.getters.fullPath,
  debug: true,
  trackUrl: 'http://localhost:9527/report/create',
  router
});

trackEvent('buy', { price: '￥123', id: 'xxxx-xxxx-xxxx' });
new Function();
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
