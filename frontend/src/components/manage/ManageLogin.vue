<template>
  <div class="cover">
    <div class="modal">
      <img src="../../assets/origin_logo.png">
      <h1>中心管理系统登录</h1>
      <el-form :model="loginForm" :rules="loginFormRules" label-width="0px"
        class="loginForm" ref="loginForm" v-loading="loading" element-loading-text="登录中，请稍候">
        <el-form-item prop="account" :error="errors.account">
          <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="请输入账号" icon="user"></el-input>
        </el-form-item>
        <el-form-item prop="password" :error="errors.password">
          <el-input :type="passwordState" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码" :icon="passwordIcon" :on-icon-click="handlePasswordIconClick"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageLogin',
   data() {
      let validateAccount = (rule, value, callback)=>{
        if(this.accountError){
          callback(new Error(this.accountError));
        }
        this.accountError = "";
      }
      let validatePassword = (rule, value, callback)=>{
        console.log(this.passwordError);
        if(this.passwordError){
          callback(new Error(this.passwordError));
        }
        this.passwordError = "";
      }
      return {
        loginForm: {
          account: '',
          password: '',
          substationId: 0
        },
        errors:{
          account: "",
          password: ""
        },
        loading: false,
        passwordIcon: "password-hide",
        loginFormRules: {
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
    computed:{
      passwordState(){
        return this.passwordIcon == 'password-hide' ? 'password' : 'text';
      }
    },
    methods: {
      submitForm(formName) {
        this.errors.account = "";
        this.errors.password = "";
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('systemManagerLogin', this.loginForm)
              .then((ret)=>{
                if(typeof ret == 'boolean' && ret){
                  this.$router.push("/orders");
                }else if(ret.invalidKey){
                  this.errors[ret.invalidKey] = ret.errorInfo;
                }
                this.loading = false;
              })
          } else {
            return false;
          }
        });
      },
      handlePasswordIconClick(){
        this.passwordIcon = this.passwordIcon == 'password-hide' ? 'password-show' : 'password-hide';
      }
    },
    mounted(){
      this.$store.dispatch('checkSystemManagerLogged')
        .then((ret)=>{
          if(ret){
            if(typeof ret == 'boolean'){
              this.$router.push("/orders");
            }else if(ret.errorInfo){
              this.$notify.error({
                title: '抱歉！这里可能出了一些错误',
                message: json.errorInfo
              });
            }
          }
        });
    }
  }
</script>

<style scoped>
  img{
    margin-top: 10px;
    width: 150px;
  }
  h1{
    margin-top: 10px;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif
  }
  .cover{
    position: fixed;
    display: flex;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #e5e5e5;
    z-index: 999;
  }
  .modal{
    margin: auto;
    background: #fff;
    width: 40%;
    padding: 10px;
    text-align: center;
    box-shadow: 2px 5px 10px #ccc;
  }
  .loginForm{
    width: 70%;
    margin: auto;
    margin-top: 20px;
  }
</style>
