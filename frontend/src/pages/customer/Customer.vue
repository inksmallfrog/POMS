<template>
  <div id="app" v-loading.fullscreen="loading">
    <CustomerHeader></CustomerHeader><!--
 --><section class="main">
      <router-view></router-view>
    </section>
    <div class="modal" v-if="isCustomerModalShow" @click="closeModal">
      <CustomerModal :state="$store.state.customers.customerModalState"></CustomerModal>
    </div>
  </div>
</template>

<script>
import CustomerHeader from '@/components/customer/CustomerHeader'
import CustomerModal from '@/components/customer/CustomerModal'
export default {
  name: 'app',
  components: {
    CustomerHeader,
    CustomerModal
  },
  data(){
    return{
      loading: false
    }
  },
  computed:{
    isCustomerModalShow(){
      return this.$store.state.customers.isCustomerModalShow;
    }
  },
  mounted(){
    this.$store.commit('initNotify', this.$notify.error);
    this.loading = true;
    this.$store.dispatch('loadingBase')
      .then((res)=>{
        console.log('minmi');
        this.loading = false;
      });
    this.$store.dispatch('hasLogged');
  },
  methods:{
    closeModal(){
      this.$store.commit('closeCustomerModal');
    }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
body{
  background: ;
  overflow-y: hidden;
  font-family:  "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
}
.main{
  position: absolute;
  box-sizing: border-box;
  padding: 20px 60px;
  top: 60px;
  left: 0;
  right: 0;
  height: calc(100vh - 60px);
  overflow-y: auto;
  background-color: #eee;
}
.modal{
  position: fixed;
  z-index: 999;
  display: flex;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(128, 128, 128, 0.7);
}
#app {

}
.el-collapse-item__header,
.el-collapse-item__wrap{
  border: none;
  background-color: #eee;
}
</style>
