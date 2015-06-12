/* Twitter lib */

var Twitter = function(callback){
	self_twt = this;
	self_twt.callback = callback;
}


$.extend(Twitter.prototype, {
	self_twt : {},
	callback : '',

	Login : function(){
		 window.open("twitter/auth",'Twitter','width=500,height=500,scrollbars=yes');
	},

	TwtCallback : function( user_data){

		window[self_twt.callback](user_data);		
	}
});


$(document).ready(function() {
	twt_obj = new Twitter('TwitterCallback');
});


function TwitterCallback (user_data){
	var appElement = document.querySelector('[data-ng-controller=loginController]');
	var $scope = angular.element(appElement).scope();
  	$scope.TWLogin(user_data);
}

