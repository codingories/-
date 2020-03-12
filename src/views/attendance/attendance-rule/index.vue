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
          width="240">
          <template slot-scope="scope" >
            <el-button type="primary" @click="editRule(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button type="warning" @click="useChangeName(scope.$index, scope.row)">
              改名
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section v-if="mainRuleFlag">
      <section class="ruleName">
        <el-button type="primary" @click="backMain" class="backStyle">返回</el-button>
        <el-form ref="ruleNameForm" :inline="true" :model="ruleNameForm" :rules="rules">
          <el-form-item label="主规则名称:" prop="ruleName">
            <el-input v-model="ruleNameForm.ruleName" placeholder="输入主规则名"/>
          </el-form-item>
          <el-button type="primary" @click="toggleRuleDetailFlag">确认</el-button>
        </el-form>
      </section>
      <section v-if="ruleDetailFlag" class="ruleDetail">
        <header class="headerStyle">
          <div>
            <el-button type="primary" @click="ruleDetailTableFlag = true">添加细目规则</el-button>
          </div>
          <el-button type="primary">删除主规则</el-button>
        </header>
        <el-table
          :data="detailRuleTable"
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
<!--        <div class="bottomButton">-->
<!--          <el-button type="primary">确定</el-button>-->
<!--          <el-button type="primary">取消</el-button>-->
<!--        </div>-->
      </section>
    </section>
    <section v-if="mainNameFlag">
      <el-button type="primary" @click="goBackMain">返回</el-button>
      <h4>主规则名称:{{ mainRuleName }}</h4>
      <div class="headerStyle">
        <el-button type="primary" @click="addDetailRule">添加细目规则</el-button>
        <el-button type="primary" @click="deleteDetailRule">删除细目规则</el-button>
      </div>
      <!--      {{ detailRuleTableData }}-->
      <!--      <br>-->
      <!--      {{ delete_id }}-->
      <div>
        <el-table
          ref="detailTable"
          :data="detailRuleTableData"
          @selection-change="handleDetailSelectionChange">
          <el-table-column
            type="selection"
            width="155" />
          <el-table-column
            prop="name"
            label="名称"
            width="120"/>
          <el-table-column
            prop="week_day_str"
            label="应用周期"/>
          <el-table-column
            prop="start_time"
            label="上班时间"/>
          <el-table-column
            prop="end_time"
            label="下班时间"
            show-overflow-tooltip/>
          <el-table-column
            prop="address"
            label="操作"
            width="120">
            <template slot-scope="scope" >
              <el-button type="primary" @click="editDetailTable(scope.$index, scope.row)">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
<!--        <div class="bottomButton">-->
<!--          <el-button type="primary">确定</el-button>-->
<!--          <el-button type="primary">取消</el-button>-->
<!--        </div>-->
      </div>

    </section>
    <el-dialog :visible.sync="ruleDetailTableFlag" title="创建">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="考勤规则">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="应用周期">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="周一" name="type"/>
            <el-checkbox label="周二" name="type"/>
            <el-checkbox label="周三" name="type"/>
            <el-checkbox label="周四" name="type"/>
            <el-checkbox label="周五" name="type"/>
            <el-checkbox label="周六" name="type"/>
            <el-checkbox label="周天" name="type"/>
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
    <el-dialog :visible.sync="editDetailTableFlag" :title="titleName">
      <el-form ref="detailForm" :model="detailForm" :rules="detailFormRules">
        <el-form-item :label-width="formLabelWidth" label="考勤规则1" prop="name">
          <el-input v-model="detailForm.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="应用周期" prop="weekDay">
          <el-checkbox-group v-model="detailForm.weekDay">
            <el-checkbox label="周一"/>
            <el-checkbox label="周二"/>
            <el-checkbox label="周三"/>
            <el-checkbox label="周四"/>
            <el-checkbox label="周五"/>
            <el-checkbox label="周六"/>
            <el-checkbox label="周天"/>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="上班时间">
          <el-time-picker
            v-model="detailForm.date1"
            arrow-control
            placeholder="任意时间点"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="下班时间">
          <el-time-picker
            v-model="detailForm.date2"
            arrow-control
            placeholder="任意时间点"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDetailTableFlag = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddDetailRuleDetail">确 定</el-button>
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
      :before-close="handleClose"
      width="30%">
      <span>确认需要提交吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmSubmitRuleDetail = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddDetailRule">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="changeMainNameFlag"
      :before-close="handleClose"
      title="请输入需要修改的名称"
      width="30%">
      <el-form ref="nameForm" :model="nameForm" label-width="100px">
        <el-form-item label="主规则名称">
          <el-input v-model="nameForm.name"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeMainNameFlag = false">取 消</el-button>
        <el-button type="primary" @click="changeMainRuleName">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import dayjs from 'dayjs'
