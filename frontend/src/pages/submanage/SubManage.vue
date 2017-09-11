<template>
  <div id="app">
    <SubManageHeader></SubManageHeader>
    <SubManageNav></SubManageNav><!--
 --><section class="main">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import SubManageHeader from '@/components/submanage/SubManageHeader.vue'
import SubManageNav from '@/components/submanage/SubManageNav.vue'
export default {
  name: 'app',
  components: {
    SubManageHeader,
    SubManageNav
  },
  mounted(){
    this.$store.commit('initNotify', this.$notify.error);
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
body{
  background: #eee;
  overflow-y: hidden;
  font-family:  "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
}
.main{
  position: absolute;
  box-sizing: border-box;
  padding: 20px;
  top: 30px;
  left: 20%;
  right: 0;
  height: calc(100vh - 30px);
  overflow-y: auto;
}
#app {

}
</style>
