<template>
  <div class="organizationContainer">
    <div class="workPoolItem">
      <div style="position:relative;">
        <button class="addCompany" type="button" @click="openAddBroker" >新增经纪人</button>
        <el-tabs>
          <el-tab-pane label="组织机构"></el-tab-pane>
        </el-tabs>
        <!-- <div class="searchCon">
          <input type="text" class="blurSearch" placeholder="请输入组织/机构名称查询" v-model="keyword" v-on:keyup.enter="searchKeyWord">
          <p class="listCount">共有 <span style="color:#e7505a;font-weight:bold;">{{borkerTotal}}</span> 个</p>
        </div> -->
        <div class="companyList">
          <transition name="loadShadow">
            <div class="loadShadow" v-show="loadTalents">
              <i class="loadgif"></i>
            </div>
          </transition>
          <div class="companyHeadLine">
            <ul class="companyItem">
              <li style="width:20%">经纪人名称</li>
              <li style="width:20%;text-align:center;">经纪人号码</li>
              <li style="width:10%;text-align:center;">创建人</li>
              <li style="width:10%;text-align:center;">经纪人类型</li>
              <li style="width:10%">创建日期</li>
              <li style="width:30%">操作</li>
            </ul>
          </div>
          <div ref="companys">
            <div>
              <ul class="companyItem" v-for="(item, index) in brokerList" v-bind:key="index">
                <li style="width:20%;font-weight:bold;" class="companyTitleField">
                  <span>{{item.username}}</span>
                </li>
                <li style="width:20%;text-align:center;">
                  <span>{{item.usertel}}</span>
                </li>
                <li style="width:10%;text-align:center;">{{item.topname}}</li>
                <li style="width:10%;text-align:center;" :class="{'innerColor':item.usertype != 'O'}" >{{item.usertype == "O" ? "外部经纪人" : "内部经纪人"}}</li>
                <li style="width:10%">{{item.time}}</li>
                <li style="width:30%">
                  <button type="button" class="setButton" style="margin-right: 15px;" @click="setPromoCompany(item.userid)">+新增推广企业</button>
                  <button type="button" class="setButton" @click="setPromoJob(item.userid)" style="margin-right: 15px;">+新增推广职位</button>
                  <button type="button" class="checkButton" @click="getPromoCode(item.userid, index)">查看推广码</button>
                </li>
                <li class="checkAllCodes" v-show="item.open">
                  <div class="codeTypes">
                    <div class="codeTypesTitle" >
                      <ul class="codeTypeTitle">
                        <li style="width:10%;">企业推广码</li>
                        <li style="width:35%;">企业名称</li>
                        <li style="width:25%;">推广码备注</li>
                        <li style="width:15%;">创建时间</li>
                        <li style="width:15%;">操作</li>
                      </ul>
                    </div>
                    <div class="codeTypeItem" v-show="item.Elist && item.Elist.length > 0">
                      <ul class="codesLines" v-for="(s, i) in item.Elist" v-bind:key="i" >
                        <li class="code_single" style="width:10%;">
                          <el-popover
                            placement="top-start"
                            width="200"
                            trigger="click">
                            <div class="alertCodeContsainer">
                              <img :src="'https://www.azhiye.com/cloudimg/' + s.imgurl" alt="">
                              <p class="alertCodeTitle">{{s.detail.entName}}</p>
                              <div style="text-align:center;">
                                <a :href="'https://www.azhiye.com/cloudimg/' + s.imgurl" target="_blank" class="codeDownLoad">点击下载</a>
                              </div>
                            </div>
                            <img :src="'https://www.azhiye.com/cloudimg/' + s.imgurl" alt="" slot="reference" class="miniCodeImg">
                          </el-popover>
                        </li>
                        <li class="code_single" style="width:35%;">{{s.detail.entName}}</li>
                        <li class="code_single" style="width:25%;">{{s.otherinfo}}</li>
                        <li class="code_single" style="width:15%;">{{s.time}}</li>
                        <li class="code_single" style="width:15%;">
                          <el-popconfirm
                            @onConfirm="deletePromoCode"
                            confirmButtonText='确定'
                            cancelButtonText='取消'
                            title="确认是否删除推广码"
                            :hideIcon="true"
                          >
                            <span class="deleteCodeStyle" slot="reference" @click="getCodeLinkid(s.codeid, i, 'E', index)">删除</span>
                        </li>
                      </ul>
                    </div>
                    <p class="withOutCode" v-show="!item.Elist || item.Elist.length == 0">暂无推广码</p>
                  </div>
                  <div class="codeTypes">
                    <div class="codeTypesTitle">
                      <ul class="codeTypeTitle">
                        <li style="width:10%;">职位推广码</li>
                        <li style="width:15%;">职位名称</li>
                        <li style="width:20%;">企业名称</li>
                        <li style="width:25%;">推广码备注</li>
                        <li style="width:15%;">创建时间</li>
                        <li style="width:15%;">操作</li>
                      </ul>
                    </div>
                    
                    <div class="codeTypeItem" v-show="item.Jlist && item.Jlist.length > 0">
                      <ul class="codesLines" v-for="(s, i) in item.Jlist" v-bind:key="i" >
                        <li class="code_single" style="width: 10%">
                          <el-popover
                            placement="top-start"
                            width="200"
                            trigger="click">
                            <div class="alertCodeContsainer">
                              <img :src="'https://www.azhiye.com/cloudimg/' + s.imgurl" alt="">
                              <p class="alertCodeTitle">{{s.detail.entJobName}}</p>
                              <div style="text-align:center;">
                                <a :href="'https://www.azhiye.com/cloudimg/' + s.imgurl" target="_blank" class="codeDownLoad">下载</a>
                              </div>
                            </div>
                            <img :src="'https://www.azhiye.com/cloudimg/' + s.imgurl" alt="" slot="reference" class="miniCodeImg">
                          </el-popover>
                        </li>
                        <li class="code_single" style="width:15%;">{{s.detail.entJobName}}</li>
                        <li class="code_single" style="width:20%;">{{s.entName}}</li>
                        <li class="code_single" style="width:25%;">{{s.otherinfo}}</li>
                        <li class="code_single" style="width:15%;">{{s.time}}</li>
                        <li class="code_single" style="width:15%;">
                          <el-popconfirm
                            @onConfirm="deletePromoCode"
                            confirmButtonText='确定'
                            cancelButtonText='取消'
                            title="确认是否删除推广码"
                            :hideIcon="true"
                          >
                            <span class="deleteCodeStyle" slot="reference" @click="getCodeLinkid(s.codeid, i, 'J', index)">删除</span>
                        </li>
                      </ul>
                    </div>
                    <p class="withOutCode" v-show="!item.Jlist || item.Jlist.length == 0">暂无推广码</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <brokerForm @closeform="brokerChannel" v-if="brokerBlock" @refresh="refreshList"></brokerForm>
    <selectCompany :hasSelectJob="selectJob" :userid="selectUserid" @closeSelectCompany="closeCompany" v-if="selectCompanyBlock"></selectCompany>
    <!---->
    <brokerCodes v-if="promoCodes" @closePromo="closePromoCodes" :userid="selectUserid"></brokerCodes>
  </div>
