let functionList = {
  // 转换日期
  toggleDay(t) {
    let toggleDay;
    if (t === 1) {
      toggleDay = "周一";
    } else if (t === 2) {
      toggleDay = "周二";
    } else if (t === 3) {
      toggleDay = "周三";
    } else if (t === 4) {
      toggleDay = "周四";
    } else if (t === 5) {
      toggleDay = "周五";
    } else if (t === 6) {
      toggleDay = "周六";
    } else if (t === 7) {
      toggleDay = "周日";
    }
    return toggleDay;
  },
  // 根据地区选择器的选择返回code
  regionCode(region){
    if (region.area) {
      return region.area.code;
    } else if (region.city) {
      return region.city.code;
    } else if (region.province) {
      return region.province.code;
    }
  },

  // 读取本地上传的图片
  uploadImg(file) {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.readAsDataURL(file); // 读取文件
      reader.onload = e => { // 文件读取成功后
        resolve(e.target.result);
      };
    });
  },
  // 判断上传的图片的大小是否超过了限定值
  judgeImgSize(fileSize, size = 5242880) {

    if (fileSize) {
      return fileSize > size ? false : true;
    } else {
      return false;
    }
  },
  // 判断上传的图片类型
  judgeType(fileName) {
    let fileType = ['jpg', 'jpeg', 'png'];
    let i = fileName.lastIndexOf("."); // 最后一个点的位置
    //截取文件类型
    let type = fileName.substr(i + 1).toLowerCase();
    return fileType.indexOf(type) > -1 ? true : false;
  },
  // 返回上传的图片的路径
  returnImgSrc(fileInput) {
    return new Promise(resolve => {
      let file = fileInput.files[0];
      let inRange = this.judgeImgSize(file.size); // 判断图片大小

      // 判断图片类型
      if (this.judgeType(file.name)) {
        // 读取文件信息
        this.uploadImg(file).then(src => {
          resolve({
            src,
            access: inRange ? true : false
          });
        });
      } else {
        resolve({
          src: "",
          access: false
        });
      }
    });
  },
  // base64文件格式转blob格式
  base64ToFile(base64, fileName) {
    var arr = base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    let blobFile = new Blob([u8arr], {
      type: mime
    });
    blobFile.lastModifiedDate = new Date();
    blobFile.name = fileName;
    return blobFile;
  },
};

export default functionList;