<template>
  <div>
    <h4>物品仓储列表显示stockGoodsList</h4>
    <el-main class="main">
      <el-header class="header">
        <el-button type="primary" @click="jumpTo">新增</el-button>
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
            :data="stocksGoodsList"
            style="width: 100%"
          >
            <el-table-column prop="choose" label="编号" type="selection"/>
            <el-table-column prop="id" label="序号"/>
            <el-table-column prop="goods_code" label="条形码"/>
            <el-table-column prop="goodsName" label="商品名"/>
            <el-table-column prop="spec" label="规格"/>
            <el-table-column prop="warehouse_name" label="仓库名"/>
            <el-table-column prop="goods_num" label="数量"/>
          </el-table>
        </div>
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
import { getStocksGoodsList } from '@/api/goods-stock-list/stockGoodsList'

import store from '@/store'

export default {
  components: {},
  data() {
    return {
      currentPage: 1,
      pageSize: [10, 20, 50],
      pageSizeDefault: 10,
      totalPage: 150,
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
      stocksGoodsList: [],
    }
  },
  created() {
    this.fetchStocksGoodsList()
  },
  methods: {
    handleSizeChange(val) {
      const obj = {}
      obj.access_token = this.access_token
      obj.page = 1
      obj.num = val
      this.useGetStocksGoodsList(obj)
    },
    handleCurrentPageChange(val) {
      const obj = {}
      obj.access_token = this.access_token
      obj.page = val
      obj.num = this.pageSizeDefault
      this.useGetStocksGoodsList(obj)
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
    fetchStocksGoodsList(){
      const obj = {}
      obj.access_token = this.access_token
      obj.page = 1
      obj.num = 10
      this.useGetStocksGoodsList(obj)
    },
    useGetStocksGoodsList(obj) {
      getStocksGoodsList(obj).then(
        res => {
          console.log('res')
          console.log(res)
          this.totalPage = res.data.total
          this.stocksGoodsList = res.data.list
        }
      )
    },
    jumpTo() {
      console.log(this.$router)
      this.$router.replace('/goods-stock-in')
      // this.$router.push('/home')
      // this.addGoodDialogFlag = true
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
