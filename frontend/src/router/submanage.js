import Vue from 'vue'
import Router from 'vue-router'
import SubManageLogin from '@/components/submanage/SubManageLogin'
import DeliverPlans from '@/components/submanage/deliverPlan/DeliverPlans'
import Orders from '@/components/submanage/order/Orders'
import OrderServices from '@/components/submanage/orderService/OrderServices'
import Feedbacks from '@/components/submanage/feedback/Feedbacks'
import Invoices from '@/components/submanage/invoice/Invoices'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SubManageLogin',
      component: SubManageLogin
    },
    {
      path: '/deliverPlans',
      name: 'DeliverPlans',
      component: DeliverPlans
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders
    },
    {
      path: '/orderServices',
      name: 'OrderServices',
      component: OrderServices
    },
    {
      path: '/feedbacks',
      name: 'Feedbacks',
      component: Feedbacks
    },
    {
      path: '/invoices',
      name: 'Invoices',
      component: Invoices
    },
  ]
})
