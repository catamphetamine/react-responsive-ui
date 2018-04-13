var library = 'react-responsive-ui'

module.exports =
{
	"entry": "./index.js",
	"devtool": "source-map",
	"output":
	{
		"path"           : require('path').resolve(__dirname, "./bundle"),
		"filename"       : library + ".min.js",
		"library"        : library,
		"libraryTarget"  : "umd",
		"umdNamedDefine" : true
	},
	"module":
	{
		"rules":
		[{
			"test"    : /(\.js)$/,
			"loader"  : "babel-loader",
			"exclude" : /node_modules/
		}]
	},
	externals:
	{
		"react"     : "React",
		"react-dom" : "ReactDOM"
	}
}