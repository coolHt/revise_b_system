<template>
  <div class="workPoolItem">
    <el-tabs>
      <el-tab-pane label="渠道推广"></el-tab-pane>
    </el-tabs>
    <div style="display:flex;width:100%;margin-bottom: 15px;justify-content:flex-end">
      <button type="button" class="addTunnelBtn" @click="tunnelForm=true">新增渠道码</button>
    </div>
    <div class="tunnelPromotion">
      <transition name="loadShadow">
        <div class="loadShadow" v-show="loadTunnel">
          <i class="loadgif"></i>
        </div>
      </transition>
      <div class="tunnelCodes">
        <ul class="tunnelCodeListTitle">
          <li style="width:15%;" class="tunnelCodeTtitleItem">渠道名称</li>
          <li style="width:10%;" class="tunnelCodeTtitleItem">渠道类型</li>
          <li style="width:15%;" class="tunnelCodeTtitleItem">使用人员</li>
          <li style="width:10%;" class="tunnelCodeTtitleItem">创建日期</li>
          <li style="width:10%;text-align:center" class="tunnelCodeTtitleItem">新增扫码人数</li>
          <li style="width:10%;text-align:center" class="tunnelCodeTtitleItem">新增注册人数</li>
          <li style="width:10%;text-align:center" class="tunnelCodeTtitleItem">总扫码人数</li>
          <li style="width:10%;text-align:center" class="tunnelCodeTtitleItem">总注册人数</li>
          <li style="width:10%;" class="tunnelCodeTtitleItem">渠道码</li>
          <!-- <li style="width:10%;" class="tunnelCodeTtitleItem">操作</li> -->
        </ul>
        <ul class="tunnelCodeList" v-for="(item, index) in codeList" :key="index">
          <li style="width:15%;font-weight:bold;" class="tunnelCodeItem">{{item.sencname}}</li>
          <li style="width:10%;" class="tunnelCodeItem">{{item.pipname}}</li>
          <li style="width:15%;" class="tunnelCodeItem">{{item.usernames}}</li>
          <li style="width:10%;" class="tunnelCodeItem">{{item.datetime | formatDate('.')}}</li>
          <li style="width:10%;text-align:center;" class="tunnelCodeItem">{{item.addpsnnum ? item.addpsnnum + "人" : 0}}</li>
          <li style="width:10%;text-align:center;" class="tunnelCodeItem">{{item.addpsninnernum ? item.addpsninnernum + "人" : 0}}</li>
          <li style="width:10%;text-align:center;" class="tunnelCodeItem">{{item.psnnum ? item.psnnum + "人" : 0}}</li>
          <li style="width:10%;text-align:center;" class="tunnelCodeItem">{{item.psninnernum ? item.psninnernum + "人" : 0}}</li>
          <li style="width:10%;" class="tunnelCodeItem">
            <el-popover
              placement="top"
              width="200"
              trigger="click">
              <div style="width: 200px;">
                <img :src="'https://www.azhiye.com/cloudimg/' + item.codeurl" alt="" class="codeImg">
                <div class="downloadBtn">
                  <p>{{item.sencname}}</p>
                  <a :href="'https://www.azhiye.com/cloudimg/' + item.codeurl" download="渠道码" target="_blank">点击下载</a>
                </div>
              </div>
              <el-button slot="reference">查看渠道码</el-button>
            </el-popover>
          </li>
          
          <!-- <li style="width:10%;" class="tunnelCodeItem">
            <button @click="openDelte(item)">删除</button>
          </li> -->
        </ul>
      </div>
    </div>
    <!--生成渠道码弹框-->
    <el-dialog :visible.sync="tunnelForm" width="550px" :before-close="handleClose">
      <div class="tunnelPromotionForm">
        <div class="infor_field">
          <label class="field_name"><span style="color:#f38480 !important;">*</span>渠道类型：</label>
          <el-select v-model="tunnelId" placeholder="请选择" @change="selectTunnelType">
            <el-option v-for="item in tunnels" :key="item.GdPipId" :label="item.StrPipName" :value="item.GdPipId">
            </el-option>
          </el-select>
        </div>
        <div class="infor_field">
          <label class="field_name"><span style="color:#f38480 !important;">*</span>使用人员：</label>
          <el-select v-model="memberName" placeholder="请选择" @change="selectMember" multiple collapse-tags>
            <el-option v-for="item in interiorMember" :key="item.id" :label="item.userName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="infor_field">
          <IdentifyInput label-text="渠道名称：" width="250px" :mustFill="true" :inputValue="tunnel.value"
            :valueVerify="tunnel.identifyType" @returnValue="getTunnelName">
            ></IdentifyInput>
        </div>
        <button type="button" @click="genreateCode" class="genreateBtn">生成渠道码</button>
      </div>
    </el-dialog>
    <!--确认删除-->
    <el-dialog :visible.sync="confirmDelete" width="300px">
      <div class="confirmDeleteContainer">
        <p>确认删除?</p>
        <div class="btnsContainer">
          <button type="button" @click="confirmDelete=false">取消</button>
          <button type="button" @click="confirm" class="confirmBtnStyle">确定</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  //输入框
  import IdentifyInput from '../components/form/textInput';
  import xz from "../common";
  export default {
    components: {
      IdentifyInput
    },
    data: function () {
      return {
        tunnelForm: false,
        tunnels: [],
        loadTunnel: true,
        //渠道name
        tunnelType: '',
        //渠道pipid
        tunnelId: '',
        tunnel: {
          value: "",
          identifyType: "empty"
        },
        //下级人员
        interiorMember: [],
        //下级人员id
        memberId: [],
        //下级人员名字
        memberName: "",
        //已有的渠道二维码
        codeList: [],
        confirmDelete: false,
        codeid: ""
      };
    },
    created() {
      //获取渠道类型
      xz.getTunnelInformation(Cookies.get("userid-b")).then(res => {
        let tunnelType = [];
        //筛除经纪人分享和面试签到
        res.forEach(t => {
          if (t.StrPipName != "经纪人分享" && t.StrPipName != "面试签到") tunnelType.push(t);
        })
        this.tunnels = tunnelType;
        this.loadTunnel = false;
      })
      //获取下级人员
      xz.groupMember().then(member => {
        let owner = [];
        xz.accountInformation().then(account => {
          let oneself = {
            id: account.GdUserId,
            userName: account.StrUserName,
            usermobile: account.StrUserMobile
          }
          owner.push(oneself);
          member ? this.interiorMember = [...owner, ...member] : this.interiorMember = owner;
        })
      })
      //获取已生成的渠道二维码
      this.getCodes();
    },
    methods: {
      //确认关闭
      handleClose(done){
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      //获取已生成的渠道二维码
      getCodes(){
        //获取已生成的渠道二维码
        xz.getTunnelCode().then(res => {
          res ? this.codeList = res : console.log("获取已生成的渠道二维码出错");
        })
      },
      //获取渠道名称
      getTunnelName(v) {
        this.tunnel.value = v;
      },
      //获取渠道pipcode
      selectTunnelType(t) {
        this.tunnelId = t;
        //获取渠道名称
        let tunnel = this.tunnels.find(tunnel => tunnel.GdPipId == t);
        this.tunnelType = tunnel.StrPipName;
      },
      //获取下级人员id
      selectMember(m) {
        this.memberId = m;
      },
      //生成渠道码
      genreateCode() {
        if(!this.tunnel.value || this.memberId.length == 0 || !this.tunnelId){
          alert("请检查是否填写完整");
          return;
        }
        this.tunnelForm = false;
        xz.getTunnelPath(
          this.tunnelId,
          "",
          this.tunnel.value,
          this.memberId.join(),
          Cookies.get("userid-b")
        ).then(res => {
          if(res){
            //清空数据
            this.$set(this.tunnel, "value", "");
            this.tunnelId = "";
            this.memberName = "";
            this.tunnelType = "";
            this.memberId = [];
            this.$message({
              message: '生成成功!',
              type: 'success'
            });
            //关闭表单
            this.getCodes();
          }else{
            console.log("生成渠道码出错");
          }
        })
      },
      //
      openDelte(item){
        this.codeid = item.codeid;
        this.confirmDelete = true;
      },
      confirm(){
        xz.deleteTunnelCode(this.codeid).then( res => {
          if(res){
            this.confirmDelete = false;
            this.getCodes();
          }
        })
      }  
    }
  };
</script>
<style scoped>
  .genreateBtn {
    display: block;
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 5px;
    color: #fff;
    background: #409eff;
    padding: 8px 15px;
    margin: 20px auto 0 auto;
  }
</style>
<style>
  .tunnelPromotionForm{
    width:480px;margin: 0 auto;
  }
  .tunnelPromotionForm .el-input__inner {
    width: 250px;
  }
  .tunnelCodeListTitle,.tunnelCodes,.tunnelCodeList{
    width: 100%;
    box-sizing: border-box;
  }
  .tunnelCodeListTitle,.tunnelCodeList{
    display: flex;
  }
  .tunnelCodeTtitleItem{
    background: #f2f2f2;
  }
  .tunnelCodeItem, .tunnelCodeTtitleItem{
    box-sizing: border-box;
    color: #333;
    padding: 6px 0 6px 6px;
    font-size: 14px;
  }
  .tunnelCodeItem span{
    font-size: 14px;
    cursor: pointer;
    color: #409eff;
  }
  .addTunnelBtn,.deleteCodeBtn{
    border: none;
    border-radius: 5px;
    padding:6px 15px;
    font-size: 14px;
    color: #fff;
    outline: none;
    background: #409eff;
  }
  .codeImg{
    display: block;
    width: 200px;
    height: 200px;
  }
  .confirmDeleteContainer{
    width: 100%;
  }
  .confirmDeleteContainer p{
    font-size: 15px;
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  .btnsContainer button{
    padding:6px 12px;
    border: 1px solid #ddd;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
    font-size: 14px;
  }
  .confirmDeleteContainer .btnsContainer{
    margin: 0 auto;
    width:70%;
    display:flex;
    justify-content:space-between;
  }
  .confirmBtnStyle{
    color: #fff;
    border:none;
    background: #409eff;
  }
  .downloadBtn, .downloadBtn p{
    text-align: center;
  }
  .downloadBtn p{
    margin: 5px 0;
    font-weight: bold;
  }
</style>