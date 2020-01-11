<template>
  <div class="app-container">
    <h2>{{title}}</h2>
    <el-table
      :data="gradeInfoTable"
      style="width: 100%"
      ref="multipleTable"
      @selection-change="handleSelection"
    >
      <el-table-column prop="choose" label="选择" type="selection" />
      <el-table-column prop="id" label="年级编号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="Session" label="届次名称" />
      <el-table-column prop="schoolyear" label="入学年" />
      <el-table-column prop="graduationyear" label="毕业年" />
      <el-table-column prop="ifGraduation" label="是否毕业年" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="createtime" label="创建时间" />
      <el-table-column prop="updatetime" label="更新时间" />

      <el-table-column prop="handle" label="操作" width="230">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="addMenus(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="success" @click="EditMenu(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="DeleteMenu(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary">增加</el-button>

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
    <el-button type="primary" v-if="hasPermission('增加')">增加</el-button>
    <el-button type="success" v-if="hasPermission('修改')" @click="editUsers">编辑</el-button>
    <!-- @click="deleteRoles" -->
    <el-button type="info" v-if="hasPermission('删除')">删除</el-button>
    <el-dialog title="编辑用户" :visible.sync="editUsersShow" width="700px" :before-close="handleClose">
      <!-- <h4>{{ruleForm}}</h4> -->
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
          <el-select v-model="ruleForm.dept_id" placeholder="请选择部门">
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
import {
  getUsers,
  getDpet,
  getRoles,
  getAttendance,
  saveuserinfo,
  getMenus
} from "@/api/UserManagement.js";
import buttonpermission from "@/mixins/buttonpermission.js";

import store from "@/store";
export default {
  data() {
    return {
      title: "年级管理",
      buttonPermission: store.getters.buttonPermission,
      gradeInfoTable: [
        { id: 1, gradename: "小班", ifGraduation: "否" },
        { id: 2, gradename: "中班", ifGraduation: "否" },
        { id: 3, gradename: "大班", ifGraduation: "否" }
      ],
      attendancemap: {},
      rolemap: {},
      deptList: [],
      userid: "",
      username: "",
      role_id: [],
      dept_id: 0,
      position: "",
      attendance_group_id: "",
      ruleForm: {
        personName: "",
        JobNumber: "",
        phone: "",
        dept_id: "",
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
      total: 10,
      pageSizes: 10,
      pageSize: 10,
      currentPage: 1,
      userTableTitle: [
        { label: "选择", prop: "choose", type: "selection" },
        { label: "id", prop: "id" },
        { label: "年级名称", prop: "gradename" },
        { label: "是否毕业年", prop: "ifGraduation" },
        { label: "操作", prop: "handle", type: "selection" }
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
  mixins: [buttonpermission],

  computed: {
    tableHeader: function() {
      return this.getTableHeader(this.tableYear, this.tableMonth);
    }
    // buttonfunctionlist: function() {
    //   // for(let i of this.mocklist)
    //   let k;
    //   let title = this.tilte;
    //   for (let i of this.mocklist) {
    //     k = i.children.filter(v => v.title === this.title);
    //   }
    //   let buttonlist = k[0].children.map(v => v.title);
    //   return buttonlist;
    // }
  },

  created() {
    this.getbuttonmenus();
    this.fetchUsersData();
    this.getRolesList();
    this.getAttendanceList();
    this.getDepartment();
  },

  methods: {
    hasPermission(permission) {
      console.log("permission");
      console.log(permission);
      let flag = false;
      for (let i of this.buttonfunctionlist) {
        console.log(i);
        if (i === permission) {
          flag = true;
        }
      }
      return flag;
    },
    getbuttonmenus() {
      let access_token = this.access_token;
      let obj = { access_token };

      getMenus(obj).then(success => {
        console.log("getMenus");
        console.log(success.data);
        let controllist = success.data;
      });
    },
    getAttendanceList() {
      let access_token = this.access_token;
      let obj = { access_token };
      getAttendance(obj).then(success => {
        for (let i of success.data) {
          this.$set(this.attendancemap, i.name, i.id);
        }
      });
    },
    getRolesList() {
      let access_token = this.access_token;
      let obj = { access_token };
      getRoles(obj).then(success => {
        for (let i of success.data) {
          this.$set(this.rolemap, i.name, i.id);
        }
      });
    },
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
      }
    },
    getDepartment() {
      let obj = { access_token: this.access_token };
      console.log(obj);
      getDpet(obj).then(res => {
        this.deptList = res.data;
      });
    },
    confirmEditUsers(attr) {
      this.$confirm("确认提交？")
        .then(_ => {
          console.log(_);
          console.log("1233211");
          // console.log(this.ruleForm);
          // console.log(this.userid);

          // console.log(this.ruleForm);
          let obj = {
            access_token: this.access_token,
            id: this.userid,
            username: this.username,
            name: this.ruleForm.personName,
            workno: this.ruleForm.JobNumber,
            gender: this.ruleForm.gender,
            mobile: this.ruleForm.phone,
            password: this.ruleForm.password,
            repassword: this.ruleForm.confirmPassword,
            role_id: this.role_id,
            dept_id: this.ruleForm.dept_id,
            attendance_group_id:
              this.attendancemap[this.ruleForm.attendance_group_id] || 0
          };
          // let role_id = this.role_id
          obj.role_id = [];
          console.log(obj);

          // let obj = {
          //   access_token: this.access_token,
          //   id: this.userid,
          //   username: this.username,
          //   name: this.ruleForm.personName,
          //   dept_id: this.ruleForm.dept_id
          // };

          console.log("objobjobj1234");
          console.log(obj);
          // let obj = { id: 38, username: "guwq", dept_id: 9, name: "顾文取" };
          // obj.access_token = this.access_token;

          saveuserinfo(obj).then(success => {
            // console.log(success);
            location.reload();
          });
          // this[attr] = false;
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

        this.role_id = this.checkedList[0].role.map(v => this.rolemap[v]);
        this.ruleForm.attendance_group_id = this.checkedList[0].attendance_group;

        let tempdept = this.checkedList[0].dept;
        if (typeof tempdept === "string") {
          console.log("这个是string");
          this.ruleForm.dept_id = this.deptList.filter(
            v => v.dept_name === tempdept
          )[0].id;
        }
        // this.dept_id = this.checkedList[0].dept;

        this.position = this.checkedList[0].position;

        console.log(this.role_id);

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
        // this.total = success.data.total;
        this.total = 10;
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
