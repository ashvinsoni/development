MdApp.controller('AdvertisementCtrl', function ($scope, $routeParams,commonService, $location) {    
    $scope.adsObj = {target_url:'',name:'',type:'',image:'',adsense:'',ads_type:''};
    $scope.editObj = {target_url:'',name:'',type:'',image:'',adsense:'',ad_position_id:'',ad_management_id:''};
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
            action: siteUrl + 'fantasyadmin/advertisements/do_upload/',
            name: 'userfile',
            responseType: 'json',
            type: "POST", 
            data: {field_name: 'userfile'},
            onSubmit: function (file, ext)
            {
                showloading();
                var post_type = $('#position_type :selected').val();
                if (!(ext && /^(jpg|png|jpeg|gif)$/.test(ext))) {
                    //return false;
                
                }
                
                this.setData({
                    'post_type': post_type
                });
                $scope.editObj.is_loader = $scope.adsObj.is_loader = 1;
                $scope.editObj.uploadbtn = $scope.adsObj.uploadbtn = 0;
                $scope.$digest();
            },
            onComplete: function (file, response)
            {   hideloading();
                $scope.editObj.is_preview = $scope.adsObj.is_preview = 1;
                $scope.editObj.is_loader = $scope.adsObj.is_loader = 0;
                $scope.editObj.image_path = $scope.adsObj.image_path = response.data;
                $scope.editObj.image = $scope.adsObj.image = response.file_name;
                $scope.editObj.is_remove = $scope.adsObj.is_remove = 1;
                $scope.$digest();
            }
        });
    }
    
    
    $scope.removeImage = function ()
    {
        showloading();
        var PostData = {image_name : $scope.adsObj.image_adsense};
        commonService.commonApiCall(PostData, 'fantasyadmin/advertisements/remove_image').then(function (response) {
            $scope.adsObj.is_preview = 0;
            $scope.adsObj.is_remove = 0;
            $scope.adsObj.uploadbtn = 1;
            hideloading();
        }, function (error) {

        });
    }
     $scope.removeImageDb = function ()
    {
        showloading();
        var check = confirm('Are you sure...........');
        if(check){
            var PostData = {image:$scope.editObj.image,ad_management_id : $scope.editObj.ad_management_id};
            commonService.commonApiCall(PostData, 'fantasyadmin/advertisements/remove_image_db').then(function (response) {
                hideloading();
                $scope.editObj.is_preview = 0;
                $scope.editObj.is_remove = 0;
                $scope.editObj.uploadbtn = 1;
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
                    
            }, function (error) {

            });
        }
    }
    $scope.getPositionType  = function(){
        
        var PostData = {};
        commonService.commonApiCall(PostData, 'fantasyadmin/advertisements/get_positions').then(function (response) {
            $scope.PositionType = response.data
        }, function (error) {

        });
    }
    $scope.getPositionType();

    $scope.addAdvertisement  = function(){
        
        var image_adsense='';
        if($scope.adsObj.image!=''){
            image_adsense = $scope.adsObj.image;
        }else{
            image_adsense = $scope.adsObj.adsense;
        }
        
        if($("#valid").validationEngine('validate')){
            showloading();
            var PostData = {name : $scope.adsObj.name,type:$scope.adsObj.type,target_url:$scope.adsObj.target_url,image_adsense:image_adsense,ads_type:$scope.adsObj.ads_type};
            commonService.commonApiCall(PostData, 'fantasyadmin/advertisements/create_ads').then(function (response) {
                hideloading();
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
        showloading();
        var PostData = {};
        commonService.commonApiCall(PostData, 'fantasyadmin/advertisements/get_advertisement').then(function (response) {          
            $scope.advertisement = response.data;
            hideloading();
        }, function (error) {

        });
        
    }
    
    $scope.editObj = {};
    $scope.editAds  = function(id){         
        var PostData = {ads_id:$routeParams.editId};
        showloading();
        commonService.commonApiCall(PostData, 'fantasyadmin/advertisements/get_ads_by_id').then(function (response) {              
            $scope.editObj = response.data;         
            hideloading();
            if(response.data.image != ''){
                $scope.editObj.is_remove = 1;
                $scope.editObj.is_preview = 1;
                $scope.editObj.is_loader = 0;
                $scope.editObj.uploadbtn = 0;
            }else{
                $scope.editObj.is_remove = 0;
                $scope.editObj.is_preview = 0;
                $scope.editObj.is_loader = 0;
                $scope.editObj.uploadbtn = 1;
            }
        }, function (error) {

        });
    }
    
    $scope.updateAdvertisement  = function(){  
        showloading();
        var PostData = $scope.editObj;
        commonService.commonApiCall(PostData, 'fantasyadmin/advertisements/update_advertisement_by_id').then(function (response) {   
            hideloading();
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
                
            setTimeout(function () {
                window.location.href = window.location.href;
            }, 2000);            
        }, function (error) {

        });
    }
    
    $scope.updateStatus  = function(id,status){  
        showloading();
        var PostData = {ad_management_id:id,status:status}
        commonService.commonApiCall(PostData, 'fantasyadmin/advertisements/update_status').then(function (response) {  
            hideloading();
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

            setTimeout(function () {
                window.location.href = window.location.href;
            }, 2000);            
        }, function (error) {

        });
    }
});
