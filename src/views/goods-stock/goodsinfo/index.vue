<template>
  <div class="outdiv">
    <el-container class="container">
      <category
        :editshow="editshow"
        :choose-flag="chooseFlag"
        class="categorystyle"
        @upedit="upedit"
        @upconfirmedit="upconfirmedit"
        @upcanceledit="upcanceledit"
      />
      <goods class="goodsstyle"/>
    </el-container>
  </div>
</template>

<script>
import {
  getUsers,
  getDpet,
  getRoles,
  getAttendance,
  saveuserinfo,
  getMenus
} from '@/api/UserManagement.js'
import Category from './components/category'
import Goods from './components/goods'
import buttonpermission from '@/mixins/buttonpermission.js'

import store from '@/store'

export default {

  components: {
    category: Category,
    goods: Goods
  },
  mixins: [buttonpermission],
  data() {
    return {
      chooseFlag: false,
      editshow: true,
      goodsTable: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      activeName: 'first',
      title: '物品基础管理',
      buttonPermission: store.getters.buttonPermission,

      attendancemap: {},
      rolemap: {},
      deptList: [],
      userid: '',
      username: '',
      role_id: [],
      dept_id: 0,
      position: '',
      attendance_group_id: '',

      total: 10,
      pageSizes: 10,
      pageSize: 10,
      currentPage: 1,
      userTableTitle: [
        { label: '选择', prop: 'choose', type: 'selection' },
        { label: 'id', prop: 'id' },
        { label: '年级名称', prop: 'gradename' },
        { label: '是否毕业年', prop: 'ifGraduation' },
        { label: '操作', prop: 'handle', type: 'selection' }
      ],
      access_token: store.getters.access_token,
      getUsersLoading: false,
      usersInfoTable: [],
      currentPage: 1,
      checkedList: [],
      editUsersShow: false
    }
  },

  computed: {
    tableHeader: function() {
      return this.getTableHeader(this.tableYear, this.tableMonth)
    }
  },
  watch: {},

  created() {
    this.getbuttonmenus()
    this.fetchUsersData()
    this.getRolesList()
    this.getAttendanceList()
    this.getDepartment()
  },

  methods: {
    upedit() {
      this.chooseFlag = true
      this.editshow = false
    },
    upconfirmedit() {
      this.editshow = true
      this.chooseFlag = false
    },
    upcanceledit() {
      this.editshow = true
      this.chooseFlag = false
    },
    handleDragStart(node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1
    },
    switchgood(tab, event) {
      console.log(tab, event)
    },
    hasPermission(permission) {
      console.log('permission')
      console.log(permission)
      const flag = false
      // for (let i of this.buttonfunctionlist) {
      //   console.log(i);
      //   if (i === permission) {
      //     flag = true;
      //   }
      // }
      return flag
    },
    getbuttonmenus() {
      const access_token = this.access_token
      const obj = { access_token }

      getMenus(obj).then(success => {
        console.log('getMenus')
        console.log(success.data)
        const controllist = success.data
      })
    },
    getAttendanceList() {
      const access_token = this.access_token
      const obj = { access_token }
      getAttendance(obj).then(success => {
        for (const i of success.data) {
          this.$set(this.attendancemap, i.name, i.id)
        }
      })
    },
    getRolesList() {
      const access_token = this.access_token
      const obj = { access_token }
      getRoles(obj).then(success => {
        for (const i of success.data) {
          this.$set(this.rolemap, i.name, i.id)
        }
      })
    },
    validatorRepeatPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请重复输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次密码输入不同'))
      }
    },
    editUsers() {
      console.log(123)
      if (this.checkedList.length === 0) {
        this.$alert('未勾选，请选择一个选项')
          .then(() => {
          })
          .catch(() => {
          })
      } else if (this.checkedList.length >= 2) {
        this.$alert('只能选择一个选项')
          .then(() => {
          })
          .catch(() => {
          })
      } else {
        this.editUsersShow = true
      }
    },
    getDepartment() {
      const obj = { access_token: this.access_token }
      console.log(obj)
      getDpet(obj).then(res => {
        this.deptList = res.data
      })
    },
    confirmEditUsers(attr) {
      this.$confirm('确认提交？')
        .then(_ => {
          console.log(_)
          console.log('1233211')
          // console.log(this.ruleForm);
          // console.log(this.userid);

          // console.log(this.ruleForm);
          const obj = {
            access_token: this.access_token,
            id: this.userid,
            username: this.username,
            name: this.ruleForm.personName,
            workno: this.ruleForm.JobNumber,
            gender: this.ruleForm.gender,
            mobile: this.ruleForm.phone,
            password: this.ruleForm.password,
            repassword: this.ruleForm.confirmPassword,
            role_id: this.role_id,
            dept_id: this.ruleForm.dept_id,
            attendance_group_id:
                this.attendancemap[this.ruleForm.attendance_group_id] || 0
          }
          // let role_id = this.role_id
          obj.role_id = []
          console.log(obj)

          // let obj = {
          //   access_token: this.access_token,
          //   id: this.userid,
          //   username: this.username,
          //   name: this.ruleForm.personName,
          //   dept_id: this.ruleForm.dept_id
          // };

          console.log('objobjobj1234')
          console.log(obj)
          // let obj = { id: 38, username: "guwq", dept_id: 9, name: "顾文取" };
          // obj.access_token = this.access_token;

          saveuserinfo(obj).then(success => {
            // console.log(success);
            location.reload()
          })
          // this[attr] = false;
        })
        .catch(_ => {
        })
    },
    cancelDiag(attr) {
      this.$confirm('确认取消？')
        .then(_ => {
          this[attr] = false
        })
        .catch(_ => {
        })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.usersInfoTable = []
      this.fetchUsersData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.usersInfoTable = []
      this.fetchUsersData()
    },
    fetchUsersData() {
      const access_token = this.access_token
      const access_token_obj = {
        access_token: this.access_token,
        page: this.currentPage,
        num: this.pageSize
      }

      console.log('access_token_obj->', access_token_obj)
      this.getUsersLoading = true

      const list = [
        'id',
        'username',
        'name',
        'workno',
        'email',
        'mobile',
        'wechat',
        'role',
        'dept',
        'attendance_group',
        'leave'
      ]

      getUsers(access_token_obj).then(success => {
        console.log('data----->')
        // this.total = success.data.total;
        this.total = 10
        console.log(this.pageSize)
        console.log(success.data.list)

        for (const i of success.data.list) {
          const obj = {
            id: '',
            username: '',
            name: '',
            workno: '',
            email: '',
            mobile: '',
            wechat: '',
            role: '',
            dept: '',
            attendance_group: '',
            leave: ''
          }
          for (const j of list) {
            obj[j] = i[j]
            if (i['leave'] === 0) {
              obj['leave'] = '在职'
            } else {
              obj['leave'] = '离职'
            }
          }
          this.usersInfoTable.push(obj)
        }
        this.getUsersLoading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .ActiveStatus {
    margin-left: 45px;
  }

  .header {
    /* border: 1px solid black; */
  }

  .innermain {
    /* border: 1px solid red; */
  }

  .container {
    border-top: 12px solid #f9f9f9;
    display: flex;
    justify-content: flex-start;
    /*overflow: auto;*/
    /*border: 1px solid black;*/
  }

  .main-container {
    /* border: 1px solid red; */
  }

  .outdiv {
    height: 95vh;
    background-color: #f9f9f9;
  }

  .categorystyle {
    /*border: 1px solid green;*/
    width: 500px;
  }

  .goodsstyle {
    /*width: 40vw;*/
    /*border: 1px solid black*/
    margin-left: 10px;
    margin-right: 10px;
    flex: 1;
    overflow: auto;
    box-shadow: 4px 5px 6px 0px rgba(182, 168, 168, 0.75);

  }
</style>
