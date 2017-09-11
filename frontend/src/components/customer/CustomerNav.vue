<template>
  <el-menu :default-active="currentRouter"
    class="nav" :unique-opened="true" :router="true">
    <el-menu-item index="/customer/info">个人信息修改</el-menu-item>
    <el-menu-item index="/customer/favorites">收藏</el-menu-item>
    <el-menu-item index="/customer/orders">历史订单</el-menu-item>
    <el-menu-item index="/customer/deliverPlans">派送计划</el-menu-item>
    <el-menu-item index="/customer/orderServices">服务日志</el-menu-item>
    <el-menu-item index="/customer/feedbacks">反馈记录</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'CustomerNav',
  computed: {
    currentRouter(){
      return this.$route.fullPath;
    }
  }
}
</script>

<style scoped>
.nav{
  position: fixed;
  display: inline-block;
  width: 20%;
  height: calc(100vh - 30px);
  box-shadow: 3px 2px 3px #ccc;
  overflow-y: auto;
  z-index: 5;
}
</style>
