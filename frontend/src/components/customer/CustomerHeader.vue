<template>
  <header>
    <div class="headerLeft">
      <img src="../../assets/logo.png" height="30" width="30">
      <p>POMS报刊订阅系统</p>
    </div>
    <div class="headerRight logged" v-if="customer">
      <p>{{customer.nickname}}</p>
      <img v-if="customer.avator" :src="customer.avator" height="30" width="30">
      <img v-else src="../../assets/logo.png" height="30" width="30">
      <el-button icon="quit" @click="quit"></el-button>
    </div>
    <div v-else class="headerRight unlogged">
      <p class="description">您还没有登录</p>
      <p><el-button @click="openLogginModal">登录</el-button>/<el-button @click="openRegistModal">注册</el-button></p>
    </div>
    <el-menu class="customerHeader" mode="horizontal" v-if="customer" :router="true">
      <el-menu-item index="/">报刊架</el-menu-item>
      <el-menu-item index="/shoppingCart">购物车</el-menu-item>
      <el-menu-item index="/customer/info">个人中心</el-menu-item>
    </el-menu>
  </header>
</template>

<script>
  export default {
    name: 'CustomerHeader',
    computed: {
      customer(){
        return this.$store.state.customers.customer;
      }
    },
    methods:{
      openLogginModal(){
        this.$store.commit('openCustomerModal', true);
      },
      openRegistModal(){
        this.$store.commit('openCustomerModal', false);
      },
      quit(){
        this.$store.dispatch('quitCustomer')
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
    height: 60px;
    padding: 0 60px;
    color: #48576a;
    box-shadow: 1px 3px 3px #ccc;
    z-index: 10;
  }
  .headerLeft{
    float: left;
  }
  .headerLeft img{
    margin: 15px 0;
    height: 30px;
    width: 30px;
    line-height: 50px;
    vertical-align: middle;
  }
  .headerLeft p{
    display: inline-block;
    font-size: 1rem;
    vertical-align: middle;
  }
  ul{
    float: right;
    display: inline-block;
    background-color: transparent;
  }
  .headerRight{
    float: right;
    line-height: 50px;
    height: 50px;
    margin: 5px 0;
    margin-left: 80px;
  }
  .headerRight p{
    display: inline-block;
    vertical-align: middle;
  }
  .headerRight img{
    margin: 0;
    border-radius: 50%;
    vertical-align: middle;
  }
  .description{
    margin-right: 10px;
  }
  .logged button{
    padding: 0;
    border: none;
    height: 30px;
    font-size: 20px !important;
    line-height: 30px;
    margin-left: 20px !important;
    color: #7c7c7c;
    vertical-align: middle;
  }
  .unlogged button{
    background: none;
    outline: none;
    border: none;
    color: blue;
    margin: 0 !important;
    padding: 0 5px;
    font-size: 1rem;
  }
</style>
