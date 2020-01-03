<template>
  <div class="dashboard-container">
    <el-row>
      <el-col
        v-for="(item, i) in topContent"
        :key="i"
        :xl="1"
        :md="1"
        :sm="1"
        :xs="1"
        class="item-marign-right"
      >
        <div class="top-item" @click="fillFlowDetails(item.flowId, item.flowName)">
          <div>{{ item.flowName }}</div>
        </div>
      </el-col>
      <el-col :xl="1" :md="1" :sm="1" :xs="1" class="item-marign-right">
        <div class="top-item addStyle" @click="dialogVisible = true">
          <div>+</div>
        </div>
      </el-col>
      <el-dialog
        :title="flow_name"
        :visible.sync="processDialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <!-- <div v-for="(item,i) in addItemList" :key="i">
          <el-checkbox v-model="item.checked">{{item.flowName}}</el-checkbox>
        </div>-->
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标题*">
            <el-input v-model="form.title" />
          </el-form-item>

          <el-form-item
            v-for="(item, i) in formList"
            v-if="item.field_type === 'text'"
            :key="i"
            :label="item.field_name"
          >
            <el-input v-model="form[item.field]" />
          </el-form-item>

          <el-form-item
            v-for="(item, i) in formList"
            v-if="item.field_type === 'date'"
            :key="i"
            :label="item.field_name"
          >
            <el-date-picker
              v-model="form[item.field]"
              type="dates"
              placeholder="选择日期时间"
              default-time="12:00:00"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd 00:00:00"
            />
          </el-form-item>
          <el-form-item
            v-for="(item, i) in formList"
            v-if="item.field_type !== 'text' && item.field_type !== 'date'"
            :key="i"
            :label="item.field_name"
          >
            <el-input v-model="form[item.field]" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="processDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="formConfirmStatus">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="添加流程" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div v-for="(item, i) in addItemList" :key="i">
          <el-checkbox v-model="item.checked">{{ item.flowName }}</el-checkbox>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmStatus">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <div class="status">
      <div class="status-first">
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :header-cell-style="{ background: 'rgba(253,112,116,50%)' }"
            :data="tableData"
            border
            style="width: 401px"
          >
            <el-table-column prop="info" label="我的考勤" width="400px" />
          </el-table>
        </div>
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :header-cell-style="{ background: 'rgba(254,223,116,50%)' }"
            :data="applyTable"
            border
            style="width: 401px"
            class="mycell"
          >
            <el-table-column prop="applyInfo" label="我的申请" width="400px">
              <template slot="header" slot-scope="{ column, $index }">
                我的申请
                <a class="more" @click="myApplyDetail">更多>></a>
              </template>
              <template slot-scope="scope">
                <div class="myApplyDetail">
                  <div>{{ scope.row["applyInfo"] }}</div>
                  <div>{{ scope.row["applyStatus"] }}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="status-first">
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :data="tableData"
            :header-cell-style="{ background: 'rgba(99,211,133,50%)' }"
            border
            style="width: 401px"
          >
            <el-table-column prop="info" label="通知公告" width="400px" />
          </el-table>
        </div>
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :data="myApprovalTable"
            :header-cell-style="{ background: 'rgba(119,201,255,50%)' }"
            border
            style="width: 401px"
          >
            <!-- <el-table-column prop="info" label="我的审批" width="400px" /> -->
            <el-table-column prop="applyInfo" label="我的申请" width="400px">
              <template slot="header" slot-scope="{ column, $index }">
                我的审批
                <a class="more" @click="myApprovalDetail">更多>></a>
              </template>
              <template slot-scope="scope">
                <div class="myApplyDetail">
                  <div>{{ scope.row["applyInfo"] }}</div>
                  <div>{{ scope.row["applyStatus"] }}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog title="增加报修" :visible.sync="addrepairshow" width="700px" :before-close="handleClose">
      <el-form :model="addrepairform" :rules="rules" ref="addrepairform" label-width="100px">
        <el-form-item label="报修地点" prop="location" class="setInline">
          <el-input v-model="addrepairform.location" placeholder="请填写报修地点"></el-input>
        </el-form-item>
        <el-form-item label="报修教室" prop="classroom" class="setInline">
          <el-input v-model="addrepairform.classroom" placeholder="请填写报修教室"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title" class="setInline">
          <el-input v-model="addrepairform.title" placeholder="请填写标题"></el-input>
        </el-form-item>
        <el-form-item label="问题描述" prop="repairdetail">
          <el-input v-model="addrepairform.repairdetail" placeholder="请填写问题描述" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="是否加急" prop="if_urgent">
          <el-radio v-model="addrepairform.if_urgent" label="1">是</el-radio>
          <el-radio v-model="addrepairform.if_urgent" label="2">否</el-radio>
        </el-form-item>
        <el-form-item
          label="上传图片"
          prop="if_urgent"
          class="setInline"
          :on-change="handleChange"
          :before-upload="beforeUpload"
        >
          <el-upload
            multiple
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2000kb</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <el-button type="success" @click="cancelDiag('addrepairshow')">取消</el-button>
      <el-button type="primary" @click="confirmaddrepair('addrepairshow')">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getPersonalInfo,
  editUserInfo,
  AddRepairOne
} from "@/api/personalCenter";
import {
  getUserFlows,
  getFlowTemplate,
  createEntry,
  getEntries,
  getUserFlowsApprovals
} from "@/api/getUserFlows";
import store from "@/store";

