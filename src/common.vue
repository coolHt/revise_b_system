<script type="text/javascript">
//登录
function userLogin(username, password) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APILogin,
      data: {
        action: "login",
        type: "b",
        username,
        password
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("登录出错");
            resolve(false);
          }
        } else {
          console.log("登录出错");
          resolve(false);
        }
      }
    });
  });
}
//获取企业下的所有职位
function joblistInCompany(entid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        pagename: "bgetentjoblist",
        entid,
        action: "edit"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取企业下的所有职位出错");
            resolve(false);
          }
        } else {
          console.log("获取企业下的所有职位出错");
          resolve(false);
        }
      }
    });
  });
}
//获取职位的投递人数
function jobsEnrolment(arrjobid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        type: "a",
        action: "edit",
        userid: Cookies.get("userid-b"),
        arrjobid,
        pagename: "bGetJobCount"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取职位的投递人数出错");
            resolve(false);
          }
        } else {
          console.log("获取职位的投递人数出错");
          resolve(false);
        }
      }
    });
  });
}
//获取职位审核与面试信息
//Add:TNtLike
function jobsMeetEnrolment(mdate, countnum = 10, currpage = 1, QueryStr) {
  QueryStr = JSON.stringify(QueryStr);
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        type: "a",
        action: "edit",
        userid: Cookies.get("userid-b"),
        mdate,
        countnum,
        currpage,
        QueryStr,
        pagename: "bGetDateJobCount"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取职位审核与面试信息出错");
            resolve(false);
          }
        } else {
          console.log("获取职位审核与面试信息出错");
          resolve(false);
        }
      }
    });
  });
}
//获取获取b角内部职位的投递情况
//Add:TNtLike
function jobProgressEnrolment(
  jobid = "",
  strstatus = "",
  currpage = 1,
  countnum = 10
) {
  //strstatus:
  //已报名: 0
  //已通过: 1
  //已拒绝: 2
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        type: "a",
        action: "edit",
        userid: Cookies.get("userid-b"),
        jobid,
        countnum,
        currpage,
        strstatus,
        pagename: "bGetBJobUserList"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取获取b角内部职位的投递情况出错");
            resolve(false);
          }
        } else {
          console.log("获取获取b角内部职位的投递情况出错");
          resolve(false);
        }
      }
    });
  });
}
//职位下线
function offlineJob(jobid, entid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        type: "a",
        action: "save",
        jobid,
        entid,
        userid: Cookies.get("userid-b"),
        pagename: "bsetentjoboffline"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            let jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("职位下线出错");
            resolve(false);
          }
        } else {
          console.log("职位下线出错");
          resolve(false);
        }
      }
    });
  });
}
//获取职位地点
function jobLocation(jobId, entid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        entid,
        userid: Cookies.get("userid-b"),
        jobId,
        pagename: "entjobaddrinfo"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const res = JSON.parse(res);
            res ? resolve(res) : resolve(false);
          } catch (e) {
            console.log("获取职位地点出错");
            resolve(false);
          }
        } else {
          console.log("获取职位地点出错");
          resolve(false);
        }
      }
    });
  });
}
//获取职位信息
function getJobInfor(jobId) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        pagename: "bGetJobInfo",
        pageid: "1",
        jobId
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取职位信息出错");
            resolve(false);
          }
        } else {
          console.log("获取职位信息出错");
          resolve(false);
        }
      }
    });
  });
}
//修改发布企业信息
function publishCompany(entid, infor) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        userid: Cookies.get("userid-b"),
        entid,
        action: "save",
        processData: false,
        pagename: "bSaveInnerEntInf",
        jsonstr: JSON.stringify(infor)
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log(e);
            console.log("修改发布企业信息出错");
            resolve(false);
          }
        } else {
          console.log("修改发布企业信息出错");
          resolve(false);
        }
      }
    });
  });
}
//获取审核的职位列表
function verityJob(countnum = 10, currpage = 1) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        countnum,
        currpage,
        pagename: "bWorkProgress"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取审核的职位列表出错");
            resolve(false);
          }
        } else {
          console.log("获取审核的职位列表出错");
          resolve(false);
        }
      }
    });
  });
}
//获取所有职位列表
function getTotalJobList(data) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        countNum: data.countnum,
        currpage: data.currpage,
        status: data.status,
        pagename: "bGetAllJobList",
        qerystr: JSON.stringify(data.searchinfor)
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            let jsonRes = JSON.parse(res);
            jsonRes.status == "ok"
              ? resolve({
                  msg: jsonRes.msg,
                  totalnum: jsonRes.totalnum ? jsonRes.totalnum : 0
                })
              : resolve(false);
          } catch (e) {
            console.log("获取所有职位列表出错");
            resolve(false);
          }
        } else {
          console.log("获取所有职位列表出错");
          resolve(false);
        }
      }
    });
  });
}
//获取个人简历信息
function userInfo(psnid, CVID = "") {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        psnid,
        CVID, //公共池的人没有cvid
        pagename: "bGetUserInfo"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取个人简历信息出错");
            resolve(false);
          }
        } else {
          console.log("获取个人简历信息出错");
          resolve(false);
        }
      }
    });
  });
}
//获取推送历史
function deliveryHistory(pageCount = 10, currPage = 1) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pageCount,
        currPage,
        Bdate: "2019-1-1",
        Edate: "2222-10-10",
        pagename: "bGetPassHistory"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取推送历史出错");
            resolve(false);
          }
        } else {
          console.log("获取推送历史出错");
          resolve(false);
        }
      }
    });
  });
}
//获取部门
function getDepartment(code) {
  return new Promise(resolve => {
    var obj = {
      instcode: code
    };
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        jsparam: JSON.stringify(obj),
        pagename: "bGetInstInfo"
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              if (code == "0000000000") {
                resolve(jsonRes.msg.children[0].children);
              } else {
                //TNTLIKE
                let children = [];
                children.push(jsonRes.msg);
                resolve(children);
              }
              code == "0000000000"
                ? resolve(jsonRes.msg.children[0].children)
                : resolve(jsonRes.msg);
            } else {
              console.log("获取部门出错");
              resolve(false);
            }
          } catch (e) {
            console.log("获取部门出错");
            resolve(false);
          }
        } else {
          console.log("获取部门出错");
          resolve(false);
        }

        //获取要修改的的公司地址等初始数据
        // Fix: TNtLike 2020-01-08
        // 后端服务返回数据示例一: {"status":"ok","msg":{"instname":"csa","instcode":"xxxxxxxxxxxxx","orderid":"1","lvid":"3"}}
        // 后端服务返回数据示例二: {"status":"ok","msg":{"children":[{"instname":"","instcode":"0000000000","orderid":"0","lvid":"0","children":[{"instname":"退役军人","instcode":"1571909801152","orderid":"1","lvid":"1","children":[{"instname":"华东","instcode":"1572398111894","orderid":"3","lvid":"2","children":[{"instname":"宁波","instcode":"1571975459722","orderid":"2","lvid":"3","children":[{"instname":"北仑","instcode":"1571975563447","orderid":"1","lvid":"3"},{"instname":"象山","instcode":"1571975588081","orderid":"2","lvid":"3"}]},{"instname":"温州","instcode":"1571975627989","orderid":"1","lvid":"3"}]}]},{"instname":"军嫂","instcode":"1571975443253","orderid":"1","lvid":"1","children":[{"instname":"宁波","instcode":"1571975496088","orderid":"1","lvid":"2","children":[{"instname":"北仑","instcode":"1571975573770","orderid":"1","lvid":"3"},{"instname":"象山","instcode":"1571975601814","orderid":"2","lvid":"3"}]},{"instname":"温州","instcode":"1571975637888","orderid":"2","lvid":"2"}]},{"instname":"杰博","instcode":"1576563421182","orderid":"1","lvid":"1","children":[{"instname":"华东地区","instcode":"1576564796929","orderid":"2","lvid":"2","children":[{"instname":"宁波","instcode":"1577242344549","orderid":"1","lvid":"3"}]},{"instname":"华北地区","instcode":"1576564811217","orderid":"2","lvid":"2"},{"instname":"东北地区","instcode":"1576564828548","orderid":"3","lvid":"2"},{"instname":"华中地区","instcode":"1576564838038","orderid":"4","lvid":"2","children":[{"instname":"长沙","instcode":"1576585136612","orderid":"1","lvid":"3"}]},{"instname":"华南地区","instcode":"1576564847216","orderid":"5","lvid":"2"},{"instname":"西南地区","instcode":"1576564862629","orderid":"6","lvid":"2","children":[{"instname":"重庆","instcode":"1576585607048","orderid":"1","lvid":"3"},{"instname":"成都","instcode":"1576585617861","orderid":"2","lvid":"3"}]},{"instname":"西北地区","instcode":"1576564909261","orderid":"7","lvid":"2"}]},{"instname":"xz测试部门","instcode":"1577201573997","orderid":"1","lvid":"1","children":[{"instname":"测试td","instcode":"1578475968379","orderid":"1","lvid":"2","children":[{"instname":"csa","instcode":"1578476078341","orderid":"1","lvid":"3"}]}]},{"instname":"","instcode":"1577201575307","orderid":"1","lvid":"1"}]}]}}
      }
    });
  });
}
//新增成员
function addAdmin(data, codeList) {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "save", //需要账户相关信息
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        pagename: "bSaveLowUserInfo",
        accoutInfo: JSON.stringify(data),
        powerlist: codeList
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("新增成员出错");
            resolve(false);
          }
        } else {
          console.log("新增成员出错");
          resolve(false);
        }
      }
    });
  });
}
//获取账号信息
function accountInformation() {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "edit", //需要账户相关信息
        userid: Cookies.get("userid-b"),
        pagename: "bGetAccountInfo"
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取账号信息出错");
            resolve(false);
          }
        } else {
          console.log("获取账号信息出错");
          resolve(false);
        }
      }
    });
  });
}
//保存账号信息
function saveAccountInformation(infor) {
  return new Promise(resolve => {
    $.ajax({
      url: APIEnt,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "save", //需要账户相关信息
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        pagename: "accountinfo",
        accountInfo: JSON.stringify(infor)
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("保存账号信息出错");
            resolve(false);
          }
        } else {
          console.log("保存账号信息出错");
          resolve(false);
        }
      }
    });
  });
}
//获取权限组
function purviewGroup() {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      dataType: "json",
      type: "post",
      data: {
        action: "edit", //需要账户相关信息
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        pagename: "bGetPowerList"
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              jsonRes.msg ? resolve(jsonRes.msg) : resolve(false);
            } else {
              console.log("获取权限组出错");
              resolve(false);
            }
          } catch (e) {
            console.log("获取权限组出错");
            resolve(false);
          }
        } else {
          console.log("获取权限组出错");
          resolve(false);
        }
      }
    });
  });
}
//获取权限组内容
function purviewGroupList(type) {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "edit", //需要账户相关信息
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        pagename: "bGetDefInf",
        roletype: type
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取权限组内容出错");
            resolve(false);
          }
        } else {
          console.log("获取权限组内容出错");
          resolve(false);
        }
      }
    });
  });
}
//获取团队成员
function groupMember(userid = Cookies.get("userid-b")) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        userid,
        pagename: "bGetUserList"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取团队成员出错");
            resolve(false);
          }
        } else {
          console.log("获取团队成员出错");
          resolve(false);
        }
      }
    });
  });
}
//设置下级用户权限
function setInferiorPurview(userid, powerlist, instcode, nation) {
  let dataJson = {
    powerlist: powerlist,
    instcode: instcode,
    nations: nation
  };
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "save",
        userid: userid,
        pagename: "bSaveUserPowerList",
        jsoncode: JSON.stringify(dataJson)
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("设置下级用户权限出错");
            resolve(false);
          }
        } else {
          console.log("设置下级用户权限出错");
          resolve(false);
        }
      }
    });
  });
}
//获取团队成员个人权限(包括地区)
function getMemberPurview(userid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        userid,
        pagename: "bGetUserPowerList"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取团队成员个人权限(包括地区)出错");
            resolve(false);
          }
        } else {
          console.log("获取团队成员个人权限(包括地区)出错");
          resolve(false);
        }
      }
    });
  });
}
//获取所有企业列表
function getAllCompany(pageSize = 10, pageNum = 1, querystr) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        type: "a",
        action: "edit",
        userid: Cookies.get("userid-b"),
        countNum: pageSize,
        currpage: pageNum,
        querystr,
        pagename: "getentlist"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes) : resolve(false);
          } catch (e) {
            console.log("获取所有企业列表出错");
            resolve(false);
          }
        } else {
          console.log("获取所有企业列表出错");
          resolve(false);
        }
      }
    });
  });
}
//获取申请和职位数量
function jobDeliveryNum(idList) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        type: "a",
        action: "edit",
        userid: Cookies.get("userid-b"),
        arrentid: idList,
        pagename: "bGetEntJobCount"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取申请和职位数量出错");
            resolve(false);
          }
        } else {
          console.log("获取申请和职位数量出错");
          resolve(false);
        }
      }
    });
  });
}
//获取申请和面试的企业职位数量
// Add:TNtLike
function jobMeetDeliveryNum(mdate) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        type: "a",
        action: "edit",
        userid: Cookies.get("userid-b"),
        mdate,
        pagename: "bGetDateEntJobCount"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取申请和面试的企业职位数量出错");
            resolve(false);
          }
        } else {
          console.log("获取申请和面试的企业职位数量出错");
          resolve(false);
        }
      }
    });
  });
}
//获取面试信息
function getInterviewInformation(jobid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        userid: Cookies.get("userid-b"),
        action: "edit",
        jobid,
        pagename: "bGetJobViewInfOnPoint"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取面试信息出错");
            resolve(false);
          }
        } else {
          console.log("获取面试信息出错");
          resolve(false);
        }
      }
    });
  });
}
//获取人才
function getAllTalents(search) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        pagename: "bGetTotalList",
        //查询条件
        msg: JSON.stringify(search)
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取人才出错");
            resolve(false);
          }
        } else {
          console.log("获取人才出错");
          resolve(false);
        }
      }
    });
  });
}
//获取职位信息
function getJobInformation(jobid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        pagename: "bGetJobInfo",
        pageid: "1",
        jobId: jobid
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取职位信息出错");
            resolve(false);
          }
        } else {
          console.log("获取职位信息出错");
          resolve(false);
        }
      }
    });
  });
}
//获取投递人
function deliveryList(jobid, currpage = 1, countNum = 10) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bGetJobUserList",
        jobid,
        currpage,
        countNum
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const josnRes = JSON.parse(res);
            josnRes.status == "ok" ? resolve(josnRes) : resolve(false);
          } catch (e) {
            console.log("获取投递人出错");
            resolve(false);
          }
        } else {
          console.log("获取投递人出错");
          resolve(false);
        }
      }
    });
  });
}
//新增部门
function addDepartment(obj) {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("entid-b"),
        jsparam: JSON.stringify(obj),
        pagename: "bSaveInstInfo"
      },
      success: res => {
        if (res) {
          try {
            //获取要修改的的公司地址等初始数据
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("新增部门出错");
            resolve(false);
          }
        } else {
          console.log("新增部门出错");
          resolve(false);
        }
      }
    });
  });
}
//删除部门
function deleteDepartment(obj) {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "del",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("entid-b"),
        jsparam: JSON.stringify(obj),
        pagename: "bDelInstInfo"
      },
      success: res => {
        if (res) {
          try {
            //获取要修改的的公司地址等初始数据
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes) : resolve(false);
          } catch (e) {
            console.log("删除部门出错");
            resolve(false);
          }
        } else {
          console.log("删除部门出错");
          resolve(false);
        }
      }
    });
  });
}
//新增修改职位
function manipulateJob(entid, jobid, entJobInfo) {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        entid,
        jobid,
        pagename: "bentjobinfo",
        entJobInfo: JSON.stringify(entJobInfo)
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("新增修改职位出错");
            resolve(false);
          }
        } else {
          console.log("新增修改职位出错");
          resolve(false);
        }
      }
    });
  });
}
//获取企业信息
function getCompanyInformation(entid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        entid,
        pagename: "bgetentinfobyid",
        action: "edit"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取企业信息出错");
            resolve(false);
          }
        } else {
          console.log("获取企业信息出错");
          resolve(false);
        }
      }
    });
  });
}
//企业生成账号
function createCompanyAccount(accountInfo) {
  const { username, usertel, useremail, userid_e = "", entid } = accountInfo;
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        userid: Cookies.get("userid-b"),
        action: "save",
        pagename: "initentacct",
        username,
        usertel,
        useremail,
        userid_e,
        entid
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("企业生成账号出错");
            resolve(false);
          }
        } else {
          console.log("企业生成账号出错");
          resolve(false);
        }
      }
    });
  });
}
//企业名称判重
function iterateName(keyword) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        userid: Cookies.get("userid-b"),
        action: "edit",
        pagename: "bentselectinner",
        keyword
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("企业名称判重出错");
            resolve(false);
          }
        } else {
          console.log("企业名称判重出错");
          resolve(false);
        }
      }
    });
  });
}
//获取申请管理/申请历史的人才
function deliveryTalents(data) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"), //上级id
        action: "edit",
        pagename: "bOrderlistPage",
        //查询条件
        msg: JSON.stringify(data)
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取申请管理/申请历史的人才出错");
            resolve(false);
          }
        } else {
          console.log("获取申请管理/申请历史的人才出错");
          resolve(false);
        }
      }
    });
  });
}
//上传图片
function uploadImage(mein) {
  return new Promise(resolve => {
    //entpicinfo 企业风采
    //entproductinfo 产品图片
    //entteamnfo 成员
    let formData = new FormData();
    formData.append("action", "save");
    formData.append("userid", Cookies.get("userid-b"));
    formData.append("entid", mein.entid);
    formData.append("pagename", mein.type);
    mein.blobName
      ? formData.append("entPicFile", mein.entPicFile, mein.blobName)
      : formData.append("entPicFile", mein.entPicFile);
    formData.append("entPicTitle", mein.entPicTitle);
    formData.append("entPicDes", mein.entPicDes);
    formData.append("picid", mein.picid);
    $.ajax({
      url: APIEntBin,
      async: true,
      type: "post",
      cache: false,
      processData: false,
      contentType: false,
      dataType: "json",
      data: formData,
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("上传图片出错");
            resolve(false);
          }
        } else {
          console.log("上传图片出错");
          resolve(false);
        }
      }
    });
  });
}
//获取企业图片
function getCompanyImages(entid) {
  return new Promise(resolve => {
    let formData = new FormData();
    formData.append("action", "edit");
    formData.append("userid", Cookies.get("userid-b"));
    formData.append("entid", entid);
    formData.append("pagename", "entpic");
    $.ajax({
      url: APIEntBin,
      async: true,
      type: "post",
      cache: false,
      processData: false,
      contentType: false,
      dataType: "json",
      data: formData,
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取企业图片出错");
            resolve(false);
          }
        } else {
          console.log("获取企业图片出错");
          resolve(false);
        }
      }
    });
  });
}
//上传头像
function uploadAvatar(entid, mein) {
  return new Promise(resolve => {
    let formData = new FormData();
    formData.append("action", "save");
    formData.append("userid", Cookies.get("userid-b"));
    formData.append("entid", entid);
    mein.blobName
      ? formData.append("entPicFile", mein.entPicFile, mein.blobName)
      : formData.append("entPicFile", mein.entPicFile);
    formData.append("pagename", "entlogoinfo");
    $.ajax({
      url: APIEntBin,
      async: true,
      type: "post",
      cache: false,
      processData: false,
      contentType: false,
      dataType: "json",
      data: formData,
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("上传头像出错");
            resolve(false);
          }
        } else {
          console.log("上传头像出错");
          resolve(false);
        }
      }
    });
  });
}
//删除图片
function deletePic(entid, type, picid) {
  return new Promise(resolve => {
    let formData = new FormData();
    formData.append("action", "del");
    formData.append("userid", Cookies.get("userid-b"));
    formData.append("entid", entid);
    formData.append("pagename", type);
    formData.append("picid", picid);
    $.ajax({
      url: APIEntBin,
      async: true,
      type: "post",
      cache: false,
      processData: false,
      contentType: false,
      dataType: "json",
      data: formData,
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("删除图片出错");
            resolve(false);
          }
        } else {
          console.log("删除图片出错");
          resolve(false);
        }
      }
    });
  });
}
//通过人才申请
function approveTalentDelivery(jobid, CVID, msg) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        jobid,
        CVID,
        msg,
        pagename: "passToSendEnt"
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.station == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("通过人才申请出错");
            resolve(false);
          }
        } else {
          console.log("通过人才申请出错");
          resolve(false);
        }
      }
    });
  });
}
//拒绝人才申请
function refuseTalentDelivery(CVID, msg) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        CVID,
        pagename: "bRefuseResume",
        msg
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("拒绝人才申请出错");
            resolve(false);
          }
        } else {
          console.log("拒绝人才申请出错");
          resolve(false);
        }
      }
    });
  });
}
//企业名称查重
function searchRepetition(keyword) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        userid: Cookies.get("userid-b"),
        action: "edit",
        pagename: "bentselectinner",
        keyword
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("企业名称查重出错");
            resolve(false);
          }
        } else {
          console.log("企业名称查重出错");
          resolve(false);
        }
      }
    });
  });
}
//企业二维码
function companyQCode(code) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        userid: Cookies.get("userid-b"),
        action: "edit",
        pagename: "bgetent2code",
        code,
        idxpath: "pages/companyDetail/companyDetail",
        width: "",
        strjson: ""
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("企业二维码出错");
            resolve(false);
          }
        } else {
          console.log("企业二维码出错");
          resolve(false);
        }
      }
    });
  });
}
//保存个人专业技能标签
function addProfessionTags(userid, msg) {
  return new Promise(resolve => {
    $.ajax({
      url: APIPsn,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "save",
        type: "p",
        userid,
        pagename: "skilltag",
        msg
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
            }
          } catch (e) {
            console.log("保存个人专业技能标签出错");
            resolve(false);
          }
        } else {
          console.log("保存个人专业技能标签出错");
          resolve(false);
        }
      }
    });
  });
}
//初始化内部个人基本资料
function initBaseResume(bid, msg, userid_p) {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "save",
        bid,
        pagename: "addpsn",
        accountInfo: JSON.stringify(msg),
        userid_p
      },
      success: res => {
        if (res) {
          const jsonRes = JSON.parse(res);
          jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
        } else {
          resolve(false);
        }
      }
    });
  });
}
//保存内部个人基本资料
function saveBaseResume(cuserid, msg) {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "save",
        cuserid,
        pagename: "psnbaseinfoinner",
        msg: JSON.stringify(msg)
      },
      success: res => {
        if (res) {
          const jsonRes = JSON.parse(res);
          jsonRes.status == "ok" ? resolve(true) : resolve(false);
        } else {
          resolve(false);
        }
      }
    });
  });
}
//保存个人简历
function saveResumeInformation(userid, pagename, msg) {
  //pagename类型:
  //psnjobintentinfoinner => 求职意向
  //psnworkinfoinner =>工作经历
  //psneduinfoinner => 教育经历
  //psnpersoninfoinner => 个人资料
  //psnbaseinfo =>基本资料
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "save",
        type: "p",
        cuserid: userid,
        pagename,
        msg: JSON.stringify(msg)
      },
      success: res => {
        const jsonRes = JSON.parse(res);
        jsonRes.status == "ok" ? resolve(true) : resolve(false);
      }
    });
  });
}
//保存标签( 专业技能 knowtaginner/ 个人标签 skilltaginner)
function savePersonalTags(cuserid, pagename, msg, act) {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "save",
        cuserid: cuserid,
        pagename,
        msg,
        act
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }
    });
  });
}
//获取手机号(可获取多人的)
function getCellNumber(psnids) {
  return new Promise(resolve => {
    $.ajax({
      url: APIB,
      async: true,
      type: "post",
      dataType: "json",
      data: {
        action: "edit",
        type: "p",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        pagename: "bGetUserTel",
        psnids
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("获取手机号出错");
            resolve(false);
          }
        } else {
          console.log("获取手机号出错");
          resolve(false);
        }
      }
    });
  });
}
//职位审核通过
function identifyJobPublish(jobid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        pagename: "passWork",
        msg: {
          jobid
        }
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("职位审核通过失败");
            resolve(false);
          }
        } else {
          console.log("职位审核通过失败");
          resolve(false);
        }
      }
    });
  });
}
//职位审核拒绝
function refuseJobPublish(msg) {
  //拒绝审核
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("entid-b"),
        pagename: "closeWork",
        msg
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            console.log(jsonRes);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("职位拒绝失败");
            resolve(false);
          }
        } else {
          console.log("职位拒绝失败");
        }
      }
    });
  });
}
//面试通过/拒绝
function manipulateInterview(CVID, pubid, status) {
  //status
  //1 => 给用户发送面试通知
  //2 => 面试签到(b面试拒绝)
  //3 => 面试合格
  //4 -> 面试失败
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bsetviewstatus",
        CVID,
        pubid,
        status
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("职位审核通过失败");
            resolve(false);
          }
        } else {
          console.log("职位审核通过失败");
          resolve(false);
        }
      }
    });
  });
}
//获取渠道信息
function getTunnelInformation(userid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        pagename: "bgetpiplink",
        userid
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              resolve(jsonRes.msg);
            } else {
              console.log("职位审核通过失败");
              resolve(false);
            }
          } catch (e) {
            console.log("职位审核通过失败");
            resolve(false);
          }
        } else {
          console.log("职位审核通过失败");
          resolve(false);
        }
      }
    });
  });
}
//返回渠道路径
function getTunnelPath(pipid, codeid, sencname, userinfid, userid) {
  // 返回渠道/签到/经纪人二维码图片的路径','
  //pipid渠道ID,现在只有三个。
  //codeid如果是签到码，传入企业id。如果是经纪人，传入经纪人ID。如果是渠道推广，传入空；
  //sencname如果是企业签到，传入企业名称。如果是经纪人，传入经纪人名称。如果是渠道，传入渠道名称。
  //userinfid如果是企业签到，留空，如果是经纪人，留空。如果是渠道，传入使用人ID列表。
  //userid角色ID。
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        pagename: "bsetpipcode",
        pipid,
        codeid,
        sencname,
        userinfid,
        userid
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("职位审核通过失败");
            resolve(false);
          }
        } else {
          console.log("职位审核通过失败");
          resolve(false);
        }
      }
    });
  });
}
//获取渠道二维码
function getTunnelCode(querystr = "") {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        pagename: "bgetpipcode",
        userid: Cookies.get("userid-b"),
        querystr
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          } catch (e) {
            console.log("职位审核通过失败");
            resolve(false);
          }
        } else {
          console.log("职位审核通过失败");
          resolve(false);
        }
      }
    });
  });
}
//删除渠道二维码
function deleteTunnelCode(codeid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        pagename: "bdelpipcode",
        userid: Cookies.get("userid-b"),
        codeid
      },
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log("职位审核通过失败");
            resolve(false);
          }
        } else {
          console.log("职位审核通过失败");
          resolve(false);
        }
      }
    });
  });
}
//账号设置中，账号判重
function repetitionAccout() {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIEnt,
      data: {
        type: "e",
        action: "chkusr",
        userid: Cookies.get("userid-b"),
        entid: Cookies.get("userid-b"),
        chktp: tp,
        chkval: val
      },
      dataType: "json",
      success: function(res) {
        const jsonRes = JSON.parse(res);
      }
    });
  });
}
//删除内部资料中的教育经历
function deleteEduHistory(pagename, cuserid, eduinfoid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "del",
        pagename,
        userid: Cookies.get("userid-b"),
        cuserid,
        eduinfoid
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log(e);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }
    });
  });
}
//删除内部资料中的工作经历
function deleteWorkHistory(pagename, cuserid, workinfoid) {
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "del",
        pagename,
        userid: Cookies.get("userid-b"),
        cuserid,
        workinfoid
      },
      dataType: "json",
      success: res => {
        if (res) {
          try {
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(true) : resolve(false);
          } catch (e) {
            console.log(e);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }
    });
  });
}
//获取职位的审核历史
function jobIdentifyHistory(jobid){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        pagename: 'bgetjoblistinfo',
        userid: Cookies.get("userid-b"),
        jobid,
      },
      dataType: "json",
      success: res => {
        if(res){
          try{
            const jsonRes = JSON.parse(res);
            jsonRes.status == "ok" ? resolve(jsonRes.msg) : resolve(false);
          }catch(e){
            console.log(e);
            resolve(false);
          }
        }else{
          resolve(false);
        }
        
      }
    });
  })
}
//获取职位的门店
function getJobsStore(entid, jobid){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        pagename: 'entjobaddrinfo',
        userid: Cookies.get("userid-b"),
        entid,
        jobid,
      },
      dataType: "json",
      success: res => {
        if(res){
          try{
            const jsonRes = JSON.parse(res);
            resolve(jsonRes);
          }catch(e){
            resolve(false);
          }
        }else{
          resolve(false);
        }
        
      }
    });
  })
}
//获取用户手机号
function getUserCell(cvid){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        pagename: 'bGetUserTelByCvid',
        userid: Cookies.get("userid-b"),
        cvid
      },
      dataType: "json",
      success: res => {
        if(res){
          try{
            const jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
                if(jsonRes.msg){
                  resolve(jsonRes.msg.psnProBaseSource.StrUserMobile);
                }else{
                  resolve(false);
                }
              }
          }catch(e){
            resolve(false);
          }
        }else{
          resolve(false);
        }
        
      }
    });
  })
}
//首页统计数据
function statisticsData(data){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      data: {
        action: "edit",
        pagename: 'bGetEntJobDataCount',
        userid: Cookies.get("userid-b"),
        QueryStr: JSON.stringify(data)
      },
      dataType: "json",
      success: res => {
        if(res){
          try{
            const jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
                if(jsonRes.msg){
                  let list = jsonRes.msg.jobCountList;
                  if(Array.isArray(list)){
                    //处理统计数据按省份，暂时保留 
                    // let part = [];
                    // list.forEach( r => {
                    //   if(part.length == 0){
                    //     part.push({
                    //       province: r.province,
                    //       open: false,
                    //       citys: [{
                    //         city: r.city,
                    //         nation: r.nation,
                    //         entcount: r.entcount,
                    //         jobcount: r.jobcount,
                    //         psncount: r.psncount
                    //       }]
                    //     });
                    //   }else{
                    //     let iCity;
                    //     let isExist = part.find( (p,i) => {
                    //       if(p.province == r.province){
                    //         iCity = i;
                    //         return p;
                    //       }
                    //     });
                    //     if(!isExist){
                    //       part.push({
                    //         province: r.province,
                    //         open: false,
                    //         citys: [{
                    //           city: r.city,
                    //           nation: r.nation,
                    //           entcount: r.entcount,
                    //           jobcount: r.jobcount,
                    //           psncount: r.psncount
                    //         }]
                    //       })
                    //     }else{
                    //       part[iCity].citys.push({
                    //         city: r.city,
                    //         nation: r.nation,
                    //         entcount: r.entcount,
                    //         jobcount: r.jobcount,
                    //         psncount: r.psncount
                    //       })
                    //     }
                    //   }
                    // })
                    resolve(list);
                  }else{
                    resolve(false);
                  }
                }else{
                  resolve(false);
                }
              }
          }catch(e){
            resolve(false);
          }
        }else{
          resolve(false);
        }
      }
    });
  })
}
//获取职能大类
function roleDivision(){
  return new Promise( resolve => {
    $.ajax({
        type: "get",
        url: APIPsn + '/Psninfo/GetInf',
        data: {
          pagename: "getmainjobfunc"
        },
        dataType: "json",
      success: res => {
        if(res){
          try{
            const jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              resolve(jsonRes.msg);
            }
          }catch(e){
            resolve(false);
          }
        }else{
          resolve(false);
        } 
      }
    });
  })
}
//获取职能小类
function roleOffspring(id){
  return new Promise( resolve => {
    $.ajax({
        type: "get",
        url: APIPsn + '/Psninfo/GetInf',
        data: {
          pagename: "getjobfunc",
          FuncCode: id
        },
        dataType: "json",
      success: res => {
        if(res){
          try{
            const jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              let list = jsonRes.msg;
              let sorts = [];
              list.forEach( l => {
                if(sorts.length == 0){
                  sorts.push({
                    sortname: l.funcindex,
                    children: [l.funcname]
                  })
                }else{
                  let site = "";
                  let isExist = sorts.find( (s,i) => {
                    if(s.sortname == l.funcindex){
                      site = i;
                      return s;
                    }
                  });
                  if(!isExist){
                    sorts.push({
                      sortname: l.funcindex,
                      children: [l.funcname]
                    })
                  }else{
                    sorts[site].children.push(l.funcname);
                  }
                }
              })
              resolve(sorts);
            }
          }catch(e){
            resolve(false);
          }
        }else{
          resolve(false);
        } 
      }
    });
  })
}
//根据code 获取地区信息
function codeToInfor(code){
  return new Promise(resolve => {
    $.ajax({
        type: "get",
        url: APIPsn + '/Psninfo/GetInf',
        data: {
          pagename: "getarea",
          NationCode: code
        },
        dataType: "json",
      success: res => {
        if(res){
          let data = JSON.parse(res);
          if(data.status == "ok"){
            resolve(data.msg);
          }else{
            resolve(false);
          }
        }else{
          resolve(false);
        }
      }
    })
  })
}
//新增经纪人
function addBroker(data){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bInitLinkUserInfo",
        strjson: JSON.stringify(data)
      },
      success: res => {
        let str = JSON.parse(res);
        resolve( str.status == "ok" ? true : false);
      }
    })
  })
}
//获取经纪人
function getBrokers(){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bGetLinkUserInfo",
      },
      success: res => {
        let str = JSON.parse(res);
        resolve(str.status == "ok" ? str.msg : false);
      }
    })
  })
}
//生成推广码
function createPromo(data){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bInitLintUserCode",
        strjson: JSON.stringify(data)
      },
      success: res => {
        let str = JSON.parse(res);
        resolve(str.status == "ok" ? str.msg : false);
      }
    })
  })
}
//获取经纪人的二维码列表
function brokerCode(id){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: id,
        pagename: "bGetLintUserCode"
      },
      success: res => {
        if(res){
          let str = JSON.parse(res);
          resolve(str.status == "ok" ? str.msg : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}
//根据pubid获取职位信息
function pubidGetJobInfo(pubid){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pubid,
        pagename: "bGetEntJobListByPubid"
      },
      success: res => {
        if(res){
          let str = JSON.parse(res);
          resolve(str.status == "ok" ? str.msg : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}
//删除经济人推广码
function deletePromoCode(id){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "del",
        userid: Cookies.get("userid-b"),
        codeid: id,
        pagename: "bDelLintUserCode"
      },
      success: res => {
        if(res){
          let str = JSON.parse(res);
          resolve(str.status == "ok" ? true : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}
//新建成员判断是否重复
function repalicatePhone(data, id = "", type = "b"){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: id, //被查者的id, 新用户为空, 否则用户id
        usertype: type, //用户角色， b => b角， p =>个人, e =>企业
        chkval: data, //检查的数据 手机/邮箱/用户名
        pagename: "bCheckUserInfo"
      },
      success: res => {
        if(res){
          let str = JSON.parse(res);
          resolve(str.status == "ok" ? true : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}
//设置服务城市
function setServeCity(code){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bsetcity",
        nation: code
        // pcode: data.province,
        // ccode: data.city,
        // acode: data.area
      },
      success: res => {
        let str = JSON.parse(res);
        resolve( str.status == "ok" ? true : false);
      }
    })
  })
}
//删除服务城市
function delServeCity(code){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "del",
        userid: Cookies.get("userid-b"),
        pagename: "bsetcity",
        nation: code
      },
      success: res => {
        let str = JSON.parse(res);
        resolve( str.status == "ok" ? true : false);
      }
    })
  })
}
//获取服务城市
function getServeCity(){
  //getservercity
  return new Promise(resolve => {
    $.ajax({
        type: "get",
        url: APIPsn + '/Psninfo/GetInf',
        data: {
          pagename: "getservercity"
        },
        dataType: "json",
      success: res => {
        if(res){
          let data = JSON.parse(res);
          if(data.status == "ok"){
            resolve(data.msg);
          }else{
            resolve(false);
          }
        }else{
          resolve(false);
        }
      }
    })
  })
}
//获取所有省份
function provinces(){
  return new Promise(resolve => {
    $.ajax({
        type: "get",
        url: APIPsn + '/Psninfo/GetInf',
        data: {
          pagename: "getallprovince"
        },
        dataType: "json",
      success: res => {
        if(res){
          const raw = `{"msg": ${res}}`;
          let data = JSON.parse(raw);
          resolve(data.msg);
        }else{
          resolve(false);
        }
      }
    })
  }) 
}
//获取省份下的所有城市
function citys(code){
  return new Promise(resolve => {
    $.ajax({
        type: "get",
        url: APIPsn + '/Psninfo/GetInf',
        data: {
          pagename: "getallcity",
          NationCode: code
        },
        dataType: "json",
      success: res => {
        if(res){
          const raw = `{"msg": ${res}}`;
          let data = JSON.parse(raw);
          resolve(data.msg);
        }else{
          resolve(false);
        }
      }
    })
  })
}
//获取城市下的所有区县
function areas(code){
  return new Promise(resolve => {
    $.ajax({
        type: "get",
        url: APIPsn + '/Psninfo/GetInf',
        data: {
          pagename: "getallarea",
          NationCode: code
        },
        dataType: "json",
      success: res => {
        if(res){
          const raw = `{"msg": ${res}}`;
          let data = JSON.parse(raw);
          resolve(data.msg);
        }else{
          resolve(false);
        }
      }
    })
  })
}
//刷新地图坐标点
function refreshPoints(){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bResetPointInfo"
      },
      success: res => {
        let str = JSON.parse(res);
        resolve( str.status == "ok" ? true : false);
      }
    })
  })
}
//清除发布职位的缓存
function clearJobCache(){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bResetJobStatusRedis"
      },
      success: res => {
        let str = JSON.parse(res);
        resolve( str.status == "ok" ? true : false);
      }
    })
  })
}
// 获取所有待审核的企业列表
function entApplyList(currpage = 1, status = 2, countNum = 10){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bGetEntChkList",
        currpage,
        status,
        countNum,
        qerystr: "",
      },
      success: res => {
        if(res){
          let str = JSON.parse(res);
          resolve( str.status == "ok" ? {totalnum: str.totalnum, list: str.msg} : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}
// 通过/拒绝企业审核
function validateCompany(entid, entApprove){
  return new Promise( resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bSetEntChkList",
        entid,
        entApprove
      },
      success: res => {
        let str = JSON.parse(res);
        resolve( str.status == "ok" ? {totalnum: str.totalnum, list: str.msg} : false);
      }
    })
  })
}

