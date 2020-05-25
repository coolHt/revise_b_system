let m_jobs = {
  state: {
    jobinfo: {
      entJobAdd: '', //工作地点
      entJobEdu: '', //
      entJobExplan: '', //职位简介
      entJobFun: '', //职位职能
      entJobIndustry: '', //职位行业
      entJobKnowTag: [], //知识标签
      entJobMaxPay: '', //最高工资
      entJobMinPay: '', //最低工资
      entJobName: '', //职位名称
      entJobNation: '', //地址?
      entJobNum: '', //数量
      entJobPart: '', //所属公司
      entJobPay: '', //职位薪资
      entJobPayMonth: '', //薪资计算周期
      entJobWorkType: '', //工作类型
      entWelfareTag: [], //公司福利
      entJobToolTag: [], //所需工具
      entJobSkillTag: [], //所需技能
      entJobOtherTag: [], //其他标签
      translateLanguage: "", //转换后的语言
      entJobWorkTime: "", //工作经验
    },
    checkJobsNum: 0, //审核职位的总数
    //项目进度
    progressList: [],
    progressNum: 0,
    //分配历史
    historyDatas: [],
    historyDatasNum: 0,
    publishSuccess: false,
    editSuccess: false,
    //职位列表
    joblists: [],
    joblistNum: 0,
    jobCv: [],
    //数据是否已经获取到
    loadJobLists: false,
    //审核列表数据是否已经获取到
    loadCheckJobs: false,
  },
  getters: {
    //获取企业下的所有职位
    // joblistInCompany(state){
    //   return function(entid){
    //     return new Promise((resolve) => {
    //       $.ajax({
    //             type: "post",
    //             url: APIB,
    //             data: {
    //               pagename: "bgetentjoblist",
    //               entid: item.entId,
    //               action: "edit"
    //             },
    //             dataType: "json",
    //             success: function (response) {
    //             }
    //     });
    //   };
    // }
  },
  mutations: {
    //清空jobinfo数据
    initJobinfo(state) {
      state.jobinfo = {
        entJobAdd: '', //工作地点
        entJobEdu: '', //
        entJobExplan: '', //职位简介
        entJobFun: '', //职位职能
        entJobIndustry: '', //职位行业
        entJobKnowTag: [], //知识标签
        entJobMaxPay: '', //最高工资
        entJobMinPay: '', //最低工资
        entJobName: '', //职位名称
        entJobNation: '', //地址?
        entJobNum: '', //数量
        entJobPart: '', //所属公司
        entJobPay: '', //职位薪资
        entJobPayMonth: '', //薪资计算周期
        entJobWorkType: '', //工作类型
        entWelfareTag: [], //公司福利
        entJobToolTag: [], //所需工具
        entJobSkillTag: [], //所需技能
        entJobOtherTag: [], //其他标签
        translateLanguage: "", //转换后的语言
        entJobWorkTime: "", //工作经验
      };
    },
    //获取职位的申请数量
    jobCvNum(state, jobList) {
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          'type': 'a',
          'action': 'edit',
          'userid': Cookies.get('userid-b'),
          'arrjobid': jobList,
          'pagename': 'bGetJobCount'
        },
        dataType: "json",
        success: function (res) {
          if (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              state.jobCv = jsonRes.msg;
            }
          }
        }
      });
    },
    //获取职位详情
    getJobInfor(state, jobid) {
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          action: "edit",
          jobid: jobid,
          pagename: "bGetJobInfo"
        },
        dataType: "json",
        success: function (res) {
          if (res) {
            var jsonRes = JSON.parse(res);
            if (jsonRes.status == 'ok') {
              state.jobinfo = jsonRes.msg.entJobInfo;
              //任职要求
              let reg = state.jobinfo.entJobExplan.replace(/\n/g, "").replace(/</g, "").replace(/>/g, "");
              state.jobinfo.entJobExplan = reg;
              // //转换语言
              if (state.jobinfo.entJobLang) {
                if (state.jobinfo.entJobLang.length > 0) { //如果有语言的话
                  let language = state.jobinfo.entJobLang[0];
                  state.languageName = language.name;
                  switch (language.level) {
                    case 1:
                      state.jobinfo.translateLanguage = language.name + '(简单沟通)';
                      break;
                    case 2:
                      state.jobinfo.translateLanguage = language.name + '(日常交流)';
                      break;
                    case 3:
                      state.jobinfo.translateLanguage = language.name + '(读写精通)';
                      break;
                    case 4:
                      state.jobinfo.translateLanguage = language.name + '(工作用语)';
                      break;
                    case 5:
                      state.jobinfo.translateLanguage = language.name + '(同声传译)';
                      break;
                  }
                } else {
                  state.translateLanguage = "未填写";
                }
              }
            }
          }
        }
      });
    },
    //获取项目进度
    getWorkProgess(state, data) {
      $.ajax({
        url: APIB,
        async: true,
        type: "post",
        dataType: "json",
        beforeSend: function (request) {
          request.setRequestHeader("token", Cookies.get("token"));
        },
        data: {
          action: "edit",
          type: "p",
          pagename: "bGetPassJobList",
          countNum: data.countNum,
          currpage: data.currpage,
          qsign: '0',
          userid: Cookies.get("userid-b")
        },
        success: function (res) {
          if (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              let list = jsonRes.msg;
              if (list) {
                let lis = list.joblist;
                //设置时间
                lis.forEach((item) => {
                  let d = new Date().getDate() - new Date(item.BDate).getDate();
                  let y = new Date().getFullYear() - new Date(item.BDate).getFullYear();
                  if (y == 0 && d < 8) {
                    d == 0 ? item.timeDistance = "今天" : item.timeDistance = d + "天前";
                  } else {
                    item.timeDistance = new Date(item.BDate).getFullYear() + " " + new Date(item.BDate).getMonth() + "-" + new Date(item.BDate).getDate();
                  }
                });
                state.progressList = lis;
                state.progressNum = parseInt(list.totalCount);
              } else {
                state.progressList = [];
                state.progressNum = 0;
              }
            }
          }
        }
      });
    },
    //获取分配历史
    assignHistory(state, data) {
      $.ajax({
        url: APIB,
        async: true,
        type: "post",
        dataType: "json",
        beforeSend: function (request) {
          request.setRequestHeader("token", Cookies.get("token"));
        },
        data: {
          action: "edit",
          type: "p",
          pagename: "bGetPassJobList",
          countNum: data.countNum,
          currpage: data.currpage,
          qsign: '1',
          userid: Cookies.get("userid-b")
        },
        success: function (res) {
          if (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              if (jsonRes.msg) {
                if (jsonRes.msg.joblist.length > 0) {
                  state.historyDatas = jsonRes.msg.joblist;
                }

                if (jsonRes.msg.totalCount) {
                  state.historyDatasNum = parseInt(jsonRes.msg.totalCount);
                } else {
                  state.historyDatasNum = 0;
                }
              }
            }
          }
        }
      });
    }
  },
  actions: {
  }
};

export default m_jobs;