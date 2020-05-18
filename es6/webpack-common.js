/* jshint esversion: 9 */

/**
 * @author  https://github.com/qtfying
 * @date on 2020/05/18
 * author: qtfying
 */

const path = require('path');
// 将css模块和js模块分开打包， 换句话说把css代码从js文件中抽离出来， 单独出一个模块，不然CSS和JS都会打包到同一个文件里去
// 方法： extract - text - webpack - plugin插件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = (srcCodeDir, idDev) => {
	return [
		{
			test: /\.js?$/,
			loaders: 'babel-loader',
			exclude: /(node_modules|bower_components)/,
			include: [path.join(__dirname, srcCodeDir)]
		},
		{
			test: /\.css$/,
            use: ExtractTextWebpackPlugin.extract({
                use: [{
                    loader: 'css-loader',
                }]
            })
		}
	],
};
