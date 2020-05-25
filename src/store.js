import Vue from 'vue'
import Vuex from 'vuex'
import m_addCompany from './store/addCompany';
import m_companyIdenfity from './store/companyIdentify';
import m_introduction from './store/companyIntroduction';
import m_jobs from './store/jobs';
import m_talents from './store/talents';
import m_staff from './store/staff';
import m_publish from './store/publish';
//最正式的地区数据, 找机会都换成使用这个数据的方法
import MainArea from './store/mainArea';
//新增成员
import m_addMember from './store/addMember';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    //添加企业
    ADDCOMPANY: m_addCompany,
    //企业认证
    IDENTIFY: m_companyIdenfity,
    //企业基本信息
    COMPANYINTRODUCTION: m_introduction,
    //关于职位的操作与信息
    JOBS: m_jobs,
    //人才管理
    TALENTS: m_talents,
    //B角角色
    STAFF: m_staff,
    PUBLISH: m_publish,
    //新增成员
    ADDMEMBER: m_addMember
  },
  state: {
    login: null,
    adminName: "",
    province: MainArea.province, //正式的省份数据
    city: MainArea.city, //正式的城市数据
    areas: MainArea.area, //正式的区域数据
    instcode: "", //机构码
    instname: "", //机构名
    instnation: "",//当前账号所属城市
    //权限
    purview: {
      //企业查看
      checkCompany: null,  //1
      //企业管理
      manageCompany: null, //1
      //职位管理
      manageJob: null, //1
      //生成企业账号
      createCompanyAccount: null,
      //职位审核
      verityJob: null, //1
      //职位列表
      jobList: null, //1
      //人才查询
      searchTalent: null, //1
      //新增人才
      addTalent: null,
      //人才认领
      claimTalent: null,
      //解析渠道
      analyzeChannel: null,
      //电话中心
      phoneCentral: null,
      //用户申请
      talentEnrolment: null, //1
      //机构管理
      manageAgency: null, //1
      //人员管理
      manageTalent: null, //1
      //权限管理
      managePurview: null, //1
      //系统设置
      setupSystem: null //1
    }

  },
  getters: {
    getLogin(state) {
      return state.login;
    },
    //正式 code转 对象
    codeToggleObj(state) {
      return function (code) {
        if (!code && code == "000000") return;
        if (typeof code != 'number' && typeof code != 'string') return;
        if (typeof code == 'number') code = code.toString(); //数字转字符串
        if (code.length < 6) return;
        let isCity = false;
        let isProvince = false;
        //先判断是啥类型的数据,减少循环次数
        const num4 = code.slice(-4); //后四位判断是否只是省份
        const num2 = code.slice(-2); //后两位判断是否只是城市
        //省 前两位
        const pCode = code.substr(0, 2);
        //市 前四位
        const cCode = code.substr(0, 4);
        //区 //全匹配
        if (num4 == '0000') {
          isProvince = true;
        } else if (num2 == '00') {
          isCity = true;
        }
        let province = null; //省份
        let city = null; //城市
        let area = null; //区域
        for (let i = 0; i < state.province.length; i++) {
          // if (this.province.code)
          if (state.province[i].code.substr(0, 2) == pCode) {
            province = state.province[i];
            break;
          }
        }
        if (isProvince) {
          return {
            province: province,
            city: '',
            area: ''
          };
        }
        if (isCity) {
          city = cityMatch();
          return {
            province: province,
            city: city,
            area: ''
          };
        }
        //选择区
        for (let i = 0; i < state.areas.length; i++) {
          if (state.areas[i].code == code) {
            area = state.areas[i];
            break;
          }
        }
        city = cityMatch();
        return {
          province: province,
          city: city,
          area: area
        };
        //匹配城市
        function cityMatch() {
          let city = null;
          for (let i = 0; i < state.city.length; i++) {
            if (state.city[i].code.substr(0, 4) == cCode) {
              city = state.city[i];
              return city;
            }
          }
        }
      }
    },
    //正式 格式化输出地名 根据code转地区返回的数据格式来返回地区名字
    localName(state) {
      return function (obj, sign) { //sign 分隔符
        if (!obj) return;
        if (obj == "000000") return "全国";
        if (!sign) sign = '-';
        let cityName = '';
        obj.city ? cityName = obj.city.name : cityName = obj.province.name;
        if (obj.area) {
          return obj.province.name + sign + cityName + sign + obj.area.name;
        }
        if (obj.city) {
          return obj.province.name + sign + cityName;
        }
        if (obj.province) {
          return obj.province.name;
        }
      };
    },
    //表单输入监测
    checkNorm() {
      //password(密码) mail(邮箱验证) phone(电话验证) username(名称验证) license(许可证)
      return function (type, str, neglect) {
        let errorMsg = '';
        if (!neglect) { //如果是必须的则判断是否存在
          if (str == undefined || str.trim() == '') { //判断是否为空
            errorMsg = '不能为空';
            return errorMsg;
          }
        }

        if (type == 'password') { //密码判断
          let reg = /^.*(?=.{6,18}).*$/;
          if (!reg.test(str)) {
            errorMsg = '密码格式错误';
          }
        }
        if (type == 'mail') { //邮箱判断
          let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
          if (!reg.test(str)) {
            errorMsg = '邮箱格式错误';
          }
        }
        if (type == 'phone') { //手机判断
          let reg = /^1[34578]\d{9}$/;
          if (!reg.test(str)) {
            errorMsg = '手机号格式错误';
          }
        }
        if (type == 'username') { //用户名判断
          let reg = /^[a-zA-Z0-9_-]{4,16}$/;
          if (!reg.test(str)) {
            errorMsg = '用户名格式错误';
          }
        }
        if (type == 'license') { //营业执照格式判断
          let reg = /^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$/;
          if (!reg.test(str)) {
            errorMsg = '营业执照格式错误';
          }
        }
        return errorMsg;
      };
    },
    //时间转换
    //日
    formatDate(state) {
      return function (time, caret = '.') {
        let formatDate;
        if (!time) {
          formatDate = new Date();
        } else {
          formatDate = new Date(time);
        }

        return `${formatDate.getFullYear()}${caret}${formatDate.getMonth() + 1}${caret}${formatDate.getDate()}`;
      };
    },
    //月
    formatMonth(state) {
      return function (time, caret = '.') {
        let formatDate = new Date(time);
        return `${formatDate.getFullYear()}${caret}${formatDate.getMonth() + 1}`;
      };
    },
    //时分秒
    formatMins(state) {
      return function (time, caret = ':') {
        let formatDate = new Date(time);
        return `${formatDate.getHours()}${caret}${formatDate.getMinutes()}${caret}${formatDate.getSeconds()}`;
      };
    },
    //判断字符串中是否有中文
    stringHasChinese(state) {
      return function(str){
        let has = false;
        for (let i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) > 255) {
            console.log(str[i]);
            has = true;
          }
        }
        return has;
      };
    },
    //base64 转file
    base64ToFile(state, base64, fileName) {
      return function (base64, fileName) {
        var arr = base64.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        let blobFile = new Blob([u8arr], {
          type: mime
        });
        blobFile.lastModifiedDate = new Date();
        blobFile.name = fileName;
        return blobFile;
      };
    },
  },
  mutations: {
    setAdminName(state, n) {
      state.adminName = n;
    },
    setLogin(state, status) {
      state.login = status;
    },
    //权限设置
    admissonList(state, powerList) {
      //设置instcode 
      state.instcode = powerList[0].strinstcode;
      state.instname = powerList[0].strinstname;
      //TNtLke:从这个接口中获取当前账号所在城市
      state.instnation = (powerList[0].strnations && powerList[0].strnations != '000000') ? powerList[0].strnations : 'all';
      //设置对应的权限
      if (Array.isArray(powerList)) {
        powerList.forEach((purview) => {
          let powercode = purview.powercode;
          switch (powercode) {
            case '10000000-0000-0000-0000-000000000001': //企业查看
              state.purview.checkCompany = purview;
              break;
            case '10000000-0000-0000-0000-000000000002': //企业管理
              state.purview.manageCompany = purview;
              break;
            case '10000000-0000-0000-0000-000000000003': //职位管理
              state.purview.manageJob = purview;
              break;
            case '10000000-0000-0000-0000-000000000004': //生成账号
              state.purview.createCompanyAccount = purview;
              break;
            case '10000000-0000-0000-0000-000000000011': //职位审核
              state.purview.verityJob = purview;
              break;
            case '10000000-0000-0000-0000-000000000021': //职位列表
              state.purview.jobList = purview;
              break;
            case '20000000-0000-0000-0000-000000000001': //人才查询
              state.purview.searchTalent = purview;
              break;
            case '20000000-0000-0000-0000-000000000002': //新增人才
              state.purview.addTalent = purview;
              break;
            case '20000000-0000-0000-0000-000000000003': //人才认领
              state.purview.claimTalent = purview;
              break;
            case '20000000-0000-0000-0000-000000000011': //解析渠道
              state.purview.analyzeChannel = purview;
              break;
            case '20000000-0000-0000-0000-000000000021': //电话中心
              state.purview.phoneCentral = purview;
              break;
            case '20000000-0000-0000-0000-000000000031': //申请管理
              state.purview.talentEnrolment = purview;
              break;
            case '30000000-0000-0000-0000-000000000001': //机构管理
              state.purview.manageAgency = purview;
              break;
            case '30000000-0000-0000-0000-000000000011': //人员管理
              state.purview.manageTalent = purview;
              break;
            case '30000000-0000-0000-0000-000000000033': //权限管理
              state.purview.managePurview = purview;
              break;
            case '30000000-0000-0000-0000-000000000099': //系统设置
              state.purview.setupSystem = purview;
              break;
          }
        });
      }

    }
  },
  actions: {


  }
})