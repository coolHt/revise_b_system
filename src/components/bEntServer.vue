<template>
  <div class="myWorkItem">
    <div class="row">
      <div class="am-u-md-12 am-u-sm-12 row-mb">
        <div>
          <span>{{jobInfo.entName}}招聘</span>
          <br>
          <span class="name">{{jobInfo.entJobName}}</span>
          <br>
          <p>
            <span class="pay">{{jobInfo.entJobPay}}</span>
            | {{location}} | {{jobInfo.entJobWorkTime}} | {{jobInfo.entJobEdu}}
          </p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="am-u-md-12 am-u-sm-12 row-mb">
        <div >
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="1">尚未判断</el-menu-item>
            <el-menu-item index="2">已经推荐</el-menu-item>
            <el-menu-item index="3">企业喜欢</el-menu-item>
            <el-menu-item index="4">企业淘汰</el-menu-item>
          </el-menu>
          <br>
          <div class="tpl-scrollable">
            <table>
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>联系方式</th>
                  <th>毕业院校</th>
                  <th>当前职位</th>
                  <th>当前公司</th>
                  <th>当前年薪</th>
                  <th v-if="activeIndex=='1'">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in myOrderList" :key="index">
                  <td>
                    <a class="user-name" @click="funShowPsnDetail(item.orderid)">{{item.psnName}}</a>
                    <span class="label label-sm label-danger" v-if="item.status!='1'">待激活</span>
                  </td>
                  <td>
                    <a
                      class="user-name"
                      @click="funShowBusinessCard(item.orderid)"
                      :title="item.tel"
                    >查看名片</a>
                  </td>
                  <td>{{item.psnSchool}}</td>
                  <td>{{item.psnNowJob}}</td>
                  <td>
                    <p class="psn-now-company">{{item.psnNowCompany}}</p>
                  </td>
                  <td class="font-green">{{item.psnNowPay}}</td>
                  <td v-if="activeIndex=='1'">
                    <span class="label label-sm label-success">
                      <a @click="beforeSend(item.orderid)">通过</a>
                    </span>
                    <span class="label label-sm label-danger">
                      <a @click="beforeClose(item.orderid)">拒绝</a>
                    </span>
                    <span class="label label-sm label-warning">
                      <a @click="beforeSendCon(item.orderid)">联系记录</a>
                    </span>
                    <span class="label label-sm label-success">
                      <a @click="beforeSendMore(item.orderid,item.joblist)">推送</a>
                    </span>
                    <span class="label label-sm label-success">
                      <a>在线沟通</a>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!--个人简历详情dialog-->
      <el-dialog :visible.sync="showPsnDetail" width="60%">
        <psnInfoItem :sendpsnid="sendpsnid"></psnInfoItem>
      </el-dialog>
      <!--个人名片dialog-->
      <el-dialog :visible.sync="showBusinessCard" width="40%">
        <businessCardItem :sendpsnid="sendpsnid"></businessCardItem>
      </el-dialog>
      <!--职位详情dialog-->
      <el-dialog :visible.sync="showJobDetail" width="1100px">
        <jobInfoItem :sendjobid="sendjobid"></jobInfoItem>
      </el-dialog>
      <!--发送到企业dialog-->
      <el-dialog title="评价" :visible.sync="rateDialogVisible" width="30%">
        <el-form>
          <!-- <el-form-item>
            <label>打分：</label>
            <el-rate v-model="rateMsg.rate"></el-rate>
          </el-form-item>-->
          <el-form-item label="简评：">
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="rateMsg.content"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rateDialogVisible = false" class="btn-def">取消</el-button>
          <el-button @click="funSend" class="btn-sub">确定</el-button>
        </span>
      </el-dialog>
      <!--拒绝此人dialog-->
      <el-dialog title="备注" :visible.sync="closeDialogVisible" width="30%">
        <el-form>
          <el-form-item label="拒绝理由：">
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="closeMsg.content"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialogVisible = false" class="btn-def">取消</el-button>
          <el-button @click="funClose" class="btn-sub">确定</el-button>
        </span>
      </el-dialog>

      <!--发送到多个职位企业dialog-->
      <el-dialog title="推送" :visible.sync="sendMoreDialogVisible" width="40%">
        <el-form>
          <el-form-item>
            <label>搜索：</label>
            <el-input v-model="jobName" placeholder="请输入内容"></el-input>
            <el-button type="small" class="btn-small">搜索</el-button>
          </el-form-item>
          <el-form-item label="选择：" style="max-height:350px;overflow-y:auto">
            <table>
              <thead>
                <tr >
                  <th>职位名称</th>
                  <th>公司名称</th>
                  <th>推送状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in entList" :key="index">
                  <td>
                    <input
                      type="checkbox"
                      v-model="item.checked"
                      v-if="item.IsApply!='1'"
                      @change="handleSelectionChange(item.jobid)"
                    >
                  </td>
                  <td>
                    <a class="user-name" @click="funShowJobDetail(item.jobid)">{{item.jobname}}</a>
                  </td>
                  <td>{{item.compname}}</td>
                  <td v-if="item.IsApply=='1'">
                    <span class="label label-sm label-success">已推送</span>
                  </td>
                  <td v-else>
                    <span class="label label-sm label-danger">未推送</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="sendMoreDialogVisible = false" class="btn-def">取消</el-button>
          <el-button @click="funSendMore" class="btn-sub">确定</el-button>
        </span>
      </el-dialog>
      <!--联系记录dialog-->
      <el-dialog title="联系记录" :visible.sync="conDialogVisible" width="40%">
        <el-form>
          <el-form-item>
            <label>沟通状态</label>
            <br>
            <el-radio-group v-model="content.status" size="small">
              <el-radio-button label="沟通中"></el-radio-button>
              <el-radio-button label="已拒绝"></el-radio-button>
              <el-radio-button label="无法联系"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <label>备注：</label>
            <el-input
              v-model="content.con"
              type="textarea"
              :autosize="{minRows:'4'}"
              placeholder="请输入内容"
            ></el-input>
            <button @click="funAddCon" type="small" class="btn-small">提交</button>
          </el-form-item>
          <el-form-item>
            <el-table :data="conInfo.conList" style="width: 100%;" max-height="350">
              <el-table-column prop="date" label="日期" width="200"></el-table-column>
              <el-table-column prop="con" label="记录" width="200"></el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="conDialogVisible = false" class="btn-def">取消</el-button>
          <el-button @click="funSendCon" class="btn-sub">确定</el-button>
        </span>
      </el-dialog>

      <!--操作dialog-->
      <el-dialog title="操作" :visible.sync="btnDialogVisible" width="30%">
        <el-form>
          <el-form-item>
            <label>选择：</label>
            <!-- <el-input v-model="con" placeholder="请输入内容"></el-input> -->
            <el-button @click="btnDialogVisible = false" class="btn-def">
              <router-link to="/entry">简历录入</router-link>
            </el-button>
            <!-- <el-button @click="btnDialogVisible = false" class="btn-def">已入职</el-button>
            <el-button @click="btnDialogVisible = false" class="btn-def">面试中</el-button>
            <el-button @click="btnDialogVisible = false" class="btn-def">沟通中</el-button>-->
            <el-button @click="btnDialogVisible = false" class="btn-def">关闭此单</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="btnDialogVisible = false" class="btn-def">取消</el-button>
          <el-button @click="btnDialogVisible = false" class="btn-sub">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import psnInfoItem from "./PsnInfo";
