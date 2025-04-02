import axios from "axios";
import errorCode from "./errorCode";
import { getToken } from './auth'

// 是否显示重新登录
export let isRelogin = { show: false };
// 当前环境
const NODE_ENV = process.env.NODE_ENV;
// 根据当前环境设置请求地址
let api_url = ''
switch (NODE_ENV) {
    case 'development':
        // api_url = 'https://apifoxmock.com/m1/4707150-4359301-default' + process.env.VUE_APP_BASE_API
        api_url = 'http://172.16.5.12:8090'
        break;
    case 'production':
        api_url = 'http://172.16.5.12:8090'
        break;
}
console.log('NODE_ENV=>', NODE_ENV);

let storeInstance = null; // 注入store实例
export function setStore(store) {
    storeInstance = store;
}

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: api_url,
    // 超时
    timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
        let url = config.url + '?' + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
        const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        }
        const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
        const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
        if (requestSize >= limitSize) {
            console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
            return config;
        }
        const sessionObj = cache.session.getJSON('sessionObj')
        if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
            cache.session.setJSON('sessionObj', requestObj)
        } else {
            const s_url = sessionObj.url;                  // 请求地址
            const s_data = sessionObj.data;                // 请求数据
            const s_time = sessionObj.time;                // 请求时间
            const interval = 1000;                         // 间隔时间(ms)，小于此时间视为重复提交
            if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
                const message = '数据正在处理，请勿重复提交';
                console.warn(`[${s_url}]: ` + message)
                return Promise.reject(new Error(message))
            } else {
                cache.session.setJSON('sessionObj', requestObj)
            }
        }
    }
    // 等待状态
    storeInstance.commit('system/SET_LOADING', true);
    return config
}, error => {
    console.log(error)
    // 关闭等待状态
    storeInstance.commit('system/SET_LOADING', false);
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 关闭等待状态
    storeInstance.commit('system/SET_LOADING', false);
    // 未设置状态码则默认成功状态
    const code = Number(res.data.code) || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res.data
    }
    if (code === 401) {
        // if (!isRelogin.show) {
        //   isRelogin.show = true;
        //   MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
        //     isRelogin.show = false;
        //     store.dispatch('LogOut').then(() => {
        //       location.href = '/index';
        //     })
        //   }).catch(() => {
        //     isRelogin.show = false;
        //   });
        // }
        return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
        return Promise.reject(msg);
    } else if (code === 601) {
        return Promise.reject('error')
    } else if (code !== 200 && code !== 0) {
        return Promise.reject('error')
    } else {
        return res.data
    }
},
    error => {
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        // 关闭等待状态
        storeInstance.commit('system/SET_LOADING', false);
        return Promise.reject(error)
    }
)

export default service;

// get请求参数
export function paramsStr(data) {
    let str = ''
    if (data) {
      let count = 0
      for (let key in data) {
        if (count == 0) {
          str += '?' + key + '=' + data[key] 
        } else {
          str += '&' + key + '=' + data[key]
        }
        count++
      }
    }
    return str;
  }