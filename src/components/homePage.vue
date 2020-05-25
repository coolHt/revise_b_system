<template>
  <div class="mainItem">
    <workProgress></workProgress>
  </div>
</template>
<script>
import workProgress from "./workProgress";
export default {
  components: {
    workProgress
  },
  data: function() {
    return {
      sendpsnid: "",
      showPsnDetail: false,
      jobDetail: false,
      userid: "",
      entid: "",
      psnInfo: [],
      formList: []
    };
  },
};
</script>