<template>
  <div class="addressContainer">
    <div class="addressTitle">
      <h1>添加门店</h1>
      <div class="addressBtnContainer">
        <!-- <button type="button" class="cancalSave" @click="cancelEdit">取消</button> -->
        <button type="button" class="saveAddress" @click="saveAddressList">保存</button>
      </div>
    </div>
    <div class="addressList" v-show="showForm">
      <div class="infor_field">
        <div class="topField">
          <div class="addressNote">
            <label for="">门店名称：</label>
            <input type="text" class="noteInput" v-model="editData.name">
          </div>
          <div class="addressNote">
            <label for="">招聘人数：</label>
            <input type="text" class="recruitNum" v-model="editData.num">
          </div>
          <div class="addressNote">
            <label for="">是否招聘：</label>
            <el-checkbox v-model="editData.recruit"></el-checkbox>
          </div>
        </div>
        <div class="topField">
          <div class="addressNote" style="display:flex;">
            <label for="">工作地点：</label>
            <div style="display:flex;align-items:center;">
              <MRegion class="custom-region" :fullrange="true" :selected="editData.selected" @cRegion="getRegion"
                :search="true" ref="provinceSelect"></MRegion>
              <span class="locateSplit">/</span>
              <input id="locDetail" v-model='editData.addressDetail' type="text" placeholder="详细地址" autocomplete="off"
                @blur="blurSearch">
            </div>
          </div>
        </div>
      </div>
        <div style="display:flex;align-items:center;margin-bottom:20px;">
          <span class="addAddress" @click="addAddress" v-if="!isEdit">新增</span>
          <span class="addAddress" @click="editAddress" v-else>修改</span>
          <span class="addAddress" @click="showForm=false">关闭</span>
        </div>
    </div>
    <div class="addressSearch">
      <div class="addressLists">
        <div class="addNewAddress" @click="addNewAddress">新增门店</div>
        <div>
          <ul>
            <li v-for="(address, index) in addressList" :key="index" class="singleAddress" :class="activeName == address.name ? 'activeAddress' : ''" @click="changeMarker(index)">
              <div style="padding: 15px;">
                <div class="editJob">
                  <span v-if="index > 0" @click="addressData(index)">修改</span>
                  <span v-if="index > 0" @click.stop="deleteAddress(index)">删除</span>
                </div>
                <p class="addressAreaName">{{address.name}}</p>
                <p class="addressInfor">招聘状态: {{address.recruit ? "招聘中" : "停止招聘"}}</p>
                <p class="addressInfor">招聘人数: {{address.num == 0 ? "若干" : address.num + "人"}}</p>
                <p class="addressInfor">地址: {{address.addressDetail}}</p>
              
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="mapContainer">
        <div id="mapSelector" style="width: 100%;height: 400px;"></div>
      </div>
    </div>
    <transition name="loadShadow">
      <div class="loadShadow" v-show="loadMap">
        <i class="loadgif"></i>
      </div>
    </transition>
    <!--确定放弃修改-->
    <el-dialog 
      width="300px"
      :append-to-body="true"
      :visible.sync="cancelVerity">
      <div class="cancelEditContainer">
        <h1>确定放弃修改?</h1>
        <div class="cancelBtnContainer">
          <button type="button" class="hiddenCancel" @click="cancelVerity=false">取消</button>
          <button type="button" class="verityCancel" @click="verityCancel">确定</button>
        </div>
      </div>
      
    </el-dialog>


  </div>
