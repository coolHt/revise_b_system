<template>
  <div class="organizationContainer">
    <div class="workPoolItem">
      <div style="position:relative;">
        <el-tabs>
          <el-tab-pane label="服务城市设置"></el-tab-pane>
        </el-tabs>
        <div class="companyList">
          <div class="companyHeadLine">
            <div class="chooseProvince">
              <div class="infor_field">
                <label class="field_name" style="text-align:left;width: auto;">新增省份：</label>
                <div style="width:350px;display:flex;">
                  <el-select v-model="provinceCode" placeholder="请选择">
                    <el-option
                      v-for="item in province"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <button type="button" class="save_select_btn saveStyle" @click="saveSelectArea(provinceCode)">保存</button>
                <button type="button" class="save_select_btn" @click="provinceCode = ''">取消</button>
              </div>
            </div>
            <div class="serveCityContainer">
              <div v-for="(single, index) in serveCitys" v-bind:key="index" class="single_tree_city">
                <div class="tree_title_operate">
                  <p class="tree_title">{{single.ProvinceName}}</p>
                  <span class="operate_tree_btn" @click="addCityBtn(single.ProvinceCode, 'city', index)">新增城市</span>
                  <span class="operate_tree_btn" @click="deleteConfirm(single.ProvinceCode, single.ProvinceName, 'province')">删除省份</span>
                </div>
                <div v-if="(single.city && single.city.length) > 0 || upperCode == single.ProvinceCode">
                  <div v-for="(c, ci) in single.city" v-bind:key="ci" class="cityTree">
                    <div class="tree_title_operate">
                      <p class="tree_title">{{c.CityName}}</p>

                      <!--暂时隐藏区县选择-->
                      <!-- <span class="operate_tree_btn" @click="addCityBtn(c.CityCode, 'area', index, ci)">新增区县</span> -->
                      <span class="operate_tree_btn" @click="deleteConfirm(c.CityCode, c.CityName, 'city')">删除城市</span>
                    </div>
                    <!--暂时隐藏区县选择-->
                    <!-- <div class="areaTree" v-if="(c.area && c.area.length > 0) || upperCode ==  c.CityCode">
                      <div v-for="(a, ai) in c.area" v-bind:key="ai">
                        <div class="tree_title_operate">
                          <p class="tree_title">{{a.AreaName}}</p>
                          <span class="operate_tree_btn" @click="deleteConfirm(a.AreaCode, a.AreaName, 'area')">删除区县</span>
                        </div>
                      </div>
                    </div> -->
                    <!--区域新增-->
                     <div class="cityTree addContainer" v-show="upperCode ==  c.CityCode">
                      <el-select v-model="selectedCode" placeholder="请选择">
                        <el-option
                          v-for="item in selectList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <div class="saveSelect">
                        <button type="button" class="save_select_btn saveStyle" @click="saveSelectArea">保存</button>
                        <button type="button" class="save_select_btn cancelStyle" @click="upperCode = ''">取消</button>
                      </div>
                    </div>
                  </div>
                  <!--城市新增-->
                  <div class="cityTree addContainer" v-show="upperCode == single.ProvinceCode">
                    <el-select v-model="selectedCode" placeholder="请选择">
                      <el-option
                        v-for="item in selectList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="saveSelect">
                      <button type="button" class="save_select_btn saveStyle" @click="saveSelectArea">保存</button>
                      <button type="button" class="save_select_btn cancelStyle" @click="upperCode = ''">取消</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--删除确认框-->
    <el-dialog :visible.sync="openDeleteConfirm" width="400px">
      <div class="deleteAreConfirmContainer">
        <p>{{deleteTitle}}</p>
        <div class="deleteConfirmBtns">
          <button type="button">取消</button>
          <button type="button" class="saveStyle" @click="deleteServeCity">删除</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import xz from "../common";
  export default {
    data() {
      return {
        provinceCode: "",
        cityCode: "",
        areaCode: "",
        province: [],
        city: [],
        area: [],
        serveCitys:[],
        //父code
        upperCode: "",
        //选择的code
        selectedCode: "",
        //选择列表
        selectList: [],
        //要删除的code
        deleteCode: "",
        deleteTitle: "确认删除xxxxxx",
        //
        openDeleteConfirm: false
      }
    },
    mounted() {
      //获取所有省份
      xz.provinces().then( provinces => {
        if(provinces && Array.isArray(provinces)){
          let formatProvince = [];
          provinces.forEach( p => {
            formatProvince.push({
              value: p.ProvinceCode,
              label: p.ProvinceName
            })
          })
          this.province = formatProvince;
          this.getServeCity();
        }
      });
      //
      this.getCitys("330000");
    },
    watch: {
      'serveCitys': {
        handler: function(){
          if(this.serveCitys){
            //ProvinceCode
            let provinceFilter = [];
            this.province.forEach( p => {
              let hasProvince = this.serveCitys.find( s => s.ProvinceCode == p.value);
              if(!hasProvince){
                provinceFilter.push(p);
              }
            })
            this.province = provinceFilter;
          }
        }
      }
    },
    methods: {
      //获取服务城市,并且格式化数据结构
      getServeCity(){
        xz.getServeCity().then( data => {
          if(data){
            let province = [];
            data.forEach( d => {
              let pIndex = ""
              let hasProvince = province.find( (p, i) => {
                pIndex = i;
                if(!p) return false;
                if(p.ProvinceCode == d.ProvinceCode){
                  return p;
                }
              })
              if(!hasProvince){ //如果不存在
                let obj = {
                  ProvinceCode: d.ProvinceCode,
                  ProvinceName: d.ProvinceName
                }
                if(d.CityCode){
                  obj.city = [{
                    CityCode: d.CityCode,
                    CityName: d.CityName,
                  }]
                }
                if(d.AreaCode){
                  obj.city[0].area = [{
                    AreaCode: d.AreaCode,
                    AreaName: d.AreaName,
                  }]
                }
                province.push(obj);
              }else{ //如果已存在
                //检索城市
                if(province[pIndex].city){
                  let cityIndex = "";
                  let cityList = province[pIndex].city;
                  let hasCity = cityList.find( (c, ci) => {
                    if(c.CityCode == d.CityCode){
                      cityIndex = ci;
                      return c;
                    }
                  })
                  if(!hasCity){ //如果不存在城市
                      let obj = {
                        CityCode: d.CityCode,
                        CityName: d.CityName
                      }
                    if(d.AreaCode){
                      obj.area = [{
                        AreaName: d.AreaName,
                        AreaCode: d.AreaCode
                      }]
                    }
                    province[pIndex].city.push(obj);
                  }else{  //如果已经存在城市
                    let c = province[pIndex].city[cityIndex];
                    if(c.area){ //如果有区域
                      province[pIndex].city[cityIndex].area.push({
                        AreaName: d.AreaName,
                        AreaCode: d.AreaCode
                      })
                    }else{
                      if(d.AreaCode){
                        province[pIndex].city[cityIndex].area = [{
                          AreaName: d.AreaName,
                          AreaCode: d.AreaCode
                        }]
                      }
                    }
                  }
                }else{
                  let obj = {
                    CityCode: d.CityCode,
                    CityName: d.CityName,
                  }
                  if(d.AreaName){
                    obj.area = [{
                      AreaName: d.AreaName,
                      AreaCode: d.AreaCode
                    }]
                  }
                  province[pIndex].city = [obj]
                }
              }
            })
            this.serveCitys = province;
          }
        });
      },
      //新增城市按钮
      addCityBtn(code, type, i, ai){
        let list = [];
        if(type == 'city'){
          //city 筛选
          if(this.serveCitys[i].city){
            this.serveCitys[i].city.forEach( c => {
              list.push(c.CityCode);
            })
          }else{
            list = [];
          }
        }else{
          if(this.serveCitys[i].city[ai].area){
            this.serveCitys[i].city[ai].area.forEach( a => {
              list.push(a.AreaCode);
            })
          }else{
            list = [];
          }
        }
        this.upperCode = code;
        type == "city" ? this.getCitys(code, list) : this.getAreas(code, list);
      },
      //选择城市
      selectCity(){
        //初始化区县选择
        this.areaCode = "";
        this.area = [];
        //区域
        this.getAreas(this.cityCode);
      },
      //根据省份获取城市
      getCitys(code, list){
        xz.citys(code).then( citys => {
          let formatCity = [];
          if(citys && Array.isArray(citys)){
            citys.forEach( c => {
              let hasCode;
              if(Array.isArray(list)){
                hasCode = list.find( l => l == c.CityCode)
              }
              if(!hasCode){
                formatCity.push({
                  value: c.CityCode,
                  label: c.CityName
                })
              }
            })
            this.selectList = formatCity;
          }
        });
      },
      //根据城市获取区县
      getAreas(code, list){
        xz.areas(code).then( areas => {
          let formatArea = [];
          if(areas && Array.isArray(areas)){
            areas.forEach( a => {
              let hasCode;
              if(Array.isArray(list)){
                hasCode = list.find( l => l == a.AreaCode)
              }
              if(!hasCode){
                formatArea.push({
                  value: a.AreaCode,
                  label: a.AreaName
                })
              }
            })
            this.selectList = formatArea;
          }
        });
      },
      //点击保存
      saveSelectArea(code){
        let saveCode = typeof code == "string" ? code : this.selectedCode;
        xz.setServeCity(saveCode).then( res => {
          if(res){
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.selectedCode = "";
            if(code) this.provinceCode = "";
            this.upperCode = "";
            this.getServeCity();
          }else{
            this.$message.error('保存出错，请稍后再试');
          }
        });
      },
      //弹出删除确认框
      deleteConfirm(code, n, type){
        this.openDeleteConfirm = true;
        if(type == "province"){
          this.deleteTitle = `确认删除${n}及下级所有的城市和区县`;
        }else if( type == "city"){
          this.deleteTitle = `确认删除${n}及下级所有的区县`;
        }else if(type == "area"){
          this.deleteTitle = `确认删除${n}`;
        }
        this.deleteCode = code;
      },      
      //删除
      deleteServeCity(){
        xz.delServeCity(this.deleteCode).then( res => {
          this.openDeleteConfirm = false;
          if(res){
            this.getServeCity();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          }else{
            this.$message.error('删除出错，请稍后再试');
          }
        });
      }
    }
  }
