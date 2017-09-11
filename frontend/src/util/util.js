/*
* @Author: inksmallfrog
* @Date:   2017-08-13 17:11:53
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-08-17 14:05:51
*/

'use strict';
import parseDate from './parseDate.js';
export const Rbase = {
  /**
     * 搜索回调函数
     * @param  {Object} form [搜索表单]
     * @return {undefined}
     */
    onSearch(form){
      this.query(form);
    },
    /**
     * 换页回调函数
     * @param  {int} page [切换到的页号]
     * @return {undefined}
     */
    onToPage(page){
      if(page == 1 && this.noTriggerPageChangeAgain){
        this.noTriggerPageChangeAgain = false;
        return;
      }
      let form = this.lastQueryForm;
      form.page = page;
      form.pageSize = form.pageSize || 10;
      this.query(form);
    },
    /**
     * 排序按钮回调函数
     * @param  {String} key   [排序的键名]
     * @param  {String} order [排序的方向{ascending || descending}]
     * @return {undefined}
     */
    onSort(key, order){
      if(this.dataSource.length < 10){    //已加载到所有的数据，使用前端排序
        if(order){
          this.dataSource.sort((dataA, dataB)=>{
            //assert dataA[key] && dataB[key]
            if('ascending' == order){
              return (dataA[key] < dataB[key]) ? -1 : 1;
            }else if('descending' == order){
              return (dataA[key] > dataB[key]) ? -1 : 1;
            }
          })
        }
      }else{//后台排序
        //基于上次的搜索结果进行排序
        let form = this.lastQueryForm;
        if(key) {
          console.assert(order)
          form.sortby = key;
          form.order = ((order == "ascending") ? "ASC" : "DESC");
        }else{
          //如果排序键不存在，则不进行排序
          //删除上次查询表单中的排序参数
          delete form.sortby;
          delete form.order;
        }
        this.query(form);
      }
    },
    /**
     * 查询API
     * @param  {Object} form [查询参数]
     * @return {undefined}
     */
    query(form){

      //请求参数必须包含 page 和 pageSize
      form.page = form.page || 1;
      form.pageSize = form.pageSize || 10;

      //显示加载动画
      this.dataLoading = true;

      //通过vuex发起fetch请求
      this.$store.dispatch('queryResource', {resourceName: this.resourceName, data: form})
        .then((json)=>{
          if(!json.hasError){
            //加载成功
            this.lastQueryForm = form;
            if(json.curPage == 1){
              this.noTriggerPageChangeAgain = true;
            }else{
              this.noTriggerPageChangeAgain = false;
            }
            this.curPage = json.curPage;
            this.totalPage = json.totalPage;
            this.dataSource = json.entityList;
          }
          //关闭加载动画
          this.dataLoading = false;
        })
    },
}
export const RUbase = Object.assign({
  onEdittingSubmit(formData){
    console.assert(formData.id > 0)
    this.update(formData);
  },
  edittingModalClose(){
    //置空编辑中的数据
    this.edittingData={};
    //置空错误信息
    this.errors={};
  },
  onEdit(data){
    this.edittingData = data;
    this.isEditting = true;
  },
  update(form){
    this.submitLoading = true;
    this.$store.dispatch('updateResource', {resourceName: this.resourceName, data: form})
      .then((json)=>{
        this.submitLoading = false;
        if(!json.hasError){    //更新成功
          let entity = form;
          for(let key in entity){
            this.edittingData[key] = _.cloneDeep(form[key])
          }
          this.isEditting = false;
        }
        else if(json.hasError && json.invalidKey){  //输入错误
          console.assert(this.errors[json.invalidKey])
          this.errors[json.invalidKey] = json.errorInfo;
        }
      })
  },
}, Rbase);
export const CRUDbase = Object.assign({
    /**
     * 编辑提交回调函数
     * @param  {Object} formData [编辑完成后的数据]
     * @return {undefined}
     */
    onEdittingSubmit(formData){
      if(formData.id > 0){    //存在id则为更新操作
        this.update(formData);
      }else{                  //否则为新增操作
        this.create(formData);
      }
    },
    /**
     * 编辑窗口关闭回调函数
     * @return {undefined}
     */
    edittingModalClose(){
      //置空编辑中的数据
      this.edittingData={};
      //置空错误信息
      this.errors={};
    },
    /**
     * 新增数据按钮回调函数
     * @return {undefined}
     */
    edittingNewData(){
      //新增数据打开窗口前
      //置空编辑中的数据
      this.edittingData = {};
      //进入编辑模式
      this.isEditting = true;
    },
    /**
     * 编辑按钮回调函数
     * @param  {Object} data [编辑的数据]
     * @return {undefined}
     */
    onEdit(data){
      //编辑数据打开窗口前
      //将编辑中的数据设置为对应数据
      this.edittingData = data;
      //进入编辑模式
      this.isEditting = true;
    },
    /**
     * 删除按钮回调函数
     * @param  {Object} data [删除的数据]
     * @return {undefined}
     */
    onDelete(data){
      this.delete(data);
    },
    /**
     * 新增API
     * @param  {Object} form [新增参数]
     * @return {undefined}
     */
    create(form){
      //将错误信息初始化
      //这里可能是element组件的bug
      //重复产生的相同错误，仅第一次给出错误提示
      //必须重新初始化错误后，才能使后续错误提示生效
      this.initErrors();
      //显示提交动画
      this.submitLoading = true;
      //通过vuex发起fetch请求
      this.$store.dispatch('createResource', {resourceName: this.resourceName, data: form})
        .then((json)=>{
          if(!json.hasError){
            //创建成功
            let entity = json.entity;
            //在保证数据源最多包含10条记录的前提下
            //显示新数据
            if(this.dataSource.length > 9){
              this.dataSource.shift();
              if(this.curPage == this.totalPage){
                ++(this.totalPage);
              }
            }
            this.dataSource.unshift(entity);
            //关闭提交窗口
            this.isEditting = false;
          }
          else if(json.hasError && json.invalidKey){
            //输入错误，给出错误提示
            this.errors[json.invalidKey] = json.errorInfo;
          }
          //关闭加载动画
          this.submitLoading = false;
        })
    },
    /**
     * 修改API
     * @param  {Object} form [修改参数]
     * @return {undefined}
     */
    update(form){
      //原因同上
      this.initErrors();
      //显示提交动画
      this.submitLoading = true;

      //通过vuex发起fetch请求
      this.$store.dispatch('updateResource', {resourceName: this.resourceName, data: form})
        .then((json)=>{
          if(!json.hasError){
            //更新成功
            let entity = form;
            //将源数据内容设置为提交数据的内容
            for(let key in entity){
              this.edittingData[key] = _.cloneDeep(form[key])
            }
            //关闭编辑对话框
            this.isEditting = false;
          }
          else if(json.hasError && json.invalidKey){
            //输入错误，显示错误信息
            this.errors[json.invalidKey] = json.errorInfo;
          }
          //关闭提交动画
          this.submitLoading = false;
        })
    },
    /**
     * 删除API
     * @param  {Object} form [删除参数]
     * @return {[undefined}
     */
    delete(form){
      //获取被删除数据在数据源中的下标
      let dataIndex = this.dataSource.findIndex((data) => {
        return data.id == form.id
      });
      //显示加载动画
      this.dataLoading = true;
      //通过vuex发起fetch请求
      this.$store.dispatch('deleteResource', {resourceName: this.resourceName, data: form})
        .then((json)=>{
          if(!json.hasError){
            //删除成功，从数据源中删除数据
            this.dataSource.splice(dataIndex, 1);
          }
          //关闭加载动画
          this.dataLoading = false;
        })
    }
}, Rbase);

