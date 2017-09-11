<template>
  <el-menu :default-active="currentRouter"
    class="nav" :unique-opened="true" :router="true">
    <el-menu-item index="/deliverPlans">分发日志管理</el-menu-item>
    <el-menu-item index="/orders">订单查询</el-menu-item>
    <el-menu-item index="/orderServices">服务日志</el-menu-item>
    <el-menu-item index="/feedbacks">反馈处理</el-menu-item>
    <el-menu-item index="/invoices">发票管理</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'ManageNav',
  computed: {
    currentRouter(){
      return this.$route.fullPath;
    }
  }
}
</script>

<style scoped>
  .nav{
    position: relative;
    display: inline-block;
    width: 20%;
    height: calc(100vh - 30px);
    box-shadow: 3px 2px 3px #ccc;
    overflow-y: auto;
    z-index: 5;
  }
</style>
