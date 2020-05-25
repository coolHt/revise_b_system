<template>
  <div class="workPoolItem">
    
    <div>
      <div class="partitionTitle">
        <el-tabs>
          <el-tab-pane label="人才库"></el-tab-pane>
        </el-tabs>
        <button @click="openSearch = !openSearch" class="addNewBtn">打开搜索</button>
      </div>
      <div v-show="openSearch">
        <div class="search-item">
          <div class="search-item searchContainer">
            <div class="singleSearch">
              <span class="searchField">姓名：</span>
              <input type="text" class="searchInput" v-model="searchInfo.username" placeholder="请输入简历内部关键词" />
            </div>
            <div class="singleSearch">
              <span class="searchField">手机：</span>
              <input type="text" class="searchInput" v-model="searchInfo.usertel">
            </div>
            <div class="singleSearch">
              <span class="searchField">学校：</span>
              <input type="text" class="searchInput" v-model="searchInfo.school">
            </div>
            <div class="singleSearch">
              <span class="searchField">职位：</span>
              <input type="text" class="searchInput" v-model="searchInfo.jobinf">
            </div>
            <div class="singleSearch">
              <span class="searchField">公司：</span>
              <input type="text" class="searchInput" v-model="searchInfo.company">
            </div>
            <div class="singleSearch">
              <span class="searchField">关键词：</span>
              <input type="text" class="searchInput" v-model="searchInfo.keyword">
            </div>
            <div class="singleSearch">
              <span class="searchField">开始时间：</span>
              <el-date-picker v-model="bdate" align="right" type="date" placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
            <div class="singleSearch">
              <span class="searchField">结束时间：</span>
              <el-date-picker @change="getEdate" v-model="edate" align="right" type="date" placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
            <div class="singleSearch">
              <span class="searchField">简历状态：</span>
              <el-radio-group v-model="searchInfo.status" size="small">
                <el-radio-button label="1">已激活</el-radio-button>
                <el-radio-button label="0">待激活</el-radio-button>
              </el-radio-group>
            </div>
            <div class="singleSearch">
              <span class="searchField">联系记录：</span>
              <el-radio-group v-model="searchInfo.constatus" size="small">
                <el-radio-button label="沟通中"></el-radio-button>
                <el-radio-button label="已拒绝"></el-radio-button>
                <el-radio-button label="无法联系"></el-radio-button>
              </el-radio-group>
            </div>

             <div class="btnContainer">
              <button @click="funClearSearch" class="clearButton" style="margin-left:20px;">清空</button>
              <button class="searchButton" @click="funSearch">搜索</button>
            </div>
          </div>
        </div>
    </div>
      <!--列表-->
      <div class="companyList">
        <div class="companyHeadLine">
          <ul class="companyItem">
            <li style="width:16%">姓名</li>
            <li style="width:7%">性别</li>
            <li style="width:15%;text-align:center">最高学历</li>
            <li style="width:15%;text-align:center;">工作年限</li>
            <li style="width:22%;text-align:center;">所在地</li>
            <li style="width:10%;text-align:center;">入库时间</li>
            <li style="width:15%">来源信息</li>
          </ul>
        </div>
        <div v-if="talents">
          <ul class="companyItem" v-for="(item,index) in talents" :key="index">
            <li style="width:16%;" class="editCompanyInfor">
               <a class="user-name" @click="checkResume(item)">{{item.psnName}}</a>
            </li>
            <li style="width:7%">{{item.psnBaseInfo ? item.psnBaseInfo.psnSex : '未填写'}}</li>
            <li style="width:15%;text-align:center;">{{item.psnBaseInfo ? (item.psnBaseInfo.psnEduLvl? item.psnBaseInfo.psnEduLvl : '未填写') : '未填写'}}
            </li>
            <li style="width:15%;text-align:center;">{{item.psnBaseInfo ? (item.psnBaseInfo.psnWorkExp ? item.psnBaseInfo.psnWorkExp : '未填写') : '未填写'}}
            </li>
            <li style="width:22%;text-align:center;">{{item.currentLocation}}</li>
            <li style="width:10%;text-align:center;" @click="checkoutStaff(item)">
              {{new Date(item.insertDate.split(' ')[0]).getFullYear() + '-' + (new Date(item.insertDate.split(' ')[0]).getMonth() + 1) + '-' + new Date(item.insertDate.split(' ')[0]).getDate()}}
            </li>
            <li style="width:15%">{{item.source}}</li>
          </ul>
        </div>
      </div>
      <div v-if="allTalentsNum > 0">
        <el-pagination :page-size="countnum" :pager-count="5" layout="prev, pager, next" :total="allTalentsNum"
            @current-change="changePage" @prev-click="changePage" @next-click="changePage"></el-pagination>
      </div>
    </div>
    <!--个人简历详情dialog-->
    <!-- <el-dialog :visible.sync="showResume" class="personalResume" width="700px">
      <UserResume :talentInfo="talentInfo" type="pool"></UserResume>
    </el-dialog> -->
    <!--总简历-->
    <TotalResume ref="totalResume" @closeResume="closeResume" class="stretchNone" :resume="talentInfo"></TotalResume>
  </div>
