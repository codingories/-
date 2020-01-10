<!--suppress ALL -->
<template>
  <div class="app-container">
    <!-- {{ menuTable }} -->
    <!--{{idLayer}}-->
    <el-table
      :data="menuTable"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :default-expand-all="true"
    >
      <el-table-column prop="title" label="菜单名称" width="180" />
      <el-table-column prop="uri" label="链接" width="240" />
      <el-table-column prop="icon" label="icon" width="100" />
      <el-table-column prop="address" label="备注" />
      <el-table-column prop="address" label="操作" width="230">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="addMenus(scope.$index, scope.row)">增加</el-button>
          <el-button size="mini" type="success" @click="EditMenu(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="DeleteMenu(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="调整顺序">
        <template slot-scope="scope" width="150">
          <el-button size="mini" type="primary" circle @click="handleUp(scope.$index, scope.row)">
            <i class="el-icon-arrow-up" />
          </el-button>
          <el-button size="mini" type="success" circle @click="handleDown(scope.$index, scope.row)">
            <i class="el-icon-arrow-down" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="增加菜单" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <el-table :data="editTable" style="width: 100%">
        <el-table-column prop="menuName" label="菜单名称" width="180">
          <template slot-scope="scope">
            <el-input v-model="editTable[0].menuName" />
          </template>
        </el-table-column>
        <el-table-column prop="link" label="链接" width="180">
          <template slot-scope="scope">
            <el-input v-model="editTable[0].link" />
          </template>
        </el-table-column>
        <el-table-column prop="props" label="icon">
          <template slot-scope="scope">
            <el-select v-model="editTable[0].icon" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px; line-height:34px">
                  <svg class="icon">
                    <use :xlink:href="'#' + item.icon" />
                  </svg>
                </span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input v-model="editTable[0].remark" />
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="增加三级菜单" :visible.sync="thirdmenuflag" width="80%" :before-close="handleClose">
      <el-table :data="editTable" style="width: 100%">
        <el-table-column prop="menuName" label="菜单名称" width="180">
          <template slot-scope="scope">
            <el-input v-model="editTable[0].menuName" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input v-model="editTable[0].remark" />
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddthird">取 消</el-button>
        <el-button type="primary" @click="confirmAddthird">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改菜单" :visible.sync="EditVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="editMenuList" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="editMenuList.menuName" />
        </el-form-item>
        <el-form-item label="菜单链接">
          <el-input v-model="editMenuList.menuLink" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择增加二级菜单还是三级菜单"
      :visible.sync="secondmenuflag"
      width="30%"
      :before-close="handleClose"
    >
      <!-- <el-form ref="form" :model="editMenuList" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="editMenuList.menuName" />
        </el-form-item>
        <el-form-item label="菜单链接">
          <el-input v-model="editMenuList.menuLink" />
        </el-form-item>
      </el-form>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="choosesecondmenu">二级菜单</el-button>
        <el-button type="primary" @click="choosethirdmenu">三级菜单</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMenus, saveMenu, delMenu, sortmenu } from "@/api/menu-manage";
import store from "@/store";

