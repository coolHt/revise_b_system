<template>
  <div class="workPoolItem" style="background: #fff;">
    <TreeStructure :list="list" :parent="{}" @update-tree="updateTree" @show-member="showMember"></TreeStructure>
    
    <!--人员修改-->
    <div class="memeberGroupContainer stretchNone" ref="members">
      <transition name="loadShadow">
        <div class="loadShadow" v-show="loadImg">
          <i class="loadgif"></i>
        </div>
      </transition>
      <i class="xz_close_resume" @click="closeMember"></i>
      <div class="memberGroup">
        <table>
          <thead>
            <tr>
              <th style="width: 100px">名称</th>
              <th style="width: 150px">手机号</th>
              <th style="width: 150px;">邮箱</th>
              <th style="width: 150px">角色类型</th>
              <th style="width: 100px;">当前部门</th>
              <th style="width: 100px;">创建时间</th>
              <th >操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m,index) in member" :key="index" class="memeberLine">
              <td>{{m.Username}}</td>
              <td>{{m.Strmobile}}</td>
              <td>{{m.StrEmail}}</td>
              <td>{{m.Roletype}}</td>
              <td>{{m.Strinstname}}</td>
              <td>{{m.DtInsertDate | formatDate}}</td>
              <td>
                <button class="deleteMember" @click="settingForm(m)">修改</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--设置权限-->
    <el-dialog :visible.sync="openSettingPurview" width="480px" :before-close="closeSetting" :destroy-on-close='true'>
      <SettingPurview :settingId="settingUserid" :settingName="settingUserName" @closeSetting="clearSetting"></SettingPurview>
    </el-dialog>
  </div>
</template>

