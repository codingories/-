<template>
  <div>
    <el-aside class="aside">
      {{goodsCategory}}
      <el-table
        :data="goodsCategory"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
      >
        <el-table-column v-if="chooseFlag" prop="choose" label="编号" type="selection"/>
        <el-table-column prop="text" label="物品分类"/>
        <el-table-column prop="name" width="80px" label="排序号"/>
      </el-table>
      <div v-if="editshow" class="edit">
        <el-button type="primary" class="editbutton" size="small" @click="edit">编辑</el-button>
      </div>
      <div v-else class="edit">
        <div class="edit1">
          <div>
            <el-button type="primary" size="small" @click="addCategory">增加</el-button>
            <el-button type="success" size="small">修改</el-button>
            <el-button type="danger" size="small">删除</el-button>
            <el-button type="primary" size="small">上移</el-button>
            <el-button type="primary" size="small">下移</el-button>
          </div>
          <el-button-group class="editbutton">
            <el-button type="primary" icon="el-icon-check" size="small" @click="confirmedit"/>
            <el-button type="primary" icon="el-icon-close" size="small" @click="canceledit"/>
          </el-button-group>
        </div>
      </div>
      <el-dialog :visible.sync="categoryFlag" :before-close="handleClose" title="增加" width="700px">
        <el-form ref="categoryForm" :model="categoryForm" label-width="100px" >
          <el-form-item label="物品类别" prop="kind">
            <el-input v-model="categoryForm.categoryName" placeholder="请请输入需要增加的物品类别"/>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="cancelDialog('categoryFlag')">取消</el-button>
        <el-button type="primary" @click="confirmAddCategory('categoryFlag')">确认</el-button>
      </el-dialog>

    </el-aside>
  </div>
</template>

<script>
import { getGoodsCategory, addGoodsCategory } from '@/api/goodsinfo-category'
import store from '@/store'

export default {
  components: {},
  props: {
    chooseFlag: false,
    editshow: true
  },
  data() {
    return {
      categoryForm: {
        categoryName: ''
      },
      categoryFlag: false,
      access_token: store.getters.access_token,
      gradeInfoTable: [
        { id: 1, gradename: '小班', ifGraduation: '否' },
        { id: 2, gradename: '中班', ifGraduation: '否' },
        { id: 3, gradename: '大班', ifGraduation: '否' }
      ],
      goodsCategory: []
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      const obj = { 'access_token': this.access_token }
      getGoodsCategory(obj).then(
        res => {
          this.goodsCategory = res.data
        }
      )
    },
    edit() {
      console.log('111111')
      //   this.chooseFlag = true;
      //   this.editshow = false;
      this.$emit('upedit')
    },
    confirmedit() {
      this.$emit('upconfirmedit')
    },
    canceledit() {
      this.$emit('upcanceledit')
    },
    addCategory() {
      this.categoryFlag = true
      this.categoryForm.categoryName = ''
    },
    addUser() {
      this.addCategory = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    cancelDialog(Flag) {
      this[Flag] = false
    },
    confirmAddCategory(Flag) {
      const obj = {}
      obj.access_token = this.access_token
      obj.name = this.categoryForm.categoryName
      obj.parent_id = '6'
      console.log(obj)
      addGoodsCategory(obj).then(
        res => {
          console.log(res)
          // location.reload()
        }
      )
      this[Flag] = false
    }
  }
}
</script>

<style scoped>
  .edit {
    /* margin-top: 40px; */
    /* border: 1px solid green; */
    display: flex;
    justify-content: flex-end;
    /* border-top: 1px solid black; */
  }

  .edit1 {
    display: flex;
    justify-content: space-between;
  }

  .aside {
    min-width: 500px;
    max-width: 800px;
    overflow: auto;
    max-height: 90vh;
    /* max-width: 85vh; */

    background-color: white;
    border-left: 10px solid #f9f9f9;
    margin-right: 10px;
    box-shadow: 4px 5px 6px 0px rgba(182, 168, 168, 0.75);
    z-index: 1;
  }

  .editbutton {
    /* border: 1px solid red; */
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
