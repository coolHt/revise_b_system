<template>
  <div class="xz_tabs_switch">
    <ul class="xz_tabs_list">
      <li class="xz_tabs_item" :class="{'xz_active': selectedType ? item.name == selectedType : index == 0}" v-for="(item, index) in tablist" :key="index" @click="switchtab(index)">{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props:{
    "check": { //选中项名称
      type: String,
      default: ""
    },
    "tabs": {  //切换列表
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data: function(){
    return {
      selectedType: "",
      tablist: []
    }
  },
  created(){
    this.tablist = this.tabs;
  },
  watch:{
    "check": {
      handler: function(){
        if(this.check){
          this.selectedType = this.check;
        }
      },
      immediate: true
    }
  },
  methods: {
    switchtab(i){
      this.selectedType = this.tablist[i].name;
      //向上返回
      this.$emit("triggle", this.tablist[i]);
    }
  }
}
</script>
<style scoped>
.xz_tabs_list{
  display: flex;
}
.xz_tabs_list .xz_active{
  color: #246EFC;
  font-weight: bold;
  border-bottom: 2px solid #246EFC;
}
.xz_tabs_item{
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
  font-size: 17px;
  padding: 0 10px 5px 10px;
  margin-right: 18px;
}
.xz_tabs_switch{
  margin-bottom:30px;
}
</style>