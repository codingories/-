<template>
  <div class="app-container">
    <!-- <h2>角色管理</h2> -->
    <!-- <h2>{{buttonPermission}}</h2> -->
    <!-- <h5>{{buttonPermission}}</h5> -->
    <el-table
      ref="multipleTable"
      :data="roleTable"
      style="width: 100%"
      @selection-change="handleSelection"
    >
      <el-table-column prop="choose" label="选择" type="selection" />
      <el-table-column prop="id" label="序号" width="180" />
      <el-table-column prop="name" label="角色名" width="180" />
      <el-table-column prop="remark" label="角色描述" />
      <el-table-column prop="isActive" label="是否激活">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="switchActive(scope.row.isActive, scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="assignUser" label="分配用户">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="assignment(scope.$index, scope.row)">分配</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="authorize(scope.$index, scope.row)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="addRoles">新增</el-button>
    <el-button type="success" @click="editRoles">编辑</el-button>
    <el-button type="info" @click="deleteRoles">删除</el-button>
    <el-dialog
      title="菜单列表"
      :visible.sync="authorizeTableVisible"
      width="30%"
      :before-close="handleCloseMenus"
    >
      <div class="treeContainer">
        <el-tree
          ref="tree"
          :data="authorizeTable"
          :default-checked-keys="defaultCheckedKeys"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
        />
      </div>
      <el-button type="success" @click="cancelDiagMenus('authorizeTableVisible')">取消</el-button>
      <el-button type="primary" @click="confirmAuthorizeTable">确认</el-button>
    </el-dialog>

    <el-dialog title="分配用户" :visible.sync="alignUserShow" width="60%" :before-close="handleClose">
      <!--<el-transfer v-model="transfer" :data="transferData"></el-transfer>-->
      <h3>当前角色:{{role}}</h3>
      <tree-transfer
        :title="treeTransferTitle"
        :from_data="fromData"
        :to_data="toData"
        :default-props="{ label: 'name' }"
        :mode="mode"
        height="540px"
        filter
        open-all
        @addBtn="add"
        @removeBtn="remove"
      />
      <el-button type="success" @click="cancelDiag('alignUserShow')">取消</el-button>
      <el-button type="primary" @click="confirmAlignUserTable">确认</el-button>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="editRolesShow" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="角色名">
          <el-input v-model="editForm.roleName" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.remark" />
        </el-form-item>
      </el-form>
      <el-button type="success" @click="cancelDiag('editRolesShow')">取消</el-button>
      <el-button type="primary" @click="confirmEditRoles">确认</el-button>
    </el-dialog>
    <el-dialog title="新增角色" :visible.sync="addRolesShow" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="角色名">
          <el-input v-model="editForm.roleName" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.remark" />
        </el-form-item>
      </el-form>
      <el-button type="success" @click="cancelDiag('addRolesShow')">取消</el-button>
      <el-button type="primary" @click="confirmAddRoles">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  getTotalMenuList,
  authorizeRoles,
  delRoles,
  frozenRole,
  getRoleInfo,
  getUsers,
  distributeUser
} from "@/api/RoleManagement.js";
import store from "@/store";
import treeTransfer from "el-tree-transfer"; // 引入
export default {
  components: { treeTransfer },
  data() {
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        });
      }
      return data;
    };

    return {
      defaultCheckedKeys: [],
      treeTransferTitle: ["全选", "全选"],
      mode: "transfer", // transfer addressList
      fromData: [],
      toData: [],
      role: "",
      transferData: generateData(),
      transfer: [1, 4],
      editForm: { roleName: "", remark: "" },
      addRolesShow: false,
      editRolesShow: false,
      alignUserTable: [],
      alignUserShow: false,
      authorizeTableVisible: false,
      defaultProps: {
        children: "children",
        label: "title"
      },
      authorizeTable: [],
      value: true,
      buttonPermission: store.getters.buttonPermission,
      access_token: store.getters.access_token,
      getRolesLoading: false,
      RawGroupData: [],
      roleTable: [],
      addAttendance: [],
      multipleSelection: [],
      rowId: "",
      rowName: "",
      alignIndex: "",
      alignRow: "",
      checkedList: []
    };
  },

  computed: {},
  watch: {},

  created() {
    this.fetchRoleData();
    this.getAuthorizeTable();
  },

  methods: {
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      this.fromData = fromData;
      this.toData = toData;
      console.log("obj:", obj);
    },
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      this.fromData = fromData;
      this.toData = toData;
      console.log("obj:", obj);
    },
    switchActive(isactive, id) {
      const tempoobj = {
        access_token: this.access_token,
        id: id,
        type: "users"
      };
      getRoleInfo(tempoobj).then(res => {
        console.log(res.data.user_list);
        console.log(!res.data.user_list);

        if (res.data.user_list.length === 0) {
          const obj = {
            access_token: this.access_token,
            id: id,
            is_active: isactive ? 1 : 0
          };
          frozenRole(obj).then(success => {
            console.log(success);
          });
        } else {
          // this.$alert('有用户了，无法进行激活操作')
        }
      });
    },

    handleSelection(val) {
      this.checkedList = val;
    },
    addRoles() {
      this.editForm.roleName = "";
      this.editForm.remark = "";
      const obj = {
        access_token: this.access_token,
        name: "",
        remark: "",
        menus: [25, 27]
      };
      this.addRolesObj = obj;
      this.addRolesShow = true;
    },
    confirmAddRoles() {
      this.$confirm("确认提交？")
        .then(_ => {
          if (!this.editForm.roleName) {
            this.$alert("名字不能为空!");
            return;
          }
          this.addRolesObj.name = this.editForm.roleName;
          this.addRolesObj.remark = this.editForm.remark;
          const tempId =
            this.roleTable.slice(
              this.roleTable.length - 1,
              this.roleTable.length
            )[0].id + 1;
          const obj = {
            id: tempId,
            name: this.addRolesObj.name,
            isActive: "false"
          };
          authorizeRoles(this.addRolesObj).then(res => {
            this.$alert("增加成功!");
            location.reload();
            // this.roleTable.push(obj);
            // this.editForm.roleName = "";
          });
        })
        .catch(_ => {});
      this.addRolesShow = false;
    },

    // 以下是编辑按钮
    editRoles() {
      if (this.checkedList.length === 0) {
        this.$alert("未勾选，请选择一个选项")
          .then(() => {})
          .catch(() => {});
      } else if (this.checkedList.length >= 2) {
        this.$alert("只能选择一个选项")
          .then(() => {})
          .catch(() => {});
      } else {
        console.log(this.checkedList[0]);
        // editForm: { roleName: "", remark: "" },
        this.editForm.roleName = this.checkedList[0].name;
        this.editForm.remark = this.checkedList[0].remark;

        const obj = {
          access_token: this.access_token,
          id: this.checkedList[0].id,
          name: this.checkedList[0].name,
          remark: this.checkedList[0].remark,
          menus: [25, 27]
        };
        this.sendRolesObj = obj;
        this.editRolesShow = true;
      }
    },
    confirmEditRoles() {
      this.$confirm("确认提交？")
        .then(_ => {
          if (!this.editForm.roleName) {
            this.$alert("名字不能为空!");
            return;
          }
          this.sendRolesObj.name = this.editForm.roleName;
          this.sendRolesObj.remark = this.editForm.remark;
          const obj = this.sendRolesObj;
          this.checkedList[0].name = this.editForm.roleName;
          authorizeRoles(obj).then(res => {
            this.$alert("编辑成功!");
            location.reload();
          });
          console.log("==-=-=-=编辑");
        })
        .catch(_ => {});
      this.editRolesShow = false;
    },
    // 以上是编辑按钮
    // 以下是删除按钮
    deleteRoles() {
      if (this.checkedList.length === 0) {
        this.$alert("未勾选，请选择一个选项")
          .then(() => {})
          .catch(() => {});
      } else {
        this.$confirm("确认提交？")
          .then(_ => {
            let flag = true;
            for (const i of this.checkedList) {
              if (!i.assignUser) {
                continue;
              } else {
                flag = false;
                break;
              }
            }

            const obj = {
              access_token: this.access_token
            };

            if (flag) {
              for (const i of this.checkedList) {
                obj.id = i.id;
                console.log(obj);
                this.roleTable = this.roleTable.filter(item => {
                  return item.id != obj.id;
                });
                delRoles(obj)
                  .then(() => {
                    console.log("--删除成功--");
                  })
                  .catch(this.$alert("有角色分配用户了，无法进行删除操作"));
              }
              // console.log('开始发送删除请求')
            }
            // else {
            //   this.$alert("有角色分配用户了，无法进行删除操作");
            // }
          })
          .catch(_ => {});
      }
    },
    confirmAuthorizeTable(done) {
      this.$confirm("确认提交？")
        .then(_ => {
          const menus0 = this.$refs.tree.getCheckedKeys().map(function(x) {
            return parseInt(x);
          });
          // const menus1 = this.$refs.tree.getHalfCheckedKeys().map(function(x) {
          //   return parseInt(x);
          // });
          // let menus = menus0.concat(menus1);
          let menus = menus0;
          const obj = {
            access_token: this.access_token,
            id: this.rowId,
            name: this.rowName,
            menus: menus
          };
          console.log("000");
          console.log(obj);
          authorizeRoles(obj).then(res => {
            console.log(obj);
            this.$alert("授权成功!");
          });
          this.authorizeTableVisible = false;
        })
        .catch(_ => {});
    },
    cancelDiag(attr) {
      this.$confirm("确认取消？")
        .then(_ => {
          // this.defaultCheckedKeys = [];
          this[attr] = false;
        })
        .catch(_ => {});
    },
    cancelDiagMenus(attr) {
      this.$confirm("确认取消？")
        .then(_ => {
          // this.defaultCheckedKeys = [];
          this.$refs.tree.setCheckedKeys([]);
          this[attr] = false;
        })
        .catch(_ => {});
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          // this.defaultCheckedKeys = [];
          done();
        })
        .catch(_ => {});
    },
    handleCloseMenus(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          // this.defaultCheckedKeys = [];
          this.$refs.tree.setCheckedKeys([]);
          done();
        })
        .catch(_ => {});
    },
    getAuthorizeTable() {
      // 获取授权列表
      const access_token = this.access_token;
      const access_token_obj = { access_token: this.access_token };
      getTotalMenuList(access_token_obj).then(res => {
        console.log("获取授权列表");
        console.log(res.data);
        this.authorizeTable = res.data;
      });
    },
    authorize(index, row) {
      // 授权
      this.authorizeTableVisible = true;
      this.rowId = row.id;
      this.rowName = row.name;
      const tempobjmenus = {
        access_token: this.access_token,
        id: parseInt(row.id),
        type: "menus"
      };
      console.log("---------------===天气不错");
      getRoleInfo(tempobjmenus).then(res => {
        console.log(res.data.menu_list);
        // let ids = res.data.menu_list.map(v => v.id);
        // console.log(ids);
        let templist = [];
        for (let i of res.data.menu_list) {
          // console.log(i.children.map(v => v.id));
          let j = i.children.map(v => v.id);
          Array.prototype.push.apply(templist, j);
        }
        console.log(templist);
        this.defaultCheckedKeys = templist;
      });
    },
    fetchRoleData() {
      const access_token = this.access_token;
      const access_token_obj = { access_token: this.access_token };
      this.getRolesLoading = true;
      getRoles(access_token_obj).then(res => {
        this.getRolesLoading = false;
        console.log("res.data的data");
        console.log(res.data);
        for (const i of res.data) {
          const obj = {};
          obj.id = i.id;
          obj.name = i.name;
          obj.isActive = i.is_active === 1;
          obj.remark = i.remark;
          this.roleTable.push(obj);
        }
      });
    },
    // 分配用户模块
    assignment(index, row) {
      console.log(index, row);
      this.role = row.name;
      console.log(index, row.id);

      this.alignIndex = index;
      this.alignRow = row;
      this.getAllUsers();
      this.alignUserShow = true;

      const tempobj = {
        access_token: this.access_token,
        id: parseInt(row.id),
        type: "users"
      };

      getRoleInfo(tempobj).then(res => {
        const ccc = JSON.stringify(res.data.user_list).replace(
          /\"name\":null/g,
          '"name":"其他"'
        );
        const ddd = ccc.replace(/\"id\":null/g, '"id":999');
        const eee = JSON.parse(ddd.replace(/\"pid\":null/g, '"pid":999'));

        this.toData = eee;
        // this.toData.push(res.data.user_list[0]);
        console.log(res.data.user_list[0]);
        console.log("this.fromData.pop(res.data.user_list[0])");
        console.log(this.fromData);
        console.log(this.toData);
        // this.fromData = [];
        // let a = this.fromData;
        // console.log(a);
        this.fromData = this.filterObj(this.fromData, this.toData);
        // this.fromData = setTimeout(this.filterObj(a, this.toData), 100);
        // console.log(this.fromData.pop(res.data.user_list[0]));
      });
    },
    getAllUsers() {
      const obj = {
        access_token: this.access_token
      };
      getUsers(obj).then(res => {
        const ccc = JSON.stringify(res.data).replace(
          /\"name\":null/g,
          '"name":"其他"'
        );
        const ddd = ccc.replace(/\"id\":null/g, '"id":999');
        const eee = JSON.parse(ddd.replace(/\"pid\":null/g, '"pid":999'));

        this.fromData = eee;
      });
    },
    filterObj(c, d) {
      let numberList = [];
      let indexList = [];
      for (let i = 0; i < c.length; i++) {
        for (let j = 0; j < d.length; j++) {
          if (c[i].id === d[j].id) {
            let obj = {};
            console.log(i, j, c[i].id, d[j].id);
            indexList.push(i);
            numberList.push(obj);
          }
        }
      }

      let tempnamelist = {};
      for (let i of d) {
        for (let j of i.children) {
          let name = j.name;
          tempnamelist[name] = null;
        }
      }
      console.log(tempnamelist);

      let ids = [];
      for (let i = 0; i < d.length; i++) {
        for (let j = 0; j < d[i].children.length; j++) {
          ids.push(d[i].children[j].id);
        }
      }

      // let e = c[1].children;
      // let filterE = e.filter(i => {
      //   return i.name in numberList;
      // });
      for (let i of indexList) {
        c[i].children = c[i].children.filter(i => {
          return !(i.name in tempnamelist);
        });
      }
      return c;
    },
    confirmAlignUserTable() {
      this.$confirm("确认提交？")
        .then(_ => {
          const obj = {
            access_token: this.access_token,
            role_id: this.alignRow.id
          };
          const templist = [];
          for (const i of this.toData) {
            for (const j of i.children) {
              templist.push(j.id);
            }
          }
          obj.users = templist;

          if (obj.users.length === 0) {
            this.$alert("当前未选择用户");
          } else {
            distributeUser(obj).then(() => {
              this.$alert("修改成功");
              this.alignUserShow = false;
              this.fromData = [];
              this.toData = [];
              // this.defaultCheckedKeys = [];
              this.$refs.tree.setCheckedKeys([]);
            });
          }

          // this.alignUserShow = false

          // const menus = this.$refs.alignTree.getCheckedNodes()
          // let str = ''
          // const section = { '工程部': '', '教研部': '', '售后部': '', '客服部': '' }
          // for (const i of menus) {
          //   if (i.title in section) {
          //   } else {
          //     str += i.title + ','
          //   }
          // }
          // this.alignRow['assignUser'] = str
          // this.$set(this.roleTable, this.alignIndex, this.alignRow)
          // this.$refs.alignTree.setCheckedKeys([])
        })
        .catch(_ => {});
    }
  } // 注册
};
</script>

<style scoped>
.treeContainer {
  height: 450px;
  overflow-y: scroll;
}
.authorizeUser {
  cursor: pointer;
}
</style>
