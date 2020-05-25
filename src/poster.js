
  let defining = {
    //canvas 绘制企业logo
    poster: function (setting) {
      let drawPoster = setting.poster; //返回海报还是带logo的二维码
      let logourl = setting.logourl; //logo可能为空 
      let codeurl = setting.codeurl;
      let posterData = {
        entName: setting.entName,
        fullName: setting.fullEntName,
        entClass: setting.entClass,
        entScale: setting.entScale,
        jobname: setting.jobname,
        salary: setting.salary,
        nation: setting.nation, //职位地址
        exp: setting.exp,
        edu: setting.edu,
        post: setting.post,
        backgroundimg: require("../src/assets/images/bg.jpg"),
        entProfile: setting.entProfile,
        jobNum: setting.jobNum,
        entNation: setting.entNation, //企业地址
        entAdd: setting.entAdd,
        hourPay: setting.hourPay
      };
      return new Promise( resolve => {
        //绘制logo
        this.entlogoDraw(logourl).then(logo => {
          //获取logo推广码
          this.promoCodeDraw(codeurl, logo).then(promocode => {
            if (drawPoster == "job") {
              //绘制职位海报
              this.posterDraw(promocode, posterData).then( posterImg => {
                resolve(posterImg);
              });
            } else if (drawPoster == "ent") {
              //绘制企业海报
              this.entPosterDraw(promocode, posterData).then( entPoster => {
                resolve(entPoster);
              });
            }else { //否则返回带logo的二维码
              resolve(promocode);
            }
          });
        });
      });
    },
    //绘制企业logo
    entlogoDraw: (src) => {
      return new Promise( resolve => {
        if (src){
          let img = new Image();
          img.src = src;
          img.onload = () => {
            var _canv, _contex, extent;
            img.width > img.height ? extent = img.height : extent = img.width;
            //创建canvas绘图，宽高同等
            _canv = document.createElement("canvas");
            _canv.width = _canv.height = extent;
            //初始化绘画类型
            _contex = _canv.getContext("2d");
            //清除画布
            _contex.clearRect(0, 0, extent, extent);
            _contex.save();
            _contex.beginPath();
            //绘制圆形
            _contex.arc(extent / 2, extent / 2, extent / 2, 0, Math.PI * 2, false);
            //清除圆形外多余部分
            _contex.clip();
            //填充图片
            _contex.drawImage(img, 0, 0);
            _contex.restore();
            resolve(_canv.toDataURL());
          };
        }else{
          resolve("");
        }
        
      }); 
    },
    //绘制嵌入logo的推广码
    promoCodeDraw: (codeurl, logoImg) => {
      return new Promise( resolve => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let extent = 560;
        canvas.width = canvas.height = extent;
        ctx.rect(0, 0, extent, extent);
        ctx.fillStyle = "#fff";
        ctx.fill();
        var imgcode = new Image();
        imgcode.src = codeurl;
        imgcode.onload = () => {
          ctx.drawImage(imgcode, 0, 0, 540, 540);
          if (logoImg) {
            var imglogo = new Image();
            imglogo.src = logoImg;
            imglogo.onload = () => {
              ctx.drawImage(imglogo, 150, 150, 240, 240);
              resolve(canvas.toDataURL());
            };
          } else {
            resolve(canvas.toDataURL());
          }
        };
      });
    },
    //整合图片、文字绘制海报
    posterDraw: (codedraw, posterData) => {
      return new Promise( resolve => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = 1568;
        canvas.height = 2348;
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.fill();
        var bgsimg = new Image();
        bgsimg.src = posterData.backgroundimg;
        var imgcode = new Image();
        imgcode.src = codedraw;
        let bgLoad = function(){
          return new Promise(resolve => {
            bgsimg.onload = () => {
              resolve(true);
            };
          });
        };
        let codeLoad = function () {
          return new Promise(resolve => {
            imgcode.onload = () => {
              resolve(true);
            };
          });
        };
        Promise.all([bgLoad(), codeLoad()]).then(res => {
          ctx.drawImage(bgsimg, 0, 0, 1568, 2348);
          ctx.drawImage(imgcode, 450, 1250, 668, 668);
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.font = "bolder 90px Arial";
          ctx.fillStyle = "#222";
          ctx.fillText(posterData.entName, 784, 300);
          // ctx.font = "lighter 45px Arial";
          // ctx.fillStyle = "#333";
          // ctx.fillText(`${posterData.entClass} ${posterData.entScale}`, 784, 360);
          ctx.font = "lighter 45px Arial";
          ctx.fillStyle = "#333";
          ctx.textAlign = "left";
          var str = posterData.post;
          var lineWidth = 0;
          var initHeight = 530;
          var lastSubStrIndex = 0;
          if (str.length > 56) {
            str = str.substring(0, 56) + "...";
          }
          for (let i = 0; i < str.length; i++) {
            if (initHeight < 690) {
              lineWidth += ctx.measureText(str[i]).width;
              if (lineWidth > 830) {
                ctx.fillText(
                  str.substring(lastSubStrIndex, i),
                  320,
                  initHeight
                ); //绘制截取部分
                initHeight += 50; //字体的高度+10
                lineWidth = 0;
                lastSubStrIndex = i;
              }
              if (i == str.length - 1) {
                //绘制剩余部分
                ctx.fillText(
                  str.substring(lastSubStrIndex, i + 1),
                  320,
                  initHeight
                );
              }
            } else {
              break;
            }
          }
          ctx.textAlign = "center";
          ctx.font = "bold 90px Arial";
          ctx.fillStyle = "#222";
          ctx.fillText(posterData.jobname, 784, 980);
          ctx.font = "bold 80px Arial";
          ctx.fillStyle = "#f10900";
          ctx.fillText(posterData.hourPay ? posterData.hourPay + "元/小时" : posterData.salary + "/年", 784, 1100);
          ctx.font = "bold 50px Arial";
          ctx.fillStyle = "#949494";
          ctx.fillText(
            `${posterData.nation} / ${posterData.exp == "不限" ? "经验不限" : posterData.exp} / ${posterData.edu == "不限" ? "学历不限" : posterData.edu} `,
            784,
            1200
          );
          ctx.font = "bold 50px Arial";
          ctx.fillStyle = "#949494";
          ctx.fillText(`${posterData.fullName}正在心职招聘`, 784, 1995);
          ctx.font = "bold 60px Arial";
          ctx.fillStyle = "#222";
          ctx.fillText("( 扫码注册 , 线上报名！ )", 784, 2100);
          resolve(canvas.toDataURL());
        });
      });
    },
    //企业海报
    entPosterDraw: (codeDraw, posterData) => {
      return new Promise( resolve => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = 1568;
        canvas.height = 2405;
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.fill();

        var bgsimg = new Image();
        bgsimg.src = require("../src/assets/images/entbg.jpg");
        let bgsimgload = new Promise( resolve => {
          bgsimg.onload = () => {
            resolve(true);
          };
        });
        var imgcode = new Image();
        imgcode.src = codeDraw;
        let imgcodeLoad = new Promise(resolve => {
          imgcode.onload = () => {
            resolve(true);
          };
        });
        Promise.all([bgsimgload, imgcodeLoad]).then(res => {
          ctx.drawImage(bgsimg, 0, 0, 1568, 2405);
          ctx.drawImage(imgcode, 450, 1250, 668, 668);
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.font = "bold 65px Arial";
          ctx.fillStyle = "#222";
          ctx.fillText(posterData.entName, 784, 580);
          ctx.font = "lighter 45px Arial";
          ctx.fillStyle = "#333";
          ctx.fillText(
            `${posterData.entClass} ${posterData.entScale}`,
            784,
            680
          );
          ctx.font = "lighter 45px Arial";
          ctx.fillStyle = "#333";
          ctx.textAlign = "left";
          var str = posterData.entProfile;
          var lineWidth = 0;
          var initHeight = 920;
          var lastSubStrIndex = 0;
          if (str.length > 60) {
            str = str.substring(0, 52) + "...";
          }
          for (let i = 0; i < str.length; i++) {
            if (initHeight < 1080) {
              lineWidth += ctx.measureText(str[i]).width;
              if (lineWidth > 830) {
                ctx.fillText(str.substring(lastSubStrIndex, i), 320, initHeight); //绘制截取部分
                initHeight += 50; //字体的高度+10
                lineWidth = 0;
                lastSubStrIndex = i;
              }
              if (i == str.length - 1) {
                //绘制剩余部分
                ctx.fillText(
                  str.substring(lastSubStrIndex, i + 1),
                  320,
                  initHeight
                );
              }
            } else {
              break;
            }
          }
          ctx.textAlign = "center";
          ctx.font = "bold 60px Arial";
          ctx.fillStyle = "#949494";
          ctx.fillText(
            `目前共有 ${posterData.jobNum} 个职位正在招聘中`,
            784,
            1200
          );
          ctx.textAlign = "center";
          ctx.font = "bold 60px Arial";
          ctx.fillStyle = "#222";
          ctx.fillText("( 扫码识别 , 查看招聘详情 )", 784, 2000);
          ctx.textAlign = "center";
          ctx.font = "bold 45px Arial";
          ctx.fillStyle = "#949494";
          ctx.fillText(
            `企业地址: ${posterData.entNation}${posterData.entAdd}`,
            784,
            2100
          );
          resolve(canvas.toDataURL());
        });
      });
    }
  };
  //方法挂载
  window.poster = defining.poster.bind(defining);