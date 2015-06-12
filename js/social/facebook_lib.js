/* Facebook classes */
var appId        = FacebookAppId;
var is_fb_loaded = false;

window.fbAsyncInit = function() {
				    FB.init({
					      appId      : appId,			// App ID
					      status     : true, 			// check login status
					      cookie     : true, 			// enable cookies to allow the server to access the session
					      xfbml      : true,  			// parse XFBML
					      frictionlessRequests : true,  // Only for friend request dialog box
					      version    : 'v2.2'
				    });
			
				    is_fb_loaded = true;
		    
		  };

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));

/*  ***********************ABOVE CODE USED ONCE IN JS FILE********* *********************/

var FacebookLogin = function(callback){
	self_fb          = this;
	self_fb.callback = callback;	
};


$.extend(FacebookLogin.prototype,{
	self_fb 	: {},
	scope		: 'email,public_profile',
	field_req	: 'first_name, last_name, id, email, age_range, name, timezone, gender, verified',
	callback	: '',

	FbLoginStatusCheck:function(){
		
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
					self_fb.FbUserInformation();
			} else if (response.status === 'not_authorized') {
				self_fb.FbLogin();
			} else {
			   // the user isn't logged in to Facebook.
			   console.log('THE USER ISN\'T LOGGED IN TO FACEBOOK.');
			   self_fb.FbLogin();
			}
		});

	},

	FbLogin:function(){
		FB.login(function(response) {
				
				if (response.authResponse) {
     				self_fb.FbUserInformation();

		   		} else {
			    	console.log('User cancelled login or did not fully authorize.');

		   		}
	 	}, {scope: self_fb.scope});

	},

	FbUserInformation:function(){
		
		 FB.api('/me?fields='+self_fb.field_req, function(response) {
			// console.log(response);
			var output = response;
			delete output.picture ;
			var small  = 'https://graph.facebook.com/'+ response.id + '/picture?type=small';
			var normal = 'https://graph.facebook.com/'+ response.id + '/picture?type=normal';
			var large  = 'https://graph.facebook.com/'+ response.id + '/picture?type=large';
			var square = 'https://graph.facebook.com/'+ response.id + '/picture?type=square';
			
			output.picture        = {};
			output.picture.small  = small;
			output.picture.normal = normal;
			output.picture.large  = large;
			output.picture.square = square;

			window[self_fb.callback](output);
			

		});
	}

});


function FacebookCallback(user_data){  
	// console.log('FacebookCallback' , user_data);
	var appElement = document.querySelector('[data-ng-controller=loginController]');
	
	var $scope = angular.element(appElement).scope();
  	$scope.FbUserData(user_data);
}


$(document).ready(function() {
	fb_obj = new FacebookLogin('FacebookCallback');
});

