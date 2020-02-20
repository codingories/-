<template>
  <div class="app-container">
    <div v-if="pageShowFlag" class="firstPageStyle">
      <h2>{{ title1 }}</h2>
      <el-button type="primary" @click="stockIn">入库</el-button>
      <el-table
        ref="gradeInfoTable"
        :data="gradeInfoTable"
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <el-table-column prop="choose" label="入库物品" />
        <el-table-column prop="id" label="入库时间" />
        <el-table-column prop="school" label="仓库名" />
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
              :label="i.warehouseName"
              :value="i.warehouseName"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="dept" class="setInline">
          <el-select v-model="warehouseForm.supplies" placeholder="请选择供应商" value="">
            <el-option
              v-for="(i,index) in suppliersList"
              :label="i.supplier"
              :value="i.supplier"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采购方式" prop="dept" class="setInline">
          <el-select v-model="warehouseForm.purchasingMethod" placeholder="请选择采购方式" value="">
            <el-option
              v-for="(i,index) in purchasingMethodList"
              :label="i.purchasingMethod"
              :value="i.purchasingMethod"
              :key="index"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="backPageFlag" class="secondPageStylePartTwo">
      <el-form ref="warehouseForm" :model="warehouseForm" label-width="100px" class="goodsCode">
        <el-form-item label="物品编码" prop="dept" class="setInline">
          <el-input v-model="ruleForm.personName" placeholder="物品编号" style="width:400px"/>
        </el-form-item>
        <el-button type="primary">添加</el-button>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="gradeInfoTable"
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <el-table-column prop="choose" label="序号" />
        <el-table-column prop="id" label="编码" />
        <el-table-column prop="school" label="物品名称" />
        <el-table-column prop="grade" label="品牌" />
        <el-table-column prop="class" label="分类" />
        <el-table-column prop="class" label="单价" />
        <el-table-column prop="class" label="单位" />
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
        <el-button type="primary">入库</el-button>
        <el-button type="danger">取消</el-button>
      </section>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      pageShowFlag: true,
      backPageFlag: false,
      title1: '入库情况',
      title2: '入库操作',
      gradeInfoTable: [],
      warehouseForm: {
        warehouse: '',
        suppliers: '',
        purchasingMethod: ''
      },
      currentPage: 1,
      total: 10,
      warehouseList: [
        {
          warehouseName: '仓库一'
        },
        {
          warehouseName: '仓库二'
        }
      ],
      suppliersList: [
        {
          supplier: '供应商一'
        },
        {
          supplier: '供应商二'
        }
      ],
      purchasingMethodList: [
        {
          purchasingMethod: '采购方式一'
        },
        {
          purchasingMethod: '采购方式二'
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
      },

    }
  },
  watch: {
    warehouseForm: {
      handler(newValue, oldValue) {
        // console.log(newValue.warehouse);
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

  methods: {
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

  }
}

</script>
<style lang = 'scss' scoped>
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
</style>
