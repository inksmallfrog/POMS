<template>
  <div>
    <h1>购物车</h1>
    <header>
      <p v-if="totalPrice">总金额 {{totalPrice}} </p>
      <el-button v-if="totalPrice" type="primary" @click="payTotal" :disabled="!!(totalPrice == 0)">全部支付</el-button>
    </header>
    <el-table :data="shoppingCart" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="图片">
        <template scope="scope">
          <img :src="scope.row.picture">
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" width="150px">
      </el-table-column>
      <el-table-column label="订阅时间" width="255px">
        <template scope="scope">
          <el-date-picker
            v-model="scope.row.startAndEnding"
            type="daterange"
            placeholder="选择日期范围"
            :pickerOptions="dateOptions"
            size="small">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="订阅份数">
        <template scope="scope">
          <el-input-number v-model="scope.row.numberWanted" :min="1" size="small"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="详细地址">
        <template scope="scope">
          <el-select v-model="scope.row.deliverAddressId" size="small">
            <el-option v-for="deliverAddress in deliverAddresses" value-key="id"
              :key="deliverAddress.id"
              :label="deliverAddress.detailAddress"
              :value="deliverAddress.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="发放首期" width="95px">
        <template scope="scope">
          {{calculatePhase(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="应付费用" width="100px">
        <template scope="scope">
          {{calculatePrice(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140px">
        <template scope="scope">
          <el-button @click="pay(scope.row)" size="small" type="primary">支付</el-button>
          <el-button @click="deleteShoppingCartItem(scope.row)" size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="订阅付款" :visible.sync="isPaying">
      <PayModal
        :loading="payingLoading"
        :totalPrice="feeToPay"
        :onPay="onPay">
      </PayModal>
    </el-dialog>
  </div>
</template>

<script>
import PayModal from '@/components/customer/PayModal'
import moment from 'moment';
export default {
  name: 'ShoppingCart',
  components: {
    PayModal
  },
  data(){
    return{
      resourceName: 'shoppingCars',
      selectedCols: [],
      isPaying: false,
      payingLoading: false,
      feeToPay: 0,
      ordersPaid: [],
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
    }
  },
  computed:{
    shoppingCart(){
      return this.$store.state.customers.shoppingCart;
    },
    customer(){
      return this.$store.state.customers.customer;
    },
    deliverAddresses(){
      return this.$store.state.customers.deliverAddresses;
    },
    totalPrice(){
      let price = 0;
      for(let col of this.selectedCols){
        price += this.calculatePrice(col);
      }
      return (+price).toFixed(2);
    }
  },
  methods:{
    handleSelectionChange(cols){
      this.selectedCols = cols;
    },
    deleteShoppingCartItem(item){
      let shoppingCartIndex = this.shoppingCart.findIndex((cartItem)=>{
        return cartItem.id == item.id;
      })
      this.$store.dispatch('deleteResource', {resourceName: 'shoppingCars', data: {id: item.id}})
        .then((res)=>{
          if(!res.hasError){
            let shoppingCart = this.shoppingCart;
            shoppingCart.splice(shoppingCartIndex, 1);
            this.$store.commit('setShoppingCart', shoppingCart);
          }
        })
    },
    calculatePhase(row){
      if(!row || !row.startAndEnding || !row.startAndEnding[0] || !row.startAndEnding[1]) return 0;
      switch(row.paperFrequencyType){
        case 'daily':{
          let timeDiff = Math.abs(row.startAndEnding[0].getTime()
           - row.publishTime.getTime());
          let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          return diffDays
        }
        case 'weekly':{
          let timeDiff = Math.abs(row.startAndEnding[0].getTime()
           - row.publishTime.getTime());
          let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24 * 7));
          return diffDays
        }
        case 'monthly':{
          let months;
          months = (row.startAndEnding[0].getFullYear() - row.publishTime.getFullYear()) * 12;
          months -= row.startAndEnding[0].getMonth() + 1;
          months += row.publishTime.getMonth();
          return months <= 0 ? 1 : months;
        }
      }
    },
    calculatePrice(row){
      return (this.calculatePriceNormal(row) * this.customer.discount).toFixed(2);
    },
    calculatePriceNormal(row){
      if(!row) return 0;
      if(!row.startAndEnding) row.startAndEnding = [row.startDate, row.endingDate];
      if(!row.startAndEnding[0] || !row.startAndEnding[1]) return 0;
      if(!row.startAndEnding[0] || !row.startAndEnding[1]) return 0;
      let startDate = moment(row.startAndEnding[0]);
      let endingDate = moment(row.startAndEnding[1]);
      let price = 0;

      let dirtaYear = endingDate.diff(startDate, 'years');
      price += dirtaYear * row.yearPrice;
      endingDate.subtract(dirtaYear, 'y');

      let dirtaMonth = endingDate.diff(startDate, 'M');
      price += dirtaMonth * row.monthPrice;
      endingDate.subtract(dirtaMonth, 'M');

      let dirtaDay = endingDate.diff(startDate, 'd');
      price += dirtaDay * row.singlePrice;

      return price * row.numberWanted;
    },
    pay(data){
      this.feeToPay = this.calculatePrice(data);
      this.isPaying = true;
      this.ordersPaid.length = 1;
      this.ordersPaid[0] = data;
    },
    payTotal(){
      this.feeToPay = this.totalPrice;
      this.isPaying = true;
      this.ordersPaid = this.selectedCols;
    },
    onPay(){
      this.payingLoading = true;
      let promises = [];

      for(let order of this.ordersPaid){
        let form = {
          shoppingcarId: order.id,
          paperId: order.paperId,
          startDate: order.startAndEnding[0],
          endingDate: order.startAndEnding[1],
          numberWanted: order.numberWanted,
          deliverAddressId: order.deliverAddressId,
          phaseWanted: this.calculatePhase(order),
          price: this.calculatePriceNormal(order),
          discountPrice: this.calculatePrice(order),
          paperFrequencyType: order.paperFrequencyType,
          orderDate: new Date()
        }
        promises.push(this.$store.dispatch('createResource', {resourceName:'orders', data:form}));
      }
      let shoppingCart = this.shoppingCart;
      Promise.all(promises)
        .then((ress)=>{
          let success = 0;
          ress.forEach((res, index)=>{
            if(!res.hasError){
              ++success;
              let indexOfCart = shoppingCart.findIndex((val)=>{return val == this.ordersPaid[index]});
              shoppingCart.splice(indexOfCart ,1);
            }
          })
          if(success < ress.length){
            this.$store.commit('error', {title:"错误", message:"存在未能成功付款的项目"});
          }else{
            this.$router.push('/customer/orders');
          }
          this.payingLoading = false;
          if(success > 0){
            this.isPaying = false;
          }
        })
    }
  },
  mounted(){
    if(!this.$store.state.customers.customer){
      this.$router.replace('/');
    }
    if(!(this.shoppingCart)){
      this.$store.dispatch('queryAll', 'shoppingCars')
        .then((res)=>{
          if(typeof res == 'boolean' && res){
            this.$store.commit('setShoppingCart', res.entityList)
          }
        })
    }
  }
}
</script>

<style scoped>
  header p{
    display: inline-block;
    margin: 10px 20px 20px 0;
  }
  img{
    height: 100px;
  }
</style>

