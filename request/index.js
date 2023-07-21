// const baseUrl = "http://127.0.0.1:8000"
const baseUrl = "http://101.42.13.57:2583"
const request = (url = '', date = {}, type = 'GET', header = {}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			method: type,
			url: baseUrl + url,
			data: date,
			header: header,
			dataType: 'json',
		}).then((res) => {
			resolve(res[1].data);
		}).catch(err => {
			reject(err)
		})
	});
}
export default request
