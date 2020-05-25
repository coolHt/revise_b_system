<template>
  <div class="brokerForm" >
    <div class="formContainer">
      <!---->
      <transition name="loadShadow">
        <div class="loadShadow" v-show="loadMember">
          <i class="loadgif"></i>
        </div>
      </transition>
      <i class="closeOrganization" @click="closeSelect"></i>
      <div class="editOrganization">
        <div class="draft-job">
          <h5>经济人推广码</h5>
        </div>
        <div class="newBroker">
          <div class="promoCodesContainer" > 
            <div class="promoPart" style="margin-bottom:20px;">
              <p class="promoType">企业推广码</p>
              <div class="promoCodes" v-show="Elist.length > 0">
                <div class="code_item" v-for="(code, i) in Elist" v-bind:key="i">
                  <div v-if="code">
                    <img :src="code.imgurl" alt="">
                    <p class="code_title">{{code.detail.entName ? code.detail.entName : "名字丢失"}}</p>
                  
                    <div class="confirmDeleteBtn">
                      <el-popconfirm
                      @onConfirm="deletePromoCode"
                      confirmButtonText='确定'
                      cancelButtonText='取消'
                      title="确认是否删除推广码"
                      :hideIcon="true"
                    >
                      <span class="deleteCodeStyle" slot="reference" @click="getCodeLinkid(code.codeid, i, 'E')">删除</span>
                    </el-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="promoPart">
              <p class="promoType">职位推广码</p>
              <div class="promoCodes">
                <div class="code_item" v-for="(code, i) in Jlist" v-bind:key="i">
                  <div v-if="code">
                    <img :src="code.imgurl" alt="">
                    <p class="code_title">{{code.detail.entJobName ? code.detail.entJobName : "名字丢失"}}</p>
                    
                    <div class="confirmDeleteBtn">
                      <el-popconfirm
                      @onConfirm="deletePromoCode"
                      confirmButtonText='确定'
                      cancelButtonText='取消'
                      title="确认是否删除推广码"
                      :hideIcon="true"
                    >
                      <span class="deleteCodeStyle" slot="reference" @click="getCodeLinkid(code.codeid, i, 'J')">删除</span>
                    </el-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--删除确认-->
  </div>
</template>
<script>
  import xz from "../../common";
  export default {
    props: {
      "userid": {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        //遮罩层
        loadMember: true,
        //用户id
        user_id: "",
        //职位推广码
        Jlist: [],
        //企业推广码
        Elist: [],
        //要删除的linkid
        deleteId: "",
        deleteType: "",
        deleteIndex: ""
      }
    },
    mounted(){
      
    },
    watch: {
      "userid": {
        handler: function(){
          if(this.userid){
            this.user_id = this.userid;
            this.searchCodes();
          }
        },
        immediate:true
      }
    },
    methods: {
      //搜索经济人推广码
      searchCodes(){
        xz.brokerCode(this.user_id).then( list => {
          this.loadMember = false;
          if(list && Array.isArray(list)){
            let jobs = [];
            let jobInfos = [];
            let ents = [];
            let entInfos = [];
            list.forEach( l => {
              if(l.linktype == 'J') jobs.push(l);
              if(l.linktype == 'E') ents.push(l);
            })
            //获取所有的企业详情
            ents.forEach(e => {
              let getEntInfo = xz.getCompanyInformation(e.linkid);
              entInfos.push(getEntInfo);
            })
            Promise.all(entInfos).then( infos => {
              infos.forEach( (info, index) => {
                ents[index].detail = info ? info : {};
              })
              this.Elist = ents;
              console.log(this.Elist);
            })
            //获取所有职位的详情
            jobs.forEach(e => {
              let getJobInfo = xz.pubidGetJobInfo(e.linkid);
              jobInfos.push(getJobInfo);
            })
            Promise.all(jobInfos).then( infos => {
              infos.forEach((info, index) => {
                jobs[index].detail = info ? info[0].JobInf : {};
              })
              this.Jlist = jobs;
              console.log(this.Jlist);
            })
          }
        });
      },
      
      //点击关闭
      closeSelect() {
        this.$emit("closePromo");
      },
      //设置推广企业
      deletePromoCode(){
        xz.deletePromoCode(this.deleteId).then(res => {
          if(res){
            let arr = this.deleteType == "J" ? this.Jlist : this.Elist;
            let newArr = [];
            arr.forEach( (a, i) => {
              if(i != this.deleteIndex){
                newArr.push(a);
              }
            })
            this.deleteType == "J" ? this.Jlist = newArr : this.Elist = newArr;
            
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          }else{
            this.$message.error('删除失败，请稍后重试');
          }
        });
      },
      //获取要删除的
      getCodeLinkid(id, i, type){
        this.deleteId = id;
        this.deleteIndex = i;
        this.deleteType = type;
      }
    }
  }
</script>
<style scoped>
  .formContainer {
    position: relative;
    width: 1000px;
    box-sizing: border-box;
    padding: 50px 20px 30px 20px;
    background: #fff;
    max-height: 90vh;
    overflow-y: auto; 
    margin: 5vh auto 0 auto;
  }
  .brokerForm {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
  .editOrganization{
    width: 710px;
    margin: 0 auto;
  }
  .newBroker{
    width: 100%;
    margin-top: 30px;
  }
  .promoType{
    font-size: 15px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }
  .promoCodes{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }
  .code_item{
    width:22%;
    display: block;
    margin-right:4%;
    margin-bottom: 10px;
  }
  .code_item:nth-child(4n+4){
    margin-right: 0
  }
  .code_item img{
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 10px;
  }
  .code_title{
    font-size: 14px;
    line-height: 22px;
    height: 44px;
    color: #333;
    text-align: center;
  }
  .deleteCodeStyle{
    display: inline-block;
    color: #5b9bd1;
    cursor: pointer;
    margin-top: 5px;
  }
  .deleteCodeStyle:hover{
    text-decoration: underline;
  }
  .confirmDeleteBtn{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
<style>
.el-popconfirm__main{
  padding: 15px 0;
}
</style>