function compose (middleware) {
    middleware = middleware || [];
    if (!Array.isArray(middleware)) middleware = [middleware];

    return function(ctx){
        let prev = -1; // 上一个组件索引
        // 执行第一个中间件，返回 Promise 对象
        return dispatch(0);
        function dispatch(i) {
            // 边界条件
            if (i === middleware.length) return Promise.resolve();
            // i <= prev 说明调用没按照顺序，或者重复调用
            if (i <= prev) return Promise.reject(new Error('next() called multiple times'));
            prev = i; // 更新 prev
            let fn = middleware[i];
            try {
                // fn 有两个参数，第一个是上下文，第二个是 next（调用可以执行下一个组件）
                // 需要用 .bind 来生成一个新的函数
                return Promise.resolve(fn(ctx, dispatch.bind(null, i+1)));
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }
}

export default compose;