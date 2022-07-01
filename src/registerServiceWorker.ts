/* eslint-disable no-console */

import {register} from 'register-service-worker'
import {ElMessage} from "element-plus/es";

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log('App is being served from cache by a service worker.')
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
      ElMessage('正在下载新版本')
    },
    updated() {
      console.log('New content is available; please refresh.')
      ElMessage('新版本已就绪，所有应用窗口关闭后将自动完成更新')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
      ElMessage('没有网络连接，启动离线模式...')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
