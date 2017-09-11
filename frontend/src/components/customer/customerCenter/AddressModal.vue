<!--
  地址编辑对话框
-->
<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="收件人姓名" prop="receiver" :error="editErrors.receiver">
      <el-input v-model="formData.receiver"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="phone" :error="editErrors.phone">
      <el-input v-model="formData.phone"></el-input>
    </el-form-item>
    <el-form-item label="详细地址" prop="detailAddress" :error="editErrors.detailAddress">
      <el-input type="textarea" v-model="formData.detailAddress"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AddressModal',
  props: {
    //要编辑的数据
    //update原数据
    //create新的空数据
    edittingData:{
      type: Object,
      required: true
    },
    //编辑错误
    editErrors:{
      type: Object,
      default: ()=>{
        return {}
      }
    },
    //加载动画
    loading:{
      type: Boolean,
      default: false
    },
    //提交回调函数
    onSubmit:{
      type: Function,
      required: true
    }
  },
  data(){
    return{
      rules:{
        receiver:[
          { required: true, message: '请输入收取人姓名', trigger: 'blur' }
        ],
        phone:[
          { pattern:/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/, message: '请输入正确的联系方式', trigger: 'blur' },
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        detailAddress:[
          { required: true, message: '请输入派送详细地址', trigger: 'blur' }
        ]
      },
      formData:{}
    }
  },
  methods:{
    /**
     * 表单提交按钮回调函数
     * @param  {String} formName 表单ref名
     * @return {undefined}
     */
    submitForm(formName) {
      //验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //通过验证则执行提交回调函数
          this.$props.onSubmit(this.formData);
        } else {
          return false;
        }
      });
    },
    /**
     * 表单重置按钮回调函数
     * @param  {String} formName 表单ref名
     * @return {undefined}
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData = this.initForm();
    },
    /**
     * 初始化表单函数
     * @return {Object} 初始化的表单数据
     */
    initForm(){
      return{
        receiver: "",
        phone: "",
        detailAddress: ""
      }
    }
  },
  watch:{
    //当edittingData改变时，重新构造表单数据
    'edittingData': function(){
      this.formData = _.merge({}, this.initForm(), this.$props.edittingData);
    }
  },
  mounted(){
    //当组件初次挂载时，构造表单数据
    this.formData = _.merge({}, this.initForm(), this.$props.edittingData);
  }
}
</script>
