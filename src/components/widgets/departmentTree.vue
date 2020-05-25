<template>
  <div>
    <div class="agencyTree" v-for="(item, index) in list" :key="index">
      <div class="treeHeader" @click="openDirectory(item)">
        <i :class="{'unfold': item.openDir, 'foldIcon': Array.isArray(item.children) && item.children.length}"></i>
        <p class="treeTtile" v-if="!item.editName">{{item.instname}}</p>
        <div v-else @click.stop="" class="editInputContainer">
          <input type="text" v-model="editName" class="editInputName">
          <button type="button" class="agreeChange" @click="enterEditName(item)">确定修改</button>
          <button type="button" class="cancelChange" @click="cancelEditName(item)">取消</button>
        </div>
        <i class="stretchIcon plusIcon" @click.stop="makeDir(item)"></i>
        <i class="stretchIcon editIcon" @click.stop="editDirName(item)"></i>
        <i class="stretchIcon userGroupIcon" @click.stop="getMemebers(item)"></i>
        <el-popconfirm
          confirmButtonText='确定'
          cancelButtonText='取消'
          :hideIcon="true" 
          title="确认通过？"
          @onConfirm="deleteAgency(item)">
          <i class="stretchIcon deleteIcon" @click.stop="" slot="reference"></i>
          <!-- <div style="display:block;width: 50px;height:50px;background: #000">rrr</div> -->
        </el-popconfirm>
      </div>
      <div class="addNewAgency" v-if="item.addDepartment">
        <input type="text" v-model="departmentName">
        <div class="editNewAgency">
          <button type="button" class="agreeChange" @click="enterAddDepartment(item)">新增</button>
          <button type="button" class="cancelChange" @click="cancelAddDepartment(item)">取消</button>
        </div>
      </div>
      <div v-if="item.children" v-show="item.openDir" class="secondTree">
        <TreeStructure :list="item.children" :parent="item" @update-tree="updateTree" @show-member="showMember"></TreeStructure>
      </div>
    </div>
  </div>
</template>
<script>
import xz from "../../common";
export default {
  name: "TreeStructure",
  props: {
    list: Object,
    parent: Object
  },
  data(){
    return {
      // 名字修改
      editName: "",
      departmentName: ""
    }
  },
  mounted(){
  },
  methods: {
    // 删除机构
    deleteAgency(item){
      let obj = {
        instcode: item.instcode
      };
      xz.deleteDepartment(obj).then(res => {
        if (res) {
          if (res.msg == "删除成功！") {
            this.$emit("update-tree");
          } else {
            alert("存在下级机构，请先删除下级机构");
          }
        } else {
          console.log("删除部门出错");
        }
      });
    },
    // 展开文件
    openDirectory(item){
      if(Array.isArray(item.children) && item.children.length){
        this.$set(item, "openDir", item.openDir ? false : true); 
      }
    },

    // 获取当前部门下的人员
    getMemebers(item){
      this.showMember(item.instcode);
    },

    // 创建新文件夹
    makeDir(item){
      this.departmentName = "";
      this.$set(item, "addDepartment", item.addDepartment ? false: true);
    },
    // 确认新增部门
    enterAddDepartment(item){
      let obj = {
        instname: this.departmentName,
        instcode: new Date().valueOf(),
        topinstcode: item.instcode ? item.instcode : "", //上级code
        topinstname: item.instname ? item.instname : "", //上级名称
        lvlid: item.lvid ? parseInt(item.lvid) + 1 : 1, //当前等级
        orderid: Array.isArray(item.children) ? item.children.length : 1
      };

      xz.addDepartment(obj).then(res => {
        this.$set(item, "addDepartment", false); 
        if(res){
          this.$message({
            message: '修改成功',
            type: 'success'
          });

          this.$emit("update-tree");
        }else{
          this.$message.error('修改出错');
        }
      })
    },
    // 取消创建新文件夹
    cancelAddDepartment(item){
      this.$set(item, "addDepartment", false);
    },

    // 修改文件名称
    editDirName(item){
      this.editName = item.instname;
      // 显示修改输入框
      this.$set(item, "editName", item.editName ? false : true);
    },
    // 取消修改名称
    cancelEditName(item){
      this.$set(item, "editName", false);
    },
    // 确定修改名称
    enterEditName(item){
      let obj = {
        instname: this.editName,
        instcode: item.instcode,
        topinstcode: this.parent && this.parent.instcode ? this.parent.instcode : "",
        topinstname: this.parent && this.parent.instname ? this.parent.instname : "",
        lvlid: item.lvid,
        orderid: item.orderid //当前位置
      };
      xz.addDepartment(obj).then(res => {
        this.$set(item, "editName", false);
        if(res){
          this.$message({
            message: '修改成功',
            type: 'success'
          });

          this.$emit("update-tree");
        }else{
          this.$message.error('修改出错');
        }
      })
    },

    // 向上提交更新事件
    updateTree(){
      this.$emit("update-tree");
    },
    // 向上提交获取部门的人员列表
    showMember(instcode){
      this.$emit("show-member", instcode);
    },
    
  }
}
</script>
<style scoped>
  .editInputContainer{
    display: flex;
    align-items: center;  
  }

  .editInputContainer button{
    border: none;
    font-size: 14px;
    outline: none;
    padding: 6px 16px;
    color: #fff;
    margin-right: 10px;
    border-radius: 3px;
  }
  .editInputName{
    width: 220px;
    height: 35px;
    border: 1px solid #ddd;
    border-radius: 3px;
    outline: none;
    margin-right: 30px;
    box-sizing: border-box;
    padding: 0 10px;
  }
  .addNewAgency{
    width: 250px;
    margin-bottom: 10px;
  }
  .addNewAgency input{
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
    padding:0 10px;
    height: 40px;
    outline: none;
  }
  .editNewAgency{
    width: 80%;
    margin: 8px auto 0 auto;
    justify-content: space-between;
    display: flex;
  }
  .editNewAgency button{
    display: block;
    font-size: 14px;
    outline: none;
    color: #fff;
    border: none;
    border-radius: 3px;
    padding: 8px 18px;
    margin-right: 10px;
  }
  .treeHeader{
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    cursor: pointer;
    -moz-user-select:none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  .foldIcon::before{
    content: "";
    display: block;
    width: 12px;
    height: 12px; 
    background: url("../../assets/images/caret-right.png");
    background-size: 100% auto;
  }
  .unfold::before{
    background: url("../../assets/images/sort-down.png");
    background-size: 100% auto;
  }
  .treeTtile{
    font-size: 14px;
    color: #333;
  }
  .stretchIcon{
    display: block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    margin-left: 15px;
  }
  .plusIcon{
    background: url("../../assets/images/plus.png") no-repeat;
    background-size: 100% auto;
  }
  .minusIcon{
    background: url("../../assets/images/minus.png") no-repeat;
    background-size: 100% auto;
  }
  .editIcon{
    background: url("../../assets/images/edit.png") no-repeat;
    background-size: 100% auto;
  }
  .userGroupIcon{
    background: url("../../assets/images/user_group.png") no-repeat;
    background-size: 100% auto;
  }
  .deleteIcon{
    background: url("../../assets/images/delete_icon.png") no-repeat;
    background-size: 100% auto;
  }
  .secondTree{
    margin-left: 25px;
  }
  .agreeChange{
    background: #409eff;
  }
  .cancelChange{
    background: #67c23a;
  }
</style>