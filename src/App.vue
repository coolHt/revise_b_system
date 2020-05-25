<template>
  <div id="app">
    <!-- <headerItem></headerItem> -->
    <div v-show="login !== null">
      <loginItem v-if="!login"></loginItem>
      <headerItem v-else></headerItem>
    </div>
    <div v-show="login === null" class="loadFullScreen">
      <img src="./assets/images/loadgif.gif" alt="">
    </div>
  </div>
</template>

<script>
  import xz from "./common";
  import headerItem from "./views/headerItem";
  import loginItem from "./views/loginItem";
  export default {
    name: "app",
    components: {
      headerItem,
      loginItem
    },
    data() {
      return {
        userid: "",
        entid: ""
      };
    },
    computed: {
      login() {
        return this.$store.getters.getLogin;
      }
    },
    created() {
      this.userid = Cookies.get("userid-b");
      this.entid = Cookies.get("entid-b");
      if (this.userid && this.entid) { //如果本地有存个人id信息
        xz.accountInformation().then( res => {
          this.$store.commit("setAdminName", res.StrUserName);
        })
        xz.getMemberPurview(this.userid).then( res => {
          this.$store.commit("admissonList", res); //设置权限
          this.$store.commit("setLogin", true);
        })
      }else{
       this.$store.commit("setLogin", false);
      }
    }
  };
</script>
<style scoped>
.loadFullScreen{
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  display:flex;
  align-items: center;
}
.loadFullScreen img{
  display:block;
  width:40px;
  height:40px;
  margin:0 auto;
}
</style>