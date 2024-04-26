const context = {

};


export default new Proxy(context, {
    get: function(target, prop) {
        return target[prop] || target.request[prop] || target.response[prop] || undefined;
    },

    set: function(target, prop, value) {
        let filters = ['body', 'status'];
        if (~filters.indexOf(prop)) {
            target.response[prop] = value;
        } else {
            target[prop] = value;
        }
        return true;
    }
})