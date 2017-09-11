<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="权限" prop="authorityId">
      <el-select v-model="formData.authorityId" >
        <el-option v-for="authority in authorities" value-key="id"
          :key="authority.id"
          :label="authority.type"
          :value="authority.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="账号" prop="account" :error="errors.account">
      <el-input v-model="formData.account"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password" :error="errors.password">
      <el-input v-model="formData.password"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="phone" :error="errors.phone">
      <el-input v-model="formData.phone"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SystemManagerModal',
  props: {
    authorities:{
      type: [Array, null],
      required: true
    },
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
        account:[
          { required: true, message: '请输入账户名称', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少为6个字符', trigger: 'blur' }
        ],
        phone: [
          { pattern: /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/, message: '请输入正确的联系方式', trigger: 'blur' }
        ]
      },
      formData:{
        authorityId: 1,
        account: "",
        password: "",
        name: "",
        phone: ""
      }
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
      console.assert(this.$props.authorities && this.$props.authorities.length > 0);
      let authorityId = this.$props.authorities[0].id;
      return{
        authorityId: authorityId,
        account: "",
        password: "",
        name: "",
        phone: ""
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
