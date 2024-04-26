import url from 'url';

function urlSearchParamsToObject(params) {
    const obj = {};
    for (const [key, value] of params) {
        if (obj[key] !== undefined) {
            if (!Array.isArray(obj[key])) {
                obj[key] = [obj[key]];
            }
            obj[key].push(value);
        } else {
            obj[key] = value;
        }
    }
    return obj;
}

const request = {
    get headers() {
        // this 表示调用request的对象（this -> ctx.request)
        return this.req.headers;
    },

    // /...
    get url() {
        return this.req.url;
    },

    // /... 不带参数
    get path() {
        return url.parse(this.req.url).pathname;
    },

    get query() {
        return urlSearchParamsToObject(new URLSearchParams(url.parse(this.req.url).query));
    },
    
    get method(){
        return this.req.method;
    },
};


export default request;