<script>
import xz from "../common";
import TreeStructure from "../components/widgets/departmentTree";
import SettingPurview from "../components/settingPurview";
export default {
  components: {
    TreeStructure,
    SettingPurview
  },
  data() {
    return {
      newTree: {},
      data: null,
      username: "",
      addUserForm: false,
      currentParam: null,
      list: [],
      member: [],
      loadImg: false,
      openSettingPurview: false,
      settingUserid: "",
      settingUserName: ""
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    // 更新数据
    updateTree(){
      this.getTreeData();
    },
    addDepartment() {
      let obj = {
        instname: this.username,
        instcode: new Date().valueOf(),
        topinstcode: this.currentParam ? this.currentParam.instcode : "", //上级code
        topinstname: this.currentParam ? this.currentParam.instname : "", //上级名称
        lvlid: this.currentParam ? parseInt(this.currentParam.lvid) + 1 : 1, //当前等级
        orderid: this.currentParam
          ? this.currentParam.children.length
            ? this.currentParam.children.length
            : 0
          : 1 //当前位置
      };
      const _this = this;
      xz.addDepartment(obj).then(res => {
        if (res) {
          _this.addUserForm = false;
          //清空
          _this.currentParam = null;
          _this.getTreeData();
          _this.username = "";
        } else {
          console.log("新增部门出错");
        }
      });
    },
    //删除部门
    delUser(node) {
      const _this = this;
      let obj = {
        instcode: node.instcode
      };
      xz.deleteDepartment(obj).then(res => {
        if (res) {
          if (res.msg == "删除成功！") {
            //清空
            _this.currentParam = null;
            _this.getTreeData();
          } else {
            alert("存在下级机构，请先删除下级机构");
          }
        } else {
          console.log("删除部门出错");
        }
      });
    },
    handleClose() {
      this.addUserForm = false;
    },

    //移动部门
    moveNode(n) {
      let mNode = n.node;
      let tNode = n.target;
      const _this = this;
      let obj = {
        instname: mNode.instname,
        instcode: mNode.instcode,
        topinstcode: tNode ? tNode.instcode : "", //上级code
        topinstname: tNode ? tNode.instname : "", //上级名称
        lvlid: tNode ? parseInt(tNode.lvid) + 1 : 0, //当前等级
        orderid: tNode ? (tNode.children.length ? tNode.children.length : 0) : 0 //当前位置
      };
      xz.addDepartment(obj).then(res => {
        res ? _this.getTreeData() : console.log("移动部门出错");
      });
    },
    //修改部门名称
    onChangeName(params) {
      const n = params.node;
      let obj = {
        instname: params.newName,
        instcode: n.instcode,
        topinstcode: n.parent ? n.parent.instcode ? n.parent.instcode : "" : "", //上级code
        topinstname: n.parent ? n.parent.instname && n.parent.instname != "root" ? n.parent.instname : "" : "", //上级名称
        lvlid: n.lvid ? n.lvid : 0, //当前等级
        orderid: n.orderid ? n.orderid : 0 //当前位置
      };
      const _this = this;
      xz.addDepartment(obj).then(res => {
        if (res) {
          _this.addUserForm = false;
          //清空
          _this.currentParam = null;
          _this.getTreeData();
        } else {
          console.log("修改部门名称出错");
        }
      });
    },

    onAddNode(params) {
      this.addUserForm = true;
      if (params.parent) this.currentParam = params.parent;
      params.addLeafNodeDisabled = false;
      params.isLeaf = false;
    },
    onClick(params) {
      if (params.parent) this.currentParam = params.parent;
    },
    
    //获取部门树
    getTreeData() {
      xz.getDepartment(this.$store.state.instcode).then(res => {
        if (res) {
          console.log(res);
          this.list = res;
        } else {
          console.log("获取部门出错");
        }
      });
    },

    // 展开/获取人员列表
    showMember(instcode){
      this.loadImg = true;
      let memberList = this.$refs.members;
      
      if(memberList.classList.value.indexOf("stretchNone") > -1){
        memberList.classList.remove("stretchNone");
      }
      xz.departmentMember(instcode).then(member => {
        this.loadImg = false;
        this.member = member ? member : [];
      });
      
    },

    // 关闭人员列表
    closeMember(){
      let memberList = this.$refs.members;
      memberList.classList.value.indexOf("stretchNone") > -1 ? memberList.classList.remove("stretchNone") : memberList.classList.add("stretchNone");
    },

    //关闭设置窗口
      closeSetting(done){
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },

      // 打开设置人员
      settingForm(m){  
        this.settingUserid = m.Userid;
        this.settingUserName = m.Username;
        this.openSettingPurview = true;
      }
  }
};
</script>

<style>
.vtl .vtl-drag-disabled {
  background-color: #d0cfcf;
}
.vtl .vtl-drag-disabled:hover {
  background-color: #d0cfcf;
}
.vtl-disabled {
  background-color: #d0cfcf;
}
</style>

<style scoped>
.icon:hover {
  cursor: pointer;
}

.operateIcon {
  width: 20px;
  height: 20px;
}

.user-form {
  width: 100%;
}

.name-label {
  font-size: 15px;
  width: 80px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 10px;
  text-align: right;
  margin-bottom: 0;
  color: #333;
  padding-top: 0;
}

.name-form {
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 6px;
  height: 45px;
  font-size: 14px;
  padding: 0 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
}
.memeberGroupContainer{
    padding: 50px 20px;
    position: fixed;
    box-sizing: border-box;
    z-index: 99;
    height: calc(100vh - 90px);
    top: 90px;
    right: 0;
    width: 880px;
    background: #fff;
    transition: all 0.15s linear;
    border: 1px solid #ddd;
    overflow-x: auto;
  }
  .deleteMember{
    padding: 6px 15px;
    color: #fff;
    border: none;
    background: #409eff;
    outline: none;
    border-radius: 3px;
  }
  .memberGroup td,
  .memberGroup th{
    padding: 10px 0;
    text-align: center;
    font-size: 14px;
  }
  .stretchNone{
    right: -880px !important;
  }
</style>