<template>
  <div class="wrapper">
    <h1>反馈回执</h1>
    <el-button class="addBtn" type="primary"
      @click="edittingNewData" :disabled="!feedbackTypes.length">
      新增反馈 <i class="el-icon-plus"></i>
    </el-button>
    <el-dialog title="填写反馈" :visible.sync="isEditting">
      <FeedbackModal
        :visible="isEditting"
        :feedbackTypes="feedbackTypes"
        :loading="submitLoading"
        :onSubmit="onEdittingSubmit">
      </FeedbackModal>
    </el-dialog>

    <FeedbackTable
      :dataSource="dataSource"
      :curPage="curPage"
      :totalPage="totalPage"
      :onSort="onSort.bind(this)"
      :onToPage="onToPage.bind(this)"
      :loading="dataLoading">
    </FeedbackTable>
  </div>
</template>

<script>
import FeedbackModal from '@/components/customer/customerCenter/FeedbackModal';
import FeedbackTable from '@/components/customer/customerCenter/FeedbackTable';
export default{
  name: 'Feedbacks',
  components:{
    FeedbackModal,
    FeedbackTable
  },
  data(){
    return{
      resourceName: 'feedbacks',
      isEditting: false,
      submitLoading: false,
      lastQueryForm: {},
      dataLoading: false,
      curPage: 1,
      totalPage: 1,
      dataSource: [],
      feedbackTypes: []
    }
  },
  computed:{
    customer(){
      return this.$store.state.customers.customer;
    }
  },
  methods:{
    edittingNewData(){
      this.isEditting = true;
    },
    onEdittingSubmit(form){
      this.submitLoading = true;
      this.$store.dispatch('createResource', {resourceName:'feedbacks', data:form})
        .then((res)=>{
          if(!res.hasError){
            let feedback = res.entity;
            if(this.dataSource.length > 9){
              this.dataSource.shift();
              if(this.curPage == totalPage){
                ++(this.totalPage);
              }
            }
            this.dataSource.unshift(res.entity);
            this.isEditting = false;
          }
          this.submitLoading = false;
        })
    },
    onSort(key, order){
      if(this.dataSource.length < 11){    //已加载到所有的数据，使用前端排序
        if(order){
          this.dataSource.sort((dataA, dataB)=>{
            //assert dataA[key] && dataB[key]
            if('ascending' == order){
              return (dataA[key] < dataB[key]) ? -1 : 1;
            }else if('descending' == order){
              return (dataA[key] > dataB[key]) ? -1 : 1;
            }
          })
        }
      }else{//后台排序
        //基于上次的搜索结果进行排序
        let form = this.lastQueryForm;
        if(key) {
          console.assert(form.order)
          form.sortby = key;
          form.order = ((order == "ascending") ? "ASC" : "DESC");
        }else{
          //如果排序键不存在，则不进行排序
          //删除上次查询表单中的排序参数
          delete form.sortby;
          delete form.order;
        }
        this.query(form);
      }
    },
    onToPage(page){
      let form = lastQueryForm;
      form.page = page;
      form.pageSize = 10;
      query(form);
    },
    query(form){
      //请求参数必须包含 page 和 pageSize
      form.page = form.page || 1;
      form.pageSize = form.pageSize || 10;
      //显示加载动画
      this.dataLoading = true;
      this.$store.dispatch('queryResource', {resourceName: 'feedbacks', data:form})
          .then((res)=>{
            if(!res.hasError){
              this.curPage = res.curPage;
              this.totalPage = res.totalPage;
              this.dataSource = res.entityList;
            }
            this.dataLoading = false;
          });
    },
    loadFeedbacks(page, sortby, order){
      if(!page) page = 1;
      this.dataLoading = true;
      let feedbackTypesPromise;
      if(this.feedbackTypes.length > 0){
        feedbackTypesPromise = new Promise((resolve)=>{resolve()});
      }else{
        feedbackTypesPromise =
          this.$store.dispatch('queryAll', 'feedbackTypes')
            .then((res)=>{
              if(!res.hasError){
                this.feedbackTypes = res.entityList;
              }
            });
      }
      let feedbacksPromise =
        this.$store.dispatch('queryResource', {resourceName: 'feedbacks', data:{page: page, pageSize: 10, customerId: this.customer.id, sortby: sortby, order:order}})
          .then((res)=>{
            if(!res.hasError){
              this.curPage = res.curPage;
              this.totalPage = res.totalPage;
              this.dataSource = res.entityList;
            }
          });
      Promise.all([feedbackTypesPromise, feedbacksPromise]).then(()=>{this.dataLoading = false})
    }
  },
  watch:{
    '$route':function(){
      if(this.$route.path == '/customer/feedbacks'){
        this.loadFeedbacks();
      }
    }
  },
  mounted(){
    if(!this.customer){
      this.$router.replace("/");
    }
    this.loadFeedbacks();
  }
}
</script>

<style scoped>
  .wrapper{
    padding: 20px;
  }
  h1{
    margin-bottom: 10px;
  }
  button{
    margin-bottom: 10px;
  }
</style>
