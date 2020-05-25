let m_introduction = {
  state: {
    //企业基本信息
    briefInfo: {
      entScale: '',
      entClass: '',
      entIndustry: '',
      entNation: '',
      entAdd: '',
      entSummary: '',
    },
    //企业头像
    company_avator: "",
    //企业简历获取状态
    loadCompanyProfile: false,
  },
  getters: {

  },
  mutations: {
    //清空企业基本信息数据
    initBriefInfo(state) {
      state.briefInfo = {
        entScale: '',
        entClass: '',
        entIndustry: '',
        entNation: '',
        entAdd: '',
        entSummary: '',
      };
      state.company_avator = "";
    },
    //获取企业基本信息和头像
    companyProfile(state, entid) {
      //初始化
      state.loadCompanyProfile = false;
      state.loadPsnInfo = false;
      $.ajax({
        type: "get",
        url: APIPsn + '/Psninfo/GetInf',
        data: {
          entid: entid,
          pagename: "entinfo",
          code: ""
        },
        dataType: "json",
        success: function (res) {
          if (res) {
            var jsonRes = JSON.parse(res);
            if (jsonRes.status == 'ok') {
              let msg = jsonRes.msg;
              //企业简介
              state.briefInfo = msg.entBaseInfo;
              //头像
              if (msg.entlogoinfo.entPicSrc) {
                state.company_avator = msg.entlogoinfo.entPicSrc;
              } else {
                state.company_avator = "";
              }
              state.loadCompanyProfile = true;
            } else {
              alert('数据出错,请重试=>companyProfile');
              state.loadCompanyProfile = true;
            }
          }
        }
      });
    }
  }
};

export default m_introduction;