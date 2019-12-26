<template>
  <div class="app-container">
    <div class="app-container">
      <h2>用户管理</h2>
      <el-table
        :data="usersInfoTable"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelection"
      >
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="(item, i) in userTableTitle"
          v-bind:key="i"
          :type="item.type"
        >
          <!-- <el-table-column prop="choose" label="选择" type="selection" />
          <el-table-column prop="choose" label="选择" type="selection" />-->
        </el-table-column>
      </el-table>
    </div>

    <div class="block">
      <span class="demonstration">翻页</span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- @click="addRoles" -->
    <el-button type="primary">新增</el-button>
    <el-button type="success" @click="editUsers">编辑</el-button>
    <!-- @click="deleteRoles" -->
    <el-button type="info">删除</el-button>
    <el-dialog title="编辑用户" :visible.sync="editUsersShow" width="700px" :before-close="handleClose">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- :inline="true" -->

        <el-form-item label="姓名" prop="personName" class="setInline">
          <el-input v-model="ruleForm.personName" placeholder="请填写姓名"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="JobNumber" class="setInline">
          <el-input v-model="ruleForm.JobNumber" placeholder="请填写工号"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" class="setInline">
          <el-input v-model="ruleForm.phone" placeholder="请填写手机号"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="dept" class="setInline">
          <el-select v-model="ruleForm.dept" placeholder="请选择部门">
            <el-option
              :label="i.dept_name"
              :value="i.id"
              v-for="(i,index) in deptList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="setInline">
          <el-input v-model="ruleForm.password" placeholder="请填写密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" class="setInline">
          <el-input v-model="ruleForm.confirmPassword" placeholder="请重复填写密码"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender" class="setInline">
          <el-radio v-model="ruleForm.gender" label="1">男</el-radio>
          <el-radio v-model="ruleForm.gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="状态" prop="status" class="setInline ActiveStatus">
          <el-radio v-model="ruleForm.status" label="激活">激活</el-radio>
          <el-radio v-model="ruleForm.status" label="冻结">冻结</el-radio>
        </el-form-item>
      </el-form>

      <el-button type="success" @click="cancelDiag('editUsersShow')">取消</el-button>
      <el-button type="primary" @click="confirmEditUsers('editUsersShow')">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, getDpet } from "@/api/UserManagement.js";