import jobInfoItem from "./JobDetail";
import businessCardItem from "./bBusinessCard";
import Cookies from "vue-cookies";
// import { types } from "util";
export default {
  components: {
    businessCardItem,
    psnInfoItem,
    jobInfoItem
  },
  data: function() {
    return {
      activeIndex: "1",
      location: "上海",
      jobInfo: {
        jobid: "",
        entJobName: "品控工程师",
        entName: "东力控股集团有限公司",
        entJobPay: "22-28W",
        entJobWorkTime: "8-9年",
        entJobEdu: "本科"
      },
      myOrderList: [
        {
          orderid: "1",
          psnName: "Alex",
          psnNowJob: "品控工程师",
          psnNowCompany: "东力控股集团有限公司",
          psnSendJob: "质量工程师",
          jobid: "1",
          psnSchool: "宁波大学",
          psnNowPay: "10-15W",
          tel: "13711111111",
          status: "2",
          joblist: [
            {
              jobid: "send-more-job-jobid-1",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-2",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "1"
            },
            {
              jobid: "send-more-job-jobid-3",
              entName: "宁波金田铜业(集团)股份有限公司",
              entJobName: "锻造工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-4",
              entName: "东力控股集团有限公司",
              entJobName: "质量工程师",
              sendStatus: "1"
            }
          ]
        },
        {
          orderid: "2",
          psnName: "Tinker404",
          psnNowJob: "品控工程师",
          psnNowCompany: "东力控股集团有限公司",
          psnSendJob: "品控工程师",
          jobid: "2",
          psnSchool: "中国计量大学",
          psnNowPay: "10-15W",
          tel: "13821314511",
          status: "1",
          joblist: [
            {
              jobid: "send-more-job-jobid-1",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-2",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "1"
            },
            {
              jobid: "send-more-job-jobid-3",
              entName: "宁波金田铜业(集团)股份有限公司",
              entJobName: "锻造工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-4",
              entName: "东力控股集团有限公司",
              entJobName: "质量工程师",
              sendStatus: "1"
            }
          ]
        },
        {
          orderid: "3",
          psnName: "Arron.y",
          psnNowJob: "品控工程师",
          psnNowCompany: "东力控股集团有限公司",
          psnSendJob: "质量工程师",
          jobid: "3",
          psnSchool: "浙江大学",
          psnNowPay: "10-15W",
          tel: "18523411111",
          status: "2",
          joblist: [
            {
              jobid: "send-more-job-jobid-1",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-2",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "1"
            },
            {
              jobid: "send-more-job-jobid-3",
              entName: "宁波金田铜业(集团)股份有限公司",
              entJobName: "锻造工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-4",
              entName: "东力控股集团有限公司",
              entJobName: "质量工程师",
              sendStatus: "1"
            }
          ]
        },
        {
          orderid: "4",
          psnName: "Arron.y",
          psnNowJob: "锻造工程师",
          psnNowCompany: "宁波金田铜业(集团)股份有限公司",
          psnSendJob: "品控工程师",
          jobid: "3",
          psnSchool: "江南大学",
          psnNowPay: "10-15W",
          tel: "18523411111",
          status: "1",
          joblist: [
            {
              jobid: "send-more-job-jobid-1",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-2",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "1"
            },
            {
              jobid: "send-more-job-jobid-3",
              entName: "宁波金田铜业(集团)股份有限公司",
              entJobName: "锻造工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-4",
              entName: "东力控股集团有限公司",
              entJobName: "质量工程师",
              sendStatus: "1"
            }
          ]
        },
        {
          orderid: "5",
          psnName: "Arron.y",
          psnNowJob: "锻造工程师",
          psnNowCompany: "宁波金田铜业(集团)股份有限公司",
          psnSendJob: "锻造工程师",
          jobid: "4",
          psnSchool: "宁波工程学院",
          psnNowPay: "10-15W",
          tel: "18523411111",
          status: "2",
          joblist: [
            {
              jobid: "send-more-job-jobid-1",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-2",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "1"
            },
            {
              jobid: "send-more-job-jobid-3",
              entName: "宁波金田铜业(集团)股份有限公司",
              entJobName: "锻造工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-4",
              entName: "东力控股集团有限公司",
              entJobName: "质量工程师",
              sendStatus: "1"
            }
          ]
        },
        {
          orderid: "6",
          psnName: "Arron.y",
          psnNowJob: "质量工程师",
          psnNowCompany: "宁波均胜电子股份有限公司",
          psnSendJob: "质量安全工程师",
          jobid: "41",
          psnSchool: "淮阴工学院",
          psnNowPay: "10-15W",
          tel: "18523411111",
          status: "1",
          joblist: [
            {
              jobid: "send-more-job-jobid-1",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-2",
              entName: "宁波均胜电子股份有限公司",
              entJobName: "品控工程师",

              sendStatus: "1"
            },
            {
              jobid: "send-more-job-jobid-3",
              entName: "宁波金田铜业(集团)股份有限公司",
              entJobName: "锻造工程师",

              sendStatus: "2"
            },
            {
              jobid: "send-more-job-jobid-4",
              entName: "东力控股集团有限公司",
              entJobName: "质量工程师",
              sendStatus: "1"
            }
          ]
        }
      ],
      sendpsnid: "",
      sendjobid: "",
      showBusinessCard: false,
      showPsnDetail: false,
      showJobDetail: false,
      closeDialogVisible: false,
      rateDialogVisible: false,
      sendMoreDialogVisible: false,
      conDialogVisible: false,
      btnDialogVisible: false,
      //评价
      rateMsg: {
        orderid: "",
        rate: 3,
        content: ""
      },
      //拒绝某人理由
      closeMsg: {
        orderid: "",
        content: ""
      },
      sendPsnToMore: {
        orderid: "",
        joblist: []
      },
      jobName: "",
      entList: [],

      content: {
        con: "",
        status: "",
        date: ""
      },
      conInfo: {
        conOrderId: "",
        conList: [
          {
            con:
              "测试文本TestContent测试文本TestContent测试文本TestContent测试文本TestContent",
            date: ""
          },
          {
            con: "测试文本TestContent",
            date: ""
          },
          {
            con: "测试文本TestContent",
            date: ""
          }
        ]
      }
    };
  },
  watch: {
    activeIndex: function(n, o) {
      this.userid = Cookies.get("userid-b");
      this.userid = Cookies.get("entid-b");
      this.jobInfo.jobid = this.$route.query.jobid;
      var type = "";
      if (n == "1") {
        type = "entBeforeSend";
      } else if (n == "2") {
        type = "entAfterSend";
      } else if (n == "3") {
        type = "entLike";
      } else if (n == "4") {
        type = "entDislike";
      }
      var self = this;
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          action: "edit",
          userid: self.userid,
          entid: self.userid,
          jobid: self.jobInfo.jobid,
          pagename: "bOrderListPage",
          msg: type
        },
        dataType: "json",
        success: function(res) {
          var jsonRes = JSON.parse(res);
          if (jsonRes.status == "ok") {
            self.myOrderList = jsonRes.msg.myOrderList;
          }
        }
      });
    }
  },
  created() {
    this.userid = Cookies.get("userid-b");
    this.userid = Cookies.get("entid-b");
    this.jobInfo.jobid = this.$route.query.jobid;
    //获取某个职位的待审核人的信息以及这个职位的信息
    var self = this;
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        userid: self.userid,
        entid: self.userid,
        jobid: self.jobInfo.jobid,
        pagename: "bOrderListPage",
        msg: "entBeforeSend"
      },
      dataType: "json",
      success: function(res) {
        var jsonRes = JSON.parse(res);
        if (jsonRes.status == "ok") {
          self.myOrderList = jsonRes.msg.myOrderList;
          self.jobInfo = jsonRes.msg.jobInfo;
        }
      }
    });
  },
  methods: {
    /**
     * @param e {string} 个人id
     * 点击查看名片信息
     */
    funShowBusinessCard(e) {
      this.showBusinessCard = !this.showBusinessCard;
      this.sendpsnid = e;
    },
    funShowPsnDetail(e) {
      this.showPsnDetail = !this.showPsnDetail;
      this.sendpsnid = e;
    },
    funShowJobDetail(e) {
      this.showJobDetail = !this.showJobDetail;
      this.sendjobid = e;
    },
    /**
     * 选中的职位
     */

    handleSelectionChange(val) {
      // this.sendPsnToMore.joblist = val;
      if (this.sendPsnToMore.joblist.indexOf(val) >= 0) {
        this.sendPsnToMore.joblist.splice(
          this.sendPsnToMore.joblist.indexOf(val),
          1
        );
      } else {
        this.sendPsnToMore.joblist.push(val);
      }
    },
    /**
     * 推送到企业
     */
    beforeSend(e) {
      this.rateDialogVisible = true;
      this.rateMsg.orderid = e;
      this.rateMsg.content = "";
    },
    funSend() {
      this.rateDialogVisible = false;
      var self = this;
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          action: "save",
          userid: self.userid,
          entid: self.entid,
          pagename: "passToSendEnt",
          msg: JSON.stringify(self.rateMsg)
        },
        dataType: "json",
        success: function(response) {}
      });
    },
    /**
     * 拒绝某人
     */
    beforeClose(e) {
      this.closeDialogVisible = true;
      this.closeMsg.orderid = e;
      this.closeMsg.content = "";
    },
    funClose() {
      this.closeDialogVisible = false;
      var self = this;
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          action: "save",
          userid: self.userid,
          entid: self.entid,
          pagename: "closeSendToEnt",
          msg: JSON.stringify(self.closeMsg)
        },
        dataType: "json",
        success: function(response) {}
      });
    },

    /**
     * 推送到多家企业
     */
    beforeSendMore(e, arr) {
      if (this.sendPsnToMore.orderid == e) {
        this.sendMoreDialogVisible = true;
        return;
      } else {
        this.sendPsnToMore.orderid = e;
        this.sendPsnToMore.joblist = [];
        for (var i in this.entList) {
          this.entList[i].checked = false;
        }
        this.entList = arr;
        this.sendMoreDialogVisible = true;
      }
    },
    funSendMore() {
      this.sendMoreDialogVisible = false;
      var self = this;
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          action: "save",
          userid: self.userid,
          entid: self.entid,
          pagename: "sendToMoreEnt",
          msg: JSON.stringify(self.sendPsnToMore)
        },
        dataType: "json",
        success: function(response) {}
      });
    },

    /**
     * 联系记录
     */
    beforeSendCon(e) {
      this.conDialogVisible = true;
      this.conInfo.orderid = e;
    },
    funSendCon() {
      this.conDialogVisible = false;
    },

    funAddCon() {
      this.content.date = this.funTranDate(Date.now());
      this.conInfo.conList.unshift(this.content);
    },
    funTranDate: function(item, type) {
      let date = new Date(item);
      let Y = date.getFullYear();
      let M =
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1);
      let D = "-" + date.getDate() + " ";
      if (type == "m") {
        return Y + M;
      }
      return Y + M + D;
    },

    handleSelect(key, keyPath) {
      this.activeIndex = key;
    }
  }
};
</script>
<style scoped>
.el-dialog {
  border-radius: 6px;
}
td {
  font-size: 1.3rem;
}
td .psn-now-company {
  max-width: 150px;
}

td span {
  margin-left: 5px;
}

td span a {
  color: #fff;
}

td span a:hover {
  color: #fff;
}
.btn-add {
  border: 1px solid #32c5d2;
  border-radius: 4px;
  color: #fff;
  background-color: #32c5d2;
  padding: 5px;
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
.btn-small {
  padding: 5px 10px;
  border: 1px solid #32c5d2;
  border-radius: 4px;
  color: #32c5d2;
  background-color: #fff;
}
.btn-small:hover {
  border-color: #32c5d2;
  color: #fff;
  background-color: #32c5d2;
}
.el-button a {
  color: #606266;
}
.tpl-content-page-before-title {
  color: #697882;
  font-size: 16px;
  font-weight: 400;
}

.name {
  margin: 15px 0;
  position: relative;
  display: inline-block;
  height: 22px;
  font-size: 22px;
  line-height: 22px;
}

.pay {
  color: #e7505a;
}

.title {
  height: 15px;
  font-size: 15px;
  line-height: 15px;
}
</style>