<template>
  <div class="app-container">
    <div v-if="pageShowFlag" class="firstPageStyle">
      <h2>{{ title1 }}</h2>
      <h3>调用接口:/api/v1/admin-stocks/warehouse-action-list,入库操作列表</h3>
      {{warehouseActionList}}
      <el-button type="primary" @click="stockIn">入库</el-button>
      <el-table
        ref="warehouseActionList"
        :data="warehouseActionList"
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <el-table-column prop="barcode" label="入库物品" />
        <el-table-column prop="created_at" label="入库时间" />
        <el-table-column prop="name" label="仓库名" />
        <el-table-column prop="grade" label="入库数量" />
        <el-table-column prop="class" label="操作时间" />
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
    <div v-if="!pageShowFlag" class="secondPageStyle">
      <h2>{{ title2 }}</h2>
      <el-button type="primary" @click="goBack">返回</el-button>
      <el-form ref="warehouseForm" :model="warehouseForm" label-width="100px" class="warehouseFormStyle">
        <el-form-item label="仓库" prop="dept" class="setInline">
          <el-select v-model="warehouseForm.warehouse" placeholder="请选择仓库" value="">
            <el-option
              v-for="(i,index) in warehouseList"
              :label="i.name"
              :value="i.id"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="dept" class="setInline">
          <el-select v-model="warehouseForm.suppliers" placeholder="请选择供应商" value="">
            <el-option
              v-for="(i,index) in suppliersList"
              :label="i.name"
              :value="i.id"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采购方式" prop="dept" class="setInline">
          <el-select v-model="warehouseForm.purchasingMethod" placeholder="请选择采购方式" value="">
            <el-option
              v-for="(i,index) in purchasingMethodList"
              :label="i.mode"
              :value="i.id"
              :key="index"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="backPageFlag" class="secondPageStylePartTwo">
      <el-form ref="warehouseForm" :model="warehouseForm" label-width="100px" class="goodsCode">
        <el-form-item label="物品编码" prop="dept" class="setInline">
          <el-input v-model="codeForm.code" placeholder="物品编号" style="width:400px"/>
        </el-form-item>
        <el-button type="primary" @click="addByCode">添加</el-button>
        <el-button type="success" @click="chooseShowFlag">选择</el-button>
      </el-form>
      <h5>{{ codeForm.code }}</h5>
      <h5>{{ codeList }}</h5>
      <h4>添加用​/api​/v1​/admin-goods​/goods-list,物品列表,查询条码</h4>
      <!--      <h4>物品列表:/api/v1/admin-goods/goods-list</h4>-->
      <el-table
        ref="multipleTable"
        :data="GoodsList"
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="code" label="条码" />
        <el-table-column prop="goodsName" label="物品名称" />
        <el-table-column prop="trademark" label="品牌" />
        <el-table-column prop="spec" label="规格" />
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
            <el-button size="mini" type="danger" @click="deleteGood(scope.$index, scope.row)">删除</el-button>
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
        <el-button type="primary" @click="inStock">入库</el-button>
        <el-button type="danger">取消</el-button>
      </section>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="选择"
      width="70%">
      <el-container class="container">
        <Category
          class="categorystyle"
          @click:GetRow="sendRowToGoods"
        />
        <Goods :row="row" class="wrapper" @update:codeList="updateCodeList"/>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addByChoose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWarehouseList, getSupplierList, getWarehouseActionList, getGoodsList,addStocks } from '@/api/goods-stock-in/goods-stock-in.js'
import store from '@/store'
import Category from './components/category'
import Goods from './components/goods'

