<template>
   <el-table :data="dataSource" style="width: 100%" @sort-change="sortChange"
    v-loading="loading"
    element-loading-text="数据加载中">
      <el-table-column type="expand">
        <template scope="scope">
          <el-form label-position="left" inline class="expand">
          <el-form-item label="配送地址">
            <span>{{ scope.row.detailDeliverAddress }}</span>
          </el-form-item>
          <el-form-item label="应付订价">
            <span>{{ scope.row.price }}</span>
          </el-form-item>
          <el-form-item label="实付订价">
            <span>{{ scope.row.discountPrice }}</span>
          </el-form-item>
          <el-form-item label="续订订单编号" v-if="scope.row.lastOrderId">
            <span>{{ scope.row.printPrice }}</span>
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
      <el-table-column v-if="onEdit || onDelete" label="操作">
        <template scope="scope">
          <button v-if="onEdit" @click="onEdit(scope.row)" class="inTableBtn">编辑</button>
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
          <button v-if="onDelete" v-popover:deletePopover class="inTableBtn">删除</button>
        </template>
      </el-table-column>
      <td v-if="dataSource.length" slot="append" class="append" :colspan="dataStructure.length + ((onEdit || onDelete) ? 1 : 0) + 1">
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
import dateFormat from 'dateformat';
export default {
  name: 'OrderTable',
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
    onPriceEdit:{
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
    },
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
