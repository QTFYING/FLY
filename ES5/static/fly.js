/* jshint esversion: 9 */
(function(FLY) {
  /**
   * fly.js
   * 版本: 1.0.0
   * fly.js尽量覆盖开发过程中的常见的场景，提高开发效率
   * 博客: https://blog.csdn.net/qtfying
   * 掘金: https://juejin.im/user/57deadcd0e3dd90069721916
   * QQ: 2811132560
   * 邮箱: qtfying@gamil.com
   */
  F = fly = f = FLY;
  F.T = F.T || {};
  F.T.Util = F.T.Util || {};
  var util = F.T.Util;

  /**
   * 测试工具库是否正常引入
   */
  util.test = function () {
    console.log('引入fly.js框架成功');
  };

  /**
   * 获取URL中某个参数的值
   * @returns {String}
   */
  util.getUrlParam =  function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var p = window.location.search.split("?")[1];
    if (p) {
      var r = p.match(reg);
      if (r) return decodeURIComponent(r[2]);
    }
    return null;
  };

  /**
   * 获取URL中某个参数的值
   * @returns {String}
   */
  util.getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  };

  /**
   * 将URL查询参数转换为Object
   * @returns {{Object}}
   */
  util.getUrlQueryParams = function (url) {
    var reg = /\b([^&=]*)=([^&]*)/gi;
    if (!url) url = location.search;
    if (url[0] === '?' || url[0] === '#') url = url.substring(1);
    var obj = {};
    url.replace(reg, function (m, a, d) {
      if (typeof obj[a] !== 'undefined') {
        obj[a] += ',' + decodeURIComponent(d);
      } else {
        obj[a] = decodeURIComponent(d);
      }
    });
    return obj;
  };

  /**
   * 将参数转拼接为url链接后的传参
   * util.json2url({ name:'qtfying', age: 18 }) => "name=qtfying&age=18"
   * @returns {{String}}
  */
  util.json2url = function(json) {
    var arr = [];
    for(var name in json) {
      arr.push(name + '=' +json[name]);
    }
    return arr.join('&');
  };

  /**
   * reducde实现，功能同上
   * util.formatUrl({ name:'qtfying', age: 18 }) => "name=qtfying&age=18"
   * @returns {{String}}
   */
  util.formatUrl = (data) => {
    const keys = Object.keys(data);
    const keysLen = keys.length;
    return keys.reduce((pre, cur, index) => {
      const value = data[cur];
      const flag = index !== keysLen - 1 ? '&' : '';
      return `${pre}${cur}=${value}${flag}`;
    }, '');
  };

  /**
   * get请求
   * @returns {{responseText}}
   */
  util.get = function (jsonData) {
    util.ajax({
      url: jsonData.url,
      data: jsonData.data,
      succFn: jsonData.succFn,
      errFn: jsonData.errFn,
      type: 'get'
    });
  };

  /**
   * post请求
   * @returns {{responseText}}
   */
  util.post = function (jsonData) {
    ajax({
      url: jsonData.url,
      data: jsonData.data,
      succFn: jsonData.succFn,
      errFn: jsonData.errFn,
      type: 'post'
    });
  };

  /**
   * 结合jquery，重新封装ajax
   * @returns {{responseText}}
   */
  util.ajax = function (json) {
    var timer = null;
    json = json || {};
    if (!json.url) {
      alert('请求url不存在，请重新检查');
      return;
    }
    json.type = json.type || 'get';
    json.time = json.time || 10;
    json.data = json.data || {};
    var _Ajax = new XMLHttpRequest();
    switch (json.type.toLowerCase()) {
      case 'get':
        _Ajax.open('GET', json.url + '?' + util.json2url(json.data), true);
        _Ajax.send();
        break;
      case 'post':
        _Ajax.open('POST', json.url, true);
        _Ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        oAjax.send(util.json2url(json.data));
        break;
    }
    _Ajax.onreadystatechange = function() {
      if (_Ajax.readyState == 4) {
        if (_Ajax.status >= 200 && _Ajax.status < 300 || _Ajax.status == 304) {
          clearTimeout(timer);
          json.succFn && json.succFn(_Ajax.responseText);
        } else {
          clearTimeout(timer);
          json.errFn && json.errFn(_Ajax.status);
        }
      }
    };
    timer = setTimeout(function() {
      alert('请求超时，请重新处理 ~ ');
      _Ajax.onreadystatechange = null;
    }, json.time * 1000);
  };

  /**
   * 判断目标类型
   * @returns {String}
   */

  util.type = function (data) {
    var toString = Object.prototype.toString;
    var dataType = toString
      .call(data)
      .replace(/\[object\s(.+)\]/, "$1")
      .toLowerCase();
    return dataType;
  };

/**
 * 封装一个jsopn用来跨域
 * @param url 请求的地址，为字符串
 * @param data 请求的参数，为对象
 * @returns {Promise<any>}
 */
util.jsonp = function ({url, data}) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    // 接口返回的数据获取
    window.jsonpCb = (res) => {
      document.body.removeChild(script);
      delete window.jsonpCb;
      resolve(res);
    };

    script.src = `${url}?${util.formatUrl(data)}&cb=jsonpCb`;
    document.body.appendChild(script);
  });
};

/**
 * 封装fetch请求
 * @param url 请求的地址，为字符串
 * @param data 请求的参数，为对象
 * @returns {Promise<any>}
 */

 util.fetchData = function (method, url, param, headers = null) {
  // 请求头信息
  let defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept-Charset': 'utf-8',
  };

  let newHeaders = {...defaultHeaders, ...headers};

  return new Promise((resolve, reject) => {
    fetch(url + (method.toUpperCase() === 'POST' ? '' : `?${util.formatUrl(param)}`), {
      method: method,
      body: method.toUpperCase() === 'POST' ? JSON.stringify(param) : null,
      headers: newHeaders,
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    }).then(res => {
        // 如果返回的状态为200，表示正常
        if(res.status === 200) {
          return res.json();
        } else {
          // 服务器端抛出的错误会在这里捕获
          reject(res.statusText);
        }
      }).then(json => {
        // 如果返回 code=-1，则表示错误
        if(json.code === -1) reject(json.message);
        else resolve(json);
      }).catch(error => {
        // 其它错误会在这里获捕
        reject(error);
      });
  });
 };

})(window.FLY = window.fly || {});