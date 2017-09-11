<template>
  <div>
    <h1>服务查询</h1>
    <OrderServiceSearch className="search"
      :onSearch="onSearch.bind(this)">
    </OrderServiceSearch>

    <PaginationTable :dataStructure="dataStructure"
      :dataSource="dataSource"
      :curPage="curPage"
      :totalPage="totalPage"
      :onSort="onSort.bind(this)"
      :onToPage="onToPage.bind(this)"
      :loading="dataLoading">
    </PaginationTable>
  </div>
</template>

<script>
import OrderServiceSearch from '@/components/submanage/orderService/OrderServiceSearch'
import PaginationTable from '@/components/PaginationTable';
import dateFormat from 'dateformat';
import {Rbase} from '../../../util/util.js';
export default {
  name: 'OrderServices',
  components: {
    OrderServiceSearch,
    PaginationTable
  },
  data(){
    return{
      resourceName: "orderServices",

      lastQueryForm: {},
      dataLoading: false,

      curPage: 1,
      totalPage: 1,

      dataStructure:[{
        colName: '服务编号',
        dataKey: 'id',
        sortable: true,
      },
      {
        colName: '订单编号',
        dataKey: 'orderId',
        sortable: true,
      },
      {
        colName: '服务类型',
        dataKey: 'orderServiceTypeName',
        sortable: true,
      },
      {
        colName: '下单时间',
        dataKey: 'orderTime',
        sortable: true,
        formatter(row){
          return dateFormat(row.orderTime, 'yyyy-mm-dd');
        }
      },
      {
        colName: '原数据',
        dataKey: 'originData'
      },
      {
        colName: '新数据',
        dataKey: 'newData'
      },
      {
        colName: '服务状态',
        dataKey: 'state',
        sortable: true,
        formatter(row){
          return (row.state && row.state == 0) ? '已撤销' : '正常';
        }
      }],
      dataSource:[{
        id: 1,                        //服务编号
        orderId: 1,                   //订单编号
        orderServiceTypeId: 1,      //订单服务类型编号
        orderServiceTypeName: "转址",      //订单服务类型名称
        orderTime: (new Date()).setTime(1234124214),                 //下单时间
        originData: "湖北省武汉市红厂区什么路淮安城五里庙三头村马方街左转第三个路口向内第2家",                //原数据
        newData: "湖北省武汉市红厂区什么路淮安城五里庙三头村马方街左转第三个路口向内第3家",                   //新数据
      },{
        id: 2,                        //服务编号
        orderId: 321,                   //订单编号
        orderServiceTypeId: 2,      //订单服务类型编号
        orderServiceTypeName: "延期",      //订单服务类型名称
        orderTime: (new Date()).setTime(12341434214),                 //下单时间
        originData: "1995-04-30",                //原数据
        newData: "2017-08-10",                   //新数据
      },{
        id: 3,                        //服务编号
        orderId: 12,                   //订单编号
        orderServiceTypeId: 4,      //订单服务类型编号
        orderServiceTypeName: "退订",      //订单服务类型名称
        orderTime: (new Date()).setTime(123241434214),                 //下单时间
        originData: null,                //原数据
        newData: null,                   //新数据
      }]
    }
  },
  methods: Rbase,
  mounted(){
    if(!this.$store.state.manage.currentSystemManager){
      this.$router.push("/");
    }else{
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
