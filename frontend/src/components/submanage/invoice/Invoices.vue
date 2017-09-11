<template>
  <div>
    <h1>发票管理</h1>
    <InvoiceSearch className="search"
      :onSearch="onSearch.bind(this)">
    </InvoiceSearch>

    <InvoiceTable :dataStructure="dataStructure"
      :dataSource="dataSource"
      :onPrint="onPrint"
      :curPage="curPage"
      :totalPage="totalPage"
      :onSort="onSort.bind(this)"
      :onToPage="onToPage.bind(this)"
      :loading="dataLoading"
      :printLoading="printLoading">
    </InvoiceTable>
  </div>
</template>

<script>
import InvoiceSearch from '@/components/submanage/invoice/InvoiceSearch'
import InvoiceTable from '@/components/submanage/invoice/InvoiceTable';
import {RUbase} from '../../../util/util.js'
export default {
  name: 'Invoices',
  components: {
    InvoiceSearch,
    InvoiceTable
  },
  data(){
    return{
      resourceName: "invoices",

      lastQueryForm: {},
      dataLoading: false,
      printLoading: false,

      edittingData: {},

      curPage: 1,
      totalPage: 1,

      dataStructure:[{
        colName: '编号',
        dataKey: 'id',
        sortable: true,
        width: '85px'
      },
      {
        colName: '抬头',
        dataKey: 'header',
        sortable: true,
      },
      {
        colName: '内容',
        dataKey: 'content',
        sortable: true,
      },
      {
        colName: '报刊名称',
        dataKey: 'paperName',
        sortable: true
      },
      {
        colName: '订阅数',
        dataKey: 'numberWanted',
        sortable: true,
        width: '100px'
      },
      {
        colName: '金额',
        dataKey: 'amount',
        sortable: true,
        width: '100px'
      },
      {
        colName: '状态',
        dataKey: 'state',
        sortable: true,
        formatter(row){
          return row.state == 1 ? '已打印' : '待打印'
        },
        width: '85px'
      }],
      dataSource:[{
        id:1,
        orderId: 1,
        customerName: '华中神棍局',
        address: '地坛省方玲市无峡区华中路马王街210-C',
        phone: '13287849932',
        paperName: '华中神棍周刊',
        numberWanted: 1000,
        totalPrice: 100000
      },{
        id:1,
        orderId: 1,
        customerName: '华中神棍局',
        address: '地坛省方玲市无峡区华中路马王街210-C',
        phone: '13287849932',
        paperName: '华中神棍周刊',
        numberWanted: 10000,
        totalPrice: 100000
      }]
    }
  },
  methods:Object.assign({
    onPrint(form){
      this.edittingData = form;
      let data = _.cloneDeep(form);
      data.state = 1;
      this.update(data);
    },
  }, RUbase),
  mounted(){
    if(!this.$store.state.manage.currentSystemManager){
      this.$router.push("/");
    }else{
      this.query({state:0});
    }
    //this.query({state:0});
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
