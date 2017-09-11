<template>
  <div :class="className">
    <div class="searchForm">
      <transition name="slide-left">
        <div class="baseForm" v-if="!professionSearch">
          <el-input placeholder="请输入搜索内容" v-model="searchContent">
            <el-select v-model="searchType" slot="prepend">
              <el-option v-for="searchableCol in searchableCols"
                :key="searchableCol.value"
                :label="searchableCol.label"
                :value="searchableCol.value">
              </el-option>
            </el-select>
            <el-button slot="append" icon="search" @click="doSearch()"></el-button>
          </el-input>
        </div>
      </transition><!--

   --><el-button :class="{searchTypeBtn : true, professionMode : professionSearch}"
        @click="changeSearchMode()">{{ professionSearch ? '普通搜索' : '高级搜索' }}</el-button>

      <transition name="slide-down">
      <el-form v-if="professionSearch" :model="formData" label-width="100px" class="professionForm">
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="formData.departmentId" @change="onDepartmentChange(formData.departmentId);formData.positionId='';">
            <el-option label="全部部门" value=""></el-option>
            <el-option v-for="department in departments" value-key="id"
              :key="department.id"
              :label="department.name"
              :value="department.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="departmentId">
          <el-select v-model="formData.positionId">
            <el-option label="全部职位" value=""></el-option>
            <el-option v-for="position in positions[formData.departmentId]" value-key="id"
              :key="position.id"
              :label="position.name"
              :value="position.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="绩效范围">
        <el-col :span="11">
          <el-input v-model="formData.scoreStart" type="number" min="0.0" :max="formData.scoreEnd" step="0.01"></el-input>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-input v-model="formData.scoreEnd" type="number" :min="formData.scoreStart" step="0.01"></el-input>
        </el-col>
        </el-form-item>
        <el-form-item label="工资范围">
        <el-col :span="11">
          <el-input v-model="formData.salaryStart" type="number" min="0.0" :max="formData.salaryEnd" step="0.01"></el-input>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-input v-model="formData.salaryEnd" type="number" :min="formData.salaryStart" step="0.01"></el-input>
        </el-col>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="formData.state">
            <el-option label="任意" value=""></el-option>
            <el-option label="在职" value="1"></el-option>
            <el-option label="离职" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="doSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PositionSearch',
  props:{
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
    //部门修改回调函数
    onDepartmentChange:{
      type: Function,
      required: true
    },
    //包裹搜索容器的类名
    className:{
      type: String,
      required: false
    },
    //搜索回调函数
    onSearch:{
      type: Function,
      required: true
    }
  },
  data(){
    return{
      //简单搜索的可搜索键
      searchableCols:[
        {
          label: "员工编号",
          value: "id"
        },
        {
          label: "部门编号",
          value: "departmentId"
        },
        {
          label: "职位编号",
          value: "positionId"
        },
        {
          label: "员工姓名",
          value: "name"
        }],
      //简单搜索当前搜索的键
      searchType: "name",
      //搜索的内容
      searchContent: "",
      //是否为高级搜索
      professionSearch: false,
      //高级搜索表单
      formData: {
        departmentId: '',
        positionId: '',
        state: ""
      },
    }
  },
  methods:{
    //搜索按钮回调函数
    doSearch(){
      let searchForm = {}
      if(this.professionSearch){
        //高级搜索，克隆表单数据
        searchForm = _.cloneDeep(this.formData);
      }
      else{
        //普通搜索
        searchForm[this.searchType] = this.searchContent;
      }
      //执行搜索回调函数
      this.$props.onSearch(searchForm);
    },
    //修改搜索状态回调函数
    changeSearchMode(){
      this.professionSearch = !this.professionSearch;
    }
  }
}
</script>

<style scoped>
  .baseForm{
    display: inline-block;
    width: 22rem;
    overflow: hidden;
    vertical-align: top;
  }
  .baseForm .el-select{
    width: 110px;
  }
  .slide-left-enter-active {
    transition: all .3s ease;
  }
  .slide-left-leave-active {
    transition: all .3s ease;
  }
  .slide-left-enter, .slide-left-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    width: 0;
  }

  .searchTypeBtn{
    display: inline-block;
    width: 6rem;
  }
  .searchTypeBtn.professionMode{
    margin-left: 100px;
    margin-bottom: 20px;
  }

  .professionForm{
    max-height: 1000px;
    overflow: hidden;
  }
  .slide-down-enter-active {
    transition: all .3s ease;
  }
  .slide-down-leave-active {
    transition: all .3s ease;
  }
  .slide-down-enter, .slide-down-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    max-height: 0;
  }
  .el-date-editor{
    width: 100%;
  }
  .el-input__icon+{
    padding-right: 0;
  }
  .searchForm{
    width: 100%;
    box-sizing: border-box;
    display: inline-block;
  }
  .line{
    text-align: center;
  }
  .searchBtn{
    display: block;
  }
</style>
