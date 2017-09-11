<template>
  <div>
    <div class="info">
      <img :src="paper.picture">
      <div class="rightInfo">
        <header>
          <h1>{{paper.name}}</h1><p class="headTip">{{paper.paperNumber}}</p>
          <p class="typeTip">
            <span>{{paper.paperTypeName}}</span>
            <span>{{paperFrequencyTypeName}}</span>
            <span>转址<i :class="paper.canChangeAddress ? 'el-icon-allowed' : 'el-icon-disallowed'"></i></span>
            <span>退订<i :class="paper.canUnsubscribe ? 'el-icon-allowed' : 'el-icon-disallowed'"></i></span>
          </p>
        </header>
        <el-form class="orderForm" :model="formData" :rules="rules"
          label-width="100px" ref="orderForm" v-loading="loading"
          label-position="left"
          element-loading-text="正在提交数据，请稍候">
          <el-col :span="12">
            <el-form-item label="订阅时间" prop="startAndEnding">
              <el-date-picker
                v-model="formData.startAndEnding"
                type="daterange"
                placeholder="选择日期范围"
                :pickerOptions="dateOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="订阅份数" prop="numberWanted">
              <el-input-number v-model="formData.numberWanted" :min="1" ></el-input-number>
            </el-form-item>
            <el-form-item label="投递地址">
              <el-select v-model="formData.deliverAddressId">
                <el-option v-for="deliverAddress in deliverAddresses" value-key="id"
                  :key="deliverAddress.id"
                  :label="deliverAddress.detailAddress"
                  :value="deliverAddress.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="首送期数">
              第{{phase}}期
            </el-form-item>
            <el-form-item label="标准价">
              {{price}}元
            </el-form-item>
            <el-form-item label="应付价">
              {{discountPrice}}元
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发行于">
              {{formatDate(paper.publishTime)}}
            </el-form-item>
            <el-form-item label="下架时间">
              {{formatDate(paper.endingTime)}}
            </el-form-item>
            <el-form-item label="单价">
              {{paper.singlePrice && paper.singlePrice.toFixed(2)}}
            </el-form-item>
            <el-form-item label="月价">
              {{paper.monthPrice && paper.monthPrice.toFixed(2)}}
            </el-form-item>
            <el-form-item label="年价">
              {{paper.yearPrice && paper.yearPrice.toFixed(2)}}
            </el-form-item>
            <el-button @click.prev.stop="onAddToCart()" class="opBtn" type="primary" size="small">
              下单
              <transition name="add">
                <i class="el-icon-shoppingCart" v-if="!isInCustomerCart"></i>
              </transition>
              <i class="el-icon-shoppingCarting" v-if="isInCustomerCart"></i>
            </el-button>
            <el-button  @click.prev.stop="onStar()" class="opBtn" size="small">
              收藏
              <transition name="add">
                <i class="el-icon-star" v-if="!isInCustomerStar"></i>
              </transition>
              <i class="el-icon-staring" v-if="isInCustomerStar"></i>
            </el-button>
          </el-col>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import parseDate from '../../util/parseDate.js';
import moment from 'moment';

