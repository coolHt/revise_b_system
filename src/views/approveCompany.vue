<template>
  <div class="workPoolItem">
    <div class="row">
      <div class="workPoolItem">
        <div class="am-u-md-12 am-u-sm-12 row-mb">
          <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="认证申请" name="approve"></el-tab-pane>
              <el-tab-pane label="认证完成" name="history"></el-tab-pane>
            </el-tabs>
            <div class="companyList" v-show="activeName=='approve'">
              <table class=" approveTable">
                <thead>
                  <tr>
                    <th style="width:23%;text-align:left;">公司名称</th>
                    <th style="width:15%;">开户行名称</th>
                    <th style="width:25%;">营业执照号</th>
                    <th>营业执照</th>
                    <th style="width:18%;">操作</th>
                    <th>申请时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in identifyList" :key="index">
                    <td style="text-align:left;">{{item.StrEntName}}</td>
                    <td>{{item.StrBankaddr}}</td>
                    <td>{{item.StrCertNo}}</td>
                    <td>
                      <span :imgUrl="item.licensePic" class="lookLicense" @click="searchApproveInfo(item)">查看</span>
                    </td>
                    <td>
                      <button class="approveBtn" @click="approveIdentify(item.GdEntId)">通过</button>
                      <button class="refuseBtn" @click="approveRefuse(item.GdEntId)">拒绝</button>
                    </td>
                    <td>{{item.DtInsertDate}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="companyList" v-show="activeName=='history'">
              <table class=" approveTable">
                <thead>
                  <tr>
                    <th style="width:23%;text-align:left;">公司名称</th>
                    <th style="width:15%;">开户行名称</th>
                    <th style="width:25%;">营业执照号</th>
                    <th>营业执照</th>
                    <th>申请时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in identifyHistory" :key="index">
                    <td style="text-align:left;">{{item.StrEntName}}</td>
                    <td>{{item.StrBankaddr}}</td>
                    <td>{{item.StrCertNo}}</td>
                    <td>
                      <span :imgUrl="item.licensePic" class="lookLicense" @click="searchApproveInfo(item)">查看</span>
                    </td>
                    <td>{{item.DtCheckDate}}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="totalNum > 0">
              <el-pagination :page-size="pagecount" :current-page="currentPage" :pager-count="5" layout="prev, pager, next" :total="totalNum" @current-change="changePage" @prev-click="changePage"
                @next-click="changePage">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="approveInfo" width="700px" class="approveInfo">
      <div class="approveField">
        <span class="fieldName">企业名称:</span>
        <span>{{searchApprove.StrEntName}}</span>
      </div>
      <div class="approveField">
        <span class="fieldName">营业执照号:</span>
        <span>{{searchApprove.StrCertNo}}</span>
      </div>
      <div class="approveField">
        <span class="fieldName">开户名称:</span>
        <span>{{searchApprove.StrBankname}}</span>
      </div>
      <div class="approveField">
        <span class="fieldName">开户行:</span>
        <span>{{searchApprove.StrBankaddr}}</span>
      </div>
      <div class="approveField">
        <span class="fieldName">对公账号:</span>
        <span>{{searchApprove.StrAccount1}}</span>
      </div>
      <div class="approveField">
        <span class="fieldName">营业执照:</span>
        <img :src="searchApprove.StrImgPath1" alt="" style="width:500px;height:auto;display:block;margin:20px auto;">
      </div>
      <div class="approveField">
        <span class="fieldName">认证申请公函:</span>
        <img :src="searchApprove.StrImgPath2" alt="" style="width:500px;height:auto;display:block;margin:20px auto;">
      </div>
      <div style="text-align:center;" v-if="activeName == 'approve'">
        <button class="approveBtnBig" @click="approveIdentify(searchApprove.GdEntId)">通过</button>
        <button class="refuseBtnBig" @clikc="approveRefuse(searchApprove.GdEntId)">拒绝</button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="reVerity" width="300px">
      <p style="text-align:center;">确认通过认证?</p>
      <div style="text-align:center;">
        <button class="approveBtnBig" @click="approveType('D')">确认</button>
        <button class="refuseBtnBig" @click="reVerity=false">取消</button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="reRefuse" width="300px">
      <p style="text-align:center;">确认拒绝?</p>
      <div style="text-align:center;">
        <button class="approveBtnBig" @click="approveType('N')">确认</button>
        <button class="refuseBtnBig" @click="reRefuse=false">取消</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        activeName: 'approve',
        entApprove: "", //认证的企业id
        approveInfo: false,
        searchApprove: {},
        reVerity: false,
        reRefuse: false,
        //分页
        currentPage: 1, //当前页码
        pagecount: 10, //每页数量,
        type:0, //请求类型

      };
    },
    created() {
      //获取所有企业列表
      let data = {
        type: this.type,
        countNum: this.pagecount,
        currpage: this.currentPage,
      }
      this.$store.commit("getIndentifyList", data);
    },
    computed: {
      identifyList: function () {
        let list = this.$store.state.IDENTIFY.identifyList;
        list.forEach( (item) => {
          if(item.DtInsertDate){
            item.DtInsertDate = new Date(item.DtInsertDate).getFullYear() + '-' + new Date(item.DtInsertDate).getMonth() + '-' + new Date(item.DtInsertDate).getDate();
          }else{
            item.DtInsertDate = '老数据';
          }
        } )
        return list;
      },
      identifyHistory: function () {
        let list = this.$store.state.IDENTIFY.identifyHistory;
        list.forEach( (item) => {
          if(item.DtCheckDate){
            item.DtCheckDate = new Date(item.DtCheckDate).getFullYear() + '-' + new Date(item.DtCheckDate).getMonth() + '-' + new Date(item.DtCheckDate).getDate();
          }else{
            item.DtCheckDate = '老数据';
          }
        } )
        return list;
      },
      totalNum: function () {
        return this.$store.state.IDENTIFY.listNum;
      }
    },
    methods: {
      //分页
      changePage(page) {
        this.currentPage = page;
        let data = {
          type: this.type,
          countNum: this.pagecount,
          currpage: this.currentPage
        }
        this.$store.commit("getIndentifyList", data);
      },
      handleClick(tab) {
        this.currentPage = 1;
        if (tab.name == 'approve') {
          this.type = 0;
          let data = {
            type: this.type,
            countNum: this.pagecount,
            currpage: this.currentPage
          }
          this.$store.commit("getIndentifyList", data);
        } else if (tab.name == 'history') {
          this.type = 1;
          let data = {
            type: this.type,
            countNum: this.pagecount,
            currpage: this.currentPage
          }
          this.$store.commit("getIndentifyList", data);
        }
      },
      //查看认证信息
      searchApproveInfo(item) {
        this.approveInfo = true;
        this.searchApprove = item;
      },
      //认证确认
      approveIdentify(entid) {
        this.reVerity = true;
        this.entApprove = entid;

      },
      //拒绝确认
      approveRefuse(entid) {
        this.reRefuse = true;
        this.entApprove = entid;
      },
      //通过申请
      approveType(type) {
        this.reVerity = false;
        this.reRefuse = false;
        let _this = this;

        let pros = {
          entid: this.entApprove,
          type: type,
          countNum: this.pagecount,
          currpage: this.currentPage

        };
        this.$store.dispatch("approveType", pros);
      }
    }
  };
</script>
<style scoped>
</style>