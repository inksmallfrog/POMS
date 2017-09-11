<template>
  <div>
    <CustomerNav>
    </CustomerNav><!--
 --><section>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
  import CustomerNav from '@/components/customer/CustomerNav'
  export default{
    name: 'Customer',
    components:{
      CustomerNav
    }
  }
</script>

<style scoped>
div{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
section{
  position: absolute;
  top: 0;
  left: 20%;
  right: 0;
  bottom: 0;
}
</style>
