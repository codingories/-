<template>
  <div class="outdiv">
    <el-container class="container">
      <Category
        :editshow="editshow"
        :choose-flag="chooseFlag"
        class="categorystyle"
        @upedit="upedit"
        @upconfirmedit="upconfirmedit"
        @upcanceledit="upcanceledit"
      />
      <Goods v-show="ifGoodsShowFlag" class="wrapper" @changeFlag="changeFlag"/>
      <Detail v-show="!ifGoodsShowFlag" :id="id" class="wrapper" @changeFlag="changeFlag"/>
    </el-container>
  </div>
</template>

<script>
import Category from './components/category'
import Goods from './components/goods'
import Detail from './components/detail'

export default {
  components: {
    Category,
    Goods,
    Detail
  },
  data() {
    return {
      id: '0',
      ifGoodsShowFlag: true,
      editshow: true,
      chooseFlag: false
    }
  },
  methods: {
    upedit() {
      this.chooseFlag = true
      this.editshow = false
    },
    upconfirmedit() {
      this.editshow = true
      this.chooseFlag = false
    },
    upcanceledit() {
      this.editshow = true
      this.chooseFlag = false
    },
    changeFlag(id) {
      if (id) {
        this.id = id.toString()
      }
      this.ifGoodsShowFlag = !this.ifGoodsShowFlag
    }
  }

}
</script>

<style scoped lang="scss">
  .ActiveStatus {
    margin-left: 45px;
  }

  .header {
  }

  .innermain {
  }

  .container {
    border-top: 12px solid #f9f9f9;
    display: flex;
    justify-content: flex-start;
  }

  .main-container {
  }

  .outdiv {
    height: 95vh;
    background-color: #f9f9f9;
  }

  .categorystyle {
    width: 500px;
    /*border: 10px solid red;*/
  }

  .wrapper {
    margin-left: 10px;
    margin-right: 10px;
    flex: 1;
    overflow: auto;
  }
</style>
