/*
* @Author: inksmallfrog
* @Date:   2017-08-12 08:33:15
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-08-16 20:58:36
*/

'use strict';
import Vue from 'vue'
import Router from 'vue-router'
import Papers from '@/components/customer/Papers'
import PaperPage from '@/components/customer/PaperPage'
import ShoppingCart from '@/components/customer/ShoppingCart'
import Customer from '@/components/customer/Customer'
import CustomerInfo from '@/components/customer/customerCenter/CustomerInfo'
import Favorites from '@/components/customer/customerCenter/Favorites';
import HistoryOrders from '@/components/customer/customerCenter/HistoryOrders';
import OrderServices from '@/components/customer/customerCenter/OrderServices';
import Feedback from '@/components/customer/Feedback';
import Feedbacks from '@/components/customer/customerCenter/Feedbacks';
import DeliverPlans from '@/components/customer/customerCenter/DeliverPlans';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Papers',
      component: Papers
    },
    {
      path: '/papers/:id',
      name: 'PaperPage',
      component: PaperPage
    },
    {
      path: '/shoppingCart',
      name: 'ShoppingCart',
      component: ShoppingCart
    },
    {
      path: '/customer',
      name: 'Customer',
      component: Customer,
      children: [
        {path: '/customer/info', name:'CustomerInfo', component: CustomerInfo},
        {path: '/customer/favorites', name:'CustomerFavorite', component: Favorites},
        {path: '/customer/orders', name:'HistoryOrders', component: HistoryOrders},
        {path: '/customer/orderServices', name:'OrderServices', component: OrderServices},
        {path: '/customer/feedbacks', name:'Feedbacks', component: Feedbacks},
        {path: '/customer/deliverPlans', name:'DeliverPlans', component: DeliverPlans},
      ]
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback
    }
  ]
})

