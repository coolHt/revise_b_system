<template>
  <div class="workPoolItem" style="position:relative;">
    <el-tabs @tab-click="tabToggle">
      <el-tab-pane label="B角职位"></el-tab-pane>
      <!-- <el-tab-pane label="企业职位"></el-tab-pane> -->
    </el-tabs>
    <!---->
    <div v-show="toggleName === 'B角职位'">
      <viewList listType="brole"></viewList>
    </div>
    <!-- <div v-show="toggleName === '企业职位'" >
      <viewList listType="ent"></viewList>
    </div> -->
    
  </div>
</template>
<script>
  import viewList from "../components/reviewList";
  export default {
    components: {
      viewList
    },
    data: function () {
      return {
        toggleName: "B角职位"
      };
    },
    created() {
    },
    methods: {
      tabToggle(t){
        this.toggleName = t.label;
      }
    }
  };
</script>