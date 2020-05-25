<template>
  <div class="workPoolItem">
    <div class="am-u-lg-12 am-u-md-12 am-u-sm-12">
      <div class="card">
        <div class="card-title">
          <h4>
            <span class="am-icon-table"></span>
            <span>工单系统</span>
          </h4>
        </div>
        <hr>
        <div class="card-content">
          <form class="am-form am-form-horizontal" id="commentForm">
            <fieldset>
              <div class="am-form-group">
                <label class="am-u-sm-3 am-form-label">标题：</label>
                <div class="am-u-sm-9">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="请输入标题"
                    v-model="title"
                    list="EntJobNameList"
                  >
                </div>
              </div>
              <div class="am-form-group">
                <label class="am-u-sm-3 am-form-label">内容：</label>
                <div class="am-u-sm-9">
                  <textarea
                    id="content"
                    name="content"
                    rows="5"
                    cols="5"
                    placeholder="请输入内容"
                    v-model="content"
                  ></textarea>
                  <el-upload
                    class="file"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt>
                  </el-dialog>
                </div>
              </div>
              <div class="am-form-group">
                <div class="am-u-sm-9 am-u-sm-push-3">
                  <button type="submit" class="btn-search" id="subJob">发送</button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      dialogVisible: false,
      title: "",
      content: "",
      dialogImageUrl: ""
    };
  },
  methods: {
    handleRemove(file, fileList) {},
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>
<style scoped>
.file {
  margin: 5px 0px;
  /* padding:0px; */
  border: none;
}
.file input {
  display: none;
}
.btn-search {
  outline: none;
  font-size: 13px;
  border: 1px solid #5f4b8b;
  border-radius: 25px;
  height: 26px;
  vertical-align: inherit;
  width: 70px;
  background: #fff;
  color: #5f4b8b;
}

.btn-search:hover {
  background: #5f4b8b;
  color: #fff;
}
</style>


