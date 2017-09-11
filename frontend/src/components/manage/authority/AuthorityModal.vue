<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="权限名称" prop="type" :error="errors.type">
      <el-input v-model="formData.type"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AuthorityModal',
  props: {
    //编辑的数据源
    edittingData:{
      type: Object,
      required: true
    },
    //错误信息
    errors:{
      type: Object,
      default: ()=>{
        return{}
      }
    },
    //提交动画
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
      //表单校验规则
      rules:{
        type:[
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ]
      },
      //表单数据
      formData:{}
    }
  },
  watch:{
    //当编辑数据修改时
    'edittingData': function(){
      //根据默认值和编辑的数据源产生表单数据
      this.formData = _.merge({}, this.initForm(), this.$props.edittingData);
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
        type: ""
      }
    }
  },
  //组件第一次加载时，不会watch到edittingData的改变，
  //需要在mounted函数中进行相应处理
  mounted(){
    //根据默认值和编辑的数据源产生表单数据
    this.formData = _.merge({}, this.initForm(), this.$props.edittingData);
  }
}
</script>

<style scoped>
  .el-select{
    width: 130px;
  }
</style>
