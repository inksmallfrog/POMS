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
        <el-form-item label="类型" prop="feedbackTypeId">
          <el-select v-model="formData.feedbackTypeId">
            <el-option label="任意" value=""></el-option>
            <el-option v-for="feedbackType in feedbackTypes"
              :key="feedbackType.id"
              :label="feedbackType.name"
              :value="feedbackType.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈时间" prop="feedbackDate">
          <el-col :span="11">
            <el-date-picker v-model="formData.feedbackDateStart"
              placeholder="反馈时间下限">
            </el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker v-model="formData.feedbackDateEnd"
              placeholder="反馈时间上限"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="formData.customerRealname"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="formData.state">
            <el-option label="任意" value=""></el-option>
            <el-option label="已处理" value="1"></el-option>
            <el-option label="待处理" value="0"></el-option>
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
  name: 'DeliverPlanSearch',
  props:{
    feedbackTypes:{
      type: [Array, null],
      required: true
    },
    className:{
      type: String,
      required: false
    },
    onSearch:{
      type: Function,
      required: true
    }
  },
  data(){
    return{
      searchableCols:[
        {
          label: "计划编号",
          value: "id"
        },
        {
          label: "报刊名称",
          value: "paperName"
        },
        {
          label: "客户名称",
          value: "customerRealname"
        }],
      searchType: "paperName",
      searchContent: "",
      professionSearch: false,
      formData: {
        feedbackTypeId: "",
        feedbackDateStart: null,
        feedbackDateEnd: null,
        state: "",
      },
    }
  },
  methods:{
    doSearch(){
      let searchForm = {}
      if(this.professionSearch){
        searchForm = searchForm = _.cloneDeep(this.formData);
      }
      else{
        searchForm[this.searchType] = this.searchContent;
      }
      this.$props.onSearch(searchForm);
    },
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
