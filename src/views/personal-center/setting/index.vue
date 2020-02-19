<template>
  <div class="dashboard-container">
    <el-form>
      <el-form-item label="账号">
        <el-input
          v-model="username"
          :disabled="true"
          class="inputstyle"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input
          v-model="personName"
          :disabled="isDisable"
          class="inputstyle"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="电话">
        <el-input
          v-model="phone"
          :disabled="isDisable"
          class="inputstyle"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="旧密码">
        <el-input
          v-model="oldPassword"
          :disabled="isDisable"
          type="password"
          class="inputstyle"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input
          v-model="newPassword"
          :disabled="isDisable"
          type="password"
          class="inputstyle"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="重复密码">
        <el-input
          v-model="repeatPassword"
          :disabled="isDisable"
          type="password"
          class="inputstyle"
          size="medium"
        />
      </el-form-item>
<!--      <el-form-item label="微信">-->
<!--        <el-input-->
<!--          :disabled="isDisable"-->
<!--          class="inputstyle"-->
<!--          size="medium"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="性别">
        <!-- <el-input v-model="sex" :disabled="isDisable" class="inputstyle" size="medium"></el-input> -->
        <el-radio-group v-model="sex" :disabled="isDisable">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="changeStatus">编辑</el-button>
    <el-button type="success" @click="confirmData">确认</el-button>
    <el-button type="warning" @click="cancelData">取消</el-button>

    <!-- <el-input v-model="username" class="inputstyle" placeholder="用户名" size="medium" width="200px"></el-input> -->
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import {
  getPersonalInfo,
  editUserInfo,
  changePassword,
  getInfo
} from '@/api/personalCenter'

export default {
  name: 'Dashboard',
  data() {
    return {
      access_token: store.getters.access_token,
      // userID: store.getters.userID,
      isDisable: true,
      username: '',
      email: '',
      personName: '',
      phone: '',
      sex: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      oldPassword: '',
      newPassword: '',
      repeatPassword: ''
    }
  },
  computed: {
    // ...mapGetters(['name', 'userID', 'token'])
    ...mapGetters(['name', 'userID'])

  },
  created() {
    this.fetchPersonal()
    console.log('rrr')
    // this.useGetInfo()
  },
  methods: {
    useGetInfo() {
      const access_token = this.access_token
      console.log('access_token')
      console.log(access_token)
      const obj = { access_token }
      getInfo(obj).then(
        res => {
          console.log('res')
          console.log(res)
        }
      )
    },
    fetchPersonal() {
      const user_id = this.userID
      const access_token = this.access_token
      getPersonalInfo(user_id, access_token).then(
        success => {
          console.log(success)
          this.username = success.data.username
          this.email = success.data.email
          this.personName = success.data.name
          this.sex = success.data.gender
          this.phone = success.data.mobile
        },
        err => {
          console.log(err)
        }
      )
    },
    changeStatus() {
      this.isDisable = false
    },
    confirmData() {
      this.isDisable = true
      console.log(this.access_token)
      console.log(this.username)
      console.log(this.phone)
      console.log(this.sex)
      const obj = {
        access_token: this.access_token,
        name: this.personName,
        mobile: this.phone,
        gender: this.sex
      }
      editUserInfo(obj).then(
        success => {
          console.log(success)
        },
        fail => {
          console.log(fail)
        }
      )
      const obj1 = {
        access_token: this.access_token,
        old_password: this.oldPassword,
        new_password: this.newPassword
      }
      if (this.repeatPassword !== this.newPassword) {
        alert('两次密码不同')
      } else {
        changePassword(obj1).then(
          resolve => {
            alert('修改成功')
          },
          reject => {
            alert('出错，请重新输入')
          }
        )
      }
    },
    cancelData() {
      this.isDisable = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .inputstyle {
    width: 330px;
  }
</style>
