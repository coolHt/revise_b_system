let m_companyIdenfity = {
  state:{
    identifyList: [],
    identifyHistory: [],
    listNum:0,
  },

  getters:{
    
  },

  mutations:{
    getIndentifyList(state, data) {
      $.ajax({
        type: "post",
        url: APIB,
        beforeSend: function (request) {
          request.setRequestHeader("token", Cookies.get("token"));
        },
        data: {
          'type': 'a',
          'action': 'edit',
          'userid': Cookies.get('userid-b'),
          'entid': Cookies.get('entid-b'),
          'entBaseInfo': JSON.stringify(self.entBaseInfo),
          'countNum': data.countNum,
          'currpage': data.currpage,
          'status': data.type,
          'qerystr': '',
          'pagename': 'bSetEntChkList'
        },
        dataType: "json",
        success: function (res) {
          if (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              if (data.type == 0) {
              state.identifyList = jsonRes.msg;
              state.listNum = jsonRes.totalnum;
              }else{
              state.identifyHistory = jsonRes.msg;
              state.listNum = jsonRes.totalnum;
              }
            }
          }
        }
      });
    }
  },
  actions:{
    //操作拒绝和认证
    approveType(context,pros){
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          'type': 'a',
          'action': 'save',
          'userid': Cookies.get('userid-b'),
          'entid': pros.entid,
          'entApprove': pros.type,
          'pagename': 'bSetEntChkList'
        },
        dataType: "json",
        success: function (res) {
          if (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              let data = {
                type: '0',
                countNum: pros.countNum,
                currpage: pros.currpage
              };
              console.log(data);
              context.commit("getIndentifyList", data);
            }
          }
        }
      });
    }
  }
};

export default m_companyIdenfity;