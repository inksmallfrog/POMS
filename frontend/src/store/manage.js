/*
* @Author: inksmallfrog
* @Date:   2017-08-08 13:47:01
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-08-17 19:53:47
*/

'use strict';


import parseUrlContent from '../util/util.js';

let urlPrefix = '';
//urlPrefix = 'http://127.0.0.1:8080';
urlPrefix = '';

export default {
  state:{
    currentSystemManager: null
  },
  mutations:{
    setCurrentSystemManager(state, systemManager){
      state.currentSystemManager = systemManager;
    }
  },
  actions: {
    quitSystemManager({commit}){
      return fetch(`${urlPrefix}/api/v1/systemManagers/quit`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
      }).then((res)=>{
        commit('setCurrentSystemManager', null);
      })
    },
    systemManagerLogin({commit}, data){
      return fetch(`${urlPrefix}/api/v1/systemManagers/login`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
        body: parseUrlContent(data)
      }).then((res)=>{
        return res.json()
      }).then((json)=>{
        json.invalidKey = json.invalidKeys;
        if(json.hasError && !json.invalidKey){
          commit('error', {
            title: '抱歉！这里可能出了一些错误',
            message: error.errorInfo
          })
          return {hasError:true};
        }
        else{
          if(json.invalidKey){
            return json;
          }else{
            commit('setCurrentSystemManager', json.entity);
            return true;
          }
        }
        return null;
      })
      .catch((err)=>{
        commit('error', {
          title: '网络错误',
          message: '您的网络无法正常连接到服务器，请联系网络维护人员进行检查'
        });
        return {hasError:true};
      })
   },
   checkSystemManagerLogged({commit}, data){
      return fetch(`${urlPrefix}/api/v1/systemManagers/hasLogged`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
        body: parseUrlContent(data)
      }).then((res)=>{
        return res.json()
      }).then((json)=>{
        if(json && json.id){
          commit('setCurrentSystemManager', json);
          return true;
        }
        else{
          return false;
        }
      }).catch((err)=>{
        if(err.message != "Unexpected end of JSON input"){
          commit('error', {
            title: '网络错误',
            message: '您的网络无法正常连接到服务器，请联系网络维护人员进行检查'
          });
          return false;
        }
      })
   }
 }
}
