<template>
  <div>
    <header class="header">部门管理</header>
    <el-table
      :data="departmentData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all>
      <el-table-column
        prop="department"
        label="部门"
        width="180"/>
      <el-table-column
        prop="departmentLeader"
        label="部门负责人"
        width="180">
        <template slot-scope="scope">
          <div @click="toggleLeaderShowFlag(scope.$index, scope.row)">{{ scope.row.departmentLeader }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="departmentManager"
        label="部门管理">
        <template slot-scope="scope">
          <div @click="toggleManagerShowFlag(scope.$index, scope.row)">{{ scope.row.departmentManager }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="departmentMember"
        label="部门成员">
        <template slot-scope="scope">
          <div @click="toggleMemberShowFlag(scope.$index, scope.row)">{{ scope.row.departmentMember }}</div>
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
      <el-form :model="ruleForm" label-width="100px" >
        <el-form-item label="负责人" prop="type">
          <el-radio-group v-model="ruleForm.leader" class="leaderList">
            <el-radio v-for="(item,i) in leaderList" :key="i" :label="item" class="leaderName"/>
          </el-radio-group>
        </el-form-item>
      </el-form>
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
      <el-form :model="ruleForm1" label-width="100px" >
        <el-form-item label="部门管理人" prop="type">
          <el-checkbox-group v-model="ruleForm1.manager" class="managerList">
            <el-checkbox v-for="(item,i) in managerList" :key="i" :label="item"/>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseManagerFlag = false">取 消</el-button>
        <el-button type="primary" @click="setDepartmentManager">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :before-close="handleClose"
      :visible.sync="chooseManagerFlag"
      title="选择部门成员"
      width="30%">
      <el-form :model="ruleForm1" label-width="100px" >
        <el-form-item label="部门成员" prop="type">
          <el-checkbox-group v-model="ruleForm2.member" class="managerList">
            <el-checkbox v-for="(item,i) in memberList" :key="i" :label="item"/>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseManagerFlag = false">取 消</el-button>
        <el-button type="primary" @click="setDepartmentMember">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        leader: ''
      },
      ruleForm1: {
        manager: []
      },
      ruleForm2: {
        member: []
      },
      chooseLeaderFlag: false,
      chooseManagerFlag: false,
      dialogFormVisible: false,
      leaderList: ['小张', '小王', '小刘', '小沈'],
      managerList: ['东东', '西西', '南南', '北北', '鸣人', '佐助'],
      memberList: ['韩杰', '钱君君', '沈毅', '陈华', '陈杰', '大头','小王','小李','张三','李四'],
      formLabelWidth: '120px',
      tempId: 0,
      departmentData: [{
        id: 3,
        department: '教学部',
        departmentLeader: '小张',
        departmentManager: '东东',
        departmentMember: '小王，小李',
        children: [{
          id: 31,
          department: '英语部',
          departmentLeader: '小王',
          departmentManager: '西西',
          departmentMember: '张三，李四'
        }]
      }]
    }
  },
  methods: {
    toggleLeaderShowFlag(index, row) {
      this.ruleForm.leader = ''
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
      this.chooseManagerFlag = true
    },
    setDepartmentManager(){
      const index = this.findPosition()
      console.log(this.ruleForm1.manager)

      if (index.length === 1) {
        this.departmentData[index[0]].departmentManager = this.ruleForm1.manager.join(',')
      } else {
        this.$set(this.departmentData[index[0]].children[index[1]], 'departmentManager', this.ruleForm1.manager.join(','))
      }
      this.chooseManagerFlag = false
    },
    setDepartmentMember(){
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
      const index = this.findPosition()
      if (index.length === 1) {
        this.departmentData[index[0]].departmentLeader = this.ruleForm.leader
      } else {
        this.$set(this.departmentData[index[0]].children[index[1]], 'departmentManager', this.ruleForm.leader)
      }
      this.chooseLeaderFlag = false
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
</style>
