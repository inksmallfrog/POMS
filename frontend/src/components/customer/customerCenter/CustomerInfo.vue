<!--
  个人信息修改页
-->
<template>
  <el-form :model="userInfo" class="infoForm" label-width="100px" v-loading="loading" element-loading-text="数据提交中，请稍候">
    <h1>个人信息设置</h1>
    <el-form-item label="昵称">
      <el-input v-model="userInfo.nickname"></el-input>
    </el-form-item>
    <el-form-item label="头像">
      <el-upload action="/api/v1/util/pictures" :with-credentials="true" accept=""
        :on-success="handlePicUpload">
        <el-button size="small" type="primary">点击上传</el-button>
        <img :src="userInfo.avator" class="avator">
      </el-upload>
    </el-form-item>
    <el-form-item label="姓名(公司名)">
      <el-input v-model="userInfo.realname"></el-input>
    </el-form-item>
    <el-form-item label="联系方式">
      <el-input v-model="userInfo.phone"></el-input>
    </el-form-item>
    <el-form-item label="邮编">
      <el-input v-model="userInfo.postNumber"></el-input>
    </el-form-item>
    <el-form-item label="升级用户">
      <el-select v-model="userInfo.customerTypeId" @change="showChangeCustomerTypeModal">
        <el-option v-for="customerType in customerTypes" value-key="id"
          :key="customerType.id"
          :label="customerType.name"
          :value="customerType.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-collapse v-model="activeNames">
      <el-collapse-item title="地址" name="address">
          <el-button @click="onNewAddress" class="addAddrBtn">新增收报地址</el-button>
          <el-table :data="deliverAddresses">
            <el-table-column
              prop="receiver"
              label="收件人">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="联系方式">
            </el-table-column>
            <el-table-column
              prop="detailAddress"
              label="详细地址">
            </el-table-column>
            <el-table-column
              label="操作">
              <template scope="scope">
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
                <el-button v-popover:deletePopover class="inTableBtn" type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-collapse-item>
      <el-collapse-item title="高级选项" name="professional">
        <el-form-item label="注销用户">
          <el-button type="danger" @click="dropUser">注销</el-button>
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
    <el-button @click="submitForm" type="primary">保存</el-button>
    <el-dialog title="升级用户" :visible.sync="isUpgrading">
      <CustomerTypeChangeModal :targetCustomerTypeId="userInfo.customerTypeId"
        :loading="upgradeCustomerTypeLoading"
        :onUpgrade="onUpgrade">
      </CustomerTypeChangeModal>
    </el-dialog>
    <el-dialog title="地址编辑" :visible.sync="isAddressEditting" @close="addressData={}">
      <AddressModal
        :edittingData="addressData"
        :loading="addressLoading"
        :errors="addressErrors"
        :onSubmit="onAddressSubmit">
      </AddressModal>
    </el-dialog>
  </el-form>
</template>

<script>
//修改客户类型对话框
import CustomerTypeChangeModal from '@/components/customer/customerCenter/CustomerTypeChangeModal'
//地址编辑对话框
import AddressModal from '@/components/customer/customerCenter/AddressModal'