export default{
  name: "PaperPage",
  data(){
    return{
      formData: {
        deliverAddressId: 1,
        startAndEnding: [null, null],
        numberWanted: 1
      },
      rules:{
        startAndEnding:[
          { required: true, message: '请选择订阅范围', trigger: 'blur', type:"array"}
        ],
        numberWanted:[
          {required: true, message: '请选择订阅份数', trigger: 'blur', type:"number", min: 0}
        ]
      },
      dateOptions:{
        disabledDate(date){
          let now = moment();
          let maxDay = moment().add(1, 'y');
          return !(date > now._d && date <= maxDay._d);
        },
        shortcuts: [{
          text: '最近一月',
          onClick(picker) {
            let now = moment().add(1, 'd');
            let end = moment().add(1, 'd').add(1, 'M');
            picker.$emit('pick', [now._d, end._d]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            let now = moment().add(1, 'd');
            let end = moment().add(1, 'd').add(3, 'M');
            picker.$emit('pick', [now._d, end._d]);
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            let now = moment().add(1, 'd');
            let end = moment().add(1, 'd').add(1, 'y');
            picker.$emit('pick', [now._d, end._d]);
          }
        }]
      },
      loading: false
    }
  },
  computed:{
    customer(){
      return this.$store.state.customers.customer;
    },
    favorites(){
      return this.$store.state.customers.favorites;
    },
    shoppingCart(){
      return this.$store.state.customers.shoppingCart;
    },
    paperPrice(){
      let paperPrice = [];
      for(let key in this.paper.paperPrice){
        paperPrice.push(this.paper.paperPrice[key]);
      }
      return paperPrice;
    },
    isInCustomerStar(){
      if(this.$store.state.customers.favorites){
        return ~(this.$store.state.customers.favorites.findIndex((starItem)=>{
          return starItem.paperId == this.paper.id
        }));
      }else{
        return false;
      }
    },
    isInCustomerCart(){
      if(this.$store.state.customers.shoppingCart){
        return ~(this.$store.state.customers.shoppingCart.findIndex((shoppingItem)=>{
          return shoppingItem.id == this.paper.id
        }));
      }else{
        return false;
      }
    },
    paper(){
      return this.$store.state.customers.currentPaper;
    },
    paperFrequencyTypeName(){
      switch(this.paper.paperFrequencyType){
        case 'daily':{
          return '月刊'
        }
        case 'weekly':{
          return '周刊'
        }
        case 'monthly':{
          return '月刊'
        }
        default: {
          console.assert(false);
        }
      }
    },
    deliverAddresses(){
      return this.$store.state.customers.deliverAddresses;
    },
    phase(){
      if(!this.formData.startAndEnding[0] || !this.formData.startAndEnding[1]) return 0;
      switch(this.paper.paperFrequencyType){
        case 'daily':{
          let timeDiff = Math.abs(this.formData.startAndEnding[0].getTime()
           - this.paper.publishTime.getTime());
          let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          return diffDays
        }
        case 'weekly':{
          let timeDiff = Math.abs(this.formData.startAndEnding[0].getTime()
           - this.paper.publishTime.getTime());
          let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24 * 7));
          return diffDays
        }
        case 'monthly':{
          let months;
          months = (this.formData.startAndEnding[0].getFullYear() - this.paper.publishTime.getFullYear()) * 12;
          months -= this.formData.startAndEnding[0].getMonth() + 1;
          months += this.paper.publishTime.getMonth();
          return months <= 0 ? 1 : months;
        }
      }
    },
    price(){
      return this.calculatePrice().toFixed(2);
    },
    discountPrice(){
      if(this.customer) return (this.price * this.customer.discount).toFixed(2);
      else return 0;
    }
  },
  watch:{
    paper(){
      this.formData = initForm();
    }
  },
  methods:{
    onStar(){
      if(this.isInCustomerStar){
        let favoriteIndex = this.favorites.findIndex((value)=>{
          return value.paperId == this.paper.id
        });
        let favorite = this.favorites[favoriteIndex];
        this.$store.dispatch('deleteResource', {
          resourceName: 'favorites',
          data: {id:favorite.id}
        }).then((res)=>{
          if(typeof res == 'boolean' && res){
            let favorites = this.favorites;
            favorites.splice(favoriteIndex, 1);
            this.$store.commit('setFavorites', favorites);
          }
        })
      }else{
        this.$store.dispatch('createResource', {
          resourceName: 'favorites',
          data: {paperId: this.paper.id}
        }).then((res)=>{
          if(!res.hasError && res.entity){
            this.$store.commit('addToFavorites', res.entity);
          }
        })
      }
    },
    onAddToCart(){
      this.$refs['orderForm'].validate((valid) => {
        if (valid) {
          if(!this.isInCustomerCart){
            this.$store.dispatch('createResource', {
              resourceName: 'shoppingCars',
              data: {
                paperId: this.paper.id,
                startDate: this.formData.startAndEnding[0],
                endingDate: this.formData.startAndEnding[1],
                numberWanted: this.formData.numberWanted,
                deliverAddressId: this.formData.deliverAddressId
              }
            }).then((res)=>{
              if(!res.hasError && res.entity){
                this.$store.commit('addToShoppingCart', res.entity);
                this.$router.push('/shoppingCart');
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    onPick({minDate, maxDate}){
      if(minDate < new Date()){
        this.formData.startAndEnding[0] = new Date();
      }
      if(maxDate > this.paper.endingDate){
        this.formData.startAndEnding[1] = this.paper.endingDate;
      }
    },
    formatDate(date){
      return parseDate(date);
    },
    initForm(){
      let now = moment();
      let nextMonth = moment().add(1, 'M');
      return{
        deliverAddressId: (this.deliverAddresses && this.deliverAddresses.length) ? this.deliverAddresses[0].id : null,
        startAndEnding: [now._d, nextMonth._d],
        numberWanted: 1
      }
    },
    calculatePrice(){
      if(!this.formData.startAndEnding[0] || !this.formData.startAndEnding[1]) return 0;
      let startDate = moment(this.formData.startAndEnding[0]);
      let endingDate = moment(this.formData.startAndEnding[1]);
      let price = 0;

      let dirtaYear = endingDate.diff(startDate, 'years');
      price += dirtaYear * this.paper.yearPrice;
      endingDate.subtract(dirtaYear, 'y');

      let dirtaMonth = endingDate.diff(startDate, 'M');
      price += dirtaMonth * this.paper.monthPrice;
      endingDate.subtract(dirtaMonth, 'M');

      let dirtaDay = endingDate.diff(startDate, 'd');
      price += dirtaDay * this.paper.singlePrice;

      return price * this.formData.numberWanted;
    }
  },
  mounted(){
    if(!this.$store.state.customers.customer){
      this.$router.replace('/');
    }
    if(!this.$store.state.customers.currentPaper || this.$store.state.customers.currentPaper.id != this.$route.params.id){
      this.$store.dispatch('queryResource', {resourceName: 'papers', data:{id:this.$route.params.id,page:1,pageSize:10}})
        .then((res)=>{
          if(res.papers && res.papers.length){
            this.$store.commit('setCurrentPaper', res.papers[0]);
            this.formData = this.initForm();
          }
        })
    }else{
      this.formData = this.initForm();
    }
  }
}
</script>

<style scoped>
  .info{
    margin-top: 20px;
    margin-bottom: 20px;
    color: #48576a;
  }
  img{
    display: inline-block;
    max-height: 500px;
    width: 300px;
    margin-right: 20px;
    vertical-align: top;
  }
  .rightInfo{
    display: inline-block;
    vertical-align: top;
    width: calc(100% - 340px);
  }
  header{
    margin-bottom: 20px;
  }
  h1{
    display: inline-block;
    margin-right: 20px;
  }
  .headTip{
    display: inline-block;
    font-size: 0.9rem;
  }
  .typeTip{
    font-size: 0.9rem;
  }
  .typeTip span{
    margin-right: 20px;
  }

  .detail{
    margin-bottom: 20px;
  }

  .orderForm{
    margin-bottom: 20px;
    width: 100%;
  }
  .opBtn{
    font-size: 1.1rem;
  }
  i:before{
    font-size: 1rem !important;
  }
  .el-icon-shoppingCarting:before{
    color: white;
  }

  .el-button-star,
  .el-button-shoppingCart{
    font-size: 1.5rem !important;
  }
  .add-leave-active {
    position: absolute;
    transition: all .5s
  }
  .add-leave{
    opacity: 1;
  }
  .add-leave-to{
    opacity: 0;
    transform: scale(2);
  }

  .price ul{
    list-style: none;
  }
  ul li div{
    display: inline-block;
  }
  .priceCol{
    width: 100px;
  }

  .priceTitle{
    width: 100%;
    border-top: 1px solid #ccc;
    padding-top: 20px;
    text-align: center;
    margin-bottom: 10px;
  }
  i{
    margin-left: 5px;
  }
</style>
