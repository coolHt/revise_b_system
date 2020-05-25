<template>
  <div>
    <div class="agencyTree" v-for="(item, index) in list" :key="index">
      <div class="treeHeader" @click="openDirectory(item)">
        <i :class="{'foldIcon': item.lowUser === '1', 'unfold': item.openDir && item.lowUser === '1'}"></i>
        <p class="treeTtile">{{item.userName}}</p>
        <span>创建时间: {{item.date | formatDate}}</span>
        <i class="settingMember" @click.stop="settingMember(item)" v-if="isAccess">设置</i>
        <i class="settingMember" @click.stop="initSubordinate(item)" v-if="isAccessInit">重置下级用户</i>
      </div>
      <div v-if="item.children" v-show="item.openDir" class="secondTree">
        <TeamTreeStructure :list="item.children" :parent="item" @setting-member="settingMember" :purview="isAccess"></TeamTreeStructure>
      </div>
    </div>
  </div>
</template>
<script>
import xz from "../../common";
export default {
  name: "TeamTreeStructure",
  props: {
    list: Object,
    parent: Object,
    purview: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      isAccess: false,
      isAccessInit: false
    }
  },
  mounted(){
    if(Cookies.get("userid-b") === "a8034cc9-ea31-4df2-91f6-33b375253d4d" || Cookies.get("userid-b" === "04F97C95-DF0F-4E4F-90DB-234E969EB323")){
      this.isAccessInit = true;
    }
  },
  watch: {
    "purview": {
      handler: function(){
        this.isAccess = this.purview;
      },
      immediate: true
    }
  },
  methods: {
    // 获取下级人员
    openDirectory(item){
      if(item.openDir){
        this.$set(item, "openDir", false);
      }else{
        if(item.children){
          this.$set(item, "openDir", true);
        }else{
          xz.groupMember(item.id).then((res) => {
            if(res){
              if(Array.isArray(res)){
                this.$set(item, "children", res);
                this.$set(item, "openDir", true);
              }
            }else{
              console.log("获取子成员出错");
            }
          })
        }
      }
    },
    // 重置下级用户
    initSubordinate(item){
      console.log(item);
      xz.refreshInferior(item.id);
    },

    // 触发显示设置个人信息
    settingMember(item){
      console.log(item);
      this.$emit("setting-member", {
        userName: item.userName,
        id: item.id
      });
    }
  }
}
</script>
<style scoped>
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
    margin-right: 15px;
  }
  .settingMember{
    color: #409eff;
    display: inline-block;
    font-size: 14px;
    margin-left: 20px;
    cursor: pointer;
  }
  .settingMember:hover{
    text-decoration: underline;
  }
  .secondTree{
    margin-left: 25px;
  }
</style>