export default{
  name: 'CustomerInfo',
  components:{
    CustomerTypeChangeModal,
    AddressModal
  },
  data(){
    return{
      //编辑的地址
      addressData: null,
      //地址加载动画
      addressLoading: false,
      //地址填写错误
      addressErrors: {},
      //地址对话框显示状态
      isAddressEditting: false,
      //地址删除的删除提示显示状态数组
      deletePopoverState: [],

      //当前激活的展开面板
      activeNames: ['address'],

      //用户更新加载动画
      upgradeCustomerTypeLoading: false,
      //用户更新对话框显示状态
      isUpgrading: false,

      //用户信息数据，拷贝自$store.state.customres.customer
      userInfo:{},

      //个人信息提交动画
      loading: false
    }
  },
  computed:{
    customerTypes(){
      return this.$store.state.customers.customerTypes;
    },
    customer(){
      return this.$store.state.customers.customer;
    },
    deliverAddresses(){
      return this.$store.state.customers.deliverAddresses;
    }
  },
  methods:{
    submitForm(){
      this.loading = true;
      this.$store.dispatch('updateResource', {resourceName: 'customers', data:this.userInfo})
        .then((res)=>{
          if(typeof res == "boolean" && res){
            this.$store.commit('setCustomer', this.userInfo);
            alert('修改成功');
          }
          this.loading = false;
        })
    },
    handlePicUpload(res){
      if(res && !res.hasError){
        this.userInfo.avator = res.file;
      }
    },
    onAddressSubmit(formData){
      if(formData.id > 0){
        this.updateAddress(formData);
      }else{
        this.createAddress(formData);
      }
    },
    onNewAddress(){
      this.addressData = {};
      this.isAddressEditting = true;
    },
    onDeleteAddress(data){
      this.deleteAddress(data);
    },
    onUpgrade(){
      if(this.userInfo.customerTypeId != this.customer.customerTypeId){
        let data = _.cloneDeep(this.customer);
        data.customerTypeId = this.userInfo.customerTypeId;
        this.upgradeCustomerTypeLoading = true;
        this.$store.dispatch('updateResource', {resourceName:'customers', data:data})
          .then((res)=>{
            if(typeof res == "boolean" && res){
              this.$store.commit('setCustomer', data);
            }else{
              this.upgradeCustomerTypeLoading = false;
              this.isUpgrading = false;
              this.userInfo.customerTypeId = this.customer.customerTypeId;
            }
          })
      }
    },
    showChangeCustomerTypeModal(){
      if(this.userInfo.customerTypeId != this.customer.customerTypeId){
        this.isUpgrading = true;
      }
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
    onDelete(data){
      let addressIndex = this.deliverAddresses.findIndex((address)=>{
        return address.id == data.id;
      })
      this.$store.dispatch('deleteResource', {resourceName: 'deliverAddresses', data:data})
        .then((res)=>{
          if(typeof res == 'boolean' && res){
            let addresses = this.deliverAddresses;
            addresses.splice(addressIndex, 1);
            this.$store.commit('setDeliverAddresses', addresses);
          }
        })
    },
    createAddress(form){
      form.customerId = this.customer.id;
      this.addressLoading = true;
      this.$store.dispatch('createResource', {resourceName: 'deliverAddresses', data: form})
        .then((json)=>{
          this.addressLoading = false;
          if(!json.hasError){    //创建成功
            this.$store.commit('addToDeliverAddresses', json.entity);
            this.isAddressEditting = false;
          }
          else if(json.hasError && json.invalidKey){  //输入错误
            console.assert(this.errors[json.invalidKey])
            this.errors[json.invalidKey] = json.errorInfo;
          }
        })
    },
    updateAddress(form){
      this.submitLoading = true;
      this.$store.dispatch('updateResource', {resourceName: 'deliverAddresses', data: form})
        .then((json)=>{
          this.submitLoading = false;
          let dataIndex = this.deliverAddresses.findIndex((data) => {
            return data.id == form.id
          });
          if(!json.hasError){    //更新成功
            let newAddressList = this.deliverAddresses;
            newAddressList[dataIndex] = _.cloneDeep(form);
            this.$store.commit('setDeliverAddresses', newAddressList);
            this.isEditting = false;
          }
          else if(json.hasError && json.invalidKey){  //输入错误
            console.assert(this.errors[json.invalidKey])
            this.errors[json.invalidKey] = json.errorInfo;
          }
        })
    },
    deleteAddress(form){
      this.dataLoading = true;
      //获取被删除数据在数据源中的下标
      let dataIndex = this.deliverAddresses.findIndex((data) => {
        return data.id == form.id
      });
      this.$store.dispatch('deleteResource', {resourceName: this.resourceName, data: form})
        .then((json)=>{
          if(!json.hasError){
            //从数据源中删除数据
            let newAddressList = this.deliverAddresses;
            newAddressList.splice(dataIndex, 1);
            this.$store.commit('setDeliverAddresses', newAddressList)
          }
          this.dataLoading = false;
        })
    },
    dropUser(){
      this.$store.dispatch('deleteResource', {resourceName:'customers', data:this.customer})
        .then((res)=>{
          this.$store.commit('setCustomer', null);
          this.$router.replace("/");
        })
    }
  },
  watch:{
    '$store.state.customers.customer': function(){
      this.userInfo = _.cloneDeep(this.$store.state.customers.customer);
    }
  },
  mounted(){
    if(!this.$store.state.customers.customer){
      this.$router.replace("/");
    }
    this.userInfo = _.cloneDeep(this.$store.state.customers.customer);
  }
}
</script>

<style scoped>
  h1{
    margin-left: 100px;
    margin-bottom: 20px;
  }
  .infoForm{
    padding: 20px;
    width: 80%;
  }
  .el-input{
    max-width: 300px;
  }
  img{
    display: inline-block;
  }
  .el-collapse{
    border: none;
    background-color: #eee;
  }
  .el-collapse-item__content{
    padding: 0;
  }
  .addressTable .addAddrBtn{
    margin-bottom: 10px;
  }
  .address div{
    display: inline-block;
  }
  .avator{
    border-radius: 100%;
    width: 40px;
    height: 40px;
    display: block;
  }
</style>
