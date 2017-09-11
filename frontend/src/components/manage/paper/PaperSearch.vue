<template>
  <div :class="className">
    <div class="searchForm">
      <transition name="slide-left">
        <div class="baseForm" v-if="!professionSearch">
          <el-input placeholder="请输入搜索内容" v-model="searchContent">
            <el-select v-model="searchType" slot="prepend">
              <el-option v-for="searchableCol in searchableCols"
                :key="searchableCol.value"
                :label="searchableCol.label"
                :value="searchableCol.value">
              </el-option>
            </el-select>
            <el-button slot="append" icon="search" @click="doSearch()"></el-button>
          </el-input>
        </div>
      </transition><!--

   --><el-button :class="{searchTypeBtn : true, professionMode : professionSearch}"
        @click="changeSearchMode()">{{ professionSearch ? '普通搜索' : '高级搜索' }}</el-button>

    <transition name="slide-down">
      <el-form v-if="professionSearch" :model="formData" label-width="100px" class="professionForm">
        <el-col :span="12">
          <el-form-item label="报社" prop="pbCompanyId">
            <el-select v-model="formData.pbCompanyId">
              <el-option label="全部报社" value=""></el-option>
              <el-option v-for="pbCompany in pbCompanies" value-key="id"
                :key="pbCompany.id"
                :label="pbCompany.name"
                :value="pbCompany.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报刊类型" prop="paperTypeId">
            <el-select v-model="formData.paperTypeId">
              <el-option label="任意类型" value=""></el-option>
              <el-option v-for="paperType in paperTypes" value-key="id"
                :key="paperType.id"
                :label="paperType.name"
                :value="paperType.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发行周期" prop="paperFrequencyType">
            <el-select v-model="formData.paperFrequencyType">
              <el-option label="任意周期" value=""></el-option>
              <el-option label="日刊" value="daily"></el-option>
              <el-option label="周刊" value="weekly"></el-option>
              <el-option label="月刊" value="monthly"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报刊名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="报刊编号" prop="paperNumber">
            <el-input v-model="formData.paperNumber"></el-input>
          </el-form-item>
          <el-form-item label="退订设定" prop="canUnsubscribe">
            <el-select v-model="formData.canUnsubscribe">
              <el-option label="任意" value=""></el-option>
              <el-option label="允许" value="1"></el-option>
              <el-option label="禁止" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="允许转址" prop="canChangeAddress">
            <el-select v-model="formData.canChangeAddress">
              <el-option label="任意" value=""></el-option>
              <el-option label="允许" value="1"></el-option>
              <el-option label="禁止" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="doSearch()">搜索</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="发行时间" prop="publishTime">
            <el-col :span="11">
              <el-date-picker v-model="formData.publishTimeStart"
                placeholder="发行时间下限">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker v-model="formData.publishTimeEnd" placeholder="发行时间上限"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="印刷价" prop="printPrice">
            <el-col :span="11">
              <el-input v-model="formData.printPriceStart" placeholder="印刷价下限" type="number" min="0.0" step="0.01"></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input v-model="formData.printPriceEnd" placeholder="印刷价上限" type="number" min="0.0" step="0.01"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="单价" prop="singlePrice">
            <el-col :span="11">
              <el-input v-model="formData.singlePriceStart" placeholder="单价下限" type="number" min="0.0" step="0.01"></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input v-model="formData.singlePriceEnd" placeholder="单价上限" type="number" min="0.0" step="0.01"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="月价" prop="monthPrice">
            <el-col :span="11">
              <el-input v-model="formData.monthPriceStart" placeholder="月价下限" type="number" min="0.0" step="0.01"></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input v-model="formData.monthPriceEnd" placeholder="月价上限" type="number" min="0.0" step="0.01"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="年价" prop="yearPrice">
            <el-col :span="11">
              <el-input v-model="formData.yearPriceStart" placeholder="年价下限" type="number" min="0.0" step="0.01"></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input v-model="formData.yearPriceEnd" placeholder="年价上限" type="number" min="0.0" step="0.01"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="formData.state">
              <el-option label="任意" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="未上架" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemManagerSearch',
  props:{
    //报社
    pbCompanies: {
      type: [Array, null],
      required: true
    },
    //报刊类型
    paperTypes: {
      type: [Array, null],
      required: true
    },
    //搜索包裹容器的类名
    className:{
      type: String,
      required: false
    },
    //搜索回调函数
    onSearch:{
      type: Function,
      required: true
    }
  },
  data(){
    return{
      searchableCols:[
        {
          label: "编号",
          value: "id"
        },
        {
          label: "报刊名称",
          value: "name"
        },
        {
          label: "发行编号",
          value: "paperNumber"
        }
      ],
      searchType: "name",
      searchContent: "",
      professionSearch: false,
      formData: {
        pbCompanyId: '',
        paperTypeId: '',
        paperFrequencyType: '',
        publishTimeStart: null,
        publishTimeEnd: null,
        canUnsubscribe: '',
        canChangeAddress: '',
        state: ''
      },
    }
  },
  methods:{
    doSearch(){
      let searchForm = {}
      if(this.professionSearch){
        searchForm = searchForm = _.cloneDeep(this.formData);
      }
      else{
        searchForm[this.searchType] = this.searchContent;
      }
      this.$props.onSearch(searchForm);
    },
    changeSearchMode(){
      this.professionSearch = !this.professionSearch;
    }
  }
}
</script>

<style scoped>
  .el-select{
    width: 120px;
  }
  .baseForm{
    display: inline-block;
    width: 22rem;
    overflow: hidden;
    vertical-align: top;
  }
  .baseForm .el-select{
    width: 110px;
  }
  .slide-left-enter-active {
    transition: all .3s ease;
  }
  .slide-left-leave-active {
    transition: all .3s ease;
  }
  .slide-left-enter, .slide-left-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    width: 0;
  }

  .searchTypeBtn{
    display: inline-block;
    width: 6rem;
  }
  .searchTypeBtn.professionMode{
    margin-left: 100px;
    margin-bottom: 20px;
  }

  .professionForm{
    max-height: 1000px;
    overflow: hidden;
  }
  .slide-down-enter-active {
    transition: all .3s ease;
  }
  .slide-down-leave-active {
    transition: all .3s ease;
  }
  .slide-down-enter, .slide-down-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    max-height: 0;
  }
  .el-date-editor{
    width: 100%;
  }
  .el-input__icon+{
    padding-right: 0;
  }
  .searchForm{
    width: 100%;
    box-sizing: border-box;
    display: inline-block;
  }
  .line{
    text-align: center;
  }
  .searchBtn{
    display: block;
  }
</style>
