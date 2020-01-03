<template>
  <div class="app-container">
    <h2>{{dayList}}</h2>
    <h2>{{ifAttendance}}</h2>
    <el-calendar v-model="elDate">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div @click="clickDate(date, data)" class="sideday">
          <div :class="data.isSelected ? 'is-selected' : ''">
            <span :class="findRestWork(date,data) === '休' ? 'rest' : 'work'">
              {{
              findRestWork(date,data)
              }}
            </span>
            <span>
              <span class="daysStyle">{{ findDay(data.day) }}</span>
              <span>{{ findCnDay(data.day) }}</span>
            </span>
          </div>
        </div>
      </template>
    </el-calendar>

    <div v-for="(item, index) in dayList" :key="index" class="switchDay">
      <span>{{ dayList[index].day }}</span>
      <el-switch
        v-model="dayList[index].ifWorkDay"
        active-text="工作日"
        inactive-text="休息日"
        :change="switchChange(dayList[index].ifWorkDay,dayList)"
      />
    </div>

    <!-- <el-table :data="tableData" style="width: 100%" v-show="ifrest">
      <el-table-column label="序号" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column label="考勤参照日">
        <template slot-scope="scope">
          <el-radio v-model="dayInfo" label="1">周一</el-radio>
          <el-radio v-model="dayInfo" label="2">周二</el-radio>
          <el-radio v-model="dayInfo" label="3">周三</el-radio>
          <el-radio v-model="dayInfo" label="4">周四</el-radio>
          <el-radio v-model="dayInfo" label="5">周五</el-radio>
          <el-radio v-model="dayInfo" label="6">周六</el-radio>
          <el-radio v-model="dayInfo" label="0">周日</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="是否考勤">
        <template slot-scope="scope">
          <span>{{ scope.row.reference }}</span>
        </template>
        <template slot-scope="scope">
          <el-switch v-model="ifAttendance" active-text="是" inactive-text="否" />
        </template>
      </el-table-column>
    </el-table>-->
    <el-dialog
      title="选择考勤参考日"
      :visible.sync="rulesdayshow"
      width="700px"
      :before-close="handleClose"
    >
      <!-- <el-form :model="addrepairform" ref="addrepairform" label-width="100px">
        <el-form-item label="选择结果" prop="result">
          <el-radio v-model="addrepairform.result" label="1">未修复</el-radio>
          <el-radio v-model="addrepairform.result" label="2">修复</el-radio>
          <el-radio v-model="addrepairform.result" label="3">无法修复</el-radio>
          <el-radio v-model="addrepairform.result" label="4">退回</el-radio>
        </el-form-item>
      </el-form>-->
      <el-button type="success" @click="cancelDiag('rulesdayshow')">取消</el-button>
      <el-button type="primary" @click="confirmresult('rulesdayshow')">确认</el-button>
    </el-dialog>
    <el-dialog
      title="是否关闭考勤"
      :visible.sync="ifshutattendance"
      width="30%"
      :before-close="handleshutattendance"
    >
      <span>是否确认关闭考勤</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelattendance">取 消</el-button>
        <!-- ifshutattendance = false -->
        <el-button type="primary" @click="confirmattendance">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import solarLunar from "solarLunar";
