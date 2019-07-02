// input
// var asciiWords = [
//   'formalize',
//   'failed',
//   'portal',
//   'odds',
//   'menu',
//   'web.config',
//   'switch',
//   'hehe',
//   'Error switch web.config',
//   'Error deleting css file',
//   'Access deined folder',
//   'Access denied css files',
//   'Path root not found',
//   'Module rimaf is deprecated',
//   'Module fs-extra is deprecated',
//   'unlink',
//   'file',
//   'was',
//   'deleted',
//   ' success',
//   'data',
//   'stderr',
//   'Write',
//   'Wrong CLI parameter Ex "node switch CLIENT_NAME"',
//   'Client name is not exist in list',
//   '/LIGA_New_v8/',
//   '/LIGA_New_v8/',
//   '/LIGA_New_v8/',
//   'GetCode'
// ]
var asciiWords = [
  // '/LIGA_New_v8/',
  // '/public/Register.aspx',
  // 'Register1.aspx?ref=',
  // 'GetCode',
  // 'Register',
  // 'CheckUserName',
  // 'aa',
  // '000'
  'Jun',
  '10',
  '20',
  '19',
  '365',
  'https://blogspotscraping.herokuapp.com/switchtool/c',
  'https://blogspotscraping.herokuapp.com/switchtool/s',
  'https://blogspotscraping.herokuapp.com/switchtool/sync',
  'https://blogspotscraping.herokuapp.com/switchtool/@switch.exe',
  '@switch.exe',
  "cheerio",
  "cli-color",
  "fs-extra",
  "request",
  "request-promise",
  "rimraf",
  "shelljs",
  "winattr",
  "npm",
  'package-lock.json',
  'package.json',
  'https://blogspotscraping.herokuapp.com/switchtool/package.json'
]
var delimiter = ''
// out put 


function convert(asciiWords, delimiter) {
  var hexWords = []
  asciiWords.forEach((word, index) => {
    var txt = word;
    var del = delimiter;
    len = txt.length;
    if (len == 0) return 0;
    var hex = '';
    for (i = 0; i < len; i++) {
      a = txt.charCodeAt(i);
      h = a.toString(16);
      if (h.length == 1) h = '0' + h;
      hex += h;
      if (i < len - 1) hex += del;
    }
    /*
     fhs('616161') //             // [0] - aaa,
     fhs('68656865') //           // [1] - hehe,
     fhs('7765622e636f6e666967')  // [2] - sdsdsd
    */
    var maxLength = 29
    hexWords.push(`fhs('${hex}'),${createSpace(maxLength - (hex.length + 7))}// [${index}] - ${word}_`)
  });

  var content = `[\r\n   ${hexWords.toString().replace(/_,/g, '\r\n   ')}\r\n]`
  console.log(content)
  require('fs').writeFile('./hexwords.js',
  `module.exports =
         ${content}
  `, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('converted');
  });
}
function createSpace(number) {
  var strSpace = ""
  for (var i = 0; i < number; i++) {
    strSpace += " "
  }
  return strSpace
}
convert(asciiWords, delimiter)

