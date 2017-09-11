<template>
   <el-table :data="dataSource" style="width: 100%" @sort-change="sortChange"
    v-loading="loading"
    element-loading-text="数据加载中">
      <el-table-column type="expand">
        <template scope="scope">
          <el-form label-position="left" inline class="expand">
          <el-form-item label="配送地址">
            <span>{{ scope.row.detailAddress }}</span>
          </el-form-item>
          <el-form-item label="续订订单编号" v-if="scope.row.lastOrderId">
            <span>{{ scope.row.printPrice }}</span>
          </el-form-item>
          <el-form-item label="应付订价">
            <span>{{ scope.row.price }}</span>
          </el-form-item>
          <el-form-item label="优惠价格">
            <span>{{ scope.row.discountPrice }}</span>
          </el-form-item>
          <el-form-item label="下单日期">
            <span>{{ formatDate(scope.row.orderDate) }}</span>
          </el-form-item>
        </el-form>
        </template>
      </el-table-column>
      <el-table-column v-for="col in dataStructure"
        :key="col.id"
        :prop="col.dataKey" :label="col.colName"
        :sortable="col.sortable ? 'custome' : col.sortable"
        :width="col.width"
        :formatter="col.formatter">
      </el-table-column>
      <td v-if="dataSource.length" slot="append" class="append" :colspan="dataStructure.length + 1">
        <el-pagination
          @current-change="onToPage"
          :current-page.sync="curPage"
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="totalPage * 20">
        </el-pagination>
      </td>
    </el-table>
</template>

<script>
import dateFormat from 'dateformat';
export default {
  name: 'OrderTable',
  props:{
    //数据结构
    dataStructure: {
      type: Array,
      required: true
    },
    //数据源
    dataSource:{
      type: Array,
      required: true
    },
    //当前页
    curPage:{
      type: Number,
      default: 1
    },
    //总页数
    totalPage:{
      type: Number,
      default: 1
    },
    //加载动画
    loading:{
      type: Boolean,
      default: false
    },
    //排序回调函数
    onSort:{
      type: Function,
      required: false
    },
    //换页回调函数
    onToPage:{
      type: Function,
      required: true
    }
  },
  methods:{
    //改变排序回调函数
    sortChange({column, prop, order}){
      this.$props.onSort(prop, order);
    },
    //日期格式化函数
    formatDate(date){
      return dateFormat(date, 'yyyy-mm-dd');
    }
  }
}
</script>

<style scoped>
  img{
    width: 100%;
  }

  button{
    background: none;
    border: none;
    outline: none;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
  .append{
    text-align: center;
  }
  .expand {
    font-size: 0;
  }
  .expand label {
    width: 90px;
    color: #99a9bf;
  }
  .expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .expand .price{
    margin-right: 20px;
  }
</style>
