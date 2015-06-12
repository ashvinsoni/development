/* Google library js*/
var google_client_id = '912182702557-kc9bgugjpbt3q4hb79mbgl69lmct713o.apps.googleusercontent.com';
var google_scope     = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.login';
var google_api_key   = 'AIzaSyDcXJWZVEp3XfrImTtjYK8Pe5Mb8U9n2MA';
var is_google_loaded = false;	

var GoogleLogin = function(client_id, scope, api_key) {
	self_g         = this;
	this.client_id = client_id;
	this.scope     = scope;
	this.api_key   = api_key;
};

$.extend(GoogleLogin.prototype,{
	self_g      : '',
	is_render     : false,
	client_id     : '',
	scope       : '',
	api_key     : '',
	user_info   : {},
	callback    : '',

	SignInButtonRender:function(sign_in_btn_id) {

		gapi.signin.render(sign_in_btn_id, {
			'callback': GoogleLogin.prototype.SignInCallBack,
			'clientid': self_g.client_id,
			'cookiepolicy': 'single_host_origin',
			'requestvisibleactions': 'http://schemas.google.com/AddActivity',
			'scope': self_g.scope
		});


	},
	SignInCallBack:function(authResult){


		if (authResult && !authResult.error && self_g.is_render) {
				access_token = authResult.access_token;
			    self_g.GetUserEmail();
		} 
		self_g.is_render = true;
		
	},

	GetUserEmail:function(){
		gapi.client.load('oauth2', 'v2', function() {
				//var request = gapi.client.oauth2.userinfo.get();
            var request = gapi.client.oauth2.userinfo.v2.me.get();

                //request.B['apiVersion'] ='v2';
				request.execute(function(resp) {
					 //console.log(resp);
			        self_g.user_info.id    = resp.id;
			        self_g.user_info.email = resp.email;
                    self_g.GetUserProfile();
				});
		});
	},

	GetUserProfile:function(){

		gapi.client.load('plus', 'v1', function() {

            var request_me = gapi.client.plus.people.get({'userId': 'me'});
            request_me.B['apiVersion'] ='v1';
			request_me.execute(function(rep){
                self_g.user_info.displayName = rep.displayName;
                self_g.user_info.gender      = rep.gender;
                self_g.user_info.image       = rep.image.url;
                self_g.user_info.first_name  = rep.name.givenName;
                self_g.user_info.last_name   = rep.name.familyName;
                self_g.user_info.public_url  = rep.url;

                self_g.ReturnUserInfo();
			});
		});
	},

	ReturnUserInfo:function(){
		window[self_g.callback](self_g.user_info);
	},

	GoogleSignout:function(){
		gapi.auth.signOut();
	}


});



(function() {
	var po = document.createElement('script');
	po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/client:plusone.js?onload=google_init';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
})();


function google_init(){
	g_obj1 =  new GoogleLogin(google_client_id, google_scope, google_api_key);
	g_obj1.callback = 'GoogleCallback';
	is_google_loaded = true;
}

function GoogleCallback(user_data){
	console.log('GoogleCallback');
	console.log(user_data);
}