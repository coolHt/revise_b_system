import xz from "../common";
let m_publish = {
  state: {
    //初始数据
    jobType: ['全职', '兼职', '实习生', '无固定时间', '小时工日结', '临时工'], //工作类型
    welfareTag: [ //职位福利
      "提供住宿", "提供工作餐", "免费工作餐", "免费提供住宿", "免费包吃住", "缴纳五险", "缴纳五险一金", "通讯补贴", "定期体检", "年终奖金",
      "周末双休", "餐饮补贴", "住房补贴", "一年13薪", "交通补贴", "常年恒温车间", "加班补贴", "节假日福利", "免费班车接送"
    ],
    workTimeTag: [ //工作经验
      "应届生",
      "1-3年",
      "3-5年",
      "5-10年",
      "10年以上",
      "不限"
    ],
    eduTag: ["初中及以下", "中专/技校", '高中', "大专", "本科", "硕士", "博士", "不限"], //学历
    languageTag: ["英语", "德语", "日语", "其他", "不限"], //外语选项
    langTag: [{ //默认语言选择
      level: 3,
      name: "英语"
    }],
    initLange: '英语',
    otherLang: true, //显示选择的语言
    otherLanguage: false, //显示新增语言输入框
    langLevel: [ //语言熟练度
      "简单沟通",
      "日常交流",
      "读写精通",
      "工作用语",
      "同声传译"
    ],
    otherBtn: [ //专业证书
      "人力资源管理师证书",
      "企业培训师证书",
      "注册会计师证书",
      "会计从业资格证书"
    ],
    skillBtn: [ //工具工艺
      "APQP",
      "FMEA",
      "MSA",
      "PPAP",
      "SPC"
    ],
    toolBtn: ["AUTO-CAD软件", "Pro-E软件", "SAP", "金蝶", "用友"], //软件系统
    knowBtn: [], //其他要求,
    jobid: '',
    //职位信息
    jobInfo: {
      shortEntName: "", //简称
      entJobAdd: '', //工作详细地址
      entJobEdu: '不限', //学历
      entJobExplan: '岗位说明：\n\n\n任职要求：\n', //岗位说明
      entJobFun: '', //职能分类
      entJobIndustry: '汽车行业', //所属行业
      entJobKnowTag: [], //其他要求
      entJobLang: "", //语言要求
      entJobMaxPay: '8', //最高薪资
      entJobMinPay: '5', //最低薪资
      entJobName: '', //职位名称
      entJobNation: '', //工作地点
      entJobNum: '1', //招聘人数
      entJobPart: '', //所属部门(子公司)
      entJobPayMonth: '12', //薪资月份
      entJobOtherTag: [], //专业证书
      entJobSkillTag: [], //工具工艺
      entJobToolTag: [], //软件系统
      entWelfareTag: [], //职位福利
      entJobWorkTime: '不限', //工作经验
      entJobWorkType: '全职', //工作类型
      entJobPayChecked: '', //显示为面议
      entJobWorkTimeChecked: '', //工作时间
      entJobEduChecked: '', //是否统招
      entJobReq: "", //干啥的呢
      hourpay: "", //时薪
    },
  },
  getters: {
    getInitJob(state) {
      state.jobid = '';
      let jobInfo = {
        shortEntName: "", //简称
        jobId: '',
        entJobAdd: '', //工作详细地址
        entJobEdu: '不限', //学历
        entJobExplan: '岗位说明：\n\n\n任职要求：\n', //岗位说明
        entJobFun: '', //职能分类
        entJobIndustry: '汽车行业', //所属行业
        entJobKnowTag: [], //其他要求
        entJobLang: "", //语言要求
        entJobMaxPay: '8', //最高薪资
        entJobMinPay: '5', //最低薪资
        entJobName: '', //职位名称
        entJobNation: '', //工作地点
        entJobNum: '1', //招聘人数
        entJobPart: '', //所属部门(子公司)
        entJobPayMonth: '12', //薪资月份
        entJobOtherTag: [], //专业证书
        entJobSkillTag: [], //工具工艺
        entJobToolTag: [], //软件系统
        entWelfareTag: [], //职位福利
        entJobWorkTime: '不限', //工作经验
        entJobWorkType: '全职', //工作类型
        entJobPayChecked: '', //显示为面议
        entJobWorkTimeChecked: '', //工作时间
        entJobEduChecked: '', //是否统招
        entJobReq: "", //干啥的呢
      };
      return jobInfo;
    }
  },
  mutations: {
    setJobInit(state) { //重置数据
      state.jobInfo = {
        shortEntName: "", //简称
        entJobAdd: '', //工作详细地址
        entJobEdu: '不限', //学历
        entJobExplan: '岗位说明：\n\n\n任职要求：\n', //岗位说明
        entJobFun: '', //职能分类
        entJobIndustry: '汽车行业', //所属行业
        entJobKnowTag: [], //其他要求
        entJobLang: "", //语言要求
        entJobMaxPay: '8', //最高薪资
        entJobMinPay: '5', //最低薪资
        entJobName: '', //职位名称
        entJobNation: '', //工作地点
        entJobNum: '1', //招聘人数
        entJobPart: '', //所属部门(子公司)
        entJobPayMonth: '12', //薪资月份
        entJobOtherTag: [], //专业证书
        entJobSkillTag: [], //工具工艺
        entJobToolTag: [], //软件系统
        entWelfareTag: [], //职位福利
        entJobWorkTime: '不限', //工作经验
        entJobWorkType: '全职', //工作类型
        entJobPayChecked: '', //显示为面议
        entJobWorkTimeChecked: '', //工作时间
        entJobEduChecked: '', //是否统招
        entJobReq: "", //干啥的呢
      };
      state.jobid = '';
    },
    //修改状态下设置jobid
    setJobid(state, id) {
      state.jobid = id;
    },
    //修改状态下获取职位数据
    editJobData(state, id) {
      $.ajax({
        url: APIEnt,
        async: true,
        type: "post",
        dataType: "json",
        data: {
          "action": "edit",
          "userid": Cookies.get('userid-b'),
          'entid': Cookies.get('entid-b'),
          'jobid': id,
          'pagename': 'entjobinfo'
        },
        success: function (res) {
          //获取要修改的的公司地址等初始数据
          var jsonRes = JSON.parse(res);
          if (jsonRes.status == 'ok') {
            state.jobInfo = jsonRes.msg.entJobInfo;
          } else {
            alert('系统出错，请稍后再试');
          }
        }
      });
    },
    //选择语言
    changeLanguage(state, data) {
      if (data == '英语') {
        state.langTag = [{
          level: 3,
          name: "英语"
        }];
        state.initLange = '英语';
      }
      if (data == '德语') {
        state.langTag = [{
          level: 3,
          name: "德语"
        }];
        state.initLange = '德语';
      }
      if (data == '日语') {
        state.langTag = [{
          level: 3,
          name: "日语"
        }];
        state.initLange = '日语';
      }
      if (data == '其他') {
        state.langTag = [{
          level: 3,
          name: "其他"
        }];
        state.initLange = '其他';
        state.otherLanguage = true;
        state.otherLang = false;
      } else if (data == '不限') {
        state.langTag = [];
        state.otherLanguage = false;
        state.otherLang = false;
      } else {
        state.otherLanguage = false;
        state.otherLang = true;
      }
    },
    
    setOtherLanguage(state, status) { //设置其他语言填写开关
      state.otherLanguage = status;
    },
    setOtherLang(state, status) { //设置选中的语言显示
      state.otherLang = status;
    },
    
  },
  actions:{
    //新增，修改职位
    funUploadJob: function (context, data) {
      xz.manipulateJob(data.entid, data.jobid, data.info).then((res) => {
        if(res){
          //获取审核列表
          xz.verityJob();
        }else{
          console.log("新增修改职位出错");
        }
      });
    },
  }
};

export default m_publish;