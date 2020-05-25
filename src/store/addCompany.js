import xz from "../common";
const m_addCompany = {
  state: {
    currentModule: 'addComapny',
    companyIndustry: [{
      value: '能源行业',
      label: '能源行业'
    },{
      value: '化工行业',
      label: '化工行业'
    },{
      value: '材料行业',
      label: '材料行业'
    },{
      value: '机械设备与军工行业',
      label: '机械设备与军工行业'
    },{
      value: '企业服务于造纸业',
      label: '企业服务于造纸业'
    },{
      value: '运输服务业',
      label: '运输服务业'
    },{
      value: '旅游酒店业',
      label: '旅游酒店业'
    },{
      value: '媒体与信息服务业',
      label: '媒体与信息服务业'
    },{
      value: '批发零售业',
      label: '批发零售业'
    },{
      value: '消费品行业',
      label: '消费品行业'
    },{
      value: '医疗保健与卫生行业',
      label: '医疗保健与卫生行业'
    },{
      value: '金融业',
      label: '金融业'
    },{
      value: '建筑建材与房地产业',
      label: '建筑建材与房地产业'
    },{
      value: '公共事业',
      label: '公共事业'
    }],
    //企业类型
    companyProperty: [{
      value: '外商独资/外企办事处',
      label: '外商独资/外企办事处'
    }, {
      value: '中外合资/合作',
      label: '中外合资/合作'
    }, {
      value: '私营/民办企业',
      label: '私营/民办企业'
    }, {
      value: '国有企业',
      label: '国有企业'
    }, {
      value: '上市公司',
      label: '上市公司'
    }, {
      value: '贸易公司',
      label: '贸易公司'
    }, {
      value: '非盈利机构',
      label: '非盈利机构'
    }, {
      value: '政府/公共事业',
      label: '政府/公共事业'
    }, {
      value: '农/林/牧/渔',
      label: '农/林/牧/渔'
    }, {
      value: '多元化业务集团公司',
      label: '多元化业务集团公司'
    }, {
      value: '学校',
      label: '学校'
    }, {
      value: '其他',
      label: '其他'
    }],
    //公司规模
    scale: [{
      value: '1-49人',
      label: '1-49人'
    }, {
      value: '50-149人',
      label: '50-149人'
    }, {
      value: '150-499人',
      label: '150-499人'
    }, {
      value: '500-999人',
      label: '500-999人'
    }, {
      value: '1000-2000人',
      label: '1000-2000人'
    }, {
      value: '2000-5000人',
      label: '2000-5000人'
    }, {
      value: '5000-10000人',
      label: '5000-10000人'
    }, {
      value: '10000人以上',
      label: '10000人以上'
    }],
    companyMatch: [],
    companyList: [],
    //判断是否有账号
    isHas: null,
    //账号信息
    accountInfo: "",
    //生成账号遮罩层
    produceSuccess: true,
    //修改获取到的企业信息
    companyInfor: null
  },
  mutations: {
    //企业名称判重
    searchMatch(state, field) {
      xz.iterateName(field).then((res) => {
        res ? state.companyMatch = res : console.log("企业名称判重出错");
      });
    },
    //检查企业是否已有账号
    // checkHasCount(state, item) {
    //   state.isHas = null; //初始化
    //   $.ajax({
    //     type: "post",
    //     url: APIB,
    //     data: {
    //       userid: Cookies.get('userid-b'),
    //       entid: item.entId,
    //       action: 'edit',
    //       pagename: 'bgetentacct',
    //     },
    //     dataType: "json",
    //     success: function (response) {
    //       var jsonRes = JSON.parse(response);
    //       if (jsonRes.status == 'ok') {
    //         //如果不存在
    //         if (!jsonRes.msg) {
    //           state.isHas = false;
    //           state.accountInfo = "";
    //         }
    //         //如果存在
    //         if (jsonRes.msg[0]) {
    //           state.isHas = true;
    //           state.accountInfo = jsonRes.msg[0];
    //         }
    //       }
    //     }
    //   });
    // },
    //生成账号
    produceAccount(state, accountInfo) {
      state.produceSuccess = false;
      xz.createCompanyAccount(accountInfo).then((res) => {
        state.produceSuccess = true;
        if(res){
          console.log("生成账号成功");
        }else{
          console.log("生成账号出错");
        }
      });
    },
    //获取修改企业的信息
    editCompanyInformation(state, companyId){
      xz.getCompanyInformation(companyId).then((res) => {
        res ? state.companyInfor = res : console.log("修改企业信息出错");
      });
    }
  },
};

export default m_addCompany;