export default {
  name: "Dashboard",
  data() {
    return {
      fileList: [],
      addrepairform: {
        location: "",
        classroom: "",
        title: "",
        dept: "",
        repairdetail: "",
        status: "",
        if_urgent: "1",
        fileList: ""
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
      },
      addrepairshow: false,
      myApprovalTable: [],
      flow_id: "",
      flow_name: "",
      access_token: store.getters.access_token,
      checked: true,
      initDataloding: false,
      infoData: null,
      addItemList: [],
      formList: [],
      processDialogVisible: false,
      dialogVisible: false,
      topContent: [{ flowName: "报修", flowId: 999 }], // "待办事项", "通知提醒", "采购", "报损"
      span: "3",
      isDisable: true,
      username: "",
      email: "",
      personName: "",
      phone: "",
      sex: "",
      form: {},
      tableData: [
        {
          info: "[通知] xxxxxx (2019-xx-xx)"
        },
        {
          info: "[通知] xxxxxx (2019-xx-xx)"
        },
        {
          info: "[通知] xxxxxx (2019-xx-xx)"
        }
      ],
      applyTable: []
    };
  },
  computed: {
    ...mapGetters(["name", "userID", "token"])
  },
  created() {
    this.initDataloding = true;
    this.initData();
    this.getApplies();
    this.getApprovals();
    this.initDataloding = false;
  },

  methods: {
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
    },
    beforeUpload(file) {
      console.log(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleChange(file, fileList) {
      this.addrepairform.fileList = fileList;
    },
    getApplies() {
      getEntries({ access_token: this.access_token }).then(res => {
        console.log("===getEntries===");
        console.log(res);
        let list = res.data.slice(0, 3);
        let statusMap = { "0": "进行中", "9": "通过", "-1": "驳回" };
        for (let i of list) {
          let obj = {};
          let tempstr = "";
          tempstr += i.created_at.substring(5, 10) + "|" + i.title;
          obj.applyInfo = tempstr;
          obj.applyStatus = statusMap[i.status];
          this.applyTable.push(obj);
        }
      });
    },
    getApprovals() {
      console.log("---------");
      console.log({ access_token: this.access_token });
      getUserFlowsApprovals({ access_token: this.access_token }).then(res => {
        console.log("getUserFlowsApprovals");
        console.log(res.data.procs);
        let list = res.data.procs.slice(0, 3);
        let statusMap = {
          "0": "进行中",
          "9": "通过",
          "-1": "驳回",
          "-2": "已撤销",
          "-9": "草稿"
        };
        for (let i of list) {
          let obj = {};
          let tempstr = "";
          tempstr += i.updated_at.substring(5, 10) + "|" + i.entry.title;
          obj.applyInfo = tempstr;
          obj.applyStatus = statusMap[i.status];
          this.myApprovalTable.push(obj);
        }
        this.loading = false;
      });
    },
    clearAll() {},
    myApplyDetail() {
      let host = window.location.host;
      let uri = "http://" + host + "/#/emp";
      window.location = uri;
    },
    myApprovalDetail() {
      let host = window.location.host;
      let uri = "http://" + host + "/#/flow";
      window.location = uri;
    },
    fillFlowDetails(item, name) {
      if (name !== "报修") {
        this.flow_id = item;
        this.flow_name = name;
        getFlowTemplate({ accessToken: this.access_token, flow_id: item }).then(
          success => {
            this.formList = [];
            this.form = {};
            for (const i of success.data.template_forms) {
              const tempObj = {};
              tempObj.field_name = i.field_name;
              tempObj.field = i.field;
              tempObj.field_type = i.field_type;
              this.formList.push(tempObj);
            }
          },
          fail => {
            console.log(fail);
          }
        );
        this.processDialogVisible = true;
      } else if (name === "报修") {
        this.addrepairshow = true;
      }
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    formConfirmStatus() {
      console.log("access_token", this.access_token);
      console.log(this.flow_id);
      console.log(this.flow_name);
      console.log(this.form);
      let access_token = this.access_token;
      let flow_id = this.flow_id;
      let flow_name = this.flow_name;
      let tpl = this.form;
      let obj = { access_token, flow_id, flow_name, tpl };
      if (tpl["title"].trim()) {
        createEntry(obj).then(
          success => {
            console.log(success);
            this.$alert("<strong>请求成功</strong>", {
              dangerouslyUseHTMLString: true
            });
            this.applyTable = [];
            this.getApplies();
          },
          fail => {
            console.log(fail);
          }
        );
      } else {
        this.$alert("<strong>标题忘记填写了，请检查！</strong>", {
          dangerouslyUseHTMLString: true
        });
      }

      this.processDialogVisible = false;
    },
    confirmStatus() {
      this.dialogVisible = false;
      this.topContent = [];
      for (const i of this.addItemList) {
        if (i.checked === true) {
          this.topContent.push(i);
        } else {
          this.topContent = this.topContent.filter(
            item => item.flowId !== i.flowId
          );
        }
      }
    },
    initData() {
      getUserFlows({ access_token: this.accessToken }).then(res => {
        this.infoData = res.data;
        for (const i of this.infoData.flows) {
          console.log(i);
          const tempobj = {};
          tempobj.flowName = i.flow_name;
          tempobj.flowId = i.id;
          tempobj.checked = true;
          this.addItemList.push(tempobj);
          this.topContent.push({ flowName: i.flow_name, flowId: i.id });
        }
        // this.GET_USER_FLOWS(res.data.data);
        this.initDataloding = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.inputstyle {
  width: 330px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.top-item {
  cursor: pointer;
  border: 1px solid rgb(124, 184, 242);
  width: 60px;
  height: 60px;
  border-radius: 10px;
  font-size: 20px;
  color: rgb(124, 184, 242);
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-right: 10px;
  box-shadow: 2px 2px 3px 3px rgba(0, 0, 0, 0.1);
}

.top-item > div {
  text-align: center;
}
.item-marign-right {
  margin-right: 20px;
}
.status {
  display: flex;
  // border: 1px solid black;
  flex-direction: column;
}
.status > .status-first {
  margin-right: 30px;
  margin-bottom: 30px;
  // border: 1px solid blue;
  display: flex;
  // flex-wrap: wrap;
}

.status-second {
  // border: 1px solid yellow;
  display: flex;
  margin-right: 30px;
}

.addStyle {
  cursor: pointer;
}

.more {
  margin-left: 250px;
}

.myApplyDetail {
  display: flex;
  justify-content: space-between;
}
.setInline {
  display: inline-block;
}
</style>