</template>
<script>
  export default {
    props: {
      initCode: null, //地区code
      address: { //详细地址
        type: String,
        default: ''
      },
      name: '', //传入的职位名称
      num: '', //传入的招聘人数
      closeType: false, // 门店关闭状态
      allAddress: [], //所有的门店
    },
    data: function () {
      return {
        activeName:'', //点击名称样式
        showForm: false, //显示新增修改表单
        isEdit: false,
        map: null, //地图控件
        marker: null, //地图点
        coordinate: null, //坐标点
        backupCoord: null, //用于备份
        lat: '',
        lng: '',
        selected:'',
        addressDetail:'',
        addressList: [],
        //修改或新增
        editData: {
          name: '',
          selected: '',
          addressDetail: '',
          lat: '',
          lng: '',
          num: 1,
          recruit: true
        },
        backData: {}, //备用初始化数据,
        addressBackup: [], //备份的数据
        cancelVerity: false,
        loadMap: false
      }
    },
    mounted() {
      this.loadMap = true;
      console.log(this.num);
      const store = this.$store.getters;
      const _this = this;
      this.selected = this.initCode;
      this.addressDetail = this.address;
      //职位表单中的数据
      let shop = {
        name: this.name ? this.name : "未命名",
        selected: this.initCode,
        addressDetail: this.address,
        lat: '',
        lng: '',
        num: this.num,
        recruit: true,
        interview: this.backData
      }
      console.log(shop);
      this.editData.selected  = this.selected;
      this.editData.addressDetail = this.addressDetail;
      let obj = store.codeToggleObj(this.selected);
      let address = store.localName(obj);
      //转换地区名
      if (this.addressDetail) address = address + this.addressDetail;
      let geocoder = new qq.maps.Geocoder();
      geocoder.getLocation(address);
      geocoder.setComplete(function (result) {
        //关闭加载层
        let detail = result.detail;
        let coordinate = detail.location; //坐标
        _this.backupCoord = coordinate; //备份
        //初始化第一个工作地点
        shop.lat = _this.lat = coordinate.lat;
        shop.lng = _this.lng = coordinate.lng;
        //显示第一个门店
        shop.addressName = store.localName(obj);
        _this.addressList.unshift(shop);
        //初始化地图
        _this.$nextTick(() => {
          _this.initMap();
          _this.loadMap = false;
        })
      })
    },
    watch: {
      'allAddress':{
        handler: function(){
          this.addressBackup = this.allAddress;
          console.log(this.addressBackup);
          if(this.allAddress.length >= 1){
            this.addressList = [];
            const _this = this;
            this.allAddress.forEach((address) => {
              //address.entNation
              let data = {
                  name: address.entRemark,
                  selected: address.entNation,
                  addressDetail: address.entAddr,
                  lat: address.entLat,
                  lng: address.entLong,
                  num: address.entRecruitNum,
                  recruit: address.entStatus  == 1 ? true : false
                };
                _this.addressList.push(data);
            })
            console.log(_this.addressBackup);
          }
        },
        immediate: true
      },
    },
    methods: {
      //固定点
      fixMarker(code){
        const store = this.$store.getters;
        let address = store.codeToggleObj(code);
        let addressName = store.localName(address, ","); //名称
        if(this.editData.addressDetail) addressName += "," + this.editData.addressDetail;
        const _this = this;
        let geocoder = new qq.maps.Geocoder();
        geocoder.getLocation(addressName);
        geocoder.setComplete((result) => {
          let detail = result.detail;
          let coordinate = detail.location; //坐标
          _this.backupCoord = _this.coordinate = coordinate; //保存坐标点
          _this.map.setCenter(coordinate); //移动地图中心
          _this.marker.setPosition(coordinate);
        })
      },
      //根据当前的地址换算坐标点
      toggleCoordinate(code){
        const _this = this;
        const store = this.$store.getters;
        let address = store.codeToggleObj(code);
        let addressName = store.localName(address, ","); //名称
        if(this.editData.addressDetail) addressName += "," + this.editData.addressDetail;
        let geocoder = new qq.maps.Geocoder();
        geocoder.getLocation(addressName);
        geocoder.setComplete(function (result) {
          let detail = result.detail;
          let coordinate = detail.location; //坐标
          _this.editData.lat = coordinate.lat;
          _this.editData.lng = coordinate.lng;
          _this.editData.addressName = store.localName(address);
          _this.addressList.push(_this.editData);
        })
      },
      //选择区域时定点
      getRegion: function (region) {
        if (region.area) {
          this.editData.selected = region.area.code;
        } else if (region.city) {
          this.editData.selected = region.city.code;
        } else if (region.province) {
          this.editData.selected = region.province.code;
        }
        this.fixMarker(this.editData.selected);  
      },
      //失去焦点获取数据
      blurSearch(){
        //有值才搞
        if(this.editData.selected){
          this.fixMarker(this.editData.selected);
        }
      },
      //创建腾讯地图
      initMap() {
        const _this = this;
        const mapContainer = document.getElementById("mapSelector");
        let initLatLng = new qq.maps.LatLng(_this.lat, _this.lng);
        let myOptions = {
          zoom: 18,
          center: initLatLng,
          panControl: false, //平移控件
          zoomControl: false, //缩放控件
          mapTypeControl: false, //地图类型
        }
        this.map = new qq.maps.Map(mapContainer, myOptions);
        this.marker = new qq.maps.Marker({
          position: initLatLng,
          map: this.map
        });
        qq.maps.event.addListener(_this.map, 'click', function (e) {
          let coord = e.latLng;
          _this.coordinate = coord;
          _this.marker.setPosition(coord);
        });
        let resetBounds = function(){
          var bounds = _this.map.getBounds();     //获取函数范围
          let a1 = bounds.getNorthEast().getLat();
          let a2 = bounds.getNorthEast().getLng();
          let b1 = bounds.getSouthWest().getLat();
          let b2 = bounds.getSouthWest().getLng();
          //entlongb,entlonge,entlatb,entlate
          let entlonge = a2 //经度开始
          let entlongb = b2 //经度结束
          let entlatb = b1 //维度开始
          let entlate = a1 //维度结束
          $.ajax({
            type: "get",
            url: APIPsn + "/Psninfo/GetInf?pagename=getaddrjobinfo&countnum=10&currpage=1",
            data: {
              userid:  Cookies.get('userid-b'),
              entlongb: entlongb,
              entlonge: entlonge,
              entlatb: entlatb,
              entlate: entlate
            },
            dataType: "json",
            success: function(res) {

            }
          })
        }
        //拖拽结束后触发
        qq.maps.event.addListener(_this.map, 'dragend', resetBounds);
        //地图缩放时触发
        qq.maps.event.addListener(_this.map, 'zoom_changed', resetBounds);
        //自定义控件
        let focus = document.createElement("div");
        focus.className = "focusBtn";
        //将控件添加到controls栈变量并将其设置在顶部位置
        this.map.controls[qq.maps.ControlPosition.LEFT_BOTTOM].push(focus);
        focus.addEventListener('click', function () {
          _this.coordinate = _this.backupCoord; //保存坐标点
          if (_this.marker) {
            _this.map.setCenter(_this.backupCoord); //移动地图中心
            _this.marker.setPosition(_this.backupCoord);
          }
        })
      },
      
      //开启新增工作地点
      addNewAddress() {
        this.initData();
        this.showForm = true;
        this.isEdit = false;
      },
      //新增地点
      addAddress() {
        this.showForm = false;
        this.toggleCoordinate(this.editData.selected);
      },
      //修改地点
      editAddress() {
        this.showForm = false;
      },
      //获取要修改的地点数据
      addressData(index) {
        this.showForm = true;
        this.editData = this.addressList[index];
        this.fixMarker(this.editData.selected);
        this.isEdit = true;
      },
      //删除其中的门店
      deleteAddress(i){
        let arr = [];
        for(let a = 0; a < this.addressList.length; a++){
          if(a != i){
            arr.push(this.addressList[a]);
          }
        }
        this.addressList = arr;
      },
      //点击切换坐标
      changeMarker(index){
        this.editData = this.addressList[index];
        this.activeName = this.editData.name;
        this.fixMarker(this.editData.selected);
      },
      //初始化数据
      initData() {
        this.editData = {
          name: '',
          selected: this.selected,
          addressDetail: this.addressDetail,
          lat: this.lat,
          lng: this.lng,
          num: 1,
          recruit: true
        };
        this.fixMarker(this.editData.selected);
      },
      //保存提交数据
      saveAddressList(){
        this.emitData();
      },
      //取消修改
      cancelEdit(){
        this.cancelVerity = true;
      },
      //确定取消修改
      verityCancel(){
        this.cancelVerity = false;
        this.emitData(this.addressBackup);
      },
      //
      emitData(data){
        //清数据
        this.initData();
        this.activeName = "";
        this.showForm = false;
        //向上再设置
        let returnList = []; //如果是备份数据，首先获取列表中的第一个数据，然后合并备份
        data ? returnList = [...data] : returnList = this.addressList;
        this.$emit("initCloseManageAddress", returnList);
      }
    }
  }
