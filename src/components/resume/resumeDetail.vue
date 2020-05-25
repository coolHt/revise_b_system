<template>
  <div class="xz_detail_resume">
    <transition name="loadShadow">
      <div class="loadShadow" v-show="saveResumeing">
        <i class="loadBlock"></i>
      </div>
    </transition>
    <div class="xz_detail_center">
      <div class="xz_detail_part">
        <p class="xz_detail_part_title">沟通备注</p>
        <div class="noteCon">
          <label class="note_inputLabel">备注：</label>
          <textarea v-model="personalTag" class="noteArea" @input="wordsConunt"></textarea>
          <span class="confineWords"> {{words}} / {{maxWords}}</span>
          <div class="noteExample">
            <button @click="saveNote" class="xz_add_history" type="button">保存</button>
            <div>
              <p>1、和用户沟通情况不是很好</p>
              <p>2、用户未接电话</p>
            </div>
          </div>
        </div>
      </div>
      <div class="xz_detail_part">
        <p class="xz_detail_part_title">基本信息</p>
        <div class="xz_double_part">
          <IdentifyInput width="200px" labelText="用户姓名：" :inputValue="psnName.value"
            @returnValue="returnPsnName"></IdentifyInput>
          <div class="customField">
            <p class="customField_title">性别：</p>
            <el-select v-model="gender" placeholder="请选择">
              <el-option v-for="item in genderList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="xz_double_part">
          <div class="customField">
            <p class="customField_title">出生日期：</p>
            <el-date-picker
              v-model="birthDate"
              default-value="1995,10,10"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="customField">
            <p class="customField_title">最高学历：</p>
            <el-select v-model="diploma" placeholder="请选择">
              <el-option v-for="item in diplomaList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="xz_double_part">
          <div class="customField">
            <p class="customField_title">工作年限：</p>
            <el-select v-model="workYears" placeholder="请选择">
              <el-option v-for="item in workYearsList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="customField">
            <p class="customField_title">籍贯：</p>
            <MRegion class="custom-region" :fullrange="true" :selected="bornNation" @cRegion="getBornNation"
              :search="true"></MRegion>
          </div>
        </div>
      </div>
    <div class="xz_detail_center">
      <div class="xz_detail_part">
        <p class="xz_detail_part_title">个人资料</p>
        <div class="xz_double_part">
          <IdentifyInput width="200px" labelText="当前公司：" :inputValue="currentCompany.value"
            @returnValue="returnCompany"></IdentifyInput>

          <IdentifyInput width="200px" labelText="当前职位：" :inputValue="currentJob.value" @returnValue="returnJob">
          </IdentifyInput>
        </div>
        <div class="xz_double_part">
          <IdentifyInput width="200px" labelText="当前年薪：" :inputValue="currentSalary.value" @returnValue="returnSalary" category="number">
          </IdentifyInput>
          <div class="customField">
            <p class="customField_title">当前状态：</p>
            <el-select v-model="currentStatus" placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="xz_double_part">
          <div class="customField">
            <p class="customField_title">现居住地：</p>
            <MRegion class="custom-region" :fullrange="true" :selected="currentSelected" @cRegion="currentRegion"
              :search="true"></MRegion>
          </div>

          <div class="customField">
            <p class="customField_title">婚姻状况：</p>
            <el-select v-model="marriage" placeholder="请选择">
              <el-option v-for="item in marriageList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="xz_double_part">
          <div class="customField">
            <p class="customField_title">工作年份：</p>
            <el-date-picker v-model="startWorkYear" type="year" placeholder="选择年">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="xz_detail_part">
        <p class="xz_detail_part_title">求职意向</p>
        <div class="xz_double_part">
          <IdentifyInput width="200px" labelText="期望工作：" :inputValue="intentWork.value" @returnValue="returnIntentWork">
          </IdentifyInput>

          <IdentifyInput width="200px" labelText="期望年薪：" :inputValue="intentSalary.value"
            @returnValue="returnIntentSalary" category="number"></IdentifyInput>
        </div>
        <div class="xz_double_part">
          <div class="customField">
            <p class="customField_title">期望地点：</p>
            <MRegion class="custom-region" :fullrange="true" :selected="intentSelected" @cRegion="intentRegion"
              :search="true"></MRegion>
          </div>
          <div class="customField">
            <p class="customField_title">期望职能：</p>
            <div class="jobfunbox">
              <input class="jobFunInput mustFill" name='functions' type="text" placeholder="输入职能"
                v-model='jobFun' autocomplete="off" @input="searchKeyWord" ref="jobFunInput"
                @blur="checkentjobfun">
              <i class="jobFunIcon fa fa-calendar-o" aria-hidden="true" @click="jobfunVisible=true"></i>
              <div class="searchResult" v-show="hasResult">
                <ul>
                  <li v-for="(result,index) in searchResult" :key="index">
                    <div class="resuleLine leveltop" @click="chooseResult($event)">{{result.level1}}</div>
                    <div class="resuleLine levelchild" v-for="(r1,i2) in result.level2" @click="chooseResult($event)">
                      {{r1}}</div>
                    <div class="resuleLine levelchild" v-for="(r2,i2) in result.level3" @click="chooseResult($event)">
                      {{r2}}</div>
                    <div class="resuleLine levelchild" v-for="(r3,i3) in result.level4" @click="chooseResult($event)">
                      {{r3}}</div>
                  </li>
                </ul>
              </div>
              <!-- <span class="error_alert_error">请填写职能分类</span> -->
            </div>
          </div>
        </div>
      </div>

      <div class="xz_detail_part">
        <p class="xz_detail_part_title">工作经历</p>
        <div class="wx_history" v-if="wx_historyList.length > 0">
          <ul class="wx_history_list">
            <li class="wx_list_item" v-for="(item, index) in wx_historyList" :key="index">
              <div class="wx_history_content">
                <span>{{item.psnCompany}}</span>
                <span>{{item.psnJob}}</span>
              </div>
              <div style="display:flex;">
                <div class="wx_date">
                  <span>{{item.psnWorkStartTime}} - {{item.psnWorkEndTime}}</span>
                </div>
                <div class="wx_edit">
                  <i @click="workHistory_edit(index)">编辑</i>
                  <i @click="workHistory_delete(index)">删除</i>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="xz_work_edit">
          <div class="xz_double_part">
            <IdentifyInput width="200px" labelText="公司名称：" :inputValue="history_company.value"
              @returnValue="returnHistory_company"></IdentifyInput>
            <IdentifyInput width="200px" labelText="职位名称：" :inputValue="history_job.value"
              @returnValue="returnHistory_job"></IdentifyInput>
          </div>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">开始时间：</p>
              <el-date-picker v-model="workStartTime" type="month" placeholder="选择月">
              </el-date-picker>
            </div>
            <div class="customField">
              <p class="customField_title">结束时间：</p>
              <el-date-picker v-model="workEndTime" type="month" placeholder="选择月">
              </el-date-picker>
            </div>
          </div>
          <div class="xz_add_btn">
            <button class="xz_add_history" @click="saveWorkExperience">添加</button>
            <button class="xz_add_cancel" @click="clearWorkHistory">取消</button>
          </div>
        </div>
      </div>
      <div class="xz_detail_part">
        <p class="xz_detail_part_title">教育经历</p>
        <div class="wx_history" v-if="wx_educationList.length > 0">
          <ul class="wx_history_list">
            <li class="wx_list_item" v-for="(item, index) in wx_educationList" :key="index">
              <div class="wx_history_content">
                <span>{{item.psnSchool}}</span>
                <span>{{item.psnMajor}}</span>
              </div>
              <div style="display:flex;">
                <div class="wx_date">
                  <span>{{item.psnEduStartTime}} - {{item.psnGradTime}}</span>
                </div>
                <div class="wx_edit">
                  <i @click="educationHistory_edit(index)">编辑</i>
                  <i @click="educationHistory_delete(index)">删除</i>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="xz_work_edit">
          <div class="xz_double_part">
            <IdentifyInput width="200px" labelText="学校名称：" :inputValue="history_school.value"
              @returnValue="returnHistory_school"></IdentifyInput>
            <IdentifyInput width="200px" labelText="专业名称：" :inputValue="history_profession.value"
              @returnValue="returnHistory_profession"></IdentifyInput>
          </div>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">入学时间：</p>
              <el-date-picker v-model="educationStartTime" type="month" placeholder="选择月">
              </el-date-picker>
            </div>
            <div class="customField">
              <p class="customField_title">毕业时间：</p>
              <el-date-picker v-model="educationEndTime" type="month" placeholder="选择月">
              </el-date-picker>
            </div>
          </div>
          <div class="xz_add_btn">
            <button class="xz_add_history" @click="saveEducation">添加</button>
            <button class="xz_add_cancel" @click="clearEducationHistory">取消</button>
          </div>
        </div>
      </div>
      <div class="xz_detail_part">
        <p class="xz_detail_part_title">专业技能</p>
        <div class="wx_techique"></div>
        <div class="flexCenterContainer">
          <div class="tagsShow" v-if="professionArr.length > 0">
            <span v-for="(item, index) in professionArr" :key="index" class="tagsShowItem">{{item}}
              <img src="../../assets/images/delete.png" alt="" class="closeTag" @click="deleteProfession(index)">
            </span>
          </div>
          <IdentifyInput width="200px" labelText="技能名称：" :inputValue="profession.value" @returnValue="returnProfession">
          </IdentifyInput>
          <button class="xz_add_history" style="margin:0 0 0 15px" @click="pushProfession">添加</button>
        </div>
      </div>
    </div>
    <button type="button" class="xz_save_resume" @click="addResume">保存简历</button>
  </div>
  <!--职能 (假装是插件)-->
  <el-dialog title="选择职能" :visible.sync="jobfunVisible" width="1000px" :append-to-body="true">
    <JobFun @value="returnFun"></JobFun>
  </el-dialog>
  </div>
