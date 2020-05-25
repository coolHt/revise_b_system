<template>
  <div class="workPoolItem">
    <div class="progressJobProfile">
      <p class="job-name">{{jobname}}</p>
    </div>
    <div class="memberList">
      <transition name="loadShadow">
        <div class="loadShadow" v-show="loadList">
          <i class="loadgif"></i>
        </div>
      </transition>
      <div class="memberList_partition">
        <div class="memberList_title">
          <span>已报名&nbsp;</span>
          <span>{{"(" + enrolmentNumber + ") 人"}}</span>
        </div>
        <div class="progressMember" v-if="enrolmentMember.length > 0">
          <ul class="progressMember_title">
            <li style="width: 10%">姓名</li>
            <li style="width: 10%">性别</li>
            <li style="width: 15%">最高学历</li>
            <li style="width: 15%">工作年限</li>
            <li style="width: 20%">所在地</li>
            <li style="width: 15%">申请时间</li>
            <li style="width: 15%">面试操作</li>
          </ul>
          <ul class="progressMember_list" v-for="(item, index) in enrolmentMember" :key="index">
            <li style="width: 10%">
              <router-link target="_blank" :to="{name:'resume', query:{cvid:item.CVID,userid:item.userid,jobname:jobname}}">
                <span>{{item.cv ? item.cv.psnBaseInfo.psnName : ""}}</span>
              </router-link>
            </li>
            <li style="width: 10%">{{item.cv ? item.cv.psnBaseInfo.psnSex : ""}}</li>
            <li style="width: 15%">{{item.cv ? item.cv.psnBaseInfo.psnEduLvl : ""}}</li>
            <li style="width: 15%">{{item.cv ? item.cv.psnBaseInfo.psnWorkExp : ""}}</li>
            <li style="width: 20%">{{item.psnNation}}</li>
            <li style="width: 15%">{{item.timeDate}}</li>
            <li style="width: 15%">
              <button type="button" class="progressBtn" @click="manipulateInterview(item, 1)">允许面试</button>
              <button type="button" class="progressBtn refuseBtn" @click="manipulateInterview(item, 2)">拒绝面试</button>
            </li>
          </ul>     
        </div>
      </div>
      <div class="memberList_partition">
        <div class="memberList_title">
          <span>待面试&nbsp;</span>
          <span>{{"(" + accessNumber + ") 人"}}</span>            
        </div>
        <div class="progressMember" v-if="accessMember.length > 0">
            <ul class="progressMember_title">
              <li style="width: 10%">姓名</li>
              <li style="width: 10%">性别</li>
              <li style="width: 15%">最高学历</li>
              <li style="width: 15%">工作年限</li>
              <li style="width: 20%">所在地</li>
              <li style="width: 15%">申请时间</li>
              <li style="width: 15%">面试操作</li>
            </ul>
            <ul class="progressMember_list" v-for="(item, index) in accessMember" :key="index">
              <li style="width: 10%">
                <router-link target="_blank" :to="{name:'resume', query:{cvid:item.CVID,userid:item.userid,jobname:jobname}}">
                  <span>{{item.cv ? item.cv.psnBaseInfo.psnName : ""}}</span>
              </router-link>
              </li>
              <li style="width: 10%">{{item.cv ? item.cv.psnBaseInfo.psnSex : ""}}</li>
              <li style="width: 15%">{{item.cv ? item.cv.psnBaseInfo.psnEduLvl : ""}}</li>
              <li style="width: 15%">{{item.cv ? item.cv.psnBaseInfo.psnWorkExp : ""}}</li>
              <li style="width: 20%">{{item.psnNation}}</li>
              <li style="width: 15%">{{item.timeDate}}</li>
              <li style="width: 15%">  
                <button type="button" class="progressBtn" @click="manipulateInterview(item, 3)">面试通过</button>
                <button type="button" class="progressBtn refuseBtn" @click="manipulateInterview(item, 4)">面试失败</button>
              </li>
            </ul>
          </div>
      </div>
      <div class="memberList_partition">
        <div class="memberList_title">
          <span>已淘汰&nbsp;</span>
          <span>{{"("+rejectNumber+") 人"}}</span>
        </div>
        <div class="progressMember" v-if="rejectMember.length > 0">
          <ul class="progressMember_title">
            <li style="width: 10%">姓名</li>
              <li style="width: 10%">性别</li>
              <li style="width: 15%">最高学历</li>
              <li style="width: 15%">工作年限</li>
              <li style="width: 20%">所在地</li>
              <li style="width: 15%">申请时间</li>
              <li style="width: 15%">面试操作</li>
          </ul>
          <ul class="progressMember_list" v-for="(item, index) in rejectMember" :key="index">
            <li style="width: 10%">
              <router-link target="_blank" :to="{name:'resume', query:{cvid:item.CVID,userid:item.userid,jobname:jobname}}">
                <span>{{item.cv ? item.cv.psnBaseInfo.psnName : ""}}</span>
              </router-link>
            </li>
            <li style="width: 10%">{{item.cv ? item.cv.psnBaseInfo.psnSex : ""}}</li>
            <li style="width: 15%">{{item.cv ? item.cv.psnBaseInfo.psnEduLvl : ""}}</li>
            <li style="width: 15%">{{item.cv ? item.cv.psnBaseInfo.psnWorkExp : ""}}</li>
            <li style="width: 20%">{{item.psnNation}}</li>
            <li style="width: 15%">{{item.timeDate}}</li>
            <li style="width: 15%">已拒绝</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import xz from "../common";
  export default {
    data: function () {
      return {
        totalnum: 0,
        countnum: 10,
        currpage: 1,
        psnList: [],
        jobid: "",
        entid: "",
        jobname: "",
        mdate: "",
        mtime: "",
        activeKey: "已报名",
        strstatus: "",
        //已报名人员
        enrolmentMember: [],
        enrolmentNumber: 0,
        //已通过人员
        accessMember: [],
        accessNumber: 0,
        //已拒绝人员
        rejectMember: [],
        rejectNumber: 0,
        //加载效果
        loadList: true
      };
    },
    created() {
      document.title = this.$route.query.jobname ? this.$route.query.jobname : "职位面试";
      this.jobid = this.$route.query.jobid;
      this.jobname = this.$route.query.jobname;
      this.mdate = this.$route.query.mdate;
      this.mtime = this.$route.query.mtime;
      this.entid = this.$route.query.entId;
      this.psnList = [{
        cvinf: {
          psnBaseInfo: {
            psnName: "加载中..."
          }
        }
      }];
      //获取职位信息
      xz.getJobInformation(this.jobid).then(res => {
        console.log(res);
      })
      //获取已报名职位
      this.getEnrolmentMember("enrolment");
      //已通过
      this.getEnrolmentMember("access");
      //已淘汰
      this.getEnrolmentMember("reject");
    },
    methods: {
      //处理列表
      manipulateList(list){
        list.forEach( (p, index) => {
          console.log(p);
          let cv = JSON.parse(p.cvinf);
          list[index].cv = cv;
          let place = "";
          if(cv.psnBaseInfo.psnNation){
            let obj = this.$store.getters.codeToggleObj(cv.psnBaseInfo.psnNation);
            place = this.$store.getters.localName(obj);
          }
          if(p.time) list[index].timeDate = this.$store.getters.formatDate(p.time);
          list[index].psnNation = place;
        })
        return list;
      },

      //获取职位报名人列表(已报名/已通过/已拒绝)
      getEnrolmentMember(type, countnum, currpage) {
        let strstatus = "";
        if (type == "enrolment") strstatus = "0";
        if (type == "access") strstatus = "1";
        if (type == "reject") strstatus = "2";
        xz.jobProgressEnrolment(this.jobid, strstatus, countnum, currpage).then(res => {
          console.log(res);
          if (res) {
            if (type == "enrolment") {
              //处理列表并赋值
              this.enrolmentMember = this.manipulateList(res.psnList);
              this.enrolmentNumber = parseInt(res.totalnum);
            }
            if (type == "access") {
              //处理列表并赋值
              this.accessMember = this.manipulateList(res.psnList);
              this.accessNumber = parseInt(res.totalnum);
            }
            if (type == "reject") {
              //处理列表并赋值
              this.rejectMember = this.manipulateList(res.psnList);
              this.rejectNumber = parseInt(res.totalnum);
            }
          } else {
            if (type == "enrolment") {
              //处理列表并赋值
              this.enrolmentMember = [];
              this.enrolmentNumber = 0;
            }
            if (type == "access") {
              //处理列表并赋值
              this.accessMember = [];
              this.accessNumber = 0;
            }
            if (type == "reject") {
              //处理列表并赋值
              this.rejectMember = [];
              this.rejectNumber = 0;
            }
            console.log("获取获取b角内部职位的投递情况失败");
          }
          this.loadList = false;
        })
      },
      //操作面试允许/拒绝
      manipulateInterview(i, type){
        this.loadList = true;
        xz.manipulateInterview(i.CVID, i.pubid, type).then( res => {
          if(res){
            this.getEnrolmentMember("reject");//已淘汰
            this.getEnrolmentMember("access");//已通过
            this.getEnrolmentMember("enrolment");//获取已报名职位
          }else{
            this.loadList = false;
            console.log("操作面试允许/拒绝失败");
          }
        });
      },
    }
  };
</script>
<style scoped>
.progressJobProfile{
  width: 100%;
}
.workPoolItem{
  width: 100%;
  height: 400px;
}
.memberList_title{
  width: 100%;
  padding: 15px 10px;
  box-sizing: border-box;
  background: #f2f2f2;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.memberList_title span{
  font-size: 15px;
  color: #333;
  font-weight: bold;
}
.progressJobProfile{
  width: 100%;
  box-sizing: border-box;
  padding: 15px 0;
}
.job-name{
  font-size: 15px;
  color: #333;
  font-weight: bold;
}
.progressMember_title, .progressMember_list{
  width: 100%;
  display: flex;
  box-sizing: border-box;
}
.progressMember_title li{
  padding: 8px 0;
  box-sizing: border-box;
  font-weight: bold;
  color: #333;
}
.progressMember_list li{
  padding: 5px 0;
  box-sizing: border-box;
  color: #333;
}
.progressBtn{
  border:none;
  background: #409eff;
  padding:8px 12px;
  color: #fff;
  border-radius: 3px;
  outline: none;
  margin-right: 5px;
}
.refuseBtn{
  background: #c82a2e;
}
</style>