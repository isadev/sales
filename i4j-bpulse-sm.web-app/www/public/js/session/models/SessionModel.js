/**
 * @desc		stores the POST state and response state of authentication for user
 */
var SessionModel = BaseModel.extend({

    // Initialize with negative/empty defaults
    // These will be overriden after the initial checkAuth
    defaults: {
        logged_in: false,
        impersonate: false,
        user_id: '',
        language: ''
    },
    namespace: "SessionModel",
    localStorage: true,
    initialize: function(){
        var  self = this;
        Backbone.LocalStorage.setPrefix(self.namespace);
        self.namespaceUrl = self.namespace + ":/auth";
        // _.bindAll(this);
        // Singleton user object
        // Access or listen on this throughout any module with app.session.user
        self.user = new UserModel({});
    },
    url: function(){
        return '/auth';
    },
    // Fxn to update user attributes after recieving API response
    updateSessionUser: function(userData){
        var self = this;
        self.user.set(_.pick(userData, _.keys(self.user.defaults)));
    },
    /*
    * Check for session from API 
    * The API will parse client cookies using its secret token
    * and return a user object if authenticated
    */
    checkAuth: function(callback, args) {
        var self = this;
        self.fetch({
            async: false, 
            success: function(mod, res){
                if(!res.error && res.domain){
                    self.updateSessionUser(res.domain);
                    self.set({logged_in : true});    
                } else {
                    self.set({ logged_in : false });   
                }
            }, error: function(mod, res){
                self.set({ logged_in : false });   
            }
        });
    },
    /*
    * Abstracted fxn to make a POST request to the auth endpoint
    * This takes care of the CSRF header for security, as well as
    * updating the user and session after receiving an API response
    */
    postAuth: function(opts, callback, args){
        var self = this;
        var postData = _.omit(opts, 'method');
        // if(DEBUG) console.log(postData);
        $.ajax({
            url: self.url() + '/' + opts.method,
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            beforeSend: function(xhr){
                // Set the CSRF Token in the header for security
                var token = $("input[name^='TOKEN_CSRF_']").val();
                if (token) xhr.setRequestHeader('X-CSRF-Token', token);
            },
            data:  JSON.stringify( _.omit(opts, 'method')),
            success: function(res){
                if( !res.error ){
                    if(_.indexOf(['login', 'signup'], opts.method) !== -1){

                        self.updateSessionUser( res.domain || {} );
                        self.set(_.pick({ logged_in: true, user_id: res.domain.id }, _.keys(self.defaults)))
                    } else {
                        self.set({ logged_in: false });
                    }

                    if(callback && 'success' in callback) callback.success(res);
                } else {
                    if(callback && 'error' in callback) callback.error(res);
                }
            },
            error: function(mod, res){
                if(callback && 'error' in callback) callback.error(res);
            }
        });
    },
    login: function(opts, callback, args){
        var self = this;
        localStorage.clear();
        self.postAuth(_.extend(opts, {method: 'login'}), callback);
        BaseRouter.initI18n();
    },
    logout: function(opts, callback, args){
        var self = this;
        self.postAuth(_.extend(opts, {method: 'logout'}), callback);
    },
    signup: function(opts, callback, args){
        var self = this;
        self.postAuth(_.extend(opts, {method: 'signup'}), callback);
    },
    clean: function(opts, callback, args){
        var self = this;
        localStorage.clear();
        self.checkAuth();
    },
    recoveryPassword: function(opts, callback, args){
        var self = this;
        self.postAuth(_.extend(opts, {method: 'recovery_password'}), callback);
    }
});
var app = [];
app.session = new SessionModel();