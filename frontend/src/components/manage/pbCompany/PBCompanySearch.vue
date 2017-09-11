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
        <el-form-item label="报社名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="报社联系人" prop="contacterName">
          <el-input v-model="formData.contacterName"></el-input>
        </el-form-item>
        <el-form-item label="报社联系方式" prop="phone">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="报社联系地址" prop="address">
          <el-input v-model="formData.address"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="doSearch()">
            搜索</el-button>
        </el-form-item>
      </el-form>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PBCompanySearch',
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
      searchableCols:[
        {
          label: "报社编号",
          value: "id"
        },
        {
          label: "报社名称",
          value: "name"
        },
        {
          label: "报社联系人",
          value: "contacterName"
        },
        {
          label: "报社联系方式",
          value: "phone"
        },
        {
          label: "报社联系地址",
          value: "address"
        }
      ],
      searchType: "name",
      searchContent: "",
      professionSearch: false,
      formData: {

      },
    }
  },
  methods:{
    doSearch(){
      let searchForm = {}
      if(this.professionSearch){
        searchForm = _.cloneDeep(this.formData);
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
