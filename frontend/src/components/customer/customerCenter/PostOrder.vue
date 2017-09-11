<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="新投递日期" prop="newData">
      <el-date-picker v-model="formData.newData" placeholder="新日期" :pickerOptions="dateOptions"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'PostOrder',
  props:{
    plan: {
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
    },
  },
  data(){
    return{
      rules:{
        newData:[

        ]
      },
      formData: {
        newData: null
      },
      dateOptions:{
        disabledDate:(date)=>{
          return date < new Date();
        }
      }
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
          this.formData = this.initForm();
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
        newData: this.$props.plan && this.$props.plan.deliverDate
      }
    }
  },
  watch:{
    'plan': function(){
      this.dateOptions = {
        disabledDate:(date)=>{
          return date < (this.$props.plan ? this.$props.plan.deliverDate : new Date());
        }
      }
      this.formData = _.merge({}, this.initForm());
      //console.log(this.initForm);
      //console.log(this.formData)
    }
  },
  mounted(){
    this.dateOptions = {
        disabledDate:(date)=>{
          return date < (this.$props.plan ? this.$props.plan.deliverDate : new Date());
        }
      }
    this.formData = _.merge({}, this.initForm());
    //console.log(this.initForm);
    //console.log(this.formData)
  }
}
</script>

<style>
</style>
