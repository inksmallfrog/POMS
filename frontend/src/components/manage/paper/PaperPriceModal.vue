<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-form-item label="用户类型" prop="customerTypeId">
      <el-select v-model="formData.customerTypeId" @change="handleChangeCustomerType">
        <el-option v-for="customerType in customerTypes" value-key="id"
          :key="customerType.id"
          :label="customerType.name"
          :value="customerType.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="单价" prop="singlePrice">
      <el-input v-model="formData.singlePrice" type="number" min="0.0" step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="月价" prop="monthPrice">
      <el-input v-model="formData.monthPrice" type="number" min="0.0" step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="季度价" prop="seasonPrice">
      <el-input v-model="formData.seasonPrice" type="number" min="0.0" step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="半年价" prop="halfYearPrice">
      <el-input v-model="formData.halfYearPrice" type="number" min="0.0" step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="年价" prop="wholeYearPrice">
      <el-input v-model="formData.wholeYearPrice" type="number" min="0.0" step="0.01"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
      <el-button @click="resetForm('editForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'PaperPriceModal',
  props: {
    //客户类型
    customerTypes:{
      type: [Array, null],
      required: true
    },
    //编辑中的数据
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
      //校验规则
      rules:{
      },
      //表单数据
      formData:{
      }
    }
  },
  watch:{
    //当编辑数据修改时
    'edittingData': function(){
      //获取客户类型的种类
      let customerTypes = Object.keys(this.$props.edittingData)
      if(customerTypes.length){
        //如果客户类型种类大于一种
        //将编辑数据的对应价格作为编辑数据
        this.formData = _.merge({}, this.initForm(), this.$props.edittingData[customerTypes[0]]);
      }
      else{
        //初始化为空表单
        this.formData = this.initForm();
      }
    },
  },
  methods:{
    //客户类型修改回调函数
    handleChangeCustomerType(typeId){
      this.formData = _.merge({}, this.initForm(), this.$props.edittingData[typeId]);
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
      //只重置所有价格
      this.formData = _.merge({}, this.formData, {
        singlePrice: 0,
        monthPrice: 0,
        seasonPrice: 0,
        halfYearPrice: 0,
        wholeYearPrice: 0
      });
    },
    /**
     * 返回表单数据的默认值
     * @return {Object} [表单数据的默认值]
     */
    initForm(){
      return{
        customerTypeId: 1,
        singlePrice: 0,
        monthPrice: 0,
        seasonPrice: 0,
        halfYearPrice: 0,
        wholeYearPrice: 0
      }
    }
  },
  //组件第一次加载时，不会watch到edittingData的改变，
  //需要在mounted函数中进行相应处理
  mounted(){
    //获取客户类型的种类
      let customerTypes = Object.keys(this.$props.edittingData)
      if(customerTypes.length){
        //如果客户类型种类大于一种
        //将编辑数据的对应价格作为编辑数据
        this.formData = _.merge({}, this.initForm(), this.$props.edittingData[customerTypes[0]]);
      }
      else{
        //初始化为空表单
        this.formData = this.initForm();
      }
  }
}
</script>

<style scoped>
  .el-select{
    width: 130px;
  }
</style>
