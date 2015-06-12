Fantasy.factory('AppInfo',function(){
	return {
		serviceURL:siteUrl
	};
});
Fantasy.service('commonService', function ($q, $http, $rootScope, AppInfo) {
    
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