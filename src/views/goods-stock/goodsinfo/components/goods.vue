<template>
  <div>
    <el-main class="main">
      <!--      {{ goodsList }}-->
      <el-header class="header">
        <el-button type="primary" @click="addGood">新增</el-button>
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
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-main>
    <el-dialog
      :visible.sync="addGoodDialogFlag"
      :before-close="handleClose"
      title="请输入条形码"
      width="30%">
      <el-form ref="codeForm" :model="codeForm" :rules="codeFormRules" label-width="80px" >
        <el-form-item label="条形码" prop="code">
          <el-input v-model="codeForm.code"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddGood('codeForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getGoodsList, addGoods, saveGoods } from '@/api/goods'
import store from '@/store'

export default {
  components: {},
  data() {
    return {
      codeForm: {
        code: ''
      },
      codeFormRules: {
        code: [
          { required: true, message: '请输入条形码', trigger: 'blur' },
          { min: 1, message: '不能为空', trigger: 'blur' }
        ]
      },
      addGoodDialogFlag: false,
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
      goodsList: []
    }
  },
  created() {
    this.fetchGoodsList()
  },
  methods: {
    confirmAddGood(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {}
          obj.access_token = this.access_token
          obj.code = this.codeForm.code
          addGoods(obj).then(
            res => {
              this.$alert('提交成功')
            }
          )
          this.addGoodDialogFlag = false
        } else {
          return false
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
    addGood() {
      this.addGoodDialogFlag = true
      // const obj = {}
      // obj.access_token = this.access_token
      // obj.code = this.codeForm.code
      // // addGoods(obj).then(
      // //   res => {
      // //     console.log(res)
      // //   }
      // // )
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
        res => {
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
    max-height: 90vh;
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
