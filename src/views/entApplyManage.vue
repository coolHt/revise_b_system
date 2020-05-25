<template>
  <div>
    <div class="workPoolItem" v-if="companyValidate">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="企业申请" name="pushList"></el-tab-pane>
        <el-tab-pane label="申请历史" name="pushHistory"></el-tab-pane>
      </el-tabs>
        <!--切换-->
        <!--申请管理-->
        <div>
          <div class="companyList">
            <transition name="loadShadow">
              <div class="loadShadow" v-show="shadowShow">
                <i class="loadgif"></i>
              </div>
            </transition>
            <table class="formLoop">
              <thead>
                <tr>
                  <th style="width: 8%">企业名称</th>
                  <th style="width: 8%">营业执照</th>
                  <th style="width: 5%">联系人</th>
                  <th style="width: 5%">联系电话</th>
                  <th style="width: 6%">邮箱</th>
                  <th style="width: 6%">申请时间</th>
                  <th style="width: 12%">操作</th>
                </tr>
              </thead>
              <tbody v-if="applyList.length > 0">
                <tr v-for="(item,index) in applyList" :key="index">
                  <td>
                    <span style="font-weight:bold;color:#5b9bd1" class="user-name">{{item.entname}}</span>
                  </td>

                  <td>
                    <span style="font-weight:bold">{{item.certid}}</span>
                  </td>
                  <td style="font-weight:bold">{{item.conname}}</td>
                  <td>
                    <span style="font-weight:bold">{{item.contel}}</span>
                  </td>
                  <td style="font-weight:bold">{{item.entemail}}</td>
                  <td>
                    <span>{{item.senddate | formatDate('.')}}</span>
                  </td>
                  <td>
                    <span style="background:#67c23a !important;" class="resolveBtn">
                      <a @click="beforeSend(item)">通过</a>
                    </span>

                    <span class="rejectBtn">
                      <a @click="beforeClose(item)">拒绝</a>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="talentsNum > 0">
              <el-pagination :page-size="countnum" :pager-count="5" layout="prev, pager, next" :total="talentsNum"
                @current-change="searchApply" @prev-click="searchApply" @next-click="searchApply"></el-pagination>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
  import xz from '../common';
  export default {
    components: {},
    data: function () {
      return {
        shadowShow: false,
        talentsNum: 0,
        countnum: 10,
        currentPage: 1,
        applyList: [],
        companyValidate: false
      };
    },
    created() {
      this.applyLists();
      // 企业审核账号权限
      if (Cookies.get("userid-b") === "b0aed0ca-7a74-4c7c-89b9-688441893b05") {
        this.companyValidate = true;
      }
    },
    watch: {},
    methods: {
      applyLists() {
        xz.entApplyList().then(msg => {
          if (msg) {
            console.log(msg);
            this.talentsNum = msg.totalnum;
            this.applyList = msg.list;
          }
        });
      },
      searchApply() {

      },
      // 通过企业审核
      beforeSend(item) {
        console.log(item.entid);
        xz.validateCompany(item.entid, "D");
      },
      // 拒绝企业审核
      beforeClose(item) {
        console.log(item);
        xz.validateCompany(item.entid, "N");
      }
    }
  };
</script>
<style scoped>
  .el-dialog {
    border-radius: 6px;
  }

  .btn-def {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
    background-color: #fff;
  }

  .btn-def:hover {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
    background-color: #fff;
  }

  .btn-sub {
    border: 1px solid #32c5d2;
    border-radius: 4px;
    color: #32c5d2;
    background-color: #fff;
  }

  .btn-sub:hover {
    border-color: #32c5d2;
    color: #fff;
    background-color: #32c5d2;
  }


  .el-button a {
    color: #606266;
  }

  .search-item {
    position: relative;
  }

  .search-item .closeBtn {
    position: absolute;
    right: 20px;
    top: 14px;
    font-size: 24px;
    cursor: pointer;
  }

  .search-item .closeBtn:hover {
    color: #409eff;
  }

  .search-item .el-form-item {
    display: inline-block;
    width: 30%;
    margin: 10px;
  }

  .search-item .search-input {
    width: 75%;
  }

  .filterApply {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .selecteArea {
    margin-left: 25px;
  }
</style>