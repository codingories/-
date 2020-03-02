<template >
  <section style="padding:30px;">
    <section v-if="ruleFlag">
      <h2>考勤规则</h2>
      <header class="headerStyle">
        <el-button type="primary" @click="changeRuleFlag">添加规则</el-button>
        <el-button type="primary">删除规则</el-button>
      </header>
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
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="ruleName"
          label="主规则名"
          width="120"/>
        <el-table-column
          prop="name"
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
            <el-input v-model="ruleNameForm.ruleName"/>
          </el-form-item>
          {{ ruleNameForm.ruleName }}
        </el-form>
      </section>
      <section class="ruleDetail">
        <header class="headerStyle">
          <el-button type="primary" @click="ruleDetailTableFlag = true">添加细目规则</el-button>
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
            label="序号"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="120"/>
          <el-table-column
            prop="address"
            label="应用周期"/>
          <el-table-column
            prop="jobTime"
            label="上班时间"/>
          <el-table-column
            prop="closingTime"
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
      </section>
    </section>
    <el-dialog :visible.sync="ruleDetailTableFlag" title="创建">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="考勤规则">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动性质" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="周一" name="type"></el-checkbox>
            <el-checkbox label="周二" name="type"></el-checkbox>
            <el-checkbox label="周三" name="type"></el-checkbox>
            <el-checkbox label="周四" name="type"></el-checkbox>
            <el-checkbox label="周五" name="type"></el-checkbox>
            <el-checkbox label="周六" name="type"></el-checkbox>
            <el-checkbox label="周七" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="上班时间">
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="下班时间">
          <el-date-picker v-model="form.date2" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleDetailTableFlag = false">取 消</el-button>
        <el-button type="primary" @click="ruleDetailTableFlag = false">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
export default {
  data() {
    return {
      ruleDetailTableFlag: false,
      form: {
        name: '',
        type: [],
        date1: '',
        date2: ''
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
      attendanceRuleTableData: [{
        date: '1',
        ruleName: '日常规则',
        name: '星期一、二、三、四: 8:00-16:45; 星期五: 8:00-16:00;星期六、日: 无'
      }, {
        date: '2',
        ruleName: '假期规则',
        name: '星期一、二、三、四、五： 8:30-100；星期六、日: 无'
      }],
      ruleTableMultipleSelection: [],
      tableData: [{
        date: '1',
        name: '周一到周四规则',
        address: '每:周一、二、三、四',
        jobTime: '7:45',
        closingTime: '16:15'
      }
      //   {
      //   date: '2',
      //   name: '',
      //   address: ''
      // }
      ],
      multipleSelection: []
    }
  },

  methods: {
    changeRuleFlag() {
      this.ruleFlag = !this.ruleFlag
    },
    handleRuleTableSelection(val) {
      this.ruleTableMultipleSelection = val
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    box-shadow: 4px 5px 6px 0px rgba(182, 168, 168, 0.75);
  }
  .ruleTableDetail {
    width: 100%;
    margin-top: 25px;
    padding: 15px;
  }

</style>
