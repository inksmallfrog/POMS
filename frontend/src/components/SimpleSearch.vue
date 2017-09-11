<template>
  <div :class="className">
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
</template>

<script>
export default {
  name: 'AuthoritySearch',
  props:{
    //包裹搜索容器的类名
    className:{
      type: String,
      required: false
    },
    //搜索回调函数
    onSearch:{
      type: Function,
      required: true
    },
    //简单搜索的可搜索键
    searchableCols:{
      type: Array,
      required: true
    },
  },
  data(){
    return{
      //简单搜索当前搜索的键
      searchType: "",
      //搜索的内容
      searchContent: ""
    }
  },
  methods:{
    //搜索按钮回调函数
    doSearch(){
      let searchForm = {};
      searchForm[this.searchType] = this.searchContent;
      //执行搜索回调函数
      this.$props.onSearch(searchForm);
    }
  },
  watch:{
    'searchableCols': function(){
      this.searchType = this.$props.searchableCols[0].value;
    }
  },
  mounted(){
    this.searchType = this.$props.searchableCols[0].value;
  }
}
</script>

<style scoped>
  .el-select{
    width: 120px;
  }
</style>
