<template >
  <section style="padding:30px;">
    <section v-if="ruleFlag">
      <h2>考勤规则</h2>
      <!--      {{ attendanceRuleTableData }}-->
      <h4>/api/v1/attendances-rule/get-list:考勤规则列表</h4>
      <header class="headerStyle">
        <el-button type="primary" @click="changeRuleFlag">添加规则</el-button>
        <el-button type="primary" @click="deleteRuleDialogShow">删除规则</el-button>
      </header>
      <h4>/api/v1/attendances-rule/delete-rule:删除考勤规则</h4>
      <el-table
        ref="attendanceRuleTable"
        :data="attendanceRuleTableData"
        style="width: 100%"
        @selection-change="handleRuleTableSelection">
        <el-table-column
          type="selection"/>
        <el-table-column
          label="序号"
          width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="主规则名"
          width="120"/>
        <el-table-column
          prop="item"
          label="规则内容"/>
        <el-table-column
          prop="address"
          label="操作"
          width="120">
          <template slot-scope="scope" >
            <el-button type="primary">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section v-if="!ruleFlag">
      <section class="ruleName">
        <el-form ref="ruleNameForm" :inline="true" :model="ruleNameForm" :rules="rules">
          <el-form-item label="主规则名称:" prop="ruleName">
            <el-input v-model="ruleNameForm.ruleName" placeholder="输入主规则名"/>
          </el-form-item>
          <el-button type="primary" @click="toggleRuleDetailFlag">确认</el-button>
          <!--          {{ ruleNameForm.ruleName }}-->
        </el-form>
      </section>
      <section v-if="ruleDetailFlag" class="ruleDetail">
        <header class="headerStyle">
          <div>
            <el-button type="primary" @click="ruleDetailTableFlag = true">添加细目规则</el-button>
            <el-button type="primary" @click="changeRuleFlag">返回</el-button>
          </div>
          <!--          <el-button type="primary">返回</el-button>-->
          <!--          <el-button type="primary">确定</el-button>-->
          <!--          <el-button type="primary">取消</el-button>-->
          <el-button type="primary">删除主规则</el-button>
        </header>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          class="ruleTableDetail"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column
            prop="detailRuleName"
            label="名称"
            width="120"/>
          <el-table-column
            prop="route"
            label="应用周期"/>
          <el-table-column
            prop="startTime"
            label="上班时间"/>
          <el-table-column
            prop="endTime"
            label="下班时间"
            show-overflow-tooltip/>
          <el-table-column
            prop="address"
            label="操作"
            width="120">
            <template slot-scope="scope" >
              <el-button type="primary">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="bottomButton">
          <el-button type="primary">确定</el-button>
          <el-button type="primary">取消</el-button>
        </div>
      </section>
    </section>
    <el-dialog :visible.sync="ruleDetailTableFlag" title="创建">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="考勤规则">
          <el-input v-model="form.name" autocomplete="off"/>
          <!--          <el-select v-model="form.name">-->
          <!--            <el-option label="日常规则" value="shanghai"/>-->
          <!--            <el-option label="值班规则" value="beijing"/>-->
          <!--          </el-select>-->

        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="应用周期">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="周一" name="type"/>
            <el-checkbox label="周二" name="type"/>
            <el-checkbox label="周三" name="type"/>
            <el-checkbox label="周四" name="type"/>
            <el-checkbox label="周五" name="type"/>
            <el-checkbox label="周六" name="type"/>
            <el-checkbox label="周七" name="type"/>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="上班时间">
          <el-time-picker
            v-model="form.date1"
            arrow-control
            placeholder="任意时间点"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="下班时间">
          <el-time-picker
            v-model="form.date2"
            arrow-control
            placeholder="任意时间点"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleDetailTableFlag = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddRuleDetail">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="deleteDialogShowFlag"
      :before-close="handleClose"
      width="30%">
      <span>请确认是否需要删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogShowFlag = false">取 消</el-button>
        <el-button type="primary" @click="confirmDeleteRule">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="confirmSubmitRuleDetail"
      width="30%"
      :before-close="handleClose">
      <span>确认需要提交吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmSubmitRuleDetail = false">取 消</el-button>
        <el-button type="primary" @click="xxx">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import dayjs from 'dayjs'
import { getAttendanceRule, deleteAttendanceRule, getItemList, saveRuleItems } from '@/api/attendance-rule'
import store from '@/store'

