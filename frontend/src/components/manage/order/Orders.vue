<template>
  <div>
    <h1>订单查询</h1>
    <OrderSearch className="search"
      :substations="substations"
      :onSearch="onSearch.bind(this)">
    </OrderSearch>

    <OrderTable :dataStructure="dataStructure"
      :dataSource="dataSource"
      :totalPage="totalPage"
      :curPage="curPage"
      :onSort="onSort.bind(this)"
      :onToPage="onToPage.bind(this)"
      :loading="dataLoading">
    </OrderTable>
  </div>
</template>

<script>
//搜索模块
import OrderSearch from '@/components/manage/order/OrderSearch'
//分页表格模块
import OrderTable from '@/components/manage/order/OrderTable';
import dateFormat from 'dateformat';
import {Rbase} from '../../../util/util.js';
export default {
  name: 'Orders',
  components: {
    OrderSearch,
    OrderTable
  },
  data(){
    return{
      //需要操作的资源名称
      resourceName: "orders",

      //记录上次查询的表单
      lastQueryForm: {},
      //数据是否在加载
      dataLoading: false,

      //相关资源加载动画
      relativeLoading: true,

      //当前页数
      curPage: 1,
      //总页数
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
      //分站数据
      substations: [/*{
        id: 1,
        name: '华东镖局',
        phone: '13215732250'
      },{
        id: 2,
        name: '华中镖局',
        phone: '13215732231'
      }*/],
      //数据源
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
  methods: Object.assign({
    /**
     * 加载关联数据
     * @return {undefined}
     */
    loadingRelative(){
      //显示关联数据加载动画
      this.relativeLoading = true;
      this.$store.dispatch('queryAll', 'substations')
        .then((json)=>{
          if(!json.hasError){
            //加载成功
            this.substations = json.entityList
          }
          //关闭关联数据加载动画
          this.relativeLoading = false;
        })
    }
  }, Rbase),
  mounted(){
    if(!this.$store.state.manage.currentSystemManager){
      //不存在已登录的用户
      //页面重定向
      this.$router.push("/");
    }else{
      //加载首屏数据
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

    display: inline-block;
  }
  .addBtn{
    margin: 10px 0;
    display: inline-block;
    float: right;
  }
</style>
