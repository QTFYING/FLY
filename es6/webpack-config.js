/* jshint esversion: 9 */

/**
 * @author  https://github.com/qtfying
 * @date on 2020/05/18
 * author: qtfying
 */

const path = require('path');
const webpack = require('webpack');
const genRules = require('./webpack-common');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { version } = require('./package.json');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');    // 只在node版本为7.0时支持，其他版本不支持

const config = {
  mode: 'development',

	// map
	devtool : 'source-map',

	// 入口文件配置
	context: path.join(__dirname, "src/"),

	// 入口文件配置
	entry: {
		js: './index.js'
	},

	// 配置模块如何解析
	resolve:{
		extensions: [".js"] //当requrie的模块找不到时,添加这些后缀
	},

	// 自动补全loader
	resolveLoader: {
		moduleExtensions: ['-loader']
	},

    // 以插件形式定制webpack构建过程
    plugins: [
			 new CleanWebpackPlugin(),
        // 配置环境变量
        new webpack.DefinePlugin({
            'process.env': {
                VERSION: JSON.stringify(version)
            }
        }),

        // 使用交互式可缩放树形图可视化webpack输出文件的大小
        // https://www.npmjs.com/package/webpack-bundle-analyzer
        new BundleAnalyzerPlugin({
            // 是否为静态导出
            // analyzerMode: 'static',
            defaultSizes: 'parsed',

            // 是否启动后打开窗口
            openAnalyzer: false
				}),

				// 引入局部刷新插件
				new webpack.HotModuleReplacementPlugin(),
				new OpenBrowserPlugin({
					url: 'http://localhost:8090'
				})
    ],
	// 文件导出的配置
	output:{
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},

	// 处理项目中的不同类型的模块
	module: {
		rules: genRules('src', true)
	},

	devServer: {
		host: 'localhost',
		port: '9091',
		compress: true, //服务器压缩
		contentBase: path.resolve(__dirname, 'dist'),
		hot: true //开启热更新
	}
};

module.exports = config;
