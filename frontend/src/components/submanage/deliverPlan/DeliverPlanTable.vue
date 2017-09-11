<template>
 <el-table :data="dataSource" style="width: 100%" @sort-change="sortChange"
  v-loading="loading"
  element-loading-text="数据加载中">
    <el-table-column type="expand">
      <template scope="scope">
        <el-form label-position="left" inline class="expand">
        <el-form-item label="订单编号">
          <span>{{ scope.row.orderId }}</span>
        </el-form-item>
        <el-form-item label="客户名称">
          <span>{{ scope.row.customerName }}</span>
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
    <el-table-column label="操作">
      <template scope="scope">
        <el-button v-if="(scope.row.deliverDate - currentDate) <= 24 * 60 * 60 * 1000" @click="onEdit(scope.row)" class="inTableBtn">编辑</el-button>
      </template>
    </el-table-column>
    <td v-if="dataSource.length" slot="append" class="append" :colspan="dataStructure.length + 2">
      <el-pagination
        @current-change="onToPage"
        :current-page.sync="curPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="totalPage * 10">
      </el-pagination>
    </td>
  </el-table>
</template>

<script>
let a = new Date();
a.setTime(a.getTime() + 24 * 60 * 60 * 1000);
export default {
  name: 'DeliverPlanTable',
  props:{
    dataStructure: {
      type: Array,
      required: true
    },
    dataSource:{
      type: Array,
      required: true
    },
    curPage:{
      type: Number,
      default: 1
    },
    totalPage:{
      type: Number,
      default: 1
    },
    loading:{
      type: Boolean,
      default: false
    },
    onEdit:{
      type: Function,
      required: true
    },
    onSort:{
      type: Function,
      required: false
    },
    onToPage:{
      type: Function,
      required: true
    }
  },
  data(){
    return{
    }
  },
  computed: {
    currentDate(){
      let date = new Date();
      date.setSeconds(0);
      date.setMinutes(0);
      date.setHours(0);
      return date;
    }
  },
  methods:{
    sortChange({column, prop, order}){
      this.$props.onSort(prop, order);
    }
  }
}
</script>

<style scoped>
  img{
    width: 100%;
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
