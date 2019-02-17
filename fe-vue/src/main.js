import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import Table from "./components/Table";

Vue.use(BootstrapVue);
Vue.use(VueRouter);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import TimeButtons from "./components/TimeButtons";

Vue.config.productionTip = false;

/*
Router configuration
 */
const router = new VueRouter({
  mode: 'history',
  /*
  We just add one route
   */
  routes: [{
    // Wildcard path
    path: '*',
    // Specify component to be rendered for this route
    component: [Table, TimeButtons],
    // Inject  props based on route.query values (our query parameters)
    props: (route) => ({
      from: route.query.from,
    })
  }]
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
