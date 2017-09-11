<template>
  <div>
    <p>您将要从 {{customer.customerTypeName}} 升级为 {{targetCustomerTypeName}}</p>
    <p>请支付升级费用1000元</p>
    <el-button @click="onUpgrade" type="primary">支付</el-button>
  </div>
</template>

<script>
export default {
  name: 'CustomerTypeChangeModal',
  props: {
    targetCustomerTypeId:{
      type: Number,
      required: true
    },
    loading:{
      type: Boolean,
      default: false
    },
    onUpgrade:{
      type: Function,
      required: true
    }
  },
  computed:{
    customer(){
      return this.$store.state.customers.customer;
    },
    targetCustomerTypeName(){
      let index = this.$store.state.customers.customerTypes.findIndex((customerType)=>{return customerType.id == this.$props.targetCustomerTypeId});
      return this.$store.state.customers.customerTypes[index].name;
    }
  }

}
</script>

<style scoped>
  p{
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  button{
    margin-top: 10px;
  }

</style>
