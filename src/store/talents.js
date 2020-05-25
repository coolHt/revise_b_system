import xz from "../common";
let m_talents = {
  state: {
    jobDetail: {}, //推送的职位详情
    talent: {}, //个人详情
    history: [], //历史推送
    historyNum: 0, //历史推送数量
    //判断人才是否读取完成
    loadTalents: false,
    //查看个人简历时的简历列表
    lookForResume: [],
    allTalents: [], //人才库
    allTalentsNum: 0, //人才库总数
    //获取投递人信息
    loadDeliverLists: false,
    //获取到的投递的人
    deliverLists:[],
    //投递人数量
    deliverNum:0,
  },
  getters: {

  },
  mutations: {
    //获取投递人
    getDeliver(state, data) {
      //初始化
      state.loadDeliverLists = false;
      xz.deliveryList(data.jobid, data.currentpage, data.countNum).then(res => {
          state.loadDeliverLists = true;
        if (res) {
          state.deliverLists = res.msg.userinflst;
          state.deliverNum = res.totalnum;
        } else {
          console.log("获取投递人出错");
        }
      });
    },
    //人才库人才
    allTalents(state, search) {
      //初始化获取数据状态
      state.loadTalents = false;
      xz.getAllTalents(search).then((res) => {
        state.loadTalents = true;
        if(res){
          //只有没有设置拿个人简历时才更新简历列表
          if (!search.singleResume) state.allTalents = res.orderList;
          //查看个人简历时的简历列表
          state.lookForResume = res.orderList;
          //总数
          res.totalCount ? state.allTalentsNum = parseInt(res.totalCount) : state.allTalentsNum = 0;
        }else{
          console.log("获取人才出错");
        }
      });
    },
    //查看职位信息
    jobDetail(state, jobid) {
      xz.getJobInformation(jobid).then((res) => {
        res ? state.jobDetail = res.msg : console.log("获取职位信息出错");
      });
    },
    //获取个人信息 
    //人才库的
    talentInfo(state, data) {
      //type : pool: 公共池个人信息 ， all: 其他地方拿个人信息
      console.log(data.info);
      let {orderid = '', CVID = ''} = data.info;
      xz.userInfo(orderid, CVID).then((res) => {
        res ? state.talent = res : console.log("获取人才信息出错");
      });
    },
    //推送历史
    passHistory(state, pageNum) {
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          action: "edit",
          userid: Cookies.get("userid-b"),
          pageCount: 10,
          currPage: pageNum ? pageNum : '1',
          Bdate: '2019-1-1',
          Edate: '2222-10-10',
          pagename: "bGetPassHistory"
        },
        dataType: "json",
        success: function (res) {
          if (res) {
            var jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              if (jsonRes.msg == '没有找到任何符合条件的人，换个条件查询？') {
                state.history = [];
                return;
              }
              state.history = jsonRes.msg.msg.pushlist;
              //处理薪资格式
              state.history.forEach((item) => {
                if (item.currSalary) {
                  if (item.currSalary.indexOf('W') == -1) {
                    item.currSalary = item.currSalary + 'W';
                  }
                } else {
                  item.currSalary = '未填写';
                }
              });

              state.historyNum = parseInt(jsonRes.msg.msg.totalCount);
            }
          }
        }
      });
    }
  },
  actions: {
    //领取人才
    claimTalent(context, data) {
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          userid: Cookies.get('userid-b'),
          entid: Cookies.get('userid-b'),
          action: "save",
          pagename: "bWorkPool",
          orderid: data.orderid
        },
        dataType: "json",
        success: function (response) {
          var jsonRes = JSON.parse(response);
          if (jsonRes.status == "ok") {
            //操作成功后获取当前页面数据
            context.commit("allTalents", data.search);
          }
        }
      });
    }
  }
};

export default m_talents;