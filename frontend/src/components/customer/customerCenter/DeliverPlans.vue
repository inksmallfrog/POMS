<template>
  <div>
    <DeliverPlanSearch className="search"
      :onSearch="onSearch.bind(this)">
    </DeliverPlanSearch>
    <div v-if="selectedPlans && selectedPlans.length">
      <p>共选中 {{selectedPlans}} 条</p>
      <el-button v-if="selectedPlans && selectedPlans.length" type="primary"
        @click="postTotal">全部延期</el-button>
    </div>
    <el-table :data="dataSource" style="width: 100%" @sort-change="onSort"
      v-loading="dataLoading"
      element-loading-text="数据加载中"
      @selection-change="onSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="deliverDate"
        label="日期"
        sortable="custome"
        :formatter="(row)=>{return dateFormat(row.deliverDate);}">
      </el-table-column>
      <el-table-column prop="paperName"
        label="报刊名称"
        sortable="custome">
      </el-table-column>
      <el-table-column prop="phase"
        label="期数"
        sortable="custome">
      </el-table-column>
      <el-table-column prop="detailAddress"
        label="派送地址"
        sortable="custome"
        :formatter="(row)=>{return (row.actualDeliverAddress || row.detailAddress)}">
      </el-table-column>
      <el-table-column prop="numberWanted"
        label="应发"
        sortable="custome">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button v-if="scope.row.deliverDate > new Date()" @click="onPost(scope.row)" class="inTableBtn">延期</el-button>
        </template>
      </el-table-column>
      <td v-if="dataSource.length" slot="append" class="append" :colspan="7">
        <el-pagination
          @current-change="onToPage"
          :current-page.sync="curPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="totalPage * 10">
        </el-pagination>
      </td>
    </el-table>
    <el-dialog title="延期服务" :visible.sync="isPosting">
      <PostOrder
        :plan="postingPlan"
        :loading="postSubmitting"
        :onSubmit="onPostSubmit">
      </PostOrder>
    </el-dialog>
  </div>
</template>

<script>
import DeliverPlanSearch from '@/components/customer/customerCenter/DeliverPlanSearch';
import PostOrder from '@/components/customer/customerCenter/PostOrder';
import dateFormat from '../../../util/parseDate.js';
import {Rbase} from '../../../util/util.js';
export default{
  name: 'DeliverPlans',
  components: {
    DeliverPlanSearch,
    PostOrder
  },
  data(){
    return{
      resourceName: 'deliverPlans',
      lastQueryForm: {},
      dataLoading: false,
      selectedPlans: [],
      postingPlan: null,
      isTotalPost: false,
      isPosting: false,
      postSubmitting: false,
      dataSource: [],
      curPage: 1,
      totalPage: 1
    }
  },
  computed:{
    customer(){
      return this.$store.state.customers.customer;
    }
  },
  methods: Object.assign({}, Rbase, {
    dateFormat(date){
      return dateFormat(date);
    },
    postTotal(){
      this.isTotalPost = true;
      this.isPosting = true;
    },
    onSelectionChange(cols){
      this.selectedPlans = cols;
    },
    onPost(data){
      this.postingPlan = data;
      this.isPosting = true;
    },
    onPostSubmit(form){
      this.postSubmitting = true;
      let promises = [];
      form.orderId = this.postingPlan.orderId;
      form.customerId = this.customer.id;
      form.orderServiceTypeId = 5 ;
      form.orderTime = new Date();
      if(this.isTotalPost){
        for(let plan in selectedPlans){
          let generatedForm = _.merge({}, {deliverPlanId: plan.id}, form);
          promises.push(this.$store.dispatch('createResource', {resourceName: 'orderServices', data: generatedForm})
            .then((res)=>{
              if(!res.hasError){
                plan.deliverDate = form.newData;
              }
            }))
        }
      }else{
        let generatedForm = _.merge({}, {deliverPlanId: this.postingPlan.id}, form);
        promises.push(this.$store.dispatch('createResource', {resourceName: 'orderServices', data: generatedForm})
            .then((res)=>{
              if(!res.hasError){
                this.postingPlan.deliverDate = form.newData;
              }
            }));
      }
      Promise.all(promises)
        .then((res)=>{
          this.postSubmitting = false;
          this.isPosting = false;
        })
    },
    query(form){
      //请求参数必须包含 page 和 pageSize
      form.page = form.page || 1;
      form.pageSize = form.pageSize || 10;
      form.customerId = this.customer.id;
      form.orderState = 1;
      //显示加载动画
      this.dataLoading = true;

      //通过vuex发起fetch请求
      this.$store.dispatch('queryResource', {resourceName: this.resourceName, data: form})
        .then((json)=>{
          if(!json.hasError){
            //加载成功
            this.lastQueryForm = form;
            if(json.curPage == 1){
              this.noTriggerPageChangeAgain = true;
            }else{
              this.noTriggerPageChangeAgain = false;
            }
            this.curPage = json.curPage;
            this.totalPage = json.totalPage;
            this.dataSource = json.entityList;
          }
          //关闭加载动画
          this.dataLoading = false;
        })
    },
  }),
  mounted(){
    if(!this.customer){
      this.$router.replace("/");
    }
    this.dataLoading = true;
    this.$store.dispatch('queryResource', {resourceName: 'deliverPlans', data:{page:1, pageSize:10, customerId:this.customer.id, orderState: 1}})
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
