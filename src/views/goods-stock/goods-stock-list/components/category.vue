<template>
  <div>
    <el-aside class="aside">
      <el-table
        :data="goodsCategory"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        @selection-change="handleChosenCategory"
      >
        <el-table-column prop="choose" label="编号" type="selection"/>
        <el-table-column prop="text" label="物品分类">
          <template slot-scope="scope">
            <div class="categoryItemStyle" @click="sendRowItem(scope.row)">
              {{ scope.row.text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" width="80px" label="排序号"/>
      </el-table>

      <el-dialog :visible.sync="addCategoryFlag" :before-close="handleClose" title="增加" width="700px">
        <el-form ref="categoryForm" :model="categoryForm" label-width="100px">
          <el-form-item label="物品类别" prop="kind">
            <el-input v-model="categoryForm.addCategoryName" placeholder="请请输入需要增加的物品类别"/>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="cancelDialog('addCategoryFlag')">取消</el-button>
        <el-button type="primary" @click="confirmAddCategory('addCategoryFlag')">确认</el-button>
      </el-dialog>
    </el-aside>

    <el-dialog :visible.sync="editCategoryFlag" :before-close="handleClose" title="编辑" width="700px">
      <el-form ref="categoryForm" :model="categoryForm" label-width="100px">
        <el-form-item label="物品类别" prop="kind">
          <el-input v-model="categoryForm.addCategoryName" placeholder="请输入需要修改的物品类别名称"/>
        </el-form-item>
      </el-form>
      <el-button type="success" @click="cancelDialog('editCategoryFlag')">取消</el-button>
      <el-button type="primary" @click="confirmEditCategory('editCategoryFlag')">确认</el-button>
    </el-dialog>

    <el-dialog :visible.sync="deleteCategoryFlag" :before-close="handleClose" title="提示" width="700px">
      <span>确认需要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="cancelDialog('deleteCategoryFlag')">取消</el-button>
        <el-button type="primary" @click="confirmDeleteCategory('deleteCategoryFlag')">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCategory, dealGoodsCategory, deleteGoodsCategory, sortCategoryOrder } from '@/api/goodsInfo/goodsinfo-category'
import store from '@/store'

export default {
  components: {},
  data() {
    return {
      editCategoryFlag:false,
      deleteCategoryFlag: false,
      categoryForm: {
        addCategoryName: '',
      },
      addCategoryFlag: false,
      access_token: store.getters.access_token,
      gradeInfoTable: [],
      goodsCategory: [],
      chosenCategory: []
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

    addCategory() {
      if (this.chosenCategory.length >= 2) {
        this.$alert('勾选了两个选项及以上，无法进行增加操作')
      } else if (this.chosenCategory.length === 1) {
        if (this.chosenCategory[0].parent_id !== 0) {
          this.$alert('勾选错误,勾选了二级菜单，无法进行增加操作')
        } else {
          this.addCategoryFlag = true
          this.categoryForm.addCategoryName = ''
        }
      } else {
        this.addCategoryFlag = true
        this.categoryForm.addCategoryName = ''
      }
    },
    addUser() {
      this.addCategory = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    cancelDialog(Flag) {
      this[Flag] = false
    },
    confirmAddCategory(Flag) {
      // 什么都没勾，默认增加一级菜单
      if (this.chosenCategory.length === 0) {
        this.addKind('0')
        this[Flag] = false
      } else if (this.chosenCategory.length === 1) {
        // 勾了一级菜单，为其增加二级菜单
        console.log('11111')
        const id = this.chosenCategory[0].id
        this.addKind(id)
        this[Flag] = false
      }
    },
    addKind(id) {
      const obj = {}
      obj.access_token = this.access_token
      obj.name = this.categoryForm.addCategoryName
      obj.parent_id = id
      dealGoodsCategory(obj).then(
        res => {
          location.reload()
        }
      )
    },
    handleChosenCategory(val) {
      this.chosenCategory = val
    },
    deleteCategory() {
      this.deleteCategoryFlag = true
    },
    confirmDeleteCategory() {
      const ids = this.chosenCategory.map(v => v.id)
      ids.forEach(v => {
        const obj = {}
        obj.access_token = this.access_token
        obj.id = v
        deleteGoodsCategory(obj).then(
          res => {
            this.$alert('删除成功!')
            location.reload()
          },
          error => {
            this.$alert('删除失败')
          }
        )
      })
    },
    moveUpCategory() {
      const menus = []
      for (const i of this.goodsCategory) {
        menus.push(i.id)
        if (i.children) {
          for (const j of i.children) {
            menus.push(j.id)
          }
        }
      }
      obj.access_token = this.access_token
      obj.ids = [6, 9, 17, 18, 19, 20, 34, 7, 8, 15, 16, 10, 11, 21, 23, 25, 26, 12, 13, 14, 22, 24, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 40, 39, 43, 44, 45, 46]
      sortCategoryOrder(obj).then(
        res => {
        }
      )
    },
    xxx() {
      if (this.chosenCategory.length === 0) {
        this.$alert('请勾选要修改的项')
      } else if (this.chosenCategory.length > 1) {
        this.$alert('只能勾选一项进行编辑，请勿多勾选')
      } else {
        this.editCategoryFlag = true
        this.categoryForm.addCategoryName = this.chosenCategory[0].text
      }
    },
    confirmEditCategory(Flag) {
      const id = this.chosenCategory[0].id
      const parent_id = this.chosenCategory[0].parent_id
      let obj = {}
      obj.access_token = this.access_token
      obj.name = this.categoryForm.addCategoryName
      obj.id = id
      obj.parent_id = parent_id
      dealGoodsCategory(obj).then(
        res => {
          this.$alert('修改成功!')
          location.reload()
        }
      )
      this[Flag] = false
    },
    sendRowItem(row) {
      this.$emit('click:GetRow', row)
    }
  }
}

</script>

<style scoped>

  .aside {
    min-width: 500px;
    max-width: 800px;
    overflow: auto;
    max-height: 90vh;
    /* max-width: 85vh; */

    background-color: white;
    border-left: 10px solid #f9f9f9;
    margin-right: 10px;
    box-shadow: 4px 5px 6px 0 rgba(182, 168, 168, 0.75);
    z-index: 1;
  }

  .categoryItemStyle {
    display: inline-block;
    width: 80%;
    cursor: pointer;
  }
</style>