export default {
  data() {
    return {
      confirmSubmitRuleDetail: false,
      deleteIds: [],
      deleteDialogShowFlag: false,
      ruleDetailFlag: false,
      ruleDetailTableFlag: false,
      access_token: store.getters.access_token,
      form: {
        name: '',
        type: [],
        date1: new Date(2016, 9, 10, 7, 40),
        date2: new Date(2016, 9, 10, 18, 40)
        // region: '',
        // date1: '',s
        // date2: '',
        // delivery: false,
        // resource: '',
        // desc: ''
      },
      formLabelWidth: '120px',
      ruleNameForm: {
        ruleName: ''
      },
      rules: {
        ruleName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      ruleFlag: true,
      attendanceRuleTableData: [
      // {
      //   date: '1',
      //   ruleName: '日常规则',
      //   name: '星期一、二、三、四: 8:00-16:45; 星期五: 8:00-16:00;星期六、日: 无'
      // }, {
      //   date: '2',
      //   ruleName: '假期规则',
      //   name: '星期一、二、三、四、五： 8:30-100；星期六、日: 无'
      // }
      ],
      ruleTableMultipleSelection: [],
      tableData: [{
        date: '1',
        detailRuleName: '周一到周四规则',
        route: '每:周一、二、三、四',
        startTime: '7:45',
        endTime: '16:15'
      }
      ],
      multipleSelection: []
    }
  },

  created() {
    // this.useGetAttendanceRule()
    this.useGetItemList()
  },

  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    confirmDeleteRule() {



      this.deleteDialogShowFlag = false
      // const ids = this.ruleTableMultipleSelection.map(v => v.id)
      const obj = {}
      obj.access_token = this.access_token
      console.log(this.deleteIds)

      // obj.rule_id = 2
      // deleteAttendanceRule(obj).then(
      //   res=>{
      //     this.$alert('删除成功')
      //     location.reload()
      //   },
      //   fail=>{
      //     this.$alert('删除失败')
      //   }
      // )
      for (const i of this.deleteIds) {
        obj.rule_id = i
        deleteAttendanceRule(obj).then(
          res => {
            this.$alert('删除成功')
            location.reload()
          },
          fail => {
            this.$alert('删除失败')
          }
        )
      }
    },
    useGetItemList() {
      console.log('-----')
      const obj = {}
      obj.access_token = this.access_token
      getItemList(obj).then(
        res => {
          console.log('=====')
          console.log(res)
        }
      )
    },
    useGetAttendanceRule() {
      const access_token = this.access_token
      console.log(access_token)
      getAttendanceRule({ access_token }).then(res => {
        console.log(res.data)
        this.attendanceRuleTableData = res.data
        this.attendanceRuleTableData.map(
          v => {
            v.item = v.item.map(
              x => x.week_day + ':' + x.start_time + '-' + x.end_time
            ).join('; ')
          }
        )
        // {
        //   date: '1',
        //   ruleName: '日常规则',
        //   name: '星期一、二、三、四: 8:00-16:45; 星期五: 8:00-16:00;星期六、日: 无'
        // }, {
        //   date: '2',
        //   ruleName: '假期规则',
        //   name: '星期一、二、三、四、五： 8:30-100；星期六、日: 无'
        // }
      })
    },
    xxx(){
      console.log('jjj')
      const obj = {}
      obj.detailRuleName = this.form.name
      obj.week_day = this.form.type.join(',')
      obj.start_time = dayjs(this.form.date1).format('H:mm')
      obj.end_time = dayjs(this.form.date2).format('H:mm')
      console.log(obj)
      // this.tableData.push(obj)
      this.ruleDetailTableFlag = false
      this.confirmSubmitRuleDetail = false
    },
    toggleRuleDetailFlag() {
      if (this.ruleNameForm.ruleName) {
        let obj = {}
        this.ruleDetailFlag = true
        obj.access_token = this.access_token
        obj.rule_name = this.ruleNameForm.ruleName
        getItemList(obj).then(
          res => {
            console.log('res-res')
            console.log(res)
          }
        )
        // console.log(obj)
      }
    },
    deleteRuleDialogShow() {
      this.deleteIds = this.ruleTableMultipleSelection.map(v => v.id)
      if (this.deleteIds.length === 0) {
        this.$alert('请先选择需要删除的考勤规则')
      } else {
        this.deleteDialogShowFlag = true
      }
    },
    changeRuleFlag() {
      this.ruleFlag = !this.ruleFlag
      this.ruleDetailFlag = false
    },
    handleRuleTableSelection(val) {
      this.ruleTableMultipleSelection = val
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    confirmAddRuleDetail() {
      // const obj = {}
      // obj.detailRuleName = this.form.name
      // obj.route = this.form.type.join(',')
      // obj.startTime = dayjs(this.form.date1).format('H:mm')
      // obj.endTime = dayjs(this.form.date2).format('H:mm')
      // this.tableData.push(obj)
      // this.ruleDetailTableFlag = false
      console.log('xxxxx')
      this.confirmSubmitRuleDetail = true
    }
  }
}
</script>
<style lang="scss" scoped>
  .headerStyle {
    display: flex;
    justify-content: space-between;
  }
  .ruleName {
    box-shadow: 4px 5px 6px 0px rgba(182, 168, 168, 0.75);
  }
  .ruleDetail {
    margin-top: 15px;
    box-shadow: 4px 5px 6px 0 rgba(182, 168, 168, 0.75);
  }
  .ruleTableDetail {
    width: 100%;
    margin-top: 25px;
    padding: 15px;
  }
  .bottomButton {
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
    padding-right: 15px;
    padding-bottom: 15px;
  }
</style>
