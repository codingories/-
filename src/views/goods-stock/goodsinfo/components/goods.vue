<template>
  <div>
    <el-main class="main">
<!--      <h4>这是goods.vue</h4>-->
<!--      {{ row }}-->
      <!--      {{ goodsList }}-->
      <el-header class="header">
        <el-button type="primary" @click="addGood">新增</el-button>
        <el-form ref="ruleForm" :model="ruleForm" class="searchstyle">
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
            <el-table-column prop="trademark" label="商品品牌"/>
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
                  @click="toDetail(scope.$index, scope.row)"
                >详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <div class="block">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="pageSize"
          :page-size="pageSizeDefault"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"/>
      </div>
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
import { getGoodsList, addGoods, saveGoods } from '@/api/goodsInfo/goods'
import store from '@/store'

export default {
  components: {},
  props: {
    row: {
      required: true,
      type: Array
    }
  },
  watch: {
    row(val) {
      // console.log(123, '我是row', val)
      const obj = {}
      obj.access_token = this.access_token
      obj.category_id = val.toString()
      this.useGetGoodsList(obj)
    }
  },
  data() {
    return {
      codeForm: {
        code: ''
      },
      pageSize: [10, 20, 100],
      pageSizeDefault: 10,
      totalPage: 150,
      currentPage: 1,
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
      goodsList: []
    }
  },
  created() {
    this.fetchGoodsList()
  },
  methods: {
    handleSizeChange(val) {
      const obj = {}
      obj.access_token = this.access_token
      obj.page = 1
      obj.num = val
      this.useGetGoodsList(obj)
    },
    handleCurrentPageChange(val) {
      const obj = {}
      obj.access_token = this.access_token
      obj.page = val
      obj.num = this.pageSizeDefault
      this.useGetGoodsList(obj)
    },
    confirmAddGood(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {}
          obj.access_token = this.access_token
          obj.code = this.codeForm.code
          addGoods(obj).then(
            res => {
              this.$alert('提交成功')
              location.reload()
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
      obj.page = 1
      obj.num = 10
      this.useGetGoodsList(obj)
    },
    useGetGoodsList(obj) {
      getGoodsList(obj).then(
        res => {
          this.totalPage = res.data.total
          this.goodsList = res.data.list
        }
      )
    },
    addGood() {
      this.addGoodDialogFlag = true
    },
    toDetail(index, row) {
      this.$emit('changeFlag', row.id)
    },
    editGoods(index, row) {
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