</template>
<script>
  import xz from "../common";
  import brokerForm from "../components/form/brokerForm";
  import selectCompany from "../components/widgets/selectCompany";
  import brokerCodes from "../components/widgets/brokerCodes";
  export default {
    components:{
      selectCompany,
      brokerForm,
      brokerCodes
    },
    data() {
      return {
        brokerBlock: false, //开启或关闭新增表单
        selectCompanyBlock: false, //开启或关闭选择企业
        promoCodes: false, //开启或关闭推广码窗口
        selectJobBlock: false, //开启或关闭选择职位
        selectJob: false, //是否开启职位选择
        loadTalents: true, //遮罩层
        borkerTotal: 0, //机构总数
        keyword: "", //搜索词,
        pagenum: 1, //当前页码
        pagesize: 10, //每页数量,
        brokerList: [],
        //设置的userid
        selectUserid: "",
        deleteId: "",
        deleteIndex: "",
        pIndex: "",
        deleteType: ""
      }
    },
    mounted() {
      //获取当前账号下的经纪人
      this.getBrokers();
    },
    methods: {
      //获取当前账号下的经纪人
      getBrokers(){
        xz.getBrokers().then( list => {
          this.loadTalents = false;
          if(list && Array.isArray(list)){
            let filterList = [];
            list.forEach( l => {
              if(l.username){
                let d = l.insertdate;
                let formatTime = this.$store.getters.formatDate(d);
                l.time = formatTime;
                l.open = false;
                filterList.push(l);
              }
            })
            this.brokerList = filterList;
          }else{
            this.brokerList = [];
          }
        });
      },
      //刷新经纪人列表
      refreshList(){
        this.getBrokers();
      },
      //搜索
      searchKeyWord() {},
      //新增经纪人
      openAddBroker() {
        this.brokerBlock = true;
      },
      //关闭 / 获取数据
      brokerChannel(){
        this.brokerBlock = false;
      },
      //设置经纪人推广企业
      setPromoCompany(id){
        this.selectCompanyBlock = true;
        this.selectUserid = id;
      },
      //关闭选择
      closeCompany(){
        this.selectCompanyBlock = false;
        this.selectJob = false;
      },
      //设置经纪人推广职位
      setPromoJob(id){
        this.selectCompanyBlock = true;
        this.selectUserid = id;
        this.selectJob = true; //开启选择职位
      },
      //打开推广码窗口
      getPromoCode(id, i){
        this.selectUserid = id;
        this.searchCodes(i);
        let isOpen = this.brokerList[i].open;
        this.$set(this.brokerList[i], "open", !isOpen);
      },
      //关闭推广码窗口
      closePromoCodes(){
        this.promoCodes = false;
      },
      //搜索经济人推广码
      searchCodes(i){
        xz.brokerCode(this.selectUserid).then( list => {
          this.loadMember = false;
          if(list && Array.isArray(list)){
            let jobs = [];
            let jobInfos = [];
            let ents = [];
            let entInfos = [];
            list.forEach( l => {
              if(l.linktype == 'J') jobs.push(l);
              if(l.linktype == 'E') ents.push(l);
            })
            //获取所有的企业详情
            ents.forEach(e => {
              let getEntInfo = xz.getCompanyInformation(e.linkid);
              entInfos.push(getEntInfo);
            })
            Promise.all(entInfos).then( infos => {
              infos.forEach( (info, index) => {
                ents[index].time = this.$store.getters.formatDate(ents[index].insertdate);
                ents[index].detail = info ? info : {};
              })
              this.$set(this.brokerList[i], "Elist", ents);
     
            })
            //获取所有职位的详情
            jobs.forEach(e => {
              let getJobInfo = xz.pubidGetJobInfo(e.linkid);
              jobInfos.push(getJobInfo);
            })
            Promise.all(jobInfos).then( infos => {
              infos.forEach((info, index) => {
           
                jobs[index].time = this.$store.getters.formatDate(jobs[index].insertdate);
                jobs[index].detail = info ? info[0].JobInf : {};
                jobs[index].entName = info[0].entname;
              })
              this.$set(this.brokerList[i], "Jlist", jobs);//this.Jlist = jobs;
           
            })
          }
        });
      },
      //获取要删除的
      getCodeLinkid(id, i, type, index){
        this.deleteId = id;
        this.deleteIndex = i;
        this.deleteType = type;
        this.pIndex = index;
      },
      //设置推广企业
      deletePromoCode(){
        xz.deletePromoCode(this.deleteId).then(res => {
          if(res){
            let arr = this.deleteType == "J" ? this.brokerList[this.pIndex].Jlist : this.brokerList[this.pIndex].Elist;
            let newArr = [];
            arr.forEach( (a, i) => {
              if(i != this.deleteIndex){
                newArr.push(a);
              }
            })
            if(this.deleteType == "J"){
              this.$set(this.brokerList[this.pIndex], "Jlist", newArr);
            
            }else{
              this.$set(this.brokerList[this.pIndex], "Elist", newArr)
            }
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          }else{
            this.$message.error('删除失败，请稍后重试');
          }
        });
      },
    }
  }
