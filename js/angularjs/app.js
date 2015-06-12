var app = angular.module('draftgaming', ['ngRoute','localytics.directives','reCAPTCHA']).config([
    '$parseProvider', function ($parseProvider) {
        return $parseProvider.unwrapPromises(true);
    }
]);

app.config(function ($httpProvider,$locationProvider) {
  $httpProvider.interceptors.push(['$q','$location', function($q,$location) {
  return {
    response: function(response) {  
      
    if (response.data.status == 0) {  
      $( '#error_message .msg' ).empty().append( response.data.msg );
      $('.middle-loader').hide();
          ShowMessage( 'error_message' , 'bounceInDown' );
          $location.path('/lobby');       
    }
    if (response.data.status == 3) {  
      if ( response.data.msg != 'not_started') {
        $( '#error_message .msg' ).empty().append( response.data.msg );
        $('.middle-loader').hide();
            ShowMessage( 'error_message' , 'bounceInDown' );
            setTimeout( function (){ CloseMessage( 'error_message' , 'bounceOutUp' );
             } , 2000 );  
      }
    }     
      return response || $q.when(response);
    },
    responseError: function(rejection) {      
      if (rejection.status == 401) 
      {         
        window.location.href=siteUrl;               
      }
      else if (rejection.status == 404) 
      { 
        
         window.location.href=siteUrl+'error_404';                
      }

      return $q.reject(rejection);
    }
  }
}]);
  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
});


/*app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);*/

app.directive('lobbyRepeat', function($timeout) {
  return function(scope, element, attrs) {
    if (scope.$last){
      $timeout(function(){

     $('.fees-block li:first-child').addClass('active');     
     $("#SportsBlock li:first").trigger('click').children().addClass('active');
      },100);
    }
  };
}); 

//*********Facebook module initialized*************/
app.run(function ($rootScope) {
    $rootScope.checkLogin = function(data) {
      if(typeof data.login != 'undefined'&& data.login==false){
        window.location.href=siteUrl;
      }
    };

    window.fbAsyncInit = function () {
        FB.init({
            appId:FacebookAppId,
            status:true,
            cookie:true,
            xfbml:true
        });
        
        FB.Event.subscribe('auth.statusChange', function(response) {
            $rootScope.$broadcast("fb_statusChange", {'status': response.status});
        });
    };

    (function (d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));
});  

/***********Facebook module end****************/

// Recaptcha congif 

app.config(function (reCAPTCHAProvider) {
  // required, please use your own key :)
  reCAPTCHAProvider.setPublicKey(CAPCHTA_KEY);
  // optional
  reCAPTCHAProvider.setOptions({
    theme: 'clean'
  });
});