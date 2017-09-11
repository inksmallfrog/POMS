<template>
  <el-form :model="formData" :rules="rules" label-width="100px" class="editForm" ref="editForm"
    v-loading="loading" element-loading-text="正在提交数据，请稍候">
    <el-col :span="12">
      <el-form-item label="报社" prop="pbCompanyId">
        <el-select v-model="formData.pbCompanyId">
          <el-option v-for="pbCompany in pbCompanies" value-key="id"
            :key="pbCompany.id"
            :label="pbCompany.name"
            :value="pbCompany.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报刊类型" prop="paperTypeId">
        <el-select v-model="formData.paperTypeId">
          <el-option v-for="paperType in paperTypes" value-key="id"
            :key="paperType.id"
            :label="paperType.name"
            :value="paperType.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发行周期" prop="paperFrequencyType">
        <el-select v-model="formData.paperFrequencyType">
          <el-option label="日刊" value="daily"></el-option>
          <el-option label="周刊" value="weekly"></el-option>
          <el-option label="月刊" value="monthly"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报刊名" prop="name" :error="errors.name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="刊号" prop="paperNumber">
        <el-input v-model="formData.paperNumber"></el-input>
      </el-form-item>
      <el-form-item label="发行时间" prop="publishTime">
        <el-date-picker v-model="formData.publishTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="上架状态" prop="state">
        <el-switch v-model="formData.state" on-text="上架" off-text="下架"
        :on-value="1" :off-value="0"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('editForm')">立即提交</el-button>
        <el-button @click="resetForm('editForm')">重置</el-button>
      </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="印刷价" prop="description">
      <el-input v-model="formData.printPrice" type="number" :min="0" :step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="单价" prop="singlePrice">
      <el-input v-model="formData.singlePrice" type="number" :min="0" :step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="月价" prop="monthPrice">
      <el-input v-model="formData.monthPrice" type="number" :min="0" :step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="年价" prop="yearPrice">
      <el-input v-model="formData.yearPrice" type="number" :min="0" :step="0.01"></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="picture">
      <el-upload action="/api/v1/util/pictures" accept=""
        :on-success="handlePicUpload">
        <el-button size="small" type="primary">点击上传</el-button>
        <img :src="formData.picture">
      </el-upload>
    </el-form-item>
    <el-form-item label="能否退订" prop="canUnsubscribe">
      <el-switch v-model="formData.canUnsubscribe" on-text="允许" off-text="禁止"
        :on-value="1" :off-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="能否转址" prop="canChangeAddress">
      <el-switch v-model="formData.canChangeAddress" on-text="允许" off-text="禁止"
        :on-value="1" :off-value="0"></el-switch>
    </el-form-item>
    </el-col>
  </el-form>
</template>

<script>
export default {
  name: 'PositionModal',
  props: {
    //报刊类型
    paperTypes:{
      type: [Array, null],
      required: true
    },
    //报社
    pbCompanies:{
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
      //表单校验规则
      rules:{
        name:[
          { required: true, message: '请输入报刊名称', trigger: 'blur' }
        ]
      },
      //表单数据
      formData:{
      }
    }
  },
  watch:{
    //当编辑数据修改时
    'edittingData': function(){
      //根据默认值和编辑的数据源产生表单数据
      this.formData = _.merge({}, this.initForm(), this.$props.edittingData);
    },
  },
  methods:{
    /*
     * Waiting...
     */
    handlePicUpload(res){
      if(!res.hasError){
        this.formData.picture = res.file;
      }
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
      console.assert(this.$props.paperTypes.length > 0);
      console.assert(this.$props.pbCompanies.length > 0);
      return{
        paperTypeId: this.$props.paperTypes[0].id,
        pbCompanyId: 1,
        paperFrequencyType: 'daily',
        paperNumber: '',
        name: '',
        publishTime: null,
        picture: '',
        description: '',
        printPrice: 0.0,
        singlePrice: 0.0,
        monthPrice: 0.0,
        yearPrice: 0.0,
        canUnsubscribe: 1,
        canChangeAddress: 1,
        state:0
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
  img{
    width: 100%;
  }
</style>
