<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="实发数" prop="realDeliverAmount">
      <el-input v-model="formData.realDeliverAmount" type="number" min="0" step="1"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FeedbackTypeModal',
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
          this.formData.actualDeliverAddress = this.formData.detailAddress;
          this.$props.onSubmit(this.formData);
        } else {
          return false;
        }
      });
    },
    changeState(state){
      this.formData.state = 1;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData = this.initForm();
    },
    initForm(){
      return{
        realDeliverAmount: 0,
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
  .el-select{
    width: 130px;
  }
</style>
