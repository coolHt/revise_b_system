<template>
  <div class="workPoolItem staffContainer">
    <div>
      <el-tabs>
        <el-tab-pane label="人才管理"></el-tab-pane>
      </el-tabs>
      <div class="searchCon">
        <div style="display:flex;">
          <input type="text" class="blurSearch" placeholder="请输入姓名查询" v-model="username"
          v-on:keyup.enter="changePage(1)">
          <el-radio-group v-model="labelType" style="margin-left: 15px;" @change="selectType">
            <el-radio-button :label="o.label" v-for="(o, index) in labelOption" v-bind:key="index"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="rightSearch">
          <a class="btn-open-search" @click="openSearch = !openSearch">更多搜索</a>
        </div>
        <div v-show="openSearch">
          <div class="search-item searchContainer">
            <div class="singleSearch">
              <span class="searchField">关键字：</span>
              <input type="text" class="searchInput" v-model="keyword" placeholder="请输入简历内部关键词">
            </div>
            <div class="singleSearch">
              <span class="searchField">手机：</span>
              <input type="text" class="searchInput" v-model="usertel">
            </div>
            
            <div class="singleSearch">
              <span class="searchField">职位：</span>
              <input type="text" class="searchInput" v-model="jobinf">
            </div>
            <div class="singleSearch">
              <span class="searchField">年龄：</span>
              <input type="text" class="searchInput" v-model="ageb" style="width:80px">
              <span> - </span>
              <input type="text" class="searchInput" v-model="agee" style="width:80px">
            </div>
            <div class="singleSearch">
              <span class="searchField">所在区域：</span>
              <MRegion :search="true" :fullrange="true" @cRegion="returnCurrentAdd" :selected="selected"
                class="regionSearch"></MRegion>
            </div>
            <div class="singleSearch">
              <span class="searchField">期望区域：</span>
              <input type="text" class="searchInput" v-model="stradd">
            </div>
            
            <div class="singleSearch" style="width:auto;">
              <span class="searchField">入库时间：</span>
              <el-date-picker v-model="rangeTime" type="daterange" :picker-options="pickerOptions" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
            </div>
            <div class="btnContainer">
              <button @click="funClearSearch" class="clearButton" style="margin-left:20px;">清空</button>
              <button class="searchButton" @click="changePage(1)">搜索</button>
            </div>
          </div>
        </div>
      </div>
      <p class="listCount" style="position:relative;">共有 <span
              style="color:#e7505a;font-weight:bold;">{{allTalentsNum}}</span> 个</p>
      <div class="companyList">
        <transition name="loadShadow">
          <div class="loadShadow" v-show="loadTalents">
            <i class="loadgif"></i>
          </div>
        </transition>
        <div class="companyHeadLine">
          <ul class="companyItem">
            <li style="width:10%">姓名</li>
            <li style="width:17%">手机号</li>
            <li style="width:7%">性别</li>
            <li style="width:15%;text-align:center">最高学历</li>
            <li style="width:10%;text-align:center;">工作年限</li>
            <li style="width:15%;text-align:center;">所在地</li>
            <li style="width:10%;text-align:center;">入库时间</li>
            <li style="width:15%;text-align:center;">来源信息</li>
          </ul>
        </div>
        <div v-if="allTalents.length > 0">
          <ul class="companyItem" v-for="(item,index) in allTalents" :key="index">
            <li style="width:10%;" class="editCompanyInfor">
              <a class="user-name" style="font-weight:bold;" @click="checkResume(item, index)">{{item.psnName}}</a>
            </li>
            <li style="width:17%;" class="editCompanyInfor" @click="getCellNumber(item.orderid)">
              <el-popover
                placement="top"
                width="200"
                trigger="click">
                <div style="font-size: 16px;font-weight:bold;">{{cellPhone}}</div>
                <el-button slot="reference">查看号码</el-button>
              </el-popover>
            </li>
            <li style="width:7%">{{item.psnBaseInfo ? item.psnBaseInfo.psnSex : '未填写'}}</li>
            <li style="width:15%;text-align:center;">{{item.psnBaseInfo ? (item.psnBaseInfo.psnEduLvl ? item.psnBaseInfo.psnEduLvl : '未填写') : '未填写'}}</li>
            <li style="width:10%;text-align:center;">{{item.psnBaseInfo ? (item.psnBaseInfo.psnWorkExp ? item.psnBaseInfo.psnWorkExp : '未填写') : '未填写'}}</li>
            <li style="width:15%;text-align:center;">{{item.currentLocation}}</li>
            <li style="width:10%;text-align:center;">{{new Date(item.insertDate.split(' ')[0]).getFullYear() + '-' + (new Date(item.insertDate.split(' ')[0]).getMonth() + 1) + '-' + new Date(item.insertDate.split(' ')[0]).getDate()}}</li>
            <li style="width:15%;text-align:center;">{{item.source}}</li>
          </ul>
        </div>
        <div v-if="allTalentsNum > 0">
          <el-pagination :current-page="currpage" :page-size="countnum" :pager-count="5" layout="prev, pager, next" :total="allTalentsNum"
            @current-change="changePage" @prev-click="changePage" @next-click="changePage"></el-pagination>
        </div>
      </div>
    </div>
    <!--总简历-->
    <TotalResume ref="totalResume" @closeResume="closeResume" class="stretchNone" :resume="talentInfo"></TotalResume>
  </div>
