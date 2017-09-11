<template>
  <div>
    <h1>反馈处理</h1>
    <FeedbackSearch className="search"
      :feedbackTypes="feedbackTypes"
      :onSearch="onSearch.bind(this)">
    </FeedbackSearch>

    <el-dialog title="反馈回执" :visible.sync="isEditting" @close="edittingModalClose">
      <FeedbackModal :edittingData="edittingData"
        :loading="submitLoading"
        :errors="errors"
        :onSubmit="onEdittingSubmit">
      </FeedbackModal>
    </el-dialog>

    <FeedbackTable
      :dataStructure="dataStructure"
      :dataSource="dataSource"
      :curPage="curPage"
      :totalPage="totalPage"
      :onEdit="onEdit.bind(this)"
      :onSort="onSort.bind(this)"
      :onToPage="onToPage.bind(this)"
      :loading="dataLoading">
    </FeedbackTable>
  </div>
</template>

<script>
import FeedbackSearch from '@/components/submanage/feedback/FeedbackSearch';
import FeedbackModal from '@/components/submanage/feedback/FeedbackModal';
import FeedbackTable from '@/components/submanage/feedback/FeedbackTable';
import dateFormat from 'dateformat';
import {RUbase} from '../../../util/util.js'
export default {
  name: 'Feedbacks',
  components: {
    FeedbackSearch,
    FeedbackModal,
    FeedbackTable
  },
  data(){
    return{
      //需要操作的资源名称
      resourceName: "feedbacks",

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
        width: '100px'
      },
      {
        colName: '日期',
        dataKey: 'feedbackDate',
        sortable: true,
        formatter(row){
          return dateFormat(row.orderDate, 'yyyy-mm-dd');
        }
      },
      {
        colName: '类型',
        dataKey: 'feedbackTypeName',
        sortable: true
      },
      {
        colName: '对象',
        dataKey: 'toWhom',
        sortable: true,
      },
      {
        colName: '客户名称',
        dataKey: 'customerRealname',
        sortable: true,
      },
      {
        colName: '标题',
        dataKey: 'title',
        sortable: true,
      },
      {
        colName: '状态',
        dataKey: 'state',
        sortable: true,
        width: '85px',
        formatter(row){
          return row.state == 1 ? '已处理' : '待处理'
        }
      }],
      //反馈类型
      feedbackTypes: [],
      //数据源
      dataSource:[/*{
        id: 1,
        feedbackDate: new Date(),
        customerId: 1,
        customerName: '反神棍局',
        toWhom: 1,
        toWhomName: '华中神棍周报',
        title: '这是我见过的最垃圾的报刊，为什么你们还不把它下架？',
        content: '垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾,垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾垃圾',
        feedbackTypeId: 1,
        feedbackTypeName: '投诉',
        reply: '',
        state: 0
      },{
        id: 2,
        feedbackDate: new Date(),
        customerId: 2,
        customerName: '神棍局',
        toWhom: 0,
        toWhomName: '客服',
        title: '感谢你们没有将我们的报刊下架',
        content: '最近有部分恶意用户在各个论坛恶意诋毁我们的报刊，在此特来感谢贵公司在这种蜚语流言大行其道的时候，依然坚守正义，力挺我们的报纸。我们期待与贵公司的长期合作，希望未来我们可以有更广阔的发展！',
        feedbackTypeId: 2,
        feedbackTypeName: '表扬',
        reply: '谢谢惠顾',
        state: 1
      }*/]
    }
  },
  methods: Object.assign({
    loadRelative(){
      this.relativeLoading = true;
      this.$store.dispatch('queryAll', "feedbackTypes")
        .then(res=>{
          if(!res.hasError){
            this.feedbackTypes = res.entityList;
          }
        })
    }
  }, RUbase),
  mounted(){
    if(!this.$store.state.manage.currentSystemManager){
      this.$router.push("/");
    }else{
      this.query({
        state: 0
      });
      this.loadRelative();
    }
    /*this.query({
      state: 0
    });
    this.loadRelative();*/
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
