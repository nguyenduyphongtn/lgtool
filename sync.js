/**
 * Created by Phillipet on 7/08/2018.
 */
module.exports = {
  cheerio: require("cheerio"),
  fs: require("fs"),
  request: require("request"),
  rp: require("request-promise"),
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36",
    "Content-type": "text/html"
  },
  protocol: "https://",
  page: "/pgajax.axd?T=SyncImages",
  cfg: require('./switch.cfg'),
  //rootFolderImages: "C:\\Projects\\LIGA_New_v8\\SportDBClient.WebUI\\",
  rootFolderImages:'',
  urlProject: '',
  log: console.log,

  // loop done support
  isRunFrist: true,
  starting: 0,

  saveFile: function (fileName, fileContent) {
    var me = this,
      fs = me.fs;
    // var folder = "./";
    // if (!fs.existsSync(folder)) {
    //   fs.mkdirSync(folder);
    // }
    fs.writeFile(fileName, fileContent, function (err) {
      if (err) return me.log(err);
      me.log("Write file " + fileName + " > success");
    });
  },
  // response : ['path1','path2']
  getPaths: async function (host, stringSplit) {
    var me = this,
      log = console.log,
      rp = me.rp;
    var protocol = me.protocol;
    var page = me.page;
    // var url = protocol + host + page;
    var options = {
      uri: protocol + host + page,
      headers: me.headers,
      resolveWithFullResponse: true,
      // transform: function(body) {
      //   return body.replace(/\\/g, "/");
      // }
    };
    //log("Syncing :%s", url);
    var paths = [];
    var statusCode = 0;
    var result = rp(options)
      .then(response => {
        log('Sync status code:%s', response.statusCode)
        statusCode = response.statusCode;
        // if(response.statusCode === 200)
        //   return 0;

        //console.log(response.body)
        paths = response.body.replace(/\\/g, "/");
      })
      .catch(err => {
        return err;
      });
    await result;
    if (statusCode === 200) {
      try {
        paths = JSON.parse(paths);
        paths = this.formatPath(paths, stringSplit);
        // console.log(paths)
      } catch (error) {
        log(error)
        return []
      }
    }
    return paths;
  },

  /**
   * stringSplit(Images,C:\\...)
   */
  formatPath: function (paths, stringSplit) {
    return paths.map((v, i, a) => {
      return v.substring(v.indexOf(stringSplit) + 6, v.length);
    });
  },
  fetchTextFile: async function(url){
    var options = {
      uri: url,
      headers: this.headers,
    };
    return await this.rp(options)
  },
  saveImage: async function (pathImage, host) {
    var me = this,
      fs = me.fs,
      request = me.request,
      log = me.log,
      rootFolderImages = this.cfg.rootFolderImages;
    var fileName = pathImage.split("/").slice(-1)[0];
    var dir =
      rootFolderImages + pathImage.substring(0, pathImage.indexOf(fileName));
    //log('fileName:%s',fileName)
    //log('dir:%s',dir)
    if (!fs.existsSync(dir)) {
      //fs.mkdirSync(dir);
      var shell = require("shelljs");
      shell.mkdir("-p", dir);
    }

    var url = me.protocol + host + pathImage;
    //log('url:%s',url)
    //log('rootFolderImages:%s',rootFolderImages)
    //log('pathImage:%s',pathImage)
    switch(fileName.split('.')[1]){
      case "js":
      case "css":
        this.saveFile(rootFolderImages + pathImage, await this.fetchTextFile(url))
        break;
      default:
          await request(url)
          .on("error", function (err) {
            log(err);
          })
          .pipe(fs.createWriteStream(rootFolderImages + pathImage));
          break;
    }
    //console.log('SaveImage done !')
  },
  saveImages: function (i, paths, host, next) {
    let me = this,
      log = me.log,
      path = paths[i];
    log("paths[%s]=%s", i, path);
    this.saveImage(path, host);
    i = i + 1;
    if (i < paths.length) {
      setTimeout(function () {
        me.saveImages(i, paths, host, next);
      }, 10);
    } else {
      log("Downloaded %s files in Images folder", paths.length);
      next()
    }
  },
  getSwitchCfg: async function () {
    var me = this,
      rp = me.rp,
      log = me.log,
      url = me.cfg.urlProject === undefined ? 'http://localhost/LIGA_New_v8/' : me.cfg.urlProject,
      url = url + 'pgajax.axd?T=GetSwitchCfg',
      options = {
        uri: url,
        headers: me.headers
      }
    //log("Get getSwitchCfg :%s", url);
    var json = await rp(options)
    try {
      json = JSON.parse(json)
      //log(json.rootPath)
      return json
    } catch (error) {
      log(error)
      return []
    }
  },
  getDHNumber: async function (nameWL) {
    var me = this,
      rp = me.rp,
      log = me.log,
      url = me.cfg.urlProject === undefined ? 'http://localhost/LIGA_New_v8/' : me.cfg.urlProject,
      url = url + 'pgajax.axd?T=GetSwitchCfg',
      options = {
        uri: url,
        headers: me.headers
      }
    //log("Get getSwitchCfg :%s", url);
    var json = await rp(options)
    try {
      json = JSON.parse(json)
      //log(json)
      return json.Clients[nameWL]
    } catch (error) {
      log(error)
      return []
    }
  },
};
// var sync = require("./sync.js");
// sync.getSwitchCfg();
// var sync = require("./sync");
// sync.saveImage('/Images/theme/v1/header.css','angkasabola.com')
// sync.saveImage('/Images/theme/v1/js/jquery-1.7.2.min.js','rajaelang.com')

// // var domain = ['localhost/Liga_New_V8/','main00.playliga.com/']
// // sync.getPaths(domain[0],'WebUI').then((paths)=>{
// //   console.log(paths)
// //   sync.saveFile('file.txt', paths.join('\r'))
// //   paths.forEach(path => {
// //     sync.saveImage(path,domain[0])
// //   });
// // })

// if (process.argv[2] == undefined || process.argv[2] == "") {
//   sync.log("==========> " + "wrong parameter");
// } else {
//   var prefix = "www.",
//     domain = process.argv[2],
//     host = prefix + domain + ".com/";
//   sync.getPaths(host, "WebUI").then(paths => {
//     //console.log(paths)
//     //sync.saveFile('file.txt', paths.join('\r'))

//     // ============ TEST function loop none done ============= //
//     // paths.forEach((path, index) => {
//     //   if(index === paths.length)
//     //     console.log("path[%s/%s]=%s : done", index, paths.length, path);
//     //   sync.saveImage(path, host);
//     // });

//     // ========= TEST function loop done
//     //sync.saveImages(0, paths, host);
//     if(paths.length === 0)
//       console.log('Sync Images offline')
//   });
// }
