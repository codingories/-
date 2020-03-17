<template>
  <div>
    <header class="header">部门管理</header>
    {{ nameForm.leader }}

    <!--    {{leaderList}}-->
    <!--    <hr>-->
    <!--    {{managerList}}-->
    <!--    <hr>-->
    <!--    {{memberList}}-->
    <!--    <hr>-->
    <!--    {{leaderList}}-->
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
        prop="departmentManager"
        label="部门管理">
        <template slot-scope="scope">
          <div @click="toggleManagerShowFlag(scope.$index, scope.row)">{{ scope.row.manager_id===0? '无': scope.row.manager_id }}</div>
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
            size="mini">编辑</el-button>
          <el-button
            size="mini"
            type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :before-close="handleClose"
      :visible.sync="chooseLeaderFlag"
      title="选择负责人"
      width="30%">
      {{ nameForm.leader }}
      {{ nameForm.leader }}
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
        <el-form :model="ruleForm1" label-width="100px" >
          <el-form-item label="部门管理人" prop="type">
            <el-checkbox-group v-model="ruleForm1.manager" class="managerList">
              <el-checkbox v-for="(item,i) in managerList" :key="i" :label="item.name"/>
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
        <el-form :model="ruleForm1" label-width="100px" >
          <el-form-item label="部门成员" prop="type">
            <el-checkbox-group v-model="ruleForm2.member" class="managerList">
              <el-checkbox v-for="(item,i) in memberList" :key="i" :label="item.name"/>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseMemberFlag = false">取 消</el-button>
        <el-button type="primary" @click="setDepartmentMember">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { getDepList, getUserList, saveDepartment } from '@/api/deptManage'
import store from '@/store'

export default {
  data() {
    return {
      access_token: store.getters.access_token,
      director_id: '',
      id: '',
      dept_name: '',
      nameForm: {
        leader: 1
      },
      ruleForm1: {
        manager: []
      },
      ruleForm2: {
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
      //   {
      //   id: 3,
      //   department: '教学部', dept_name
      //   departmentLeader: '小张', director
      //   departmentManager: '东东',
      //   departmentMember: '小王，小李',
      //   children: [{
      //     id: 31,
      //     department: '英语部',
      //     departmentLeader: '小王',
      //     departmentManager: '西西',
      //     departmentMember: '张三，李四'
      //   }]
      // }
      ]
    }
  },
  created() {
    this.useGetDepList()
    this.useGetUserList()
  },
  methods: {
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
    dealUserList(userList) {
      let str = ''
      if (userList) {
        userList.forEach(v => {
          str += v.name + ','
        })
      }
      return str
    },
    useGetDepList() {
      const obj = {}
      obj.access_token = this.access_token
      getDepList(obj).then(
        res => {
          console.log(res.data)
          this.departmentData = res.data
          // this.managerList = res.data
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
        console.log('kkkkk')
        this.$set(this.nameForm, 'leader', 0)
      }
      this.tempId = row.id
      this.chooseLeaderFlag = true
    },
    toggleManagerShowFlag(index, row) {
      this.ruleForm1.manager = []
      this.tempId = row.id
      this.chooseManagerFlag = true
    },
    toggleMemberShowFlag(index, row) {
      this.ruleForm2.member = []
      this.tempId = row.id
      this.chooseMemberFlag = true
    },
    setDepartmentManager() {
      const index = this.findPosition()
      console.log(this.ruleForm1.manager)
      if (index.length === 1) {
        this.departmentData[index[0]].departmentManager = this.ruleForm1.manager.join(',')
      } else {
        this.$set(this.departmentData[index[0]].children[index[1]], 'departmentManager', this.ruleForm1.manager.join(','))
      }
      this.chooseManagerFlag = false
    },
    setDepartmentMember() {
      const index = this.findPosition()
      console.log(this.ruleForm2.member)

      if (index.length === 1) {
        this.departmentData[index[0]].departmentMember = this.ruleForm2.member.join(',')
      } else {
        this.$set(this.departmentData[index[0]].children[index[1]], 'departmentMember', this.ruleForm2.member.join(','))
      }
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
      console.log('123xxxaa')
      let obj = {}
      obj.access_token = this.access_token
      obj.id = this.id
      obj.director_id = this.nameForm.leader
      console.log(obj)
      saveDepartment(obj).then(res=>{
        this.$alert('保存成功')
        location.reload()
      })
      // const index = this.findPosition()
      // if (index.length === 1) {
      //   this.departmentData[index[0]].departmentLeader = this.ruleForm.leader
      // } else {
      //   this.$set(this.departmentData[index[0]].children[index[1]], 'departmentManager', this.ruleForm.leader)
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
</style>
