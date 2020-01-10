<template>
  <div class="app-container">
    <!-- <h2>权限列表</h2>
    <h5>{{buttonPermission}}</h5>
    <h5>-------</h5>
    <h5>{{buttonfunctionlist}}</h5> -->
    <el-button type="primary">刷新</el-button>
    <el-button type="success">筛选</el-button>
    <el-button type="info">新增</el-button>
    <el-button type="warning">导出</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="ID" label="ID" width="180"></el-table-column>
      <el-table-column prop="label" label="标识" width="180"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="router" label="路由"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="refreshTime" label="更新时间"></el-table-column>
      <el-table-column prop="operation" label="操作"></el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { getGroups } from "@/api/AttendanceGroup";
// import { chooseAttendanceGroup } from "@/api/chooseAttendance";
import buttonpermission from "@/mixins/buttonpermission.js";
import store from "@/store";
export default {
  data() {
    return {
      title: "考勤管理",
      access_token: store.getters.access_token,
      getGroupsLoading: false,
      RawGroupData: [],
      tableData: [],
      addAttendance: [],
      multipleSelection: []
    };
  },
  mixins: [buttonpermission]
};
</script>
