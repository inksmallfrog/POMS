/*
* @Author: inksmallfrog
* @Date:   2017-08-12 14:18:29
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-08-17 21:08:35
*/

'use strict';
import parseUrlContent from '../util/util.js';
let urlPrefix = '';
//urlPrefix = 'http://127.0.0.1:8080';
urlPrefix = '';
export default {
  state:{
    isCustomerModalShow: false,
    customerModalState: {
      isLoggin: true
    },
    customer: null/*{
      id: 1,
      customerTypeId: 1,
      customerTypeName: '穷酸用户',
      discount: 0.8,
      nickname: 'test',
      realname: 'testReal',
    }*/,
    deliverAddresses: null/*[
      {
        id: 1,
        receiver: '哇哇',
        phone: '12312312312',
        detailAddress: '马王路牛头街三里庙武家村2号楼三单元201'
      },
      {
        id: 2,
        receiver: 'test',
        phone: '1231231232312',
        detailAddress: '马王路牛头街三里庙武家村2号楼三单元201'
      }
    ]*/,
    customerTypes: null/*[{
      id: 1,
      name: '穷酸用户'
    },{
      id: 2,
      name: '一般用户'
    },{
      id: 3,
      name: '土豪用户'
    }]*/,
    currentaPaper: null,
    favorites: null/*[{
        id: 1,                        //编号
        pbCompanyId: 1,               //报社编号
        pbCompanyName: '华中镖局报社',          //报社名称
        paperFrequencyType: 'monthly',    //报刊周期类型
        paperTypeId: 1,               //报刊类型编号
        paperTypeName: '报纸',               //报刊类型名
        paperNumber: 'APTX-4869',               //刊号
        publishTime: (new Date()),               //发行时间
        name: '华中神棍月报',                      //名称
        picture: "",                   //图片
        description: '华中好神棍,皆从此刊出',               //描述
        printPrice: 0.5,                //印刷价
        canUnsubscribe: 1,            //是否允许退订
        canChangeAddress: 1,          //是否允许转址
        state: 1,                     //状态
        singlePrice: 1,
        monthPrice: 30,
        yearPrice: 350,
      }]*/,
    shoppingCart: null/*[{
      pictuer: 'error',
      name: '报纸',
      startDate: new Date(),
      endingDate: a,
      startAndEnding: [new Date(), a],
      numberWanted: 20,
      singlePrice: 1,
      monthPrice: 30,
      yearPrice: 350,
      deliverAddressId: 1,
      deliverAddressDetail: '',
    }]*/,
  },
  mutations:{
    openCustomerModal(state, isLoggin){
      state.isCustomerModalShow = true;
      state.customerModalState = {
        isLoggin: isLoggin
      }
    },
    closeCustomerModal(state){
      state.isCustomerModalShow = false;
    },
    setCustomer(state, customer){
      state.customer = customer;
    },
    setCurrentPaper(state, paper){
      state.currentPaper = paper;
    },
    setCustomerTypes(state, customerTypes){
      state.customerTypes = customerTypes
    },
    setDeliverAddresses(state, deliverAddresses){
      state.deliverAddresses = deliverAddresses;
    },
    setFavorites(state, favorites){
      state.favorites = favorites;
    },
    addToFavorites(state, favorite){
      let favorites = _.cloneDeep(state.favorites);
      favorites.unshift(favorite);
      state.favorites = favorites;
    },
    setShoppingCart(state, shoppingCart){
      let _shoppingCart = []
      for(let item of shoppingCart){
        if(!item.startAndEnding){
          item.startAndEnding = [item.startDate, item.endingDate];
        }
        _shoppingCart.push(item);
      }
      state.shoppingCart = _shoppingCart;
    },
    addToShoppingCart(state, goods){
      if(!goods.startAndEnding){
        goods.startAndEnding = [goods.startDate, goods.endingDate]
      }
      let shoppingCart = _.cloneDeep(state.shoppingCart);
      shoppingCart.unshift(goods);
      state.shoppingCart = shoppingCart;
    },
    addToDeliverAddresses(state, deliverAddresses){
      state.deliverAddresses.push(deliverAddresses);
    },
  },
  actions: {
    quitCustomer({commit}){
      return fetch(`${urlPrefix}/api/v1/customers/quit`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
      }).then((res)=>{
        commit('setCustomer', null);
      })
    },
    checkCustomerExist({commit}, form){
      return fetch(`${urlPrefix}/api/v1/customers/hasAccount`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
        body: parseUrlContent(form)
      }).then((res)=>{
        return res.json();
      }).catch((err)=>{
        if(err.message != "Unexpected end of JSON input"){
          commit('error', {
            title: '网络错误',
            message: '您的网络无法正常连接到服务器，请联系网络维护人员进行检查'
          });
          return false;
        }
      })
    },
    hasLogged({commit, dispatch}){
      return fetch(`${urlPrefix}/api/v1/customers/hasLogged`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include'
      }).then((res)=>{
        return res.json();
      }).then((res)=>{
        if(res && res.entity){
          commit('setCustomer', res.entity);
          return dispatch('loadingCustomerRelative')
            .then((res)=>{
              return true;
            })
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
    },
    loggin({commit}, form){
      return fetch(`${urlPrefix}/api/v1/customers/loggin`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
        body: parseUrlContent(form)
      }).then((res)=>{
        return res.json()
      }).then((json)=>{
        json.invalidKey = json.invalidKeys;
        if(json.hasError && !json.invalidKey){
          commit('error', {
            title: '抱歉！这里可能出了一些错误',
            message: error.errorInfo
          })
        }
        else if(json.entity){
          commit('setCustomer', json.entity);
        }
        return json;
      })
      .catch((err)=>{
        commit('error', {
          title: '网络错误',
          message: '您的网络无法正常连接到服务器，请联系网络维护人员进行检查'
        });
        return {hasError: true};
      })
    },
    regist({commit}, form){
      return fetch(`${urlPrefix}/api/v1/customers/regist`, {
        method: 'POST',
        headers:{
          "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
        body: parseUrlContent(form)
      }).then((res)=>{
        return res.json()
      }).then((json)=>{
        if(json.invalidKeys){
          json.invalidKey = json.invalidKeys;
        }
        if(json.hasError && !json.invalidKey){
          commit('error', {
            title: '抱歉！这里可能出了一些错误',
            message: json.errorInfo
          })
        }
        else if(json.entity){
          commit('setCustomer', json.entity);
        }
        return json;
      })
      .catch((err)=>{
        commit('error', {
          title: '网络错误',
          message: '您的网络无法正常连接到服务器，请联系网络维护人员进行检查'
        });
        return {hasError: true};
      })
    },
    loadingBase({commit, dispatch}){
        return dispatch('queryAll', 'customerTypes')
          .then((res)=>{
            if(!res.hasError){
              commit('setCustomerTypes', res.entityList);
            }
            return null;
          });
    },
    loadingCustomerRelative({commit, dispatch}){
      let addressPromise =
        dispatch('queryAll', 'deliverAddresses')
          .then((res)=>{
            if(!res.hasError){
              commit('setDeliverAddresses', res.entityList);
            }
          });
      let shoppingCartPromise =
        dispatch('queryAll', 'shoppingCars')
          .then((res)=>{
            if(!res.hasError){
              commit('setShoppingCart', res.entityList);
            }
          });
      let favoritePromise =
        dispatch('queryAll', 'favorites')
          .then((res)=>{
            if(!res.hasError){
              commit('setFavorites', res.entityList);
            }
          });
      return Promise.all([favoritePromise, shoppingCartPromise, addressPromise]);
    }
  }
}
