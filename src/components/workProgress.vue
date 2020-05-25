<template>
  <div class="workPoolItem">
    <div>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">统计</el-menu-item>
        <!-- <el-menu-item index="2">项目进度</el-menu-item> -->
      </el-menu>
      <br />
      <!--统计-->
      <Statistics v-show="activeIndex==1" :getData="getStatistics"></Statistics>
      <!-- <div v-show="activeIndex==2">
        <div class="searchPanel">
          <div class="singleSearch">
            <span class="searchField">职位名称：</span>
            <input type="text" class="searchInput" v-model="QueryStr.strjobname" placeholder />
          </div>
          <div class="singleSearch">
            <span class="searchField">公司名称：</span>
            <input type="text" class="searchInput" v-model="QueryStr.strentname" />
          </div>
          <div class="singleSearch">
            <span class="searchField">所属城市：</span>
            <el-select v-model="regionSelect" multiple :placeholder="ifMultiSelect" @change="handleChangeRegion">
              <el-option v-for="region in regionOptions" :key="region.value" :label="region.label"
                :value="region.value"></el-option>
            </el-select>
          </div>

          <div class="singleSearch">
            <el-radio-group v-model="ifhave" @change="handleIfSelect">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="有候选人"></el-radio-button>
              <el-radio-button label="无候选人"></el-radio-button>
            </el-radio-group>
          </div>
          <button class="btnSearch" @click="handleChangeDaysPage(1)">搜索</button>
          <button class="btnClean" @click="handleCleanSearch">重置</button>
        </div>
        <div class="tpl-scrollable">
          <ul class="date-header">
            <li class="date-tag">
              <el-button slot="reference" class="btn-tag" @click="getTotalList"
                :class="{'btn-active':'所有职位'==activeKey}">所有职位</el-button>
            </li>
            <li v-for="item,index in dateList" class="date-tag">
              <el-button slot="reference" class="btn-tag" @click="handleChangeDate(tdays, item.key, item.value)"
                :class="{'btn-active':item.key==activeKey}">{{item.key}}</el-button>
            </li>
          </ul>
          <ul class="inf-header">
            <li style="text-align:left">职位名</li>
            <li>公司名</li>
            <li v-show="activeKey != '所有职位'">面试时间</li>
            <li>已报名</li>
            <li>待面试</li>
            <li>已淘汰</li>
            <li></li>
          </ul>
          <div v-show="activeKey == '所有职位'">
            <ul v-for="(item,index) in totalLists" v-bind:key="index" class="inf-body">
              <li style="text-align:left">
                <a class="user-name" @click="handleChangeRoute(item)">{{item.jobName}}</a>
              </li>
              <li>
                <a class="user-name" @click="handleChangeRoute(item)">{{item.entName}}</a>
              </li>
              <li>
                <a class="user-name" @click="handleChangeRoute(item)">{{!item.count.totalcvnum ? 0: item.count.totalcvnum}}</a>
              </li>
              <li>
                <a class="user-name" @click="handleChangeRoute(item)">{{ !item.count.passcvnum ? 0: item.count.passcvnum}}</a>
              </li>
              <li>
                <a class="user-name"
                  @click="handleChangeRoute(item)">{{ !item.count.refusecvnum ? 0: item.count.refusecvnum}}</a>
              </li>
            </ul>
            <div v-if="totalLists.length > 0">
              <el-pagination :page-size="countnum" :pager-count="5" layout="prev, pager, next" :total="allJobNum"
                @current-change="changeAllJobList" @prev-click="changeAllJobList"
                @next-click="changeAllJobList"></el-pagination>
            </div>
          </div>
          <div v-show="activeKey != '所有职位'">
            <ul v-for="item,index in jobCountInfList" class="inf-body">
              <li style="text-align:left">
                <a class="user-name" @click="handleChangeRoute(item)">{{item.jobName}}</a>
              </li>
              <li>
                <a class="user-name" @click="handleChangeRoute(item)">{{item.entName}}</a>
              </li>
              <li v-if="ifTdays">
                <a class="user-name"
                  @click="handleChangeRoute(item)">{{item.vbdate ? item.vbdate : ""}}&nbsp;{{item.vedate ? " - " + item.vedate : ""}}</a>
              </li>
              <li>
                <a class="user-name" @click="handleChangeRoute(item)">{{(item.totalCvNum==null)? 0: item.totalCvNum}}</a>
              </li>
              <li>
                <a class="user-name" @click="handleChangeRoute(item)">{{(item.passCvNum==null)? 0: item.passCvNum}}</a>
              </li>
              <li>
                <a class="user-name"
                  @click="handleChangeRoute(item)">{{(item.refuseCvNum==null)? 0: item.refuseCvNum}}</a>
              </li>
            </ul>
            <div v-if="totalNum > 9">
              <el-pagination :page-size="countnum" :pager-count="5" layout="prev, pager, next" :total="totalNum"
                @current-change="handleChangeDaysPage" @prev-click="handleChangeDaysPage"
                @next-click="handleChangeDaysPage"></el-pagination>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
  import xz from "../common";
  import Statistics from "./statistics";
  export default {
    components: {
      Statistics
    },
    data: function () {
      return {
        activeIndex: "1",
        dateList: [{
            key: "今天",
            value: 0
          },
          {
            key: "明天",
            value: 1
          },
          {
            key: "2天",
            value: 2
          },
          {
            key: "3天",
            value: 3
          },
          {
            key: "4天",
            value: 4
          }
        ],
        tdays: 0,
        days: 0,
        jobCountInfList: [],
        totalNum: 0,
        countnum: 10,
        currpage: 1,
        ifTdays: false,
        activeKey: "所有职位",
        QueryStr: {
          strjobname: "",
          strentname: "",
          strnation: "",
          ifhave: ""
        },
        ifMultiSelect: "请选择",
        regionSelect: [],
        ifShowSearch: false,
        regionOptions: [{
            label: "不限",
            value: ""
          },
          {
            label: "我的城市",
            value: "9999"
          },
          {
            label: "上海市",
            value: "3100"
          },
          {
            label: "重庆市",
            value: "5001"
          },
          {
            label: "成都市",
            value: "5101"
          },
          {
            label: "长沙市",
            value: "4301"
          },
          {
            label: "武汉市",
            value: "4201"
          },
          {
            label: "济南市",
            value: "3701"
          },
          {
            label: "芜湖市",
            value: "3402"
          },
          {
            label: "无锡市",
            value: "3202"
          },
          {
            label: "杭州市",
            value: "3301"
          },
          {
            label: "绍兴市",
            value: "3306"
          },
          {
            label: "宁波市",
            value: "3302"
          },
          {
            label: "台州市",
            value: "3310"
          },
          {
            label: "温州市",
            value: "3303"
          },
          {
            label: "中山市",
            value: "4420"
          },
          {
            label: "广州市",
            value: "4401"
          }
        ],
        ifhave: "全部",
        //显示统计
        getStatistics: true,
        //总计分页
        pagination: 1,
        //总计列表
        totalLists:[],
        allJobNum: 0
      };
    },

    watch: {
      days: function () {
        //this.handleGetJobCount(this.days);
        this.handleChangeDaysPage(1);
      }
      // "$store.state.instcode": {
      //   handler: function() {
      //     if (this.$store.state.instnation) {
      //       //暂时不限制区域，直接打开所有的
      //       let t = this.$store.state.instnation;
      //       if (t != "all" && t != "全国") {
      //         let tArr = t.split(",");
      //         let arr = "";
      //         tArr.forEach(t => {
      //           let tCode = "";
      //           if (t.slice(-4) == "0000") {
      //             //省
      //             tCode = t.slice(0, 2);
      //           } else if (t.slice(-4) != "0000" && t.slice(-2) == "00") {
      //             //获取市的数据
      //             tCode = t.slice(0, 4);
      //           } else {
      //             //获取县的数据
      //             tCode = t;
      //           }
      //           //处理t
      //           arr ? (arr += "," + tCode) : (arr += tCode);
      //         });
      //         this.regionOptions.unshift({
      //           label: "我的城市",
      //           value: arr
      //         });
      //       }
      //     }
      //   },
      //   immediate: true
      // }
    },
    created() {
      this.tdays = new Date().getTime();
      //this.handleChangeDate(this.tdays, "今天", 0);
      this.dateList.forEach(item => {
        item.key = `${this.handleGetDate(this.tdays, item.value)}`;
      });
      this.dateList[0].key = "今天";
      //获取总计数据
      this.getTotalList();
    },
    methods: {
      //获取职位列表
      getTotalList(){
        this.activeKey = "所有职位";
        let filterData = {
          countnum: 10,
          currpage: this.pagination,
          status: 1,
          searchinfor: {
            jobname: "",
            entname: "",
            edu: "", //没有这个搜索一直固定
            funcname: "",
            salary: "",
            datenum: "",
            keyword: ""
          }
        }
        //获取所有职位列表
        xz.getTotalJobList(filterData).then( listData => {
          if(listData){
            if(Array.isArray(listData.msg)){
              this.allJobNum = listData.totalnum;
              let lists = listData.msg;
              let arrJobId = [];
              //获取投递人数
              lists.forEach( l => {
                arrJobId.push(l.jobid);
              })
              //获取投递、面试人数
              xz.jobsEnrolment(arrJobId.join()).then( count => {
                count.forEach( c => {
                  let matchJob = lists.find( l => {
                    if(c.jobid == l.jobid) return l;
                  })
                  matchJob.count = c
                })
                this.totalLists = lists;
              })
            }
          }
        })
      },
      //总计职位翻页
      changeAllJobList(p){
        this.pagination = p;
        this.getTotalList();
      },
      //切换
      handleSelect(n){
        this.activeIndex = n;
        this.getStatistics = n == 1 ? true : false;
      },
      handleChangeRoute(item) {
        let routeUrl = this.$router.resolve({
          path: "/jobprogress",
          query: {
            jobid: item.jobid,
            pubid: item.pubid,
            jobname: item.jobName,
            entid: item.entId,
            mdate: this.days,
            mtime: item.mTime
          }
        });
        window.open(routeUrl.href, "_blank");
      },
      handleChangeDate(date, key, addDay) {
        let addDayTime = addDay == -1 ? '' : addDay * 24 * 60 * 60 * 1000;
        let nowTime = date + addDayTime;
        this.days = addDay == -1 ? '' : this.funcChangeDate(nowTime);
        this.tdays == nowTime ? (this.ifTdays = true) : (this.ifTdays = false);
        this.activeKey = key;
      },
      /**
       * @param {number} nowTime 传入时间戳
       * @returns {string} strTime 传出格式为0000-00-00的字符串
       */
      funcChangeDate(nowTime) {
        let now = new Date(nowTime);
        let y = now.getFullYear();
        let m = now.getMonth() + 1;
        let d = now.getDate();
        let strTime =
          y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
        return strTime;
      },
      handleGetDate(date, addDay) {
        let addDayTime = addDay * 24 * 60 * 60 * 1000;
        let now = new Date(date + addDayTime);
        return `${now.getMonth() + 1}月${now.getDate()}日`;
      },
      // 获取职位统计数据
      handleChangeDaysPage(page) {
        this.currpage = page;
        xz.jobsMeetEnrolment(
          this.days == 0 ? "" : this.days,
          this.countnum,
          this.currpage,
          this.QueryStr
        ).then(res => {
          if (res) {
            this.totalNum = res.totalNum;
            res.jobCountList.forEach(r => {
              let dates = r.mTime.split("%");
              var vbdate = dates[0];
              var vedate = dates[1];
              //格式化
              vbdate == "00:00:00" ? (vbdate = "") : (vbdate = vbdate.split(":"));
              vedate == "00:00:00" ? (vedate = "") : (vedate = vedate.split(":"));
              if (vbdate) r.vbdate = vbdate[0] + ":" + vbdate[1];
              if (vedate) r.vedate = vedate[0] + ":" + vedate[1];
            });
            this.jobCountInfList = res.jobCountList;
          } else {
            this.jobCountInfList = [{
              jobName: "暂无面试安排"
            }];
          }
        });
      },
      handleCleanSearch() {
        this.QueryStr.strjobname = "";
        this.QueryStr.strentname = "";
        this.QueryStr.strnation = "";
        this.ifhave = "全部";
        this.QueryStr.ifhave = "";
        this.handleChangeDaysPage(1);
      },
      //选中后的回调
      handleIfSelect() {
        if (this.ifhave == "有候选人") {
          this.QueryStr.ifhave = "1";
        } else if (this.ifhave == "无候选人") {
          this.QueryStr.ifhave = "0";
        } else {
          this.QueryStr.ifhave = "";
        }

        this.handleChangeDaysPage(1);
      },
      //地区选择器的选择事件
      handleChangeRegion(e) {
        let a = [];
        e.forEach(t => {
          if (!t) {
            this.ifMultiSelect = false;
            this.regionSelect = [];
            this.ifMultiSelect = "不限";
            a = "";
            return false;
          }
          if (t === "9999") {
            this.ifMultiSelect = false;
            this.regionSelect = [];
            this.ifMultiSelect = "我的城市";
            a = this.handleGetAccountNation();
            return false;
          }
        });
        if (typeof a === "string") {
          this.QueryStr.strnation = a;
        } else {
          this.QueryStr.strnation = e.join(",");
        }
      },
      // 获取当前账号的地区信息
      handleGetAccountNation() {
        if (this.$store.state.instnation) {
          //暂时不限制区域，直接打开所有的
          let t = this.$store.state.instnation;
          if (t != "all" && t != "全国") {
            let tArr = t.split(",");
            let arr = "";
            tArr.forEach(t => {
              let tCode = "";
              if (t.slice(-4) == "0000") {
                //省
                tCode = t.slice(0, 2);
              } else if (t.slice(-4) != "0000" && t.slice(-2) == "00") {
                //获取市的数据
                tCode = t.slice(0, 4);
              } else {
                //获取县的数据
                tCode = t;
              }
              //处理t
              arr ? (arr += "," + tCode) : (arr += tCode);
            });
            return arr;
          } else {
            return "";
          }
        } else {
          return "";
        }
      }
    }
  };
</script>
<style scoped>
  .date-header {
    margin-bottom: 10px;
  }

  .date-tag {
    display: inline-block;
  }

  .btn-tag {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }

  .inf-header {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    background: #f8f8f9;
    color: #303133;
    border-bottom: 1px solid #f2f5f8;
    margin-bottom: 10px;
  }

  .inf-header li {
    font-weight: bold;
    box-sizing: border-box;
    text-align: center;
    width: 15%;
    line-height: 3;
  }

  .inf-body {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px solid #f2f5f8;
  }

  .inf-body li {
    font-weight: bold;
    box-sizing: border-box;
    text-align: center;
    width: 15%;
    line-height: 3;
  }

  .btn-active {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }

  .user-name {
    cursor: pointer;
  }

  .searchPanel {
    margin: 10px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
  }

  .searchPanel .singleSearch {
    margin-bottom: 5px;
  }

  .searchPanel .btnSearch {
    padding: 8px 25px;
    font-size: 14px;
    color: #fff;
    background: #409eff;
    border-radius: 3px;
    border: none;
    display: block;
    outline: none;
  }

  .searchPanel .btnClean {
    padding: 8px 25px;
    font-size: 14px;
    color: #303133;
    background: #fff;
    display: block;
    outline: none;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
</style>