<template>
  <div>
    <h1>个人收藏</h1>
    <el-row class="paperList">
      <el-col :span="6" v-for="(paper, index) in favorites" :key="paper.id" :offset="index % 3 > 0 ? 1  : 0" :class="{paper:true, firstOne: index % 3 == 0}"><Paper :paper="paper"></Paper></el-col>
    </el-row>
  </div>
</template>

<script>
import Paper from '@/components/customer/Paper';
import {Rbase} from '../../../util/util.js';
export default {
  name: "Favorites",
  components: {
    Paper
  },
  computed:{
    favorites(){
      return this.$store.state.customers.favorites;
    }
  }
}
</script>

<style scoped>
div{
  padding: 20px;
}
ul{
  list-style: none;
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
</style>
