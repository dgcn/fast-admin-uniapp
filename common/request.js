function request(options) {
  return new Promise((resolve, reject) => {
	  var headerTmp = { 
		  'Content-Type': 'application/json',
		  'apiKey': '77a22aec393574d6328b9c066b7c9b5b'
		}
	var baseUrl = "https://www.gdshangan.cn"
	var url = baseUrl + options.url
	const header = Object.assign({}, headerTmp, options.header);
	uni.request({
	  url: url, // 服务器url
	  method: options.method || 'GET', // 请求方法，默认为GET
	  data: options.data || {}, // 请求参数
	  header: header , // 设置请求的 header
	  success: (res) => {
		// 请求成功
		if (res.statusCode === 200) {
		  resolve(res.data);
		} else {
		  // 可以根据项目要求修改错误处理
		  reject(res.errMsg);
		}
	  },
	  fail: (err) => {
		// 请求失败处理
		reject(err);
	  }
	});
  });
}

export {
	request
}