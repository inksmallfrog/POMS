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
        <el-col :span="10">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="formData.customerName"></el-input>
          </el-form-item>
          <el-form-item label="报刊名称" prop="paperName">
            <el-input v-model="formData.paperName"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="startDate">
            <el-col :span="11">
              <el-date-picker v-model="formData.startDateStart"
                placeholder="开始时间下限">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker v-model="formData.startDateEnd"
                placeholder="开始时间上限">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间" prop="endingDate">
            <el-col :span="11">
              <el-date-picker v-model="formData.endingDateStart"
                placeholder="结束时间下限">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker v-model="formData.endingDateEnd"
                placeholder="结束时间上限">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="订阅份数">
          <el-col :span="11">
            <el-input v-model="formData.phaseWantedStart" type="number" min="0" :max="formData.phaseWantedEnd"
              step="1" placeholder="订阅份数下限"></el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="formData.phaseWantedEnd" type="number"
              :min="formData.phaseWantedStart" step="1"placeholder="订阅份数上限"></el-input>
          </el-col>
          </el-form-item>
          <el-form-item label=" ">
            <el-button class="searchBtn" type="primary" @click="doSearch()">搜索</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="应付费用">
          <el-col :span="11">
            <el-input v-model="formData.priceStart" type="number" min="0" :max="formData.priceEnd"
              step="0.01" placeholder="应付费用下限"></el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="formData.priceEnd" type="number" :min="formData.priceStart"
              step="0.01" placeholder="应付费用下限"></el-input>
          </el-col>
          </el-form-item>
          <el-form-item label="实付费用">
          <el-col :span="11">
            <el-input v-model="formData.discountPriceStart" type="number" min="0" :max="formData.discountPriceEnd" step="0.01" placeholder="实付费用下限"></el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="formData.discountPriceEnd" type="number" :min="formData.discountPriceStart"
              step="0.01" placeholder="实付费用下限"></el-input>
          </el-col>
          </el-form-item>
          <el-form-item label="配送地址">
            <el-input v-model="formData.deliverAddressDetail"></el-input>
          </el-form-item>
          <el-form-item label="订阅时间" prop="orderDate">
            <el-col :span="11">
              <el-date-picker v-model="formData.orderDateStart"
                placeholder="订阅时间下限">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker v-model="formData.orderDateEnd"
                placeholder="订阅时间上限">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="formData.state">
              <el-option label="任意" value=""></el-option>
              <el-option label="正常" value="1"></el-option>
              <el-option label="退订" value="0"></el-option>
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
  name: 'OrderSearch',
  props:{
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
          label: "订单编号",
          value: "id"
        },
        {
          label: "客户名称",
          value: "customerName"
        },
        {
          label: "报刊名称",
          value: "paperName"
        }],
      searchType: "paperName",
      searchContent: "",
      professionSearch: false,
      formData: {
        startDateStart: null,
        startDateEnd: null,
        endingDateStart: null,
        endingDateEnd: null,
        orderDateStart: null,
        orderDateEnd: null,
        state: ""
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
