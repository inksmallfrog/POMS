<template>
  <div>
    <h1>反馈类型管理</h1>
    <SimpleSearch className="search"
      :searchableCols="searchableCols"
      :onSearch="onSearch.bind(this)">
    </SimpleSearch>

    <el-button class="addBtn" type="primary"
      @click="edittingNewData">
      增加反馈类型 <i class="el-icon-plus"></i>
    </el-button>
    <el-dialog title="反馈类型编辑" :visible.sync="isEditting" @close="edittingModalClose">
      <FeedbackTypeModal :edittingData="edittingData"
        :loading="submitLoading"
        :errors="errors"
        :onSubmit="onEdittingSubmit">
      </FeedbackTypeModal>
    </el-dialog>

    <PaginationTable :dataStructure="dataStructure"
      :dataSource="dataSource"
      :curPage="curPage"
      :totalPage="totalPage"
      :onEdit="onEdit.bind(this)"
      :onDelete="onDelete.bind(this)"
      :onSort="onSort.bind(this)"
      :onToPage="onToPage.bind(this)"
      :loading="dataLoading">
    </PaginationTable>
  </div>
</template>

<script>
//编辑对话框
import FeedbackTypeModal from '@/components/manage/feedbackType/FeedbackTypeModal'
//搜索模块
import SimpleSearch from '@/components/SimpleSearch'
//分页表格模块
import PaginationTable from '@/components/PaginationTable';

import {CRUDbase} from '../../../util/util.js'
export default {
  name: 'FeedbackTypes',
  components: {
    FeedbackTypeModal,
    SimpleSearch,
    PaginationTable
  },
  data(){
    return{
      //需要操作的资源名称
      resourceName: "feedbackTypes",

      //简单搜索的可搜索键
      searchableCols:[
        {
          label: "名称",
          value: "name"
        },
        {
          label: "编号",
          value: "id"
        }
      ],

      //记录上次查询的表单
      lastQueryForm: {},
      //数据是否在加载
      dataLoading: false,

      //是否处于编辑状态
      isEditting: false,
      //编辑表单是否正在提交
      submitLoading: false,
      //编辑表单错误
      errors: {},
      //编辑中的数据
      edittingData: {},

      //当前页数
      curPage: 1,
      //总页数
      totalPage: 1,

      //数据格式，用于表头
      dataStructure:[{
        colName: '类型编号',
        dataKey: 'id',
        sortable: true,
      },
      {
        colName: '类型名称',
        dataKey: 'name',
        sortable: true,
      }],

      //数据源
      dataSource:[/*{
        id: 1,
        name: '投诉'
      },{
        id: 2,
        name: '表扬'
      },{
        id: 3,
        name: '建议'
      }*/]
    }
  },
  methods:Object.assign({
    /**
     * 初始化错误信息
     * @return {undefined}
     */
    initErrors(){
      this.errors = {
        name: ""
      };
    },
  }, CRUDbase),
  mounted(){
    if(!this.$store.state.manage.currentSystemManager){
      //不存在已登录的用户
      //页面重定向
      this.$router.push("/");
    }else{
      //查询首屏结果
      this.query({});
    }
    //this.query({});
  }
}
</script>

<style scoped>
  h1{
    text-align: center;
    font-size: 2rem;
  }
  .search{
    margin: 10px 0;
    width: 50%;
    display: inline-block;
  }
  .addBtn{
    margin: 10px 0;
    display: inline-block;
    float: right;
  }
</style>
