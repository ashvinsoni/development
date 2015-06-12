MdApp.controller('LoginCtrl', ['$scope', 'commonService', '$location', function ($scope, commonService, $location) {
    $scope.message = 0;
    $scope.messagedetail = '';
   $scope.onValidationComplete = function (form, status) {
            if (status) {
                var PostData = $scope.user;
                commonService.commonApiCall(PostData, 'fantasyadmin/login').then(function (response) {
                    if (response.status) {
                        window.location.href = site_url + 'fantasyadmin/dashboard';
                    }
                    if(response.status){
                        $scope.message = 1;
                        $scope.messagedetail = response.message;
                    }else{
                        $scope.message = 2;
                        $scope.messagedetail = response.message;
                    } 
                }, function (error) {
                    $scope.error = error;
                });
            }
        }; 
}]);