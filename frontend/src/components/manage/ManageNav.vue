<template>
  <el-menu :default-active="currentRouter"
    class="nav" :unique-opened="true" :router="true">
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-dict"></i>
        <span slot="title">字典管理</span>
      </template>
      <el-menu-item index="/departments">部门管理</el-menu-item>
      <el-menu-item index="/positions">职务管理</el-menu-item>
      <el-menu-item index="/substations">分站管理</el-menu-item>
      <el-menu-item index="/pbCompanies">报社管理</el-menu-item>
      <el-menu-item index="/feedbackTypes">反馈类型管理</el-menu-item>
      <el-menu-item index="/systemStates">系统状态管理</el-menu-item>
      <el-menu-item index="/authorities">权限管理</el-menu-item>
      <el-menu-item index="/paperTypes">报刊类型管理</el-menu-item>
      <el-menu-item index="/systemManagers">系统管理员管理</el-menu-item>
      <el-menu-item index="/customerTypes">客户类型管理</el-menu-item>
    </el-submenu>
    <el-menu-item index="/employees">
      <i class="el-icon-employee"></i>
      <span slot="title">员工管理</span>
    </el-menu-item>
    <el-menu-item index="/papers">
      <i class="el-icon-paper"></i>
      <span slot="title">报刊管理</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-chart"></i>
        <span slot="title">报表查询</span>
      </template>
      <el-menu-item index="/orders">订单查询</el-menu-item>
      <el-menu-item index="/orderServices">服务查询</el-menu-item>
    </el-submenu>
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
