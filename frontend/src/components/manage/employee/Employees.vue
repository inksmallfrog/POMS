<template>
  <div>
    <h1>员工管理</h1>
    <div v-if="null != departments && 0 == departments.length">
      <el-dialog title="缺少录入数据">
        您还没有添加过任何部门数据，请先前往<router-link to="/manage/departments">添加部门数据</router-link>
      </el-dialog>
    </div>
    <div v-if="null != positions && 0 == positions.length">
      <el-dialog title="缺少录入数据">
        您还没有添加过任何职位数据，请先前往<router-link to="/manage/positions">添加职位数据</router-link>
      </el-dialog>
    </div>
    <EmployeeSearch className="search"
      :departments="departments"
      :positions="positions"
      :onDepartmentChange="loadPositions"
      :onSearch="onSearch.bind(this)">
    </EmployeeSearch>

    <el-button class="addBtn" type="primary"
      @click="edittingNewData">
      增加新员工 <i class="el-icon-plus"></i>
    </el-button>
    <el-dialog title="员工编辑" :visible.sync="isEditting" @close="edittingModalClose">
      <EmployeeModal :edittingData="edittingData"
        :loading="submitLoading"
        :relative-loading="relativeLoading"
        :errors="errors"
        :onSubmit="onEdittingSubmit"
        :departments="departments"
        :positions="positions"
        :onDepartmentChange="loadPositions">
      </EmployeeModal>
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
import EmployeeModal from '@/components/manage/employee/EmployeeModal'
//搜索模块
import EmployeeSearch from '@/components/manage/employee/EmployeeSearch'
//分页表格模块
import PaginationTable from '@/components/PaginationTable';

import {CRUDbase} from '../../../util/util.js';
export default {
  name: 'Employees',
  components: {
    EmployeeModal,
    EmployeeSearch,
    PaginationTable
  },
  data(){
    return{
      //需要操作的资源名称
      resourceName: "employees",

      //记录上次查询的表单
      lastQueryForm: {},
      //数据是否在加载
      dataLoading: false,

      //关联数据加载动画
      relativeLoading: true,

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
        colName: '员工编号',
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
        dataKey: 'positionName',
        sortable: true,
      },
      {
        colName: '员工姓名',
        dataKey: 'name',
        sortable: true,
      },
      {
        colName: '绩效',
        dataKey: 'score',
        sortable: true,
      },
      {
        colName: '薪水',
        dataKey: 'salary',
        sortable: true,
      },
      {
        colName: '员工状态',
        dataKey: 'state',
        sortable: true,
        formatter(row){
          return row.state == 1 ? '在职' : '离职'
        }
      }],
      //部门数据
      departments:[/*{
        id: 1,
        name: '人事部'
      },{
        id: 2,
        name: '技术部'
      }*/],

      //职位数据
      positions:{/*
        1: [{
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
        }],
        2: [{
          id:1,
          departmentId: 2,
          departmentName: "技术部",
          name: "渣渣程序猿",
          salary: 1,
          scoreRatio: 0
        },{
          id:2,
          departmentId: 2,
          departmentName: "技术部",
          name: "顶级程序猿",
          salary: 1000,
          scoreRatio: 0.32
        }],
      */},

     //数据源
      dataSource:[/*{
        id:1,
        departmentId: 1,
        departmentName: "人事部",
        EmployeeId: 1,
        EmployeeName: "渣渣HR",
        name: "胡龙翔",
        score: 1.0,
        salary: 100,
        state: 1
      },{
        id:2,
        departmentId: 2,
        departmentName: "技术部",
        EmployeeId: 3,
        EmployeeName: "渣渣工程师",
        name: "胡龙翔",
        score: 0,
        salary: 0,
        state: 0
      },{
        id:3,
        departmentId: 1,
        departmentName: "人事部",
        EmployeeId: 2,
        EmployeeName: "顶级HR",
        name: "胡龙翔",
        score: 1.2,
        salary: 1000,
        state: 1
      },{
        id:4,
        departmentId: 2,
        departmentName: "技术部",
        EmployeeId: 4,
        EmployeeName: "顶级程序猿",
        name: "胡龙翔",
        score: 0,
        salary: 0,
        state: 0
      }*/]
    }
  },
  methods: Object.assign({
    /**
     * 初始化错误信息
     * @return {undefined}
     */
    initErrors(){
      this.errors = {
        type: ""
      };
    },
    /**
     * 加载关联数据
     * @return {undefined}
     */
    loadingRelative(){
      //显示关联数据加载动画
      this.relativeLoading = true;
      //通过vuex发起fetch请求
      this.$store.dispatch('queryAll', "departments")
        .then(res=>{
          if(!res.hasError){
            //加载成功
            this.departments = res.entityList;
            //关闭加载动画
            this.relativeLoading = true;
            //加载首屏职位数据
            if(this.departments.length > 0){
              this.loadPositions(this.departments[0].id);
            }
          }
        })
    },
    /**
     * 加载职位数据
     * @param  {int} departmentId [部门id]
     * @return {undefined}
     */
    loadPositions(departmentId){
      //判断是否存在缓存
      if(departmentId && !this.positions[departmentId]){
        //构建请求表单
        let form = {
          departmentId: departmentId
        };
        //显示加载动画
        this.relativeLoading = true;
        //通过vuex发起fetch请求
        this.$store.dispatch('queryAllWithForm', {resourceName: "positions", data: form})
          .then((res)=>{
            if(!res.hasError){
              //加载成功
              let positions = _.cloneDeep(this.positions);
              positions[departmentId] = res.entityList;
              this.positions = positions;
            }else{
              let positions = _.cloneDeep(this.positions);
              positions[departmentId] = res.entityList;
              this.positions = positions;
            }
            //关闭加载动画
            this.relativeLoading = false;
        });
      }
    }
  }, CRUDbase),
  mounted(){
    if(!this.$store.state.manage.currentSystemManager){
      //不存在已登录的用户
      //页面重定向
      this.$router.push("/");
    }else{
      //查询首屏结果
      this.query({});
      //加载关联数据
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
