<template>
  <el-card :body-style="{ padding: '0px'}">
    <div class="card" @click="toPaperPage">
      <img :src="paper.picture">
      <div style="padding: 14px;">
        <h1>{{paper.name}}</h1>
        <span class="price">{{paper.singlePrice && paper.singlePrice.toFixed(2)}}￥/份</span>
        <p class="tipGroup">
          <span class="tip">转址<i :class="paper.canChangeAddress ? 'el-icon-allowed' : 'el-icon-disallowed'"></i></span>
          <span class="tip">退订<i :class="paper.canUnsubscribe ? 'el-icon-allowed' : 'el-icon-disallowed'"></i></span>
        </p>
        <el-form class="info" label-position="left">
          <el-form-item label="发行报社">
            {{paper.pbCompanyName}}
          </el-form-item>
          <el-form-item label="报刊编号">
            {{paper.paperNumber}}
          </el-form-item>
          <el-form-item label="报刊类型">
            {{paper.paperTypeName}}
          </el-form-item>
          <el-form-item label="发行周期">
            {{paperFrequencyTypeName}}
          </el-form-item>
          <el-form-item label="发行时间">
            {{formatDate(paper.publishTime)}}
          </el-form-item>
        </el-form>
        <div class="operation" v-if="customer">
          <transition name="add">
            <el-tooltip class="item" effect="light" content="收藏" placement="bottom" v-if="!isInCustomerStar">
              <el-button icon="star" @click.prev.stop="onStar()"></el-button>
            </el-tooltip>
          </transition>
          <el-tooltip class="item" effect="light" content="从收藏移除" placement="bottom" v-if="isInCustomerStar">
            <el-button icon="staring" @click.prev.stop="onStar()"></el-button>
          </el-tooltip>
          <transition name="add">
          <el-tooltip class="item" effect="light" content="加入购物车" placement="bottom" v-if="!isInCustomerCart">
            <el-button icon="shoppingCart" @click.prev.stop="onAddToCart()"></el-button>
          </el-tooltip>
          </transition>
          <el-tooltip class="item" effect="light" content="已加入购物车" placement="bottom" v-if="isInCustomerCart">
            <el-button icon="shoppingCarting"></el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-card>
  <!--<li @click="toPaperPage">
  <img :src="paper.picture">
    <div class="textInfo">
      <div class="partialInfo">
        <div>
          名称: {{paper.name}}
        </div>
        <div>
          发行于: {{formatDate(paper.publishTime)}}
        </div>
        <div>
          报刊编号: {{paper.paperNumber}}
        </div>
      </div><!--
   -><div class="partialInfo">
        <div>
          报刊类型: {{paper.paperTypeName}}
        </div>
        <div>
          发行周期: {{paperFrequencyTypeName}}
        </div>
        <div>
          单价: {{paper.singlePrice}}
        </div>
      </div><!--
   -><div class="partialInfo small">
        <div v-if="paper.canUnsubscribe == 1">
          允许退订
        </div>
        <div v-else>
          禁止退订
        </div>
        <div v-if="paper.canChangeAddress == 1">
          允许转址
        </div>
        <div v-else>
          禁止转址
        </div>
        <div v-if="customer && customer.discount != 1">
          优惠价: {{paper.singlePrice * customer.discount}}
        </div>
      </div><!--
   -><div class="partialInfo op" v-if="customer">
        <transition name="add">
          <el-tooltip class="item" effect="light" content="收藏" placement="left-start" v-if="!isInCustomerStar">
            <el-button icon="star" @click.prev.stop="onStar()"></el-button>
          </el-tooltip>
        </transition>
        <el-tooltip class="item" effect="light" content="从收藏移除" placement="left-start" v-if="isInCustomerStar">
          <el-button icon="staring" @click.prev.stop="onStar()"></el-button>
        </el-tooltip>
        <transition name="add">
        <el-tooltip class="item" effect="light" content="加入购物车" placement="left-start" v-if="!isInCustomerCart">
          <el-button icon="shoppingCart" @click.prev.stop="onAddToCart()"></el-button>
        </el-tooltip>
        </transition>
        <el-tooltip class="item" effect="light" content="已加入购物车" placement="left-start" v-if="isInCustomerCart">
          <el-button icon="shoppingCarting"></el-button>
        </el-tooltip>
      </div><!--
   -><div class="partialInfo detail">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
  </li>-->
</template>

<script>
  /*
      id
      pbCompanyName
      paperFrequencyType
      paperNumber
      publishTime
      name
      picture
      description
      endingDate
      canUnsubscribe
      canChangeAddress
   */
  import parseDate from '../../util/parseDate.js';
  export default{
    name: "Paper",
    props:{
      paper:{
        type: Object,
        required: true
      }
    },
    data(){
      return{

      }
    },
    computed:{
      isInCustomerStar(){
        if(this.favorites){
          return ~(this.favorites.findIndex((starItem)=>{
            return starItem.paperId == this.$props.paper.id
          }));
        }else{
          return false;
        }
      },
      isInCustomerCart(){
        if(this.shoppingCart){
          return ~(this.shoppingCart.findIndex((shoppingItem)=>{
            return shoppingItem.paperId == this.$props.paper.id
          }));
        }else{
          return false;
        }
      },
      customer(){
        return this.$store.state.customers.customer;
      },
      paperFrequencyTypeName(){
        switch(this.$props.paper.paperFrequencyType){
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
      favorites(){
        return this.$store.state.customers.favorites;
      },
      shoppingCart(){
        return this.$store.state.customers.shoppingCart;
      }
    },
    methods:{
      onStar(){
        if(this.isInCustomerStar){
          let favoriteIndex = this.favorites.findIndex((value)=>{
            return value.paperId == this.$props.paper.id
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
            data: {paperId: this.$props.paper.id}
          }).then((res)=>{
            if(!res.hasError && res.entity){
              this.$store.commit('addToFavorites', res.entity);
            }
          })
        }
      },
      onAddToCart(){
        if(this.$store.state.customers.deliverAddresses.length < 1){
          this.$store.commit('error', {title: '未添加派送地址', message:"请先添加派送地址在进行订阅"});
          return;
        }
        this.$store.dispatch('createResource', {
          resourceName: 'shoppingCars',
          data: {
            paperId: this.$props.paper.id,
            startDate: new Date(),
            endingDate: new Date(),
            numberWanted: 1,
            deliverAddressId: this.$store.state.customers.deliverAddresses[0].id
          }
        }).then((res)=>{
            if(!res.hasError && res.entity){
              this.$store.commit('addToShoppingCart', res.entity);
            }
        })
      },
      toPaperPage(){
        if(!this.customer){
          this.$store.commit('openCustomerModal', true);
        }else{
          this.$store.commit('setCurrentPaper', this.paper);
          this.$router.push(`/papers/${this.paper.id}`);
        }
      },
      formatDate(date){
        return parseDate(date);
      }
    }
  }
</script>

<style scoped>
.card{
  cursor: pointer;
}
img{
  width: 100%;
  height: 200px;
  border: none;
}
h1{
  display: inline-block;
}
.price{
  color: #324057;
  margin-left: 20px;
  font-size: 1rem;
}
.tipGroup{
  margin-top: 5px;
  margin-bottom: 10px;
}
.tip{
  color: #324057;
  font-size: 12px;

  margin-right: 20px;
}
i{
  margin-left: 3px;
  vertical-align: top;
}
.el-form-item{
  margin-bottom: 0px;
}
button{
  border: none;
  padding: 0;
}
.operation{
  margin-top: 10px;
}
</style>
