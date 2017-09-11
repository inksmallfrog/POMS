<template>
  <header>
    <img src="../../assets/logo.png" height="30" width="30">
    <div class="right">
      <el-button icon="notify"></el-button>
      <el-button icon="config"></el-button>
      <el-button icon="quit" @click="quit"></el-button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'ManageHeader',
  methods:{
    quit(){
      this.$store.dispatch('quitSystemManager')
        .then((res)=>{
          this.$router.replace('/');
        })
    }
  }
}
</script>

<style scoped>
  header{
    position:  relative;
    box-sizing: border-box;
    height: 40px;
    padding: 5px 20px;
    background-color: #fff;
    box-shadow: 1px 3px 3px #ccc;
    z-index: 10;
  }
  .right{
    float: right;
    height: 30px;
    line-height: 30px;
  }
  .right span{
    vertical-align: middle;
  }
  button{
    padding: 0;
    border: none;
    height: 30px;
    font-size: 20px !important;
    line-height: 30px;
    margin-left: 20px !important;
    color: #7c7c7c;
  }
  .right img{
    margin-left: 20px;
    vertical-align: middle;
  }
</style>
