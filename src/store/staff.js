let m_staff = {
  state: {
    staffs: []
  },
  getters: {},
  mutations: {
    getStaffs(state){ //获取下属列表
      $.ajax({
        type: "post",
        url: APIB,
        data: {
          action: "edit",
          userid: Cookies.get("userid-b"),
          pagename: "GetEmployList",
          msg: ''

        },
        dataType: "json",
        success: function (response) {
          if (response) {
            var jsonRes = JSON.parse(response);
            if (jsonRes.status == "ok") {
              state.staffs = jsonRes.msg;
            }
          }
        }
      });
    }
  }
};

export default m_staff;