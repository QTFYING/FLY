/* jshint esversion: 6 */

// jsonp使用方法
let util = window.FLY.T.Util;
util.jsonp({
    url: 'http://www.baidu.com/api',
    data: {
      name: 'qtfying',
      age: 18
    }
  });