export default {
  data() {
    return {
      secondrowid: "",
      thirdmenuflag: false,
      secondmenuflag: false,
      options1: [
        {
          value: "calendar",
          label: "calendar",
          icon: "el-calendar"
        },
        {
          value: "dashboard",
          label: "dashboard",
          icon: "el-dashboard"
        },
        {
          value: "example",
          label: "example",
          icon: "el-example"
        },
        {
          value: "eye-open",
          label: "eye-open",
          icon: "el-eye-open"
        },
        {
          value: "eye",
          label: "eye",
          icon: "el-eye"
        },
        {
          value: "form",
          label: "form",
          icon: "el-form"
        },
        {
          value: "link",
          label: "link",
          icon: "el-link"
        },
        {
          value: "nested",
          label: "nested",
          icon: "el-nested"
        },
        {
          value: "password",
          label: "password",
          icon: "el-password"
        },
        {
          value: "table",
          label: "table",
          icon: "el-table"
        },
        {
          value: "tree",
          label: "tree",
          icon: "el-tree"
        },
        {
          value: "user",
          label: "user",
          icon: "el-user"
        }
      ],
      value1: "",
      editTable: [
        {
          menuName: "",
          link: "",
          icon: "",
          remark: ""
        }
      ],
      model: {},
      Expand: true,
      menuTable: [],
      tree: "home",
      options: [],
      originData: [],
      editMenuList: {
        menuName: "",
        menuLink: ""
      },
      access_token: store.getters.access_token,
      dialogVisible: false,
      EditVisible: false,
      idLayer: []
    };
  },

  computed: {},
  watch: {},

  created() {
    this.getTableMenus();
  },

  methods: {
    cancelAddthird() {
      console.log("取消增加三级菜单");
      this.thirdmenuflag = false;
    },
    confirmAddthird() {
      console.log("确认增加三级菜单");
      console.log(this.editTable[0].menuName, this.editTable[0].remark);

      if (
        this.editTable[0].menuName !== "" &&
        this.editTable[0].remark !== ""
      ) {
        this.$confirm("确认增加？").then(_ => {
          console.log("确认");
          console.log(parseInt(this.secondrowid));
          let parent_id = parseInt(this.secondrowid);
          const obj = {
            access_token: this.access_token,
            parent_id: parent_id,
            title: this.editTable[0].menuName,
            remark: this.editTable[0].remark
          };
          saveMenu(obj).then(
            res => {
              location.reload();
            },
            fail => {}
          );
          this.editTable[0].menuName = "";
          this.editTable[0].remark = "";
        });
      } else {
        this.$alert("有未填写的参数");
      }

      // if (
      //   this.editTable[0].menuName !== "" &&
      //   this.editTable[0].link !== "" &&
      //   this.editTable[0].icon !== "" &&
      //   this.editTable[0].remark !== ""
      // ) {
      //   this.$confirm("确认增加？")
      //     .then(_ => {
      //       console.log("------");
      //       console.log(this.layer);
      //       let id;
      //       if (this.layer.length === 2) {
      //         id = 0;
      //       } else if (this.layer.length === 3) {
      //         id = this.layer.slice(2, 3)[0];
      //       }
      //       console.log(id);
      //       const obj = {
      //         access_token: this.access_token,
      //         parent_id: id,
      //         title: this.editTable[0].menuName,
      //         uri: this.editTable[0].link,
      //         icon: this.editTable[0].icon,
      //         remark: this.editTable[0].remark
      //       };
      //       console.log(obj);
      //       saveMenu(obj).then(
      //         res => {
      //           location.reload();
      //         },
      //         fail => {}
      //       );

      //       this.editTable[0].menuName = "";
      //       this.editTable[0].link = "";
      //       this.editTable[0].icon = "";
      //       this.editTable[0].remark = "";
      this.thirdmenuflag = false;
    },
    choosesecondmenu() {
      console.log("二级菜单");
      this.secondmenuflag = false; // 二级菜单关闭
      // this.layer = this.findLayerIndex(row.title);
      this.dialogVisible = true;
    },
    choosethirdmenu() {
      console.log("三级菜单");
      this.secondmenuflag = false; // 显示二级菜单关闭
      this.thirdmenuflag = true;
    },
    EditMenu(index, row) {
      console.log(index, row);
      this.EditVisible = true;
      this.editId = row.id;
      this.layer = this.findLayerIndex(row.id);
      console.log("====this.layer");
      console.log(this.layer);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    findLayer(id) {
      // 找到点的是第几层的第几个
      const index = this.menuTable.findIndex(e => {
        return e["id"] === id;
      });
      if (index !== -1) {
        return [index, -1];
      } else {
        for (let i = 0; i < this.menuTable.length; i++) {
          for (let j = 0; j < this.menuTable[i].children.length; j++) {
            if (this.menuTable[i].children[j].id === id) {
              return [i, j, this.menuTable[i].children.length];
            }
          }
        }
      }
    },
    findLayerIndex(id) {
      // 找到点的是第几层的第几个
      console.log("findLayerIndex的title");
      console.log(id);
      const index = this.menuTable.findIndex(e => {
        return e["id"] === id;
      });
      console.log("index,index,index");
      console.log(index);
      console.log(this.menuTable[index]);
      console.log(!!this.menuTable[index]);

      // ||  !!this.menuTable[index].children

      // && (!!this.menuTable[index] || !!this.menuTable[index].children)
      console.log("index", index);
      if (index !== -1) {
        // 表明这个点击的是第一层
        console.log("-1-1-1");
        console.log(this.menuTable[index]);
        console.log(this.menuTable[index].children);
        if (!!this.menuTable[index] && !!this.menuTable[index].children) {
          console.log("有children,找到第几个");
          console.log([index, -1]);
          return [index, -1]; // 有children的情况
        } else {
          return [0, 0, this.menuTable[index].id]; // 没有children的情况
        }
      } else {
        for (let i = 0; i < this.menuTable.length; i++) {
          if (!!this.menuTable[i].children) {
            for (let j = 0; j < this.menuTable[i].children.length; j++) {
              if (this.menuTable[i].children[j].id === id) {
                console.log("找到了第二层的id");
                console.log([i, j, this.menuTable[i].id]);
                return [i, j, this.menuTable[i].id];
              } else {
                // console.log("去找第三层id");
                // console.log(id);
                // console.log(id);
                // console.log(this.menuTable[i].children[j].children); // 这个就是三级菜单的列表
                // for (let k of this.menuTable[i].children[j].children) {

                // }

                // console.log('')
                let templist = this.menuTable[i].children[j].children.filter(
                  v => v.id === id
                );
                if (templist.length === 1) {
                  // let finderthird = j;
                  // console.log("finderthird");
                  // console.log(i, j);
                  // console.log(this.menuTable[i].children[j]);
                  // console.log(this.menuTable[i].children[j].id);
                  return [0, i, j, this.menuTable[i].children[j].id]; // 四位的length代表了点的第三层，i代表顶，j代表2，最后为三级的id
                }
                // if (templist.length === 1) {
                //   console.log(templist);
                // }
              }
            }
          }
        }
      }
    },
    upDown(a, b, upBorder, downBorder, step) {
      const id = b.id;
      const TemperMenuTable = this.menuTable;
      const Layer = this.findLayer(id);
      const layerIndex1 = Layer.slice(0, 1)[0];
      const layerIndex2 = Layer.slice(1, 2)[0];
      if (layerIndex1 !== upBorder && layerIndex2 === -1) {
        const index1 = layerIndex1;
        const index2 = layerIndex1 + step;
        TemperMenuTable.splice(
          index2,
          1,
          ...TemperMenuTable.splice(index1, 1, TemperMenuTable[index2])
        );
      } else if (layerIndex2 !== -1 && layerIndex2 !== downBorder) {
        // (layerIndex1 !== 0) &&
        const index0 = layerIndex1;
        const index1 = layerIndex2;
        const index2 = layerIndex2 + step;
        const TempList = TemperMenuTable.slice(index0, index0 + 1)[0].children;
        TempList.splice(
          index2,
          1,
          ...TempList.splice(index1, 1, TempList[index2])
        );
        const tempTable = this.menuTable[index0];
        tempTable.children = TempList;
        this.$set(this.menuTable, index0, tempTable);
      }
    },
    handleUp(a, b) {
      console.log(a, b);
      this.upDown(a, b, 0, 0, -1);
      console.log(this.menuTable);
      let menus = [];
      for (let i of this.menuTable) {
        menus.push(i.id);
        // console.log(i)
        for (let j of i.children) {
          menus.push(j.id);
        }
      }
      console.log(menus);
      let access_token = this.access_token;
      console.log(access_token);
      let obj = { access_token, menus };
      sortmenu(obj).then(success => {
        console.log(success);
        // location.reload();
      });
    },
    handleDown(a, b) {
      const id = b.id;
      const length = this.findLayer(id).slice(2, 3)[0];
      const upBorder = this.menuTable.length - 1;
      let downBorder;
      if (length === undefined) {
        downBorder = -1;
      } else if (length === 1) {
        downBorder = 0;
      } else {
        downBorder = length - 1;
      }
      this.upDown(a, b, upBorder, downBorder, 1);
      console.log(this.menuTable);
      let menus = [];
      for (let i of this.menuTable) {
        menus.push(i.id);
        // console.log(i)
        for (let j of i.children) {
          menus.push(j.id);
        }
      }
      console.log(menus);
      let access_token = this.access_token;
      console.log(access_token);
      let obj = { access_token, menus };
      sortmenu(obj).then(success => {
        // location.reload();
        console.log(success);
      });
    },
    getTableMenus() {
      const obj = { access_token: this.access_token };
      getMenus(obj).then(res => {
        console.log("getTableMenusgetTableMenusgetTableMenus");
        console.log(res.data);
        this.menuTable = res.data;
        for (const i of this.menuTable) {
          const str = i.id + "-0";
          this.idLayer.push(str);
          if (!!i.children) {
            for (const j of i.children) {
              this.idLayer.push(i.id + "-" + j.id);
            }
          }
        }
      });
    },
    addMenus(index, row) {
      console.log(row);
      console.log(index, row.id);
      this.secondrowid = row.id;
      console.log(typeof row.id);

      if (typeof row.id === "string") {
        this.secondmenuflag = true; // 二级菜单显示
        this.layer = this.findLayerIndex(row.id);
      } else {
        this.layer = this.findLayerIndex(row.id);
        console.log("layer");
        console.log(this.layer);

        if (this.layer.length === 4) {
          let id = parseInt([0, 9, 0, "146"].slice(3)[0]);
          this.thirdmenuflag = true;
          this.secondrowid = id;
        } else {
          this.dialogVisible = true;
        }
      }
      // if(typeof row.id==='')

      // 之前旧的
      // console.log(this.menuTable)
      // console.log("aaaaa");
      // console.log(index, row.id);
      // console.log(index, row);
      // console.log(this.findLayerIndex(row.title));

      // console.log("bbbbb");
      // this.dialogVisible = true;
    },
    cancelAdd() {
      this.$confirm("确认取消？")
        .then(_ => {
          this.dialogVisible = false;
          console.log(this.layer.length, this.layer.slice(0, 1)[0]);
        })
        .catch(_ => {});
    },
    confirmAdd() {
      if (
        this.editTable[0].menuName !== "" &&
        this.editTable[0].link !== "" &&
        this.editTable[0].icon !== "" &&
        this.editTable[0].remark !== ""
      ) {
        this.$confirm("确认增加？")
          .then(_ => {
            console.log("------");
            console.log(this.layer);
            let id;
            if (this.layer.length === 2) {
              id = 0;
            } else if (this.layer.length === 3) {
              id = this.layer.slice(2, 3)[0];
            }
            console.log(id);
            const obj = {
              access_token: this.access_token,
              parent_id: id,
              title: this.editTable[0].menuName,
              uri: this.editTable[0].link,
              icon: this.editTable[0].icon,
              remark: this.editTable[0].remark
            };
            console.log(obj);
            saveMenu(obj).then(
              res => {
                location.reload();
              },
              fail => {}
            );

            this.editTable[0].menuName = "";
            this.editTable[0].link = "";
            this.editTable[0].icon = "";
            this.editTable[0].remark = "";
            this.dialogVisible = false;
          })
          .catch(_ => {
            this.editTable[0].menuName = "";
            this.editTable[0].link = "";
            this.editTable[0].icon = "";
            this.editTable[0].remark = "";
          });
      } else {
        this.$alert("有选项为空，请检查");
      }
    },
    cancelEdit() {
      this.$confirm("确认取消？")
        .then(_ => {
          this.EditVisible = false;
        })
        .catch(_ => {});
    },
    confirmEdit() {
      if (
        this.editMenuList.menuName === "" ||
        this.editMenuList.menuLink === ""
      ) {
        this.$alert("有未填写的参数");
      } else {
        this.$confirm("确认提交？")
          .then(_ => {
            this.EditVisible = false;
            let id;
            if (this.layer.length === 2) {
              id = 0;
            } else if (this.layer.length === 3) {
              id = this.layer.slice(2, 3)[0];
            } else if (this.layer.length === 4) {
              id = this.layer.slice(3)[0];
            }

            const obj = {
              access_token: this.access_token,
              parent_id: id,
              id: parseInt(this.editId),
              title: this.editMenuList.menuName,
              uri: this.editMenuList.menuLink
            };

            saveMenu(obj).then(
              res => {
                location.reload();
              },
              fail => {}
            );
          })
          .catch(_ => {});
      }
    },
    DeleteMenu(index, row) {
      this.$confirm("确认删除此行？")
        .then(_ => {
          const obj = {
            access_token: this.access_token,
            id: parseInt(row.id)
          };
          console.log(obj);
          delMenu(obj).then(
            res => {
              location.reload();
            },
            fail => {
              console.log(fail);
              this.$alert(fail);
            }
          );
        })
        .catch(_ => {});
    }
  }
};
</script>
<style>
.inputstyle {
  width: 330px;
}

.methodStyle {
  display: none;
}
</style>
