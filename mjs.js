var UglifyJS = require("uglify-js");
var fs = require('fs');
function minifyJS(fileName){
	var code = fs.readFileSync(fileName + '.js', 'utf8');
	console.log(code)
    var content = UglifyJS.minify(code, { mangle: { toplevel: true } }).code;
	console.log(content)
    fs.writeFile(fileName +'_min.js', content , function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(fileName +'_min.js was save');
    });
// var result = UglifyJS.minify(code);
// console.log(result.error); // runtime error, or `undefined` if no error
// console.log(result.code);  // minified output: function add(n,d){return n+d}
}
minifyJS('./s');



