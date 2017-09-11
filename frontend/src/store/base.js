/*
* @Author: inksmallfrog
* @Date:   2017-08-08 13:47:01
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-08-17 19:53:41
*/

'use strict';
import _ from 'lodash';
import parseDate from '../util/parseDate.js';
import parseUrlContent from '../util/util.js';
import {parseToJs} from '../util/util.js';
let urlPrefix;
//urlPrefix = 'http://127.0.0.1:8080';
urlPrefix = '';

export default {
  state:{
    notify: null,
    lastNotifyTimer: null
  },
  mutations:{
    initNotify(state, func){
      state.notify = func
    },
    error(state, {title, message}){
      if(state.lastNotifyTimer){
        return;
      }else{
        state.lastNotifyTimer = setTimeout(()=>{state.lastNotifyTimer = null}, 10000);
        state.notify({
          title: title,
          message: message,
          duration: 10000
        })
      }
    }
  },
  actions: {
    queryAll({dispatch}, resourceName){
      return dispatch('queryResource', {resourceName: resourceName, data:{page:1, pageSize:1000}})
        .then((res)=>{
          if(!res.hasError){
            if(res.totalPage > 1){
              return dispatch('queryResource', {resourceName: resourceName, data:{page:1, pageSize:1000 * res.totalPage}});
            }
            else return res;
          }
          return res;
        })
   },
   queryAllWithForm({dispatch}, {resourceName, data}){
      delete data.page;
      delete data.pageSize;
      return dispatch('queryResource', {resourceName: resourceName, data:Object.assign({page:1, pageSize:1000}, data)})
        .then((res)=>{
          if(!res.hasError){
            if(res.totalPage > 1){
              return dispatch('queryResource', {resourceName: resourceName, data:Object.assign({page:1, pageSize:1000 * res.totalPage}, data)});
            }
            else return res;
          }
          return res;
        })
   },
   queryResource({commit}, {resourceName, data}){
      const url = `${urlPrefix}/api/v1/${resourceName}/selectAll?${parseUrlContent(data)}`;
      console.log('GET:' + url);
      return fetch(url, {
        method: 'GET',
        headers:{
          "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        credentials: 'include'
      }).then((res)=>{
        return res.json()
      }).then((json)=>{
        if(json.invalidKeys){
          json.invalidKey = json.invalidKeys;
        }
        //请求错误
        if(json.hasError && !json.invalidKey){
          if(json.hasError && json.errorInfo == "请登录！"){
            commit('setCustomer', null);
            commit('setCurrentSystemManager', null);
            fetch('/api/v1/util/clearSession', {
              method: 'POST',
              headers:{
                "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
              },
              credentials: 'include'
            })
          }
          commit('error', {
            title: '请求错误',
            message: json.errorInfo
          });
        }
        return parseToJs(json);
      })
      /*.catch((err)=>{
        commit('error', {
          title: '网络错误',
          message: '您的网络无法正常连接到服务器，请联系网络维护人员进行检查'
        });
        return {hasError: true};
      });*/
   },
   createResource({commit}, {resourceName, data, isJson}){
      //assert(department.id);
      /*let headers = {};
      if(isJson){
        headers = {
          'Content-Type': 'application/json'
        }
      }*/
      return fetch(`${urlPrefix}/api/v1/${resourceName}/add`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        credentials: 'include',
        body: parseUrlContent(data)
      }).then((res)=>{
        return res.json()
      }).then((json)=>{
        if(json.invalidKeys){
          json.invalidKey = json.invalidKeys;
        }
        //请求错误
        if(!json.hasError && !json.entity){
          if(json.hasError && json.errorInfo == "请登录！"){
            commit('setCustomer', null);
            commit('setCurrentSystemManager', null);
            fetch('/api/v1/util/clearSession', {
              method: 'POST',
              headers:{
                "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
              },
              credentials: 'include'
            })
          }
          commit('error', {
            title: '请求错误',
            message: '服务器异常'
          });
          return {hasError:true}
        }
        if(json.hasError && !json.invalidKey){
          commit('error', {
            title: '请求错误',
            message: json.errorInfo
          });
          return {hasError:true}
        }else{
          return parseToJs(json);
        }
      })
      .catch((err)=>{
        if(err.message != "Unexpected end of JSON input"){
          commit('error', {
            title: '网络错误',
            message: '您的网络无法正常连接到服务器，请联系网络维护人员进行检查'
          });
          return {hasError: true};
        }
        return true;
      });
   },
   updateResource({commit}, {resourceName, data}){
      //assert(department.id);
      return fetch(`${urlPrefix}/api/v1/${resourceName}/update`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        credentials: 'include',
        body: parseUrlContent(data)
      }).then((res)=>{
        if(res.status == 204){
          return null;
        }else{
          return res.json()
        }
      }).then((json)=>{
        if(json){
          if(json.invalidKeys){
            json.invalidKey = json.invalidKeys;
          }
          //请求错误
          if(json.hasError && !json.invalidKey){
            if(json.hasError && json.errorInfo == "请登录！"){
              commit('setCustomer', null);
              commit('setCurrentSystemManager', null);
              fetch('/api/v1/util/clearSession', {
                method: 'POST',
                headers:{
                  "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                credentials: 'include'
              })
            }
            commit('error', {
              title: '请求错误',
              message: json.errorInfo
            });
          }
          return parseToJs(json);
        }else{
          return true;
        }
      })
      .catch((err)=>{
        if(err.message != "Unexpected end of JSON input"){
          commit('error', {
            title: '网络错误',
            message: '您的网络无法正常连接到服务器，请联系网络维护人员进行检查'
          });
          return {hasError: true};
        }
        return true;
      });
   },
   deleteResource({commit}, {resourceName, data}){
      //assert(department.id);
      return fetch(`${urlPrefix}/api/v1/${resourceName}/delete`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        credentials: 'include',
        body: parseUrlContent(data)
      }).then((res)=>{
        if(res.status == 204){
          return null;
        }else{
          return res.json()
        }
      }).then((json)=>{
        if(json){
          if(json.invalidKeys){
            json.invalidKey = json.invalidKeys;
          }
          //请求错误
          if(json.hasError && !json.invalidKey){
            if(json.hasError && json.errorInfo == "请登录！"){
              commit('setCustomer', null);
              commit('setCurrentSystemManager', null);
              fetch('/api/v1/util/clearSession', {
                method: 'POST',
                headers:{
                  "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                credentials: 'include'
              })
            }
            commit('error', {
              title: '请求错误',
              message: json.errorInfo
            });
          }
          return parseToJs(json);
        }else{
          return true;
        }
      })
      .catch((err)=>{
        if(err.message != "Unexpected end of JSON input"){
          commit('error', {
            title: '网络错误',
            message: '您的网络无法正常连接到服务器，请联系网络维护人员进行检查'
          });
          return false;
        }
        return true;
      });
   }
 }
}