</template>
<script>
  import xz from '../common';
  import TotalResume from "../components/resume/totalResume";
  export default {
    components: {
      TotalResume
    },
    data: function () {
      return {
        loadTalents: false,
        bornLocation: '',
        searchInfo: {
          username: '',
          usertel: '',
          school: '',
          jobinf: '',
          company: '',
          status: '',
          keyword: '',
          constatus: '',
        },
        openSearch: false, //是否打开搜索
        showResume: false, //是否显示简历
        singleInfo: "", //点击的人才的字段
        ////
        headPic: "../assets/images/man.png",
        num: 1,
        countnum: 10,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        bdate: '',
        edate: '',
        initStart: '',
        initEnd: '',
        //当前查看的简历的index
        rIndex: 0,
        rCurrentPage: 0,
        rResume: [],
        //
        talentInfo: null,
        talents:[],
        allTalentsNum: 0
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
      //获取人才
      this.getTalents(this.searchField());
    },
    computed: {
      //权限
      purviews(){
        return this.$store.state.purview;
      },
      allTalents() { //人才库
        let talents = this.$store.state.TALENTS.allTalents;
        return talents;
      },
    },
    methods: {
      //关闭右侧简历
      closeResume(){
        let resume = this.$refs.totalResume.$el;
        resume.classList.value.indexOf("stretchNone") > -1 ? resume.classList.remove("stretchNone") : resume.classList.add("stretchNone");
      },
      //获取人才
      getTalents(data){
        xz.getAllTalents(data).then( res => {
        this.talents = res.orderList;
        this.talents.forEach( (l, index) => {
          xz.userInfo(l.orderid).then(res => {
            if(res){
              let r = null;
              res.cvinfo.status ? r = res.innerinfo : r = res.cvinfo;
              if(r.psnBaseInfo.psnNation) {
                const areaObj = this.$store.getters.codeToggleObj(r.psnBaseInfo.psnNation);
                let areaName = this.$store.getters.localName(areaObj);
                this.$set(this.talents[index], "currentLocation", areaName); 

              }else{
                this.$set(this.talents[index], "currentLocation", '未填写'); 
              }
              this.$set(this.talents[index], "psnBaseInfo", r.psnBaseInfo);
            }else{
              console.log("获取个人简历信息失败");
            }
          })
        })
        this.allTalentsNum = parseInt(res.totalCount);
      })
      },
      getEdate(data) { //判断后一个日期是否比前一个大
        if (this.bdate) {
          if (Date.parse(data) < Date.parse(this.bdate)) {
            alert('结束日期不能小于开始日期');
            this.edate = '';
          }
        }
      },
      //翻页
      changePage(data) {
        this.getTalents(this.searchField(data));
      },
      //领取
      funAdd(e) {
        let data = {
          search: this.searchField(),
          orderid: e.orderid
        }
        this.$store.dispatch("claimTalent", data);
      },
      handleClose() { //显示简历
        this.showResume = false;
      },
      //点击查看简历
      checkResume(item) {
        this.talentInfo = item;
        let resume = this.$refs.totalResume.$el;
        resume.classList.remove("stretchNone");
      },
      funSearch: function () { //搜索人才
        this.getTalents(this.searchField(1));
      },
      //返回搜索的字段对象
      searchField(page) {
        let msg = {
          "countnum": this.countnum,
          "currpage": page ? page : this.num,
          "bdate": "2019-1-1",
          "edate": this.edate ? new Date(this.edate).getFullYear() + '-' + (new Date(this.edate).getMonth() + 1) +
            '-' + new Date(this.edate).getDate() : this.initEnd,
          "username": this.searchInfo.username, //姓名
          "school": this.searchInfo.school, //学习
          "jobinf": this.searchInfo.jobinf, //职位
          "company": this.searchInfo.company, //公司
          "usertel": this.searchInfo.usertel, //手机
          "status": this.searchInfo.status, //简历状态
          "constatus": this.searchInfo.constatus, //联系记录
          "keyword": this.searchInfo.keyword, //关键字查询
        };
        return msg;
      },
      //清空搜索条件
      funClearSearch: function () {
        this.searchInfo = {
          username: '',
          school: '',
          jobinf: '',
          company: '',
          usertel: '',
          status: 0,
          constatus: '',
          keyword: '',
        };
      },
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
    padding: 5px;
    margin: 5px;
  }
</style>