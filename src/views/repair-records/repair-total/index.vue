<template>
  <div class="app-container">
    <div class="app-container">
      <h2>报修汇总</h2>
      <el-table :data="myApplicationTable" @selection-change="handleSelection" style="width: 100%">
        <el-table-column prop="choose" label="选择" type="selection" />
        <el-table-column prop="report_time" label="报修时间" />
        <el-table-column prop="repair_person" label="报修人" />
        <el-table-column prop="repair_address" label="报修地点" />
        <el-table-column prop="repair_content" label="报修内容" />
        <el-table-column prop="repair_description" label="问题描述" />
        <el-table-column prop="repair_pic" label="问题图片">
          <template slot-scope="scope">
            <span style="margin-left: 10px" @click="findscope(scope.row)">
              <!-- {{ scope.row.repair_pic }} -->
              <el-popover
                placement="right"
                title
                trigger="hover"
                v-for="(item,index) in scope.row.repair_pic"
                :key="index"
              >
                <span slot="reference">图片{{index}};</span>
                <img :src="item" :alt="index" style="max-height: 500px;max-width: 500px" />
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="repair_time" label="维修时间" />
        <el-table-column prop="repair_man" label="维修人" />
        <el-table-column prop="repair_result" label="维修结果" />
        <el-table-column prop="repair_situation" label="维修后使用情况" />
        <el-table-column prop="repair_status" label="状态" />
        <el-table-column prop="repair_deal" label="操作">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-button
                @click="claimItem(scope.row)"
                :type=" scope.row.repair_deal==='未处理'?'primary':'danger'"
                size="small"
              >{{ scope.row.repair_deal }}</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-button type="warning">新增</el-button>
      <el-button type="primary">编辑</el-button>
      <el-button type="success">确认</el-button>-->
    </div>
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalTableNumber"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getRepairs, ClaimRepair } from "@/api/repair-total.js";

import store from "@/store";
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      fileList: [],
      access_token: store.getters.access_token,
      myApplicationTable: [],
      tableData: [],
      addrepairshow: false,
      addrepairform: {
        location: "",
        classroom: "",
        title: "",
        dept: "",
        repairdetail: "",
        status: "",
        if_urgent: "1",
        fileList: "",
        repair_deal: ""
      },
      rules: {
        status: [{ required: true, message: "选择状态", trigger: "change" }],
        roles: [{ required: true, message: "选择角色", trigger: "change" }],
        confirmrepairdetail: [
          {
            required: true,
            trigger: "change",
            validator: this.validatorRepeatrepairdetail
          }
        ],
        repairdetail: [
          {
            required: true,
            message: "请填写详细描述",
            trigger: "change"
          }
        ],
        location: [
          { required: true, message: "请填写报修地点", trigger: "change" }
        ],
        classroom: [
          { required: true, message: "请填写报修教室", trigger: "change" }
        ],
        title: [{ required: true, message: "请填写标题", trigger: "change" }]
      }
    };
  },

  computed: {
    totalTableNumber() {
      return this.tableData.length;
    }
  },
  watch: {},
  created() {
    this.getRepairsList();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.myApplicationTable = this.tableData.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.myApplicationTable = this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    claimItem(rowData) {
      let access_token = this.access_token;
      let obj = { repair_id: rowData.repair_id, access_token: access_token };
      if (rowData.repair_deal === "未处理") {
        ClaimRepair(obj).then(() => {
          this.$alert("领取成功，请到我的维修中查看");
          location.reload();
        });
      } else {
        return;
      }
    },
    handleChange(file, fileList) {
      console.log("handlechange");
      // this.fileList = fileList.slice(-3);
      console.log(file, fileList);
      this.addrepairform.fileList = fileList;
    },
    beforeUpload(file) {
      console.log(file);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    validatorRepeatrepairdetail(rule, value, callback) {
      if (value === "") {
        callback(new Error("请重复输入密码"));
      } else if (value !== this.addrepairform.repairdetail) {
        callback(new Error("两次密码输入不同"));
      }
    },
    findscope(arg) {
      console.log(arg);
    },
    handleSelection(val) {
      this.checkedList = val;
    },
    getRepairsList() {
      let obj = { access_token: this.access_token, kind: 4 };
      getRepairs(obj).then(res => {
        console.log(res.data.list);
        let result_map = { 0: "退回", 1: "未处理", 2: "修复", 3: "无法修复" };
        let status_map = { 1: "未处理", 2: "处理中", 3: "已处理" };
        let deal_map = { 1: "未处理", 2: "不可用", 3: "不可用" };
        for (let i of res.data.list) {
          let obj = {
            report_time: "",
            repair_person: "",
            repair_address: "",
            repair_content: "",
            repair_description: "",
            repair_pic: "",
            repair_time: "",
            repair_man: "",
            repair_result: "",
            repair_situation: "",
            repair_feedback: "",
            repair_status: "",
            repair_deal: "",
            repair_id: ""
          };
          console.log(i);
          obj.report_time = i.apply_at;
          obj.repair_person = i.approver.name;
          obj.repair_address = i.address;
          obj.repair_content = i.title;
          obj.repair_description = i.content;
          obj.repair_pic = i.apply_images;
          obj.repair_time = i.completed_at;
          obj.repair_man = i.repair ? i.repair.name : "未维修";
          obj.repair_result = result_map[i.result];
          obj.repair_situation = i.remark;
          obj.repair_feedback = i.remark ? i.remark : "";
          obj.repair_status = status_map[i.status];
          obj.repair_deal = deal_map[i.status];
          obj.repair_id = i.id;
          // this.myApplicationTable.push(obj);
          this.tableData.push(obj);
        }
        if (this.tableData.length >= 10) {
          this.myApplicationTable = this.tableData.slice(0, 10);
        } else {
          this.myApplicationTable = this.tableData;
        }
        console.log(this.myApplicationTable);
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    cancelDiag(attr) {
      this.$confirm("确认取消？")
        .then(_ => {
          this[attr] = false;
        })
        .catch(_ => {});
    },
    confirmaddrepair(attr) {
      this.$confirm("确认提交？")
        .then(_ => {
          let access_token = this.access_token;
          let obj = {
            access_token: access_token,
            title: this.addrepairform.title,
            content: this.addrepairform.repairdetail,
            location: this.addrepairform.location,
            is_urgent: this.addrepairform.if_urgent,
            classroom_id: this.addrepairform.classroom,
            apply_images: this.addrepairform.fileList
          };

          AddRepairOne(obj).then(
            res => {
              this.$alert("提交成功，已发布到报修汇总中，等待认领");
              location.reload();
            },
            fail => {
              this.$alert("提交失败！");
            }
          );

          this[attr] = false;
        })
        .catch(_ => {});
    }
  }
};
</script>

<style  scoped>
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
