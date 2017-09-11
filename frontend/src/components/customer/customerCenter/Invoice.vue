<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="抬头" prop="header">
      <el-input v-model="formData.header"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input v-model="formData.content" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="金额" prop="amount">
      {{order.discountPrice.toFixed(2)}}元
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Invoice',
  props:{
    invoice: {
      type: Object,
      required: true
    },
    order: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    onSubmit: {
      type: Function,
      required: true
    }
  },
  data(){
    return{
      rules:{
        header:[
          { required: true, message: '发票抬头不能为空', trigger: 'blur' }
        ]
      },
      formData: {}
    }
  },
  watch:{
    //当编辑数据修改时
    'invoice': function(){
      this.formData = _.merge({}, this.initForm(), this.$props.invoice);
    }
  },
  methods:{
    /**
     * 提交按钮回调函数
     * @param  {String} formName [数据所在的表单名]
     * @return {undefined}
     */
    submitForm(formName) {
      //验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //执行提交回调函数
          this.$props.onSubmit(this.formData);
        } else {
          return false;
        }
      });
    },
    /**
     * 重置表单
     * @param  {String} formName [重置的表单名]
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
        header: "",
        content: ""
      }
    }
  },
  mounted(){
    this.formData = _.merge({}, this.initForm(), this.$props.invoice);
  }
}
</script>

<style>
</style>
