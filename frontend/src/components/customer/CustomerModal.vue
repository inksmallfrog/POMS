<script>
  /*
   * 用户登录对话框
   */
</script>

<template>
  <div class="box" @click.stop>
    <header class="switcher">
      <button class="leftSwitcher" @click.prevent="isLoggin = true" :class="{active: isLoggin}">
        登陆
        <span class="leftSwitcherArrow" :class="{active: isLoggin}"></span>
      </button>

      <button class="rightSwitcher" @click.prevent="isLoggin = false" :class="{active: !isLoggin}">
        注册
        <span class="rightSwitcherArrow" :class="{active: !isLoggin}"></span>
      </button>
    </header>
    <el-form :class="{active: isLoggin, logginForm:true}"
      :model="logginForm"
      :rules="logginFormRules"
      v-loading="logginLoading"
      element-loading-text="登录中，请稍候"
      label-width="0px" class="form" ref="logginForm">
      <el-form-item prop="account" :error="logginErrors.account">
        <el-input type="text" v-model="logginForm.account" auto-complete="off" placeholder="请输入账号" icon="user"></el-input>
      </el-form-item>
      <el-form-item prop="password" :error="logginErrors.password">
        <el-input :type="logginPasswordState" v-model="logginForm.password" auto-complete="off" placeholder="请输入密码" :icon="logginPasswordIcon" :on-icon-click="handleLogginPasswordIconClick"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('logginForm')">登录</el-button>
      </el-form-item>
    </el-form>

    <el-form :class="{active: !isLoggin, registForm:true}"
      :model="registForm"
      :rules="registFormRules"
      v-loading="registLoading"
      element-loading-text="注册中，请稍候"
      label-width="0px" class="form" ref="registForm">
      <el-form-item prop="account" :error="registErrors.account">
        <el-input type="text" v-model="registForm.account"
          auto-complete="off" placeholder="请输入账号"
          icon="user" @blur="isAccountExist"></el-input>
      </el-form-item>
      <el-form-item prop="password" :error="registErrors.password">
        <el-input :type="registPasswordState" v-model="registForm.password" auto-complete="off" placeholder="请输入密码" :icon="registPasswordIcon" :on-icon-click="handleRegistPasswordIconClick"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('registForm')">注册</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'CustomerModal',
  props:{
    state: Object,
    default: true
  },
  data(){
    return {
      isLoggin: this.state.isLoggin,

      logginLoading: false,
      registLoading: false,

      logginForm:{

      },
      registForm:{

      },
      logginErrors:{

      },
      registErrors:{

      },
      logginPasswordIcon: "password-hide",
      registPasswordIcon: "password-hide",
      logginFormRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少为6个字符', trigger: 'blur' }
        ]
      },
      registFormRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少为6个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    logginPasswordState(){
      return this.logginPasswordIcon == 'password-hide' ? 'password' : 'text';
    },
    registPasswordState(){
      return this.registPasswordIcon == 'password-hide' ? 'password' : 'text';
    },
  },
  methods: {
    isAccountExist(value){
      this.$store.dispatch('checkCustomerExist', this.logginForm)
        .then((res)=>{
          if(res && res.hasAccount){
            this.registErrors.account = '该账号已被占用';
          }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.logginErrors = {
            account: "",
            password: ""
          }
          if(formName == 'logginForm'){
            this.logginLoading = true;
            this.$store.dispatch('loggin', this.logginForm)
              .then((error)=>{
                this.logginLoading = false;
                if(error && error.invalidKey){
                  let errors = {};
                  errors[error.invalidKey] = error.errorInfo;
                  this.logginErrors = errors;
                }else if(!error || !error.hasError){
                  this.$store.dispatch('loadingCustomerRelative')
                    .then((res)=>{
                      if(!res.hasError){
                        this.$store.commit('closeCustomerModal');
                      }
                      else if(res.invalidKey){
                        this.logginErrors[res.invalidKey] = res.errorInfo;
                      }
                    })
                }
            })
          }
          else if(formName == 'registForm'){
            this.registErrors = {
              account: ""
            }
            this.registLoading = true;
            this.registForm.customerTypeId = this.$store.state.customers.customerTypes[0].id;
            this.$store.dispatch('regist', this.registForm)
              .then((res)=>{
                this.logginLoading = false;
                if(res.hasError && res.invalidKey){
                  let errors = {};
                  errors[res.invalidKey] = res.errorInfo;
                  this.registErrors = errors;
                }else if(res.entity){
                  this.$store.dispatch('loadingCustomerRelative')
                    .then((res)=>{
                      if(!res.hasError){
                        this.$store.commit('closeCustomerModal');
                      }
                    })
                }
            })
          }
        } else {
          return false;
        }
      });
    },
    handleLogginPasswordIconClick(){
      this.logginPasswordIcon = this.logginPasswordIcon == 'password-hide' ? 'password-show' : 'password-hide';
    },
    handleRegistPasswordIconClick(){
      this.registPasswordIcon = this.registPasswordIcon == 'password-hide' ? 'password-show' : 'password-hide';
    }
  }
};
</script>

<style scoped>
  .box{
    position: relative;
    margin: auto;
    width: 40%;
    height: 350px;
    background: white;
    border-radius: 2px;
    overflow-x: hidden;
  }
  header{
    margin-bottom: 25px;
    height: 90px;
  }
  .switcher{
    position: relative;
    background: green;
  }
  .switcher button{
    position: absolute;
    font-size: 1.8rem;
    width: 30%;
    height: 100%;
    background: #eee;
    border: none;
    outline: none;
    cursor: pointer;
    transition: width .5s, color .5s;
  }
  .leftSwitcher{
    left: 0;
  }
  .rightSwitcher{
    right: 0;
  }
  .leftSwitcher.active,
  .rightSwitcher.active{
    width: 70%;
    background: #20A0FF;
    color: white;
  }
  .leftSwitcherArrow.active{
    top: 0;
    right: -90px;
    border-top: transparent 45px solid;
    border-bottom: transparent 45px solid;
    border-left: #20A0FF 45px solid;
    border-right: transparent 45px solid;
  }
  .rightSwitcherArrow.active{
    top: 0;
    left: -90px;
    border-top: transparent 45px solid;
    border-bottom: transparent 45px solid;
    border-right: #20A0FF 45px solid;
    border-left: transparent 45px solid;
  }
  .leftSwitcherArrow,
  .rightSwitcherArrow{
    position: absolute;
    z-index: 10;
    border-top: transparent 10px solid;
    border-bottom: transparent 10px solid;
    border-left: #eee 0px solid;
    border-right: #eee 0px solid;
    transition: right .5s, left .5s;
    pointer-events: none;
  }
  form{
    position: absolute;
    width: 100%;
    text-align: center;
    transition: left .5s, right .5s;
  }
  .logginForm{
    left: -100%;
  }
  .active.logginForm{
    left: 0;
  }
  .registForm{
    right: -100%;
  }
  .active.registForm{
    right: 0;
  }
  .submitBtn{
    margin-top: 20px;
    cursor: pointer;
    padding: 5px 30px;
    font-size: 1.5rem;
    background: #ddd;
    border: none;
    outline: none;
  }
  .form{
    width: 80%;
    margin: 30px 10% 0 10%;
  }
</style>
