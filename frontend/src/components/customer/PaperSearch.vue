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
          <el-form-item label="报刊名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="报刊编号" prop="paperNumber">
            <el-input v-model="formData.paperNumber"></el-input>
          </el-form-item>
          <el-form-item label="报社" prop="pbCompanyId">
            <el-radio-group v-model="formData.pbCompanyId">
              <el-radio-button label="">不限</el-radio-button>
              <el-radio-button v-for="pbCompany in pbCompanies"
                :key="pbCompany.id"
                :label="pbCompany.id">
                {{pbCompany.name}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="报刊类型" prop="paperTypeId">
            <el-radio-group v-model="formData.paperTypeId">
              <el-radio-button label="">不限</el-radio-button>
              <el-radio-button v-for="paperType in paperTypes"
                :key="paperType.id"
                :label="paperType.id">
                {{paperType.name}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发行周期" prop="paperFrequencyType">
            <el-radio-group v-model="formData.paperFrequencyType">
              <el-radio-button label="">不限</el-radio-button>
              <el-radio-button label="daily">日刊</el-radio-button>
              <el-radio-button label="weekly">周刊</el-radio-button>
              <el-radio-button label="monthly">月刊</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="允许转址" prop="canChangeAddress">
            <el-switch
              v-model="formData.canChangeAddress"
              on-text="允许"
              off-text="任意"
              on-value="1"
              off-value="">
            </el-switch>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="doSearch()">搜索</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="单价" prop="state">
              <el-col :span="11">
                <el-input v-model="formData.singlePriceStart" placeholder="单价下限" type="number" min="0" step="0.01"></el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input v-model="formData.singlePriceEnd" placeholder="单价上限" type="number" min="0" step="0.01"></el-input>
              </el-col>
          </el-form-item>
          <el-form-item label="月价" prop="state">
              <el-col :span="11">
                <el-input v-model="formData.monthPriceStart" placeholder="单价下限" type="number" min="0" step="0.01"></el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input v-model="formData.monthPriceEnd" placeholder="单价上限" type="number" min="0" step="0.01"></el-input>
              </el-col>
          </el-form-item>
          <el-form-item label="年价" prop="state">
              <el-col :span="11">
                <el-input v-model="formData.yearPriceStart" placeholder="单价下限" type="number" min="0" step="0.01"></el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input v-model="formData.yearPriceEnd" placeholder="单价上限" type="number" min="0" step="0.01"></el-input>
              </el-col>
          </el-form-item>
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
          <el-form-item label="结束时间" prop="endingTime">
            <el-col :span="11">
              <el-date-picker v-model="formData.endingTimeStart"
                placeholder="结束时间下限">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker v-model="formData.endingTimeEnd" placeholder="结束时间上限"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="允许退订" prop="canUnsubscribe">
            <el-switch
              v-model="formData.canUnsubscribe"
              on-text="允许"
              off-text="任意"
              on-value="1"
              off-value="">
            </el-switch>
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
    pbCompanies: {
      type: [Array, null],
      required: true
    },
    paperTypes: {
      type: [Array, null],
      required: true
    },
    customerTypes: {
      type: [Array, null],
      required: true
    },
    className:{
      type: String,
      required: false
    },
    onSearch:{
      type: Function,
      required: true
    }
  },
  data(){
    return{
      searchableCols:[
        {
          label: "报刊名称",
          value: "name"
        }
      ],
      searchType: "name",
      searchContent: "",
      professionSearch: false,
      formData: {
        pbCompanyId: "",
        paperTypeId: '',
        paperFrequencyType: '',
        publishTimeStart: null,
        publishTimeEnd: null,
        endingTimeStart: null,
        endingTimeEnd: null,
        customerTypeId: null,
        priceType: 'singlePrice',
        canUnsubscribe: '',
        canChangeAddress: ''
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
  },
  watch:{
    '$props.customerTypes': function(){
      this.formData.customerTypeId = this.$props.customerTypes[0] && this.$props.customerTypes[0].id;
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
