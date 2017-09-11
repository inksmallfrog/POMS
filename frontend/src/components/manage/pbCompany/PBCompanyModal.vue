<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="报社名称" prop="name" :error="errors.name">
      <el-input v-model="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="联系人" prop="contacterName">
      <el-input v-model="formData.contacterName"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="phone" :error="errors.phone">
      <el-input v-model="formData.phone"></el-input>
    </el-form-item>
    <el-form-item label="联系地址" prop="address">
      <el-input v-model="formData.address"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'PBCompanyModal',
  props: {
    edittingData:{        //需要编辑的数据
      type: Object,
      required: true
    },
    errors:{
      type: Object,
      default: ()=>{
        return{}
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
        name:[
          { required: true, message: '请输入报社名称', trigger: 'blur' }
        ],
        phone:[
          { pattern:/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/, message: '请输入正确的联系方式', trigger: 'blur' }
        ],
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
    initForm(){
      return{
        name: "",
        contacterName: "",
        phone: "",
        address: ""
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
