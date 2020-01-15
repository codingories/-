<template>
  <div class="app-container">
    <!-- <h2>{{title}}</h2> -->
    <div class="page1" v-if="pageFlag">
      <h2>{{title}}</h2>
      <el-button type="primary" @click="receive">领用</el-button>
      <el-button type="primary" @click="distribute">下发</el-button>
      <el-table
        :data="gradeInfoTable"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelection"
      >
        <el-table-column prop="choose" label="Column1" />
        <el-table-column prop="id" label="Column2" />
        <el-table-column prop="school" label="Column3" />
      </el-table>

      <div class="block">
        <span class="demonstration">翻页</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 100]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <div class="page2" v-if="!pageFlag1">
      <el-button type="primary" @click="goback1">返回</el-button>
      <el-table
        :data="gradeInfoTable1"
        style="width: 40%"
        ref="multipleTable"
        @selection-change="handleSelection"
      >
        <el-table-column prop="choose" label="申领部门" />
        <el-table-column prop="id" label="申领人" />
        <el-table-column prop="school" label="查询">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="choosereceiver(scope.$index, scope.row)"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <h2>领用物品</h2>
      <div class="secondpage">
        <el-form :model="warehouseform" ref="warehouseform" label-width="100px" class="goodscode">
          <el-form-item label="物品编码" prop="dept" class="setInline">
            <el-input v-model="ruleForm.personName" placeholder="物品编号" style="width:400px"></el-input>
          </el-form-item>
          <el-button type="primary">手工选择</el-button>
        </el-form>
        <el-table
          :data="gradeInfoTable"
          style="width: 100%"
          ref="multipleTable"
          @selection-change="handleSelection"
        >
          <el-table-column prop="choose" label="序号" />
          <el-table-column prop="id" label="编码" />
          <el-table-column prop="school" label="物品" />
          <el-table-column prop="grade" label="品牌" />
          <el-table-column prop="class" label="类别" />
          <el-table-column prop="class" label="规格" />
          <el-table-column prop="number" label="数量" width="200">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.number"
                @change="addminusvalue(scope.row.number)"
                :min="1"
                label="数量"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="class" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="DeleteGood(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="block">
          <span class="demonstration">翻页</span>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 100]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <section class="footer">
          <el-button type="primary">领用</el-button>
          <el-button type="danger">取消</el-button>
        </section>
      </div>
    </div>
    <div class="page3" v-if="!pageFlag2">
      <el-button type="primary" @click="goback2">返回</el-button>
      <el-table
        :data="gradeInfoTable1"
        style="width: 40%"
        ref="multipleTable"
        @selection-change="handleSelection"
      >
        <el-table-column prop="choose" label="申领部门" />
        <el-table-column prop="id" label="班级数" />
        <el-table-column prop="school" label="查询">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="DeleteGood(scope.$index, scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <h2>下发物品</h2>
      <div class="secondpage">
        <el-form :model="warehouseform" ref="warehouseform" label-width="100px" class="goodscode">
          <el-form-item label="物品编码" prop="dept" class="setInline">
            <el-input v-model="ruleForm.personName" placeholder="物品编号" style="width:400px"></el-input>
          </el-form-item>
          <el-button type="primary">手工选择</el-button>
        </el-form>
        <el-table
          :data="gradeInfoTable"
          style="width: 100%"
          ref="multipleTable"
          @selection-change="handleSelection"
        >
          <el-table-column prop="choose" label="序号" />
          <el-table-column prop="id" label="编码" />
          <el-table-column prop="school" label="物品" />
          <el-table-column prop="grade" label="品牌" />
          <el-table-column prop="class" label="分类" />
          <el-table-column prop="class" label="规格" />
          <el-table-column prop="number" label="数量" width="200">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.number"
                @change="addminusvalue(scope.row.number)"
                :min="1"
                label="数量"
              ></el-input-number>
            </template>
          </el-table-column>

          <el-table-column prop="class" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="DeleteGood(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="block">
          <span class="demonstration">翻页</span>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 100]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <section class="footer">
          <el-button type="primary">下发</el-button>
          <el-button type="danger">取消</el-button>
        </section>
      </div>
    </div>
    <el-dialog title="选择" :visible.sync="chooseshow" width="400px" :before-close="handleClose">
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="receivertree"
        highlight-current
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelreceiver">取 消</el-button>
        <el-button type="primary" @click="confirmreceiver">确 定</el-button>
      </span>
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
      data: [
        {
          id: 1,
          label: "部门一",
          children: [
            {
              id: 4,
              label: "特朗普"
            }
          ]
        },
        {
          id: 2,
          label: "部门二",
          children: [
            {
              id: 5,
              label: "习近平"
            },
            {
              id: 6,
              label: "金正嗯"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      chooseshow: false,
      pageFlag: "true",
      pageFlag1: "false",
      pageFlag2: "false",
      title: "出库详情",
      buttonPermission: store.getters.buttonPermission,
      gradeInfoTable: [
        { id: 1, gradename: "小班", ifGraduation: "否" },
        { id: 2, gradename: "中班", ifGraduation: "否" },
        { id: 3, gradename: "大班", ifGraduation: "否" }
      ],
      gradeInfoTable1: [{ id: 1, gradename: "小班", ifGraduation: "否" }],
      warehouseform: {
        warehouse: "",
        suppliers: "",
        purchasingmethod: ""
      },

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
    cancelreceiver() {
      this.chooseshow = false;
      this.$refs.receivertree.setCheckedKeys([]);
    },
    confirmreceiver() {
      this.chooseshow = false;
      this.$refs.receivertree.setCheckedKeys([]);
    },
    choosereceiver() {
      console.log(111);
      this.chooseshow = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    receive() {
      console.log("123");
      this.pageFlag = !this.pageFlag;
      this.pageFlag1 = !this.pageFlag1;
    },
    distribute() {
      this.pageFlag = !this.pageFlag;
      this.pageFlag2 = !this.pageFlag2;
    },
    goback1() {
      this.pageFlag = !this.pageFlag;
      this.pageFlag1 = !this.pageFlag1;
    },
    goback2() {
      this.pageFlag = !this.pageFlag;
      this.pageFlag2 = !this.pageFlag2;
    },
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
/* .page1 {
  border: 1px solid red;
}
.page2 {
  border: 1px solid yellow;
}
.page3 {
  border: 1px solid green;
} */
</style>
