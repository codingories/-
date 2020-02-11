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
          <el-input placeholder="请填写商品名"/>
        </el-form-item>
        <el-form-item label="品牌名称" >
          <el-input />
        </el-form-item>
        <el-form-item label="规格" >
          <el-input/>
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
            class = "imgStyle"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
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
export default {
  data() {
    return {
      detailForm: {
        username: ''
      }
    }
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
