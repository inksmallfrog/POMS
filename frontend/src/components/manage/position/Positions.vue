<template>
  <div>
    <h1>职位管理</h1>
    <div v-if="null != departments && 0 == departments.length">
      <el-dialog title="缺少录入数据">
        您还没有添加过任何部门数据，请先前往<router-link to="/manage/departments">添加部门数据</router-link>
      </el-dialog>
    </div>
    <PositionSearch className="search"
      :departments="departments"
      :onSearch="onSearch.bind(this)">
    </PositionSearch>

    <el-button class="addBtn" type="primary"
      @click="edittingNewData">
      增加职位 <i class="el-icon-plus"></i>
    </el-button>
    <el-dialog title="职位编辑" :visible.sync="isEditting" @close="edittingModalClose"
      v-loading="relativeLoading" element-loading-text="数据加载中,请稍候">
      <PositionModal :edittingData="edittingData"
        :loading="submitLoading"
        :errors="errors"
        :onSubmit="onEdittingSubmit"
        :departments="departments">
      </PositionModal>
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
import PositionModal from '@/components/manage/position/PositionModal'
//搜索模块
import PositionSearch from '@/components/manage/position/PositionSearch'
//分页表格模块
import PaginationTable from '@/components/PaginationTable';

import {CRUDbase} from '../../../util/util.js'
export default {
  name: 'Positions',
  components: {
    PositionModal,
    PositionSearch,
    PaginationTable
  },
  data(){
    return{
      //需要操作的资源名称
      resourceName: "positions",

      //记录上次查询的表单
      lastQueryForm: {},
      //数据是否在加载
      dataLoading: false,

      //相关数据加载动画
      relativeLoading: false,

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
        colName: '职位编号',
        dataKey: 'id',
        sortable: true,
      },
      {
        colName: '部门名称',
        dataKey: 'departmentName',
        sortable: true,
      },
      {
        colName: '职位名称',
        dataKey: 'name',
        sortable: true,
      },
      {
        colName: '薪水',
        dataKey: 'salary',
        sortable: true,
      },
      {
        colName: '绩效工资',
        dataKey: 'scoreRatio',
        sortable: true,
      }],
      //部门
      departments:[/*{
        id: 1,
        name: '人事部'
      },{
        id: 2,
        name: '技术部'
      }*/],
      //数据源
      dataSource:[/*{
        id:1,
        departmentId: 1,
        departmentName: "人事部",
        name: "渣渣HR",
        salary: 1,
        scoreRatio: 0
      },{
        id:2,
        departmentId: 1,
        departmentName: "人事部",
        name: "顶级HR",
        salary: 1000,
        scoreRatio: 0.32
      },{
        id:3,
        departmentId: 2,
        departmentName: "技术部",
        name: "渣渣工程师",
        salary: 0.5,
        scoreRatio: -1.0
      },{
        id:4,
        departmentId: 2,
        departmentName: "技术部",
        name: "顶级工程师",
        salary: 1000000000000,
        scoreRatio: 1000000
      }*/]
    }
  },
  methods:Object.assign({
    loadingRelative(){
      this.relativeLoading = true;
      this.$store.dispatch('queryAll', "departments")
        .then(res=>{
          this.relativeLoading = false;
          if(!res.hasError){
            this.departments = res.entityList;
          }
        });
    },
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
      this.$router.push("/");
    }else{
      this.query({});
      this.loadingRelative();
    }
    //this.query({});
    //this.loadingRelative();
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
