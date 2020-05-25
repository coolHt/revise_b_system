<template>
  <div class="row">
    <div class="am-u-md-12 am-u-sm-12 row-mb">
      <span class="name">
        {{card.psnName}}
        <span class="btn-add" v-if="card.status=='1'">已激活</span>
        <span class="btn-not-add" v-else>待激活</span>
      </span>
      <br>
      <span class="tel" v-if="card.tel">{{card.tel}}</span>
      <span class="tel" v-else>未填写</span>
      <br>
      <p>{{card.psnNowCompany}} | {{card.psnNowJob}}</p>
      <hr>
    </div>
  </div>
</template>

<script>
  import Cookies from "vue-cookies";
  export default {
    props: {
      singleInfo: Object
    },

    data() {
      return {
        location: "上海",
        psnInfo: {
          psnid: "",
          tel: "13856471111",
          psnName: "Alex.",
          psnSex: "男",
          psnNowJob: "质量工程师",
          psnNowCompany: "宁波均胜电子股份有限公司",
          psnNowPay: "22-28W",
          entJobAdd: "",
          status: "2"
        },
        card: {
          psnName: '',
          tel: '',
          psnNowJob: '',
          psnNowCompany: '',
          status: 0,
        }
      };
    },
    watch: {
      'singleInfo': {
        handler: function () {
          console.log(this.singleInfo);
          if (this.singleInfo.psnName) {
            this.card = this.singleInfo;
            console.log(this.card);
          }
        },
        immediate: true
      }
    }


  };
</script>
<style scoped>
  .name {
    margin: 15px 0;
    position: relative;
    display: inline-block;
    height: 22px;
    font-size: 22px;
    line-height: 22px;
  }

  .tel {
    margin: 10px 0;
    position: relative;
    display: inline-block;
    height: 18px;
    font-size: 18px;
    line-height: 18px;
  }

  .pay {
    color: #e7505a;
  }

  .title {
    height: 15px;
    font-size: 15px;
    line-height: 15px;
  }

  .btn-add {
    display: inline-block;
    font-size: 12px;
    padding: 2px;
    border: 1px solid #32c5d2;
    border-radius: 4px;
    color: #fff;
    background-color: #32c5d2;
  }

  .btn-not-add {
    display: inline-block;
    font-size: 12px;
    padding: 2px;
    border: 1px solid #ed6b75;
    border-radius: 4px;
    color: #fff;
    background-color: #ed6b75;
  }
</style>