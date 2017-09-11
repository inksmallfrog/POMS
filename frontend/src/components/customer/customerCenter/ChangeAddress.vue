<!--
  转址服务对话框
-->
<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="新地址" prop="newData">
      <el-select v-model="formData.newDeliverAddressId" size="small">
        <el-option v-for="deliverAddress in addresses" value-key="id"
          :key="deliverAddress.id"
          :label="deliverAddress.detailAddress"
          :value="deliverAddress.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ChangeAddress',
  props:{
    //待转址的订单
    order: {
      type: Object,
      required: true
    },
    //加载动画
    loading: {
      type: Boolean,
      required: true
    },
    //表单提交回调函数
    onSubmit: {
      type: Function,
      required: true
    }
  },
  data(){
    return{
      rules:{},
      formData: {}
    }
  },
  computed:{
    //用户的全部可用地址
    addresses(){
      return this.$store.state.customers.deliverAddresses;
    }
  },
  methods:{
    /**
     * 提交按钮回调函数
     * @param  {String} formName [数据所在的表单ref名]
     * @return {undefined}
     */
    submitForm(formName) {
      //验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //获取所选地址id对应的详细地址
          let newDeliverAddress = this.addresses.find((address)=>{
            return address.id == this.formData.newDeliverAddressId;
          })
          //将详细地址填充入newData
          this.formData.newData = newDeliverAddress.detailAddress;
          //执行提交回调函数
          this.$props.onSubmit(this.formData);
        } else {
          return false;
        }
      });
    },
    /**
     * 重置表单
     * @param  {String} formName [重置的表单ref名]
     * @return {undefined}
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData = this.initForm();
    },
    /**
     * 返回表单数据的默认值
     * @return {Object} [表单数据的默认值]
     */
    initForm(){
      return {
        newDeliverAddressId: this.addresses[0].id
      }
    },
  },
  watch:{
    //订单改变时，重置表单选项
    'order': function(){
      this.formData = this.initForm();
    }
  },
  //初次挂载组件时，重置表单选项
  mounted(){
    this.formData = this.initForm();
  }
}
</script>