</script>
<style scoped>
  .setButton{
    border:none;
    outline: none;
    color: #409eff;
    border-radius: 3px;
    padding: 8px 15px;
    background: #fff;
    border: 1px solid #409eff;
  }
  .checkButton{
    border:none;
    outline: none;
    color: #fff;
    border-radius: 3px;
    padding: 8px 15px;
    background: #409eff;
  }
  .checkAllCodes{
    width: 100%;
    background: #fff;
    padding: 0 0 0 20px;
    box-sizing: border-box;
  }
  .codesLines{
    display: flex;
    border-bottom: 1px dashed rgb(221, 221, 221);
  }
  .innerColor{
    color: #fa7268;
  }
  .code_single img{
    width: 30px;
    height: auto;
    display: block;
  }
  .codeTypeTitle{
    display: flex;
  }
  .codeTypesTitle{
    background: #fff;
  }
  .codeTypeItem{
    width: 100%;
    box-sizing: border-box;
    background: rgb(245, 245, 245);
    border-bottom: 1px dashed rgb(221, 221, 221);
  }
  .withOutCode{
    height: 30px;
    line-height: 30px;
    color: #333;
    font-size: 14px;
    width: 100%;
    background:rgb(245, 245, 245);
  }
  .checkAllCodes li{
    padding: 10px 0;
  }
  .deleteCodeStyle{
    display: inline-block;
    color: #5b9bd1;
    cursor: pointer;
  }
  .alertCodeContsainer{
    width: 200px;
    margin:0 auto;
  }
  .alertCodeContsainer img{
    display: block;
    width: 180px;
    height: auto;
    margin: 0 auto;
  }
  .alertCodeTitle{
    width: 100%;
    font-size: 14px;
    color: #333;
    margin-top: 5px;
    text-align: center;
  }
  .codeDownLoad{
    color:#5b9bd1;
    font-size: 14px;
  }
  .miniCodeImg{
    cursor:pointer;
    margin-left: 10px;
  }
  .codesLines li{
    line-height: 30px;
  }
</style>