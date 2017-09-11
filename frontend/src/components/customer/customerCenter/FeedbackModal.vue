<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="反馈提交中，请稍后">
    <el-form-item label="反馈类型">
      <el-select v-model="formData.feedbackTypeId">
        <el-option v-for="feedbackType in feedbackTypes"
          :key="feedbackType.id"
          :label="feedbackType.name"
          :value="feedbackType.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="反馈对象" prop="toWhom">
      <el-input v-model="formData.toWhom" placeholder="请输入反馈对象"></el-input>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="formData.content" type="textarea"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default{
  name: 'FeedbackModal',
  data(){
    return{
      formData: {},
      rules:{
        toWhom:[
          { required: true, message: '请输入反馈对象', trigger: 'blur' }
        ],
        title:[
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      }
    }
  },
  props:{
    visible: {
      type: Boolean,
      required: true
    },
    feedbackTypes: {
      type: [Array, null],
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
  watch:{
    'visible': function(){
      if(this.$props.visible){
        this.formData = this.initForm();
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
          this.onSubmit(this.formData);
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
      console.assert(this.feedbackTypes.length);
      return{
        feedbackTypeId: this.feedbackTypes[0].id,
        toWhom: 'POMS系统',
        title: "",
        content: ""
      }
    }
  },
  mounted(){
    this.formData = this.initForm();
  }
}
</script>
