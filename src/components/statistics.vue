<template>
  <div class="workPoolItem">
    <div style="position:relative">
      <div class="statisticsTable">
      <div class="statisticsfield">
        <ul>
          <li class="titleBlue">招聘负责人</li>
          <li>城市</li>
          <li>企业数</li>
          <li>职位数</li>
          <li>用户数</li>
        </ul>
      </div>
      <table class="formLoop" :style="{width: citys.length * 100 + 'px'}">
          <thead>
            <tr>
              <th class=" titleFieid titleBlue" v-for="(n, index) in citys" :key="index">{{n.name}}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="fieldStyle" v-for="(c,index) in citys" :key="index">{{c.city}}</td>
            </tr>
            <tr>
              <td class="fieldStyle" v-for="(c,index) in citys" :key="index">{{c.data ? c.data.entcount : 0}}</td>
            </tr>
            <tr>
              <td class="fieldStyle" v-for="(c,index) in citys" :key="index">{{c.data ? c.data.jobcount : 0}}</td>
            </tr>
            <tr>
              <td class="fieldStyle" v-for="(c,index) in citys" :key="index">{{c.data ? c.data.psncount : 0}}</td>
            </tr>
          </tbody>
        </table>
      <!-- <div class="loopProvince" v-for="(p, i) in basis" :key="i">
        <div class="provinceTitle" @click="openTable(i)">
          <span class="provinceName">{{p.province}}</span>
          <span class="cityNumber">(城市数:{{p.citys.length}})</span>
          <span class="cityNumber">(公司数:{{p.companyNum}})</span>
          <span class="cityNumber">(职位数:{{p.jobNum}})</span>
          <span class="cityNumber">(投递人数:{{p.psnNum}})</span>
        </div>
        <table class="formLoop" v-show="p.open">
          <thead>
            <tr>
              <th style="width: 20%">城市</th>
              <th style="width: 10%">企业数</th>
              <th style="width: 10%">职位数</th>
              <th style="width: 10%">投递数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c,index) in p.citys" :key="index">
              <td>{{c.city}}</td>
              <td>{{c.entcount}}</td>
              <td>{{c.jobcount}}</td>
              <td>{{c.psncount}}</td>
            </tr>
          </tbody>
        </table>
      </div> -->
    </div>
    </div>
  </div>
</template>
<script>
  import xz from "../common";
  export default {
    props: {
      "getData": {
        type: Boolean,
        defalut: false
      }
    },
    data() {
      return {
        basis: [],
        //需要拿出来的城市 中山，厦门
        citys:[{
          name: '李建江',
          city:'宁波市',
          nation: "3302"
        },{
          name: '李建江',
          city:'芜湖市',
          nation: "3402"
        },{
          name: '李建江',
          city:'嘉兴市',
          nation: "3304"
        },{
          name: '李建江',
          city:'金华市',
          nation: "3307"
        },{
          name: '李建江',
          city:'绍兴市',
          nation: "3306"
        },{
          name: '任文强',
          city:'重庆市',
          nation: "5000"
        },{
          name: '任文强',
          city:'成都市',
          nation: "5101"
        },{
          name: '汪桂林',
          city:'温州市',
          nation: "3303"
        },{
          name: '曾孟春',
          city:'广州市',
          nation: "4401"
        },{
          name: '曾孟春',
          city:'深圳市',
          nation: "4403"
        },{
          name: '曾孟春',
          city:'中山市',
          nation: "4420"
        },{
          name: '曾孟春',
          city:'佛山市',
          nation: "4406"
        },{
          name: '曾孟春',
          city:'厦门市',
          nation: "3502"
        },{
          name: '车晶',
          city:'上海市',
          nation: "3100"
        },{
          name: '朱文腾',
          city:'杭州市',
          nation: "3301"
        },{
          name: '朱文腾',
          city:'鹰潭市',
          nation: "3606"
        },{
          name: '韩风姣',
          city:'济宁市',
          nation: "3708"
        },{
          name: '韩风姣',
          city:'济南市',
          nation: "3701"
        },{
          name: '李志萍',
          city:'台州市',
          nation: "3310"
        },{
          name: '王欣',
          city:'武汉市',
          nation: "4201"
        },{
          name: '何聪聪',
          city:'无锡市',
          nation: "3202"
        }]
        
      }
    },
    watch: {
      "getData": {
        handler() {
          if (this.getData) {
            //统计
            var currentDate = this.$store.getters.formatDate('', '-');
            let searchData = {
              bdate: "2019-01-01",
              edate: currentDate
            };
            xz.statisticsData(searchData).then(res => {
              if(res){
                
                this.citys.forEach( (c, i) => {
                  let matchCity = [];
                  let cCode = c.nation;
                  res.forEach( r => {
                    if(r.nation.slice(0,2) == "31"){
                      if(cCode == "3100"){
                        matchCity.push(r);
                      }
                    }else if(r.nation.slice(0,2) == "50"){
                      if(cCode == "5000"){
                        matchCity.push(r);
                      }
                    }else{
                      if(r.nation.slice(0,4) == cCode){
                        matchCity.push(r);
                      }
                    }
                    
                  })
                  if(matchCity.length > 0){
                    let entcount = 0;
                    let jobcount = 0;
                    let psncount = 0;
                    matchCity.forEach( m => {
                      entcount += m.entcount;
                      jobcount += m.jobcount;
                      psncount += m.psncount;
                    })
                    this.$set(this.citys[i], "data", {
                      entcount: entcount,
                      jobcount: jobcount,
                      psncount: psncount,
                    });
                  }
                })
              }else{
                this.basis = [];
              }
            });
          }
        },
        immediate: true
      }
    },
    methods: {
      //点击打开
      openTable(i){
        let isOpen = this.basis[i].open;
        this.$set(this.basis[i], "open", !isOpen);
      }
    }
  }
</script>
<style scoped>
  .statisticsTable {
    /* position: relative; */
    width: 100%;
    overflow-x: scroll;
  }
  .provinceName{
    font-weight: bold;
    color: #333;
    font-size: 16px;
    display: block;
    width: 120px;
  }
  .cityNumber{
    color: #333;
    font-size: 14px;
    display: block;
    margin-left: 10px;
  }
  .provinceTitle{
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .formLoop{
    margin-left: 100px;
  }
  .statisticsfield{
    position: absolute;
    top: 0;
    left: 0;
  }
  .statisticsfield li{
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #333;
    font-size:13px;
    background: #c1d7ec;
  }
  .titleBlue{
    background: #689ad1 !important;
    color: #fff !important;
    font-weight: bold !important;
  }
  .fieldStyle{
    text-align: center;
    height: 40px;
    box-sizing: border-box;
    padding:0 !important;
  }
  .titleFieid{
    width: 100px;
    text-align:center;
    height:40px;
    box-sizing: border-box;
    padding:0 !important;
  }
</style>