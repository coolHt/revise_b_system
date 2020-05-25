<template>
  <div class="interviewSetting">
    <div class="infor_field">
      <label class="field_name">
        <span style="color:#f38480 !important;">*</span>面试地点：
      </label>
      <div style="display:flex;align-items:center;" ref="interviewAddressBox">
        <MRegion :fullrange="true" :selected="selected" @cRegion="getRegion" :search="true"></MRegion>
        <span class="locateSplit">/</span>
        <input
          v-model="interviewAddress"
          type="text"
          placeholder="详细地址"
          autocomplete="off"
          class="interviewAddress"
          @blur="checkEmpty"
        />
      </div>
      <p class="errorMessage" ref="selected">请选择和填写面试地点</p>
    </div>
    <div class="field_style_bottom flexContainer" style="padding-bottom:20px;">
      <p class="s_fileld_title">
        <span class="must_icon">*</span>
        面试时间
      </p>
      <div class="interviewTimeSetting">
        <div id="datepk" style="width: 100%;"></div>
        <div v-for="(date, index) in multiplyDate" :key="index" class="multiplyDate">
          <span v-if="index > 0" class="multiplyDate_delete" @click="deleteDate(index)">删除</span>
          <div class="interViewTime" ref="interviewDateBox">
            <span class="interViewTime_title">日期：</span>
            <span style="display:inline-block;width: 90px;">{{date.vDate}}</span>
          </div>
          <div class="interViewTime">
            <span class="interViewTime_title">开始时间：</span>
            <el-time-select
              placeholder="选择时间"
              v-model="date.vBtime"
              :picker-options="{
                start: '08:00',
                step: '00:15',
                end: '24:00'
              }"
              @change="checkMultiplyDate"
            ></el-time-select>
          </div>
          <div class="interViewTime">
            <span class="interViewTime_title">结束时间：</span>
            <el-time-select
              placeholder="选择时间"
              v-model="date.vEtime"
              :picker-options="{
                start: '08:00',
                step: '00:15',
                end: '24:00'
              }"
              @change="checkMultiplyDate"
            ></el-time-select>
          </div>
          <p class="errorMessage">请检查是否填写完整，且开始时间不能大于结束时间</p>
        </div>
      </div>
    </div>
    
    <div class="double_field">
      <div class="invoveAlert">
        <div class="field_style_bottom flexContainer">
          <p class="s_fileld_title">
            <span class="must_icon">*</span>
            面试联系人
          </p>
          <div ref="contactNameBox" class="stratchContainer">
            <input type="text" placeholder="请输入联系人姓名" v-model="contactName" @blur="checkEmpty" />
          </div>
        </div>
        <p class="errorMessage" ref="contactName">请填写联系人姓名</p>
      </div>
      
      <div class="invoveAlert">
        <div class="field_style_bottom flexContainer">
          <p class="s_fileld_title">
            <span class="must_icon">*</span>
            联系人电话
          </p>
          <div ref="contactNumberBox" class="stratchContainer">
            <input type="text" placeholder="请输入联系人电话" v-model="contactNumber" @blur="checkEmpty" />
          </div>
        </div>
        <p class="errorMessage" ref="contactNumber">联系人电话号码格式错误</p>
      </div>
      
    </div>
    <div class="field_style_bottom flexContainer">
      <p class="s_fileld_title">
        面试备注
      </p>
      <textarea class="interviewOther" v-model="otherInf" placeholder="请填写备注"></textarea>
    </div>
    <!--是否删除面试日期-->
    <el-dialog
      :visible.sync="identifyDeleteDate"
      width="300px"
      :append-to-body="true"
      class="identifyDeleteDate_container"
    >
      <p class="identifyDeleteDate_title">是否确认删除?</p>
      <div class="deleteIdentify">
        <button type="button" class="identifyDeleteDate_cancel" @click="identifyDeleteDate=false">取消</button>
        <button type="button" class="identifyDeleteDate_checked" @click="identifyDelete">确认</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    identifyInterview: {
      type: Boolean,
      default: false
    },
    interviewSelected: {
      type: String,
      default: ""
    },
    interviewAdd: {
      type: String,
      default: ""
    },
    interviewData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    interiviewList: {
      type: Array,
      default: function() {
        return new Array();
      }
    },
    cName: "",
    cCode: ""
  },
  data() {
    return {
      phoneReg: /^1[3456789]\d{9}$/,
      teleReg: /^0\d{2,3}-\d{7,8}$/,
      selected: "",
      contactName: "",
      contactNumber: "",
      //设置禁选
      disablePrev: {
        disabledDate: time => {
          // 只能选今天以后的
          return time.getTime() > Date.now() + 86400000 * 60; //两个月时间
        }
      },
      interviewAddress: "", //面试地址
      lng: "",
      lat: "",
      otherInf: "",
      picker: {
        format: "mm"
      },
      //面试时间多选
      multiplyDate: [
        {
          vDate: "请选择",
          vBtime: "9:00",
          vEtime: "17:00"
        }
      ],
      identifyDeleteIndex: null, //要删除的index
      identifyDeleteDate: false,
      blockList: [] //禁选列表
    };
  },
  mounted() {
    this.createCalender(); //日历
  },
  watch: {
    cName: {
      handler: function(){
        this.contactName = this.cName;
      }
    },
    cCode: {
      handler: function(){
        this.contactNumber = this.cCode;
      }
    },
    interiviewList: {
      handler: function() {
        if (this.interiviewList.length > 0) {
          let list = this.interiviewList;
          let dataList = [];
          this.contactName = list[0].Username;
          this.contactNumber = list[0].Usertel;
          this.otherInf = list[0].StrOtherInfo;
          list.forEach(l => {
            let day = this.$store.getters.formatDate(l.DtvDate, "-").split("-");
            day =
              day[0] +
              "-" +
              (day[1].length == 1 ? "0" + day[1] : day[1]) +
              "-" +
              (day[2].length == 1 ? "0" + day[2] : day[2]);
            let b = l.DtBvtime;
            let e = l.DtEvtime;
            dataList.push({
              vDate: day,
              vBtime: b == "00:00:00" ? "" : this.formatTime(b),
              vEtime: e == "00:00:00" ? "" : this.formatTime(e)
              // vBtime: "00:00:00",
              // vEtime: "00:00:00"
            });
          });
          this.multiplyDate = dataList;
          this.$nextTick(() => {
            this.createCalender(); //创建日历
          });
        }
      },
      immediate: true
    },
    interviewSelected: {
      handler: function() {
        if (this.interviewSelected) {
          this.selected = this.interviewSelected;
        }
      },
      immediate: true
    },
    interviewAdd: {
      handler: function() {
        if (this.interviewAdd) {
          this.interviewAddress = this.interviewAdd;
        }
      },
      immediate: true
    }
  },
  methods: {
    //创建日历
    createCalender() {
      //如果已创建，删除
      let pkContainer = document.getElementById("datepk");
      let calender = pkContainer.getElementsByClassName("kalendae");
      for (let i = 0; i < calender.length; i++) {
        calender = pkContainer.getElementsByClassName("kalendae");
        if (calender[0]) {
          pkContainer.removeChild(calender[0]);
        }
      }

      const _this = this;
      //已选择日期
      let dates = [];
      this.multiplyDate.forEach(d => {
        if (d.vDate) dates.push(d.vDate);
      });
      new Kalendae(document.getElementById("datepk"), {
        months: 2,
        mode: "multiple",
        selected: dates,
        subscribe: {
          "date-clicked": function(date) {
            let dateIndex;
            let d = date._i;
            //需要判断所有已选择的是否有这个日期(有就删除, 没有就新增)
            let has = _this.multiplyDate.find((m, index) => {
              if (m.vDate == d) {
                dateIndex = index;
                return m;
              }
            });
            if (has) {
              //如果已存在，就删除
              let newArr = [];
              if (_this.multiplyDate.length == 1) {
                //如果只有一个，就清空赋值
                _this.$set(_this.multiplyDate[0], "vDate", "请选择");
              } else {
                //如果有多个，筛选删除
                _this.multiplyDate.forEach((m, index) => {
                  if (index != dateIndex) newArr.push(m);
                });
                _this.multiplyDate = newArr;
              }
            } else {
              //判断大小
              var selectMs = new Date(d).valueOf();
              var currentYear = new Date().getFullYear();
              var currentMonth = parseInt(new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
              var currentDay = parseInt(new Date().getDate()) < 10? "0" + new Date().getDate() : new Date().getDate();
              
              var currentMs = new Date(`${currentYear}-${currentMonth}-${currentDay}`).valueOf();
              if(parseInt(selectMs) < parseInt(currentMs)) return false;
              //如果第一个vDate是请选择或是没有的话, 给第一个赋值
              if (
                _this.multiplyDate[0].vDate == "请选择" ||
                !_this.multiplyDate[0].vDate
              ) {
                _this.$set(_this.multiplyDate[0], "vDate", d);
              } else {
                _this.addNewInterview(d);
              }
              _this.$nextTick( () => {
                //检验
                _this.checkComplete();
              })
            }
          }
        }
      });
    },
    //error_alert
    getRegion(region) {
      if (region.area) {
        this.selected = region.area.code;
      } else if (region.city) {
        this.selected = region.city.code;
      } else if (region.province) {
        this.selected = region.province.code;
      }
      this.checkEmpty();
    },
    //验证
    checkDataIsEmpty() {
      let allFill = true;
      //城市
      if (!this.selected || !this.interviewAddress.trim()) {
        this.$refs["selected"].style.cssText += "display:block";
        allFill = false;
      }

      if (!this.interviewAddress.trim()) {
        this.$refs["interviewAddressBox"]
          .getElementsByClassName("interviewAddress")[0]
          .classList.add("error_alert");
        allFill = false;
      }
      if (!this.selected) {
        this.$refs["interviewAddressBox"]
          .getElementsByClassName("trigger_select")[0]
          .classList.add("error_alert");
        allFill = false;
      }
      //
      //联系人名称
      if (!this.contactName.trim()) {
        this.$refs["contactName"].style.cssText += "display:block";
        this.$refs["contactNameBox"]
          .getElementsByTagName("input")[0]
          .classList.add("error_alert");
        allFill = false;
      }
      //手机号验证
      if (!this.phoneReg.test(this.contactNumber) && !this.teleReg.test(this.contactNumber)) {
        this.$refs["contactNumber"].style.cssText += "display:block";
        this.$refs["contactNumberBox"]
          .getElementsByTagName("input")[0]
          .classList.add("error_alert");
        allFill = false;
      }
      //如果第一个面试信息没有设置
      if (!this.multiplyDate[0].vDate) {
        let dateList = document.getElementsByClassName("multiplyDate")[0];
        dateList.classList.add("multiplyDate_error");
        allFill = false;
      }
      //如果面试信息列除了第一个，有其他的没有设置正确
      let isSettingCorrect = this.checkHasEmpty();
      if (!isSettingCorrect) allFill = false;
      if (allFill) {
        return {
          username: this.contactName,
          userTel: this.contactNumber,
          vAddr: this.interviewAddress,
          vCity: this.selected,
          vOtherInf: this.otherInf,
          list: isSettingCorrect
        };
      }
      return false;
    },
    //失去焦点检查
    checkEmpty() {
      if (this.selected && this.interviewAddress.trim()) {
        this.$refs["selected"].style.cssText += "display:none";
      }
      if (this.selected) {
        this.$refs["interviewAddressBox"]
          .getElementsByClassName("trigger_select")[0]
          .classList.remove("error_alert");
      }
      if (this.interviewAddress.trim()) {
        this.$refs["interviewAddressBox"]
          .getElementsByClassName("interviewAddress")[0]
          .classList.remove("error_alert");
      }
      //联系人名称
      if (this.contactName.trim()) {
        this.$refs["contactName"].style.cssText += "display:none";
        this.$refs["contactNameBox"]
          .getElementsByTagName("input")[0]
          .classList.remove("error_alert");
      }
      //手机号验证
      if (this.phoneReg.test(this.contactNumber) || this.teleReg.test(this.contactNumber)) {
        this.$refs["contactNumber"].style.cssText += "display:none";
        this.$refs["contactNumberBox"]
          .getElementsByTagName("input")[0]
          .classList.remove("error_alert");
      }
    },
    //检查日期填写
    checkMultiplyDate() {
      this.checkComplete();
    },
    //新增面试时间
    addNewInterview(d) {
      let pre = this.multiplyDate[this.multiplyDate.length - 1];
      this.multiplyDate.push({
        vDate: d,
        vBtime: pre.vBtime,
        vEtime: pre.vEtime
      });
    },
    //删除面试时间
    deleteDate(index) {
      this.identifyDeleteDate = true;
      this.identifyDeleteIndex = index;
    },
    //确认删除
    identifyDelete() {
      let arr = [];
      this.multiplyDate.forEach((t, i) => {
        if (i != this.identifyDeleteIndex) arr.push(t);
      });
      this.multiplyDate = arr;
      this.identifyDeleteDate = false;
      this.createCalender();
    },
    //判断是否有未填写的
    checkHasEmpty() {
      let dateList = document.getElementsByClassName("multiplyDate");
      const list = this.multiplyDate;
      let dates = {};
      list.forEach((l, index) => {
        let isNormal = this.compareTime(l.vBtime, l.vEtime);
        console.log(isNormal);
        //如果有填写不完整的
        if ((!l.vDate) || l.vDate == '请选择' || !l.vBtime || !l.vEtime || !isNormal) {
          dates = null;
          dateList[index].classList.add("multiplyDate_error");
          let err = dateList[index].getElementsByClassName("errorMessage")[0];
          err.style.cssText += "display: block";
        }
      });
      if (dates) {
        //如果填写完整，返回数据
        let dateList = [];
        list.forEach(d => {
          if (d.vDate) dateList.push(d);
        });
        return dateList;
      } else {
        return dates;
      }
    },
    //判断开始时间结束时间大小
    compareTime(s, e){
      if(!s || !e) return false;
      let sTime = s.split(':');
      let eTime = e.split(':');
      if(parseInt(sTime[0]) < parseInt(eTime[0])){
        return true;
      }
      if(parseInt(sTime[0]) > parseInt(eTime[0])){
        return false;
      }
      if(parseInt(sTime[0]) == parseInt(eTime[0])){
        if(parseInt(sTime[1]) <= parseInt(eTime[1])){
          return true;
        }else{
          return false;
        }
      }
    },
    //检查是否填写完整
    checkComplete() {
      //this.multiplyDate
      let dateList = document.getElementsByClassName("multiplyDate");
      this.multiplyDate.forEach((d, index) => {
        let isNormal = this.compareTime(d.vBtime, d.vEtime);
        if (d.vDate && d.vBtime && d.vEtime && isNormal) {
          dateList[index].classList.remove("multiplyDate_error");
          let err = dateList[index].getElementsByClassName("errorMessage")[0];
          err.style.cssText += "display: none";
        }
      });
    },
    //标准化时间
    formatTime(t) {
      let timer = t.split(":");
      return timer[0] + ":" + timer[1];
    }
  }
};
</script>
<style scoped>
.interviewAddress {
  width: 200px;
}
.errorMessage {
  color: #c82a2e !important;
  font-size: 14px;
  margin-left: 150px;
  display: none;
}
.multiplyDate_error {
  padding: 5px;
  border: 1px dashed #c82a2e;
}
.interviewSetting .infor_field {
  align-items: unset;
}
.inforSet .infor_field .field_name {
  line-height: 45px;
}
.interviewOther {
  flex-grow: 100;
  width: 550px;
  outline: none;
  box-sizing: border-box;
  border-radius: 6px;
  border: none;
  height: 35px;
  font-size: 12px;
  padding-left: 20px;
  -webkit-box-sizing: border-box;
  line-height: 35px;
}
.interViewTime{
  border-bottom:1px solid #333;
  margin-right: 30px;
}
.interViewTime_title {
  box-sizing: border-box;
  padding-right: 10px;
  padding-left: 0;
  text-align: right;
  margin-bottom: 0;
  color: #333;
  padding-top: 0;
  line-height: 35px;
  font-weight: bold;
}
.interviewTimeSetting {
  width: 700px;
}
.addNewInterview {
  color: #409eff !important;
  cursor: pointer;
}
.multiplyDate {
  display: flex;
  width: 100%;
  margin-top: 12px;
  flex-wrap: wrap;
  position: relative;
}
.multiplyDate:first-child {
  margin-top: 0;
}
.multiplyDate_delete {
  display: block;
  right: -35px;
  cursor: pointer;
  position: absolute;
  top: 0;
  padding: 4px 15px;
  color: #fff !important;
  background: #E93131;
  border-radius: 3px;

  
}
.identifyDeleteDate_title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  text-align: center;
}
.deleteIdentify {
  width: 80%;
  margin: 25px auto 0;
  display: flex;
  justify-content: space-between;
}
.deleteIdentify button {
  padding: 8px 20px;
  cursor: pointer;
  outline: none;
  font-size: 14px;
  border-radius: 5px;
}
.identifyDeleteDate_checked {
  background: #409eff;
  color: #fff;
  border: 1px solid #409eff;
}
.error_text {
  display: none;
}
.multiplyDate_error .error_text {
  display: block;
  margin-left: 0;
}
</style>
<style>
.interViewTime .el-input__inner {
  width: 125px;
  padding-left:0 !important;
  border: none !important;
  height: 35px;
  cursor: pointer;
  font-size: 14px;
  color:#606266;
}
.interviewTimeSetting .el-date-editor.el-input {
  width: 165px;
}
.interViewTime .el-date-editor.el-input {
  width: 125px;
  cursor: pointer;
}
.identifyDeleteDate_container .el-dialog__body {
  padding: 10px 20px 25px 20px;
}
.interViewTime .el-input__prefix{
  display: none;
}
</style>