export default {
  components: {
    Category,
    Goods
  },
  data() {
    return {
      codeList: [],
      codeForm: {
        code: ''
      },
      GoodsList: [],
      row: [],
      dialogVisible: false,
      access_token: store.getters.access_token,
      pageShowFlag: true,
      backPageFlag: false,
      title1: '入库情况',
      title2: '入库操作',
      warehouseActionList: [],
      warehouseForm: {
        warehouse: '',
        suppliers: '',
        purchasingMethod: ''
      },
      currentPage: 1,
      total: 10,
      warehouseList: [],
      suppliersList: [],
      purchasingMethodList: [
        {
          id: 1,
          mode: '集中采购'
        },
        {
          id: 2,
          mode: '自行采购'
        }
      ],
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
      }
    }
  },
  watch: {
    warehouseForm: {
      handler(newValue, oldValue) {
        if (newValue.warehouse === '') {
          this.backPageFlag = false
        } else {
          this.backPageFlag = true
        }
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.useGetWarehouseList()
    this.useGetSupplierList()
    this.useGetWarehouseActionList()
  },

  methods: {
    addminusvalue(val) {
      console.log(val)
    },
    updateCodeList(codeList) {
      this.codeList = codeList
    },
    addByChoose() {
      console.log('addByChoose')
      console.log(this.codeList)
      this.codeList.forEach(
        code => {
          const obj = {}
          obj.access_token = this.access_token
          obj.code = code
          this.useGetGoodsList(obj)
        }
      )
      this.dialogVisible = false
    },
    addByCode() {
      const obj = {}
      obj.access_token = this.access_token
      obj.code = this.codeForm.code
      console.log('进行添加')
      console.log(obj)
      this.useGetGoodsList(obj)
    },
    useGetGoodsList(obj) {
      if(obj.code === ''){
        return
      }else {
        getGoodsList(obj).then(
          res => {
            console.log('33333333')
            const obj = res.data.list[0]
            obj.number = 1
            // console.log(obj.id)
            const id = obj.id
            console.log()
            const list = this.GoodsList.map(v => v.id)
            let index = list.indexOf(id)
            if (index !== -1) {
              this.GoodsList[index].number += 1
            } else {
              this.GoodsList.push(obj)
            }
          }
        )
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    chooseShowFlag() {
      this.dialogVisible = true
      console.log('chooseShowFlag')
    },
    useGetWarehouseActionList() {
      const access_token = this.access_token
      getWarehouseActionList({ access_token }).then(
        res => {
          console.log('res----')
          this.warehouseActionList = res.data
          console.log(res.data)
        }
      )
    },
    inStock() {
      const obj = {}
      obj.access_token = this.access_token
      obj.warehouses_id = this.warehouseForm.warehouse
      obj.supplier_id = this.warehouseForm.suppliers
      obj.barcode = this.GoodsList.map(v => v.code).toString()
      obj.mode = this.warehouseForm.purchasingMethod
      obj.storage_num = this.GoodsList.map(v => v.number).toString()
      addStocks(obj).then(res => {
        console.log(res)
        this.$alert('入库成功')
        location.reload()
      },
      () => {
        this.$alert('入库失败, 请检查参数')
      })
    },
    useGetWarehouseList() {
      const obj = {}
      obj.access_token = this.access_token
      getWarehouseList(obj).then(
        res => {
          this.warehouseList = res.data
        }
      )
    },

    // getSupplierList
    useGetSupplierList() {
      const obj = {}
      obj.access_token = this.access_token
      getSupplierList(obj).then(
        res => {
          console.log('---')
          console.log(res)
          this.suppliersList = res.data
        }
      )
    },
    stockIn() {
      this.pageShowFlag = !this.pageShowFlag
    },
    handleSelection(val) {

    },
    goBack() {
      this.pageShowFlag = !this.pageShowFlag
      this.warehouseForm.warehouse = ''
      this.backPageFlag = false
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
    sendRowToGoods(row) {
      const ids = []
      ids.push(row.id)
      if (row.children) {
        ids.push(...row.children.map(v => v.id))
      }
      console.log('row')
      console.log(row)
      this.row = ids
    },
    deleteGood(index, row) {
      console.log(index, row)
      console.log(this.GoodsList)
      console.log(this.GoodsList.length)
      this.GoodsList.splice(index, 1)
    }
  }
}

</script>
<style lang = 'scss' scoped>
  .container {
    border-top: 12px solid #f9f9f9;
    display: flex;
    justify-content: flex-start;
  }
  .setInline {
    display: inline-block;
  }
  .firstPageStyle {
    background-color: #fff;
    box-shadow: 4px 5px 6px 0 rgba(182, 168, 168, 0.75);
  }
  .warehouseFormStyle {
    margin-top: 20px;
    margin-left: -55px;
  }

  .secondPageStyle {
    background-color: #fff;
    padding: 20px;
    box-shadow: 4px 5px 6px 0 rgba(182, 168, 168, 0.75);
  }

  .secondPageStylePartTwo {
    background-color: #fff;
    margin-top:10px;
    box-shadow: 4px 5px 6px 0px rgba(182, 168, 168, 0.75);
  }
  .goodsCode {
    margin-left: -20px;
  }

  .wrapper {
    margin-left: 10px;
    margin-right: 10px;
    flex: 1;
    overflow: auto;
  }
</style>
