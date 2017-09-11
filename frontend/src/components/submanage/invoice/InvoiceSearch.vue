<template>
  <div :class="className">
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
        <el-form-item label="抬头" prop="header">
          <el-input v-model="formData.header"></el-input>
        </el-form-item>
        <el-form-item label="报刊名称" prop="paperName">
          <el-input v-model="formData.paperName"></el-input>
        </el-form-item>
        <el-form-item label="订阅数" prop="numberWanted">
          <el-col :span="11">
            <el-input v-model="formData.numberWantedStart"
              placeholder="订阅数下限" type="number" min="0" step="1">
            </el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="formData.numberWantedEnd"
              placeholder="订阅数上限" type="number" min="0" step="1">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-col :span="11">
            <el-input v-model="formData.amountStart"
              placeholder="金额下限" type="number" min="0.0" step="0.01">
            </el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="formData.amountEnd"
              placeholder="金额上限" type="number" min="0.0" step="0.01">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="formData.state">
            <el-option label="任意" value=""></el-option>
            <el-option label="已打印" value="1"></el-option>
            <el-option label="待打印" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button class="searchBtn" type="primary" @click="doSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'InvoiceSearch',
  props:{
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
      professionSearch: false,
      searchableCols:[
        {
          label: "发票编号",
          value: "id"
        },
        {
          label: "报刊名称",
          value: "paperName"
        },
        {
          label: "客户名称",
          value: "customerName"
        }
      ],
      searchType: "paperName",
      searchContent: "",
      formData:{
        state: '',
      }
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
  .el-select{
    width: 120px;
  }
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
