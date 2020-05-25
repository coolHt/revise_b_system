<template>
  <div class="workPoolItem">
    <div class="accessoryFile" v-if="type != 'pool'">
      <p>附件列表</p>
      <el-upload class="uploadFileBtn" :auto-upload="false" ref="upload" action="" :on-remove="handleRemove"
        :file-list="fileList">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
      </el-upload>
      <div class="accessoryList">
        <p class="accessoryTitle">暂无附件</p>
      </div>
    </div>


    <!-- 基本资料卡片 -->
    <div class="row">
      <div id="base-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="!editBaseInfo">
        <div class="card base-info-card">
          <div class="card-title">
            <h4>
              <span class="am-icon-info-circle"></span>
              <span>基本资料</span>
              <!-- <i class="btn-edit am-icon-edit" @click="editBaseInfo=true"></i> -->
            </h4>
          </div>
          <hr>
          <div class="card-content am-g" style="width:95%;margin:0 auto;">
            <div class="base-info-pic am-u-lg-3 am-u-md-3 am-u-sm-3" v-if="!changePic" v-cloak>
              <img v-if="headPic" :src="headPic" @click="changePic=true">
              <p v-else @click="changePic=true">
                <i class="am-icon-plus"></i>暂无照片
              </p>
            </div>
            <div class="base-info-pic am-u-lg-3 am-u-md-3 am-u-sm-3" v-else>
              <a class="file">
                选择文件
                <input type="file" id="inputLogo" @change="funChoosed('inputLogo')">
              </a>
              <span class="tipLogoPic" style="color:#fa7268">{{picTip}}</span>
            </div>

            <div class="base-info-inf am-u-lg-9 am-u-md-9 am-u-sm-10 edit-border"
              style="margin:20px auto;width:75%;border:transparent" v-cloak>
              <div class="name">{{inner.psnBaseInfo.psnName}}</div>
              <div>{{inner.psnBaseInfo.psnNowJob}}--{{inner.psnBaseInfo.psnNowCompany}}</div>
              <div class="at">{{inner.psnBaseInfo.psnSex}}|居住地:{{location}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 基本资料编辑 -->
      <div id="base-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="editBaseInfo && type != 'pool'">
        <div class="card base-info-card">
          <div class="card-title">
            <h4>
              <span class="am-icon-info-circle"></span>
              <span>基本资料编辑</span>
              <i class="btn-edit am-icon-minus" @click="editBaseInfo=false"></i>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div class="am-g contentCenter">
              <form class="am-form am-form-horizontal doc-vld-msg" autocomplete="off" @submit.prevent="saveBaseInfo">
                <fieldset>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">姓名</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="inner.psnBaseInfo.psnName" placeholder="真实姓名"
                        data-validation-message="请输入真实姓名" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label for="user-name" class="am-u-sm-2 am-form-label">性别</label>
                    <div class="am-u-sm-10">
                      <el-radio-group v-model="inner.psnBaseInfo.psnSex">
                        <el-radio-button label="男">男</el-radio-button>
                        <el-radio-button label="女">女</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">当前公司</label>
                    <div class="am-u-sm-10">
                      <input type="text" id="name" v-model="inner.psnBaseInfo.psnNowCompany" placeholder="请输入当前所在公司"
                        data-validation-message="请输入当前所在公司" required>
                    </div>
                  </div>

                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">当前职位</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="inner.psnBaseInfo.psnNowJob" placeholder="请输入当前职位"
                        data-validation-message="请输入当前职位" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">入职时间</label>
                    <div class="am-u-sm-10">
                      <input type="text" id="nowJobTime" v-model="inner.psnBaseInfo.psnCurrDate"
                        data-validation-message="请输入当前职位入职时间" required>
                    </div>
                  </div>

                  <div class="am-form-group">
                    <label for="user-name" class="am-u-sm-2 am-form-label">居住地</label>
                    <div class="am-u-sm-10">
                      <MRegion @cRegion="liveRegion"></MRegion>
                    </div>
                  </div>

                  <div class="am-form-group">
                    <label for="user-name" class="am-u-sm-2 am-form-label">目前收入</label>
                    <div class="am-u-sm-10">

                      <input type="text" v-model="inner.psnBaseInfo.psnNowPay" style="width:150px;display:inline-block">
                      W
                    </div>
                  </div>
                  <div class="am-form-group">
                    <div class="am-u-sm-2 am-u-sm-push-3">
                      <button type="submit" class="am-btn am-btn-primary">保存</button>
                    </div>
                    <div class="am-u-sm-2">
                      <button type="button" class="am-btn am-btn-danger" @click="editBaseInfo=false">关闭</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 个人信息卡片 -->
    <div class="row">
      <div id="person-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="!editPersonInfo">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-book"></span>
              <span>个人信息</span>
              <i class="btn-edit am-icon-edit" @click="editPersonInfo=true" v-if="type != 'pool'"></i>
            </h4>
          </div>
          <hr>
          <div class="card-content" :class="type != 'pool'?'edit-border':''" @click="type != 'pool'?editPersonInfo=true:''" v-cloak>
            <div class="am-g">
              <div class="am-u-lg-6 am-u-md-6 am-u-sm-6">
                <p>籍贯:</p>
                <div style="display:inline">{{birthPlaceName}}</div>
              </div>
              <div class="am-u-lg-6 am-u-md-6 am-u-sm-6">
                <p>当前状态:</p>
                <div style="display:inline">{{inner.psnPersonInfo.psnWorkState}}</div>
              </div>
            </div>
            <div class="am-g">
              <div class="am-u-lg-6 am-u-md-6 am-u-sm-6">
                <p>婚姻状况:</p>
                <div style="display:inline">{{inner.psnPersonInfo.psnMarriage}}</div>
              </div>

              <div class="am-u-lg-6 am-u-md-6 am-u-sm-6">
                <p>出生日期:</p>
                <div style="display:inline">
                  {{inner.psnPersonInfo.psnBirth?new Date(inner.psnPersonInfo.psnBirth.split(' ')[0]).getFullYear() + '-' + (new Date(inner.psnPersonInfo.psnBirth.split(' ')[0]).getMonth() + 1) + '-' + new Date(inner.psnPersonInfo.psnBirth.split(' ')[0]).getDate() : ''}}
                </div>
              </div>
            </div>
            <div class="am-g">
              <div class="am-u-lg-6 am-u-md-6 am-u-sm-6">
                <p>开始工作年份:</p>

                <div style="display:inline">{{inner.psnPersonInfo.psnStartWork}}</div>
              </div>
              <div class="am-u-lg-6 am-u-md-6 am-u-sm-6">
                <p>所在行业:</p>
                <div style="display:inline">{{inner.psnPersonInfo.psnIndustry}}</div>
              </div>
            </div>
            <div class="am-g">
              <div class="am-u-lg-6 am-u-md-6 am-u-sm-6">
                <p>掌握语言:</p>

                <div style="display:inline">{{languageType}} ({{languageSkilled}})</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 个人信息编辑 -->
      <div id="person-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="editPersonInfo && type != 'pool'">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-book"></span>
              <span>个人信息编辑</span>
              <i class="btn-edit am-icon-minus" @click="editPersonInfo=false"></i>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div class="am-g contentCenter">
              <form class="am-form am-form-horizontal doc-vld-msg" autocomplete="off" @submit.prevent="savePersonInfo">
                <fieldset>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">籍贯</label>

                    <div class="am-u-sm-10">
                        <MRegion :cityGet="true" :selected="birthPlaceCode" @cRegion="birthPlace"></MRegion>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">工作状态</label>
                    <div class="am-u-sm-10">
                      <el-radio-group v-model="inner.psnPersonInfo.psnWorkState" required>
                        <el-radio-button v-for="(tag,index) in psnWorkStateTag" :label="tag" :key="index">{{tag}}
                        </el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">出生日期</label>
                    <div class="am-u-sm-10 selectIcon">
                      <el-date-picker v-model="borthTime" type="month" placeholder="开始时间"
                        @change="(v)=>{borthTime = v}"></el-date-picker>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">婚姻状态</label>
                    <div class="am-u-sm-10">
                      <el-radio-group v-model="inner.psnPersonInfo.psnMarriage">
                        <el-radio-button v-for="(tag,index) in psnMarriageTag" :label="tag" :key="index">{{tag}}
                        </el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">开始工作年份</label>
                    <div class="am-u-sm-10 selectIcon">

                      <el-date-picker v-model="startWorkTime" type="year" placeholder="选择年份"></el-date-picker>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">当前行业</label>
                    <div class="am-u-sm-10">
                      <input type="text" id="name" v-model="inner.psnPersonInfo.psnIndustry" placeholder="请输入当前所在行业"
                        data-validation-message="请输入当前所在行业" required>
                    </div>
                  </div>

                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">主要外语</label>
                    <div class="am-u-sm-10">

                      <div class="am-u-sm-9" style="width:100%;">
                        <div v-show="otherLang" v-for='item in langTag' :key='item' style="padding-top:5px">
                          <el-tag closable @close='handleClose(langTag,item)'>{{item.name}}
                          </el-tag>

                          <el-rate style="display:inline-block" v-model='item.level' show-text :texts="langLevel">
                          </el-rate>

                        </div>

                        <div style="margin-top:5px;display:flex">
                          <el-radio-group v-model="initLange" @change="changeLanguage">
                            <el-radio-button v-for="tag in languageTag" :label="tag">{{tag}}
                            </el-radio-button>
                          </el-radio-group>
                          <div v-show="otherLanguage" class="languageAdd">
                            <el-input class="input-new-tag" v-model="inputNewLangTag" size="small">
                            </el-input>

                            <el-button size='small' @click='funAddLangTag(inputNewLangTag)'>
                              新增</el-button>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <div class="am-u-sm-2 am-u-sm-push-3">
                      <button type="submit" class="am-btn am-btn-primary">保存</button>
                    </div>
                    <div class="am-u-sm-2">
                      <button type="button" class="am-btn am-btn-danger" @click="editPersonInfo=false">关闭</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 求职意向卡片 -->
    <div class="row">
      <div id="job-intent-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="!editJobIntentInfo">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-magic"></span>
              <span>求职意向</span>
              <i class="btn-edit am-icon-edit" @click="editJobIntentInfo=true" v-if="type != 'pool'"></i>
            </h4>
          </div>
          <hr>
          <div class="card-content" :class="type != 'pool'?'edit-border':''" @click="type != 'pool'?editJobIntentInfo=true:''" v-cloak>
            <div class="am-g">
              <div class="am-u-lg-12 am-u-md-12 am-u-sm-12">
                <p>期望职位:</p>
                <div style="display:inline">{{inner.psnJobIntentInfo.psnIntentJob}}</div>
              </div>
            </div>
            <div class="am-g">
              <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                <p>期望工作地点:</p>
                <div style="display:inline">{{intentAddValue}}</div>
              </div>
              <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                <p>工作类型:</p>
                <div style="display:inline">{{inner.psnJobIntentInfo.psnIntentJobType}}</div>
              </div>
            </div>
            <div class="am-g">
              <div class="am-u-lg-12 am-u-md-12 am-u-sm-12">
                <p>期望年薪:</p>
                <div style="display:inline">{{inner.psnJobIntentInfo.psnIntentPay}}</div>
              </div>
            </div>
            <div class="am-g">
              <div class="am-u-lg-2 am-u-md-2 am-u-sm-12" style="padding-left:15px;display: inline;">
                <p>我的优势:</p>
              </div>
              <article class="am-u-lg-10 am-u-md-10 am-u-sm-12" style="display:inline;word-wrap:break-word;">
                {{inner.psnJobIntentInfo.psnIntentInd}}</article>
            </div>
          </div>
        </div>
      </div>
      <!-- 编辑求职意向 -->
      <div id="job-intent-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="editJobIntentInfo && type != 'pool'">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-magic"></span>
              <span>编辑求职意向</span>
              <i class="btn-edit am-icon-minus" @click="editJobIntentInfo=false"></i>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div class="am-g contentCenter">
              <form class="am-form am-form-horizontal doc-vld-msg" autocomplete="off"
                @submit.prevent="saveJobIntentInfo">
                <fieldset>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">期望职位</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="inner.psnJobIntentInfo.psnIntentJob" placeholder="请输入职位" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">期望工作地点</label>
                    <div class="am-u-sm-10">
                        <MRegion :selected="intIntent" @cRegion="intentRegion"></MRegion>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">工作类型</label>
                    <div class="am-u-sm-10">
                      <el-radio-group v-model="inner.psnJobIntentInfo.psnIntentJobType">
                        <el-radio-button label="全职">全职</el-radio-button>
                        <el-radio-button label="兼职">兼职</el-radio-button>
                        <el-radio-button label="实习">实习</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">期望年薪</label>
                    <div class="am-u-sm-10">

                      <input type="text" v-model="inner.psnJobIntentInfo.psnIntentPay"
                        style="width:150px;display:inline-block;"> W
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">自我评价:</label>
                    <div class="am-u-sm-10">
                      <textarea cols="30" rows="10" v-model="inner.psnJobIntentInfo.psnIntentInd"></textarea>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <div class="am-u-sm-2 am-u-sm-push-3">
                      <button type="submit" class="am-btn am-btn-primary">保存</button>
                    </div>
                    <div class="am-u-sm-2">
                      <button type="button" class="am-btn am-btn-danger" @click="editJobIntentInfo=false">关闭</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 工作经历卡片 -->
    <div class="row">
      <div id="work-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="!addWorksInfo">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-briefcase"></span>
              <span>工作经历</span>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div v-for="(item, index) in inner.psnWorkInfo" v-show="!editWork" :key="index" v-cloak>
              <div class="am-g" style="margin:15px auto">
                <i class="am-icon-edit" style="right:50px;position: absolute;"
                  @click=" openEditWorkInfo(item,index)"></i>
                <i class="am-icon-trash" style="right:30px;position: absolute;" @click=" delWorkInfo(item,index)"></i>
              </div>
              <div class="am-g">
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                  <p>所在公司:</p>
                  <div style="display:inline">{{item.psnCompany}}</div>
                </div>
              </div>
              <div class="am-g">
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                  <p>所在部门:</p>
                  <div style="display:inline">{{item.psnJobPart}}</div>
                </div>
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                  <p>担任职位:</p>
                  <div style="display:inline">{{item.psnJob}}</div>
                </div>
              </div>
              <div class="am-g">
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                  <p>工作地点:</p>
                  <div style="display:inline">{{item.psnJobLoc}}</div>
                </div>
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                  <p>任职时间:</p>
                  <div style="display:inline">
                    <span>{{item.psnWorkStartTime ? new Date(item.psnWorkStartTime.split(' ')[0]).getFullYear() + '-' + (new Date(item.psnWorkStartTime.split(' ')[0]).getMonth() + 1):''}}</span>
                    至
                    <span>{{item.psnWorkEndTime ? new Date(item.psnWorkEndTime.split(' ')[0]).getFullYear() + '-' + (new Date(item.psnWorkEndTime.split(' ')[0]).getMonth() + 1):''}}</span>
                  </div>
                </div>
              </div>
              <div class="am-g">
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                  <p>任职收入:</p>
                  <div style="display:inline">{{item.psnPay}}</div>
                </div>
              </div>
              <div class="am-g">
                <div class="am-u-lg-12 am-u-md-12 am-u-sm-12">
                  <p>工作描述:</p>
                  <article style="display:inline">{{item.psnJobDes}}</article>
                </div>
              </div>
              <hr>
            </div>
            <div v-show="editWork">
              <form class="am-form am-form-horizontal doc-vld-msg" @submit.prevent="editWorkInfo">
                <fieldset>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">公司名称</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="obj.psnCompany" placeholder="请输入所在公司名称" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">职位</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="obj.psnJob" placeholder="请输入担任职位" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">工作地点</label>
                    <div class="am-u-sm-10">
                        <MRegion :selected="obj.intExperRegion" @cRegion="experienceRegion"></MRegion>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">任职时间</label>
                    <div class="am-u-sm-10 selectIcon">

                      <el-date-picker v-model="workStart" type="month" placeholder="开始时间"
                        @change="(v)=>{workStart = v}"></el-date-picker>
                      至
                      <el-date-picker v-model="workEnd" type="month" placeholder="结束时间" @change="(v)=>{workEnd = v}">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">部门</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="obj.psnJobPart" placeholder="请输入所在部门">
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">任职收入</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="obj.psnPay" style="width:150px;display:inline-block;"> W
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">工作描述</label>
                    <div class="am-u-sm-10">
                      <textarea cols="30" rows="10" v-model="obj.psnJobDes"></textarea>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <div class="am-u-sm-2 am-u-sm-push-3">
                      <button type="submit" class="am-btn am-btn-primary">修改</button>
                    </div>
                    <div class="am-u-sm-2">
                      <button type="button" class="am-btn am-btn-danger" @click="editWork=false">关闭</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
            <div class="am-g" v-show="!editWork && type != 'pool'">
              <div @click="addWorksInfo=true"
                class="add-info am-u-lg-10 am-u-md-10 am-u-sm-10 am-u-lg-offset-1 am-u-md-offset-1 am-u-sm-offset-1">
                <i class="am-icon-plus"></i>新增
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 新增工作经历 -->
      <div id="work-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="addWorksInfo && type != 'pool'">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-briefcase"></span>
              <span>新增工作经历</span>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div class="am-g contentCenter">
              <form class="am-form am-form-horizontal doc-vld-msg" @submit.prevent="saveWorkInfo">
                <fieldset>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">公司名称</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="workInfo.psnCompany" placeholder="请输入所在公司名称"
                        data-validation-message="请填写此字段" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">职位</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="workInfo.psnJob" placeholder="请输入担任职位"
                        data-validation-message="请填写此字段" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">工作地点</label>
                    <div class="am-u-sm-10">
                        <MRegion @cRegion="addExperienceRegion"></MRegion>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">任职时间</label>
                    <div class="am-u-sm-10 selectIcon">
                      <el-date-picker v-model="addWorkStart" type="month" placeholder="开始时间"
                        @change="(v)=>{addWorkStart = v}"></el-date-picker>
                      至
                      <el-date-picker v-model="addWorkEnd" type="month" placeholder="结束时间"
                        @change="(v)=>{addWorkEnd = v}"></el-date-picker>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">部门</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="workInfo.psnJobPart" placeholder="请输入所在部门">
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">任职收入</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="workInfo.psnPay" style="width:150px;display:inline-block;"> W
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">工作描述</label>
                    <div class="am-u-sm-10">
                      <textarea cols="30" rows="10" v-model="workInfo.psnJobDes"></textarea>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <div class="am-u-sm-2 am-u-sm-push-3">
                      <button type="submit" class="am-btn am-btn-primary">新增</button>
                    </div>
                    <div class="am-u-sm-2">
                      <button type="button" class="am-btn am-btn-danger" @click="addWorksInfo=false">关闭</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 教育经历卡片 -->
    <div class="row">
      <div id="edu-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="!addEdusInfo">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-graduation-cap"></span>
              <span>教育经历</span>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div v-for="(item,index) in inner.psnEduInfo" v-show="!editEdu" :key="index" v-cloak>
              <div class="am-g" style="margin:15px auto">
                <i class="am-icon-edit" style="right:50px;position: absolute;" @click="openEditEduInfo(item,index)"></i>
                <i class="am-icon-trash" style="right:30px;position: absolute;" @click="delEduInfo(item,index)"></i>
              </div>
              <div class="am-g">
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                  <p>所在学校:</p>
                  <div style="display:inline">{{item.psnSchool}}</div>
                </div>
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-12">
                  <p>专业:</p>
                  <div style="display:inline">{{item.psnMajor}}</div>
                </div>
              </div>
              <div class="am-g">
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-6">
                  <p>在校时间:</p>
                  <div style="display:inline">
                    {{item.psnEduStartTime?new Date(item.psnEduStartTime.split(' ')[0]).getFullYear() + '-' + (new Date(item.psnEduStartTime.split(' ')[0]).getMonth() + 1):''}}
                    至
                    {{item.psnGradTime?new Date(item.psnGradTime.split(' ')[0]).getFullYear() + '-' + (new Date(item.psnGradTime.split(' ')[0]).getMonth() + 1):''}}
                  </div>
                </div>
                <div class="am-u-lg-6 am-u-md-6 am-u-sm-6">
                  <p>学历:</p>
                  <div style="display:inline">{{item.psnDegree}}</div>
                </div>
              </div>

              <hr>
            </div>
            <div v-show="editEdu">
              <form class="am-form am-form-horizontal doc-vld-msg" @submit.prevent="editEduInfo">
                <fieldset>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">学校</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="obj.psnSchool" placeholder="请输入学校名称" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">专业</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="obj.psnMajor" placeholder="请输入专业名称" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">在校时间</label>
                    <div class="am-u-sm-10 selectIcon">
                      <el-date-picker v-model="educationStart" type="month" placeholder="入学时间"
                        @change="(v)=>{educationStart = v}">
                      </el-date-picker>
                      至
                      <el-date-picker v-model="educationEnd" type="month" placeholder="毕业时间"
                        @change="(v)=>{educationEnd = v}">
                      </el-date-picker>

                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">学历</label>
                    <div class="am-u-sm-10">
                      <input type="text" v-model="obj.psnDegree" placeholder="请输入学历">
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">统招</label>
                    <div class="am-u-sm-10" style="padding: 5px 15px">
                      <el-switch v-model="obj.psnDegreeSign" active-color="#0E90D2" inactive-color="#D1D2D4"
                        active-value="是" inactive-value="否"></el-switch>
                    </div>
                  </div>

                  <div class="am-form-group">
                    <div class="am-u-sm-2 am-u-sm-push-3">
                      <button type="submit" class="am-btn am-btn-primary">修改</button>
                    </div>
                    <div class="am-u-sm-2">
                      <button type="button" class="am-btn am-btn-danger" @click="editEdu=false">关闭</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
            <div class="am-g" v-show="!editEdu && type != 'pool'">
              <div @click="addEdusInfo=true"
                class="add-info am-u-lg-10 am-u-md-10 am-u-sm-10 am-u-lg-offset-1 am-u-md-offset-1 am-u-sm-offset-1">
                <i class="am-icon-plus"></i>新增
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新增教育经历 -->
      <div id="edu-info" class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="addEdusInfo && type != 'pool'">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-graduation-cap"></span>
              <span>新增教育经历</span>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div class="am-g contentCenter">
              <form class="am-form am-form-horizontal doc-vld-msg" @submit.prevent="saveEduInfo">
                <fieldset>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">学校</label>
                    <div class="am-u-sm-10">
                      <input type="text" id="loaction" v-model="eduInfo.psnSchool" placeholder="请输入学校名称" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">专业</label>
                    <div class="am-u-sm-10">
                      <input type="text" id="loaction" v-model="eduInfo.psnMajor" placeholder="请输入专业名称" required>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">在校时间</label>
                    <div class="am-u-sm-10 selectIcon">
                      <el-date-picker v-model="addEducationStart" type="month" placeholder="入学时间"
                        @change="(v)=>{addEducationStart = v}">
                      </el-date-picker>
                      至
                      <el-date-picker v-model="addEducationEnd" type="month" placeholder="毕业时间"
                        @change="(v)=>{addEducationEnd = v}">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">学历</label>
                    <div class="am-u-sm-10">
                      <input type="text" id="loaction" v-model="eduInfo.psnDegree" placeholder="请输入学历">
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-2 am-form-label">统招</label>
                    <div class="am-u-sm-10" style="padding: 5px 15px">
                      <el-switch v-model="eduInfo.psnDegreeSign" active-color="#0E90D2" inactive-color="#D1D2D4"
                        active-value="是" inactive-value="否"></el-switch>
                    </div>
                  </div>

                  <div class="am-form-group">
                    <div class="am-u-sm-2 am-u-sm-push-3">
                      <button type="submit" class="am-btn am-btn-primary">新增</button>
                    </div>
                    <div class="am-u-sm-2">
                      <button type="button" class="am-btn am-btn-danger" @click="addEdusInfo=false">关闭</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div id="personal-tags" class="am-u-lg-12 am-u-md-12 am-u-sm-12">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-tag"></span>
              <span>专业证书</span>
            </h4>
          </div>
          <hr>

          <div class="card-content">
            <div class="am-g contentCenter">
              <div class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="!addOther">
                <el-tag :key="tag" v-for="tag in inner.psnOtherTag" :disable-transitions="false" class="tag">{{tag}}
                </el-tag>
              </div>
              <div class="am-u-sm-12" v-show="addOther && type != 'pool'" style="text-align:center">
                <el-tag :key="tag" v-for="tag in psnOtherTag" closable :disable-transitions="false"
                  @close="handleClose(psnOtherTag,tag)" class="tag">{{tag}}</el-tag>
                <div>
                  <el-input class="input-new-tag" v-model="inputNewOtherTag" size="small" style="max-width:180px">
                  </el-input>
                  <el-button size="small" @click="funAddTag(psnOtherTag,inputNewOtherTag);inputNewOtherTag=''">添加新标签
                  </el-button>
                  <small style="display:block;color:#909399">注：请填选出其他关于你的其他标签，如竞赛获奖信息等</small>
                </div>
                <button type="button" class="psn-btn psn-btn-submit"
                  @click="saveTag(psnOtherTag,'othertag')">保存</button>
                <button type="button" class="psn-btn" @click="addOther=false">关闭</button>
              </div>
            </div>
            <div class="am-g" v-show="!addOther && type != 'pool'">
              <div class="add-info am-u-sm-10 am-u-sm-offset-1" @click="addOther=true">
                <i class="am-icon-plus"></i>新增标签
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div id="personal-tags" class="am-u-lg-12 am-u-md-12 am-u-sm-12">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-tag"></span>
              <span>工具工艺</span>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div class="am-g contentCenter">
              <div class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="!addKnow">
                <el-tag :key="tag" v-for="tag in inner.psnKnowTag" :disable-transitions="false" class="tag">{{tag}}
                </el-tag>
              </div>
              <div class="am-u-sm-12" v-show="addKnow && type != 'pool'" style="text-align:center">
                <el-tag :key="tag" v-for="tag in psnKnowTag" closable :disable-transitions="false"
                  @close="handleClose(psnKnowTag,tag)" class="tag">{{tag}}</el-tag>
                <div>
                  <el-input class="input-new-tag" v-model="inputNewKnowTag" size="small" style="max-width:180px">
                  </el-input>
                  <el-button size="small" @click="funAddTag(psnKnowTag,inputNewKnowTag);inputNewKnowTag=''">添加新标签
                  </el-button>
                </div>
                <button type="button" class="psn-btn psn-btn-submit" @click="saveTag(psnKnowTag,'knowtag')">保存</button>
                <button type="button" class="psn-btn" @click="addKnow=false">关闭</button>
              </div>
            </div>
            <div class="am-g" v-show="!addKnow && type != 'pool'">
              <div class="add-info am-u-sm-10 am-u-sm-offset-1" @click="addKnow=true">
                <i class="am-icon-plus"></i>新增标签
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div id="personal-tags" class="am-u-lg-12 am-u-md-12 am-u-sm-12">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-tag"></span>
              <span>软件系统</span>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div class="am-g contentCenter">
              <div class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="!addTool">
                <el-tag :key="tag" v-for="tag in inner.psnToolTag" :disable-transitions="false" class="tag">{{tag}}
                </el-tag>
              </div>
              <div class="am-u-sm-12" v-show="addTool && type != 'pool'" style="text-align:center">
                <el-tag :key="tag" v-for="tag in psnToolTag" closable :disable-transitions="false"
                  @close="handleClose(psnToolTag,tag)" class="tag">{{tag}}</el-tag>
                <div>
                  <el-input class="input-new-tag" v-model="inputNewToolTag" size="small" style="max-width:180px">
                  </el-input>
                  <el-button size="small" @click="funAddTag(psnToolTag,inputNewToolTag);inputNewToolTag=''">添加新标签
                  </el-button>

                </div>
                <button type="button" class="psn-btn psn-btn-submit" @click="saveTag(psnToolTag,'tooltag')">保存</button>
                <button type="button" class="psn-btn" @click="addTool=false">关闭</button>
              </div>
            </div>
            <div class="am-g" v-show="!addTool && type != 'pool'">
              <div class="add-info am-u-sm-10 am-u-sm-offset-1" @click="addTool=true">
                <i class="am-icon-plus"></i>新增标签
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div id="personal-tags" class="am-u-lg-12 am-u-md-12 am-u-sm-12">
        <div class="card">
          <div class="card-title">
            <h4>
              <span class="am-icon-tag"></span>
              <span>其他要求</span>
            </h4>
          </div>
          <hr>
          <div class="card-content">
            <div class="am-g contentCenter">
              <div class="am-u-lg-12 am-u-md-12 am-u-sm-12" v-show="!addSkill">
                <el-tag :key="tag" v-for="tag in inner.psnSkillTag" :disable-transitions="false" class="tag">{{tag}}
                </el-tag>
              </div>
              <div class="am-u-sm-12" v-show="addSkill && type != 'pool'" style="text-align:center">
                <el-tag :key="tag" v-for="tag in psnSkillTag" closable :disable-transitions="false"
                  @close="handleClose(psnSkillTag,tag)" class="tag">{{tag}}</el-tag>
                <div>
                  <el-input class="input-new-tag" v-model="inputNewSkillTag" size="small" style="max-width:180px">
                  </el-input>
                  <el-button size="small" @click="funAddTag(psnSkillTag,inputNewSkillTag);inputNewSkillTag=''">添加新标签
                  </el-button>
                </div>
                <button type="button" class="psn-btn psn-btn-submit"
                  @click="saveTag(psnSkillTag,'skilltag')">保存</button>
                <button type="button" class="psn-btn" @click="addSkill=false">关闭</button>
              </div>
            </div>
            <div class="am-g" v-show="!addSkill && type != 'pool'">
              <div class="add-info am-u-sm-10 am-u-sm-offset-1" @click="addSkill=true">
                <i class="am-icon-plus"></i>新增标签
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Cookies from "vue-cookies";
  import {
    allLocation,
    province,
    city,
    area,
    findCode,
    findValue,
    circult
  } from "../assets/areaData.js";

  export default {
    props: {
      resume: Object,
      orderId: String,
      type: String
    },
    data: function () {
      return {
        //附件
        fileList: [],
        previewHeight: "",
        userid: "",
        entid: "",
        pagename: "",
        obj: {},
        index: 0,
        changePic: false,
        editBaseInfo: false,
        editPersonInfo: false,
        editPersonalTags: false,
        editJobIntentInfo: false,
        editWork: false,
        editEdu: false,
        addWorksInfo: false,
        addEdusInfo: false,
        addSkill: false,
        addKnow: false,
        addTool: false,
        addOther: false,
        birthPlaceName: '',
        birthPlaceCode: '',

        headPic: "../assets/images/avatar1.png",
        picTip: "",

        //内部基本资料
        inner: {
          psnBaseInfo: {
            psnAdd: "",
            psnImgInfo: '',
            psnIndustry: '',
            psnName: '',
            psnNation: '',
            psnNowCompany: '',
            psnNowJob: '',
            psnSex: ''
          },
          //内部工作意向
          psnJobIntentInfo: {
            psnIntentAdd: '',
            psnIntentInd: '',
            psnIntentJob: null,
            psnIntentJobType: '',
            psnIntentNation: '',
            psnIntentPay: null
          },
          psnEduInfo: [],
          psnWorkInfo: [],
          psnPersonInfo: {
            psnStartWork: '',
            psnWorkState: '',
            psnMarriage: '',
            psnBirth: '',
            psnIndustry: '',
            psnLang: [],
            psnPerNation: '',
          },
          psnSkillTag: [], //技能标签
          psnKnowTag: [], //知识标签
          psnToolTag: [],
          psnOtherTag: [],
        },
        educationStart: '',
        educationEnd: '',
        addEducationStart: '',
        addEducationEnd: '',
        startWorkTime: '',
        workStart: '',
        workEnd: '',
        addWorkStart: '',
        addWorkEnd: '',
        //期望求职地点转文字
        intentAddValue: '',
        intIntent: '',
        //工作经历
        experRegion: '',
        //新增工作经历
        addExperRegion: '',
        //工作经历地点转文字
        intExperRegion: [],
        langArr: [],
        languageType: '',
        languageSkilled: '',

        //基本资料
        psnPersonInfo: {
          psnStartWork: "",
          psnLang: []
        }, //个人信息

        inputNewSkillTag: "",
        inputNewKnowTag: "",
        inputNewToolTag: "",
        inputNewOtherTag: "",

        //外语相关
        languageTag: ["英语", "德语", "日语", "其他", "不限"],
        langTag: [{
          level: 3,
          name: "英语"
        }],
        inputNewLangTag: "",
        otherLanguage: false,
        langLevel: [
          "简单沟通",
          "日常交流",
          "读写精通",
          "工作用语",
          "同声传译"
        ],
        initLange: '英语',
        otherLang: true,

        //

        psnWorkStateTag: [
          "离职,正在找工作",
          "在职,急寻新工作",
          "在职,看新的机会",
          "在职,暂无跳槽打算"
        ],
        psnMarriageTag: ["未婚", "已婚", "已婚有孩子", "已婚有多个孩子"],
        //新增的工作信息
        workInfo: {},
        //总的工作信息

        // 教育经历
        eduInfo: {
          psnDegreeSign: "是"
        },


        //省市区
        province: [],
        city: [],
        area: [],
        loc: "",
        monthlySalary: 0,
        month: 0,
        intentPayTotal: 0,
        workedMonthlySalary: 0,
        workedMonth: 0,
        workedPayTotal: 0,
        addWorkedMonthlySalary: 0,
        addWorkedMonth: 0,
        addWorkedPayTotal: 0,
        location: "",
        bornLocation: "",
        res: "",
        borthTime: ""
      };
    },
    watch: {
      resume: function () {
        console.log(this.resume);
        //获取收到的简历
        if (this.resume.psnBaseInfo && JSON.stringify(this.resume.psnBaseInfo) != "{}") {
          this.inner.psnBaseInfo = this.resume.psnBaseInfo;
        }
        //获取个人信息
        if (this.resume.psnPersonInfo && JSON.stringify(this.resume.psnPersonInfo) != "{}") {
          this.inner.psnPersonInfo = this.resume.psnPersonInfo;
          console.log(this.inner.psnPersonInfo);
          this.borthTime = new Date(this.inner.psnPersonInfo.psnBirth.split(' ')[0]);

          //获取显示的掌握语言
          if (this.inner.psnPersonInfo.psnLang) {
            let toMatch = this.inner.psnPersonInfo.psnLang.replace('[', '').replace(']', '');
            toMatch = JSON.parse(toMatch);

            //设置编辑个人信息语言
            this.langTag = [];
            this.langTag.push(toMatch);
            this.initLange = toMatch.name;

            this.languageType = toMatch.name;
            if (toMatch.level == '1') {
              this.languageSkilled = '简单沟通';
            }
            if (toMatch.level == '2') {
              this.languageSkilled = '日常交流';
            }
            if (toMatch.level == '3') {
              this.languageSkilled = '读写精通';
            }
            if (toMatch.level == '4') {
              this.languageSkilled = '工作用语';
            }
            if (toMatch.level == '5') {
              this.languageSkilled = '同声传译';
            }
          }
          //设置工作开始时间startWorkTime
          this.startWorkTime = new Date(this.inner.psnPersonInfo.psnPerNation.psnStartWork + '-01-01');

          let searhArea = circult(this.inner.psnPersonInfo.psnPerNation, 'city');
          if (searhArea) {
            this.birthPlaceName = searhArea.name;
            this.birthPlaceCode = searhArea.code;
          } else {
            this.birthPlaceName = '';
            this.birthPlaceCode = '';
          }
        }

        //教育经历
        if (this.resume.psnEduInfo && JSON.stringify(this.resume.psnEduInfo) != "{}") {
          this.inner.psnEduInfo = this.resume.psnEduInfo;
        } else {
          this.inner.psnEduInfo = [];
          console.log('空空空空');
        }

        //求职意向
        if (this.resume.psnJobIntentInfo && JSON.stringify(this.resume.psnJobIntentInfo) != "{}") {

          this.inner.psnJobIntentInfo = this.resume.psnJobIntentInfo;
          if (this.resume.psnJobIntentInfo.psnIntentNation) {
            this.intentAddValue = findValue(this.resume.psnJobIntentInfo.psnIntentNation);
            this.intIntent = '';

            let address = circult(this.resume.psnJobIntentInfo.psnIntentNation, 'area');
            if (address) {
              this.intentAddValue = address.name;
              this.intIntent = address.code;
            } else {
              this.intentAddValue = '';
              this.intIntent = '';
              console.log('拿不到地址');
            }

          }
        }

        //工作经历
        if (this.resume.psnWorkInfo && JSON.stringify(this.resume.psnWorkInfo) != "{}") {
          //处理工作经历，增加一个处理过的地址的属性来将code 转换成文字
          this.resume.psnWorkInfo.forEach(function (v) {
            let searhArea = circult(v.psnJobNation, 'area');
            if (searhArea) {
              v.psnJobLoc = searhArea.name;
              v.intExperRegion = searhArea.code;
            } else {
              v.psnJobLoc = '';
              v.intExperRegion = '';
            }
          })
          this.inner.psnWorkInfo = this.resume.psnWorkInfo;
          console.log(this.resume.psnWorkInfo)
        } else {
          this.inner.psnWorkInfo = [];
          console.log('空空空空');
        }

        if (this.resume.psnKnowTag) {
          this.inner.psnKnowTag = this.resume.psnKnowTag.split(',');
        } else {
          this.inner.psnKnowTag = [];
        }
        if (this.resume.psnOtherTag) {
          this.inner.psnOtherTag = this.resume.psnOtherTag.split(',');
        } else {
          this.inner.psnOtherTag = [];
        }
        if (this.resume.psnSkillTag) {
          this.inner.psnSkillTag = this.resume.psnSkillTag.split(',');
        } else {
          this.inner.psnSkillTag = [];
        }
        if (this.resume.psnToolTag) {
          this.inner.psnToolTag = this.resume.psnToolTag.split(',');
        } else {
          this.inner.psnToolTag = [];
        }

      },

      "psnBaseInfo.psnSex": {
        handler: function (n, o) {
          if (n == "女") {
            this.headPic = "../assets/images/woman.png";
          } else if (n == "男") {
            this.headPic = "../assets/images/man.png";
          }
        }
      },
    },
    created: function () {
      this.userid = Cookies.get("userid-b");
      this.entid = Cookies.get("entid-b");

    },
    mounted() {
      let t = document.getElementsByClassName("paySelect")[0];
      if (t) {
        let inp = t.getElementsByClassName("el-input__inner")[0]
        inp.removeAttribute("readonly");
      }
    },

    methods: {
      //外语单选
      changeLanguage(data) {
        if (data == '英语') {
          this.langTag = [{
            level: 3,
            name: "英语"
          }];
          this.initLange = '英语';
        }
        if (data == '德语') {
          this.langTag = [{
            level: 3,
            name: "德语"
          }];
          this.initLange = '德语';
        }
        if (data == '日语') {
          this.langTag = [{
            level: 3,
            name: "日语"
          }];
          this.initLange = '日语';
        }
        if (data == '其他') {
          this.langTag = [{
            level: 3,
            name: "其他"
          }];
          this.initLange = '其他';
          this.otherLanguage = true;
          this.otherLang = false;
        } else if (data == '不限') {
          this.langTag = [];
        } else {
          this.otherLanguage = false;
          this.otherLang = true;
        }
      },
      funAddLangTag: function (value) {
        this.otherLanguage = false;
        this.otherLang = true;
        if (value == '英语') {
          this.initLange = '英语';
        }
        if (value == '德语') {
          this.initLange = '德语';
        }
        if (value == '日语') {
          this.initLange = '日语';
        }
        if (value) {
          if (value.length < 32) {
            this.langTag = [{
              level: 3,
              name: this.inputNewLangTag
            }];
          } else {
            this.funShowTip('不能超过32字');
            return;
          }
        }
      },

      /**获取期望工作地点**/
      intentRegion(region) {
        this.inner.psnJobIntentInfo.psnIntentNation = region.area.code;
      },
      //获取修改的工作经历地点
      experienceRegion(data) {
         this.experRegion = data.area.code;
      },
      //获取添加的工作经历点
      addExperienceRegion(data) {
        this.addExperRegion = data.area.code;
      },
      //获取修改的居住地
      liveRegion(data) {
        console.log(data);
      },

      /***上传附件相关方法***/

      submitUpload() {
        //this.$refs.upload.submit();
        let reads = new FileReader();
        let f = this.$refs.upload.uploadFiles[0].raw;//拿到上传的简历
       
        reads.readAsDataURL(f);
        console.log(this.orderId);
        let formData = new FormData();
        formData.append("action", "save");
        formData.append("userid", this.orderId);
        formData.append("entid", Cookies.get('entid-b'));
        formData.append("userid_b",  Cookies.get('userid-b'));
        formData.append("pagename", "bdocinf");
        formData.append("entResume",  f);

         $.ajax({
            url: APIEntBin,
            async: true,
            type: "post",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: formData,
            success: function (res) {
              let jsonRes = JSON.parse(res);
              if (jsonRes.status == "ok") {
                if (jsonRes.msg) {
                  // self.headPic = jsonRes.msg.psnPicSrc;
                  console.log(jsonRes);
                }
              }
            }
          });

        
      },
      uploadSuccess() {
        alert("上传成功");
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      birthPlace(data) {
        this.inner.psnPersonInfo.psnPerNation = birthPlace.city.code;
      },
      //上传图片
      funChoosed: function (id) {
        var self = this;
        let reads = new FileReader();
        let f = document.getElementById(id).files[0];
        reads.readAsDataURL(f);
        reads.onload = function (e) {
          self.headPic = this.result;
        };
        if (f.name.indexOf("jpg") != -1 || f.name.indexOf("png") != -1) {
          self.changePic = false;
          self.picTip = "";
          let formData = new FormData();
          formData.append("action", "save");
          formData.append("cuserid", self.orderId);
          formData.append("entid", self.entid);
          formData.append("pagename", "psnimg");
          formData.append("entPicFile", f);
          $.ajax({
            url: APIEntBin,
            async: true,
            type: "post",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: formData,
            success: function (res) {
              let jsonRes = JSON.parse(res);
              if (jsonRes.status == "ok") {
                if (jsonRes.msg) {
                  self.headPic = jsonRes.msg.psnPicSrc;
                }
              }
            }
          });
        } else {
          self.headPic = "";
          self.picTip = "您未上传文件，或者您上传文件类型有误!";
          return false;
        }
      },

      //退出
      signOut: function () {
        Cookies.remove("userid-p");
        Cookies.remove("entid-p");
        Cookies.remove("token");
        location.href = "/";
      },

      handleClose(arr, item) {
        arr.splice(arr.indexOf(item), 1);
      },
      /**
       *
       * @param {array} item
       * @param {string} value
       */
      funAddTag(item, value) {
        let a = 0;
        if (value) {
          if (value.length < 32) {
            for (var i in item) { //判断有没有添加过
              if (item[i] == value) a++;
            }
            if (!a) {
              if (item.length < 6) { //限定了标签个数
                item.push(value);
              } else {
                item.splice(5, 1, value);
              }
            } else {

            }
          } else {

          }
        }
      },

      //保存标签
      saveTag: function (arr, type) {
        var self = this;
        if (arr.length) {
          let postPort = type + 'inner';
          let arrString = arr.join();
          $.ajax({
            url: APIB,
            async: true,
            type: "post",
            dataType: "json",
            data: {
              action: "save",
              type: "p",
              cuserid: self.orderId,
              entid: self.entid,
              pagename: postPort,
              msg: arrString
            },
            success: function (res) {
              if (res) {
                let jsonRes = JSON.parse(res);
                console.log(res);
                if (jsonRes.status == "ok") {}
              } else {
                console.log('数据为空');
              }
            }
          });
        }
        if (self.addSkill) {
          self.addSkill = false;
        }
        if (self.addKnow) {
          self.addKnow = false;
        }
        if (self.addTool) {
          self.addTool = false;
        }
        if (self.addOther) {
          self.addOther = false;
        }
      },

      /**
       * 将编辑过的信息post到后端服务器
       */
      saveBaseInfo: function () {
        var self = this;
        self.editBaseInfo = false;
        self.psnBaseInfo.psnCurrDate = '';
        self.location = '';
        //findCode() 可以用
        self.psnBaseInfo.psnNation = findCode('');
        var baseInfoValue = {
          psnName: self.psnBaseInfo.psnName,
          psnSex: self.psnBaseInfo.psnSex,
          psnNation: self.psnBaseInfo.psnNation,
          psnIndustry: self.psnBaseInfo.psnIndustry,
          psnNowJob: self.psnBaseInfo.psnNowJob,
          psnNowCompany: self.psnBaseInfo.psnNowCompany,
          psnCurrDate: self.psnBaseInfo.psnCurrDate,
          psnNowPay: self.psnBaseInfo.psnNowPay
        };
        $.ajax({
          url: APIB,
          async: true,
          type: "post",
          dataType: "json",
          data: {
            action: "save",
            type: "p",
            cuserid: self.orderId,
            entid: self.entid,
            pagename: "psnbaseinfoinner",
            msg: JSON.stringify(baseInfoValue)
          },
          success: function (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              // self.psnBaseInfo = jsonRes.msg.psnBaseInfo
            }
            return false;
          }
        });
        return false;
      },
      //提交个人信息
      savePersonInfo: function () {
        var self = this;
        self.editPersonInfo = false;
        self.inner.bornLocation = '';
        self.inner.psnPersonInfo.psnPerNation = findCode('');
        console.log(self.borthTime.getFullYear());
        var personInfoValue = {
          psnLang: "[" + JSON.stringify(self.langTag[0]) + "]",
          psnPerNation: self.birthPlaceCode.city,
          psnWorkState: self.inner.psnPersonInfo.psnWorkState,
          psnBirth: self.borthTime.getFullYear() + '-' + (self.borthTime.getMonth() + 1) + '-' + self.borthTime
            .getDate(),
          psnStartWork: self.startWorkTime,
          psnBirth: '2019-12-12',
          psnStartWork: self.startWorkTime.getFullYear(),
          psnMarriage: self.inner.psnPersonInfo.psnMarriage,
          psnIndustry: self.inner.psnPersonInfo.psnIndustry
        };
        console.log(personInfoValue);

        $.ajax({
          url: APIB,
          async: true,
          type: "post",
          dataType: "json",
          data: {
            action: "save",
            type: "p",
            cuserid: self.orderId,
            entid: self.entid,
            pagename: "psnpersoninfoinner",
            msg: JSON.stringify(personInfoValue)
          },
          success: function (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {}
          }
        });
      },

      //提交求职意向
      saveJobIntentInfo: function () {
        var self = this;
        self.editJobIntentInfo = false;

        console.log(findValue('130204'));
        self.inner.psnJobIntentInfo.psnIntentAdd = findValue(self.inner.psnJobIntentInfo.psnIntentNation);

        var jobIntentValue = {
          psnIntentJob: self.inner.psnJobIntentInfo.psnIntentJob,
          psnIntentAdd: self.inner.psnJobIntentInfo.psnIntentAdd,
          psnIntentNation: self.inner.psnJobIntentInfo.psnIntentNation,
          psnIntentJobType: self.inner.psnJobIntentInfo.psnIntentJobType,
          psnIntentPay: self.inner.psnJobIntentInfo.psnIntentPay,
          psnIntentInd: self.inner.psnJobIntentInfo.psnIntentInd
        };
        console.log(jobIntentValue);

        $.ajax({
          url: APIB,
          async: true,
          type: "post",
          dataType: "json",
          beforeSend: function (request) {
            request.setRequestHeader("token", Cookies.get("token"));
          },
          data: {
            action: "save",
            type: "p",
            cuserid: self.orderId,
            entid: self.entid,
            pagename: "psnjobintentinfoinner",
            msg: JSON.stringify(jobIntentValue)
          },
          success: function (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              // self.psnPersonInfo = jsonRes.msg.psnJobIntentInfo
            }
          }
        });
      },

      /**
       *@param {object} workInfo - 新增加的工作信息
       *@param {Array} psnWorkInfo - 总的工作信息
       */
      saveWorkInfo: function () {
        var self = this;
        self.workInfo.psnWorkStartTime = new Date(this.addWorkStart).getFullYear() + '-' + (new Date(this
          .addWorkStart).getMonth() + 1);
        self.workInfo.psnWorkEndTime = new Date(this.addWorkEnd).getFullYear() + '-' + (new Date(this.addWorkEnd)
          .getMonth() + 1);
        self.workInfo.workinfoid = Date.parse(new Date());
        self.workInfo.psnJobLoc = '';
        var workInfoValue = {
          psnCompany: self.workInfo.psnCompany,
          // 'industry': self.workInfo.industry,
          psnJobLoc: self.workInfo.psnJobLoc,
          psnJobNation: self.workInfo.psnJobNation,
          psnWorkStartTime: self.workInfo.psnWorkStartTime,
          psnWorkEndTime: self.workInfo.psnWorkEndTime,
          psnJobPart: self.workInfo.psnJobPart,
          psnJob: self.workInfo.psnJob,
          psnPay: self.workInfo.psnPay,
          psnJobDes: self.workInfo.psnJobDes,
          workinfoid: self.workInfo.workinfoid
        };


        $.ajax({
          url: APIB,
          async: true,
          type: "post",
          dataType: "json",
          data: {
            action: "save",
            type: "p",
            cuserid: self.orderId,
            entid: self.entid,
            pagename: "psnworkinfoinner",
            msg: JSON.stringify(workInfoValue)
          },
          success: function (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              self.inner.psnWorkInfo.push(workInfoValue);
              self.addWorksInfo = false;
              self.workInfo = {};
            }
          }
        });
      },

      /**
       * @param {obj} item
       * 删除单项信息
       */
      delWorkInfo: function (item, index) {
        var self = this;
        //将删除动作post到服务器中
        $.ajax({
          url: APIB,
          async: true,
          type: "post",
          dataType: "json",
          data: {
            action: "del",
            type: "p",
            cuserid: self.orderId,
            entid: self.entid,
            pagename: "psnworkinfoinner",
            msg: item.workinfoid
          },
          success: function (res) {
            if (res) {
              let jsonRes = JSON.parse(res);
              if (jsonRes.status == "ok") {
                //self.psnWorkInfo.splice(index, 1);
                // this.psnWorkInfo = jsonRes.msg.psnWorkInfo
              }
            } else {
              console.log('数据为空');
            }

          }
        });
      },

      /**
       * 打开表单，将index和item转存到中间变量
       */
      openEditWorkInfo: function (item, index) {
        this.editWork = true;
        this.obj = item;
        console.log(this.obj);
        this.workStart = new Date(this.obj.psnWorkStartTime.split(' ')[0]);
        this.workEnd = new Date(this.obj.psnWorkEndTime.split(' ')[0]);
        console.log(this.workStart);
        console.log(this.workEnd);
        this.index = index;

      },
      editWorkInfo: function () {
        var self = this;
        self.editWork = false;

        self.obj.psnWorkStartTime = this.workStart;
        self.obj.psnWorkEndTime = this.workEnd;
        self.obj.psnJobLoc = '';
        self.obj.psnJobNation = findCode('');

        var workInfoValue = {
          psnCompany: self.obj.psnCompany,
          // 'industry': self.workInfo.industry,
          psnJobLoc: self.obj.psnJobLoc,
          psnJobNation: self.experRegion,
          psnWorkStartTime: self.obj.psnWorkStartTime,
          psnWorkEndTime: self.obj.psnWorkEndTime,
          psnJobPart: self.obj.psnJobPart,
          psnJob: self.obj.psnJob,
          psnPay: self.obj.psnPay,
          psnJobDes: self.obj.psnJobDes,
          workinfoid: self.obj.workinfoid
        };
        console.log(workInfoValue);

        $.ajax({
          url: APIB,
          async: true,
          type: "post",
          dataType: "json",
          data: {
            action: "save",
            type: "p",
            cuserid: self.orderId,
            entid: self.entid,
            pagename: "psnworkinfoinner",
            workinfoid: self.obj.workinfoid,
            msg: JSON.stringify(workInfoValue)
          },
          success: function (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              self.obj = {};
              self.index = 0;
              self.experRegion = '';
            }
          }
        });
      },

      saveEduInfo: function () {
        var self = this;
        self.eduInfo.psnGradTime = new Date(this.addEducationEnd).getFullYear() + '-' + (new Date(this
          .addEducationEnd).getMonth() + 1);
        self.eduInfo.psnEduStartTime = new Date(this.addEducationStart).getFullYear() + '-' + (new Date(this
          .addEducationStart).getMonth() + 1);
        self.eduInfo.eduinfoid = Date.parse(new Date());

        var eduInfoValue = {
          psnSchool: self.eduInfo.psnSchool,
          psnMajor: self.eduInfo.psnMajor,
          psnDegree: self.eduInfo.psnDegree,
          psnGradTime: self.eduInfo.psnGradTime,
          psnEduStartTime: self.eduInfo.psnEduStartTime,
          eduinfoid: self.eduInfo.eduinfoid,
          psnDegreeSign: self.eduInfo.psnDegreeSign
        };

        $.ajax({
          url: APIB,
          async: true,
          type: "post",
          dataType: "json",
          data: {
            action: "save",
            type: "p",
            pagename: "psneduinfoinner",
            cuserid: self.orderId,
            entid: self.entid,
            msg: JSON.stringify(eduInfoValue)
          },
          success: function (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              self.addEdusInfo = false;
              console.log('success');
              self.inner.psnEduInfo.push(eduInfoValue);
            }
          }
        });
      },
      delEduInfo: function (item, index) {
        var self = this;
        //将删除动作post到服务器中
        $.ajax({
          url: APIB,
          async: true,
          type: "post",
          dataType: "json",
          beforeSend: function (request) {
            request.setRequestHeader("token", Cookies.get("token"));
          },
          data: {
            action: "del",
            type: "p",
            pagename: "psneduinfoinner",
            cuserid: self.orderId,
            entid: self.entid,
            msg: item.eduinfoid
          },
          success: function (res) {
            let jsonRes = JSON.parse(res);
            if (jsonRes.status == "ok") {
              self.psnEduInfo.splice(index, 1);
              // self.psnEduInfo = jsonRes.msg.psnEduInfo
            }
          }
        });
      },
      openEditEduInfo: function (item, index) {
        this.editEdu = true;
        this.obj = item;

        this.educationStart = new Date(this.obj.psnEduStartTime.split(' ')[0]);
        this.educationEnd = new Date(this.obj.psnGradTime.split(' ')[0]);
        this.index = index;
      },

      //修改教育经历
      editEduInfo: function () {
        var self = this;
        var editEduInfoValue = {
          psnSchool: self.obj.psnSchool,
          psnMajor: self.obj.psnMajor,
          psnDegree: self.obj.psnDegree,
          psnGradTime: self.obj.psnGradTime,
          psnEduStartTime: self.obj.psnEduStartTime,
          eduinfoid: self.obj.eduinfoid,
          psnDegreeSign: self.obj.psnDegreeSign
        };
        console.log(editEduInfoValue);
        return;
        $.ajax({
          url: APIB,
          async: true,
          type: "post",
          dataType: "json",
          beforeSend: function (request) {
            request.setRequestHeader("token", Cookies.get("token"));
          },
          data: {
            action: "save",
            type: "p",
            pagename: "psneduinfoinner",
            cuserid: self.orderId,
            entid: self.entid,
            eduinfoid: self.obj.eduinfoid,
            msg: JSON.stringify(editEduInfoValue)
          },
          success: function (res) {
            if (res) {
              let jsonRes = JSON.parse(res);
              if (jsonRes.status == "ok") {
                self.editEdu = false;
                // self.psnEduInfo = jsonRes.msg.psnEduInfo

                //self.psnEduInfo.splice(self.index, 1, self.obj);  显示问题
                self.index = 0;
                self.obj = {};
              }
            } else {
              console.log('数据为空');
            }
          }
        });
      },

    }
  };
</script>