import store from "@/store";
export default {
  data() {
    return {
      deptList: [],
      userid: "",
      username: "",
      role_id: "",
      dept_id: "",
      position: "",
      attendance_group_id: "",
      ruleForm: {
        personName: "",
        JobNumber: "",
        phone: "",
        dept: "",
        password: "",
        confirmPassword: "",
        status: "",
        gender: "1",
        role: ""
      },
      rules: {
        status: [{ required: true, message: "选择状态", trigger: "change" }],
        roles: [{ required: true, message: "选择角色", trigger: "change" }],
        confirmPassword: [
          {
            required: true,
            // message: "请重复填写密码",
            trigger: "change",
            validator: this.validatorRepeatPassword
          }
        ],
        password: [
          {
            required: true,
            message: "请填写密码",
            trigger: "change"
          }
        ],
        personName: [
          { required: true, message: "请填写姓名", trigger: "change" }
        ],
        JobNumber: [
          { required: true, message: "请填写工号", trigger: "change" }
        ],
        phone: [{ required: true, message: "请填写工号", trigger: "change" }],
        dept: [{ required: true, message: "请选择部门", trigger: "change" }]
      },
      total: 68,
      pageSizes: 10,
      pageSize: 10,
      currentPage: 1,
      userTableTitle: [
        { label: "选择", prop: "choose", type: "selection" },
        { label: "用户名", prop: "username" },
        { label: "姓名", prop: "name" },
        { label: "工号", prop: "workno" },
        { label: "email", prop: "email" },
        { label: "手机", prop: "mobile" },
        { label: "微信", prop: "wechat" },
        { label: "角色", prop: "role" },
        { label: "部门/组室", prop: "dept" },
        { label: "考勤组", prop: "attendance_group" },
        { label: "是否在职", prop: "leave" }
      ],
      access_token: store.getters.access_token,
      getUsersLoading: false,
      usersInfoTable: [],
      currentPage: 1,
      checkedList: [],
      editUsersShow: false
    };
  },
  watch: {},

  computed: {
    tableHeader: function() {
      return this.getTableHeader(this.tableYear, this.tableMonth);
    }
  },

  created() {
    this.fetchUsersData();
  },

  methods: {
    validatorRepeatPassword(rule, value, callback) {
      if (value === "") {
        callback(new Error("请重复输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次密码输入不同"));
      }
    },
    editUsers() {
      console.log(123);
      if (this.checkedList.length === 0) {
        this.$alert("未勾选，请选择一个选项")
          .then(() => {})
          .catch(() => {});
      } else if (this.checkedList.length >= 2) {
        this.$alert("只能选择一个选项")
          .then(() => {})
          .catch(() => {});
      } else {
        this.editUsersShow = true;
        let obj = { access_token: this.access_token };
        console.log(obj);
        getDpet(obj).then(res => {
          console.log(res.data);
          this.deptList = res.data;
        });
      }
    },
    confirmEditUsers(attr) {
      this.$confirm("确认提交？")
        .then(_ => {
          console.log(_);
          console.log("1233211");
          // console.log(this.ruleForm);
          // console.log(this.userid);
          console.log(this.ruleForm);
          let obj = {
            access_token: this.access_token,
            id: this.userid,
            username: this.username,
            name: this.ruleForm.personName,
            workno: this.ruleForm.JobNumber,
            gender: this.ruleForm.gender,
            mobile: this.ruleForm.phone,
            password: this.ruleForm.password,
            repassword: this.ruleForm.confirmPassword
          };
          console.log(obj);
          this[attr] = false;
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
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    handleSelection(val) {
      this.checkedList = val;
      if (this.checkedList.length === 1) {
        console.log(this.checkedList);
        this.ruleForm.dept = this.checkedList[0].dept;
        this.ruleForm.personName = this.checkedList[0].name;
        this.ruleForm.JobNumber = this.checkedList[0].workno;
        this.ruleForm.phone = this.checkedList[0].mobile;
        // this.ruleForm.dept_id = this.checkedList[0].mobile;
        this.userid = this.checkedList[0].id;
        this.username = this.checkedList[0].username;
        this.role_id = this.checkedList[0].role;
        this.dept_id = this.checkedList[0].dept_id;
        this.position = this.checkedList[0].position;
        this.attendance_group_id = this.checkedList[0].attendance_group_id;

        console.log(
          this.userid,
          this.username,
          this.role_id,
          this.dept_id,
          this.position,
          this.attendance_group_id
        );

        //         role_id: "",
        // dept_id: "",
        // position: "",
        // attendance_group_id: "",
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.usersInfoTable = [];
      this.fetchUsersData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.usersInfoTable = [];
      this.fetchUsersData();
    },
    fetchUsersData() {
      let access_token = this.access_token;
      let access_token_obj = {
        access_token: this.access_token,
        page: this.currentPage,
        num: this.pageSize
      };

      console.log("access_token_obj->", access_token_obj);
      this.getUsersLoading = true;

      let list = [
        "id",
        "username",
        "name",
        "workno",
        "email",
        "mobile",
        "wechat",
        "role",
        "dept",
        "attendance_group",
        "leave"
      ];

      getUsers(access_token_obj).then(success => {
        console.log("data----->");
        this.total = success.data.total;
        console.log(this.pageSize);
        console.log(success.data.list);

        for (let i of success.data.list) {
          let obj = {
            id: "",
            username: "",
            name: "",
            workno: "",
            email: "",
            mobile: "",
            wechat: "",
            role: "",
            dept: "",
            attendance_group: "",
            leave: ""
          };
          for (let j of list) {
            obj[j] = i[j];
            if (i["leave"] === 0) {
              obj["leave"] = "在职";
            } else {
              obj["leave"] = "离职";
            }
          }
          this.usersInfoTable.push(obj);
        }
        this.getUsersLoading = false;
      });
    }
  }
};
</script>
<style scoped>
.setInline {
  display: inline-block;
}
.ActiveStatus {
  margin-left: 45px;
}
</style>
