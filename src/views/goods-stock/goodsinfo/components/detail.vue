<template>
  <div class="wrapper">
    <h4>这是detail.vue</h4>
    <el-button
      size="mini"
      type="primary"
      @click="goBack"
    >返回
    </el-button>
    <div>
      <el-form ref="detailForm" :model="detailForm" :rules="detailFormRules" label-width="100px">
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="detailForm.category_id" placeholder="请填写分类" value="">
            <el-option
              v-for="item in categoryOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span v-if="item.layer===0" class="firstLayerStyle">{{ item.label }}</span>
              <span v-if="item.layer===1" class="secondLayerStyle">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特性" prop="feature">
          <el-select v-model="detailForm.feature" placeholder="请填写特性" value="">
            <el-option
              v-for="item in featureOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="条形码" prop="code">
          <el-input v-model="detailForm.code" placeholder="请填写条形码"/>
        </el-form-item>
        <el-form-item label="商品名" prop="goodsName">
          <el-input v-model="detailForm.goodsName" placeholder="请填写商品名"/>
        </el-form-item>
        <el-form-item label="商标/品牌名称">
          <el-input v-model="detailForm.menuName" placeholder="请填写商品规格"/>
        </el-form-item>
        <el-form-item label="规格" placeholder="请填写规格">
          <el-input v-model="detailForm.spec" placeholder="请填写商品规格"/>
        </el-form-item>
        <el-form-item label="品牌" prop="trademark">
          <el-input v-model="detailForm.trademark" placeholder="请填写品牌"/>
        </el-form-item>
        <el-form-item label="原产地">
          <el-input v-model="detailForm.ycg" placeholder="请填写原产地"/>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="detailForm.note" placeholder="请填写备注信息"/>
        </el-form-item>
        <el-form-item label="参考价格(单位:元)">
          <el-input v-model="detailForm.price" placeholder="请填写价格(元)"/>
        </el-form-item>
        <el-form-item label="图片">
          <el-image
            :src="detailForm.img"
            class="imgStyle"
            fit="fit"/>
        </el-form-item>
        <el-form-item label="条码图片">
          <el-image
            class="imgStyle"
            src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3617837894,2247784141&fm=26&gp=0.jpg"
            fit="fit"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="detailForm.remark" placeholder="请填写备注"/>
        </el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="submit('detailForm')"
        >提交
        </el-button>

      </el-form>
    </div>
  </div>
</template>
<script>
import store from '@/store'
import { getGoodsCategory, getGoodDetail, saveGoods } from '../../../../api/goodsInfo/goods-detail'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      categoryOption: [],
      featureOption: [{
        value: 1,
        label: '易耗品'
      }, {
        value: 2,
        label: '耐耗品'
      }],
      detailForm: {
        category_id: '',
        feature: '',
        username: '',
        code: '',
        goodsName: '',
        menuName: '',
        spec: '',
        img: '',
        trademark: '',
        ycg: '',
        note: '',
        price: '',
        remark: ''
      },
      access_token: store.getters.access_token,
      detailFormRules: {
        feature: [
          { required: true, message: '特性不能为空', trigger: 'blur' }
        ],
        goodsName: [
          { required: true, message: '商品名不能为空', trigger: 'blur' }
        ],
        trademark: [
          { required: true, message: '品牌不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    id(val) {
      const access_token = this.access_token
      const obj = { id: val, access_token }
      getGoodDetail(obj).then(success => {
        const obj = success.data
        const list = ['category_id', 'code', 'goodsName', 'manuName', 'spec', 'img', 'feature', 'trademark', 'goodsType', 'ycg', 'note', 'price']
        list.forEach(v => {
          if (obj[v]) {
            this.detailForm[v] = obj[v]
          }
        })
      }, fail => {
        console.log(fail)
      })
    }
  },
  created() {
    console.log('这是detail页面')
    console.log(this.id)
    this.getCategory()
  },
  methods: {
    getCategory() {
      const obj = { 'access_token': this.access_token }
      getGoodsCategory(obj).then(
        res => {
          res.data.forEach(
            value => {
              this.dealCategoryOption(value, 0)
              if (value.children) {
                value.children.forEach(
                  v => {
                    this.dealCategoryOption(v, 1)
                  }
                )
              }
            }
          )
        }
      )
    },
    dealCategoryOption(v, id) {
      const obj = {}
      obj.value = v.id
      obj.label = v.text
      obj.layer = id
      this.categoryOption.push(obj)
    },
    goBack() {
      this.$emit('changeFlag')
    },
    submit(formName) {
      console.log('submit')
      console.log(formName)
      // console.log(this.detailForm)
      // const obj = {}
      // const list = ['access_token', 'id', 'category_id', 'goodsName', 'manuName', 'goodsType', 'spec', 'trademark', 'sptmImg', 'img', 'ycg', 'note', 'price', 'feature', 'remark']
      // list.forEach(v => { obj[v] = '' })
      // console.log(obj)
      // obj.access_token = this.access_token
      // obj.id = this.id
      // obj.goodsName = this.
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          const obj = this.detailForm
          obj.access_token = this.access_token
          obj.id = this.id
          console.log(obj)
          saveGoods(obj).then(
            res => {
              this.$alert('提交修改成功')
              location.reload()
            },
            fail => {
              this.$alert('提交失败')
            }
          )
        } else {
          this.$alert('请填写完成必要信息')
          return false
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .wrapper {
    background-color: white;
    box-shadow: 4px 5px 6px 0 rgba(182, 168, 168, 0.75);
    margin-right: 10px;
    max-height: 90vh;
    width: 100%;
  }

  .setInline {
    display: inline-block;
  }

  .imgStyle {
    max-width: 300px;
  }

  .firstLayerStyle {
    float: left
  }

  .secondLayerStyle {
    float: left;
    color: #8492a6;
    font-size: 13px;
    margin-left: 2em
  }
</style>
