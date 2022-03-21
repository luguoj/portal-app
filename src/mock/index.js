// import Mock from "mockjs";
// import './authorize'
// import './gateway'
//
// // 设置响应时间
// Mock.setup({
//     timeout: '100-300'
// })
//
// // 修正MOCK BUG,转发不拦截的地址时忽略了withCredentials属性
// Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
// Mock.XHR.prototype.send = function() {
//     if (this.custom.xhr) {
//         this.custom.xhr.withCredentials = this.withCredentials || false
//
//         if (this.responseType) {
//             this.custom.xhr.responseType = this.responseType
//         }
//     }
//     this.proxy_send(...arguments)
// }