<template>
  <div class="settingPurview">
    <div class="settingPurviewCenter">
      <h1 class="settingMemberName">{{userName}}</h1>
      <div class="settingField">
        <label class="fiedLabel">
          <span class="mustFillIcon">*</span>地区选择:
        </label>
        <div class="purviewSelectList">
          <el-select v-model="selectedRegion" :multiple="true" placeholder="请选择" @change="selectedPurviewRegion">
            <el-option
              v-for="region in regionOptions"
              :key="region.value"
              :label="region.label"
              :value="region.value"
              
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="settingField" v-show="purviewList.length > 0">
        <label class="fiedLabel">
          <span class="mustFillIcon">*</span>选择权限:
        </label>
        <div class="purviewSelectList">
          <el-checkbox-group v-model="selectedExtraList">
            <el-checkbox
              :label="p.powercode"
              v-for="(p, index) in purviewList"
              :key="index"
            >{{p.powername}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="settingField">
        <label class="fiedLabel">
          <span class="mustFillIcon">*</span>选择机构:
        </label>
        <input
          readonly
          type="text"
          placeholder="请输入机构名称"
          v-model="currentSelected.instname"
          @click="showagency = true"
          class="agencySelect"
        />
      </div>
      <button @click="settingMember" class="addBtn">设置</button>
    </div>
    <!--选择机构-->
    <el-dialog
      :visible.sync="showagency"
      width="400px"
      :before-close="closeAgency"
      :append-to-body="true"
      class="userAgency"
    >
      <div class="selectedContainer">
        <div>
          <span>已选择:</span>
          <span v-if="currentSelected != ''">{{currentSelected.instname}}</span>
        </div>
        <button class="resolveBtn" @click="showagency = false">完成</button>
      </div>

      <vue-tree-list
        v-if="department"
        @click="onClick"
        :model="department"
        default-tree-node-name="new node"
        default-leaf-node-name="new leaf"
      ></vue-tree-list>
    </el-dialog>
  </div>
</template>
<script>
import xz from "../common";
import { VueTreeList, Tree, TreeNode } from "vue-tree-xz";

export default {
  components: {
    VueTreeList
  },
  props: {
    settingId: {
      type: String,
      value: ""
    },
    settingName: {
      type: String,
      value: ""
    }
  },
  data: function() {
    return {
      userid: "",
      userName: "",
      department: null,
      showagency: false, //机构
      purviewList: [],
      selectedExtraList: [],
      selected: "", //已选择的区域
      regionList: [], ////账号区域数组
      selectedRegion: [], //已选择的账号区域
      manageRegion: "", //当前账号管理的地区
      currentSelected: "", //已选择的机构
      regions: [], //已选择地区,
      regionOptions: []
    };
  },
  created() {
    // 获取已开通的城市
    xz.getServeCity().then(res => {
      let list = [{
          label: "全国",
          value: "000000"
        }];

      if(res && Array.isArray(res)){
        res.forEach( r => {
          if(r.CityName){
            list.push({
              label: r.CityName,
              value: r.CityCode
            })
          }
        })
      }
      console.log(list);
      this.regionOptions = list;
    })
    //先拿到权限分组，然后再拿所有权限 => 因为一次性拿不到所有权限
    xz.purviewGroup().then(res => {
      if (res) {
        const t = res[0].roletype;
        xz.purviewGroupList(t).then(res => {
          res
            ? (this.purviewList = [...res.used, ...res.unused])
            : console.log("获取权限组内容出错");
        });
      } else {
        console.log("获取权限组出错");
      }
    });
  },
  watch: {
    settingId: {
      handler() {
        this.userid = this.settingId;
        //获取机构
        this.getTreeData();
        this.selectedExtraList = [];
        //获取用户权限
        xz.getMemberPurview(this.settingId).then(res => {
          //获取已设置的地区
          const code = res[0].strnations;
          let codeList = [];
          if(code){
            if(code == "000000"){
              codeList = ["全国"];
            }else{
              codeList = code.split(",");
            }
          }else{
            codeList = []; 
          }
          
          if (code) this.selectedRegion = codeList;
          //设置已选择机构
          this.currentSelected = {
            // Fix: TNtLike
            // instcode: this.instcode,
            instcode: res[0].strinstcode,
            instname: res[0].strinstname
          };
          //已拥有权限
          res
            ? res.forEach(v => this.selectedExtraList.push(v.powercode))
            : (this.selectedExtraList = []);
        });
      },
      immediate: true
    },
    settingName: {
      handler() {
        this.userName = this.settingName;
      },
      immediate: true
    }
  },
  methods: {
    //设置成员
    settingMember() {
      const list = this.selectedExtraList.join();
      let regionStr = "";
      if(this.selectedRegion.length == 0){
        regionStr = "";
        alert("请选择地区");
        return;
      }else{
        regionStr = this.selectedRegion.join();
      }
      //设置保存
      xz.setInferiorPurview(
        this.userid,
        list,
        this.currentSelected.instcode,
        regionStr
      ).then(res => {
        if (res) {
          this.$emit("closeSetting");
          this.$message({
            message: "设置成功",
            type: "success"
          });
        } else {
          this.$emit("closeSetting");
          this.$message({
            message: "设置出错",
            type: "error"
          });
        }
      });
    },
    //关闭机构
    closeAgency() {
      this.showagency = false;
      this.currentSelected = "";
    },
    //选择部门
    onClick(param) {
      this.currentSelected = param;
    },
    //获取机构数据
    getTreeData() {
      xz.getDepartment(this.$store.state.instcode).then(res => {
        res ? (this.department = new Tree(res)) : console.log("部门数据获取出错");
      });
    },
    //
    selectedPurviewRegion(data){
      this.selectedRegion = data;
    }
  }
};
</script>
<style scoped>
.settingPurviewCenter {
  width: 425px;
  margin: 0 auto;
}
.loadDepartment {
  width: 100%;
  padding: 30px 0;
}

.settingField {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  margin-bottom: 15px;
}

.fiedLabel {
  display: block;
  width: 90px;
  height: 45px;
  line-height: 45px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  margin-bottom: 0;
  color: #333;
  font-size: 15px;
}

.agencySelect {
  width: 330px !important;
  border: 1px solid #ddd !important;
  border-radius: 6px !important;
  height: 45px !important;
  font-size: 14px !important;
  padding: 0 15px !important;
  -webkit-box-sizing: border-box !important;
  box-sizing: border-box !important;
  outline: none !important;
}

.settingMemberName {
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.purviewSelectList {
  width: 330px;
}
.chooseRegion {
  font-size: 14px;
  line-height: 22px;
  color: #333;
}
.regionlist {
  margin-bottom: 10px;
}
.regionSingle {
  padding: 5px 22px 5px 8px;
  background: #409eff;
  border-radius: 3px;
  position: relative;
  color: #fff;
  margin: 0 8px 8px 0;
}
</style>