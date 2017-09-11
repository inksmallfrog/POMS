<template>
  <div>
    <h1>报刊管理</h1>
    <div v-if="null != pbCompanies && 0 == pbCompanies.length">
      <el-dialog title="缺少录入数据">
        您还没有添加过任何报社数据，请先前往<router-link to="/manage/pbCompanies">添加报社数据</router-link>
      </el-dialog>
    </div>
    <div v-if="null != paperTypes && 0 == paperTypes.length">
      <el-dialog title="缺少录入数据">
        您还没有添加过任何报刊类型数据，请先前往<router-link to="/manage/paperTypes">添加报刊类型数据</router-link>
      </el-dialog>
    </div>
    <PaperSearch className="search"
      :pbCompanies="pbCompanies"
      :paperTypes="paperTypes"
      :onSearch="onSearch.bind(this)">
    </PaperSearch>

    <el-button class="addBtn" type="primary"
      @click="edittingNewData">
      增加报刊 <i class="el-icon-plus"></i>
    </el-button>
    <el-dialog title="报刊编辑" :visible.sync="isEditting" @close="edittingModalClose"
      v-loading="relativeLoading" element-loading-text="数据加载中,请稍候">
      <PaperModal :edittingData="edittingData"
        :loading="submitLoading"
        :errors="errors"
        :onSubmit="onEdittingSubmit"
        :pbCompanies="pbCompanies"
        :paperTypes="paperTypes">
      </PaperModal>
    </el-dialog>
    <!--<el-dialog title="价格编辑" :visible.sync="isPriceEditting" @close="edittingData={}"
      v-loading="relativeLoading" element-loading-text="数据加载中,请稍候">
      <PaperPriceModal :edittingData="edittingData.paperPrice"
        :loading="submitLoading"
        :errors="priceEdittingErrors"
        :onSubmit="onPriceEdittingSubmit"
        :customerTypes="customerTypes">
      </PaperPriceModal>
    </el-dialog>-->

    <PaperTable :dataStructure="dataStructure"
      :dataSource="dataSource"
      :onEdit="onEdit.bind(this)"

      :onDelete="onDelete.bind(this)"
      :onSort="onSort.bind(this)"
      :onToPage="onToPage.bind(this)"
      :loading="dataLoading">
    </PaperTable>
  </div>
</template>