</template>
<script>
  import IdentifyInput from "../form/textInput";
  import JobFun from "../../plugins/JOBFUN";
  import xz from "../../common";
  //职能数据
  import funData from '../../store/funData';
  export default {
    components: {
      IdentifyInput,
      JobFun
    },
    props: {
      "resume": {
        type: Object,
        default: function () {
          return {};
        }
      },
      "baseResume": {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    data() {
      return {
         //
        funData: funData, //职能数据
        psnid: "", //个人id
        //保存简历加载
        saveResumeing: false,
        jobfunVisible: false,
        gender: "",
        birthDate: "",
        diploma: "",
        workYears: "",
        bornNation: "",
        workYearsList:[{
          value: "无经验",
          label: "无经验"
        },{
          value: "应届生",
          label: "应届生"
        },{
          value: "1-3年",
          label: "1-3年"
        },{
          value: "3-5年",
          label: "3-5年"
        },{
          value: "5-10年",
          label: "5-10年"
        },{
          value: "10年以上",
          label: "10年以上"
        }],
        diplomaList:[{
          value: "初中以下",
          label: "初中以下"
        },{
          value: "高中",
          label: "高中"
        },{
          value: "中专/技校",
          label: "中专/技校"
        },{
          value: "大专",
          label: "大专"
        },{
          value: "本科",
          label: "本科"
        },{
          value: "硕士",
          label: "硕士"
        },{
          value: "博士",
          label: "博士"
        }],
        genderList: [{
            value: "男",
            label: "男",
          },{
            value: "女",
            label: "女",
          },{
            value: "保密",
            label: "保密",
          }],
        marriageList: [{
            value: "未婚",
            label: "未婚",
          },
          {
            value: "已婚",
            label: "已婚",
          },
          {
            value: "已婚有孩子",
            label: "已婚有孩子",
          },
          {
            value: "已婚有多个孩子",
            label: "已婚有多个孩子",
          },
          {
            value: "保密",
            label: "保密",
          }
        ],
        statusList: [{
            value: "离职,正在找工作",
            label: "离职,正在找工作"
          },
          {
            value: "在职,急寻新工作",
            label: "在职,急寻新工作"
          },
          {
            value: "在职,看新的机会",
            label: "在职,看新的机会"
          },
          {
            value: "在职,暂无跳槽打算",
            label: "在职,暂无跳槽打算"
          }
        ],
        currentSalary: {
          value: "",
          identifyType: ""
        },
        currentCompany: {
          value: "",
          identifyType: ""
        },
        currentJob: {
          value: "",
          identifyType: ""
        },
        intentWork: {
          value: "",
          identifyType: ""
        },
        intentSalary: {
          value: "",
          identifyType: ""
        },
        history_school: {
          value: "",
          identifyType: ""
        },
        history_profession: {
          value: "",
          identifyType: ""
        },
        history_job: {
          value: "",
          identifyType: ""
        },
        history_company: {
          value: "",
          identifyType: ""
        },
        professionArr: [],
        profession: {
          value: "",
          identifyType: ""
        },
        personalTag: "",
        psnName: {
          value: "",
          identifyType: ""
        },
        //基本信息
        base: null,
        //基本信息
        psnBaseInfo: {
          psnName: '',
          psnNowJob: '',
          psnNowCompany: '',
          psnSex: '',
          psnAdd: '',
          psnCurrDate: '',
          psnNation: '', //籍贯
          psnEduLvl: "",
          psnWorkExp: "",
          psnAge: "",
          psnFromInfo: ""
        },
        //个人资料
        psnPersonInfo: {
          psnBirth: '',
          psnIndustry: '',
          psnLang: '',
          psnMarriage: '',
          psnPerNation: '',
          psnStartWork: '',
          psnWorkState: '',
          psnCurrSalary: ""
        },
        //求职意向
        psnJobIntentInfo: {
          psnIntentAdd: '',
          psnIntentInd: '',
          psnIntentJob: '',
          psnIntentJobType: '',
          psnIntentNation: '',
          psnIntentPay: '',
          psnStrFuncNames: '',
        },
        currentStatus: "",
        marriage: "",
        currentSelected: "",
        intentSelected: "",
        workStartTime: "",
        workEndTime: "",
        educationStartTime: "",
        educationEndTime: "",
        startWorkYear: "",
        //工作经历
        wx_historyList: [],
        //教育经历
        wx_educationList: [],
        //编辑的教育经历id
        educationId: "",
        //编辑的工作经历id
        workHistoryId: "",
        //职能
        jobFun: "",
        hasResult: false, //判断是否有结果
        searchResult: [], //关键字结果集,
        //字数限制
        words: 0,
        maxWords: 50
      }
    },
    mounted(){
      this.clearAll();
    },
    watch: {
      "resume": {
        handler: function () {
          if (this.resume) this.psnid = this.resume.orderid;
        },
        immediate: true
      },
      "baseResume": {
        handler: function () {
          this.clearAll(); //清理数据
          if (this.baseResume) {
            if(JSON.stringify(this.baseResume.innerResume) == "{}"){
              this.$set(this.psnBaseInfo, "psnName", this.baseResume.psnName);
              this.$set(this.psnName, "value", this.baseResume.psnName);
              this.$set(this.psnBaseInfo, "psnNowCompany", "");
              this.$set(this.currentCompany, "value", this.baseResume.psnNowCompany);
              this.$set(this.psnBaseInfo, "psnNowJob", "");
              this.$set(this.currentJob, "value", this.baseResume.psnNowJob);
              this.$set(this.psnBaseInfo, "psnEduLvl", this.baseResume.psnEduLvl);
              this.diploma = this.baseResume.psnEduLvl;
              this.$set(this.psnBaseInfo, "psnWorkExp", this.baseResume.psnWorkExp);
              this.workYears = this.baseResume.psnWorkExp;
              this.$set(this.psnBaseInfo, "psnSex", this.baseResume.psnSex);
              this.$set(this.psnBaseInfo, "psnSex", this.baseResume.psnSex)
              this.birthDate = this.baseResume.psnBirth;
            }
            else{
              let inner = this.baseResume.innerResume;
              let {psnBaseInfo, psnPersonInfo, psnJobIntentInfo, psnWorkInfo, psnEduInfo, psnKnowTag, psnSkillTag} = inner;

              if(psnBaseInfo.psnName){
                this.$set(this.psnName, "value", psnBaseInfo.psnName);
                this.$set(this.psnBaseInfo, "psnName", psnBaseInfo.psnName);
              }else{
                this.$set(this.psnBaseInfo, "psnName", this.baseResume.psnName); 
                this.$set(this.psnName, "value", this.baseResume.psnName);
              }

              if(psnBaseInfo.psnNowCompany){
                this.$set(this.currentCompany, "value", psnBaseInfo.psnNowCompany);
                this.$set(this.psnBaseInfo, "psnNowCompany", psnBaseInfo.psnNowCompany);
              }else{
                this.$set(this.currentCompany, "value", this.baseResume.psnNowCompany);
                this.$set(this.psnBaseInfo, "psnNowCompany", this.baseResume.psnNowCompany);
              }

              if(psnBaseInfo.psnNowJob){
                this.$set(this.currentJob, "value", psnBaseInfo.psnNowJob);
                this.$set(this.psnBaseInfo, "psnNowJob", psnBaseInfo.psnNowJob);
              }else{
                this.$set(this.currentJob, "value", this.baseResume.psnNowJob);
                this.$set(this.psnBaseInfo, "psnNowJob", this.baseResume.psnNowJob);
              }

              if(psnBaseInfo.psnEduLvl){
                this.diploma = psnBaseInfo.psnEduLvl;
                this.$set(this.psnBaseInfo, "psnEduLvl", psnBaseInfo.psnEduLvl);
              }else{
                this.diploma = this.baseResume.psnEduLvl;
                this.$set(this.psnBaseInfo, "psnEduLvl", this.baseResume.psnEduLvl);
              }

              if(psnBaseInfo.psnWorkExp){
                this.workYears = psnBaseInfo.psnWorkExp;
                this.$set(this.psnBaseInfo, "psnWorkExp", psnBaseInfo.psnWorkExp);
              }else{
                this.workYears = this.baseResume.psnWorkExp;
                this.$set(this.psnBaseInfo, "psnWorkExp", this.baseResume.psnWorkExp);
              }

              if(psnBaseInfo.psnSex){
                this.gender = psnBaseInfo.psnSex;
                this.$set(this.psnBaseInfo, "psnSex", psnBaseInfo.psnSex)
              }else{
                this.gender = this.baseResume.psnSex;
                this.$set(this.psnBaseInfo, "psnSex", this.baseResume.psnSex)
              }
              if(psnBaseInfo.psnNation) this.bornNation = psnBaseInfo.psnNation;
              //个人资料
              if(psnPersonInfo){
                //出生日期
                psnPersonInfo.psnBirth ? this.birthDate = psnPersonInfo.psnBirth : this.birthDate = this.baseResume.psnBirth;
                //现居住地
                if(psnPersonInfo.psnPerNation) this.currentSelected = psnPersonInfo.psnPerNation;
                //当前状态
                if(psnPersonInfo.psnWorkState) this.currentStatus = psnPersonInfo.psnWorkState;
                //婚姻状态
                if(psnPersonInfo.psnMarriage) this.marriage = psnPersonInfo.psnMarriage;
                //工作年份
                if(psnPersonInfo.psnStartWork) this.startWorkYear = psnPersonInfo.psnStartWork;
                //当前年薪
                if(psnPersonInfo.psnCurrSalary) this.$set(this.currentSalary, "value", psnPersonInfo.psnCurrSalary);
              }
              //求职意向
              if(psnJobIntentInfo){
                //期望地点
                if(psnJobIntentInfo.psnIntentNation) this.intentSelected = psnJobIntentInfo.psnIntentNation;
                //期望年薪
                if(psnJobIntentInfo.psnIntentPay) this.$set(this.intentSalary, "value", psnJobIntentInfo.psnIntentPay);
                //期望工作
                if(psnJobIntentInfo.psnIntentJob) this.$set(this.intentWork, "value", psnJobIntentInfo.psnIntentJob);
                //期望职能
                if(psnJobIntentInfo.psnStrFuncNames) this.jobFun = psnJobIntentInfo.psnStrFuncNames;
              }
              //工作经历
              if(psnWorkInfo){
                psnWorkInfo.forEach( i => {
                  i.psnWorkStartTime = this.$store.getters.formatMonth(i.psnWorkStartTime);
                  i.psnWorkEndTime = this.$store.getters.formatMonth(i.psnWorkEndTime);
                })
                this.wx_historyList = psnWorkInfo;
              }else{
                this.wx_historyList = [];
              }
              //教育经历
              if(psnEduInfo){
                psnEduInfo.forEach( i => {
                  i.psnEduStartTime = this.$store.getters.formatMonth(i.psnEduStartTime);
                  i.psnGradTime = this.$store.getters.formatMonth(i.psnGradTime);
                })
                this.wx_educationList = psnEduInfo;
              }else{
                this.wx_educationList = [];
              }
              //专业技能
              if(psnKnowTag) this.professionArr = psnKnowTag.split(',');
              //个人标签
              if(psnSkillTag){
                this.personalTag = psnSkillTag;
                this.words = psnSkillTag.length;
              }
            }
            this.$set(this.psnBaseInfo, "psnFromInfo", this.baseResume.source);
          }
        },
        immediate: true
      }
    },
    methods: {
      returnPsnName(v){
        this.$set(this.psnName, "value", v);
      },
      returnSalary(v) {
        this.$set(this.currentSalary, "value", v);
      },
      returnCompany(v) {
        this.$set(this.currentCompany, "value", v);
      },
      returnJob(v) {
        this.$set(this.currentJob, "value", v);
      },
      returnIntentWork(v) {
        this.$set(this.intentWork, "value", v);
      },
      returnIntentSalary(v) {
        this.$set(this.intentSalary, "value", v);
      },
      returnProfession(v) {
        this.$set(this.profession, "value", v);
      },
      returnHistory_job(v) {
        this.$set(this.history_job, "value", v);
      },
      returnHistory_company(v) {
        this.$set(this.history_company, "value", v);
      },
      returnHistory_school(v) {
        this.$set(this.history_school, "value", v);
      },
      returnHistory_profession(v) {
        this.$set(this.history_profession, "value", v);
      },
      //现居住地
      currentRegion(region) {
        if (region.area) {
          this.currentSelected = region.area.code;
        } else if (region.city) {
          this.currentSelected = region.city.code;
        } else {
          this.currentSelected = region.province.code;
        }
      },
      //期望地点
      intentRegion(region) {
        if (region.area) {
          this.intentSelected = region.area.code;
        } else if (region.city) {
          this.intentSelected = region.city.code;
        } else {
          this.intentSelected = region.province.code;
        }
      },
      //籍贯
      getBornNation(region){
        if (region.area) {
          this.bornNation = region.area.code;
        } else if (region.city) {
          this.bornNation = region.city.code;
        } else {
          this.bornNation = region.province.code;
        }
      },
      //编辑工作经历
      history_edit() {},
      //编辑工作经历
      workHistory_edit(i) {
        this.$set(this.history_company, "value", this.wx_historyList[i].psnCompany);
        this.$set(this.history_job, "value", this.wx_historyList[i].psnJob);
        this.workStartTime = this.wx_historyList[i].psnWorkStartTime;
        this.workEndTime = this.wx_historyList[i].psnWorkEndTime;
        this.workHistoryId = this.wx_historyList[i].workinfoid;
      }, 
      //删除工作经历
      workHistory_delete(i){
        xz.initBaseResume(Cookies.get("userid-b"), this.psnBaseInfo, this.psnid).then(id => {
          if (id) {
            let workId = this.wx_historyList[i].workinfoid;
            xz.deleteWorkHistory("psnworkinfoinner", id, workId).then(res => {
              if(res){
                //保存成功重新获取教育经历
                xz.userInfo(this.psnid).then( res => {
                  if(res){
                    let inner = res.innerinfo;
                    this.wx_historyList = inner.psnWorkInfo;
                  }
                })
                this.clearWorkHistory();
              }
            })
          }
        })
      },
      //编辑教育经历
      educationHistory_edit(i){
        this.$set(this.history_school, "value", this.wx_educationList[i].psnSchool);
        this.$set(this.history_profession, "value", this.wx_educationList[i].psnMajor);
        this.educationStartTime = this.wx_educationList[i].psnEduStartTime;
        this.educationEndTime = this.wx_educationList[i].psnGradTime;
        this.educationId = this.wx_educationList[i].eduinfoid;
      },
      //删除教育经历
      educationHistory_delete(i){
        xz.initBaseResume(Cookies.get("userid-b"), this.psnBaseInfo, this.psnid).then(id => {
          if (id) {
            let eduid = this.wx_educationList[i].eduinfoid;
            xz.deleteEduHistory("psneduinfoinner", id, eduid).then(res => {
              if(res){
                //保存成功重新获取教育经历
                xz.userInfo(this.psnid).then( res => {
                  if(res){
                    let inner = res.innerinfo;
                    this.wx_educationList = inner.psnEduInfo;
                  }
                })
                this.clearEducationHistory();
              }
            })
          }
        })
      },
      //输入计数
      wordsConunt(){
        let len = this.personalTag.length;
        if(len > 50){
          this.words = 50;
          this.personalTag = this.personalTag.slice(0, 50);
        }else{
          this.words = len;
        }
      },
      //保存简历
      addResume() {
        if(!this.psnName.value.trim()) return;
        this.saveResumeing = true;
        //初始化个人资料
        xz.initBaseResume(Cookies.get("userid-b"), this.psnBaseInfo, this.psnid).then(id => {
          if (id) {
            this.$set(this.psnBaseInfo, "psnName", this.psnName.value);
            this.$set(this.psnBaseInfo, "psnSex", this.gender);
            this.$set(this.psnBaseInfo, "psnEduLvl", this.diploma);
            this.$set(this.psnBaseInfo, "psnWorkExp", this.workYears);
            if(this.bornNation) this.$set(this.psnBaseInfo, "psnNation", this.bornNation);
            if(this.currentJob.value) this.$set(this.psnBaseInfo, "psnNowJob", this.currentJob.value);
            if(this.currentCompany.value) this.$set(this.psnBaseInfo, "psnNowCompany", this.currentCompany.value);
            this.$set(this.psnPersonInfo, "psnWorkState", this.currentStatus);
            this.$set(this.psnPersonInfo, "psnStartWork", this.startWorkYear ? new Date(this.startWorkYear).getFullYear() : "");
            this.$set(this.psnPersonInfo, "psnPerNation", this.currentSelected);
            this.$set(this.psnPersonInfo, "psnMarriage", this.marriage);
            this.$set(this.psnPersonInfo, "psnBirth", this.$store.getters.formatDate(this.birthDate, "-"));
            this.$set(this.psnPersonInfo, "psnCurrSalary", this.currentSalary.value);
            let intentObj = {
              psnIntentPay: this.intentSalary.value,
              psnIntentJob: this.intentWork.value,
              psnIntentNation: this.intentSelected,
              psnIntentAdd: "",
              psnIntentInd: "",
              psnIntentJobType: "",
              psnStrFuncNames: this.jobFun ? this.jobFun : ''
            }
            //保存基本资料
            let baseResume = xz.saveBaseResume(id, this.psnBaseInfo);
            //保存个人资料
            let person = xz.saveResumeInformation(id, "psnpersoninfoinner", this.psnPersonInfo);
            //求职意向
            let intent = xz.saveResumeInformation(id, "psnjobintentinfoinner", intentObj);
            //保存专业技能
            let knowTags = xz.savePersonalTags(id, "knowtaginner", this.professionArr.join(), "knowtag");
            
            Promise.all([baseResume, person, intent, knowTags]).then( res => {
              this.saveResumeing = false;
              this.$message({
                message: '保存成功!',
                type: 'success'
              });
              res.forEach( r => {
                if(!r) alert("数据保存出错，请稍后再试");
              })
            }).catch(err => {
              console.log(err);
              alert("保存出错,请稍后再试");
              this.saveResumeing = false;
            })
          }
        })
      },
      //专业技能暂存
      pushProfession(){
        if(!this.profession.value.trim()) return;
        this.professionArr.push(this.profession.value);
        this.$set(this.profession, "value", "");
      },
      //教育经历
      saveEducation() {
        xz.initBaseResume(Cookies.get("userid-b"), this.psnBaseInfo, this.psnid).then(id => {
          if (id) {
            let educationData = {
              eduinfoid: this.educationId ? this.educationId : new Date().valueOf(),
              psnSchool: this.history_school.value,
              psnMajor: this.history_profession.value,
              psnDegree: "",
              psnEduStartTime: this.$store.getters.formatMonth(this.educationStartTime, "-"),
              psnGradTime: this.$store.getters.formatMonth(this.educationEndTime, "-")
            }
            xz.saveResumeInformation(id, "psneduinfoinner", educationData).then(res => {
              if(res){
                //保存成功重新获取教育经历
                xz.userInfo(this.psnid).then( res => {
                  if(res){
                    let inner = res.innerinfo;
                    this.wx_educationList = inner.psnEduInfo;
                  }
                })
                this.clearEducationHistory();
              }
            })
          }
        })
      },
      //工作历史
      saveWorkExperience(){
        xz.initBaseResume(Cookies.get("userid-b"), this.psnBaseInfo, this.psnid).then(id => {
          if (id) {
            let workData = {
              workinfoid: this.workHistoryId ? this.workHistoryId : new Date().valueOf(),
              psnCompany: this.history_company.value,
              psnJob: this.history_job.value,
              psnWorkStartTime: this.$store.getters.formatMonth(this.workStartTime, "-"),
              psnWorkEndTime: this.$store.getters.formatMonth(this.workEndTime, "-"),
              psnJobLoc: "",
              psnJobNation: "",
              psnPay: "",
              psnJobDes: "",
              psnJobPart: "",
              psnStrLeavlingReson: "",
              psnStrFuncName: ""
            }
            xz.saveResumeInformation(id, "psnworkinfoinner", workData).then(res => {
              if(res){
                //保存成功重新获取工作历史
                xz.userInfo(this.psnid).then( res => {
                  if(res){
                    let inner = res.innerinfo;
                    this.wx_historyList = inner.psnWorkInfo;
                  }
                })
                this.clearWorkHistory();
              }
            })
          }
        })
      },
      //保存备注
      saveNote(){
        xz.initBaseResume(Cookies.get("userid-b"), this.psnBaseInfo, this.psnid).then(id => {
          if (id) {
            //个人备注
            xz.savePersonalTags(id, "skilltaginner", this.personalTag, "skilltag").then( res => {
              this.$message({
                message: res ? "保存备注成功" : "保存备注失败，稍后再试",
                type: res ? "success" : "error"
              });
            });
          }
        })
      },
      //删除标签
      deleteProfession(index){
        let tags = [];
        this.professionArr.forEach( (r, i) =>{
          if(i != index) tags.push(r);
        })
        this.professionArr = tags;
      },
      //清除工作历史表单内容
      clearWorkHistory(){
        this.$set(this.history_company, "value", "");
        this.$set(this.history_job, "value", "");
        this.workStartTime = "";
        this.workEndTime = "";
        this.workHistoryId = "";
      },
      //清除教育经历表单历史
      clearEducationHistory(){
        this.$set(this.history_school, "value", "");
        this.$set(this.history_profession, "value", "");
        this.educationStartTime = "";
        this.educationEndTime = "";
        this.educationId = "";
      },
      //返回选择的职能
      returnFun(data) {
        this.jobFun = data;
        this.jobfunVisible = false;
      },
      //选择结果
      chooseResult(e) {
        this.jobFun = e.target.innerText;
        this.hasResult = false;
      },
      //根据输入显示查找结果
      searchKeyWord() {
        this.searchResult = []; //重置
        if (this.jobFun.trim() != '') {
          for (let i = 0; i < this.funData.length; i++) { //第一级
            let hasKey = false; //判断有没有值

            let level1 = this.funData[i].type; //第一级名称
            let level2 = [];
            let level3 = [];
            if (level1.indexOf(this.jobFun) > -1) {
              hasKey = true;
            }
            for (let i2 = 0; i2 < this.funData[i].department.length; i2++) {
              let department = this.funData[i].department[i2];
              let level2Name = department.name ? department.name : ''; //第二级名字
              if (level2Name.indexOf(this.jobFun) > -1) {
                level2.push(level2Name);
                hasKey = true;
              }
              for (let i3 = 0; i3 < department.manager.length; i3++) {
                let manager = department.manager[i3];
                let level3Name = manager.name ? manager.name : ''; //第三级名字
                if (level3Name.indexOf(this.jobFun) > -1) {
                  level3.push(level3Name);
                  hasKey = true;
                }
              }
            }
            if (hasKey == true) { //如果4级中其中有关键词的话
              this.searchResult.push({
                level1: level1,
                level2: level2,
                level3: level3,
              })
              this.hasResult = true;
            }
          }
        } else {
          this.hasResult = false;
          this.searchResult = [];
        }
      },
      //检查职能分类
      checkentjobfun() {
        if (this.jobFun.trim()) {
          if (this.$refs.jobFunInput.classList.contains('error_alert')) {
            this.$refs.jobFunInput.classList.remove('error_alert');
          }
        }
      },
      //清空所有数据
      clearAll(){
        this.clearEducationHistory();
        this.clearWorkHistory();
        this.professionArr = [];
        this.wx_educationList = [];
        this.wx_historyList = [];
        this.$set(this.psnName, "value", "");
        this.$set(this.currentJob, "value", "");
        this.$set(this.currentCompany, "value", "");
        this.$set(this.currentSalary, "value", "");
        this.$set(this.intentWork, "value", "");
        this.$set(this.intentSalary, "value", "");
        this.gender = "";
        this.birthDate = "";
        this.diploma = "";
        this.workYears = "";
        this.bornNation = "";
        this.currentStatus = "";
        this.currentSelected = "";
        this.marriage = "";
        this.startWorkYear = "";
        this.intentSelected = "";
        this.personalTag = "";
        this.words = 0;
      }
    }
  }
</script>
<style scoped>
  .xz_detail_part_title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  .xz_detail_resume {
    width: 100%;
    /* position: relative; */
  }

  .xz_detail_center {
    width: 760px;
    padding-top: 20px;
    margin: 0 auto;
  }

  .xz_double_part {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .xz_add_cancel, .xz_add_history {
    font-size: 14px;
    display: block;
    padding: 8px 20px;
    color: #fff;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
    background: #409eff;
    border: none;
  }
  .xz_add_cancel{
    background: #ed6b75 !important;
    margin-left: 30px !important;
  }

  .customField {
    display: flex;
  }

  .customField_title {
    display: block;
    width: 150px;
    height: 45px;
    line-height: 45px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0 10px 0 0;
    color: #333;
    font-weight: bold;
    font-size: 14px;
  }

  .flexCenterContainer{
    display:flex;align-items:center;flex-wrap:wrap;
  }
  .tagsShow{
    width: 100%;
    display: block;
    margin-bottom: 15px;
    box-sizing: border-box;
    padding-left: 70px;
  }
  .tagsShowItem{
    margin-right: 15px;
    padding: 8px 25px 8px 18px;
    border-radius: 3px;
    background: #409eff;
    color: #fff;
    font-size: 13px;
    position: relative;
  }
  .closeTag{
    position: absolute;
    right: 2px;
    top: 3px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .xz_add_btn{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }
  .jobFunInput{
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 6px;
    height: 45px;
    font-size: 14px;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
  }
  .noteArea{
    width: 500px;
    border: 1px solid #ddd;
    border-radius: 6px;
    height: 80px;
    font-size: 14px;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
    padding: 10px;
  }
  .noteExample{
    width: 500px;
    box-sizing: border-box;
    margin-left: 150px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .note_inputLabel{
    display: block;
    width: 150px;
    height: 45px;
    line-height: 45px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0 10px 0 0;
    color: #333;
    font-size: 14px;
    font-weight: 700;
  }
  .noteCon{
    display: flex;
    flex-wrap: wrap;
  }
  .confineWords{
    position: relative;
    top: 60px;
    left: 10px;
  }
</style>
<style>
  .customField .el-input__inner {
    width: 200px;
    border: 1px solid #ddd;
    height: 45px;
  }

  .customField .xz_con {
    width: 200px !important;
  }

  .customField .el-date-editor.el-input,
  .customField .el-date-editor.el-input__inner {
    width: 200px;
  }
</style>