</script>
<style scoped>
  .serveCityContainer{
    width: 650px;
  }
  .setButton {
    border: none;
    outline: none;
    color: #409eff;
    border-radius: 3px;
    padding: 8px 15px;
    background: #fff;
    border: 1px solid #409eff;
  }

  .checkButton {
    border: none;
    outline: none;
    color: #fff;
    border-radius: 3px;
    padding: 8px 15px;
    background: #409eff;
  }

  .checkAllCodes {
    width: 100%;
    background: #fff;
    padding: 0 0 0 20px;
    box-sizing: border-box;
  }

  .codesLines {
    display: flex;
    border-bottom: 1px dashed rgb(221, 221, 221);
  }

  .innerColor {
    color: #fa7268;
  }

  .code_single img {
    width: 30px;
    height: auto;
    display: block;
  }

  .codeTypeTitle {
    display: flex;
  }

  .codeTypesTitle {
    background: #fff;
  }

  .codeTypeItem {
    width: 100%;
    box-sizing: border-box;
    background: rgb(245, 245, 245);
    border-bottom: 1px dashed rgb(221, 221, 221);
  }

  .withOutCode {
    height: 30px;
    line-height: 30px;
    color: #333;
    font-size: 14px;
    width: 100%;
    background: rgb(245, 245, 245);
  }

  .checkAllCodes li {
    padding: 10px 0;
  }

  .deleteCodeStyle {
    display: inline-block;
    color: #5b9bd1;
    cursor: pointer;
  }

  .alertCodeContsainer {
    width: 200px;
    margin: 0 auto;
  }

  .alertCodeContsainer img {
    display: block;
    width: 180px;
    height: auto;
    margin: 0 auto;
  }

  .alertCodeTitle {
    width: 100%;
    font-size: 14px;
    color: #333;
    margin-top: 5px;
    text-align: center;
  }

  .codeDownLoad {
    color: #5b9bd1;
    font-size: 14px;
  }

  .miniCodeImg {
    cursor: pointer;
    margin-left: 10px;
  }

  .codesLines li {
    line-height: 30px;
  }

  .serveCityTable{
    width: 50%;
  }
  .serveCityTable td{
    text-align: center;
  }
  .areaTree,.cityTree{
    margin-left: 60px;
  }
  .tree_title{
    font-size: 14px;
    color: #333;
    line-height: 26px;
    margin-right: 15px;
  }
  .tree_title_operate{
    display: flex;
    align-items: center;
  }
  .operate_tree_btn{
    color:#409eff;
    cursor: pointer;
    margin-right: 10px;
    font-size: 13px;
    display: none;
  }
  .tree_title_operate:hover{
    background: #ddd;
  }
  .tree_title_operate:hover .operate_tree_btn{
    display: block;
  }
  .addContainer{
    display: flex;
    align-items: center;
  }
  .deleteConfirmBtns button, .save_select_btn{
    padding: 8px 20px;
    border: 1px solid #ddd;
    outline: none;
    border-radius: 5px;
    font-size: 14px;
    margin-right: 15px;
  }
  .saveStyle{
    background:#409eff;
    border: 1px solid #409eff;
    color: #fff;
  }
  .cancelStyle{

  }
  .saveSelect{
    margin-left: 20px;
  }
  .deleteAreConfirmContainer{
    width: 100%;
  }
  .deleteAreConfirmContainer p{
    text-align: center;
    font-size: 14px;
    color: #333;
  }
  .deleteConfirmBtns{
    width: 250px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .chooseProvince{
    width: 100%;
    display: flex;
    align-items: center;
  }
  .single_tree_city{
    border-bottom:1px solid #ddd;
    padding-bottom:20px;
    margin-bottom: 20px;
  }
</style>
<style>
.companyHeadLine .infor_field input{
  width: 100%;
}
</style>