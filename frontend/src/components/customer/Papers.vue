<template>
  <section class="mainSec">
    <PaperSearch
      :onSearch="onSearch"
      :pbCompanies="pbCompanies"
      :paperTypes="paperTypes"
      :customerTypes="customerTypes"></PaperSearch>
    <ul class="sortable">
      <li>排序：</li>
      <li :class="singlePriceOrder? 'choosed' : ''" @click="changeSort('singlePrice')">
        按单价
        <div :class="['sortArrow', sortOrder]"></div>
      </li>
      <li :class="monthPriceOrder? 'choosed' : ''" @click="changeSort('monthPrice')">
        按月价
        <div :class="['sortArrow', sortOrder]"></div>
      </li>
      <li :class="wholeYearPriceOrder? 'choosed' : ''" @click="changeSort('wholeYearPrice')">
        按年价
        <div :class="['sortArrow', sortOrder]"></div>
      </li>
    </ul>
    <el-row class="paperList">
      <el-col :span="7" v-for="(paper, index) in dataSource" :key="paper.id" :offset="index % 3 > 0 ? 1  : 0" :class="{paper:true, firstOne: index % 3 == 0}"><Paper :paper="paper"></Paper></el-col>
    </el-row>
    <!--<ul class="paperList">
      <Paper v-for="data in dataSource"
        :key="data.id"
        :paper="data"></Paper>
    </ul>-->
    <el-pagination
      @current-change="onToPage"
      :current-page="curPage"
      :page-size="12"
      layout="prev, pager, next, jumper"
      :total="totalPage * 12"
      class="pagination">
    </el-pagination>
  </section>
</template>

<script>
import PaperSearch from '@/components/customer/PaperSearch';
import Paper from '@/components/customer/Paper';

export default {
  name: 'Papers',
  components:{
    PaperSearch,
    Paper
  },
  computed:{
    singlePriceOrder(){
      if(this.sortPriceType == 'singlePrice'){
        return this.sortOrder;
      }else{
        return ''
      }
    },
    monthPriceOrder(){
      if(this.sortPriceType == 'monthPrice'){
        return this.sortOrder;
      }else{
        return ''
      }
    },
    seasonPriceOrder(){
      if(this.sortPriceType == 'seasonPrice'){
        return this.sortOrder;
      }else{
        return ''
      }
    },
    halfYearPriceOrder(){
      if(this.sortPriceType == 'halfYearPrice'){
        return this.sortOrder;
      }else{
        return ''
      }
    },
    wholeYearPriceOrder(){
      if(this.sortPriceType == 'wholeYearPrice'){
        return this.sortOrder;
      }else{
        return ''
      }
    },
    customerTypeId(){
      return (this.$store.state.customers.customer && this.$store.state.customers.customer.customerTypeId) || 1;
    }
  },
  data(){
    return{
      resourceName: "papers",

      lastQueryForm: {},
      dataLoading: false,

      relativeLoading: true,

      sortPriceType: '',
      sortOrder: '',

      curPage: 1,
      totalPage: 1,
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
      paperTypes:[/*{
        id: 1,
        name: '报纸'
      },{
        id: 2,
        name: '杂志'
      },{
        id: 3,
        name: '纸片'
      }*/],
      dataSource:[/*{
        id: 1,                        //编号
        pbCompanyId: 1,               //报社编号
        pbCompanyName: '华中镖局报社',          //报社名称
        paperFrequencyType: 'monthly',    //报刊周期类型
        paperTypeId: 1,               //报刊类型编号
        paperTypeName: '报纸',               //报刊类型名
        paperNumber: 'APTX-4869',               //刊号
        publishTime: (new Date()),               //发行时间
        name: '华中神棍月报',                      //名称
        picture: pic,                   //图片
        description: '华中好神棍,皆从此刊出',               //描述
        printPrice: 0.5,                //印刷价
        canUnsubscribe: 1,            //是否允许退订
        canChangeAddress: 1,          //是否允许转址
        state: 1,                     //状态
        singlePrice: 1,
        monthPrice: 30,
        yearPrice: 350,
      },
      {
        id: 2,                        //编号
        pbCompanyId: 1,               //报社编号
        pbCompanyName: '华中镖局报社',          //报社名称
        paperFrequencyType: 'monthly',    //报刊周期类型
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
        singlePrice: 1,
        monthPrice: 30,
        yearPrice: 350,
      }*/]
    }
  },
  methods:{
    onSearch(form){
      this.query(form);
    },
    changeSort(priceType){
      if(this.sortPriceType == priceType){
        this.sortOrder = ((this.sortOrder == 'asc') ? 'desc' : 'asc');
      }else{
        this.sortPriceType = priceType;
        this.sortOrder = 'asc';
      }
      this.onSort(priceType, this.sortOrder);
    },
    onToPage(page){
      let form = this.lastQueryForm;
      form.page = page;
      form.pageSize = form.pageSize || 12;
      this.query(form);
    },
    onSort(key, order){
      if(this.dataSource.length < 12){    //已加载到所有的数据，使用前端排序
        if(order){
          this.dataSource.sort((dataA, dataB)=>{
            console.assert(dataA[key]
              && dataB[key]);
            if('asc' == order){
              return dataA[key] < dataB[key];
            }else if('desc' == order){
              return dataA[key] > dataB[key];
            }
          })
        }
      }else{                              //后台排序
        let form = this.lastQueryForm;
        if(key) {
          console.assert(form.order);
          form.sortby = key;
          form.order = ((order == "ascending") ? "ASC" : "DESC");
        }else{                          //获取未排序数据
          delete form.sortby;
          delete form.order;
        }
        this.query(form);
      }
    },
    query(form){
      //请求参数必须包含 page 和 pageSize
      form.page = form.page || 1;
      form.pageSize = form.pageSize || 12;
      this.sortPriceType = form.sortby;
      this.sortOrder = form.order;
      //显示加载动画
      this.dataLoading = true;
      //发起fetch请求
      this.$store.dispatch('queryResource', {resourceName: this.resourceName, data: form})
        .then((json)=>{
          //关闭加载动画
          this.dataLoading = false;
          if(!json.hasError){
            this.curPage = json.curPage;
            this.totalPage = json.totalPage;
            this.dataSource = json.entityList;
          }
        })
    },
  },
  mounted(){
    this.query({});
  }
}
</script>

<style scoped>
  .mainSec{
    margin: auto;
    padding: 0 10%;
  }
  .sortable{
    margin: 10px 0;
    list-style: none;
    user-select: none;
  }
  .sortable li{
    display: inline-block;
    font-size: .8rem;
    margin-right: .8rem;
    padding: 2px 5px;
    cursor: pointer;
    color: #324057;
  }
  .sortable li.choosed{
    background-color: #20A0FF;
    color: white;
  }
  .sortArrow{
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: 10px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }
  .sortable .choosed .sortArrow.asc{
    border-top: 5px solid white;
    border-bottom: 5px solid transparent;
    bottom: -2.5px;
  }
  .sortable .choosed .sortArrow.desc{
    border-bottom: 5px solid white;
    border-top: 5px solid transparent;
    top: -2.5px;
  }
  .paperList{
    margin-bottom: 20px;
  }
  .paper{
    margin-bottom: 20px;
  }
  .firstOne{
    clear: both;
  }
  .pagination{
    text-align: center;
  }
</style>
