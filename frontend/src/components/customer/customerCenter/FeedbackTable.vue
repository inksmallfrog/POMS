<template>
 <el-table :data="dataSource" style="width: 100%" @sort-change="sortChange"
    v-loading="loading"
    element-loading-text="数据加载中">
    <el-table-column type="expand">
      <template scope="scope">
        <el-form label-position="left" inline class="expand">
          <el-form-item label="问题描述">
            {{scope.row.content}}
          </el-form-item>
          <el-form-item label="回执">
            {{scope.row.reply}}
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column prop="feedbackTypeName" label="反馈类型"></el-table-column>
    <el-table-column prop="toWhom" label="反馈对象"></el-table-column>
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="state" label="状态"
      :formatter="(state)=>{state == 1 ? '已回执' : '待回执'}"></el-table-column>
    <td v-if="dataSource.length" slot="append" class="append" :colspan="5">
      <el-pagination
        @current-change="onToPage"
        :current-page="curPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="totalPage * 10">
      </el-pagination>
    </td>
  </el-table>
</template>

<script>
export default {
  name: 'PaginationTable',
  props:{
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
    onSort:{
      type: Function,
      required: false
    },
    onToPage:{
      type: Function,
      required: true
    }
  },
  methods:{
    sortChange({column, prop, order}){
      this.$props.onSort(prop, order);
    },
  }
}
</script>

<style scoped>
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
.append{
  text-align: center;
}
</style>
