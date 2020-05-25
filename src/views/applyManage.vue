<template>
  <div class="workPoolItem">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="申请管理" name="pushList"></el-tab-pane>
      <el-tab-pane label="申请历史" name="pushHistory"></el-tab-pane>
    </el-tabs>
    <div>
      <!--搜索条件先保留-->
      <!-- <div class="row" v-if="openSearch">
        <div class="am-u-md-12 am-u-sm-12 row-mb">
          <div class="search-item searchContainer">
            <div class="singleSearch">
              <span class="searchField">姓名：</span>
              <input type="text" class="searchInput">
            </div>
            <div class="singleSearch">
              <span class="searchField">手机：</span>
              <input type="text" class="searchInput">
            </div>
            <div class="singleSearch">
              <span class="searchField">兵种：</span>
              <input type="text" class="searchInput">
            </div>
            <div class="singleSearch">
              <span class="searchField">职位：</span>
              <input type="text" class="searchInput">
            </div>
            <div class="singleSearch">
              <span class="searchField">年龄：</span>
              <input type="text" class="searchInput">
            </div>
            <div class="singleSearch">
              <span class="searchField">所在区域：</span>
              <MRegion :search="true" @cRegion="returnCurrentAdd" class="regionSearch"></MRegion>
            </div>
            <div class="singleSearch">
              <span class="searchField">期望区域：</span>
              <MRegion :search="true" @cRegion="returnInentAdd" class="regionSearch"></MRegion>
            </div>
            <div class="singleSearch">
              <span class="searchField">关键词：</span>
              <input type="text" class="searchInput">
            </div>
            <div class="singleSearch">
              <span class="searchField">开始时间：</span>
              <el-date-picker v-model="value1" type="date" placeholder="选择开始时间"></el-date-picker>
            </div>
            <div class="singleSearch">
              <span class="searchField">结束时间：</span>
              <el-date-picker v-model="value2" type="date" placeholder="选择结束时间"></el-date-picker>
            </div>
            <div class="btnContainer">
              <button @click="funClearSearch" class="clearButton">清空</button>
              <button class="searchButton" @click="searchPost">搜索</button>
            </div>
          </div>
        </div>
      </div> -->
      <!--切换-->
      <!--申请管理-->
      <div v-show="activeName == 'pushList'">
        <div>
          <div class="companyList">
            <transition name="loadShadow">
              <div class="loadShadow" v-show="shadowShow">
                <i class="loadgif"></i>
              </div>
            </transition>
            <!--筛选-->
            <div class="filterApply">
              <el-radio-group v-model="applyType" @change="applyTypeChange">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="直通车"></el-radio-button>
              </el-radio-group>
              <!--所在区域选择-->
              <div class="selecteArea">
                <el-select v-model="instnation" placeholder="请选择" @change="searchCurrentAgency">
                  <el-option
                    v-for="item in currentNation"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <table class="formLoop">
              <thead>
                <tr>
                  <th style="width: 8%">姓名</th>
                  <th style="width: 8%">联系方式</th>
                  <th style="width: 5%">年龄</th>
                  <th style="width: 5%">学历</th>
                  <th style="width: 6%">工作年限</th>
                  <th style="width: 6%">期望年薪</th>
                  <th style="width: 7%">期望职能</th>
                  <th style="width: 10%">申请职位</th>
                  <th style="width: 10%">职位企业</th>
                  <th style="width: 7%">负责区域</th>
                  <th style="width: 6%">申请时间</th>
                  <th style="width: 12%">操作</th>
                </tr>
              </thead>
              <tbody v-if="talents">
                <tr v-for="(item,index) in talents" :key="index">
                  <td>
                    <span style="font-weight:bold;cursor:pointer;color:#5b9bd1" @click="checkResume(item)" class="user-name">{{item.psnName}}</span>
                  </td>
                  <td>
                    <el-popover placement="top" width="200" trigger="click">
                      <div style="font-weight:bold;font-size: 18px;color:#333;">{{item.tel}}</div>
                      <el-button slot="reference">查看号码</el-button>
                    </el-popover>
                  </td>
                  <td>
                    <span style="font-weight:bold">{{item.age}}</span>
                  </td>
                  <td style="font-weight:bold">{{item.edu? item.edu : '未填写'}}</td>
                  <td>
                    <span style="font-weight:bold">{{item.exp ? item.exp : '未填写'}}</span>
                  </td>
                  <td style="font-weight:bold">{{item.intentSalary ? item.intentSalary + "万" : "未填写"}}</td>
                  <td style="font-weight:bold">{{item.intentJobFun ? item.intentJobFun : "未填写"}}</td>
                  <td>
                    <a class="user-name" @click="funShowJobDetail(item)">{{item.entJobName}}</a>
                  </td>
                  <td>{{item.entName}}</td>
                  <td>{{item.nationName}}</td>
                  <td>
                    <span>{{item.changDate | formatDate('.')}}</span>
                  </td>
                  <td>
                    <span class="resolveBtn" style="background:#edf2fc;"
                      v-if="item.status!='1' || item.jobid == '00000000-0000-0000-0000-000000000000'">
                      <a style="color:#c0c4cc;">通过</a>
                    </span>
                    <span style="background:#67c23a !important;" class="resolveBtn" v-else>
                     
                      <a slot="reference" @click="funSend(item)">{{item.strstatus == "3" ? '再次通过' : '通过'}}</a>
                    </span>
                    <span style="background:#edf2fc !important;" class="rejectBtn"
                      v-if="item.status!='1' || item.jobid == '00000000-0000-0000-0000-000000000000'">
                      <a style="color:#c0c4cc;">拒绝</a>
                    </span>
                    <span class="rejectBtn" v-else>
                      <a @click="beforeClose(item)">拒绝</a>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="talentsNum > 0">
              <el-pagination :page-size="countnum" :pager-count="5" layout="prev, pager, next" :total="talentsNum"
                @current-change="searchApply" @prev-click="searchApply" @next-click="searchApply"></el-pagination>
            </div>
          </div>
          <!--职位详情dialog-->
          <el-dialog :visible.sync="showJobDetail" width="900px" @close="triggerClose">
            <jobInfoItem :sendjobid="jobId" :funDetail="jobFunDetail" :sententid="sententid" operateApproveal="approve">
            </jobInfoItem>
          </el-dialog>
          <!--拒绝此人dialog-->
          <el-dialog title="备注" :visible.sync="closeDialogVisible" width="30%">
            <el-form>
              <el-form-item label="拒绝理由：">
                <el-input type="textarea" :autosize="{ minRows: 4}" v-model="closeMsg.content"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="closeDialogVisible = false" class="btn-def">取消</el-button>
              <el-button @click="funClose" class="btn-sub">确定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
      <div v-show="activeName == 'pushHistory'">
        <ApplyHistory></ApplyHistory>
      </div>
    </div>
    <!--总简历-->
    <TotalResume ref="totalResume" @closeResume="closeResume" class="stretchNone" :resume="talentInfo"></TotalResume>
  </div>
