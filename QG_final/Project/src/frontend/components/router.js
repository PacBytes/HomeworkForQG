export default class Router {
    constructor() {
        this.routes = {}; // 路由列表
        this.currentUrl = ""; // 当前url
        this.hashChangeListener();
    }

    route(url, fn) {
        this.routes[url] = fn;
    }

    hashChangeListener(){
        window.addEventListener("hashchange", ()=>{
            // 获取并更新当前 url
            this.currentUrl = window.location.hash.slice(1) || '/';
            // 执行对应
            this.routes[this.currentUrl]();
        });
    }

    push(url) {
        window.location.href = "#"+url;
    }
}