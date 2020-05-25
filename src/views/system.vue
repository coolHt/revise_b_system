<template>
  <div class="workPoolItem">
    <div v-if="purviewShow">
      <el-tabs>
        <el-tab-pane label="缓存与配置"></el-tab-pane>
      </el-tabs>
      <div class="system_setting">
        <div class="system_field">
          <p>刷新地图坐标点</p>
          <button type="button" @click="refreshMap">刷新</button>
        </div>
        <div class="system_field">
          <p>初始化已发布职位缓存</p>
          <button type="button" @click="clearJobCache">刷新</button>
        </div>
        <div class="system_field">
          <p>重置用户下级列表</p>
          <button type="button" @click="refreshInferior">刷新</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import xz from "../common";
  export default {
    data: function () {
      return {
        purviewShow: false
      };
    },
    created() {
      if(Cookies.get("userid-b") == "04F97C95-DF0F-4E4F-90DB-234E969EB323"){
        this.purviewShow = true;
      }
    },
    computed: {
      
    },
    methods: {
      // 刷新地图点
      refreshMap(){
        xz.refreshPoints();
      },
      // 清除发布职位的缓存
      clearJobCache(){
        xz.clearJobCache();
      },
      // 重置用户下级列表
      refreshInferior(){
        xz.refreshInferior();
      }
    }
  };
</script>
<style scoped>
.system_field{
  display: flex;
  width: 100%;
  margin: 0 auto 20px auto;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
.system_field:last-child{
  border:none;
}
.system_field p{
  font-size: 14px;
  color: #333;
  width: 30%;
}
.system_field button{
  border: 1px solid #409eff;
  border-radius: 3px;
  color: #fff;
  background: #409eff;
  padding: 8px 16px;
  cursor: pointer;
  outline: none;
}
</style>