import { getAttendanceRule, deleteAttendanceRule, getItemList, createRule, saveRuleItems, deleteRuleItem, changeName } from '@/api/attendance-rule'
import store from '@/store'

export default {
  data() {
    return {
      nameForm: {
        name: ''
      },
      detailFormRules: {
        name: [
          { required: true, message: '请输入名称，不能为空', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        weekDay: [
          { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
        ]
      },
      changeMainNameFlag: false,
      delete_id: 0,
      titleName: '编辑',
      editDetailTableFlag: false,
      mainRuleName: '',
      detailRuleTableData: [],
      mainNameFlag: false,
      mainRuleFlag: false,
      rule_id: 0,
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
      detailForm: {
        name: '',
        weekDay: [],
        date1: new Date(2016, 9, 10, 7, 40),
        date2: new Date(2016, 9, 10, 18, 40)
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
      attendanceRuleTableData: [],
      ruleTableMultipleSelection: [],
      detailRuleTable: [],
      multipleSelection: []
    }
  },

  created() {
    this.useGetAttendanceRule()
    // this.useGetItemList()
  },

  methods: {

    // useGetItemList() {
    //   console.log('sssss')
    //   const obj = {}
    //   obj.access_token = this.access_token
    //   getItemList(obj).then(
    //     res => {
    //       console.log('ss')
    //       console.log(res)
    //     }
    //   )
    // },
    addDetailRule() {
      console.log('addDetailRule')
      this.titleName = '增加'
      this.detailForm.name = ''
      this.detailForm.weekDay = []
      this.editDetailTableFlag = true
    },
    editDetailTable(index, row) {
      this.item_id = row.id
      this.detailForm.name = row.name
      console.log(row.week_day_str)
      this.detailForm.weekDay = row.week_day_str.split(',')
      this.editDetailTableFlag = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleDetailSelectionChange(val) {
      if (val.length >= 2) {
        this.$refs.detailTable.clearSelection()
        this.delete_id = 0
      } else if (val.length === 1) {
        this.delete_id = val[0].id
      }
      // console.log(val)
      // this.detailTable
    },
    addRule() {

    },
    editRule(index, row) {
      this.rule_id = row.id
      this.mainRuleName = row.name
      this.getDetailRuleData()
      this.ruleFlag = !this.ruleFlag
      this.mainNameFlag = !this.mainNameFlag
    },
    getDetailRuleData() {
      const obj = {}
      obj.access_token = this.access_token
      obj.rule_id = this.rule_id
      console.log(obj)
      // console.log(row.id)
      console.log('--------======-')
      getItemList(obj).then(
        res => {
          // console.log(res)
          this.detailRuleTableData = res.data
          this.editDetailTableFlag = false
        },
      ).catch(err => {
        console.log(err)
        this.detailRuleTableData = []
      })
    },
    goBackMain() {
      // this.ruleFlag = !this.ruleFlag
      // this.mainNameFlag = !this.mainNameFlag
      location.reload()
    },
    changeMainRuleName() {
      const obj = {}
      obj.access_token = this.access_token
      obj.rule_id = this.rule_id
      obj.name = this.nameForm.name
      // this.getDetailRuleData()
      changeName(obj).then(
        res => {
          console.log(res)
          location.reload()
          this.changeMainNameFlag = false
        }
      )
    },
    confirmAddDetailRuleDetail() {
      console.log('addDetailRulex')
      const obj = {}
      obj.access_token = this.access_token
      obj.name = this.detailForm.name
      const week_dic = { '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6, '周天': 7 }
      obj.week_day = this.detailForm.weekDay.map(v => week_dic[v]).join(',')
      obj.start_time = dayjs(this.detailForm.date1).format('H:mm')
      obj.end_time = dayjs(this.detailForm.date2).format('H:mm')
      obj.rule_id = this.rule_id
      if (this.titleName !== '增加') {
        obj.item_id = this.item_id
      }
      console.log(obj)
      saveRuleItems(obj).then(
        res => {
          this.$alert('保存成功')
          // location.reload()
          this.getDetailRuleData()
        }
      )
      // this.tableData.push(obj)
      // this.editDetailTableFlag = false
      // this.confirmSubmitRuleDetail = false
    },
    confirmDeleteRule() {
      this.deleteDialogShowFlag = false
      const obj = {}
      obj.access_token = this.access_token
      console.log(this.deleteIds)
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
    // useCreateRule() {
    //   console.log('-----')
    //   const obj = {}
    //   obj.access_token = this.access_token
    //   console.log(obj)
    //   createRule(obj).then(
    //     res => {
    //       console.log('=====')
    //       console.log(res)
    //     }
    //   )
    // },
    useGetAttendanceRule() {
      const access_token = this.access_token
      console.log(access_token)
      getAttendanceRule({ access_token }).then(res => {
        console.log(res.data)
        this.attendanceRuleTableData = res.data
        console.log('hehehe')
        console.log(res.data)
        this.attendanceRuleTableData.map(value => {
          if (!value.item) {
            value.item = '无'
          } else {
            let item = ''
            for (const i of value.item[0]) {
              item += i.week_day_str + ':' + i.start_time + ',' + i.end_time + '; '
            }
            value.item = item
          }
        })
      })
    },
    confirmAddDetailRule() {
      const obj = {}
      obj.access_token = this.access_token
      obj.name = this.form.name
      const week_dic = { '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6, '周天': 7 }
      obj.week_day = this.form.type.map(v => week_dic[v]).join(',')
      obj.start_time = dayjs(this.form.date1).format('H:mm')
      obj.end_time = dayjs(this.form.date2).format('H:mm')
      obj.rule_id = this.rule_id
      console.log(obj)
      saveRuleItems(obj).then(
        res => {
          this.$alert('保存成功')
          location.reload()
        }
      )
      // this.tableData.push(obj)
      this.ruleDetailTableFlag = false
      this.confirmSubmitRuleDetail = false
    },
    toggleRuleDetailFlag() {
      if (this.ruleNameForm.ruleName) {
        const obj = {}
        // this.ruleDetailFlag = true
        obj.access_token = this.access_token
        obj.rule_name = this.ruleNameForm.ruleName
        console.log(obj)
        createRule(obj).then(
          res => {
            console.log('res-res')
            console.log(res.data)
            if (res.data === '规则名称重复，请修改') {
              this.$alert('规则名称重复，请修改')
            } else {
              this.ruleDetailFlag = true
              this.rule_id = res.data
            }
          }
        )
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
      console.log('---')
      this.ruleFlag = !this.ruleFlag
      this.mainRuleFlag = !this.mainRuleFlag
      this.ruleDetailFlag = false
    },
    backMain(){
      location.reload()
    },
    handleRuleTableSelection(val) {
      this.ruleTableMultipleSelection = val
    },
    handleSelectionChange(val) {
      console.log('1233')
      this.multipleSelection = val
    },
    confirmAddRuleDetail() {
      console.log('confirmAddDetailRulexx')
      this.confirmSubmitRuleDetail = true
    },
    deleteDetailRule() {
      if (this.delete_id === 0) {
        this.$alert('请勾选需要删除的细目规则')
      } else {
        const obj = {}
        obj.access_token = this.access_token
        obj.item_id = this.delete_id
        deleteRuleItem(obj).then(
          res => {
            this.$alert('删除成功')
            this.getDetailRuleData()
          }
        )
      }
    },
    useChangeName(index, row) {
      this.rule_id = row.id
      this.mainRuleName = row.name
      this.changeMainNameFlag = true
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
    margin-top: 35px;
    box-shadow: 4px 5px 6px 0 rgba(182, 168, 168, 0.75);
  }
  .ruleTableDetail {
    width: 100%;
    margin-top: 25px;
    padding: 15px;
  }
  .backStyle {
    margin-bottom: 35px;
  }
  .bottomButton {
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
    padding-right: 15px;
    padding-bottom: 15px;
  }
</style>
