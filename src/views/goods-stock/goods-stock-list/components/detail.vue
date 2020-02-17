<template>
  <div class="wrapper">
    <el-button
      size="mini"
      type="primary"
      @click="goBack"
    >返回
    </el-button>
    <div>
      <el-form :model="detailForm" label-width="100px">
        <el-form-item label="分类" prop="kind">
          <el-input v-model="detailForm.username" placeholder="请填写分类"/>
        </el-form-item>
        <el-form-item label="特性" prop="character">
          <el-input v-model="detailForm.character" placeholder="请填写特性"/>
        </el-form-item>
        <el-form-item label="条形码" prop="code">
          <el-input v-model="detailForm.code" placeholder="请填写条形码"/>
        </el-form-item>
        <el-form-item label="商品名" >
          <el-input v-model="detailForm.goodsName" placeholder="请填写商品名"/>
        </el-form-item>
        <el-form-item label="商标/品牌名称" >
          <el-input v-model="detailForm.menuName" placeholder="请填写商品规格"/>
        </el-form-item>
        <el-form-item label="规格" placeholder="请填写规格">
          <el-input v-model="detailForm.spec" placeholder="请填写商品规格"/>
        </el-form-item>
        <el-form-item label="品牌" >
          <el-input/>
        </el-form-item>
        <el-form-item label="原产地" >
          <el-input/>
        </el-form-item>
        <el-form-item label="备注信息" >
          <el-input/>
        </el-form-item>
        <el-form-item label="参考价格(单位:元)" >
          <el-input/>
        </el-form-item>
        <el-form-item label="图片" >
          <el-image
            :src="detailForm.img"
            class = "imgStyle"
            fit="fit"/>
        </el-form-item>
        <el-form-item label="条码图片" >
          <el-image
            class = "imgStyle"
            src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3617837894,2247784141&fm=26&gp=0.jpg"
            fit="fit"/>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input/>
        </el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="goBack"
        >提交
        </el-button>

      </el-form>
    </div>
  </div>
</template>
<script>
import { getGoodDetail } from '@/api/goodsInfo/goods-detail'
import store from '@/store'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      detailForm: {
        username: '',
        code: '',
        goodsName: '',
        menuName: '',
        spec: '',
        img: ''
      },
      access_token: store.getters.access_token
    }
  },
  watch: {
    id(val) {
      console.log('这里是watch')
      console.log(val)
      const access_token = this.access_token
      const id = val
      const obj = { id, access_token }
      getGoodDetail(obj).then(success => {
        console.log('234')
        const obj = success.data[0]
        console.log(obj)
        this.detailForm.code = obj.code
        this.detailForm.goodsName = obj.goodsName
        this.detailForm.menuName = obj.manuName
        this.detailForm.spec = obj.spec
        this.detailForm.img = obj.img
        console.log(this.detailForm)
      }, fail => {
        console.log(fail)
      })
    }
  },
  created() {
    console.log('这是detail页面')
    console.log(this.id)
  },
  methods: {
    goBack() {
      this.$emit('changeFlag')
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
</style>
