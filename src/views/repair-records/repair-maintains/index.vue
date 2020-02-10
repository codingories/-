<template>
  <div class="app-container">
    <div class="app-container">
      <h2>我的维修</h2>
      <el-table :data="myApplicationTable" style="width: 100%" @selection-change="handleSelection">
        <el-table-column prop="choose" label="选择" type="selection"/>
        <el-table-column prop="report_time" label="报修时间"/>
        <el-table-column prop="repair_person" label="报修人"/>
        <el-table-column prop="repair_address" label="报修地点"/>
        <el-table-column prop="repair_content" label="报修内容"/>
        <el-table-column prop="repair_description" label="问题描述"/>
        <el-table-column prop="repair_pic" label="问题图片">
          <template slot-scope="scope">
            <span style="margin-left: 10px" @click="findscope(scope.row)">
              <el-popover
                v-for="(item,index) in scope.row.repair_pic"
                :key="index"
                placement="right"
                title
                trigger="hover"
              >
                <span slot="reference">图片{{ index }};</span>
                <img :src="item" :alt="index" style="max-height: 500px;max-width: 500px">
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="repair_time" label="维修时间"/>
        <!-- <el-table-column prop="repair_man" label="维修人" /> -->
        <el-table-column prop="repair_result" label="维修结果"/>
        <el-table-column prop="repair_situation" label="维修后使用情况"/>
        <el-table-column prop="repair_status" label="状态"/>
        <el-table-column prop="repair_deal" label="操作">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-button type="primary" size="small" @click="dealresult(scope.row)">处理</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :visible.sync="repairresultshow"
        :before-close="handleClose"
        title="选择维修结果"
        width="700px"
      >
        <el-form ref="addrepairform" :model="addrepairform" label-width="100px">
          <el-form-item label="选择结果" prop="result">
            <el-radio v-model="addrepairform.result" label="1">未修复</el-radio>
            <el-radio v-model="addrepairform.result" label="2">修复</el-radio>
            <el-radio v-model="addrepairform.result" label="3">无法修复</el-radio>
            <el-radio v-model="addrepairform.result" label="4">退回</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="cancelDiag('repairresultshow')">取消</el-button>
        <el-button type="primary" @click="confirmresult('repairresultshow')">确认</el-button>
      </el-dialog>
    </div>
    <div class="block">
      <span class="demonstration"/>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 100]"
        :page-size="pageSize"
        :total="totalTableNumber"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getRepairs, CompleteRepair } from '@/api/repair-maintain.js'

import store from '@/store'

export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      tableData: [],
      repair_id: '',
      fileList: [],
      access_token: store.getters.access_token,
      myApplicationTable: [],
      repairresultshow: false,
      addrepairform: {
        result: '1'
      }
    }
  },

  computed: {
    totalTableNumber() {
      return this.tableData.length
    }
  },
  watch: {},
  created() {
    this.getRepairsList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.myApplicationTable = this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.myApplicationTable = this.tableData.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      )
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    dealresult(rowdata) {
      console.log(rowdata)
      this.repair_id = rowdata.repair_id
      this.repairresultshow = true
    },
    validatorRepeatrepairdetail(rule, value, callback) {
      if (value === '') {
        callback(new Error('请重复输入密码'))
      } else if (value !== this.addrepairform.repairdetail) {
        callback(new Error('两次密码输入不同'))
      }
    },
    handleSelection(val) {
      this.checkedList = val
    },
    getRepairsList() {
      const obj = { access_token: this.access_token, kind: '2' }
      getRepairs(obj).then(res => {
        console.log(res.data.list)
        const result_map = { 0: '退回', 1: '未处理', 2: '修复', 3: '无法修复' }
        const status_map = { 1: '未处理', 2: '处理中', 3: '已经处理' }
        for (const i of res.data.list) {
          const obj = {
            report_time: '',
            repair_person: '',
            repair_address: '',
            repair_content: '',
            repair_description: '',
            repair_pic: '',
            repair_time: '',
            repair_man: '',
            repair_result: '',
            repair_situation: '',
            repair_feedback: '',
            repair_status: '',
            repair_id: ''
          }
          console.log(i)
          obj.report_time = i.apply_at
          obj.repair_person = i.approver.name
          obj.repair_address = i.address
          obj.repair_content = i.title
          obj.repair_description = i.content
          obj.repair_pic = i.apply_images
          obj.repair_time = i.completed_at
          obj.repair_man = i.repair ? i.repair.name : '未维修'
          obj.repair_result = result_map[i.result]
          obj.repair_situation = i.remark
          obj.repair_feedback = i.remark ? i.remark : ''
          obj.repair_status = status_map[i.status]
          obj.repair_id = i.id
          this.tableData.push(obj)
          if (this.tableData.length >= 10) {
            this.myApplicationTable = this.tableData.slice(0, 10)
          } else {
            this.myApplicationTable = this.tableData
          }
        }
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
    cancelDiag(attr) {
      this.$confirm('确认取消？')
        .then(_ => {
          this[attr] = false
        })
        .catch(_ => {
        })
    },
    confirmresult(attr) {
      this.$confirm('确认提交？')
        .then(_ => {
          const access_token = this.access_token
          const repair_id = this.repair_id
          const temp = this.addrepairform.result
          let result
          if (temp == '1') {
            result = '1'
          } else if (temp == '2') {
            result = '2'
          } else if (temp == '3') {
            result = '3'
          } else {
            result = '-9'
          }
          const data = {
            repair_id,
            access_token,
            result
          }

          console.log(access_token, repair_id, result)
          console.log(data)
          CompleteRepair(data).then(
            res => {
              this.$alert('维修完成,状态修改成功')
              location.reload()
            },
            err => {
              this.$alert('维修已完成，无需再次提交')
            }
          )
          this[attr] = false
        })
        .catch(_ => {
        })
    }
  }
}
</script>

<style scoped>
  .textarea {
    margin-bottom: 20px;
  }

  .setInline {
    display: inline-block;
  }

  .ActiveStatus {
    margin-left: 45px;
  }
</style>
