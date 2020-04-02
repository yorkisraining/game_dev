/* 
 * 请求封装公共方法
 */
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截器
axios.interceptors.request.use(config => {
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        config.headers.appToken = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
})

const exitLogin = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('tokenExpire');
    sessionStorage.removeItem('tokenExpire');
    localStorage.removeItem('ifOpenNotice');
    sessionStorage.removeItem('ifOpenNotice');
    window.location.reload();
}

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error) {
            exitLogin();
        }
        return Promise.reject(error) // 返回接口返回的错误信息
    });

// 发送请求及接收后处理
export const ajaxPost = (url, params, callback, errorCallback) => {
    axios.post(url, params)
        .then(function(response) {
            if (String(response.data.code).indexOf(4) == 0) {
                exitLogin();
                return false;
            }
            callback(response.data);
        })
        .catch(function(error) {
            if (errorCallback) {
                errorCallback(error)
            }
            console.log('服务器错误', error);
        })
}

export const ajaxGet = (url, params, callback, errorCallback) => {
    axios.get(url, {
            params: params
        })
        .then(function(response) {
            if (String(response.data.code).indexOf(4) == 0) {
                exitLogin();
                return false;
            }
            callback(response.data);
        })
        .catch(function(error) {
            if (errorCallback) {
                errorCallback(error)
            }
            console.log('服务器错误', error);
        })
}