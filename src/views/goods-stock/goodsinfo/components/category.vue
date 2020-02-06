<template>
  <div>
    <!-- <h1>{{goodData}}</h1> -->
    <el-aside class="aside">
      <!-- <h2>{{editshow}}</h2> -->
      <el-table
        :data="goodData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        default-expand-all
      >
        <el-table-column v-if="chooseFlag" prop="choose" label="编号" type="selection" />
        <el-table-column prop="date" label="物品分类" />
        <el-table-column prop="name" width="80px" label="排序号" />
      </el-table>
      <div v-if="editshow" class="edit">
        <el-button type="primary" class="editbutton" @click="edit" size="small">编辑</el-button>
      </div>
      <div v-else class="edit">
        <div class="edit1">
          <div>
            <el-button type="primary" size="small">增加</el-button>
            <el-button type="success" size="small">修改</el-button>
            <el-button type="danger" size="small">删除</el-button>
            <el-button type="primary" size="small">上移</el-button>
            <el-button type="primary" size="small">下移</el-button>
          </div>
          <el-button-group class="editbutton">
            <el-button type="primary" icon="el-icon-check" @click="confirmedit" size="small" />
            <el-button type="primary" icon="el-icon-close" @click="canceledit" size="small" />
          </el-button-group>
        </div>
      </div>
    </el-aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gradeInfoTable: [
        { id: 1, gradename: "小班", ifGraduation: "否" },
        { id: 2, gradename: "中班", ifGraduation: "否" },
        { id: 3, gradename: "大班", ifGraduation: "否" }
      ],
      goodData: [
        {
          id: 1,
          date: "一级1",
          name: ""
        },
        {
          id: 2,
          date: "一级2",
          name: ""
        },
        {
          id: 3,
          date: "一级3",
          name: "",
          children: [
            {
              id: 31,
              date: "二级1",
              name: ""
            },
            {
              id: 32,
              date: "二级2",
              name: "",
              children: [
                {
                  date: "三级1",
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  date: "三级2",
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 4,
          date: "一级4",
          name: ""
        },
        {
          id: 5,
          date: "一级4",
          name: ""
        },
        {
          id: 6,
          date: "一级4",
          name: ""
        },
        {
          id: 4,
          date: "一级4",
          name: ""
        },
        {
          id: 5,
          date: "一级4",
          name: ""
        },
        {
          id: 6,
          date: "一级4",
          name: ""
        }
      ]
    };
  },
  props: {
    chooseFlag: false,
    editshow: true
  },
  components: {},
  methods: {
    edit() {
      console.log("111111");
      //   this.chooseFlag = true;
      //   this.editshow = false;
      this.$emit("upedit");
    },
    confirmedit() {
      this.$emit("upconfirmedit");
    },
    canceledit() {
      this.$emit("upcanceledit");
    }
  }
};
</script>

<style scoped>
.edit {
  /* margin-top: 40px; */
  /* border: 1px solid green; */
  display: flex;
  justify-content: flex-end;
  /* border-top: 1px solid black; */
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
