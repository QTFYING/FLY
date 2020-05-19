/* jshint esversion: 6 */
let util = window.FLY.T.Util;
// jsonp使用方法
util.jsonp({
    url: '../../mock/mock.js',
    data: {
      name: 'lucy',
      age: 18
    }
  }).then(res => console.log(res))
    .catch(error => console.log('Error:', error));

// fetchData
util.fetchData('POST', 'http://rap2.taobao.org:38080/app/mock/248500/fly/bank_list_post', {
  city: '553',
  page: 1
}).then(data => console.log(data))
  .catch(error => console.log(error));

// fetchData
util.fetchData('GET', 'http://rap2.taobao.org:38080/app/mock/248500/fly/bank_list_get', {
  city: '553',
  page: 1
}).then(data => console.log(data))
.catch(error => console.log(error));