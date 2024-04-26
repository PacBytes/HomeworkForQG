const response = {
    _body: undefined,

    get body() {
        return this._body;
    },

    set body(val) {
        this._body = val;
        if(!this._explicitStatus) this.res.statusCode = 200;
    },

    get status() {
        return this.res.statusCode;
    },

    set status(code) {
        this.res.statusCode = code;
        this._explicitStatus = true;
    }
};


export default response;