export function parseToJs(source){
  let jsData = null;
  if(typeof source == 'object'){
    if(source instanceof Array){
      jsData = [];
      for(let item of source){
        jsData.push(parseToJs(item));
      }
    }else{
      jsData = {};
      for(let key in source){
        if(typeof source[key] == 'object'){
          jsData[key] = parseToJs(source[key]);
        }else{
          if(key.endsWith('Date') || key.endsWith('Time')){
            let date = new Date();
            date.setTime(source[key])
            jsData[key] = date;
          }else if(typeof source[key] == "boolean"){
            jsData[key] = source[key] ? 1 : 0;
          }
          else{
            jsData[key] = source[key];
          }
        }
      }
    }
  }else{
    jsData = source;
  }
  return jsData;
}

export default function(data){
  let content = '';
  for(let key in data){
    if(key.endsWith('Start')){
      let fieldName = key.substr(0, key.length - 5)
      console.assert(typeof data[fieldName+'End'] != undefined);
      if(data[key] || data[fieldName+'End']){
        content += `${fieldName}=`
        if(data[key] instanceof Date){
          content += `${parseDate(data[key])}~`
        }
        else if(data[key]){
          content += `${data[key]}~`
        }
        else{
          content += `~`
        }
        if(data[fieldName+'End'] instanceof Date){
          content += `${parseDate(data[fieldName+'End'])}`
        }
        else if(data[fieldName+'End']){
          content += `${data[fieldName+'End']}`
        }
        content += '&';
      }else{

      }
    }
    else if(key.endsWith('End')){
      continue;
    }
    else if(data[key] !== undefined && data[key] !== null && data[key] !== ""){
      if(data[key] instanceof Date){
        content += `${key}=${parseDate(data[key])}&`
      }else{
        content += `${key}=${data[key]}&`
      }
    }
  }
  return content;
}
