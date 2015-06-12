MdApp.controller('AdvertisementCtrl', function ($scope,commonService, $location) {
    $scope.adsObj = {target_url:'',name:'',type:'',image:''};
    $scope.message = 0;
    $scope.messagedetail = '';
    $scope.intializeImageLoad = function ()
    {
        $scope.adsObj.is_preview = 0;
        $scope.adsObj.is_loader = 0;
        $scope.adsObj.uploadbtn = 1;
        $scope.adsObj.is_remove = 0;
        var btnupload = $('#upload_btn');
        new AjaxUpload(btnupload, {
            action: siteUrl + 'admin/do_upload',
            name: 'userfile',
            responseType: 'json',
            data: {field_name: 'userfile'},
            onSubmit: function (file, ext)
            {
                if (!(ext && /^(jpg|png|jpeg|gif)$/.test(ext))) {
                    //return false;
                }
                $scope.adsObj.is_loader = 1;
                $scope.adsObj.uploadbtn = 0;
                $scope.$digest();
            },
            onComplete: function (file, response)
            {   console.log(response);
                $scope.adsObj.is_preview = 1;
                $scope.adsObj.is_loader = 0;
                $scope.adsObj.image_path = response.data;
                $scope.adsObj.image = response.file_name;
                $scope.adsObj.is_remove = 1;
                $scope.$digest();
                console.log(response.data);
            }
        });
    }
    
    
    $scope.removeImage = function ()
    {
        var PostData = {image_name : $scope.adsObj.image};
        commonService.commonApiCall(PostData, 'admin/remove_image').then(function (response) {
            $scope.adsObj.is_preview = 0;
            $scope.adsObj.is_remove = 0;
            $scope.adsObj.uploadbtn = 1;
        }, function (error) {

        });
    }
    $scope.getPositionType  = function(){
        
        var PostData = {};
        commonService.commonApiCall(PostData, 'admin/get_positions').then(function (response) {
            $scope.PositionType = response.data
        }, function (error) {

        });
    }
    $scope.getPositionType();

    $scope.addAdvertisement  = function(){
        //console.log($scope.adsObj.name);
        if($("#valid").validationEngine('validate')){
            var PostData = {name : $scope.adsObj.name,type:$scope.adsObj.type,target_url:$scope.adsObj.target_url,image:$scope.adsObj.image};
            commonService.commonApiCall(PostData, 'admin/create_ads').then(function (response) {
                if(response.status){
                    $scope.message = 1;
                    $scope.messagedetail = response.message;
                }else{
                    $scope.message = 2;
                    $scope.messagedetail = response.message;
                }
                $( 'html, body').animate({
                      scrollTop: $('body').offset().top
                    }, 1000); 
                $
                setTimeout(function () {
                    window.location.href = window.location.href;
                }, 2000);
            }, function (error) {

            });
        }
    }
    
    $scope.advertisement = {};
    $scope.getAdvertisement  = function(){
        //console.log($scope.adsObj.name);        
        var PostData = {};
        commonService.commonApiCall(PostData, 'admin/get_advertisement').then(function (response) {
            console.log(response);
            $scope.advertisement = response.data;
        }, function (error) {

        });
        
    }
    $scope.hidemsg = function () {
        $('.nNote').fadeOut(1000);
    };
});
