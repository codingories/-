<template>
  <div>
    <el-aside class="aside">
      {{ goodsCategory }}
      <!--      <br>-->
      <!--      {{ chosenCategory }}-->
      <el-table
        :data="goodsCategory"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        @selection-change="handleChosenCategory"
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
            <el-button type="success" size="small" @click="xxx">修改</el-button>
            <el-button type="danger" size="small" @click="deleteCategory">删除</el-button>
            <el-button type="primary" size="small" @click="moveUpCategory">上移</el-button>
            <el-button type="primary" size="small">下移</el-button>
          </div>
          <el-button-group class="editbutton">
            <el-button type="primary" icon="el-icon-check" size="small" @click="confirmedit"/>
            <el-button type="primary" icon="el-icon-close" size="small" @click="canceledit"/>
          </el-button-group>
        </div>
      </div>
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
import { getGoodsCategory, dealGoodsCategory, deleteGoodsCategory, sortCategoryOrder } from '@/api/goodsinfo-category'
import store from '@/store'

export default {
  components: {},
  props: {
    chooseFlag: false,
    editshow: true
  },
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
    edit() {
      this.$emit('upedit')
    },
    confirmedit() {
      this.$emit('upconfirmedit')
    },
    canceledit() {
      this.$emit('upcanceledit')
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
        this.$alert('只能只能勾选一项，请勿多勾选')
      } else {
        this.editCategoryFlag = true
      }
    },
    confirmEditCategory(Flag) {
      this.categoryForm.addCategoryName = this.chosenCategory[0].id
      const id = this.chosenCategory[0].id
      let obj = {}
      obj.access_token = this.access_token
      obj.name = this.categoryForm.addCategoryName
      obj.id = id
      dealGoodsCategory(obj).then(
        res => {
          location.reload()
        }
      )
      this[Flag] = false
    }
  }
}

</script>

<style scoped>
  .edit {
    display: flex;
    justify-content: flex-end;
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
