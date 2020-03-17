<template>
  <div class="app-container">
    <h2>当前是考勤组管理页面</h2>
    <!-- <h2>{{RawGroupData}}</h2> -->
    <!--    <h4>{{ attendanceGroupList }}</h4>-->
    <h3>考勤组展示1</h3>
    <div class="topButtonStyle">
      <el-button type="primary" @click="addAttendanceGroup">添加考勤组</el-button>
      <el-button type="primary" @click="deleteAttendanceGroup">删除考勤组</el-button>
    </div>

    <el-table ref="attendanceGroupList" :data="attendanceGroupList" style="width: 100%" @selection-change="handleSelection">
      <el-table-column
        type="selection"/>
      <el-table-column prop="name" label="考勤组名" width="100"/>
      <el-table-column prop="rule.name" label="主规则名" width="100"/>
      <el-table-column prop="rule.items" label="规则内容"/>
      <el-table-column
        prop="assignUser"
        label="分配用户"
        width="180">
        <template slot-scope="scope" >
          <el-button type="warning" @click="showAssignmentDialog">
            分配
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="deal"
        label="操作"
        width="180">
        <template slot-scope="scope" >
          <el-button type="primary" @click="editGroupDialogOpen(scope.$index, scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <h3>选择考勤组</h3>
    <el-dropdown trigger="click">
      <el-button type="primary">
        选择考勤组
        <i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="chooseAttendance(2)">在编</el-dropdown-item>
        <el-dropdown-item @click.native="chooseAttendance(3)">非编</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- <h2>{{multipleSelection}}</h2> -->
    <!-- <h4>{{addAttendance}}</h4> -->
    <el-table :data="addAttendance" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" prop="id" label="序号" width="180"/>
      <el-table-column prop="id" label="序号" width="180"/>
      <el-table-column prop="name" label="姓名" width="180"/>
      <el-table-column prop="attendance_group_id" label="考勤组"/>
    </el-table>
    <el-dialog
      :visible.sync="addGroupDialogFlag"
      :before-close="handleClose"
      width="60%">
      <el-form ref="attendanceGroupForm" :model="attendanceGroupForm" :rules="attendanceGroupFormRules" label-width="100px">
        <el-form-item label="考勤组名称" prop="name">
          <el-input v-model="attendanceGroupForm.name"/>
        </el-form-item>
        <el-form-item label="考勤规则" prop="rule">
          <el-select v-model="attendanceGroupForm.rule" placeholder="请选择考勤规则">
            <el-option v-for="(item,i) in selectList" :label="item.name" :value="item.id" :key="i"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="confirmAttendanceGroup">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="deleteGroupFlag"
      width="30%"
      :before-close="handleClose">
      <span>请确认是否需要删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteGroupFlag = false">取 消</el-button>
        <el-button type="primary" @click="confirmDeleteAttendanceGroup">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="assignmentDialogFlag"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="assignmentDialogFlag = false">取 消</el-button>
    <el-button type="primary" @click="assignmentDialogFlag = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGroups, getSelectList, saveGroup } from '@/api/AttendanceGroup'
import { chooseAttendanceGroup } from '@/api/chooseAttendance'
import { getAttendanceGroups, deleteGroup, getGroupUsers } from '@/api/attendance-manage'
// import {  getSelectList } from '@/api/attendance-rule'

