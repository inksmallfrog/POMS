<template>
  <div>
    <el-table :data="dataSource" style="width: 100%" @sort-change="onSort"
      v-loading="dataLoading"
      element-loading-text="数据加载中">
      <el-table-column prop="orderId" label="订单编号"
        :sortable="true">
      </el-table-column>
      <el-table-column prop="paperName" label="报刊名称"
        :sortable="true">
      </el-table-column>
      <el-table-column prop="orderServiceTypeName" label="服务类型"
        :sortable="true">
      </el-table-column>
      <el-table-column prop="orderTime" label="发起时间"
        :sortable="true" :formatter="(row)=>{return dateFormat(row.orderTime)}">
      </el-table-column>
      <el-table-column prop="originData" label="原数据"
        :sortable="true">
      </el-table-column>
      <el-table-column prop="newData" label="变更为"
        :sortable="true">
      </el-table-column>
      <!--<el-table-column prop="state" label="服务状态"
        :sortable="true" :formatter="(row)=>{return row.state == 1 ? '正常' : '已撤销';}">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button v-if="scope.row.state == 1 && undoAble(scope.row)" @click="onUndo(scope.row)" class="inTableBtn">撤销</el-button>
        </template>
      </el-table-column>-->
      <td v-if="dataSource.length" slot="append" class="append" :colspan="4">
        <el-pagination
          @current-change="onToPage"
          :current-page="curPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="totalPage * 10">
        </el-pagination>
      </td>
    </el-table>
  </div>
</template>

<script>
import dateFormat from "../../../util/parseDate.js";
import {Rbase} from "../../../util/util.js";
export default{
  name: 'OrderService',
  data(){
    return{
      resourceName: 'orderServices',
      dataLoading: false,
      dataSource: [],
      lastQueryForm: {},
      curPage: 1,
      totalPage: 1
    }
  },
  methods: Object.assign({}, Rbase, {
    dateFormat(date){
      return dateFormat(date);
    }
  })/*{
    /*undoAble(orderService){
      if(orderService.orderServiceTypeId == 2 || orderService.orderServiceTypeId == 3 || orderService.orderServiceTypeId == 5){
        let now = new Date();
        if(orderService.endingDate > now){
          if(orderService.orderServiceTypeId == 2){
            if(orderService.originData > now && orderService.newData > now){
              return true;
            }else{
              return false;
            }
          }else{
            return true;
          }
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    onUndo(orderService){
      this.dataLoading = true;
      let type = orderService.orderServiceType
      let newOrderService = _.cloneDeep(orderService);
      newOrderService.state = 0;
      if(type == 2 || type == 3 || type == 5){
        this.store.dispatch('updateResource', {resourceName: 'OrderServices', data: newOrderService})
          .then((res)=>{
            if(typeof res == 'boolean' && res){
              orderService = newOrderService
            }
            this.dataLoading = false;
          });
      }
    }
  }*/,
  computed:{
    customer(){
      return this.$store.state.customers.customer;
    }
  },
  watch:{
    '$route':function(){
      if(this.$route.path == '/customer/orderServices'){
        this.dataLoading = true;
        this.$store.dispatch('queryResource', {resourceName: 'orderServices', data:{page:1, pageSize:10, customerId: this.customer.id}})
        .then((res)=>{
          if(!res.hasError){
            this.dataSource = res.entityList;
          }
          this.dataLoading = false;
        })
      }
    }
  },
  mounted(){
    if(!this.customer){
      this.$router.replace("/");
    }
    this.dataLoading = true;
    this.$store.dispatch('queryResource', {resourceName: 'orderServices', data:{page:1, pageSize:10, customerId: this.customer.id}})
      .then((res)=>{
        if(!res.hasError){
          this.dataSource = res.entityList;
          this.totalPage = res.totalPage;
          this.curPage = res.curPage;
        }
        this.dataLoading = false;
      })
  }
}
</script>

<style scoped>
.append{
    text-align: center;
  }
</style>
