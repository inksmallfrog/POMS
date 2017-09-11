<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="部门" prop="departmentId">
      <el-select v-model="formData.departmentId" >
        <el-option v-for="department in departments" value-key="id"
          :key="department.id"
          :label="department.name"
          :value="department.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="职位名称" prop="name" :error="errors.name">
      <el-input v-model="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="薪金" prop="salary">
      <el-input v-model="formData.salary" type="number" min="0.0" step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="绩效工资" prop="scoreRatio">
      <el-input v-model="formData.scoreRatio" type="number" min="0.0" step="0.01"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'PositionModal',
  props: {
    departments:{
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
        name:[
          { required: true, message: '请输入职位名称', trigger: 'blur' }
        ]
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
          let departmentIndex = this.$props.departments.findIndex((department)=>{return department.id == this.formData.departmentId});
          this.formData.departmentName = this.$props.departments[departmentIndex].name;
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
      console.assert(this.$props.departments && this.$props.departments.length > 0)
      let departmentId = this.$props.departments[0].id;
      return{
        departmentId : departmentId,
        departmentName: "",
        name: "",
        salary: 0,
        scoreRatio: 0.0
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
