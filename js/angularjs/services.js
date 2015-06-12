app.factory('AppInfo',function(){
	return {
		serviceURL:siteUrl
	};
});

app.service('Auth',function($http,$rootScope,$q,AppInfo)
{
	this.Login= function(username,password)
	{
		var deferred = $q.defer();
		var loginObj ={email:username,password:password};
     	$http.post(AppInfo.serviceURL+'login/check_login',loginObj).success(function(data) {      		
     		deferred.resolve(data);}).error(function(msg, code) {  		
       	});
     	return deferred.promise;
	};

	this.Logout = function()
	{
		var deferred = $q.defer();
		$http.post(AppInfo.serviceURL+'auth/logout').success(function(data) {      		
     		deferred.resolve(data);}).error(function(msg, code) {  		
       	});
     	return deferred.promise;
	};

	this.getCountryState = function()
	{
		var deferred = $q.defer();
     	$http.post(AppInfo.serviceURL+'login/get_country_state').success(function(data) {         	
     		deferred.resolve(data);}).error(function(msg, code) {  		
       	});
     	return deferred.promise;
	};

	this.signUp = function(user)
	{
		var deferred = $q.defer();
     	$http.post(AppInfo.serviceURL+'login/signup',user).success(function(data) {    
     	console.log(data);  		
     		deferred.resolve(data);}).error(function(msg, code) {  		
       	});
     	return deferred.promise;
	};

	this.loadCaptcha = function()
	{
		var deferred = $q.defer();
		$http.post(AppInfo.serviceURL+'statics/ajax_captcha').success(function(data){
		deferred.resolve(data);}).error(function(msg, code){
		});
		return deferred.promise;
	};
	
});





app.service('myGamesService',function($http,$rootScope,$q,AppInfo){

    this.getGamesData= function(values)
    {
        var deferred = $q.defer();
        
        $http.post(AppInfo.serviceURL+'dashboard/my_games', values).success(function (data) {
            $rootScope.checkLogin(data);
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;        
    };

    this.getGamesDataFilter= function(values)
    {
        var deferred = $q.defer();
        
        $http.post(AppInfo.serviceURL+'dashboard/my_games_filter', values).success(function (data) {
            $rootScope.checkLogin(data);
            deferred.resolve(data);
        }).error(function (data) {
            
            deferred.reject(data);
        });
        return deferred.promise;        
    };

    this.getSportsLeagueid = function(values){
       
       var deferred = $q.defer();
        
        $http.post(AppInfo.serviceURL+'dashboard/get_soprts_luageid', values).success(function (data) {
            //console.log( data );
            deferred.resolve(data);
        }).error(function (data) {
            
            deferred.reject(data);
        });
        return deferred.promise;

    };
    
    //Added for entrants popup
    this.getEntrantsDataList= function(values)
    {
        var deferred = $q.defer();
        
        $http.post(AppInfo.serviceURL+'dashboard/get_entrants_popup', values).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            
            deferred.reject(data);
        });
        return deferred.promise;        
    };

    this.getParticipantsDataList= function(values)
    {
        var deferred = $q.defer();
        
        $http.post(AppInfo.serviceURL+'dashboard/get_participant_profile_popup', values).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            
            deferred.reject(data);
        });
        return deferred.promise;        
    };
});

app.service('profileService',function($http,$rootScope,$q,AppInfo)
{

	this.getProfileData= function(values)
	{
		var deferred = $q.defer();
		$http.post(AppInfo.serviceURL+'dashboard/my_profile', values).success(function (data) {	
		    deferred.resolve(data);
		}).error(function (data) {
			
		    deferred.reject(data);
		});
		return deferred.promise;		
	};

	this.saveUpdateProfile= function(values)
	{
		var deferred = $q.defer();
		$http.post(AppInfo.serviceURL+'dashboard/update_profile', values).success(function (data) {
			console.log(data);
		    deferred.resolve(data);
		}).error(function (data) {
			
		    deferred.reject(data);
		});
		return deferred.promise;		
	};

});

app.service('myInvitesService',function($http,$rootScope,$q,AppInfo)
{

	this.getInvitationData= function(values)
	{
		var deferred = $q.defer();
		$http.post(AppInfo.serviceURL+'dashboard/my_invites', values).success(function (data) {
		    deferred.resolve(data);
		}).error(function (data) {
			
		    deferred.reject(data);
		});
		return deferred.promise;		
	};
	this.inviteUsers= function(values)
	{
		var deferred = $q.defer();
		$http.post(AppInfo.serviceURL+'dashboard/invite_friend_for_game', values).success(function (data) {
		    deferred.resolve(data);
		}).error(function (data) {
			
		    deferred.reject(data);
		});
		return deferred.promise;		
	};
});

