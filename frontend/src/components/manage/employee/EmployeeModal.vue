<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading || relativeLoading" :element-loading-text="relativeLoading ? '正在加载数据，请稍候' : '正在提交数据，请稍候'">
    <el-form-item label="部门" prop="departmentId">
      <el-select v-model="formData.departmentId" @change="onDepartmentChangeCb(formData.departmentId)">
        <el-option v-for="department in departments" value-key="id"
          :key="department.id"
          :label="department.name"
          :value="department.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="职位" prop="positionId">
      <el-select v-model="formData.positionId" >
        <el-option v-for="position in positions[formData.departmentId]" value-key="id"
          :key="position.id"
          :label="position.name"
          :value="position.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="员工姓名" prop="name" :error="errors.name">
      <el-input v-model="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="绩效" prop="score" v-if="formData.id > 0">
      <el-input v-model="formData.score" type="number" min="0.0" step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="state" v-if="formData.id > 0">
      <el-switch v-model="formData.state" on-text="在职" off-text="离职"
        :on-value="1" :off-value="0"></el-switch>
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
    //部门数据
    departments:{
      type: [Array, null],
      required: true
    },
    //职位数据
    positions:{
      type: [Object, null],
      required: true
    },
    //改变部门时的回调函数
    onDepartmentChange:{
      type: Function,
      required: true
    },
    //编辑的数据源
    edittingData:{
      type: Object,
      required: true
    },
    //编辑错误
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
    relativeLoading:{
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
        name:[
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
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
    },
    '$props.positions': function(){
      console.log(this.$props.positions[this.formData.departmentId])
      if(this.$props.positions[this.formData.departmentId]){
        this.formData.positionId = this.$props.positions[this.formData.departmentId][0] && this.$props.positions[this.formData.departmentId][0].id;
      }
    }
  },
  methods:{
    onDepartmentChangeCb(deptId){
      this.$props.onDepartmentChange(deptId);
      this.formData.positionId = this.$props.positions[this.formData.departmentId] && this.$props.positions[this.formData.departmentId][0] && this.$props.positions[this.formData.departmentId][0].id;
    },
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
      console.assert(this.$props.departments && this.$props.departments.length > 0);
      let departmentId = this.$props.departments && this.$props.departments[0].id;
      console.assert(this.$props.positions[departmentId]);
      let positionId = ''
      if(this.$props.positions[departmentId][0] && this.$props.positions[departmentId][0].id){
        positionId = this.$props.positions[departmentId][0].id;
      }
      return{
        departmentId: departmentId,
        positionId: positionId,
        name: "",
        score: 0,
        state: 1
      }
    }
  },
  //组件第一次加载时，不会watch到edittingData的改变，
  //需要在mounted函数中进行相应处理
  mounted(){
    //根据默认值和编辑的数据源产生表单数据
    this.formData = _.merge({}, this.initForm(), this.$props.edittingData);
    console.log(this.formData);
  }
}
</script>

<style scoped>
  .el-select{
    width: 130px;
  }
</style>
