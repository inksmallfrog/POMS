// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// Promise 和 fetch 支持
import Promise from 'promise-polyfill';
import 'whatwg-fetch'

//Vue支持
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../../router/customer.js';

import store from '../../store/manageStore.js';

//ElementUI组件支持
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.use(ElementUI);
Vue.component(CollapseTransition.name, CollapseTransition);

import _ from 'lodash';

//自定义组件
import Customer from './Customer.vue'

//自定义资源
import '../../assets/fonts/iconfont.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<Customer/>',
  components: { Customer }
})
