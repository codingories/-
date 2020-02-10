<template>
  <div class="app-container">
    <h2>{{ title }}</h2>
    <el-table
      ref="multipleTable"
      :data="gradeInfoTable"
      style="width: 100%"
      @selection-change="handleSelection"
    >
      <el-table-column prop="choose" label="选择" type="selection"/>
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="gradename" label="年级名称"/>
      <el-table-column prop="ifGraduation" label="是否毕业年"/>
      <el-table-column prop="handle" label="操作" width="230">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="addMenus(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="success" @click="EditMenu(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="DeleteMenu(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary">增加</el-button>

    <div class="block">
      <span class="demonstration">翻页</span>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 100]"
        :page-size="10"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- @click="addRoles" -->
    <el-button v-if="hasPermission('增加')" type="primary">增加</el-button>
    <el-button v-if="hasPermission('修改')" type="success" @click="editUsers">编辑</el-button>
    <!-- @click="deleteRoles" -->
    <el-button v-if="hasPermission('删除')" type="info">删除</el-button>
    <el-dialog :visible.sync="editUsersShow" :before-close="handleClose" title="编辑用户" width="700px">
      <!-- <h4>{{ruleForm}}</h4> -->
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- :inline="true" -->

        <el-form-item label="姓名" prop="personName" class="setInline">
          <el-input v-model="ruleForm.personName" placeholder="请填写姓名"/>
        </el-form-item>
        <el-form-item label="工号" prop="JobNumber" class="setInline">
          <el-input v-model="ruleForm.JobNumber" placeholder="请填写工号"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" class="setInline">
          <el-input v-model="ruleForm.phone" placeholder="请填写手机号"/>
        </el-form-item>
        <el-form-item label="部门" prop="dept" class="setInline">
          <el-select v-model="ruleForm.dept_id" placeholder="请选择部门">
            <el-option
              v-for="(i,index) in deptList"
              :label="i.dept_name"
              :value="i.id"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="setInline">
          <el-input v-model="ruleForm.password" placeholder="请填写密码"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" class="setInline">
          <el-input v-model="ruleForm.confirmPassword" placeholder="请重复填写密码"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender" class="setInline">
          <el-radio v-model="ruleForm.gender" label="1">男</el-radio>
          <el-radio v-model="ruleForm.gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="状态" prop="status" class="setInline ActiveStatus">
          <el-radio v-model="ruleForm.status" label="激活">激活</el-radio>
          <el-radio v-model="ruleForm.status" label="冻结">冻结</el-radio>
        </el-form-item>
      </el-form>

      <el-button type="success" @click="cancelDiag('editUsersShow')">取消</el-button>
      <el-button type="primary" @click="confirmEditUsers('editUsersShow')">确认</el-button>
    </el-dialog>
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
import buttonpermission from '@/mixins/buttonpermission.js'

import store from '@/store'

export default {
  mixins: [buttonpermission],
  data() {
    return {
      name: 'Child1',
      title: '学制设置',
      buttonPermission: store.getters.buttonPermission,
      gradeInfoTable: [
        { id: 1, gradename: '小班', ifGraduation: '否' },
        { id: 2, gradename: '中班', ifGraduation: '否' },
        { id: 3, gradename: '大班', ifGraduation: '否' }
      ],
      attendancemap: {},
      rolemap: {},
      deptList: [],
      userid: '',
      username: '',
      role_id: [],
      dept_id: 0,
      position: '',
      attendance_group_id: '',
      ruleForm: {
        personName: '',
        JobNumber: '',
        phone: '',
        dept_id: '',
        password: '',
        confirmPassword: '',
        status: '',
        gender: '1',
        role: ''
      },
      rules: {
        status: [{ required: true, message: '选择状态', trigger: 'change' }],
        roles: [{ required: true, message: '选择角色', trigger: 'change' }],
        confirmPassword: [
          {
            required: true,
            // message: "请重复填写密码",
            trigger: 'change',
            validator: this.validatorRepeatPassword
          }
        ],
        password: [
          {
            required: true,
            message: '请填写密码',
            trigger: 'change'
          }
        ],
        personName: [
          { required: true, message: '请填写姓名', trigger: 'change' }
        ],
        JobNumber: [
          { required: true, message: '请填写工号', trigger: 'change' }
        ],
        phone: [{ required: true, message: '请填写工号', trigger: 'change' }],
        dept: [{ required: true, message: '请选择部门', trigger: 'change' }]
      },
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
    // buttonfunctionlist: function() {
    //   // for(let i of this.mocklist)
    //   let k;
    //   let title = this.tilte;
    //   for (let i of this.mocklist) {
    //     k = i.children.filter(v => v.title === this.title);
    //   }
    //   let buttonlist = k[0].children.map(v => v.title);
    //   return buttonlist;
    // }
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
    hasPermission(permission) {
      let flag = false
      for (const i of this.buttonfunctionlist) {
        if (i === permission) {
          flag = true
        }
      }
      return flag
    },
    getbuttonmenus() {
      const access_token = this.access_token
      const obj = { access_token }

      getMenus(obj).then(success => {
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
      getDpet(obj).then(res => {
        this.deptList = res.data
      })
    },
    confirmEditUsers(attr) {
      this.$confirm('确认提交？')
        .then(_ => {
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
          obj.role_id = []
          saveuserinfo(obj).then(success => {
            location.reload()
          })
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

    handleSelection(val) {
      this.checkedList = val
      if (this.checkedList.length === 1) {
        this.ruleForm.dept = this.checkedList[0].dept
        this.ruleForm.personName = this.checkedList[0].name
        this.ruleForm.JobNumber = this.checkedList[0].workno
        this.ruleForm.phone = this.checkedList[0].mobile
        // this.ruleForm.dept_id = this.checkedList[0].mobile;
        this.userid = this.checkedList[0].id
        this.username = this.checkedList[0].username

        this.role_id = this.checkedList[0].role.map(v => this.rolemap[v])
        this.ruleForm.attendance_group_id = this.checkedList[0].attendance_group

        const tempdept = this.checkedList[0].dept
        if (typeof tempdept === 'string') {
          this.ruleForm.dept_id = this.deptList.filter(
            v => v.dept_name === tempdept
          )[0].id
        }
        this.position = this.checkedList[0].position
      }
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
        // this.total = success.data.total;
        this.total = 10

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
<style scoped>
  .setInline {
    display: inline-block;
  }

  .ActiveStatus {
    margin-left: 45px;
  }
</style>
