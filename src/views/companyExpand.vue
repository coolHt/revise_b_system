<template>
  <div class="workPoolItem" style="width: 1000px">
    <div style="width:750px;margin:0 auto;">
      <p class="entNameStyle">{{entName}}</p>
      <el-tabs v-model="materialType" @tab-click="handleClick">
        <el-tab-pane :label="type === 'project' ? '项目头像' : '企业头像'" name="avatar"></el-tab-pane>
        <el-tab-pane :label="type === 'project' ? '项目风采' : '企业风采'" name="expand"></el-tab-pane>
        <el-tab-pane label="团队成员" name="member"></el-tab-pane>
        <el-tab-pane label="产品介绍" name="product"></el-tab-pane>
      </el-tabs>
    </div>
    <div v-show="materialType=='avatar'" class="entInfoContainer">
      <div class="card">
        <div class="card-content">
          <div id='entBaseInfoForm'>
            <div class="draft-job">
              <h5>{{type === 'project' ? "项目头像" : "企业头像"}}</h5>
            </div>
            <div class="infor_field" style="align-items: unset;">
              <div style="width:150px;">
                <div class="picUpload">
                  <input type="file" @change="fileUpload('avatar')" class="upload_style" ref="avatar">
                  <div class="picUploadBg">
                    <i class="cameraIcon"></i>
                  </div>
                </div>
                <p style="margin-top:5px;color:#c82a2e;font-size:13px;">* 图片尺寸建议大于300 * 240 且 小于 900 * 720</p>
              </div>
              <img :src="avatar" alt="" v-if="avatar" class="avatarImage">
            </div>
            <div class="infor_field">
              <div class="picCropper" v-if="avatarImg">
                <div style="width:660px;height:300px;margin-top:10px;">
                  <VueCropper ref="cropper" :img="option.img" :outputSize="option.size" :autoCrop="true"
                    :centerBox="false" :info="false" :fixed="true" :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight" :fixedNumber="option.fixedNumber">
                  </VueCropper>
                </div>
                <button @click="confirmCropper()" class="addProductBtn">保存头像</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Mien v-if="type !== 'project'" v-show="materialType=='expand'" :entid="editId" ></Mien>
    <ProjectMein v-else v-show="materialType=='expand'" :entid="editId" ></ProjectMein>
    <Product v-show="materialType=='product'" :entid="editId" :type="type"></Product>
    <Member v-show="materialType=='member'" :entid="editId" :type="type"></Member>
  </div>
</template>
<script>
  import xz from "../common";
  import {VueCropper} from 'vue-cropper';
  //企业风采
  import Mien from '../components/companyExpand/mien';
  import Product from '../components/companyExpand/product';
  import Member from '../components/companyExpand/member';
  // 项目风采
  import ProjectMein from '../components/companyExpand/projectMien';
  export default {
    props: {
      entid: {
        type: String,
        default: ""
      },
      entname: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ""
      }
    },
    components: {
      VueCropper,
      Mien,
      ProjectMein,
      Product,
      Member
    },
    data: function () {
      return {
        materialType: "avatar",
        editId: "",
        entName: "",
        avatar: "",
        avatarImg: false,
        option: {
          img: '',
          size: 1,
          autoCropWidth: '240px',
          autoCropHeight: '240px',
          fixedNumber: [4, 4]
        },
      };
    },
    mounted() {
    },
    computed: {},
    watch: {
      'entid': {
        handler: function () {
          this.editId = this.entid;
          this.getImgs();
        },
        immediate: true
      },
      'entname': {
        handler: function () {
          this.entName = this.entname;
        },
        immediate: true
      },
      
    },
    methods: {
      //获取图片
      getImgs() {
        xz.getCompanyImages(this.entid).then(res => {
          res ? this.avatar = (res.entlogoinfo.entPicSrc ? 'https://www.azhiye.com/cloudimg/' + res.entlogoinfo.entPicSrc : "") : console.log('获取图片出错');
          console.log(this.avatar);
        })
      },
      fileUpload(t){
        let fileBox = this.$refs[t];
        let files = fileBox.files;
        let fileName = files[0].name;
        let maker = fileName.substr(fileName.lastIndexOf(".")).toLowerCase(); //后缀名
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
          this[t + "Img"] = true;
        }
      },
      confirmCropper() { //选择
        this.$refs.cropper.getCropData((data) => {
          if(!this.entid) return;
          //获取截取的图
          //base64 转file
          let files = this.$store.getters.base64ToFile(data, this.product_name);
          let mein = {
            blobName: files.name,
            entPicFile: files,
          }
          xz.uploadAvatar(this.editId, mein).then( res => {
            if(res){
              this.avatarImg = false;
              this.getImgs(); ///保存成功再获取出来
            }else{
              console.log("上传图片出错");
            }
          });
        })
      },
    }
  };
</script>
<style scoped>
.entNameStyle{
  font-weight: bold;
  font-size: 22px;
  color: #333;
}
</style>>
