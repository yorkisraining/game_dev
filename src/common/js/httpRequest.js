import axios from 'axios'

const http = axios.create({
    timeout: 1000 * 30,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
    // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
    return actionName
}

export default http