</template>
<script>
  import TotalResume from "../components/resume/totalResume";
  import xz from "../common";
  export default {
    components: {
      TotalResume
    },
    data: function () {
      return {
        rangeTime: [new Date(2019, 0, 1), new Date(2019, 10, 11)],
        //遮罩层显示隐藏
        username: '',
        jobinf: '',
        usertel: '',
        strnation: '',
        stradd: '',
        ageb: '',
        agee: '',
        keyword: '',
        //
        selected: '',
        openSearch: false, //是否打开搜索
        showResume: false, //是否显示简历
        labelOption:[{
            label: "全部",
          },{
            label: "军队",
          },{
            label: "国外",
          },{
            label: "创业",
          }],
        //是否是退伍军人
        labelType: "全部",
        ////
        headPic: "../assets/images/man.png",
        countnum: 10,
        currpage: 1,
        //时间选择快捷
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        //号码
        cellPhone: '',
        //当前查看的简历的index
        rIndex: 0,
        rCurrentPage: 0,
        rResume: [],
        //
        talentInfo: null,
        allTalentsNum: 0,
        allTalents: [],
        loadTalents: false, //遮罩层
      };
    },
    created() {
      //获取人才库
      this.rangeTime[1] = new Date(); //设置默认结束当前时间
      this.getTalents(this.searchPost());
    },
    watch: {
      '$store.state.TALENTS.lookForResume': {
        handler: function () {
          this.rResume = this.$store.state.TALENTS.lookForResume;
          if (this.rResume.length > this.rIndex) {
            this.talentInfo = this.rResume[this.rIndex];
          }
        }
      }
    },
    methods: {
      //关闭右侧简历
      closeResume(){
        this.talentInfo = "";
        let resume = this.$refs.totalResume.$el;
        resume.classList.value.indexOf("stretchNone") > -1 ? resume.classList.remove("stretchNone") : resume.classList.add("stretchNone");
      },
      //返回当前所在区域code
      returnCurrentAdd(region) {
        if (region.area) {
          this.strnation = region.area.code;
          this.selected = this.strnation;
          return;
        }
        if (region.city) {
          this.strnation = region.city.code;
          this.selected = this.strnation;
          return;
        }
        if (region.province) {
          this.strnation = region.province.code;
          this.selected = this.strnation;
          return;
        }
      },
      //翻页
      changePage(data = 1) {
        this.currpage = data;
        this.getTalents(
          this.searchPost(data, true)
        );
      },
      //选择选项
      selectType(){
        this.changePage();
      },
      //点击查看简历
      checkResume(item, index) {
        //当前简历索引
        this.rIndex = index;
        //当前页码
        this.rCurrentPage = this.currpage;
        this.talentInfo = item;
        let resume = this.$refs.totalResume.$el;
        resume.classList.remove("stretchNone");
      },
      //点击号码
      checkNum(item) {
        this.talentInfo = item;
      },
      searchPost(page, flip) { //param: 当前页码, 获取用来浏览的简历列表
        //labelType
        let t = "";
        if(this.labelType == "全部"){
          t = "";
        }else if(this.labelType == "军队"){
          t = "army"
        }else if(this.labelType == "国外"){
          t = "abroad";
        }else if(this.labelType == "创业"){
          t = "employment";
        }else{
          t ="";
        }
        let jsonList = {
          bdate: this.$store.getters.formatDate(this.rangeTime[0]).replace(/\./g, '-'),
          edate: this.$store.getters.formatDate(this.rangeTime[1]).replace(/\./g, '-'),
          username: this.username,
          school: "",
          jobinf: this.jobinf,
          usertel: this.usertel,
          strnation: this.strnation,
          stradd: this.stradd,
          company: '', //为空
          status: '', //为空
          constatus: '', //为空
          keyword: this.keyword,
          countnum: this.countnum,
          currpage: page ? page : 1,
          singleResume: flip,
          ifarmy: t
        };
        this.ageb ? jsonList.ageb = this.ageb : jsonList.ageb = "0";
        this.agee ? jsonList.agee = this.agee : jsonList.agee = "100";
        return jsonList;
      },
      //清空搜索条件
      funClearSearch: function () {
        this.selected = '';
        this.username = '';
        this.school = '';
        this.jobinf = '';
        this.usertel = '';
        this.strnation = '';
        this.stradd = '';
        this.ageb = '';
        this.agee = '';
        this.keyword = '';
        this.labelType = "全部"
        this.rangeTime = [new Date(2019, 0, 1), new Date()];
      },
      //获取人才
      getTalents(search){
        this.loadTalents = true;
        xz.getAllTalents(search).then( res => {
          if(res){
            this.allTalentsNum = parseInt(res.totalCount);
            this.allTalents = res.orderList;
            this.allTalents.forEach( (t, index) => {
              xz.userInfo(t.orderid).then(res => {
                if(res){
                  let r = null;
                  res.cvinfo.status ? r = res.innerinfo : r = res.cvinfo;
                  if(r.psnBaseInfo.psnNation) {
                    const areaObj = this.$store.getters.codeToggleObj(r.psnBaseInfo.psnNation);
                    let areaName = this.$store.getters.localName(areaObj);
                    this.$set(this.allTalents[index], "currentLocation", areaName); 
                  }else{
                    this.$set(this.allTalents[index], "currentLocation", '未填写'); 
                  }
                  this.$set(this.allTalents[index], "psnBaseInfo", r.psnBaseInfo);
                }else{
                  console.log("获取个人简历信息失败");
                }
              })
            })
          }else{
            console.log("获取人才出错");
          }
          this.loadTalents = false;
        });
      },
      //获取用户手机号
      getCellNumber(id){
        xz.getCellNumber(id).then( res => {
          if(res){
            this.cellPhone = res[0].usertel;
          }else{
            this.cellPhone = "获取号码失败";
          }
        })
      }
      
    }
  };
</script>
<style scoped>
  .search-item .el-form-item {
    display: inline-block;
    width: 30%;
    margin: 10px;
  }

  .search-item .search-input {
    width: 75%;
  }
  .btn-open-search {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
    background-color: #fff;
    padding: 10px 15px;
    display: inline-block;
  }
  .rightSearch {
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
<style>
.staffContainer .xz_con{
  width: 220px !important;
}
.staffContainer .delete_value{
  top: 11px !important;
}
</style>