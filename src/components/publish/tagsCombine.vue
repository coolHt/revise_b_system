<template>
  <div class="tagsContainer">
    <div class="draft-job" style="margin-top:30px;">
      <h5>扩展标签</h5>
    </div>
    <div class="infor_field" style="align-items:unset">
      <label class="field_name">专业证书：</label>
      <div class=" tagContainer">
        <el-tag :key="index" v-for="(tag,index) in entJobOtherTag" closable :disable-transitions="false"
          @close="handleClose(entJobOtherTag,tag,'other')" class="tag">
          {{tag}}
        </el-tag>
        <div style="overflow:hidden;">
          <div class="addBtnBox">
            <el-input class="input-new-tag" v-model="inputNewOtherTag" size="small">
            </el-input>
            <el-button size='small' class="addTag"
              @click='funAddNewTag(entJobOtherTag,inputNewOtherTag,"other")'>
              新增标签</el-button>
          </div>
          <div class="otherBtns tagStyle">
            <el-button v-for='(tag,index) in $store.state.PUBLISH.otherBtn' :key="index"
              @click='funBtnAddTag($event,tag,"other")'>
              {{tag}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="infor_field" style="align-items:unset">
      <label class="field_name">工具工艺：</label>
      <div class=" tagContainer">
        <el-tag :key="index" v-for="(tag,index) in entJobSkillTag" closable :disable-transitions="false"
          @close="handleClose(entJobSkillTag,tag,'skill')" class="tag">
          {{tag}}
        </el-tag>
        <div style="overflow:hidden;">
          <div class="addBtnBox">
            <el-input class="input-new-tag" v-model="inputNewSkillTag" size="small">
            </el-input>
            <el-button size='small' class="addTag"
              @click='funAddNewTag(entJobSkillTag,inputNewSkillTag,"skill")'>
              新增标签</el-button>
          </div>
          <div class="skillBtns tagStyle">
            <el-button v-for='(tag,index) in $store.state.PUBLISH.skillBtn' :key="index"
              @click='funBtnAddTag($event,tag,"skill")'>
              {{tag}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="infor_field" style="align-items:unset">
      <label class="field_name">软件系统：</label>
      <div class=" tagContainer">
        <el-tag :key="tag" v-for="tag in entJobToolTag" closable :disable-transitions="false"
          @close="handleClose(entJobToolTag,tag,'tool')" class="tag">
          {{tag}}
        </el-tag>
        <div style="overflow:hidden;">
          <div class="addBtnBox">
            <el-input class="input-new-tag" v-model="inputNewToolTag" size="small">
            </el-input>
            <el-button size='small' class="addTag" @click='funAddNewTag(entJobToolTag,inputNewToolTag,"tool")'>
              新增标签</el-button>
          </div>
          <div class="toolBtns tagStyle">
            <el-button v-for='(tag,index) in $store.state.PUBLISH.toolBtn' :key="index"
              @click='funBtnAddTag($event,tag,"tool")'>
              {{tag}}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="infor_field" style="align-items:unset">
      <label class="field_name">其它要求：</label>
      <div class="tagContainer">
        <el-tag :key="index" v-for="(tag,index) in entJobKnowTag" closable :disable-transitions="false"
          @close="handleClose(entJobKnowTag,tag,'know')" class="tag">
          {{tag}}
        </el-tag>
        <div style="overflow:hidden;">
          <div class="addBtnBox">
            <el-input class="input-new-tag" v-model="inputNewKnowTag" size="small">
            </el-input>
            <el-button size='small' class="addTag" @click="funAddNewTag(entJobKnowTag,inputNewKnowTag,'know')">
              新增标签</el-button>
          </div>
          <div class="knowBtns tagStyle">
            <el-button v-for='(tag,index) in $store.state.PUBLISH.knowBtn' @click='funBtnAddTag($event,tag,"know")'
              :key="index">
              {{tag}}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      entJobKnowTagList: {
        type: Array,
        default: function(){
          return [];
        }
      },
      entJobSkillTagList: {
        type: Array,
        default: function(){
          return [];
        }
      },
      entJobToolTagList: {
        type: Array,
        default: function(){
          return [];
        }
      },
      entJobOtherTagList: {
        type: Array,
        default: function(){
          return [];
        }
      }
    },
    data(){
      return {
        inputNewKnowTag: "", //新增其他要求
        inputNewToolTag: "", //新增软件系统
        inputNewSkillTag: "", //新增工具工艺
        inputNewOtherTag: "", //新增专业证书
        entJobKnowTag: [],
        entJobSkillTag: [],
        entJobToolTag: [],
        entJobOtherTag: [],
      }
    },
    watch:{
      'entJobKnowTagList': {
        handler: function(){this.entJobKnowTag = this.entJobKnowTagList},
        immediate: true
      },
      'entJobSkillTagList': {
        handler: function(){this.entJobSkillTag = this.entJobSkillTagList},
        immediate: true
      },
      'entJobToolTagList': {
        handler: function(){this.entJobToolTag = this.entJobToolTagList},
        immediate: true
      },
      'entJobOtherTagList': {
        handler: function(){this.entJobOtherTag = this.entJobOtherTagList},
        immediate: true
      },
    },
    methods: {
      funBtnAddTag(ev, e, type) { //添加新标签
        let btn = ev.currentTarget; //获取点击元素
        btn.classList.add("notClick");
        switch (type) {
          case 'know':
            this.funAddNewTag(this.entJobKnowTag, e)
            break
          case 'skill':
            this.funAddNewTag(this.entJobSkillTag, e)
            break
          case 'tool':
            this.funAddNewTag(this.entJobToolTag, e)
            break
          case 'other':
            this.funAddNewTag(this.entJobOtherTag, e)
            break
          default:
            break
        }
      },
      //新增标签
      funAddNewTag: function (item, value, type) {
        var a = 0;
        if (!item) item = [];
        if (value) {
          if (value.trim() == '') return;
          for (var i in item) {
            if (item[i] == value) {
              a++;
            }
          }
          if (!a) {
            item.push(value);
            if (type == 'know') {
              this.inputNewKnowTag = '';
            }
            if (type == 'tool') {
              this.inputNewToolTag = '';
            }
            if (type == 'skill') {
              this.inputNewSkillTag = '';
            }
            if (type == 'other') {
              this.inputNewOtherTag = '';
            }
          } else {
            return
          }
        }
      },
      //关闭标签
      handleClose(arr, item, type) { 
        if (type) {
          if (type == 'other') { //专业证书
            this.$store.state.PUBLISH.otherBtn.forEach(function (v, index) {
              if (v == item) {
                let btns = document.getElementsByClassName("otherBtns")[0].getElementsByTagName("button");
                if (btns[index].classList.contains('notClick')) {
                  btns[index].classList.remove('notClick');
                }
              }
            });
          }
          if (type == 'skill') { //工具工艺
            this.$store.state.PUBLISH.skillBtn.forEach(function (v, index) {
              if (v == item) {
                let btns = document.getElementsByClassName("skillBtns")[0].getElementsByTagName("button");
                if (btns[index].classList.contains('notClick')) {
                  btns[index].classList.remove('notClick');
                }
              }
            });
          }
          if (type == 'tool') { //软件系统
            this.$store.state.PUBLISH.toolBtn.forEach(function (v, index) {
              if (v == item) {
                let btns = document.getElementsByClassName("toolBtns")[0].getElementsByTagName("button");
                if (btns[index].classList.contains('notClick')) {
                  btns[index].classList.remove('notClick');
                }
              }
            });
          }
          if (type == 'know') { //其他要求
            this.$store.state.PUBLISH.knowBtn.forEach(function (v, index) {
              if (v == item) {
                let btns = document.getElementsByClassName("knowBtns")[0].getElementsByTagName("button");
                if (btns[index].classList.contains('notClick')) {
                  btns[index].classList.remove('notClick');
                }
              }
            });
          }
        }
        arr.splice(arr.indexOf(item), 1);
      },
    }
  }
</script>
<style scoped>
.tagsContainer{
  width: 100%;
}
</style>