<template>
  <div class="app-container">
    <div v-if="pageFlag" class="page1">
      <h2>{{ title1 }}</h2>
      <el-button type="primary" @click="stockin">入库</el-button>
      <el-table
        ref="multipleTable"
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

      <!--      <div class="block">-->
      <!--        <span class="demonstration">翻页</span>-->
      <!--        <el-pagination-->
      <!--          :current-page="currentPage"-->
      <!--          :page-sizes="[10, 20, 100]"-->
      <!--          :page-size="20"-->
      <!--          :total="total"-->
      <!--          layout="total, sizes, prev, pager, next, jumper"-->
      <!--          @size-change="handleSizeChange"-->
      <!--          @current-change="handleCurrentChange"-->
      <!--        />-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>

</script>
<style lang = 'scss' scoped>
</style>