<script>
//编辑对话框
import PaperModal from '@/components/manage/paper/PaperModal'
//修改价格对话框
//import PaperPriceModal from '@/components/manage/paper/PaperPriceModal';
//分页表格模块
import PaperTable from '@/components/manage/paper/PaperTable';
//搜索模块
import PaperSearch from '@/components/manage/paper/PaperSearch'
import {CRUDbase} from '../../../util/util.js';
import pic from '../../../assets/origin_logo.png';
export default {
  name: 'Papers',
  components: {
    PaperModal,
    //PaperPriceModal,
    PaperSearch,
    PaperTable
  },
  data(){
    return{
      //需要操作的资源名称
      resourceName: "papers",

      //记录上次查询的表单
      lastQueryForm: {},
      //数据是否在加载
      dataLoading: false,

      //相关数据加载动画
      relativeLoading: true,

      //是否处于编辑状态
      isEditting: false,
      //是否处于价格编辑模式
      isPriceEditting: false,
      //编辑表单是否正在提交
      submitLoading: false,
      //编辑表单错误
      errors:{},
      //编辑价格表单中的错误
      priceEdittingErrors: {},
      //编辑中的数据
      edittingData: {},

      //当前页数
      curPage: 1,
      //总页数
      totalPage: 1,

      //数据格式，用于表头
      dataStructure:[{
        colName: '名称',
        dataKey: 'name',
        sortable: true,
      },
      {
        colName: '报社名',
        dataKey: 'pbCompanyName',
        sortable: true
      },
      {
        colName: '报刊类型',
        dataKey: 'paperTypeName',
        sortable: true,
      },
      {
        colName: '发行周期',
        dataKey: 'paperFrequencyType',
        sortable: true,
        formatter(row){
          switch(row.paperFrequencyType){
            case 'daily':
              return '日刊';
            case 'weekly':
              return '周刊'
            case 'monthly':
              return '月刊';
            default:
              console.assert(false);
          }
        }
      },
      {
        colName: '状态',
        dataKey: 'state',
        sortable: true,
        formatter(row){
          return row.state == 1 ? '在架' : '下架';
        }
      }],
      //报社数据
      pbCompanies: [/*{
        id: 1,
        name: '华东镖局报社',
        contacterName: '林镖头',
        phone: '13215732250',
        address: '江汉省湖州市中南区华康路B320-S'
      },{
        id: 2,
        name: '华中镖局报社',
        contacterName: '陆镖头',
        phone: '13215732211',
        address: '陆中省天华市瑞土区乾阳路A230-F'
      }*/],

      //客户类型数据
      customerTypes:[/*{
        id: 1,
        name: '穷酸用户'
      },{
        id: 2,
        name: '一般用户'
      },{
        id: 3,
        name: '土豪用户'
      }*/],

      //报刊类型数据
      paperTypes: [/*{
        id: 1,
        name: '报纸'
      },{
        id: 2,
        name: '杂志'
      },{
        id: 3,
        name: '纸片'
      }*/],

      //数据源
      dataSource:[/*{
        id: 1,                        //编号
        pbCompanyId: 1,               //报社编号
        pbCompanyName: '华中镖局报社',          //报社名称
        paperFrequencyType: '月刊',    //报刊周期类型
        paperTypeId: 1,               //报刊类型编号
        paperTypeName: '报纸',               //报刊类型名
        paperNumber: 'APTX-4869',               //刊号
        publishTime: (new Date()).setTime(12312412412),               //发行时间
        name: '华中神棍月报',                      //名称
        picture: pic,                   //图片
        description: '华中好神棍,皆从此刊出',               //描述
        printPrice: 0.5,                //印刷价
        canUnsubscribe: 1,            //是否允许退订
        canChangeAddress: 1,          //是否允许转址
        state: 1,                     //状态
        paperPrice:{1: {                      //报刊价格对象
              id: 1,
              paperId: 1,
              customerTypeId: 1,        //客户类型编号
              customerTypeName: '穷酸用户',        //客户类型名称
              monthPrice: 100,            //月价
              seasonPrice: 408,           //季度价
              halfYearPrice: 809,         //半年价
              yearPrice: 1900              //年价
          },
          2: {
              id: 2,
              paperId: 1,
              customerTypeId: 2,        //客户类型编号
              customerTypeName: '普通用户',        //客户类型名称
              monthPrice: 10,            //月价
              seasonPrice: 40,           //季度价
              halfYearPrice: 80,         //半年价
              yearPrice: 190              //年价
          }}
      },
      {
        id: 2,                        //编号
        pbCompanyId: 1,               //报社编号
        pbCompanyName: '华中镖局报社',          //报社名称
        paperFrequencyType: '月刊',    //报刊周期类型
        paperTypeId: 1,               //报刊类型编号
        paperTypeName: '报纸',               //报刊类型名
        paperNumber: 'APTX-4869',               //刊号
        publishTime: (new Date()).setTime(12312412),               //发行时间
        name: '华中神棍月报',                      //名称
        picture: pic,                   //图片
        description: '华中好神棍,皆从此刊出',               //描述
        printPrice: 0.5,                //印刷价
        canUnsubscribe: 1,            //是否允许退订
        canChangeAddress: 1,          //是否允许转址
        state: 1,                     //状态
        paperPrice:{
          1: {                      //报刊价格对象
              id: 3,
              paperId: 2,
              customerTypeId: 1,        //客户类型编号
              customerTypeName: '穷酸用户',        //客户类型名称
              monthPrice: 100,            //月价
              seasonPrice: 408,           //季度价
              halfYearPrice: 809,         //半年价
              yearPrice: 1900              //年价
          },
          2: {
              id: 4,
              paperId: 3,
              customerTypeId: 2,        //客户类型编号
              customerTypeName: '普通用户',        //客户类型名称
              monthPrice: 10,            //月价
              seasonPrice: 40,           //季度价
              halfYearPrice: 80,         //半年价
              yearPrice: 190              //年价
          }
        }
      }*/]
    }
  },
  methods: Object.assign({
    /**
     * 初始化错误信息
     * @return {undefined}
     */
    initErrors(){
      this.errors = {
        name: ""
      };
    },
  /*  /**
     * 编辑窗口关闭回调函数
     * @return {undefined}
     *
    edittingModalClose(){
      //置空编辑中的数据
      this.edittingData={paperPrice:{}};
      //置空错误信息
      this.errors={};
    },
    onPriceEdittingSubmit(form){
      //显示提交动画
      this.submitLoading = true;
      this.$store.dispatch('updateResource', {resourceName: 'paperPrices', data: form})
        .then((json)=>{
          if(!json.hasError){
            //更新成功
            let entity = form;
            console.assert(this.edittingData.paperPrice[form.customerTypeId]);
            for(let key in entity){
              this.edittingData.paperPrice[form.customerTypeId][key] = _.cloneDeep(form[key])
            }
            //关闭价格编辑界面
            this.isPriceEditting = false;
          }
          else if(json.hasError && json.invalidKey){
            //输入错误
            this.errors[json.invalidKey] = json.errorInfo;
          }
          //关闭提交动画
          this.submitLoading = false;
        })
    },
    /**
     * 编辑价格按钮回调函数
     * @param  {Object} data [编辑的数据]
     * @return {undefined}
     *
    onPriceEdit(data){
      //编辑价格数据打开窗口前
      //将编辑中的数据设置为对应数据
      this.edittingData = data;
      //进入价格编辑模式
      this.isPriceEditting = true;
    },*/
    //加载关联数据
    loadingRelative(){
      //显示关联数据加载动画
      this.relativeLoading = true;
      //加载报社
      let pbCompaniesPromise =
        this.$store.dispatch('queryAll', "pbCompanies")
          .then(res=>{
            if(!res.hasError){
              this.pbCompanies = res.entityList;
            }
            return res;
          });
      //加载客户类型
      let customerTypesPromise =
        this.$store.dispatch('queryAll', "customerTypes")
          .then(res=>{
            if(!res.hasError){
              this.customerTypes = res.entityList;
            }
            return res;
          });
      //加载报刊类型
      let paperTypesPromise =
        this.$store.dispatch('queryAll', "paperTypes")
          .then(res=>{
            if(!res.hasError){
              this.paperTypes = res.entityList;
            }
            return res;
          });
      //等待加载全部完成
      Promise.all([pbCompaniesPromise, customerTypesPromise, paperTypesPromise])
        .then((res)=>{
          //关闭加载动画
          this.relativeLoading = false;
        })
    }
  }, CRUDbase),
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
