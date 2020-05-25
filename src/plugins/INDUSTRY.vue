<template>
  <div class="chooseIndustry">
    <input id='industry' type="text" placeholder="请输入所在行业" v-model='industry' @focus="industryShow=true"
      @blur="changeIndustryShow" class="patternSelect" autocomplete="off">
    <div class="selectItem" v-show="industryShow" ref="selectItem">
      <div style="width:120px;">
        <!-- <el-checkbox-group style="margin:5px 0;" v-model="allIndustry" @change="allSelect">
          <el-checkbox label="行业不限"></el-checkbox>
        </el-checkbox-group> -->
        <el-checkbox-group v-model="carIndustry" @change="carSelect" style="margin:5px 0;" :disabled='couldClick?false:true'>
          <el-checkbox label="汽车行业"></el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group style="margin:5px 0;" v-model="otherIndustries" @change="otherSelect">
          <el-checkbox label="其他行业"></el-checkbox>
        </el-checkbox-group>
      </div>
      <el-checkbox-group v-show="showIndustry" v-model="checkedIndustry" class="industryBox" >
        <div v-for="(i,index) in industries" class="industryItems" :key="index">
          <el-checkbox :label="i" :key="i">{{i}}</el-checkbox>
        </div>
      </el-checkbox-group>

      <div class="inputOhter" v-show="inputIndustryShow">
        <el-input v-model="inputIndustry" placeholder="请输入其他行业"></el-input>
      </div>

      <div style="width:100%;">
        <button type="button" class="selectIndustry" @click="setSelectIndustry">选择完成</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      showValue: String
    },
    data() {
      return {
        industryShow: false,
        showIndustry: false,
        industries: [
          "发动机/整车厂",
          "传动系统",
          "转向/悬架/车轮和轮胎",
          "车桥/制动器/车身控制",
          "车身与外装部件",
          "汽车内装部件",
          "温度调节控制",
          "驾驶辅助与无线通信系统",
          "电子/电装零部件",
          "小型/通用元件",
        ],
        industry: '',
        allIndustry: ["行业不限"],
        carIndustry: [],
        couldClick:  true, //控制是否可以选择
        otherIndustries: [],
        checkedIndustry: [],
        inputIndustry: '',
        inputIndustryShow: false,
        industrySelect: '汽车行业',
      }
    },
    watch: {
      'showValue': {
        handler: function () {
          if (this.showValue) {
            this.industry = this.showValue;
          }
        },
        immediate: true
      }
    },
    methods: {
      //失去焦点
      changeIndustryShow() {
        let _this = this;
        document.addEventListener("click", function (e) {
          let s = _this.$refs.selectItem;
          if (s) {
            if (s.contains(e.target) == false && e.target != document.getElementsByClassName("patternSelect")[0]) {
              _this.industryShow = false;
            }
          }
        });
      },
      allSelect(data) {
        this.couldClick = true;
        if (data.length > 0) {
          this.carIndustry = [];
          this.checkedIndustry = [];
          this.otherIndustries = [];
          this.showIndustry = false;
          this.inputIndustryShow = false;
          this.industrySelect = '行业不限';
          this.inputIndustry = "";
        } else {
          this.industrySelect = '';
        }
      },
      carSelect(data) {
        if (data.length > 0) {
          this.couldClick = false;
          this.allIndustry = [];
          this.otherIndustries = [];
          this.industrySelect = '汽车行业';
          this.showIndustry = true;
          this.inputIndustryShow = false;
        } else {
          this.checkedIndustry = [];
          this.industrySelect = '';
        }
      },
      otherSelect(data) {
        this.couldClick = true;
        if (data.length > 0) {
          this.carIndustry = [];
          this.checkedIndustry = [];
          this.allIndustry = [];
          this.showIndustry = false;
          this.inputIndustryShow = true;
          this.industrySelect = '其他行业';
        } else {
          this.industrySelect = '';
        }
      },
      
      setSelectIndustry() {
        if (!this.industrySelect) {
          this.industry = this.checkedIndustry.toString();
        }
        if (this.industrySelect == '汽车行业') {
          if(this.checkedIndustry.length > 0){
          this.industry = `汽车行业 ( ${this.checkedIndustry.toString()} )`;
          }else{
            this.industry = '汽车行业';
          }
        }
        if (this.industrySelect == '行业不限') {
          this.industry = '行业不限';
        }

        if (this.industrySelect == '其他行业') {
          this.industry = this.inputIndustry;
        }

        this.$emit("value", this.industry);

        this.industryShow = false;
      }
    }
  }
</script>
<style scoped>
  .chooseIndustry {
    position: relative;
  }

  .selectItem {
    display: flex;
    position: absolute;
    left: 0;
    z-index: 10;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-top: none;
    padding: 5px 10px;
    width: 100%;
    flex-wrap: wrap;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    padding-bottom: 20px;
  }

  .selectItem .chooseSuccess {
    float: unset;
    display: block;
    margin: 20px auto 0 auto;
    outline: none;
    width: 100px;
  }

  .selectItem ul li {
    margin-bottom: 10px;
  }

  .selectIndustry {
    padding: 12px 18px;
    display: block;
    margin: 20px auto 0 auto;
    border: 1px solid #dddddd;
    border-radius: 6px;
    background: #ffffff;
    font-size: 14px;
  }

  .industryItems input {
    width: 150px !important;
  }
</style>