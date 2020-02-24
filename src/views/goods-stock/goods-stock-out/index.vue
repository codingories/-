<template>
  <div class="app-container">
    <!-- <h2>{{title}}</h2> -->
    <div v-if="pageFlag" class="page1">
      <h2>{{ title }}</h2>
      <el-button type="primary" @click="receive">领用</el-button>
      <el-button type="primary" @click="distribute">下发</el-button>
      <h4>使用接口:/api/v1/admin-stocks/out-action-list, 出库操作列表</h4>
      <el-table
        :data="outActionList"
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <el-table-column prop="goods_id" label="物品编号"/>
        <el-table-column prop="barcode" label="商品条形码"/>
        <el-table-column prop="name" label="商品名称"/>
        <el-table-column prop="out_num" label="出库数量"/>
        <el-table-column prop="approver_name" label="领用人姓名"/>
        <el-table-column label="用途">
          <template slot-scope="scope">
            <span v-if="scope.row.mode===1">个人领用</span>
            <span v-else>教室领用</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间"/>

      </el-table>

      <div class="block">
        <span class="demonstration">翻页</span>
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 100]"
          :page-size="20"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div v-if="!pageFlag1" class="page2">
      <el-button type="primary" @click="goback1">返回</el-button>
      <el-table
        ref="multipleTable"
        :data="receiverTable"
        style="width: 40%"
        @selection-change="handleSelection"
      >
        <el-table-column prop="department" label="申领部门"/>
        <el-table-column prop="receiver" label="申领人"/>
        <el-table-column prop="search" label="查询">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="chooseReceiver(scope.$index, scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <h4>选择的接口调用:/api/v1/admin-role/user-list</h4>
      <h2>领用物品</h2>
      <div class="secondpage">
        <el-form ref="warehouseform" :model="warehouseform" label-width="100px" class="goodscode">
          <el-form-item label="物品编码" prop="dept" class="setInline">
            <el-input v-model="ruleForm.personName" placeholder="物品编号" style="width:400px"/>
          </el-form-item>
          <el-button type="primary">手工选择</el-button>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="gradeInfoTable"
          style="width: 100%"
          @selection-change="handleSelection"
        >
          <el-table-column prop="choose" label="序号"/>
          <el-table-column prop="id" label="编码"/>
          <el-table-column prop="school" label="物品"/>
          <el-table-column prop="grade" label="品牌"/>
          <el-table-column prop="class" label="类别"/>
          <el-table-column prop="class" label="规格"/>
          <el-table-column prop="number" label="数量" width="200">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.number"
                :min="1"
                label="数量"
                @change="addminusvalue(scope.row.number)"
              />
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
            :current-page="currentPage"
            :page-sizes="[10, 20, 100]"
            :page-size="20"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <section class="footer">
          <el-button type="primary">领用</el-button>
          <el-button type="danger">取消</el-button>
        </section>
      </div>
    </div>
    <div v-if="!pageFlag2" class="page3">
      <el-button type="primary" @click="goback2">返回</el-button>
      <el-table
        ref="multipleTable"
        :data="gradeInfoTable1"
        style="width: 40%"
        @selection-change="handleSelection"
      >
        <el-table-column prop="choose" label="申领部门"/>
        <el-table-column prop="id" label="班级数"/>
        <el-table-column prop="school" label="查询">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="DeleteGood(scope.$index, scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <h2>下发物品</h2>
      <div class="secondpage">
        <el-form ref="warehouseform" :model="warehouseform" label-width="100px" class="goodscode">
          <el-form-item label="物品编码" prop="dept" class="setInline">
            <el-input v-model="ruleForm.personName" placeholder="物品编号" style="width:400px"/>
          </el-form-item>
          <el-button type="primary">手工选择</el-button>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="gradeInfoTable"
          style="width: 100%"
          @selection-change="handleSelection"
        >
          <el-table-column prop="choose" label="序号"/>
          <el-table-column prop="id" label="编码"/>
          <el-table-column prop="school" label="物品"/>
          <el-table-column prop="grade" label="品牌"/>
          <el-table-column prop="class" label="分类"/>
          <el-table-column prop="class" label="规格"/>
          <el-table-column prop="number" label="数量" width="200">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.number"
                :min="1"
                label="数量"
                @change="addminusvalue(scope.row.number)"
              />
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
            :current-page="currentPage"
            :page-sizes="[10, 20, 100]"
            :page-size="20"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <section class="footer">
          <el-button type="primary">下发</el-button>
          <el-button type="danger">取消</el-button>
        </section>
      </div>
    </div>

    <el-dialog :visible.sync="chooseShowFlag" :before-close="handleClose" title="选择领用人" width="400px">
      <div class="receiverStyle">
        <el-tree
          ref="receiverTree"
          :data="userList"
          :props="defaultProps"
          show-checkbox=""
          default-expand-all
          node-key="id"
          highlight-current
          @check-change="singlePick"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelreceiver">取消</el-button>
        <el-button type="primary" @click="confirmReceiver">确定</el-button>
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
  } from '@/api/UserManagement.js'

  import buttonpermission from '@/mixins/buttonpermission.js'

  import { getUserList, getOutActionList } from '@/api/goods-stock-out.js'

  import store from '@/store'

  export default {
    mixins: [buttonpermission],
    data() {
      return {
        i: 0,
        outActionList: [],
        userList: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        chooseShowFlag: false,
        pageFlag: 'true',
        pageFlag1: 'false',
        pageFlag2: 'false',
        title: '出库详情',
        buttonPermission: store.getters.buttonPermission,
        gradeInfoTable: [
          { id: 1, gradename: '小班', ifGraduation: '否' },
          { id: 2, gradename: '中班', ifGraduation: '否' },
          { id: 3, gradename: '大班', ifGraduation: '否' }
        ],
        receiverTable: [{ department: '', receiver: '', search: '' }],
        gradeInfoTable1: [{ id: 1, gradename: '小班', ifGraduation: '否' }],
        warehouseform: {
          warehouse: '',
          suppliers: '',
          purchasingmethod: ''
        },

        attendancemap: {},
        rolemap: {},
        deptList: [],
        userid: '',
        username: '',
        role_id: [],
        dept_id: 0,
        position: '',
        attendance_group_id: '',
        ruleForm: {
          personName: '',
          JobNumber: '',
          phone: '',
          dept_id: '',
          password: '',
          confirmPassword: '',
          status: '',
          gender: '1',
          role: ''
        },
        rules: {
          status: [{ required: true, message: '选择状态', trigger: 'change' }],
          roles: [{ required: true, message: '选择角色', trigger: 'change' }],
          confirmPassword: [
            {
              required: true,
              // message: "请重复填写密码",
              trigger: 'change',
              validator: this.validatorRepeatPassword
            }
          ],
          password: [
            {
              required: true,
              message: '请填写密码',
              trigger: 'change'
            }
          ],
          personName: [
            { required: true, message: '请填写姓名', trigger: 'change' }
          ],
          JobNumber: [
            { required: true, message: '请填写工号', trigger: 'change' }
          ],
          phone: [{ required: true, message: '请填写工号', trigger: 'change' }],
          dept: [{ required: true, message: '请选择部门', trigger: 'change' }]
        },
        total: 10,
        pageSizes: 10,
        pageSize: 10,
        currentPage: 1,
        userTableTitle: [
          { label: '选择', prop: 'choose', type: 'selection' },
          { label: 'id', prop: 'id' },
          { label: '年级名称', prop: 'gradename' },
          { label: '是否毕业年', prop: 'ifGraduation' },
          { label: '操作', prop: 'handle', type: 'selection' }
        ],
        access_token: store.getters.access_token,
        getUsersLoading: false,
        usersInfoTable: [],
        currentPage: 1,
        checkedList: [],
        editUsersShow: false
      }
    },

    computed: {
      tableHeader: function() {
        return this.getTableHeader(this.tableYear, this.tableMonth)
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
    watch: {},

    created() {
      // this.getbuttonmenus()
      // this.fetchUsersData()
      // this.getRolesList()
      // this.getAttendanceList()
      // this.getDepartment()
      this.useGetOutActionList()
    },

    methods: {
      useGetOutActionList() {
        const obj = {}
        obj.access_token = this.access_token
        getOutActionList(obj).then(
          res => {
            console.log(res)
            this.outActionList = res.data.list
          }
        )
      },
      singlePick(data, checked, node) {
        this.i++
        if (this.i % 2 === 0) {
          if (checked) {
            this.$refs.receiverTree.setCheckedNodes([])
            this.$refs.receiverTree.setCheckedNodes([data])
            // 交叉点击节点
          } else {
            this.$refs.receiverTree.setCheckedNodes([])
            // 点击已经选中的节点，置空
          }
        }

        // if (pickList.length !== 0){
        //   console.log(pickList[0])
        //   console.log(pickList[1])
        // }
      },
      cancelreceiver() {
        this.chooseShowFlag = false
        this.$refs.receiverTree.setCheckedKeys([])
      },
      confirmReceiver() {
        // console.log('data')
        // const pickList = this.$refs.receiverTree.getCheckedNodes()
        // console.log('pickList')
        // console.log(pickList)

        const totalList = this.$refs.receiverTree
          .getHalfCheckedNodes()
          .concat(this.$refs.receiverTree.getCheckedNodes())
        const department = totalList[0].name
        const receiver = totalList[1].name
        console.log(department, receiver)
        this.receiverTable[0].department = department
        this.receiverTable[0].receiver = receiver
        this.chooseShowFlag = false
      },
      chooseReceiver() {
        console.log(111)
        this.chooseShowFlag = true
        const obj = { access_token: this.access_token }
        getUserList(obj).then(
          res => {
            console.log(res.data)
            const obj = JSON.stringify(res.data).replace(
              /"name":null/g,
              '"name":"其他"'
            ).replace(/"id":null/g, '"id":999')
              .replace(/"pid":null/g, '"pid":999')
            this.userList = JSON.parse(obj)
          }
        )
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
      },
      receive() {
        console.log('123')
        this.pageFlag = !this.pageFlag
        this.pageFlag1 = !this.pageFlag1
      },
      distribute() {
        this.pageFlag = !this.pageFlag
        this.pageFlag2 = !this.pageFlag2
      },
      goback1() {
        this.pageFlag = !this.pageFlag
        this.pageFlag1 = !this.pageFlag1
      },
      goback2() {
        this.pageFlag = !this.pageFlag
        this.pageFlag2 = !this.pageFlag2
      },
      hasPermission(permission) {
        console.log('permission')
        console.log(permission)
        let flag = false
        for (const i of this.buttonfunctionlist) {
          if (i === permission) {
            flag = true
          }
        }
        return flag
      },
      getbuttonmenus() {
        const access_token = this.access_token
        const obj = { access_token }

        getMenus(obj).then(success => {
          console.log('getMenus')
          console.log(success.data)
          const controllist = success.data
        })
      },
      getAttendanceList() {
        const access_token = this.access_token
        const obj = { access_token }
        getAttendance(obj).then(success => {
          for (const i of success.data) {
            this.$set(this.attendancemap, i.name, i.id)
          }
        })
      },
      getRolesList() {
        const access_token = this.access_token
        const obj = { access_token }
        getRoles(obj).then(success => {
          for (const i of success.data) {
            this.$set(this.rolemap, i.name, i.id)
          }
        })
      },
      validatorRepeatPassword(rule, value, callback) {
        if (value === '') {
          callback(new Error('请重复输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次密码输入不同'))
        }
      },
      editUsers() {
        console.log(123)
        if (this.checkedList.length === 0) {
          this.$alert('未勾选，请选择一个选项')
            .then(() => {
            })
            .catch(() => {
            })
        } else if (this.checkedList.length >= 2) {
          this.$alert('只能选择一个选项')
            .then(() => {
            })
            .catch(() => {
            })
        } else {
          this.editUsersShow = true
        }
      },
      getDepartment() {
        const obj = { access_token: this.access_token }
        console.log(obj)
        getDpet(obj).then(res => {
          this.deptList = res.data
        })
      },
      confirmEditUsers(attr) {
        this.$confirm('确认提交？')
          .then(_ => {
            console.log(_)
            console.log('1233211')
            // console.log(this.ruleForm);
            // console.log(this.userid);

            // console.log(this.ruleForm);
            const obj = {
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
            }
            // let role_id = this.role_id
            obj.role_id = []
            console.log(obj)

            // let obj = {
            //   access_token: this.access_token,
            //   id: this.userid,
            //   username: this.username,
            //   name: this.ruleForm.personName,
            //   dept_id: this.ruleForm.dept_id
            // };

            console.log('objobjobj1234')
            console.log(obj)
            // let obj = { id: 38, username: "guwq", dept_id: 9, name: "顾文取" };
            // obj.access_token = this.access_token;

            saveuserinfo(obj).then(success => {
              // console.log(success);
              location.reload()
            })
            // this[attr] = false;
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
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
      },

      handleSelection(val) {
        this.checkedList = val
        if (this.checkedList.length === 1) {
          console.log(this.checkedList)
          this.ruleForm.dept = this.checkedList[0].dept
          this.ruleForm.personName = this.checkedList[0].name
          this.ruleForm.JobNumber = this.checkedList[0].workno
          this.ruleForm.phone = this.checkedList[0].mobile
          // this.ruleForm.dept_id = this.checkedList[0].mobile;
          this.userid = this.checkedList[0].id
          this.username = this.checkedList[0].username

          this.role_id = this.checkedList[0].role.map(v => this.rolemap[v])
          this.ruleForm.attendance_group_id = this.checkedList[0].attendance_group

          const tempdept = this.checkedList[0].dept
          if (typeof tempdept === 'string') {
            console.log('这个是string')
            this.ruleForm.dept_id = this.deptList.filter(
              v => v.dept_name === tempdept
            )[0].id
          }
          // this.dept_id = this.checkedList[0].dept;

          this.position = this.checkedList[0].position

          console.log(this.role_id)

          console.log(
            this.userid,
            this.username,
            this.role_id,
            this.dept_id,
            this.position,
            this.attendance_group_id
          )

          //         role_id: "",
          // dept_id: "",
          // position: "",
          // attendance_group_id: "",
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.usersInfoTable = []
        this.fetchUsersData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.currentPage = val
        this.usersInfoTable = []
        this.fetchUsersData()
      },
      fetchUsersData() {
        const access_token = this.access_token
        const access_token_obj = {
          access_token: this.access_token,
          page: this.currentPage,
          num: this.pageSize
        }

        console.log('access_token_obj->', access_token_obj)
        this.getUsersLoading = true

        const list = [
          'id',
          'username',
          'name',
          'workno',
          'email',
          'mobile',
          'wechat',
          'role',
          'dept',
          'attendance_group',
          'leave'
        ]

        getUsers(access_token_obj).then(success => {
          this.total = 10
          console.log(this.pageSize)
          console.log(success.data.list)

          for (const i of success.data.list) {
            const obj = {
              id: '',
              username: '',
              name: '',
              workno: '',
              email: '',
              mobile: '',
              wechat: '',
              role: '',
              dept: '',
              attendance_group: '',
              leave: ''
            }
            for (const j of list) {
              obj[j] = i[j]
              if (i['leave'] === 0) {
                obj['leave'] = '在职'
              } else {
                obj['leave'] = '离职'
              }
            }
            this.usersInfoTable.push(obj)
          }
          this.getUsersLoading = false
        })
      }
    }
  }
</script>
<style scoped>
  .setInline {
    display: inline-block;
  }

  .ActiveStatus {
    margin-left: 45px;
  }

  .footer {
    /* border: 1px solid red; */
    display: flex;
    justify-content: flex-end;
  }

  .receiverStyle {
    height: 70vh;
    overflow: auto;
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
