<template>
   <el-table :data="dataSource" style="width: 100%" @sort-change="sortChange"
    v-loading="loading"
    element-loading-text="数据加载中">
      <el-table-column type="expand">
        <template scope="scope">
          <el-form label-position="left" inline class="expand">
          <el-form-item label="刊号">
            <span>{{ scope.row.paperNumber }}</span>
          </el-form-item>
          <el-form-item label="发行时间">
            <span>{{ formatDate(scope.row.publishTime) }}</span>
          </el-form-item>
          <el-form-item label="描述">
            <span>{{ scope.row.description }}</span>
          </el-form-item>
          <el-form-item label="印刷价">
            <span>{{ scope.row.printPrice }}</span>
          </el-form-item>
          <el-form-item label="可否退订">
            <span>{{ scope.row.canUnsubscribe == 1 ? '是' : '否'}}</span>
          </el-form-item>
          <el-form-item label="可否转址">
            <span>{{ scope.row.canChangeAddress == 1 ? '是' : '否'}}</span>
          </el-form-item>
          <el-form-item label="单价">
            <span class="price">{{scope.row.singlePrice}}</span>
          </el-form-item>
          <el-form-item label="月价">
            <span class="price">{{scope.row.monthPrice}}</span>
          </el-form-item>
          <el-form-item label="年价">
            <span class="price">{{scope.row.yearPrice}}</span>
          </el-form-item>
          <!--<el-form-item v-for="paperPrice in scope.row.paperPrice"
            :key="paperPrice.customerTypeId"
            :label="paperPrice.customerTypeName">
            <div>
              <span class="price">单价: {{paperPrice.singlePrice}}</span>
              <span class="price">月价: {{paperPrice.monthPrice}}</span>
            </div>
            <div>
              <span class="price">季度价: {{paperPrice.seasonPrice}}</span>
              <span class="price">半年价: {{paperPrice.halfYearPrice}}</span>
              <span class="price">年价: {{paperPrice.wholeYearPrice}}</span>
            </div>
          </el-form-item>-->
        </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="picture" label="图片">
        <template scope="scope">
          <img :src="scope.row.picture">
        </template>
      </el-table-column>
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
          <!--<button v-if="onEdit" @click="onPriceEdit(scope.row)" class="inTableBtn">定价</button>-->

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
      <td v-if="dataSource.length" slot="append" class="append" :colspan="dataStructure.length + 3">
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
  .inTableBtn{
    padding: 6px;
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
