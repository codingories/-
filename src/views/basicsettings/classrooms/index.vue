<template>
  <div>
    <el-button type="primary" @click="dialogFormVisible = true">添加部门</el-button>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="province"
        label="序号"/>
      <el-table-column
        prop="city"
        label="学校"/>
      <el-table-column
        prop="address"
        label="年级"/>
      <el-table-column
        prop="zip"
        label="班级"/>
      <el-table-column
        prop="zip"
        label="管理员"/>
      <el-table-column
        prop="zip"
        label="分类"/>
      <el-table-column
        prop="zip"
        label="名称"/>
      <el-table-column
        prop="zip"
        label="备注"/>
      <el-table-column
        prop="zip"
        label="状态"/>
      <el-table-column
        prop="zip"
        label="创建时间"/>
      <el-table-column
        prop="zip"
        label="更新时间"/>

      <el-table-column
        prop="zip1"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="dialogFormVisible = true">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="添加部门">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="学校">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="年级">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="班级">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="分类">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="管理员">
          <el-select v-model="form.region2" placeholder="选择管理员">
            <el-option label="小张" value="shanghai"/>
            <el-option label="小唔" value="beijing"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="名称">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="备注">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态">
          <el-select v-model="form.region3" placeholder="选择状态">
            <el-option label="正常" value="shanghai"/>
            <el-option label="冻结" value="beijing"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      formLabelWidth: '120px',
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        region1: '',
        region2: '',
        region3: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [
      //   {
      //   date: '园长室',
      //   province: '园长室',
      //   address: '小李',
      //   zip: '2020-1-2 14:30:27',
      //   city: '小王'
      // }, {
      //   date: '园长室',
      //   province: '园长室',
      //   address: '小李',
      //   zip: '2020-1-2 14:30:27',
      //   city: '小王'
      // }
      ]
    }
  }
}
</script>
<style>

</style>
