MdApp.controller('WithdrawalCtrl', function ($scope, commonService, $location) 
{
    $scope.message = 0;
    $scope.messagedetail = '';
    $scope.limit = 100;
    $scope.livecheckObj = {};
    $scope.total = 0;
    $scope.start = 0;
    $scope.livecheck = {};
    $scope.livechecklen =0;
    $scope.active = '';
    $scope.order_sequence = 'ASC';
    $scope.order_by = 'first_name';  
    $scope.serverApiCall = function(paramObj, url,name)
    {
        commonService.commonApiCall(paramObj, 'fantasyadmin/adminwithdrawal/'+url).then(function (response) 
        {
            hideloading();
            //console.log(response);return false;
            $scope.limit = Number(angular.element('#limit').val());
            $scope.start = response.data.start;
            $scope.livecheck = response.data.livecheck;
            $scope.livechecklen = response.data.livecheck.length;
            $scope.total = response.data.total;
            $scope.order_sequence = response.data.order_sequence;
            $scope.order_by = response.data.field_name;
            if(response.data.order_sequence=='ASC'){
                $('.ui-icon-'+name).removeClass('ui-icon-triangle-1-s');
                $('.ui-icon-'+name).addClass('ui-icon-triangle-1-n');
            }
            else
            {
                $('.ui-icon-'+name).removeClass('ui-icon-triangle-1-n');
                $('.ui-icon-'+name).addClass('ui-icon-triangle-1-s');   
            }
        });
    }
    
    $scope.get_all_withdrawal_request = function (name, order) 
    { 
        s_name = [];
        if (typeof name != "undefined") 
        {
            $scope.order_by = name;
            $scope.order_sequence = $scope.order_sequence;
            s_name = name.split(".");
        }
        var paramObj = {start: $scope.start,league_id: $scope.league_id,search_keyword: $scope.search_keyword,limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by};
        showloading();
        $scope.serverApiCall(paramObj, 'get_all_withdrawal_request',s_name[1]);

    };
    $scope.SetPagingAct = function (text, page) 
    {
        $scope.start = (page - 1) * $scope.limit;
        $scope.get_all_withdrawal_request();
    };
    
    $scope.processLiveCheckRequest = function(id)
    {
        var PostData = {withdraw_id:id};
        showloading();
        commonService.commonApiCall(PostData, 'fantasyadmin/adminwithdrawal/process_live_check_request').then(function (response) 
        {
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
            location.reload();
        });        
    }
    $scope.rejectLiveCheckRequest = function(id)
    {
        showloading();
        var PostData = {withdraw_id:id};
        commonService.commonApiCall(PostData, 'fantasyadmin/adminwithdrawal/reject_live_check_request').then(function (response) 
        {
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
            location.reload();
        });        
    }
    
    $scope.updateBatchStatusOfLiveCheck = function()
    {      
        var withdraw_id = [];
        $('.withdraw_id:checked').each(function(i)
        {
            withdraw_id[i] = this.value;
        });
        if(withdraw_id.length > 0)
        {
            if($scope.status)
            {
                showloading();
                var PostData = {withdraw_id:withdraw_id,status:$scope.status};
                commonService.commonApiCall(PostData, 'fantasyadmin/adminwithdrawal/update_live_check_status').then(function (response) 
                {
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
                    location.reload();
                });      
            }
            else
            {
                jAlert('Please select status.');
            }
        }
        else
        {
            jAlert('Please select checkbox.');
        }
    }
    
    $scope.paypalInit = function(){
        $scope.limit = 100;
        $scope.paypalObj = {};
        $scope.total = 0;
        $scope.start = 0;
        $scope.paypal = {};
        $scope.paypallen =0;
        $scope.active = '';
        $scope.order_sequence = 'ASC';
        $scope.order_by = 'first_name';  
    }
    $scope.serverPaypalApiCall = function(paramObj, url,name)
    {
        commonService.commonApiCall(paramObj, 'fantasyadmin/adminwithdrawal/'+url).then(function (response) 
        {
            hideloading();
            //console.log(response);return false;
            $scope.limit = Number(angular.element('#limit').val());
            $scope.start = response.data.start;
            $scope.paypal = response.data.paypal;
            $scope.paypallen = response.data.paypal.length;
            $scope.total = response.data.total;
            $scope.order_sequence = response.data.order_sequence;
            $scope.order_by = response.data.field_name;
            if(response.data.order_sequence=='ASC')
            {
                $('.ui-icon-'+name).removeClass('ui-icon-triangle-1-s');
                $('.ui-icon-'+name).addClass('ui-icon-triangle-1-n');
            }
            else
            {
                $('.ui-icon-'+name).removeClass('ui-icon-triangle-1-n');
                $('.ui-icon-'+name).addClass('ui-icon-triangle-1-s');   
            }
        });
    }
    
    $scope.get_all_withdrawal_request_paypal = function (name, order) 
    { 
        s_name = [];
        if (typeof name != "undefined") 
        {
            $scope.order_by = name;
            $scope.order_sequence = $scope.order_sequence;
            s_name = name.split(".");
        }
        var paramObj = {start: $scope.start,league_id: $scope.league_id,search_keyword: $scope.search_keyword,limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by};
        showloading();
        $scope.serverPaypalApiCall(paramObj, 'get_all_withdrawal_request_paypal',s_name[1]);

    };
    $scope.SetPagingAct = function (text, page) 
    {
        $scope.start = (page - 1) * $scope.limit;
        $scope.get_all_withdrawal_request();
    };
    
    $scope.processPaypalRequest = function(id)
    {
        var PostData = {withdraw_id:id};
        showloading();
        commonService.commonApiCall(PostData, 'fantasyadmin/adminwithdrawal/process_user_paypal_withdrawal_request').then(function (response) 
        {
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
            location.reload();
        });        
    }
    $scope.rejectPaypalRequest = function(id)
    {
        showloading();
        var PostData = {withdraw_id:id};
        commonService.commonApiCall(PostData, 'fantasyadmin/adminwithdrawal/reject_user_paypal_withdrawal_request').then(function (response) 
        {
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
            location.reload();
        });        
    }
});