import store from '@/store'
export default {
  data() {
    return {
      assignmentDialogFlag: false,
      deleteGroupFlag: false,
      chosenRows: [],
      delete_id: -1,
      group_id: -1,
      getGroupsLoading: false,
      RawGroupData: [],
      attendanceGroupList: [],
      addAttendance: [],
      multipleSelection: [],
      access_token: store.getters.access_token,
      addGroupDialogFlag: false,
      attendanceGroupForm: {
        name: '',
        rule: ''
      },
      selectList: [],
      attendanceGroupFormRules: {
        name: [
          { required: true, message: '请输入考勤组名称', trigger: 'blur' }
        ],
        rule: [
          { required: true, message: '请选择考勤规则', trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    tableHeader: function() {
      return this.getTableHeader(this.tableYear, this.tableMonth)
    }
    // addAttendanceGroup: function(arg) {
    //   return 123
    // }
  },
  watch: {},

  created() {
    this.fetchGroupData()
    this.useGetAttendanceGroups()
    this.useGetSelectList()
  },
  methods: {
    showAssignmentDialog() {
      this.assignmentDialogFlag = true
    },
    confirmDeleteAttendanceGroup() {
      let obj = {}
      obj.access_token = this.access_token
      obj.group_id = this.delete_id
      this.deleteGroupFlag = false
      deleteGroup(obj).then(
        res => {
          this.$alert('删除成功')
          location.reload()
        }
      )
    },
    deleteAttendanceGroup(){
      if(this.chosenRows.length===0){
        this.$alert('请先勾选需要删除的考勤组')
      } else {
        this.deleteGroupFlag = true
      }
    },
    handleSelection(rows) {
      this.chosenRows = rows
      if (rows.length >= 2) {
        this.$refs.attendanceGroupList.clearSelection()
      }else if(rows.length===1){
        console.log(rows)
        this.delete_id = rows[0].id
      }
    },
    confirmAttendanceGroup() {
      this.$refs['attendanceGroupForm'].validate((valid) => {
        if (valid) {
          const obj = {}
          if (this.group_id !== -1) {
            obj.group_id = this.group_id
          }
          obj.access_token = this.access_token
          obj.name = this.attendanceGroupForm.name
          obj.rule_id = this.attendanceGroupForm.rule
          saveGroup(obj).then(res => {
            location.reload()
          })
        } else {
          return false
        }
      })
    },
    editGroupDialogOpen(index, row) {
      console.log(index, row)
      console.log(row.name)
      this.attendanceGroupForm.name = row.name
      this.attendanceGroupForm.rule = row.rule.name
      this.group_id = row.id
      this.addGroupDialogFlag = true
      // console.log(this.$refs["attendanceGroupForm"])
      // this.$refs["attendanceGroupForm"].validate((valid) => {
      //   if (valid) {
      //     let obj = {}
      //     obj.access_token = this.access_token
      //     obj.name = this.attendanceGroupForm.name
      //     obj.rule_id = this.attendanceGroupForm.rule
      //     // console.log(obj)
      //     saveGroup(obj).then(res=>{
      //       // console.log(res)
      //       location.reload()
      //     })
      //   } else {
      //     return false;
      //   }
      // })
    },
    useGetSelectList() {
      const obj = {}
      obj.access_token = this.access_token
      console.log('====---0000')
      console.log(obj)
      getSelectList(obj).then(res => {
        // console.log('-res-')
        // console.log(res.data)
        this.selectList = res.data
      })
    },
    addAttendanceGroup() {
      this.attendanceGroupForm.name = ''
      this.group_id = -1
      this.addGroupDialogFlag = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    useGetAttendanceGroups() {
      const obj = {}
      obj.access_token = this.access_token
      console.log(obj)
      const week_map = { '1': '星期二', '2': '星期二', '3': '星期三', '4': '星期四', '5': '星期五', '6': '星期六', '7': '星期天' }
      getAttendanceGroups(obj).then(
        res => {
          const obj = res.data
          const list = []
          for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
              list.push(obj[i.toString()])
            }
          }
          console.log(list)
          list.map(v => {
            let str = ''
            // console.log(v.rule.items)
            if (v.rule.items) {
              for (const i in v.rule.items) {
                // console.log(week_map[i.toString()])
                // console.log(v.rule.items[i.toString()].start_time)
                // console.log(v.rule.items[i.toString()].end_time)
                str += week_map[i.toString()] + ':' + v.rule.items[i.toString()].start_time + '-' + v.rule.items[i.toString()].end_time + '; '
              }
              // console.log(str)
              v.rule.items = str
            } else {
              v.rule.items = '无'
            }
          })
          console.log(list)
          this.attendanceGroupList = list
        }
      )
    },
    fetchGroupData() {
      const access_token = this.access_token
      const access_token_obj = { access_token: this.access_token }
      this.getGroupsLoading = true
      getGroups(access_token_obj).then(success => {
        this.RawGroupData = success.data
        // this.RawRuleData = success.data[0];
        const tempKeys0 = Object.keys(this.RawGroupData)
        const dateMap = {
          6: '星期六',
          7: '星期日',
          1: '星期一',
          2: '星期二',
          3: '星期三',
          4: '星期四',
          5: '星期五'
        }
        const finalList = []
        let index = 1
        const AddAttendanceObjList = []
        for (const i of tempKeys0) {
          const finalObj = { ID: '', ruleName: '', content: '' }
          let str = ''
          finalObj.ruleName = this.RawGroupData[i].rule.name

          const nameMap = { '2': '在编', '3': '非编' }
          if (this.RawGroupData[i].users !== null) {
            for (const k of this.RawGroupData[i].users) {
              const AddAttendanceObj = {}
              AddAttendanceObj.id = k.workno // id改成
              AddAttendanceObj.name = k.name
              AddAttendanceObj.attendance_group_id =
                nameMap[k.attendance_group_id]
              AddAttendanceObjList.push(AddAttendanceObj)
            }
            this.addAttendance = AddAttendanceObjList
          }

          const tempKeys1 = Object.keys(this.RawGroupData[i].rule.items)
          const tempObj1 = {}
          const tempObj2 = {}
          for (const j of tempKeys1) {
            let tempStrKey = ''
            tempStrKey +=
              this.RawGroupData[i].rule.items[j].start_time +
              '-' +
              this.RawGroupData[i].rule.items[j].end_time
            tempObj1[
              dateMap[this.RawGroupData[i].rule.items[j].day]
            ] = tempStrKey
            tempObj2[tempStrKey] = ''
          }
          for (const i of Object.keys(tempObj2)) {
            for (const j of Object.keys(tempObj1)) {
              if (tempObj1[j] === i) {
                tempObj2[i] += j + ','
              }
            }
          }
          for (const k in tempObj2) {
            const value = tempObj2[k]
            tempObj2[value] = k
            delete tempObj2[k]
          }
          const tempObj3 = Object.keys(tempObj2)
          for (const i of tempObj3) {
            str += i + tempObj2[i] + ';'
          }
          finalObj.content = str
          finalObj.ID = index
          finalList.push(finalObj)

          index++
        }
        this.tableData = finalList
      })

      this.getGroupsLoading = false
    },

    chooseAttendance(arg) {
      const temp_obj = {
        access_token: this.access_token,
        attendance_group_id: '',
        user_ids: ''
      }
      const user_id_list = []
      for (const i of this.multipleSelection) {
        user_id_list.push(i.id)
        for (const k of this.addAttendance) {
          if (k.id === i.id) {
            if (arg === 3) {
              temp_obj.attendance_group_id = arg
              k.attendance_group_id = '非编'
            } else {
              temp_obj.attendance_group_id = arg
              k.attendance_group_id = '在编'
            }
          }
        }
        const user_id = user_id_list.join(',')
        temp_obj.user_ids = user_id
      }
      if (temp_obj.attendance_group_id === '' || temp_obj.user_ids === '') {
        return
      } else {
        chooseAttendanceGroup(temp_obj)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
  .topButtonStyle {
    display: flex;
    justify-content: space-between;
  }
</style>
