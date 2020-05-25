<template>
  <div class="workPoolItem">
    <div>
      <div class="partitionTitle">
        <el-tabs>
          <el-tab-pane label="团队成员"></el-tab-pane>
        </el-tabs>
        <button @click="addDialog = !addDialog" class="addNewBtn" v-if="purviews.manageTalent">新增成员</button>
      </div>
    </div>
    <TeamTreeStructure :list="teamInfo" @setting-member="settingMember" :purview="purviews.managePurview"></TeamTreeStructure>
    <!--新增队员-->
    <el-dialog :visible.sync="addDialog" width="600px" :before-close="closeAddMember" :destroy-on-close='true'>
      <AddUserItem @funAddMerber="funAddMerber" :closeType="isClose" @clearData="isClose = false"></AddUserItem>
    </el-dialog>

    <!--设置权限-->
    <el-dialog :visible.sync="openSettingPurview" width="480px" :before-close="closeSetting" :destroy-on-close='true'>
      <SettingPurview :settingId="settingUserid" :settingName="settingUserName" @closeSetting="clearSetting"></SettingPurview>
    </el-dialog>
  </div>
</template>
<script>
  import AddUserItem from "../components/adminForm";
  import xz from "../common";
  import SettingPurview from "../components/settingPurview";
  import TeamTreeStructure from "../components/widgets/teamMemberTree"
  export default {
    components: {
      AddUserItem,
      SettingPurview,
      TeamTreeStructure
    },
    data: function () {
      return {
        openSettingPurview: false,//设置权限
        addDialog: false,
        loadMember:false,
        teamInfo: [], //成员列表
        isClose: false,//表单关闭状态
        settingUserid: null, //当前设置的人的userid
        settingUserName: null, //当前设置的人的名称
      };
    },
    created() {
      this.getMember();
    },
    computed: {
      //权限
      purviews(){
        return this.$store.state.purview;
      }
    },
    methods: {
      // 打开设置窗口
      settingMember(item){
        this.settingUserid = item.id;
        this.settingUserName = item.userName;
        this.openSettingPurview = true;
      },
      //获取团队成员
      getMember(){
        const _this = this;
        xz.groupMember().then((res) => {
          _this.loadMember = true;
          if(res){
            Array.isArray(res) ? _this.teamInfo = res : _this.teamInfo = [];
          }else{
            console.log("获取团队成员出错");
          }
        })
      },
      //关闭新增成员表
      funAddMerber() {
        this.loadMember = false;
        this.addDialog = false;
        this.getMember();
      },
      
      //关闭新增窗口
      closeAddMember(done){
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      //关闭设置窗口
      closeSetting(done){
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      //设置成功后关闭设置窗口
      clearSetting(){
        this.openSettingPurview = false;
      },
    }
  };
</script>