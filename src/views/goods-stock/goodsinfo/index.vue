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
      <Goods class="goodsstyle"/>
    </el-container>
  </div>
</template>

<script>
import Category from './components/category'
import Goods from './components/goods'

export default {
  components: {
    Category,
    Goods
  },
  data() {
    return {
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
  }

  .goodsstyle {
    margin-left: 10px;
    margin-right: 10px;
    flex: 1;
    overflow: auto;
  }
</style>
