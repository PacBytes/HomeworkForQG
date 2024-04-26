import http from 'http';
import Context from './context.mjs';
import Request from './request.mjs';
import Response from './response.mjs';
import compose from './compose.mjs';


class Application {
    // 一个 app（server），拥有独立的上下文
    constructor() {
        this.middleware = [];
    }

    // 要有 use 方法，传入中间件
    // fn：中间件（请求处理函数）
    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
        this.middleware.push(fn);
        return this;
    }

    // 在某个端口监听请求，请求交给 handleRequest 进行一次封装和处理
    listen(...args) {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });
        return server.listen(...args);
    }
    
    // 对于每次请求封装一个 context 对象, this 要绑定到 Application
    // 让所有请求走一遍中间件
    handleRequest = (req, res) => {
        const compose_fn = compose(this.middleware);
        const ctx = this.createContext(req, res);
        // 默认设置 404
        ctx.response.res.statusCode = 404;
        // 执行中间件 compose 的函数
        // 这里不会拦截抛出的 Error，拦截的是 Promise reject 对象
        compose_fn(ctx)
            .catch(err => {console.log(err)})
            .then(()=>{
                res.end(ctx.response.body)
            });
            
    }

    createContext(req, res) {
        const context = Object.create(Context);
        context.request = Object.create(Request);
        context.response = Object.create(Response);
        // 保留原生的 req, res 对象
        context.request.req = req;
        context.response.res = res;
        return context;
    }
    

}

export default Application;