app.factory('socket', function ($rootScope) {
	var socket  = function(){};
	socket.on   = function(){};
	socket.emit = function(){};
	// var socket = io( NodeAddr );
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

app.service('commonService', function($q, $http, $rootScope,AppInfo){
	this.commonApiCall = function(values,url){
		var deferred = $q.defer();
		$http.post(AppInfo.serviceURL+url, values).success(function (data) {
            $rootScope.checkLogin(data);
		    deferred.resolve(data);
		}).error(function (data) {
		    deferred.reject(data);
		});
		return deferred.promise;		
	} 

});


// get Data
app.service('chatservice', function($q, $http, AppInfo){
   
        this.getChatlist = function (reqData) {
            var deferred = $q.defer();
            $http.post(AppInfo.serviceURL + 'Widgets/get_messages').success(function (data) {
                deferred.resolve(data);
                //alert("success" + data)
            }).error(function (data) {
                deferred.reject(data);
                //alert("error")
            });
            return deferred.promise;
        }

        this.getAllChatMessages = function (reqData) {
            var deferred = $q.defer();
            $http.post(AppInfo.serviceURL + 'Widgets/get_messages').success(function (data) {
                deferred.resolve(data);
                //alert("success" + data)
            }).error(function (data) {
                deferred.reject(data);
                //alert("error")
            });
            return deferred.promise;
        }

        this.addNewPost = function (values) {
            var deferred = $q.defer();
            $http.post(AppInfo.serviceURL + 'Widgets/add_new',values).success(function (data) {
                deferred.resolve(data);
                //alert("success" + data)
            }).error(function (data) {
                deferred.reject(data);
                //alert("error")
            });
            return deferred.promise;
        }
    
});


app.service('contactService', function($q, $http, AppInfo){
	this.getArealist = function (reqData) {
            var deferred = $q.defer();
            $http.post(AppInfo.serviceURL + 'dashboard/get_area_list').success(function (data) {
                deferred.resolve(data);
                //alert("success" + data)
            }).error(function (data) {
                deferred.reject(data);
                //alert("error")
            });
            return deferred.promise;
    }

    this.saveContact = function (values) {
            var deferred = $q.defer();
            $http.post(AppInfo.serviceURL + 'dashboard/save_contact',values).success(function (data) {
                deferred.resolve(data);
                //alert("success" + data)
            }).error(function (data) {
                deferred.reject(data);
                //alert("error")
            });
            return deferred.promise;
    }
        
});


// Recaptcha service
angular.module('reCAPTCHA', []).provider('reCAPTCHA', function() {
    var _publicKey = null,
        _options = { theme : 'custom' ,custom_theme_widget: 'recaptcha_widget'},
        self = this;

    this.setPublicKey = function(publicKey) {
        _publicKey = publicKey;
    };

    this.setOptions = function(options) {
        _options = options;
    };

    this._createScript = function($document, callback) {
        var scriptTag = $document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = '//www.google.com/recaptcha/api/js/recaptcha_ajax.js';
        scriptTag.onreadystatechange = function() {
            if (this.readyState == 'complete') {
                callback();
            }
        };
        scriptTag.onload = callback;
        var s = $document.getElementsByTagName('body')[0];
        s.appendChild(scriptTag);
    };

    this.$get = ['$q', '$rootScope', '$window', '$document', function($q, $rootScope, $window, $document) {
        var deferred = $q.defer();

        if (!$window.Recaptcha) {
            self._createScript($document[0], deferred.resolve);
        } else {
            deferred.resolve();
        }

        return {
            create: function(element, callback) {
                if (!_publicKey) {
                    throw new Error('Please provide your PublicKey via setPublicKey');
                }
                _options.callback = callback;

                deferred.promise.then(function() {
                    $window.Recaptcha.create(
                        _publicKey,
                        element,
                        _options
                    );
                });
            },
            setPublicKey: function(publicKey) {
                _publicKey = publicKey;
            },
            response: function() {
                return $window.Recaptcha.get_response();
            },
            challenge: function() {
                return $window.Recaptcha.get_challenge();
            },
            reload: function() {
                return $window.Recaptcha.reload();
            },
            destroy: function() {
                if ($window.Recaptcha) {
                    $window.Recaptcha.destroy();
                }
            }
        };
    }];

}).directive('reCaptcha', ['reCAPTCHA', '$compile', function(reCAPTCHA, $compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function(scope, element, attrs, controller) {
            var name = attrs.name || 'reCaptcha';
            scope.clear = function() {
                scope.ngModel = {
                    response: '',
                    challenge: false
                };
            };

            // Create reCAPTCHA
            reCAPTCHA.create(element[0], function() {

                // Reset on Start
                scope.clear();

                // watch if challenge changes
                scope.$watch(function() {
                    return reCAPTCHA.challenge();
                }, function (newValue) {
                    scope.ngModel.challenge = newValue;
                });

                // Attach model and click handler
                $compile(angular.element(document.querySelector('input#recaptcha_response_field')).addClass('textfield'))(scope);
                $compile(angular.element(document.querySelector('input#recaptcha_response_field')).attr('ng-required', 'true'))(scope);
                $compile(angular.element(document.querySelector('input#recaptcha_response_field')).attr('ng-model', 'ngModel.response'))(scope);
                $compile(angular.element(document.querySelector('a#recaptcha_reload_btn')).attr('ng-click', 'clear()'))(scope);

            });

            // Destroy Element
            scope.$on('$destroy', reCAPTCHA.destroy);
        }
    };
}]);