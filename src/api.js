(function(root, $){

    var ns = 'QBClient';

    var Api = function(config) {

        this.url = ((config && config.url) || '/').replace(/\/?$/, '/');
        this.port = (config && config.port) ? config.port : null;
        this.authUrlFrag = (config && config.authUrlPath) ? config.authUrlPath : 'auth';
        this.registerUrlFrag = (config && config.registerUrlPath) ? config.registerUrlPath : 'register';
        this.token = null;
        this.$ = (config && config.$) ? config.$ : $;
        this.crossDomain = (config && config.crossDomain) ? config.crossDomain : false;

    };

    Api.prototype = {

        authenticate : function(id, password) {

            var authWait = this.$.Deferred(),
                self = this;

            var authRequest = this._request('post', this.authUrlFrag, {
                id : id,
                password : password
            });

            authRequest.done(function(resp){
                if (resp.success && resp.data.token) {
                    self.token = resp.data.token;
                    authWait.resolve();
                }
            });

            return authWait;

        },

        register : function(id, password, meta) {

            var authWait = this.$.Deferred(),
                self = this;

            var authRequest = this._request('post', this.registerUrlFrag, {
                id : id,
                password : password,
                meta : meta
            });

            authRequest.done(function(resp){
                if (resp.success && resp.data.token) {
                    self.token = resp.data.token;
                }
                authWait.resolve();
            });

            return authWait;

        },

        find : function(kind, filters) {

            return this._request('get', 'find', {
                kind : kind,
                filters : filters
            });

        },

        save : function(kind, insertObj) {

            return this._request('post', 'save', {
                kind : kind,
                properties : insertObj
            });

        },

        _request : function(method, urlFrag, data) {

            data['_t'] = this.token;

            return this.$.ajax({
                data : data,
                type : method,
                dataType : 'json',
                crossDomain : this.crossDomain,
                url : this.url + urlFrag
            });

        }

    };

    root[ns] = Api;

})(this, jQuery || $);