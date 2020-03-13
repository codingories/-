<template>
  <div class="app-container">
    <h2>当前是考勤组管理页面</h2>
    <!-- <h2>{{RawGroupData}}</h2> -->
<!--    <h4>{{ attendanceGroupList }}</h4>-->
    <h3>考勤组展示1</h3>
    <div class="topButtonStyle">
      <el-button type="primary">添加考勤组</el-button>
      <el-button type="primary">选择考勤组</el-button>
    </div>

    <el-table :data="attendanceGroupList" style="width: 100%">
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
          <el-button type="warning">
            分配
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="deal"
        label="操作"
        width="180">
        <template slot-scope="scope" >
          <el-button type="primary">
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
  </div>
</template>

<script>
import { getGroups } from '@/api/AttendanceGroup'
import { chooseAttendanceGroup } from '@/api/chooseAttendance'
import { getAttendanceGroups } from '@/api/attendance-manage'

import store from '@/store'
export default {
  data() {
    return {
      getGroupsLoading: false,
      RawGroupData: [],
      attendanceGroupList: [],
      addAttendance: [],
      multipleSelection: [],
      access_token: store.getters.access_token
    }
  },

  computed: {
    tableHeader: function() {
      return this.getTableHeader(this.tableYear, this.tableMonth)
    }
    // xxx: function(arg) {
    //   return 123
    // }
  },
  watch: {},

  created() {
    this.fetchGroupData()
    this.useGetAttendanceGroups()
  },
  methods: {
    xxx() {
      return 123
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
            let str = ""
            // console.log(v.rule.items)
            if (v.rule.items) {
              for(let i in v.rule.items){
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