</script>
<style>
.addressNote .el-checkbox{
  width: auto !important;
}
</style>
<style scoped>
  .addressContainer {
    width: 100%;
  }

  .topField {
    display: flex;
    width: 100%;
    margin-bottom: 15px;
    align-items: center;
  }

  .addNewAddress {
    text-align: center;
    font-size: 14px;
    color: #fff;
    background: #409eff;
    padding: 12px 0;
    cursor: pointer;
  }

  .addAddress {
    font-size: 14px;
    color: #ffffff;
    background: #409eff;
    border: none;
    border-radius: 4px;
    padding: 4px 20px;
    cursor: pointer;
    z-index: 10;
    margin-left: 30px;
    display: inline-block;
  }

  .removeAddress {
    color: #1470CE !important;
    cursor: pointer;
    margin-left: 10px !important;
  }

  .addressSearch {
    width: 1160px;
    overflow: hidden;
  }
  .addressInfor_double{
    display: flex;
    justify-content: space-between;
  }
  .addressInfor_double p{
    width: 50%;
  }

  .addressLists {
    width: 350px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    float: left;
  }

  .mapContainer {
    float: right;
    width: 800px;
    height: 500px;
  }

  .addressTitle h1 {
    color: #333;
    margin: 0;
  }

  .addressTitle {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    position: relative;
  }

  .recruitNum {
    width: 80px;
  }

  .noteInput {
    width: 270px;
  }

  .addressNote .el-checkbox {
    margin-left: 0;
  }

  .addressLabel,
  .addressNote label {
    color: #333;
    font-size: 15px !important;
    margin: 0 10px 0 20px;
  }
  .addressNote label{
    font-weight: bold;
    display: inline-block;
    width: 150px;
    text-align: right;
    margin: 0;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .infor_field {
    flex-wrap: wrap;
  }
  .addressAreaName {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    margin: 0 0 10px 0;
  }

  .addressInfor {
    font-size: 14px;
    width: 100%;
    margin: 0;
    line-height: 22px;
    color: #333;
  }

  .singleAddress {
    position: relative;
    padding-bottom: 15px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }

  .singleAddress:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  .editJob {
    position: absolute;
    right: 15px;
    top: 15px;
  }

  .editJob span {
    display: inline-block;
    color: #1470CE !important;
    cursor: pointer;
    margin-left: 15px;
  }

  .infor_field .addAddress {
    color: #fff !important;
  }
  .activeAddress{
    background:#f2f2f2;
  }
  .addressBtnContainer{
    position: absolute;
    right: 0;
    top: 0;
  }
  .cancelBtnContainer{
    width: 90%;
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
  }
  .cancelBtnContainer button, .addressBtnContainer button{
    color: #fff;
    padding: 8px 20px;
    font-size: 14px;
    border-radius: 3px;
    border:none;
    outline: none;
  }
  .hiddenCancel, .cancalSave{
    background: #e93131 !important;
    margin-right: 10px;
  }
  .verityCancel, .saveAddress{
    background: #409eff !important;
  }
  .cancelEditContainer h1{
    color: #333;
    font-size: 16px;
    text-align: center;
    margin-bottom: 25px;
  }
</style>