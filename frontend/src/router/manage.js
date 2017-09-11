import Vue from 'vue'
import Router from 'vue-router'
import ManageLogin from '@/components/manage/ManageLogin'
import Departments from '@/components/manage/department/Departments'
import Positions from '@/components/manage/position/Positions'
import Substations from '@/components/manage/substation/Substations'
import PBCompanies from '@/components/manage/pbCompany/PBCompanies'
import SystemStates from '@/components/manage/systemState/SystemStates'
import FeedbackTypes from '@/components/manage/feedbackType/FeedbackTypes'
import Authorities from '@/components/manage/authority/Authorities'
import SystemManagers from '@/components/manage/systemManager/SystemManagers'
import PaperTypes from '@//components/manage/paperType/PaperTypes'
import CustomerTypes from '@/components/manage/customerType/CustomerTypes'
import Employees from '@/components/manage/employee/Employees'
import Papers from '@/components/manage/paper/Papers'
import Orders from '@/components/manage/order/Orders'
import OrderServices from '@/components/manage/orderService/OrderServices'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ManageLogin',
      component: ManageLogin
    },
    {
      path: '/departments',
      name: 'Departments',
      component: Departments
    },
    {
      path: '/positions',
      name: 'Positions',
      component: Positions
    },
    {
      path: '/substations',
      name: 'Substations',
      component: Substations
    },
    {
      path: '/pbCompanies',
      name: 'PBCompanies',
      component: PBCompanies
    },
    {
      path: '/feedbackTypes',
      name: 'FeedbackTypes',
      component: FeedbackTypes
    },
    {
      path: '/systemStates',
      name: 'SystemStates',
      component: SystemStates
    },
    {
      path: '/authorities',
      name: 'Authorities',
      component: Authorities
    },
    {
      path: '/systemManagers',
      name: 'SystemManagers',
      component: SystemManagers
    },
    {
      path: '/paperTypes',
      name: 'PaperTypes',
      component: PaperTypes
    },
    {
      path: '/customerTypes',
      name: 'CustomerTypes',
      component: CustomerTypes
    },
    {
      path: '/employees',
      name: 'Employees',
      component: Employees
    },
    {
      path: '/papers',
      name: 'Papers',
      component: Papers
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
    }
  ]
})
