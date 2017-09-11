<template>
  <div>
    <h1>分发计划查询</h1>
    <DeliverPlanSearch className="search"
      :onSearch="onSearch.bind(this)">
    </DeliverPlanSearch>

    <el-dialog title="分发计划编辑" :visible.sync="isEditting" @close="edittingModalClose">
      <DeliverPlanModal :edittingData="edittingData"
        :loading="submitLoading"
        :errors="errors"
        :onSubmit="onEdittingSubmit">
      </DeliverPlanModal>
    </el-dialog>

    <DeliverPlanTable
      :dataStructure="dataStructure"
      :dataSource="dataSource"
      :curPage="curPage"
      :totalPage="totalPage"
      :onEdit="onEdit.bind(this)"
      :onSort="onSort.bind(this)"
      :onToPage="onToPage.bind(this)"
      :loading="dataLoading">
    </DeliverPlanTable>
  </div>
</template>

<script>
//编辑对话框
import DeliverPlanSearch from '@/components/submanage/deliverPlan/DeliverPlanSearch';
//搜索模块
import DeliverPlanModal from '@/components/submanage/deliverPlan/DeliverPlanModal';
//分页表格模块
import DeliverPlanTable from '@/components/submanage/deliverPlan/DeliverPlanTable';
import {RUbase} from '../../../util/util.js';

import dateFormat from '../../../util/parseDate.js';

let a = new Date();
a.setTime(a.getTime() + 24 * 60 * 60 * 1000);

export default {
  name: 'DeliverPlans',
  components: {
    DeliverPlanSearch,
    DeliverPlanModal,
    DeliverPlanTable
  },
  data(){
    return{
      //需要操作的资源名称
      resourceName: "deliverPlans",

      //记录上次查询的表单
      lastQueryForm: {},
      //数据是否在加载
      dataLoading: false,

      //是否处于编辑状态
      isEditting: false,
      //编辑表单是否正在提交
      submitLoading: false,
      //编辑表单错误
      errors:{},
      //编辑中的数据
      edittingData: {},

      //当前页数
      curPage: 1,
      //总页数
      totalPage: 1,

      //数据格式，用于表头
      dataStructure:[{
        colName: '编号',
        dataKey: 'id',
        sortable: true,
        width: '90px'
      },
      {
        colName: '日期',
        dataKey: 'deliverDate',
        sortable: true,
        formatter(row){
          return dateFormat(row.deliverDate);
        }
      },
      {
        colName: '报刊',
        dataKey: 'paperName',
        sortable: true
      },
      {
        colName: '期数',
        dataKey: 'phase',
        sortable: true,
        width: '85px'
      },
      {
        colName: '地址',
        dataKey: 'actualDeliverAddress',
        sortable: true,
        width: '220px',
        formatter(row){
          return row.actualDeliverAddress || row.detailAddress;
        }
      },
      {
        colName: '应发',
        dataKey: 'numberWanted',
        sortable: true,
        width: '90px'
      },
      {
        colName: '实发',
        dataKey: 'realDeliverAmount',
        sortable: true,
        width: '90px'
      },
      {
        colName: '状态',
        dataKey: 'state',
        sortable: true,
        width: '85px',
        formatter(row){
          return row.state == 1 ? '已投递' : '待投递'
        }
      }],
      //数据源
      dataSource:[/*{
        id: 1,
        orderId: 1,
        deliverDate: new Date(),
        paperName: '华中神棍周报',
        customerName: '华中神棍局',
        phase: 12,
        deliverAddressId: 1,
        detailAddress: '湖北省武汉市红厂区什么路淮安城五里庙三头村马方街左转第三个路口向内第2家',
        needDeliverAmount: 1000,
        realDeliverAmount: 800,
        state: 0
      },{
        id: 1,
        orderId: 1,
        deliverDate: a,
        paperName: '华中神棍周报',
        customerName: '华中神棍局',
        phase: 12,
        deliverAddressId: 1,
        actualDeliverAddress: '湖北省武汉市红厂区什么路淮安城五里庙三头村马方街左转第三个路口向内第2家',
        needDeliverAmount: 1000,
        realDeliverAmount: 800,
        state: 1
      }*/]
    }
  },
  methods: RUbase,
  mounted(){
    if(!this.$store.state.manage.currentSystemManager){
      //不存在已登录的用户
      //页面重定向
      this.$router.push("/");
    }else{
      this.query({});
      let nextDayTime = (new Date()).getTime() + 24 * 60 * 60 * 1000;
      let nextDay = new Date();
      nextDay.setTime(nextDayTime);
      this.query({
        deliverDateStart: new Date(),
        deliverDateEnd: nextDay
      });
    }
    /*let nextDayTime = (new Date()).getTime() + 24 * 60 * 60 * 1000;
    let nextDay = new Date();
    nextDay.setTime(nextDayTime);
    /*this.query({
      deliverDateStart: new Date(),
      deliverDateEnd: nextDay
    });*/
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
