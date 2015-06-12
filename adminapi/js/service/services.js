MdApp.factory('dataSavingHttp', function($http,$location) {
	var wrapper = function(requestConfig) {
		var httpPromise = $http(requestConfig);
		var spinner = new Spinner();
		spinner.spin(document.body);
		httpPromise.success(function(result, status, headers, config){
			spinner.stop();
			if(typeof result.is_login!='undefined'&&result.is_login==false){window.location.href='sudo'};
			var l = window.location;
			wrapper.lastApiCallConfig = config;
			wrapper.lastApiCallUri = l.protocol + '//' + l.host + '' + config.url + '?' +
				(function(params){
					var pairs = [];
					angular.forEach(params, function(val, key){
						pairs.push(encodeURIComponent(key)+'='+encodeURIComponent(val));
					})
					return pairs.join('&')
				})(config.params);
			wrapper.lastApiCallResult = result;
		})
		return httpPromise;
	};
	return wrapper;
});
MdApp.factory('AppInfo',function(){
	return {
		serviceURL:siteUrl
	};
});
MdApp.service('commonService', function ($q, $http, $rootScope, AppInfo) {
    
    this.commonApiCall = function (values, url) {
        var deferred = $q.defer();
        $http.post(AppInfo.serviceURL + url, values).success(function (data) {            
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

});