<template>
  <div>
    <header class="header">部门管理</header>
    {{ departmentData }}
    <!--    {{leaderList}}-->
    <hr>
    {{ chooseDepartmentMember.member }}
    <!--    {{ leaderList }}-->
    <!--    {{managerList}}-->
    <!--    <hr>-->
    <!--    {{memberList}}-->
    <!--    <hr>-->
    <!--    {{leaderList}}-->
    <el-button type="primary" class="addDepartment" @click="addDepartment">添加部门</el-button>

    <el-table
      :data="departmentData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all>
      <el-table-column
        prop="dept_name"
        label="部门"
        width="180"/>
      <el-table-column
        prop="director"
        label="部门负责人"
        width="180">
        <!--        director-->
        <template slot-scope="scope">
          <div @click="toggleLeaderShowFlag(scope.$index, scope.row)">
            {{ scope.row.director ? scope.row.director.name: '无' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="setDepartmentManagerFormForm"
        label="部门管理人">
        <template slot-scope="scope">
          <div @click="toggleManagerShowFlag(scope.$index, scope.row)">{{ dealManager(scope.row.manager) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="departmentMember"
        label="部门成员">
        <template slot-scope="scope">
          <div @click="toggleMemberShowFlag(scope.$index, scope.row)">{{ dealUserList(scope.row.user_list) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editDepartmentRow(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteDepartment(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :before-close="handleClose"
      :visible.sync="chooseLeaderFlag"
      title="选择负责人"
      width="30%">
      <section class="leaderListWrapper">
        <el-form :model="nameForm" label-width="100px" >
          <el-form-item prop="type">
            <el-radio-group v-model="nameForm.leader" class="leaderList">
              <el-radio v-for="(item,i) in leaderList" :key="i" :label="item.id" class="leaderName">
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseLeaderFlag = false">取 消</el-button>
        <el-button type="primary" @click="setDepartmentLeader">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :before-close="handleClose"
      :visible.sync="chooseManagerFlag"
      title="选择部门管理人"
      width="30%">
      <section class="leaderListWrapper">
        <el-form :model="setDepartmentManagerForm" label-width="100px" >
          <el-form-item label="部门管理人" prop="type">
            <el-checkbox-group v-model="setDepartmentManagerForm.manager" class="managerList">
              <el-checkbox v-for="(item,i) in managerList" :key="i" :label="item.id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseManagerFlag = false">取 消</el-button>
        <el-button type="primary" @click="setDepartmentManager">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :before-close="handleClose"
      :visible.sync="chooseMemberFlag"
      title="选择部门成员"
      width="30%">
      <section class="leaderListWrapper">
        <el-form :model="departmentMember" label-width="100px" >
          <el-form-item label="部门成员" prop="type">
            <el-checkbox-group v-model="chooseDepartmentMember.member" class="managerList">
              <el-checkbox v-for="(item,i) in memberList" :key="i" :label="item.id"> {{ item.name }} </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseMemberFlag = false">取 消</el-button>
        <el-button type="primary" @click="setDepartmentMember">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="addDepartmentDialogFlag"
      :before-close="handleClose"
      title="添加部门"
      width="30%">
      <el-form ref="addDepartmentForm" :model="addDepartmentForm" :rules="addDepartmentFormRules" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addDepartmentForm.name"/>
        </el-form-item>
        <!--        <el-form-item label="上级部门" prop="higherOffice">-->
        <!--          <el-select v-model="addDepartmentForm.higherOffice" placeholder="请选择上级部门">-->
        <!--            <el-option v-for="(item, i) in higherOfficeList" :key="i" :label="item.dept_name" :value="item.id"/>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->

        <!--        <el-form-item label="部门主管" prop="higherOffice">-->
        <!--          <el-select v-model="addDepartmentForm.higherOffice" placeholder="请选择部门主管">-->
        <!--            <el-option v-for="(item, i) in departmentData" :key="i" :label="item.dept_name" value="item.id"/>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDepartmentDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddDepartment">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editDialogVisible"
      :before-close="handleClose"
      width="30%">
      {{ editDepartmentForm }}

      <el-form ref="editDepartmentForm" :model="editDepartmentForm" :rules="editDepartmentFormRules" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="editDepartmentForm.name"/>
        </el-form-item>
        <el-form-item label="上级部门" prop="higherOffice">
          <el-select v-model="editDepartmentForm.higherOffice" placeholder="请选择上级部门">
            <el-option v-for="(item, i) in higherOfficeList" :key="i" :label="item.dept_name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="xxx">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { getDepList, getUserList, saveDepartment, delDepartment } from '@/api/deptManage'
import store from '@/store'

export default {
  data() {
    return {
      editDepartmentForm: {
        name: '',
        higherOffice: ''
      },
      editDialogVisible: false,
      higherOfficeList: [],
      addDepartmentForm: {
        name: '',
        higherOffice: ''
      },
      editDepartmentFormRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      },
      addDepartmentFormRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        higherOffice: [
          { required: false, message: '请选择上级部门', trigger: 'change' }
        ]
      },
      addDepartmentDialogFlag: false,
      access_token: store.getters.access_token,
      director_id: '',
      id: '',
      dept_name: '',
      nameForm: {
        leader: 1
      },

      setDepartmentManagerForm: {
        manager: []
      },
      chooseDepartmentMember: {
        member: []
      },
      departmentMember: {
        member: []
      },
      chooseLeaderFlag: false,
      chooseManagerFlag: false,
      chooseMemberFlag: false,
      dialogFormVisible: false,
      leaderList: [],
      managerList: [],
      memberList: [],
      formLabelWidth: '120px',
      tempId: 0,
      departmentData: [
      ]
    }
  },
  created() {
    this.useGetDepList()
    this.useGetUserList()
  },
  methods: {
    xxx() {
      const obj = {}
      obj.access_token = this.access_token
      console.log(this.editDepartmentForm)
      obj.pid = this.editDepartmentForm.higherOffice
      console.log(obj)
      saveDepartment(obj).then(res => {
        this.$alert('保存成功')
        location.reload()
      }).catch(
        err => {
          this.$alert(err)
        }
      )
    },
    editDepartmentRow(index, row) {
      console.log('editDepartmentRow')
      console.log(index, row)
      console.log(row.dept_name)

      // if(!!row.children.length){
      //   this.editDepartmentRow.higherOffice =
      // }

      this.editDepartmentForm.name = row.dept_name
      // editDepartmentForm.higherOffice
      this.editDialogVisible = true
    },
    confirmAddDepartment() {
      const obj = {}
      obj.access_token = this.access_token
      obj.dept_name = this.addDepartmentForm.name
      // obj.pid = this.addDepartmentForm.higherOffice
      // console.log(this.addDepartmentForm.higherOffice)
      this.$refs['addDepartmentForm'].validate((valid) => {
        if (valid) {
          saveDepartment(obj).then(res => {
            this.$alert('请求成功')
            this.addDepartmentDialogFlag = false
            location.reload()
          }).catch(
            err => {
              this.$alert('请求失败')
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
      console.log('obj')
      console.log(obj)
    },
    addDepartment() {
      console.log('xx')
      this.addDepartmentDialogFlag = true
    },
    deleteDepartment(index, row) {
      console.log('删除')
      // console.log(index, row.id)
      const obj = {}
      obj.access_token = this.access_token
      obj.dep_id = row.id
      delDepartment(obj).then(
        res => {
          console.log('delete success')
          this.$alert('删除成功')
          location.reload()
        }
      ).catch(
        err => {
          console.log('delete fail')
          this.$alert(err)
        }
      )
      //   .catch()
    },
    useGetUserList() {
      console.log('==---===')
      const list = []
      const obj = {}
      obj.access_token = this.access_token
      getUserList(obj).then(
        res => {
          console.log(res.data)
          res.data.forEach(v => {
            // console.log(v.children)
            list.push(...v.children)
            // console.log(list)
          })
          // console.log(list)
          this.leaderList = list
          this.managerList = list
          this.memberList = list
          // this.managerList = list
          console.log('lkjhggfdas')
          console.log(this.managerList)

          // this.memberList = list
        },
      )
    },
    dealManager(manager) {
      if (manager) {
        return manager.map(v => v.name).join(',')
      } else {
        return '无'
      }
    },
    dealUserList(userList) {
      let str = ''
      if (userList) {
        userList.forEach(v => {
          str += v.name + ','
        })
      }
      return str || '无'
    },
    useGetDepList() {
      const obj = {}
      obj.access_token = this.access_token
      getDepList(obj).then(
        res => {
          console.log('useGetDepList')
          console.log(res.data)
          this.departmentData = res.data
          // this.managerList = res.data
          this.higherOfficeList.push({ id: 0, dept_name: '无' })
          this.higherOfficeList.push(...this.departmentData)
        }
      )
    },
    toggleLeaderShowFlag(index, row) {
      console.log(index, row)
      this.id = row.id
      this.director_id = row.director_id
      // this.dept_name = row.dept_name
      // this.director_id = row.director_id

      if (row.director_id) {
        this.$set(this.nameForm, 'leader', row.director_id)
      } else {
        this.$set(this.nameForm, 'leader', 0)
      }
      this.tempId = row.id
      this.chooseLeaderFlag = true
    },
    toggleManagerShowFlag(index, row) {
      console.log(index, row)
      // console.log()
      this.setDepartmentManagerForm.manager = []
      console.log(this.setDepartmentManagerForm.manager)
      console.log('---')
      console.log(row.manager)

      let hasManagers
      if (!row.manager) {
        hasManagers = []
      } else {
        hasManagers = row.manager.map(v => {
          return v.id
        })
      }
      this.setDepartmentManagerForm.manager.push(...hasManagers)
      this.tempId = row.id
      this.chooseManagerFlag = true
      console.log(this.chooseManagerFlag)
    },
    toggleMemberShowFlag(index, row) {
      console.log('toggleMemberShowFlag')
      const ids = row.user_list.map(v => v.id)
      console.log(ids)
      this.chooseDepartmentMember.member = ids
      console.log('部门成员')
      this.tempId = row.id
      this.chooseMemberFlag = true
    },
    setDepartmentManager() {
      const index = this.findPosition()
      console.log(this.setDepartmentManagerForm.manager)
      const obj = {}
      obj.access_token = this.access_token
      obj.manager_id = this.setDepartmentManagerForm.manager.toString()
      obj.id = this.tempId
      console.log(obj)
      saveDepartment(obj).then(res => {
        this.$alert('保存成功')
        location.reload()
      }).catch(err => {
        this.$alert('保存失败')
      })
      // if (index.length === 1) {
      //   this.departmentData[index[0]].setDepartmentManagerForm = this.setDepartmentManagerForm.manager.join(',')
      // } else {
      //   this.$set(this.departmentData[index[0]].children[index[1]], 'setDepartmentManagerForm', this.setDepartmentManagerFormForm.manager.join(','))
      // }
      this.chooseManagerFlag = false
    },
    setDepartmentMember() {
      // const index = this.findPosition()
      console.log(this.chooseDepartmentMember.member)
      const obj = {}
      obj.access_token = this.access_token
      obj.uid = this.chooseDepartmentMember.member.join(',')
      console.log(obj)
      saveDepartment(obj).then(res => {
        this.$alert('保存成功')
        location.reload()
      }).catch(
        err => {
          this.$alert('保存失败')
        }
      )
      // if (index.length === 1) {
      //   this.departmentData[index[0]].departmentMember = this.chooseDepartmentMember.member.join(',')
      // } else {
      //   this.$set(this.departmentData[index[0]].children[index[1]], 'departmentMember', this.chooseDepartmentMember.member.join(','))

      this.chooseManagerFlag = false
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    setDepartmentLeader() {
      console.log('123deleteDepartmentaa')
      const obj = {}
      obj.access_token = this.access_token
      obj.id = this.id
      obj.director_id = this.nameForm.leader
      console.log(obj)
      saveDepartment(obj).then(res => {
        this.$alert('保存成功')
        location.reload()
      })
      // const index = this.findPosition()
      // if (index.length === 1) {
      //   this.departmentData[index[0]].departmentLeader = this.addDepartmentForm.leader
      // } else {
      //   this.$set(this.departmentData[index[0]].children[index[1]], 'setDepartmentManagerFormForm', this.addDepartmentForm.leader)
      // }
      // this.chooseLeaderFlag = false
    },
    findPosition: function() {
      const id = this.tempId
      const index = this.departmentData.findIndex(function(v) {
        return v.id === id
      })
      if (index !== -1) {
        return [index]
      } else {
        for (let i = 0; i <= this.departmentData.length; i++) {
          const index = this.departmentData[i].children.findIndex(function(v) {
            return v.id === id
          })
          return [i, index]
        }
      }

      // for (const i of this.departmentData) {
      //   console.log(i)
      //   if (i.id === this.tempId) {
      //     return i
      //   }
      // }
      // for (const i of this.departmentData) {
      //   for (const j of i.children) {
      //     if (j.id === this.tempId) {
      //       return i, j
      //     }
      //   }
      // }
    }

  }}
</script>
<style scoped lang="scss">
  .header {
    padding: 1em;
    font-size: 2em;
  }
  .leaderList {
    display: flex;
    flex-direction: column;
    .leaderName {
      padding: 0.5em;
    }
  }
  .managerList {
    display: flex;
    flex-direction: column;
  }
  .leaderListWrapper {
    /*border: 1px solid red;*/
    max-height: 50vh;
    /*overflow:;*/
    overflow-y:scroll
  }
  .addDepartment {
    margin-bottom: 1em;
  }
</style>
