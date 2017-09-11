<template>
  <div>
    <h1>订单查询</h1>
    <OrderSearch className="search"
      :onSearch="onSearch.bind(this)">
    </OrderSearch>

    <OrderTable :dataStructure="dataStructure"
      :dataSource="dataSource"
      :curPage="curPage"
      :totalPage="totalPage"
      :onSort="onSort.bind(this)"
      :onToPage="onToPage.bind(this)"
      :loading="dataLoading">
    </OrderTable>
  </div>
</template>

<script>
import OrderSearch from '@/components/submanage/order/OrderSearch'
import OrderTable from '@/components/submanage/order/OrderTable';
import dateFormat from 'dateformat';
import {Rbase} from '../../../util/util.js'
export default {
  name: 'Orders',
  components: {
    OrderSearch,
    OrderTable
  },
  data(){
    return{
      resourceName: "orders",

      lastQueryForm: {},
      dataLoading: false,

      curPage: 1,
      totalPage: 1,

      dataStructure:[{
        colName: '订单编号',
        dataKey: 'id',
        sortable: true,
        width: '120px'
      },
      {
        colName: '客户名称',
        dataKey: 'customerRealname',
        sortable: true,
      },
      {
        colName: '报刊名称',
        dataKey: 'paperName',
        sortable: true,
      },
      {
        colName: '订阅数',
        dataKey: 'numberWanted',
        sortable: true,
        width: '100px'
      },
      {
        colName: '开始时间',
        dataKey: 'startDate',
        sortable: true,
        formatter(row){
          return dateFormat(row.startDate, 'yyyy-mm-dd');
        }
      },
      {
        colName: '结束时间',
        dataKey: 'endingDate',
        sortable: true,
        formatter(row){
          return dateFormat(row.endingDate, 'yyyy-mm-dd');
        }
      },
      {
        colName: '订单状态',
        dataKey: 'state',
        sortable: true,
        formatter(row){
          return row.state == 1 ? '正常' : '退订';
        }
      }],
      dataSource:[/*{
        id: 1,                         //编号
        customerId: 1,                 //客户编号
        customerName: '福兰特汽车公司',            //客户名称
        paperId: 1,                    //报刊编号
        paperName: '华中神棍周报',               //报刊名称
        startDate: Date(),                 //开始日期
        endingDate: Date(),                //结束日期
        numberWanted: 10000,               //订阅份数
        deliverAddressId: 1,           //地址编号
        deliverAddressDetail: '华中省黄霞市空门区明晴路C3-22',    //详细地址
        price: 10000,              //普通价格
        discountPrice: 5001,            //会员价格
        state: 1,              //订单状态
        lastOrderId: null,                 //续订订单编号
        orderDate: Date(),                 //下单日期
      },{
        id: 1,                         //编号
        customerId: 1,                 //客户编号
        customerName: '福兰特汽车公司',            //客户名称
        paperId: 1,                    //报刊编号
        paperName: '华中神棍周报',               //报刊名称
        startDate: Date(),                 //开始日期
        endingDate: Date(),                //结束日期
        numberWanted: 10000,               //订阅份数
        deliverAddressId: 1,           //地址编号
        deliverAddressDetail: '华中省黄霞市空门区明晴路C3-22',    //详细地址
        price: 10000,              //普通价格
        discountPrice: 5001,            //会员价格
        state: 1,              //订单状态
        lastOrderId: null,                 //续订订单编号
        orderDate: Date(),                 //下单日期
      }*/]
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

    display: inline-block;
  }
  .addBtn{
    margin: 10px 0;
    display: inline-block;
    float: right;
  }
</style>
