import { pathToRegexp } from 'path-to-regexp'

/**
 * 每个 layer, 有 url, route 列表
 * 每个 route 有一个 map/object 对象
 * 每个对象 method 和 handler 两个属性
 */

class Layer {
/** 一个 layer 对应一个 url，但key对应多个 method，每个method对应一个middleware
 * 原因：比如 RESTful 风格 api，url都是一样的
 * @param {String} url
 * @param {Array} methods HTTP 动词列表
 * @param {Array} middlewares 请求执行的中间件列表
 */
    constructor(url, methods, middlewares) {
        this.url = url;
        this.route = [];
        middlewares = Array.isArray(middlewares) ? middlewares : [middlewares];
        methods = Array.isArray(methods) ? methods : [methods];
        for (let i = 0; i < methods.length; ++i) {
            this.route.push({
                method: methods[i],
                handler: middlewares[i]
            })
        }
    }
}

export default Layer;