</template>
<script>
  import xz from '../common';
  import ApplyHistory from '../components/applyHistory';
  import jobInfoItem from "../components/JobDetail";
  import TotalResume from "../components/resume/totalResume";
  export default {
    components: {
      ApplyHistory,
      TotalResume,
      jobInfoItem
    },
    data: function () {
      return {
        applyType: "全部",
        activeName: 'pushList',
        //当前所在机构
        currentNation: [],
        instnation: "",
        //搜索条件
        searchInfo: {
          nation: "",
          username: "",
          usertel: "",
          school: "",
          jobinf: "",
          company: "",
          status: 0,
          keyword: "",
          constatus: "",
          "strstatus": '1' //表示未通过的
        },
        bdate: '',
        edate: '',
        initStart: '',
        initEnd: '',
        //
        singleItem: {}, //当前选择的简历，包括通过，拒绝，查看简历
        showJobDetail: false,
        //
        closeDialogVisible: false,
        //评价
        rateMsg: {
          orderid: "",
          rate: 3,
          content: ""
        },
        //拒绝某人理由
        closeMsg: {
          orderid: "",
          content: ""
        },
        content: {
          con: "",
          status: "",
          date: ""
        },
        //申请管理的人
        talents: [],
        //申请管理的人数
        talentsNum: 0,
        //遮罩层
        shadowShow: false,
        //分页信息
        num: 10,
        currnum: 1,
        //企业id
        sententid: '',
        //职位id
        jobid: '',
        talentInfo: null
      };
    },
    created() {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
      let date = new Date().getDate() + 1 < 10 ? '0' + new Date().getDate() : new Date().getDate();
      this.bdate = year + '-01-01';
      this.edate = year + '-' + month + '-' + date;
      this.initStart = year + '-01-01';
      this.initEnd = year + '-' + month + '-' + date;
      //获取申请列表
      this.getTalents(
        this.returnSearchField()
      );
    },
    watch:{
      "$store.state.instcode": {
        handler: function() {
          if (this.$store.state.instnation) {
            //暂时不限制区域，直接打开所有的
            let t = this.$store.state.instnation;
            if (t != "all" && t != "全国") {
              let tArr = t.split(",");
              //获取所有下级成员
              xz.groupMember().then( member => {
                let promiseList = [];
                if(Array.isArray(member)){
                  member.forEach( p => {
                    //获取下级成员列表和权限
                    let getPurviews = xz.getMemberPurview(p.id);
                    promiseList.push(getPurviews);
                  })
                  Promise.all(promiseList).then( res => {
                    //获取到的下级列表和权限
                    if(Array.isArray(res)){
                      res.forEach( r => {
                        if(r[0].strnations){
                          let p  = r[0].strnations.split(",");
                          tArr = [...tArr, ...p];
                        }
                      })
                      //去重
                      let newSet = new Set(tArr);
                      let nationList = [...newSet];
                      let arr = [{
                        name: "全部",
                        code: ""
                      }];
                      //转换地名
                      nationList.forEach(t => {
                        let obj = this.$store.getters.codeToggleObj(t);
                        let localName = this.$store.getters.localName(obj);
                        let nameArr = localName.split("-");
                        let tName = nameArr[nameArr.length - 1];
                        arr.push({
                          name: tName,
                          code: t
                        });
                      });
                      this.currentNation = arr;
                    }
                  })
                }
              })
            }
          }
        },
        immediate: true
      },
    },
    computed: {
      jobFunDetail() {
        return this.$store.state.TALENTS.jobDetail;
      }
    },
    methods: {
      //切换城市获取
      searchCurrentAgency(e){
        this.currnum = 1;
        this.$set(this.searchInfo, "nation", e);
        this.getTalents(
          this.returnSearchField(1)
        );
      },
      //切换申请类型
      applyTypeChange(e){
        let keyword =  e == "直通车" ? "直通车" : "";
        this.currnum = 1; //
        this.$set(this.searchInfo, "keyword", keyword);
        this.getTalents(
          this.returnSearchField(1)
        );
      },
      handleClick(data) { //切换
        if (data.name == this.activeName) return;
        this.activeName = data.name;
      },
      //分页
      searchApply(data) {
        this.currnum = data;
        this.getTalents(
          this.returnSearchField(data)
        );
      },
      //返回出当前的筛选条件
      returnSearchField(page) {
        let msg = {
          "bdate": "2019-1-1",
          "edate": this.edate ? new Date(this.edate).getFullYear() + '-' + (new Date(this.edate).getMonth() + 1) +
            '-' + new Date(this.edate).getDate() : this.initEnd,
          "countnum": this.num,
          "currpage": page ? page : this.currnum,
          "username": this.searchInfo.username, //姓名
          "school": this.searchInfo.school, //学习
          "jobinf": this.searchInfo.jobinf, //职位
          "company": this.searchInfo.company, //公司
          "usertel": this.searchInfo.usertel, //手机
          "status": this.searchInfo.status, //简历状态
          "constatus": this.searchInfo.constatus, //联系记录
          "keyword": this.searchInfo.keyword, //关键字查询
          "nation": this.searchInfo.nation, //地域
          "strstatus": '1'
        }
        return msg;
      },
      //获取申请列表
      getTalents(data) {
        this.shadowShow = true; //显示遮罩层
        xz.deliveryTalents(data).then( res => {
          if (res) {
            const list = res.myOrderList;
            const num = res.totalCount;
            list.forEach( l => {
              l.applyTime = this.$store.getters.formatDate(l.changDate);
            })
            if(Array.isArray(list)){
              let nationList = [];
              let infoList = [];
              list.forEach( t => {
                //获取职位负责地区
                nationList.push(xz.codeToInfor(t.nation));
                //获取职位详情
                infoList.push(xz.userInfo(t.userid_p));
              })
              Promise.all(nationList).then( n => {
                n.forEach( (nation, index) => {
                  let nationName = "未填写";
                  if(nation){
                    nationName = (nation.Province ? nation.Province : "") + (nation.City ? nation.City : "") + (nation.Area ? nation.Area : "");
                  }
                  this.$set(this.talents[index], "nationName", nationName);
                })
              })
              Promise.all(infoList).then( info => {
                info.forEach( (i, index) => {
                  if(i){
                    let cv = i.cvinfo;
                    if(cv.psnPersonInfo){
                      let birth = cv.psnPersonInfo.psnBirth;
                      if(birth){
                        let age = new Date().getFullYear() - new Date(birth).getFullYear();
                        this.$set(this.talents[index], "age", age)
                      }else{
                        this.$set(this.talents[index], "age", "未填写");
                      }
                    }else{
                      this.$set(this.talents[index], "age", "未填写");
                    }
                    this.$set(this.talents[index], "edu", i.cvinfo.psnBaseInfo.psnEduLvl);
                    this.$set(this.talents[index], "exp", i.cvinfo.psnBaseInfo.psnWorkExp);
                  }
                })
              })
              this.talents = list;
            }
            this.talentsNum = parseInt(num);
            this.shadowShow = false;
          } else {
            console.log("获取申请管理/申请历史的人才出错");
          }
        })
      },
      //职位详情关闭的回调，清数据
      triggerClose() {
        //清空jobinfo数据
        this.$store.commit("initJobinfo");
        //清空企业基本信息数据
        this.$store.commit("initBriefInfo");
      },
      //点击查看职位信息
      funShowJobDetail(e) {
        this.showJobDetail = !this.showJobDetail;
        this.jobId = e.jobid;
        this.sententid = e.entId;
      },
     
      //获取简历
      checkResume(item){
        if(!item.orderid) item.orderid = item.userid_p;
        this.talentInfo = item;
        let resume = this.$refs.totalResume.$el;
        resume.classList.remove("stretchNone");
      },
      //关闭右侧简历
      closeResume(){
        this.talentInfo = "";
        let resume = this.$refs.totalResume.$el;
        resume.classList.value.indexOf("stretchNone") > -1 ? resume.classList.remove("stretchNone") : resume.classList.add("stretchNone");
      },
      // 通过申请
      funSend(e) {
        this.shadowShow = true; //显示遮罩层
        let {
          pubid,
          CVID
        } = e;
        if(this.talentsNum > 10 && this.talentsNum % 10 == 1){
          this.currnum = this.currnum - 1;
          console.log(this.currnum);
        }
        xz.approveTalentDelivery(pubid, CVID, this.rateMsg.content).then(res => {
          //talentsNum
          if(res){
            this.getTalents(
              this.returnSearchField()
            )
          }else{
            this.shadowShow = false;
            alert("系统出错，请稍后再试");
            console.log("通过审核出错"); 
          }
        })
      },
      /**
       * 拒绝某人
       */
      beforeClose(e) {
        this.closeDialogVisible = true;
        this.closeMsg.orderid = e.orderid;
        this.closeMsg.content = "";

        this.singleItem = e;
      },
      funClose() { //拒绝接口
        this.closeDialogVisible = false;
        this.shadowShow = true; //显示遮罩层
        let {
          CVID
        } = this.singleItem
        //
        if(this.talentsNum.length > 10 && this.talentsNum % 10 == 1){
          this.currnum = this.currnum - 1;
        }
        xz.refuseTalentDelivery(CVID, this.closeMsg.content).then(res => {
          res ? this.getTalents(
            this.returnSearchField()
          ) : console.log("拒绝审核出错");
        })
      },
    }
  };
</script>
<style scoped>
  .el-dialog {
    border-radius: 6px;
  }

  .btn-def {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
    background-color: #fff;
  }

  .btn-def:hover {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
    background-color: #fff;
  }

  .btn-sub {
    border: 1px solid #32c5d2;
    border-radius: 4px;
    color: #32c5d2;
    background-color: #fff;
  }

  .btn-sub:hover {
    border-color: #32c5d2;
    color: #fff;
    background-color: #32c5d2;
  }


  .el-button a {
    color: #606266;
  }

  .search-item {
    position: relative;
  }

  .search-item .closeBtn {
    position: absolute;
    right: 20px;
    top: 14px;
    font-size: 24px;
    cursor: pointer;
  }

  .search-item .closeBtn:hover {
    color: #409eff;
  }

  .search-item .el-form-item {
    display: inline-block;
    width: 30%;
    margin: 10px;
  }

  .search-item .search-input {
    width: 75%;
  }
  .filterApply{
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .selecteArea{
    margin-left: 25px;
  }
</style>