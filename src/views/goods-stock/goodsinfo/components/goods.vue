<template>
  <div>
    <el-main class="main">
<!--      {{ goodsList }}-->
      <el-header class="header">
        <el-button type="primary" @click="xxx">新增</el-button>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="searchstyle">
          <el-form-item prop="personName" class="setInline">
            <el-input v-model="ruleForm.personName" placeholder="请填写需要查询的内容"/>
          </el-form-item>
        </el-form>
        <el-button type="primary">查询</el-button>
      </el-header>
      <el-main class="innermain">
        <div>
          <el-table
            id="goodlist"
            ref="multipleTable"
            :data="goodsList"
            style="width: 100%"
            @selection-change="handleSelection"
          >

            <el-table-column prop="choose" label="编号" type="selection"/>
            <el-table-column prop="id" label="序号"/>
            <el-table-column prop="code" label="条形码"/>
            <el-table-column prop="goodsName" label="商品名"/>
            <el-table-column prop="manuName" label="商品品牌"/>
            <el-table-column prop="spec" label="规格"/>
            <el-table-column prop="img" label="图片">
              <template slot-scope="scope">
                <span style="margin-left: 10px">
                  <el-popover
                    placement="right"
                    trigger="hover"
                  >
                    <span slot="reference">图片</span>
                    <img :src="scope.row.img" alt="图片" style="max-height: 500px;max-width: 500px">
                  </el-popover>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="school" label="操作	">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="DeleteGood(scope.$index, scope.row)"
                >详情
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="editGoods(scope.$index, scope.row)"
                >编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-main>
  </div>
</template>

<script>
import { getGoodsList, addGoods, saveGoods } from '@/api/goods'
import store from '@/store'

export default {
  components: {},
  data() {
    return {
      access_token: store.getters.access_token,
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
      goodsList: [
        // { id: 1, gradename: '小班', ifGraduation: '否' },
        // { id: 2, gradename: '中班', ifGraduation: '否' },
        // { id: 3, gradename: '大班', ifGraduation: '否' }
      ]
    }
  },
  created() {
    this.fetchGoodsList()
  },
  methods: {
    handleSelection(val) {
      this.checkedList = val
      if (this.checkedList.length === 1) {
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
          this.ruleForm.dept_id = this.deptList.filter(
            v => v.dept_name === tempdept
          )[0].id
        }
        // this.dept_id = this.checkedList[0].dept;

        this.position = this.checkedList[0].position
      }
    },
    fetchGoodsList() {
      const obj = {}
      obj.access_token = this.access_token
      obj.key_words = ''
      getGoodsList(obj).then(
        res => {
          this.goodsList = res.data.list.reverse()
        }
      )
    },
    xxx() {
      console.log('xxx')
      const obj = {}
      obj.access_token = this.access_token
      obj.code = 'aaaaa'
      addGoods(obj).then(
        res => {
          console.log(res)
        }
      )
    },
    DeleteGood() {
      console.log('--')
    },
    editGoods(index, row) {
      console.log('123321')
      console.log(index, row)
      const obj = {}
      obj.access_token = this.access_token
      obj.id = 1
      obj.goodsName = '测试修改一'
      obj.trademark = '测试品牌'
      saveGoods(obj).then(
        res=>{
          console.log(res)
        }
      )
    }
  }
}
</script>

<style scoped>
  .main {
    background-color: white;
    box-shadow: 4px 5px 6px 0px rgba(182, 168, 168, 0.75);
    /* border-right: 10px solid #f9f9f9; */
    margin-right: 10px;
    height: 500px;
    width: 100%;
  }

  .searchstyle {
    display: inline;
  }

  .innermain {
    /*border: 1px solid red;*/
    overflow: hidden;
  }

  .setInline {
    display: inline-block;
  }
</style>