// 获取企业发布的职位审核列表
function entValidateJob(countnum = 10, currpage = 1){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "entWorkProgress",
        currpage,
        countnum
      },
      success: res => {
        let str = JSON.parse(res);
        resolve(str.status === "ok" ? str.msg : false);
      }
    })
  })
}

// passentjob
// 通过企业职位
function passEntJob(jobid){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "passentjob",
        msg: {
          jobid
        }
      },
      success: res => {
        let str = JSON.parse(res);
        resolve(str.status === "ok" ? str.msg : false);
      }
    })
  })
}

// 拒绝企业职位
function refuseEntJob(jobid){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "closeentjob",
        msg:{
          content: "",
          jobid
        },
      },
      success: res => {
        let str = JSON.parse(res);
        resolve(str.status === "ok" ? str.msg : false);
      }
    })
  })
}

 // 新增项目定义
function addProjectCategory(data){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bSaveComObjType",
        jsonstr: JSON.stringify(data)
      },
      success: res => {
        let str = JSON.parse(res);
        resolve(str.status === "ok" ? true : false);
      }
    })
  })
}

// 获取用户定义的项目类别
function getCategory(){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bGetComObjTypeList"
      },
      success: res => {
        let str = JSON.parse(res);
        if(str.status === "ok"){
          resolve(Array.isArray(str.msg) ? str.msg : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}

// 创建项目
function createProject(data){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bSaveComObj",
        jsonstr: JSON.stringify(data)
      },
      success: res => {
        let str = JSON.parse(res);
        resolve(str.status === "ok" ? true : false);
      }
    })
  })
}

