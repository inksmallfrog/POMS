<template>
  <div>
    <el-table :data="dataSource" style="width: 100%" @sort-change="onSort"
      v-loading="dataLoading"
      element-loading-text="数据加载中">
      <el-table-column type="expand">
        <template scope="scope">
          <el-form label-position="left" inline class="expand">
          <el-form-item label="配送地址">
            {{ scope.row.detailAddress }}
          </el-form-item>
          <el-form-item label="应付订价">
            {{ scope.row.price }}
          </el-form-item>
          <el-form-item label="实付订价">
            {{ scope.row.discountPrice }}
          </el-form-item>
          <el-form-item label="续订订单编号" v-if="scope.row.lastOrderId">
            {{ scope.row.printPrice }}
          </el-form-item>
          <el-form-item label="下单日期">
            {{ dateFormat(scope.row.orderDate) }}
          </el-form-item>
        </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="paperName" label="报刊名称"
        :sortable="true">
      </el-table-column>
      <el-table-column prop="numberWanted" label="订阅数"
        :sortable="true" width="100px">
      </el-table-column>
      <el-table-column prop="startDate" label="开始时间"
        :sortable="true" :formatter="(row)=>{return dateFormat(row.startDate, 'yyyy-mm-dd')}"
        width="120px">
      </el-table-column>
      <el-table-column prop="endingDate" label="结束时间"
        :sortable="true" :formatter="(row)=>{return dateFormat(row.endingDate, 'yyyy-mm-dd')}"
        width="120px">
      </el-table-column>
      <el-table-column prop="state" label="状态"
        :sortable="true" :formatter="(row)=>{return row.state == 1 ? '正常' : '退订';}"
        width="85px">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button v-if="scope.row.state && invoiceChangeAble(scope.row)" @click="writeInvoice(scope.row)" class="inTableBtn" size="small">填写发票</el-button>
          <el-button v-if="scope.row.state && scope.row.endingDate > new Date()" @click="onChangeAddress(scope.row)" class="inTableBtn" size="small">转址</el-button>
          <el-button v-if="scope.row.state && scope.row.endingDate > new Date()" @click="onRenew(scope.row)" class="inTableBtn" size="small">续订</el-button>
          <el-button v-if="scope.row.state && scope.row.endingDate > new Date()" @click="onUnsubscribe(scope.row)" class="inTableBtn" size="small">退订</el-button>
        </template>
      </el-table-column>
      <td v-if="dataSource.length" slot="append" class="append" :colspan="7">
        <el-pagination
          @current-change="onToPage"
          :current-page.sync="curPage"
          :curPage= "curPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="totalPage * 10">
        </el-pagination>
      </td>
    </el-table>
    <el-dialog title="填写发票" :visible.sync="invoiceWriting">
      <Invoice
        :invoice="invoice"
        :order="operatedOrder"
        :loading="submitLoading"
        :onSubmit="onInvoiceSubmit">
      </Invoice>
    </el-dialog>
    <el-dialog title="转址服务" :visible.sync="addressChanging">
      <ChangeAddress
        :order="operatedOrder"
        :loading="submitLoading"
        :onSubmit="onChangeAddressSubmit">
      </ChangeAddress>
    </el-dialog>
    <el-dialog title="续订服务" :visible.sync="renewing">
      <Renew
        :order="operatedOrder"
        :loading="submitLoading"
        :onSubmit="onRenewSubmit">
      </Renew>
    </el-dialog>
  </div>
</template>

