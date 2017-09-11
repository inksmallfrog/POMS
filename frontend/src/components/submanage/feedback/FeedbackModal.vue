<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <div class="formSection first">
      <h1>{{edittingData.title}}</h1>
      <div class="feedbackInfo">
        <span>客户: {{edittingData.customerRealname}}</span>
        <span>对象: {{edittingData.toWhom}}</span>
        <span>时间: {{formatDate(edittingData.feedbackDate)}}</span>
      </div>
    </div>
    <div class="formSection">
      <h2>内容</h2>
      <p class="content">{{edittingData.content}}</p>
    </div>
    <div class="formSection">
      <h2>回执</h2>
      <el-input v-model="formData.reply" type="textarea" :rows="6"></el-input>
    </div>

    <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
  </el-form>
</template>

<script>
import dateFormat from 'dateformat';
export default {
  name: 'FeedbackModal',
  props: {
    edittingData:{        //需要编辑的数据
      type: Object,
      required: true
    },
    errors:{
      type: Object,
      default: ()=>{
        return{
          name: ""
        }
      }
    },
    loading:{
      type: Boolean,
      default: false
    },
    onSubmit:{
      type: Function,
      required: true
    }
  },
  data(){
    return{
      rules:{
      },
      formData:{}
    }
  },
  watch:{
    'edittingData': function(){
      this.formData = _.merge({}, this.initForm(), this.$props.edittingData);
    }
  },
  methods:{
    submitForm(formName) {
      //验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData.state = 1;
          this.$props.onSubmit(this.formData);
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData = this.initForm();
    },
    formatDate(date){
      return dateFormat(date, 'yyyy-mm-dd');
    },
    initForm(){
      return{
        reply: '',
        state: 1
      }
    }
  },
  mounted(){
    this.formData = _.merge({}, this.initForm(), this.$props.edittingData);
  }
}
</script>

<style scoped>
  .feedbackInfo span{
    margin-right: 20px;
  }
  .formSection.first{
    margin-top: 0;
  }
  .formSection{
    margin: 20px 0;
  }
  h2{
    margin-bottom: 10px;
  }
</style>
