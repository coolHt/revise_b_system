<template>
  <div class="entInfoContainer">
    <div class="card">
      <div class="card-content">
        <div id='entBaseInfoForm'>
          <div class="draft-job">
            <h5>{{type === "project" ? "项目风采" : "企业风采"}}</h5>
          </div>
          <div class="infor_field betweenField">
            <div style="width:150px;">
              <div class="picUpload">
                <input type="file" @change="fileUpload('bearing')" class="upload_style" ref="bearing">
                <div class="picUploadBg">
                  <i class="cameraIcon"></i>
                </div>
              </div>
              <p style="margin-top:5px;color:#c82a2e;font-size:13px;">* 图片尺寸建议大于300 * 240 且 小于 900 * 720</p>
            </div>
            <div class="picCropper" v-if="bearingImg">
              <div class="cropperContainer">
                <VueCropper ref="cropper" :img="option.img" :outputSize="option.size" :autoCrop="true"
                  :centerBox="false" :info="false" :fixed="true" :autoCropWidth="option.autoCropWidth"
                  :autoCropHeight="option.autoCropHeight" :fixedNumber="option.fixedNumber">
                </VueCropper>
              </div>
              <button class="addProductBtn" @click="bearingImg=false">取消</button>
              <button class="addProductBtn" @click="confirmCropper">确定</button>
            </div>
            <div class="imagesListContainer">
              <div class="imagesList">
                <div class="listSingle" v-for="(img, index) in imgs" :key="index">
                  <img src="../../assets/images/black_close.png" alt="" class="deleteImg" @click="deleteImg(img.picid)">
                  <img :src="'https://www.azhiye.com/cloudimg/' + img.entPicSrc" alt="" class="singleimage">
                </div>
              </div>
            </div>
            <div class="uploadImg_container multipleImg">
              <div v-for="(img, index) in imgs" :key="index" class="item_uploadImg">
                <span class="deleteUpload" @click="deleteImg(img.picid)">删除</span>
                <img :src="'https://www.azhiye.com/cloudimg/' + img.entPicSrc" alt="" class="uploadImg">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import xz from "../../common";
  import {
    VueCropper
  } from 'vue-cropper';
  export default {
    components: {
      VueCropper
    },
    props: {
      entid: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ""
      }
    },
    data: function () {
      return {
        imgs: [],
        maxSize: 10485760,
        bearingImg: false,
        imageName: '',
        bearingImages: [],
        option: {
          img: '',
          size: 1,
          autoCropWidth: '300px',
          autoCropHeight: '240px',
          fixedNumber: [5, 4]
        },
      }
    },
    watch: {
    'entid': {
        handler: function(){
          if(this.entid){
           this.getImgs();
          }
        },
        immediate: true
      },
      "type": {
        handler: function(){
          if(this.type === "project"){
            this.option = {
              img: '',
              size: 1,
              autoCropWidth: '320px',
              autoCropHeight: '240px',
              fixedNumber: [4, 3]
            }
          }
        },
        immediate: true
      },
    },
    methods: {
      //获取图片
      getImgs(){
        xz.getCompanyImages(this.entid).then( res => {
          console.log(res.entpicinfo);
          res ? this.imgs = (res.entpicinfo ? res.entpicinfo : []) : console.log('获取图片出错');
        })
      },
      fileUpload(t){
        let fileBox = this.$refs[t];
        let files = fileBox.files;
        let fileName = files[0].name;
        let maker = files[0].name.substr(files[0].name.lastIndexOf(".")).toLowerCase(); //后缀名
        let pre = fileName.substring(0, fileName.lastIndexOf("."));
        let types = ['.jpg', '.jpeg', '.png'];
        //判断文件名字中是否有中文
        let hasChinese = this.$store.getters.stringHasChinese(fileName);
        if (types.indexOf(maker) == -1) { //判断图片类型
          fileBox.value = '';
          alert('选择的文件格式有误，请重新选择');
          return;
        }
        //判断图片大小
        if (files[0].size > this.maxSize) {
          fileBox.value = ''; //清空
          alert('选择的文件过大，请重新选择(不超过10M)');
          return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(files[0]); //读取文件
        hasChinese ? this.product_name = new Date().valueOf() + maker : this.product_name = pre + maker;
        reader.onload = e => { //文件读取成功后
          this.option.img = e.target.result;
          console.log(1);
          this[t + "Img"] = true;
        }
      },
      confirmCropper() { //选择
        this.$refs.cropper.getCropData((data) => {
          if(!this.entid) return;
          //获取截取的图
          //base64 转file
          let files = this.$store.getters.base64ToFile(data, this.product_name);
          let pro = {
            type: 'entpicinfo',
            entPicFile: files,
            picid: new Date(files.lastModifiedDate).valueOf(),
            entPicTitle: this.imageName,
            entPicDes: '',
            blobName: files.name,
            entid: this.entid,
          }
          xz.uploadImage(pro).then( res => {
            if(res){
              this.bearingImg = false;
              this.getImgs(); ///保存成功再获取出来
            }else{
              console.log("上传图片出错");
            }
          });
        })
      },
      //删除图片
      deleteImg(picid){
        xz.deletePic(this.entid, 'entpicinfo', picid).then( res => {
          res ? this.getImgs() : console.log("删除图片出错");
        })
      }
    }
  }
</script>
<style scoped>
.picCropper{
  width: 550px;
}
.cropperContainer{
  width:550px;height:300px;
}
.betweenField{
  align-items: flex-start;
  justify-content: space-between;
}
.addProductBtn{
  margin-right: 30px;
}
.imagesListContainer{
  width: 710px;
  margin-top: 15px;
}
.imagesList{
  width: 711px;
  display: flex;
  margin-left: -15px;
  flex-wrap: wrap;
}
.listSingle{
  width: 220px;
  margin-left: 15px;
  position: relative;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
}
.listSingle .singleimage{
  display: block;
  width: 100%;
  height: auto;
}
.deleteImg{
  position: absolute;
  right: 8px;
  top: 8px;
  display: block;
  width: 25px;
  height: 25px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.8)
}
</style>