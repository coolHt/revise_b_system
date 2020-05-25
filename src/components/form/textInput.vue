<template>
  <div class="textInput">
    <label class="inputLabel" v-if="labelText">
      <span v-if="mustFill" class="mustFillIcon">*</span>
      <span class="labelText">{{labelText}}</span>
    </label>
    <div class="inputCommon" :style="widthStyle">
      <input :type="category" class="inputStyle" :class="isErr || isEmpty ? 'errorBorder' : ''" v-model="value" placeholder="请填写" @change="returnValue" @input="returnValue">
      <p class="errortxt" v-if="isEmpty">{{emptyText}}</p>
      <p class="errortxt" v-if="(isErr && !isEmpty)">{{errorText}}</p>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    width: {
      type: String,
      default: "300px"
    },
    labelText: { //标题文字
      type:String,
      default: ""
    },
    inputType:{ //输入框类型
      type:String,
      default: "",
    },
    valueVerify: {
      type: String,
      default: '',
      identifyType: 'empty'
    },
    inputValue: {
      type: String,
      default: '',
    },
    identify: { //相应检验
      type: Boolean,
      default: false
    },
    mustFill:{ //是否必填
      type: Boolean,
      default: false
    },
    emptyText: { //为空提示
      type: String,
      default: "请填写该字段"
    },
    errorText: { //错误提示
      type: String,
      default: "输入格式有误"
    },
    category: {
      type: String,
      default: "text"
    },
    handlerError: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      isErr: false,
      isEmpty: false, //判断是否为空
      mailReg:/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/,
      certReg:/^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$/,
      phoneReg:/^1[3456789]\d{9}$/,
      //
      value: "",
      identifyType: "",
      access: false,
      widthStyle: {
        width: this.width
      }
    }
  },
  watch: {
    "inputValue": {
      handler: function(){
        this.value = this.inputValue;
      },
      immediate: true
    },
    "width": {
      handler: function(){
        this.widthStyle = {
          width: this.width
        };
      },
      immediate: true
    },
    //手动调用报错信息
    "handlerError": function(){
      if(this.handlerError) this.triggleError();
    },
    "valueVerify": {
      handler: function(){
          this.identifyType = this.valueVerify; //"" | type
      },
      immediate: true
    },
    "identify": {
      handler: function(){
        if(Object.is(this.identify, true)){
          const t = this.identifyType;
          if(!t){
            this.$emit("isAccess", true);
          }else{
            //if(!this.value) return;
            let v;
            typeof this.value == "number" ? v = this.value : v = this.value.trim();
            //不需要判断empty情况
            if(!v){ //如果为空
              this.isEmpty = true;
              this.$emit("isAccess", false);
              return;
            }else{
              //判断格式, value 不能trim(), 需要使用原始数据判断
              this.checkType(t, this.value);
              this.isErr ? this.$emit("isAccess", false) : this.$emit("isAccess", true);
            }
          }
        }
      },
      immediate: true
    }
  },
  methods:{
    //邮箱
    //执照
    //手机
    //密码
    returnValue(){ //向外返回数据
      let v = this.value;
      this.isErr = false;
      if(!v){
        this.$emit("returnValue", "");
        return;
      }
      this.isEmpty = false;
      this.checkType(this.identifyType, v);
      if(this.isErr) return;
      this.$emit("returnValue", v);
    },
    //判断类型
    checkType(t, v){
      switch(t){
        case "mail":
          this.mailReg.test(v) ? this.isErr = false : this.isErr = true;
          break;
        case "phone":
          this.phoneReg.test(v) ? this.isErr = false : this.isErr = true;
          break;
        case "certificate":
          this.certReg.test(v) ? this.isErr = false : this.isErr = true;
          break;
        // case "number":
        //   parseInt(v) == NaN ? this.isErr = false : this.isErr = true;
      }
    },
    //手动调用类型错误
    triggleError(){
      this.isErr = true;
    }
  }
}
</script>
<style scoped>
.textInput .mustFillIcon{
  color: rgb(200, 42, 46) !important;
  font-size: 15px;
}
.inputLabel{
  display: block;
  width: 150px;
  height: 45px;
  line-height: 45px;
  text-align: right;
  box-sizing: border-box;
  margin: 0;
  padding: 0 10px 0 0;
  float:left;
}
.labelText{
  margin-bottom: 0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
}
.textInput .inputStyle{
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
.textInput{
  overflow: hidden;
}
.inputCommon{
  float:left;
}
.errortxt{
  color:rgb(200, 42, 46);
  font-size: 14px;
  width: 100%;
  margin: 5px 0 0 0;
  padding: 0;
  text-align: left;
}
.errorBorder{
  border: 1px dashed rgb(200, 42, 46) !important;
}
</style>