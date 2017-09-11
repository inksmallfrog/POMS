<template>
  <div>
    <h1>管理员管理</h1>
    <div v-if="null != authorities && 0 == authorities.length">
      <el-dialog title="缺少录入数据">
        您还没有添加过任何权限数据，请先前往<router-link to="/manage/authoritues">添加权限数据</router-link>
      </el-dialog>
    </div>
    <SystemManagerSearch className="search"
      :authorities="authorities"
      :onSearch="onSearch.bind(this)">
    </SystemManagerSearch>

    <el-button class="addBtn" type="primary"
      @click="edittingNewData">
      增加管理员 <i class="el-icon-plus"></i>
    </el-button>
    <el-dialog title="管理员编辑" :visible.sync="isEditting" @close="edittingModalClose"
      v-loading="relativeLoading" element-loading-text="数据加载中,请稍候">
      <SystemManagerModal :edittingData="edittingData"
        :loading="submitLoading"
        :errors="errors"
        :onSubmit="onEdittingSubmit"
        :authorities="authorities">
      </SystemManagerModal>
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
import SystemManagerModal from '@/components/manage/systemManager/SystemManagerModal'
//搜索模块
import SystemManagerSearch from '@/components/manage/systemManager/SystemManagerSearch'
//分页表格模块
import PaginationTable from '@/components/PaginationTable';

import {CRUDbase} from '../../../util/util.js';
export default {
  name: 'SystemManagers',
  components: {
    SystemManagerModal,
    SystemManagerSearch,
    PaginationTable
  },
  data(){
    return{
      //需要操作的资源名称
      resourceName: "systemManagers",

      //记录上次查询的表单
      lastQueryForm: {},
      //数据是否在加载
      dataLoading: false,
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
        colName: '管理员编号',
        dataKey: 'id',
        sortable: true
      },
      {
        colName: '管理员权限',
        dataKey: 'type',
        sortable: true
      },
      {
        colName: '管理员账号',
        dataKey: 'account',
        sortable: true,
      },
      {
        colName: '管理员名称',
        dataKey: 'name',
        sortable: true,
      },
      {
        colName: '联系方式',
        dataKey: 'phone',
        sortable: true,
      }],
      //权限
      authorities:[/*{
        id: 1,
        name: '傻叉权限'
      },{
        id: 2,
        name: '二货权限'
      },{
        id: 3,
        name: '上帝权限'
      }*/],
      //数据源
      dataSource:[/*{
        id:1,
        authorityId: 1,
        authorityName: '傻叉权限',
        account: "fool",
        password: "realFool",
        name: "P.K",
        phone: "13376552489"
      },{
        id:2,
        authorityId: 2,
        authorityName: '二货权限',
        account: "anotherFool",
        password: "realFool",
        name: "P.M",
        phone: "13376552487"
      },{
        id:3,
        authorityId: 2,
        authorityName: '上帝权限',
        account: "godlike",
        password: "iamgod",
        name: "程序猿",
        phone: "13376552488"
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
        account: ""
      };
    },
    loadingRelative(){
      this.relativeLoading = true;
      this.$store.dispatch('queryAll', "authorities")
        .then(res=>{
          this.relativeLoading = false;
          if(!res.hasError){
            this.authorities = res.entityList;
          }
          return res;
        });
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
