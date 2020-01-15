<template>
  <div class="app-container">
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
      <!-- @click.native="handleUpdate(autoUpdate)" -->
    </div>

    <el-dialog
      title="选择考勤参考日"
      :visible.sync="rulesdayshow"
      width="700px"
      :before-close="handleClose"
    >
      <el-form :model="chooseattendance" ref="chooseattendance" label-width="100px">
        <el-form-item label="选择考勤日" prop="attendanceday">
          <el-radio v-model="chooseattendance.attendanceday" label="1">星期一</el-radio>
          <el-radio v-model="chooseattendance.attendanceday" label="2">星期二</el-radio>
          <el-radio v-model="chooseattendance.attendanceday" label="3">星期三</el-radio>
          <el-radio v-model="chooseattendance.attendanceday" label="4">星期四</el-radio>
          <el-radio v-model="chooseattendance.attendanceday" label="5">星期五</el-radio>
          <el-radio v-model="chooseattendance.attendanceday" label="6">星期六</el-radio>
          <el-radio v-model="chooseattendance.attendanceday" label="7">星期日</el-radio>
        </el-form-item>
      </el-form>
      <el-button type="success" @click="cancelDiag('rulesdayshow')">取消</el-button>
      <el-button type="primary" @click="confirmresult()">确认</el-button>
    </el-dialog>

    <el-dialog
      title="是否关闭考勤日"
      :visible.sync="ifcloseattendanceshow"
      width="700px"
      :before-close="handlecloseattendance"
    >
      <el-form :model="closeattendance" ref="closeattendance" label-width="100px">
        <el-form-item label="关闭考勤日" prop="closeattendance">
          <el-radio v-model="closeattendance.ifclose" label="1">是</el-radio>
          <el-radio v-model="closeattendance.ifclose" label="2">否</el-radio>
          <!-- <el-switch
            v-model="closeattendance.ifclose"
            active-text="否"
            inactive-text="是"
            :change="switchattendance"
          />-->
        </el-form-item>
      </el-form>
      <el-button type="success" @click="cancelcloseattendance">取消</el-button>
      <el-button type="primary" @click="confirmcloseattendance">确认</el-button>
    </el-dialog>
    <!-- <el-dialog
      title="是否关闭考勤"
      :visible.sync="ifshutattendance"
      width="30%"
      :before-close="handleshutattendance"
    >
      <span>是否确认关闭考勤</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelattendance">取 消</el-button>
        <el-button type="primary" @click="confirmattendance">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
import solarLunar from "solarLunar";
import store from "@/store";
import { setAttendance, getDateList } from "@/api/singleday.js";
export default {
  data() {
    return {
      shutflag: true,
      ifcloseattendanceshow: false,
      ifshutattendance: false,
      rulesshowflag: {},
      chooseattendance: {
        attendanceday: "1"
      },
      closeattendance: {
        ifclose: "1"
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
      handler(newValue, oldValue) {
        console.log("监视里的rulesshowflag");
        console.log(newValue, oldValue);
        if (!oldValue.length) {
          return;
        }
        // console.log(newValue[0]);
        // console.log("-----------");
        // console.log(oldValue[0]);
        if (newValue[0].day !== oldValue[0].day) {
          return;
        } else {
          console.log("this.shutflag");
          console.log(this.shutflag);
          if (newValue[0].ifWorkDay === true && this.shutflag === true) {
            this.rulesdayshow = true;
          } else if (
            newValue[0].ifWorkDay === true &&
            this.shutflag === false
          ) {
            return;
          } else {
            console.log("ifshutattendance");
            this.ifcloseattendanceshow = true;
            // if (this.ifAttendance) {
            //   // this.ifshutattendance = true;
            //   this.ifcloseattendanceshow = true;
            //   console.log("请先关闭考勤");
            // } else {
            //   return;
            // }
          }
        }
      },
      deep: true,
      immediate: false
    }
  },
  computed: {},
  created() {
    this.getDateInfo();
  },
  methods: {
    // handleUpdate(autoUpdate) {
    //   let strOpen = "是否确认开启开关。";
    //   let strClose = "是否确认关闭开关。";
    //   if (!autoUpdate) {
    //     // 弹窗询问，这个是封装过的element ui 弹窗
    //     this.wConfirmTip("开启开关", strOpen, () => {
    //       this.autoUpdate = true;
    //     });
    //   } else {
    //     this.wConfirmTip("关闭开关", strClose, () => {
    //       this.autoUpdate = false;
    //     });
    //   }
    // },
    confirmattendance() {
      // this.ifAttendance = false;
      // this.ifshutattendance = false;
    },
    cancelattendance() {
      // this.rulesdayshow = true;
      // // this.dayList[0].ifWorkDay = true;
      // this.ifAttendance = true;
      // this.ifshutattendance = false;
    },
    switchattendance() {
      console.log("11123344");
    },
    cancelcloseattendance() {
      this.ifcloseattendanceshow = false;
    },
    confirmcloseattendance() {
      console.log("000000");
      console.log(this.closeattendance.ifclose);
      if (this.closeattendance.ifclose === "2") {
        this.shutflag = false;
        setTimeout(() => {
          this.dayList[0].ifWorkDay = true;
          this.closeattendance.ifclose = "1";
          setTimeout(() => {
            this.shutflag = true;
          });
        }, 200);
      } else {
        console.log("开始发送请求");
        let access_token = this.access_token;
        let date = this.dayList[0].day.match(/\d+年\d+月\d+日/)[0];
        let is_attendance = this.dayList[0].ifWorkDay ? 1 : 0;
        let obj = { access_token, date, is_attendance };
        setAttendance(obj)
          .then(success => {
            console.log(success);
          })
          .catch(error => {
            console.log(error);
          });
      }

      this.ifcloseattendanceshow = false;
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
    handlecloseattendance(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          console.log(123);
          // this.rulesdayshow = false;
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
        // console.log(res.data);
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
      // this.dayList[0].ifWorkDay = true;

      // setTimeout(() => {
      //   this.dayList[0].ifWorkDay = true;
      // }, 1000); // 这样的效果可以实现反弹效果

      console.log(index[0].ifWorkDay);

      // if (index[0].ifWorkDay === true) {
      //   this.rulesdayshow = true;
      // }

      this.rulesshowflag = index;
      this.ifrest = day;
    },
    confirmresult() {
      console.log("000");
      let access_token = this.access_token;
      let date = this.dayList[0].day.match(/\d+年\d+月\d+日/)[0];
      let is_attendance = this.dayList[0].ifWorkDay ? 1 : 0;
      this.rulesdayshow = false;
      let reference_date = this.chooseattendance.attendanceday;
      let obj = {
        access_token,
        date,
        is_attendance,
        reference_date
      };
      setAttendance(obj)
        .then(success => {
          console.log(success);
        })
        .catch(error => {
          console.log(error);
        });
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
