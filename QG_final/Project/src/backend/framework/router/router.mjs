import Layer from './layer.mjs';
import compose from '../compose.mjs';
/**
 * Router 是一个类
 * 实例化后的对象可以调用http method小写后的函数（有这个属性）
 * 传入 url, 回调方法 (ctx) => {} 来处理请求
 * 最后，调用 routes 方法要返回一个可以use的中间件对象
 * 
 * 实例化后 router 里有一个 stack
 * stack：里面放 layer
 * 每个 layer, 有 url, route 列表
 * 每个 route 有一个 map/object 对象
 * 每个对象 method 和 handler 两个属性
 */
class Router {
    constructor(opts = {}) {
        // 该路由要代理的 http 方法
        this.methods = opts.methods || [
            'HEAD',
            'OPTIONS',
            'GET',
            'PUT',
            'PATCH',
            'POST',
            'DELETE',
        ];
        this.stack = []; // 存放各种层
        // 实例化后的对象可以调用http method小写后的函数（有这个属性）
        for (let m of this.methods) {
            this[m.toLowerCase()] = function(url, middleware) {
                if (!(typeof url === 'string' || url instanceof RegExp)) throw new Error("url should be a path or a RegExp");
                this.register(url, m, middleware);
                return this;
            }
        }
    }

    register(url, method, middleware){
        let existLayer = 0;
        for (let layer of this.stack) {
            if (url === layer.url) {
                layer.route = layer.route || [];
                layer.route.push({
                    method: method,
                    handler: middleware
                })
                existLayer = 1;
            }
        }
        if (!existLayer) {
            let layer = new Layer(url, method, middleware);
            this.stack.push(layer);
        }
    }

    // 返回一个可用的中间件（调度器）
    routes() {
        return (ctx, next) => {
            ctx.router = this;
            let solved = 0;
            // 可能有多个 method 符合的，用compose next调用
            let middlewares = [];
            // 每一个 url 层
            for (let layer of this.stack) {
                // 如果 url 匹配，则进入每一层的方法路由
                if (this.matchPath(layer.url, ctx.path)) {
                    for (let r of layer.route) {
                        if (r.method === ctx.method) {
                            // 方法路由中间件列表添加处理函数
                            middlewares.push(r.handler);
                            solved = 1;
                        }
                    }
                }
            }
            if(!solved) return next();
            return compose(middlewares)(ctx, next);
        }
    }

    matchPath (pattern, path){
        if (pattern === "*") return true;
        if (pattern === path) return true;
    }

    /** 用法示例
     * ```javascript
     * router
     *   .get('/', (ctx, next) => {
     *     ctx.body = 'Hello World!';
     *   })
     *   .post('/users', (ctx, next) => {
     *     // ...
     *   })
     *   .put('/users/:id', (ctx, next) => {
     *     // ...
     *   })
     *   .del('/users/:id', (ctx, next) => {
     *     // ...
     *   });
     */
    
    

    // 调用 routes 返回中间件给 app.use
}

export default Router;