// 获取项目列表
function getProjectList(pageNum = 1){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bGetObjList",
        countNum: 10,
        currpage: pageNum,
      },
      success: res => {
        let str = JSON.parse(res);
        if(str.status === "ok"){
          resolve(str.msg ? str.msg : false);
        }else{
          resolve(false);
        }
      }
    })
  }) 
}

// 获取部门下的所有人员
function departmentMember(instcode){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bGetUserInfoByInstcode",
        instcode
      },
      success: res => {
        try{
          if(res){
            let str = JSON.parse(res);
            resolve(str.status === "ok" ? str.msg : false);
          }else{
            resolve(false);
          }
        }catch(e){
          resolve(false);
        }
      }
    })
  })
}

// 重置用户下级列表
function refreshInferior(id){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: id ? id : Cookies.get("userid-b"),
        pagename: "bReInsetUserList",
      },
      success: res => {
        let str= JSON.parse(res);
        console.log(str);
      }
    })
  })
}

// 获取企业绑定的企业
function projectCompany(data){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bGetEntList",
        strjson: JSON.stringify(data)
      },
      success: res => {
        if(res){
          let str = JSON.parse(res);
          console.log(str);
          resolve(str.status === "ok" ? {msg: str.msg, totalcount: str.totalcount} : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}
// 获取企业绑定的职位 
function projectJobs(data){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bGetObjJobList",
        strjson: JSON.stringify(data)
      },
      success: res => {
        if(res){
          let str = JSON.parse(res);
          resolve(str.status === "ok" ? {msg: str.msg, totalcount: str.totalcount} : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}
// 项目绑定企业
function bindCompany(data){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bSaveEntList",
        strjson: JSON.stringify(data)
      },
      success: res => {
       if(res){
          let str= JSON.parse(res);
          resolve(str.status === "ok" ? true : false);
       }else{
         resolve(false);
       }
      }
    })
  })
}
// 项目绑定职位
function bindJobs(data){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bSaveJobList",
        strjson: JSON.stringify(data)
      },
      success: res => {
        if(res){
          let str= JSON.parse(res);
          resolve(str.status === "ok" ? true : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}
// 直接绑定职位
function jobBindProject(data){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "save",
        userid: Cookies.get("userid-b"),
        pagename: "bSaveJobListAndEnt",
        strjson: JSON.stringify(data)
      },
      success: res => {
        if(res){
          let str= JSON.parse(res);
          resolve(str.status === "ok" ? true : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}
// 获取企业账号信息
function companyAccountInformation(entid){
  return new Promise(resolve => {
    $.ajax({
      type: "post",
      url: APIB,
      dataType: "json",
      data: {
        action: "edit",
        userid: Cookies.get("userid-b"),
        pagename: "bgetentacct",
        entid
      },
      success: res => {
        if(res){
          let str= JSON.parse(res);
          resolve(str.status === "ok" ? true : false);
        }else{
          resolve(false);
        }
      }
    })
  })
}

// 
export default {
  joblistInCompany,
  jobsEnrolment,
  offlineJob,
  jobLocation,
  publishCompany,
  verityJob,
  getJobInfor,
  userInfo,
  deliveryHistory,
  getDepartment,
  addAdmin,
  purviewGroup,
  purviewGroupList,
  groupMember,
  accountInformation,
  saveAccountInformation,
  setInferiorPurview,
  getMemberPurview,
  userLogin,
  getAllCompany,
  jobDeliveryNum,
  getAllTalents,
  getJobInformation,
  deliveryList,
  addDepartment,
  deleteDepartment,
  manipulateJob,
  getCompanyInformation,
  createCompanyAccount,
  iterateName,
  getInterviewInformation,
  deliveryTalents,
  approveTalentDelivery,
  refuseTalentDelivery,
  getTotalJobList,
  uploadImage,
  getCompanyImages,
  deletePic,
  uploadAvatar,
  jobsMeetEnrolment,
  jobMeetDeliveryNum,
  searchRepetition,
  companyQCode,
  jobProgressEnrolment,
  addProfessionTags,
  saveResumeInformation,
  getCellNumber,
  identifyJobPublish,
  manipulateInterview,
  getTunnelInformation,
  getTunnelPath,
  getTunnelCode,
  deleteTunnelCode,
  refuseJobPublish,
  initBaseResume,
  saveBaseResume,
  savePersonalTags,
  repetitionAccout,
  deleteEduHistory,
  deleteWorkHistory,
  jobIdentifyHistory,
  getJobsStore,
  getUserCell,
  statisticsData,
  roleDivision,
  roleOffspring,
  codeToInfor,
  addBroker,
  getBrokers,
  createPromo,
  brokerCode,
  pubidGetJobInfo,
  deletePromoCode,
  repalicatePhone,
  setServeCity,
  getServeCity,
  provinces,
  citys,
  areas,
  delServeCity,
  refreshPoints,
  clearJobCache,
  entApplyList,
  validateCompany,
  entValidateJob,
  passEntJob,
  refuseEntJob,
  addProjectCategory,
  departmentMember,
  getCategory,
  createProject,
  getProjectList,
  refreshInferior,
  projectCompany,
  bindCompany,
  bindJobs,
  projectJobs,
  jobBindProject,
  companyAccountInformation
};
</script>
