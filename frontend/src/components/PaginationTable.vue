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
      <el-table-column v-if="onEdit || onDelete" label="操作">
        <template scope="scope">
          <el-button v-if="onEdit" @click="onEdit(scope.row)" class="inTableBtn">编辑</el-button>
          <el-popover
            ref="deletePopover"
            placement="top-start"
            title="警告"
            width="200"
            trigger="click"
            v-model="deletePopoverState[scope.$index]">
            <p>删除操作不可撤销，确定要删除？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="cancelDelete(scope)">取消</el-button>
              <el-button type="primary" size="mini" @click="doDelete(scope)">确定</el-button>
            </div>
          </el-popover>
          <el-button v-if="onDelete" v-popover:deletePopover class="inTableBtn" type="danger">删除</el-button>
        </template>
      </el-table-column>
      <td v-if="dataSource.length" slot="append" class="append" :colspan="dataStructure.length + ((onEdit || onDelete) ? 1 : 0)">
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
      required: false
    },
    onDelete:{
      type: Function,
      required: false
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
      deletePopoverState: []
    }
  },
  methods:{
    sortChange({column, prop, order}){
      console.log(prop);
      this.$props.onSort(prop, order);
    },
    cancelDelete(scope){
      let newDeletePropoverState = this.deletePopoverState.slice()
      newDeletePropoverState[scope.$index] = false;
      this.deletePopoverState = newDeletePropoverState;
    },
    doDelete(scope){
      this.onDelete(scope.row);
      let newDeletePropoverState = this.deletePopoverState.slice();
      newDeletePropoverState[scope.$index] = false;
      this.deletePopoverState = newDeletePropoverState;
    }
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
