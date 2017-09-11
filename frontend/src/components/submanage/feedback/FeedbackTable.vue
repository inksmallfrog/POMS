<template>
   <el-table :data="dataSource" style="width: 100%" @sort-change="sortChange"
    v-loading="loading"
    element-loading-text="数据加载中">
      <el-table-column v-for="(col, index) in dataStructure"
        :key="index"
        :prop="col.dataKey" :label="col.colName"
        :sortable="col.sortable ? 'custome' : col.sortable"
        :width="col.width"
        :formatter="col.formatter">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button v-if="onEdit" @click="onEdit(scope.row)" class="inTableBtn">回执</el-button>
        </template>
      </el-table-column>
      <td v-if="dataSource.length" slot="append" class="append" :colspan="dataStructure.length + 1">
        <el-pagination
          @current-change="onToPage"
          :current-page="curPage"
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="totalPage * 20">
        </el-pagination>
      </td>
    </el-table>
</template>

<script>
export default {
  name: 'PaginationTable',
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
  methods:{
    sortChange({column, prop, order}){
      console.log(prop);
      this.$props.onSort(prop, order);
    },
  }
}
</script>

<style scoped>
  .inTableBtn{
    padding: 6px;
  }
  .append{
    text-align: center;
  }
</style>