import store from "@/store";
import { setAttendance, getDateList } from "@/api/singleday.js";
export default {
  data() {
    return {
      ifshutattendance: false,
      rulesshowflag: {},
      addrepairform: {
        result: "1"
      },
      rulesdayshow: false,
      is_attendance_dic: {},
      access_token: store.getters.access_token,
      ifAttendance: true,
      ifrest: false,
      dayInfo: "1",
      choosenDay: "",
      reference_date: "",
      elDate: new Date(),
      value: true,
      calendarArr: {
        type: "combination",
        headStyle: {
          todayBtn: "right",
          combination: "center",
          checkBtn: "right"
        },
        viewStyle: {
          day: "right"
        },
        calendarData: []
      },
      tableData: [
        {
          ID: "1",
          group: "在编",
          check: true,
          reference:
            "星期一,星期二,星期三,星期四,07:45:00-16:20:00;星期五,07:45:00-15:30:00;"
        }
      ],
      dayList: []
      // month: this.elDate.getMosnth()
    };
  },
  watch: {
    elDate(newvalue, oldvalue) {
      this.getDateInfo();
    },
    rulesshowflag: {
      // console.log("====");
      // console.log(newvalue, oldvalue);
      // // if (newvalue === true) {
      // //   this.rulesdayshow = true;
      // // }
      handler(newValue, oldValue) {
        // console.log(!oldValue.length);
        if (!oldValue.length) {
          return;
        }
        console.log(newValue[0]);
        console.log("-----------");
        console.log(oldValue[0]);

        if (newValue[0].day !== oldValue[0].day) {
          return;
        } else {
          if (newValue[0].ifWorkDay === true) {
            this.rulesdayshow = true;
          } else {
            if (this.ifAttendance) {
              // this.dayList[0].ifWorkDay = true;
              // console.log(this.dayList[0].ifWorkDay);
              this.ifshutattendance = true;
              console.log("请先关闭考勤");
              // $alert("请先关闭考勤");
            } else {
              return;
            }
          }
        }
        // console.log(newvalue);
      },
      deep: true,
      immediate: false
    }
  },
  computed: {
    // month() {
    //   return this.elDate.getMonth();
    // }
  },
  created() {
    this.getDateInfo();
  },
  methods: {
    confirmattendance() {
      this.ifAttendance = false;
      this.ifshutattendance = false;
    },
    cancelattendance() {
      this.rulesdayshow = true;
      this.dayList[0].ifWorkDay = true;
      this.ifAttendance = true;
      this.ifshutattendance = false;
    },
    handleshutattendance(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          console.log(123);
          this.rulesdayshow = false;
          console.log(this.rulesdayshow);
          done();
        })
        .catch(_ => {});
    },
    getDateInfo() {
      let year = this.elDate.getFullYear();
      let month = this.elDate.getMonth();
      let obj0 = {
        access_token: this.access_token,
        year: year,
        mouth: month + 1
      };
      let obj1 = {
        access_token: this.access_token,
        year: year,
        mouth: month
      };
      let obj2 = {
        access_token: this.access_token,
        year: year,
        mouth: month + 2
      };
      getDateList(obj0).then(res => {
        console.log(res.data);
        for (let i of res.data) {
          let date = i["date"];
          let is_attendance = i["is_attendance"];
          this.$set(this.is_attendance_dic, date, is_attendance);
        }
      });
      getDateList(obj1).then(res => {
        for (let i of res.data) {
          let date = i["date"];
          let is_attendance = i["is_attendance"];
          this.$set(this.is_attendance_dic, date, is_attendance);
        }
      });
      getDateList(obj2).then(res => {
        for (let i of res.data) {
          let date = i["date"];
          let is_attendance = i["is_attendance"];
          this.$set(this.is_attendance_dic, date, is_attendance);
        }
      });
    },
    switchChange(day, index) {
      // console.log(day, index);
      // if (day === true) {
      //   this.rulesdayshow = true;
      // }
      this.rulesshowflag = index;
      this.ifrest = day;
    },
    confirmresult(attr) {
      console.log(attr);
      this.rulesdayshow = false;
    },
    cancelDiag(attr) {
      this.$confirm("确认取消？")
        .then(_ => {
          this[attr] = false;
          console.log(this.rulesdayshow);
        })
        .catch(_ => {});
    },
    findRestWork(date, data) {
      let days = "";
      let day = data.day;
      days = this.is_attendance_dic[day];
      if (days === 0) {
        return "休";
      } else if (days === 1) {
        return "班";
      } else {
        return "";
      }
    },
    findDay(day) {
      let y = day.split("-")[0];
      let m = day.split("-")[1];
      let d = day.split("-")[2];
      let cnd = solarLunar.solar2lunar(y, m, d).dayCn;
      return d;
    },
    findCnDay(day) {
      let y = day.split("-")[0];
      let m = day.split("-")[1];
      let d = day.split("-")[2];
      let cnd = solarLunar.solar2lunar(y, m, d).dayCn;
      return cnd;
    },
    clickDate(date, data) {
      this.choosenDay = data.day;
      let weekday = date.getDay();
      this.dayInfo = date.getDay().toString();
      this.reference_date = date.getDay();
      const weekDayDict = {
        1: "周一",
        2: "周二",
        3: "周三",
        4: "周四",
        5: "周五",
        6: "周六",
        0: "周日"
      };
      let restDict = {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false,
        0: false
      };
      this.ifrest = restDict[weekday];
      this.ifAttendance = restDict[weekday];
      const dateStr =
        data.day.split("-").slice(0, 1)[0] +
        "年" +
        data.day.split("-").slice(1, 2)[0] +
        "月" +
        data.day.split("-").slice(2, 3)[0] +
        "日" +
        weekDayDict[weekday] +
        ":";

      const tempObj = { day: dateStr };
      if (weekday === 6 || weekday === 0) {
        tempObj.ifWorkDay = false;
      } else {
        tempObj.ifWorkDay = true;
      }
      this.dayList = [];
      this.dayList.push(tempObj);
      var obj = {};
      this.dayList = this.dayList.reduce(function(item, next) {
        obj[next.day] ? "" : (obj[next.day] = true && item.push(next)); // obj[next.day] = true 这句话会让obj变为 {2019-11-1:ture}
        return item;
      }, []);
    },
    handleClickDay(item) {
      const weekDayDict = {
        1: "周一",
        2: "周二",
        3: "周三",
        4: "周四",
        5: "周五",
        6: "周六",
        0: "周日"
      };
      const month = item.date.getMonth() + 1;
      let dateStr = "";

      dateStr =
        item.year +
        "年" +
        month +
        "月" +
        item.day +
        "日" +
        weekDayDict[item.weekday] +
        ":";

      const tempObj = { day: dateStr };
      if (item.weekday === 6 || item.weekday === 0) {
        tempObj.ifWorkDay = false;
      } else {
        tempObj.ifWorkDay = true;
      }
      this.dayList = [];
      this.dayList.push(tempObj);

      var obj = {};
      this.dayList = this.dayList.reduce(function(item, next) {
        obj[next.day] ? "" : (obj[next.day] = true && item.push(next)); // obj[next.day] = true 这句话会让obj变为 {2019-11-1:ture}
        return item;
      }, []);
    },
    handlePrevMonth() {},
    handleNextMonth() {},
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>

<style scoped>
.switchDay {
  display: flex;
  align-items: baseline;
}
.switchDay span {
  line-height: 1;
  font-size: 14px;
  display: inline-block;
}
.is-selected {
  color: #1989fa;
  height: 100%;
  width: 100%;
}
.innerStyle {
  height: 100%;
  width: 100%;
}
.sideday {
  text-align: center;
  height: 100%;
  vertical-align: middle;
  line-height: 33px;
}
.daysStyle {
  font-size: 24px;
}
.el-calendar-day {
}
.rest {
  display: block;
  height: 24px;
  width: 25px;
  line-height: 22px;
  margin-top: -8px;
  margin-left: -8px;
  background-color: rgb(37, 134, 215);
  color: white;
}
.work {
  display: block;
  height: 24px;
  width: 25px;
  line-height: 22px;
  margin-top: -8px;
  margin-left: -8px;
  background-color: rgb(57, 186, 59);
  color: white;
}
</style>
