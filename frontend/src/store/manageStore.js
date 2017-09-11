/*
* @Author: inksmallfrog
* @Date:   2017-08-07 20:40:17
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-08-17 16:52:16
*/

'use strict';
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import BaseModule from "./base.js";
import ManageModule from "./manage.js";
import CustomerModule from "./customer.js";

export default new Vuex.Store({
  modules:{
    base: BaseModule,
    manage: ManageModule,
    customers: CustomerModule
  }
})
