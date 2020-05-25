<template>
  <div class="xz_resume">
    <transition name="loadShadow">
      <div class="loadingResume loadShadow" v-show="show_resume">
        <img src="../../assets/images/bean.gif" alt="" class="loadingResume_img">
      </div>
    </transition>
    
    <span class="xz_close_resume" @click="closeResume"></span>
    <div class="xz_resume_container">
      <!--接收必填资料-->
      <!-- <wxReusme class="fixWX" :baseResume="baseResume"></wxReusme> -->
      <div class="xz_resume_part_container">
        <el-tabs v-model="activeName" class="resumeNav">
          <el-tab-pane label="已报名" name="detail"></el-tab-pane>
          <el-tab-pane label="已通过" name="enrolment"></el-tab-pane>
          <el-tab-pane label="已拒绝" name="interview"></el-tab-pane>
        </el-tabs>
        <div class="resumeInformationParts">
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import xz from "../../common";
import wxReusme from './wx_resume';
export default {
  props: {
    "resume": {
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  components: {
    wxReusme,
    ResumeDetail
  },
  data(){
    return {
      activeName: 'detail',
      baseResume: null,
      show_resume: true
    }
  },
  methods:{
    closeResume(){ //关闭
      this.$emit("closeResume");
    },
  },
  watch: {
    "resume": {
      handler: function(){
        
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
  .loadingResume_img{
    width: 200px;
    height:200px;
    display: block;
    margin: 0 auto;
  }
</style>