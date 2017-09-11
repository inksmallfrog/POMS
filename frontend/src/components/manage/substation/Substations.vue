<template>
  <div>
    <h1>分部管理</h1>
    <SimpleSearch className="search"
      :searchableCols="searchableCols"
      :onSearch="onSearch.bind(this)">
    </SimpleSearch>

    <el-button class="addBtn" type="primary"
      @click="edittingNewData">
      增加新分部 <i class="el-icon-plus"></i>
    </el-button>
    <el-dialog title="分部编辑" :visible.sync="isEditting" @close="edittingModalClose">
      <SubstationModal :edittingData="edittingData"
        :loading="submitLoading"
        :errors="errors"
        :onSubmit="onEdittingSubmit">
      </SubstationModal>
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
import SubstationModal from '@/components/manage/substation/SubstationModal'
//搜索模块
import SimpleSearch from '@/components/SimpleSearch'
//分页表格模块
import PaginationTable from '@/components/PaginationTable';
import {CRUDbase} from '../../../util/util.js';
export default {
  name: 'Substations',
  components: {
    SubstationModal,
    SimpleSearch,
    PaginationTable
  },
  data(){
    return{
      //需要操作的资源名称
      resourceName: "substations",
      //简单搜索的可搜索键
      searchableCols:[
        {
          label: "分部名称",
          value: "name"
        },
        {
          label: "联系方式",
          value: "phone"
        },
        {
          label: "分部编号",
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
        colName: '分部编号',
        dataKey: 'id',
        sortable: true,
      },
      {
        colName: '分部名称',
        dataKey: 'name',
        sortable: true,
      },
      {
        colName: '分部联系方式',
        dataKey: 'phone',
        sortable: true,
      }],
      //数据源
      dataSource:[/*{
        id: 1,
        name: '华东镖局',
        phone: '13215732250'
      },{
        id: 2,
        name: '华中镖局',
        phone: '13215732231'
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
