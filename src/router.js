import Vue from 'vue';
import Router from 'vue-router';

import Home from './components/homePage.vue';
import Progress from './components/workProgress.vue';
//人才库
import Pool from './components/workPool.vue';
//申请管理
import ApplyManage from './views/applyManage.vue';
import WorkHistory from './components/bHistoryWorkPool.vue';
import Entry from './components/bResumeEntry.vue';
import Form from './components/bFormPage.vue';
import AccountSetting from './views/setting.vue';
//管理团队
import Team from './views/team.vue';
import EntServer from './components/bEntServer.vue';
//职位审核
import Review from './views/review.vue';
//企业认证
import Approve from './views/approveCompany.vue';
//企业列表
import CompanyList from './views/CompanyList.vue';
//职位管理
import JobManage from './views/jobManage.vue';
//人才管理
import StaffManage from './views/staffManage.vue';
//经纪人管理
import broker from './views/broker.vue';
//简历页
import Resume from './views/resume.vue';
// 职位的投递情况
import JobProgress from './components/jobProgress';
//渠道推广
import TunnelPromote from './views/tunnelPromote.vue';
//面试管理
import InterviewManage from './views/interviewManage.vue';
//服务城市设置
import ServeCitys from "./views/serveCity.vue";
//系统的设置仅BB可见
import System from "./views/system.vue";
//机构管理
import Manage from "./views/employManagement.vue";
//企业申请管理
import EntApply from "./views/entApplyManage.vue";
// 项目管理
import ProjectManage from "./views/projectManage.vue";
Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
    meta:{}
  }, {
    path: '/progress',
    name: 'progress',
    component: Progress,
    meta:{}
  }, {
    path: '/jobprogress',
    name: 'jobprogress',
    component: JobProgress,
    meta: {}
  }, {
    path: '/resume',
    name: 'resume',
    component: Resume,
    meta: {}
  }, // {
  //   path: '/pool',
  //   name: 'pool',
  //   component: Pool}
  {
    path: '/apply-manage',
    name: 'ApplyManage',
    component: ApplyManage,
    meta: {}
  }, {
    path: '/history',
    name: 'history',
    component: WorkHistory,
    meta: {}
  }, {
    path: '/entry',
    name: 'entry',
    component: Entry,
    meta:{}
  }, {
    path: '/form',
    name: 'form',
    component: Form,
    meta: {}
  }, {
    path: '/accset',
    name: 'accset',
    component: AccountSetting,
    meta: {}
  }, {
    path: '/team',
    name: 'team',
    component: Team,
    meta: {}
  }, {
    path: '/entserver',
    name: 'entserver',
    component: EntServer,
    meta: {}
  }, {
    path: '/review',
    name: 'Review',
    component: Review,
    meta: {}
  }, {
    path: '/approve',
    name: "Approve",
    component: Approve,
    meta: {}
  }, {
    path: '/company-list',
    name: "CompanyList",
    component: CompanyList,
    meta: {}
  }, {
    path: '/job-manage',
    name: 'JobManage',
    component: JobManage,
    meta: {}
  }, {
    path: '/staff-manage',
    name: 'StaffManage',
    component: StaffManage,
    meta: {}
  }, {
    path: '/broker',
    name: 'broker',
    component: broker,
    meta: {}
    }, {
      path: '/tunnel-promote',
      name: 'TunnelPromote',
      component: TunnelPromote,
      meta:{}
    }, {
      path: '/interview-manage',
      name: 'InterviewManage',
      component: InterviewManage,
      meta:{}
    }, {
      path: '/serve-city',
      name: 'ServeCitys',
      component: ServeCitys,
      meta: {}
    }, {
      path: '/system',
      name: 'System',
      component: System,
      meta: {}
    }, {
    path: '/manage',
    name: 'Manage',
    component: Manage,
      meta: {}
     }, {
      path: '/ent-apply',
      name: 'EntApply',
      component: EntApply,
      meta: {}
    }, 
    {
       path: '/project-manage',
       name: 'ProjectManage',
       component: ProjectManage,
       meta: {}
     }
    ],
  }
);
// router.beforeEach((to, from, next) => {
//   document.title = to.meta.title ? to.meta.title : "心职";
//   next();
// });
export default router;