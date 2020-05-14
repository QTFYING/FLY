/* jshint esversion: 6 */

// jsonp使用方法
let util = window.FLY.T.Util;
util.jsonp({
    url: '../../mock/mock.js',
    data: {
      name: 'qtfying',
      age: 18
    }
  }).then(res => console.log(res))
    .catch(error => console.log('Error:', error));