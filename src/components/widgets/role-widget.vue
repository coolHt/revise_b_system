<template>
  <div class="roleContainer">
    <div class="roleSelecter"  ref="jobFunInput">
      <input type="text" class="roleInput" @input="searchKeyWord" v-model="roleName">
      <i class="roleIcon fa fa-calendar-o" @click="alertRoleMenu"></i>
      <div class="searchResult" v-show="hasResult">
        <ul>
          <li v-for="(result,index) in searchResult" :key="index">
            <div class="resuleLine leveltop">{{result.level1}}</div>
            <div class="resuleLine levelchild" v-for="(r1,i2) in result.level2" @click="chooseResult(r1)">{{r1}}</div>
            <div class="resuleLine levelchild" v-for="(r2,i2) in result.level3" @click="chooseResult(r2)">{{r2}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="roleMenuContainer" v-show="showMenu">
      <div class="roleMenus">
        <i class="closeOrganization" @click="cloeseRoleMenus"></i>
        <div class="headerContainer">
          <p class="headerTitle">选择职能</p>
          <div class="alreadyContainer">
            <p class="alreadySelect">已选择: {{seleted}}</p>
            <button type="button" class="checkRoleBtn" @click="returnRole">确定</button>
          </div>
        </div>
        <div class="menusContainer">
          <div class="roleTitles">
            <p class="single_roleTitle" :class="{'checkFirst' : t.funcname == firstClick}" v-for="(t,index) in allRole" v-bind:key="index" @click="selectFirst(t.funcname, index)">{{t.funcname}}</p>
          </div>
          <div class="centerTitles">
            <p class="center_roleTitle" :class="{'checkFirst' : c.sortname == secondClick}" v-for="(c, index) in centerList" v-bind:key="index" @click="selectCenter(c.sortname, index)">{{c.sortname}}</p>
          </div>
          <div class="thridTitles">
            <p class="last_roleTitle" :class="{'checkFirst' : t == thirdClick}" v-for="(t, index) in thirdList" v-bind:key="index" @click="selectLast(t)">{{t}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import xz from "../../common";
export default {
  props:{
    roleList: {
      type: String,
      default: ""
    }
  },
  data(){
    return {
      roleArr:[],
      roleName: "",
      showMenu: false,
      allRole: [],
      firstClick: "",
      secondClick: "",
      thirdClick: "",
      centerList: [],
      thirdList: [],
      secondIndex: 0,
      seleted:"", //已选择
      searchResult:[], //搜索结果
      hasResult: false, //判断是否有搜索结果
    }
  },
  created(){
    //获取大类
    xz.roleDivision().then( t => {
      if(t){
        //排序先将基础放第一位
        let firstType = [undefined];
        let promiseList = [];
        t.forEach( it => {
          if(it.funcid == "120000"){
            firstType[0] = it;
          }else{
            firstType.push(it);
          }
        })
        firstType.forEach( it => {
          promiseList.push(xz.roleOffspring(it.funcid));
        })
        //获取到所有的子类
        Promise.all(promiseList).then( res => {
          if(Array.isArray(res)){
            firstType.forEach( (f, i) => {
              f.second = res[i];
            })
            //获取到所有的数据
            this.allRole = firstType;
            //初始化第一类选择
            this.firstClick = firstType[0].funcname;
            this.centerList = firstType[0].second;
            this.secondIndex = 0;
            this.thirdList = this.centerList[0].children; //默认选择第一个
          }
        })
      }
    })
  },
  watch:{
    'roleList': {
      handler: function(){
        this.roleName = this.roleList;
        this.seleted = this.roleList;
      },
      immediate: true
    },
    //返回数据
    "roleName": {
      handler: function(){
        this.seleted = this.roleName;
        this.$emit("returnRole", this.seleted);
      },
      immediate:true
    }
  },
  mounted(){
    document.addEventListener('click', (e) => {
        if (e.target.classList[0]) {
          let v = e.target.classList[0];
          if (this.$refs.jobFunInput) {
            if (this.$refs.jobFunInput.getElementsByClassName(v).length == 0 && v !=
              'jobFunInput') {
              this.hasResult = false;
            }
          }
        }else{
          this.hasResult = false;
        }
      }, false)
  },
  methods:{
    //选择第一大类
    selectFirst(n, i){
      if(this.firstClick != n){
        this.firstClick = n;
        this.centerList = this.allRole[i].second;
        this.secondIndex = 0;
        this.thirdList = this.centerList[0].children; //默认选择第一个
      }
    },
    //选择第二大类
    selectCenter(n, i){
      this.secondClick = n;
      this.seleted = n;
      this.secondIndex = i;
      this.thirdList = this.centerList[i].children;
    },
    //选择第三类
    selectLast(n){
      this.seleted = n;
      this.thirdClick = n;
      //第二大类样式
      this.secondClick = this.centerList[this.secondIndex].sortname
    },
    //弹出职能
    alertRoleMenu(){
      this.showMenu = true;
      if(this.roleName){
        this.seleted = this.roleName;
        //搜索是否有这个数据，和数据的关系
        if(this.roleName == "其他"){
          this.firstClick = "公务员/翻译/其他";
          this.allRole.forEach( (a, i) => {
            if(a.funcname == "公务员/翻译/其他"){
              this.centerList = this.allRole[i].second;
            }
          })
          this.secondClick = "其他";
          this.centerList.forEach( (c, i) => {
            if(c.sortname == "其他"){
              this.thirdList = this.centerList[i].children;
            }
          })
          this.thirdClick = "";
        }else{
          for (let i = 0; i < this.allRole.length; i++) { //第一级
            if(this.allRole[i].funcname == this.seleted){
              //第一级
              this.firstClick = this.allRole[i].funcname;
              this.centerList = this.allRole[i].second;
              this.secondIndex = 0;
              this.thirdList = this.centerList[0].children; //默认选择第一个
            }
            for(let z = 0; z < this.allRole[i].second.length; z++){
              //第二级
              let second = this.allRole[i].second[z];
              if(second.sortname == this.seleted){
                this.firstClick = this.allRole[i].funcname;
                this.secondClick = second.sortname;
                this.secondIndex = z;
                this.thirdList = this.second.children;
              }
              for(let q = 0; q < second.children.length; q++){
                if(second.children[q] == this.seleted){
                  this.thirdClick = second.children[q];
                  this.secondClick = second.sortname;
                  this.centerList = this.allRole[i].second;
                  this.thirdList = second.children;
                  this.secondIndex = z;
                  this.firstClick = this.allRole[i].funcname;
                }
              }
            }
          }
        }
      }
    },
    //关闭选择
    cloeseRoleMenus(){
      this.showMenu = false;
    },
    //点击确定返回输出结果
    returnRole(){
      this.roleName = this.seleted;
      this.showMenu = false;
    },
    //根据输入显示查找结果
    searchKeyWord() {
        this.searchResult = []; //重置
        if (this.roleName.trim() != '') {
          for (let i = 0; i < this.allRole.length; i++) { //第一级
            let hasKey = false; //判断有没有值
            let level1 = this.allRole[i].funcname; //第一级名称
            let level2 = [];
            let level3 = [];
            if (level1.indexOf(this.roleName) > -1) {
              hasKey = true;
            }
            for (let i2 = 0; i2 < this.allRole[i].second.length; i2++) {
              let second = this.allRole[i].second[i2];
              let level2Name = second.name ? second.name : ''; //第二级名字
              if (level2Name.indexOf(this.roleName) > -1) {
                level2.push(level2Name);
                hasKey = true;
              }
              for (let i3 = 0; i3 < second.children.length; i3++) {
                let manager = second.children[i3];
                let level3Name = manager ? manager : ''; //第三级名字
                if (level3Name.indexOf(this.roleName) > -1) {
                  level3.push(level3Name);
                  hasKey = true;
                }
              }
            }
            if (hasKey == true) { //如果4级中其中有关键词的话
              this.searchResult.push({
                level1: level1,
                level2: level2,
                level3: level3,
              })
              this.hasResult = true;
            }
          }
        } else {
          this.hasResult = false;
          this.searchResult = [];
        }
      },
    //选择结果
    chooseResult(value){
      this.roleName = value;
      this.seleted = value;
      this.hasResult = false;
    }
  }
}
</script>
<style scoped>
  .roleContainer{
    width: 250px;
  }
  .roleSelecter{
    width: 100%;
    position: relative;
  }
  .roleInput{
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 6px;
    height: 45px;
    font-size: 14px;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
  }
  .roleIcon{
    position: absolute;
    right: 15px;
    top: 16px;
    cursor: pointer;
  }
  .roleMenuContainer{
    position: fixed;
    top:0;
    right:0;
    left: 0;
    bottom:0;
    background: rgba(0,0,0,0.4);
    z-index: 999;
  }
  .roleMenus{
    width: 800px;
    height: 600px;
    display: block;
    box-sizing: border-box;
    margin: 5vh auto 0 auto;
    background: #fff;
    position: relative;
    padding: 60px 30px 30px 30px;
  }
  .menusContainer{
    width: 100%;
    display: flex;
    height: 460px;
  }
  .roleTitles{
    flex-shrink: 0;
    padding-right: 15px;
    width: 30%;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
  }
  .centerTitles{
    width: 30%;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
  }
  .thridTitles{
    width: 40%;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
  }
  .centerTitles,.thridTitles{
    padding: 0 15px;
  }
  .single_roleTitle,.center_roleTitle,.last_roleTitle{
    cursor: pointer;
    padding: 15px 10px;
    color: #333;
  }
  .last_roleTitle{
    cursor: pointer;
  }
  .checkFirst{
    background: #5f4b8b;
    color: #fff;
  }
  .headerContainer{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .headerTitle{
    font-size: 22px;
    color: #333;
    font-weight: bold;
  }
  .alreadyContainer{
    display: flex;
    align-items: center;
  }
  .alreadySelect{
    font-size: 14px;
    color: #333;
  }
  .checkRoleBtn{
    margin-left: 20px;
    border:none;
    outline: none;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 3px;
    background: #409eff;
    color: #fff;
  }
  .checkThird{
    color: #5f4b8b;
  }
</style>
