<template>
  <el-form v-loading="loading" element-loading-text="付款中，请稍候">
    <h1>订单付款中</h1>
    <div>您共需缴纳费用 {{totalPrice}} 元</div>
    <el-button @click="onPay" type="primary">支付</el-button>
  </el-form>
</template>

<script>
export default{
  name: "PayModal",
  props:{
    loading:{
      type: Boolean,
      required: true
    },
    totalPrice:{
      type: [String, Number],
      required: true
    },
    onPay:{
      type: Function,
      required: true
    }
  }
}
</script>

<style>
</style>