<script>
import ChangeAddress from '@/components/customer/customerCenter/ChangeAddress';
import Invoice from '@/components/customer/customerCenter/Invoice';
import PostOrder from '@/components/customer/customerCenter/PostOrder';
import Renew from '@/components/customer/customerCenter/Renew';
import dateFormat from '../../../util/parseDate.js';
import {Rbase} from '../../../util/util.js';
export default {
  name: 'HistoryOrders',
  components:{
    ChangeAddress,
    Invoice,
    PostOrder,
    Renew,
  },
  data(){
    return {
      resourceName: 'orders',
      dataLoading: false,
      invoiceWriting: false,
      submitLoading: false,
      newPost: false,
      addressChanging: false,
      renewing: false,
      lastQueryForm: {},
      operatedOrder: null,
      dataSource: [],
      invoices: [],
      invoice: {},
      curPage: 1,
      totalPage: 1
    }
  },
  computed:{
    customer(){
      return this.$store.state.customers.customer;
    }
  },
  methods: Object.assign({
    dateFormat(date){
      return dateFormat(date);
    },
    invoiceChangeAble(order){
      let invoice = this.invoices.find((invoice)=>{
        return invoice.orderId == order.id;
      })
      if(invoice && invoice.state == 1){
        return false;
      }else{
        return true;
      }
    },
    writeInvoice(order){
      this.operatedOrder = order;
      let invoice = this.invoices.find((invoice)=>{
        return invoice.orderId == order.id;
      })
      if(invoice){
        this.invoice = invoice;
      }else{
        this.invoice = {}
      }
      this.invoiceWriting = true;
    },
    onInvoiceSubmit(form){
      this.submitLoading = true;
      form.orderId = this.operatedOrder.id;
      form.amount = this.operatedOrder.discountPrice;
      if(form.id > 0){
        this.$store.dispatch('updateResource', {resourceName: 'invoices', data: form})
          .then((res)=>{
            this.submitLoading = false;
            if(!res.hasError){
              this.invoice = _.cloneDeep(form);
              this.invoiceWriting = false;
            }
          })
      }else{
        this.$store.dispatch('createResource', {resourceName: 'invoices', data: form})
          .then((res)=>{
            this.submitLoading = false;
            if(!res.hasError){
              this.invoices.push(res.entity);
              this.invoiceWriting = false;
            }
          })
      }
    },
    onChangeAddress(order){
      this.operatedOrder = order;
      this.addressChanging = true;
    },
    onChangeAddressSubmit(data){
      this.submitLoading = true;
      let form = {};
      form.orderId = this.operatedOrder.id;
      form.customerId = this.customer.id;
      form.originData = this.operatedOrder.deliverAddressDetail;
      form.orderServiceTypeId = 4;
      form.newData = data.newData;
      form.newDeliverAddressId = data.newDeliverAddressId;
      form.orderTime = new Date();
      this.$store.dispatch('createResource', {resourceName: 'orderServices', data: form})
        .then((res)=>{
            this.submitLoading = false;
            if(!res.hasError){
              this.operatedOrder.detailAddress = form.newData;
              this.addressChanging = false;
            }
        })
    },
    onRenew(order){
      this.operatedOrder = order;
      this.renewing = true;
    },
    onRenewSubmit(form){
      this.submitLoading = true;
      form.orderId = this.operatedOrder.id;
      form.customerId = this.customer.id;
      form.originData = this.operatedOrder.endingDate;
      form.orderServiceTypeId = 3;
      form.orderTime = new Date();
      this.$store.dispatch('createResource', {resourceName: 'orderServices', data: form})
        .then((res)=>{
            this.submitLoading = false;
            if(typeof res == 'boolean' && res){
              this.operatedOrder.endingDate = form.newData;
              this.renewing = false;
              alert('续订成功');
            }
        })
    },
    onUnsubscribe(order){
      let form = {};
      form.orderId = order.id;
      form.customerId = this.customer.id;
      form.orderServiceTypeId = 2;
      form.orderTime = new Date();
      this.$store.dispatch('createResource', {resourceName: 'orderServices', data: form})
        .then((res)=>{
            if(!res.hasError){
              order.state = 0;
            }
        })
    }
  }, Rbase),
  watch:{
    '$route':function(){
      if(this.$route.path == '/customer/orders'){
        this.dataLoading = true;
        let ordersPromise = this.$store.dispatch('queryResource', {resourceName: 'orders', data:{page:1, pageSize:10, customerId:this.customer.id}});
        let invoicesPromise = this.$store.dispatch('queryAllWithForm', {resourceName: 'invoices', data:{customerId:this.customer.id}});
        Promise.all([ordersPromise, invoicesPromise])
          .then((ress)=>{
            if(!ress[0].hasError && !ress[1].hasError){
              this.dataSource = ress[0].entityList;
              this.invoices = ress[1].entityList;
            }
            this.dataLoading = false;
          })
      }
    }
  },
  mounted(){
    if(!this.customer){
      this.$router.replace("/");
    }else{
      this.dataLoading = true;
      let ordersPromise = this.$store.dispatch('queryResource', {resourceName: 'orders', data:{page:1, pageSize:10, customerId:this.customer.id, order:'paperId'}});
      let invoicesPromise = this.$store.dispatch('queryAllWithForm', {resourceName: 'invoices', data:{customerId:this.customer.id}});
      Promise.all([ordersPromise, invoicesPromise])
        .then((ress)=>{
          if(!ress[0].hasError && !ress[1].hasError){
            this.dataSource = ress[0].entityList;
            this.curPage = ress[0].curPage;
            this.totalPage = ress[0].totalPage;
            this.invoices = ress[1].entityList;
          }
          this.dataLoading = false;
        })
    }
  }
}
</script>

<style scoped>
.expand {
  font-size: 0;
}
.expand label {
  width: 90px;
  color: #99a9bf;
}
.expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.expand .price{
  margin-right: 20px;
}
.append{
  text-align: center;
}
</style>
