<template>
  <div id="app">
    <ManageHeader></ManageHeader>
    <ManageNav></ManageNav><!--
 --><section class="main">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import ManageHeader from '@/components/manage/ManageHeader.vue'
import ManageNav from '@/components/manage/ManageNav.vue'
export default {
  name: 'app',
  components: {
    ManageHeader,
    ManageNav
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
