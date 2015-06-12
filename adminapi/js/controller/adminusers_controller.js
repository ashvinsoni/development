MdApp.controller('AdminUsersCtrl', function ($scope, commonService, $location)
{
    $scope.limit = 10;
    $scope.total = 0;
    $scope.start = 0;
    $scope.user_data = {};
    $scope.order_sequence = 'ASC';
    $scope.order_by = 'user_name';
    $scope.rosterObj = {};
    $scope.SetPagingAct = function (text, page)
    {
        $scope.start = (page - 1) * $scope.limit;
        $scope.get_all_user_detail();
    };
    
    $scope.message = 0;
    $scope.messagedetail = '';
    $scope.limit = 100;
    $scope.rosterObj = {};
    $scope.total = 0;
    $scope.start = 0;
    $scope.user_data = {};
    $scope.user_datalen =0;
    $scope.active = '';
    $scope.order_sequence = 'ASC';
    $scope.order_by = 'first_name';  
    $scope.serverApiCall = function(paramObj, url,name,file_name)
    {
        commonService.commonApiCall(paramObj, 'fantasyadmin/adminusers/'+url).then(function (response) 
        {
            //console.log(response);return false;
            if(paramObj.is_csv == 'true'){
                var anchor = angular.element('<a/>');
                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response),
                    target: '_blank',
                    download: file_name+'.csv'
                })[0].click();
            }else{
                $scope.limit = Number(angular.element('#limit').val());
                $scope.start = response.data.start;
                $scope.user_data = response.data.user_data;
                $scope.user_datalen = response.data.user_data.length;
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
            }
        });
    }
    $scope.get_all_user_detail = function (name, order) 
    { 
        if (typeof name != "undefined") 
        {
            $scope.order_by = name;
            $scope.order_sequence = $scope.order_sequence;
        }
        var paramObj = {start: $scope.start,search_keyword: $scope.search_keyword,limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by,'is_csv':"false"};
     
        $scope.serverApiCall(paramObj, 'get_all_user_detail',name,'');

    };
    $scope.userExportToCsv = function (name, order)
    {
            if (typeof name != "undefined")
            {
                $scope.order_by = name;
                $scope.order_sequence = $scope.order_sequence;
            }
            var from_date = angular.element('#from_date').val();
            var to_date = angular.element('#to_date').val();
            var paramObj = {start: $scope.start,from_date: from_date, to_date: to_date, limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by,'is_csv':"true"};
            var file_name = 'UserWiseReport-'+from_date;
            $scope.serverApiCall(paramObj, 'get_all_user_detail', name,file_name);
        
    };
    $scope.update_batch_status_of_user = function()
    {
        var user_id = [];
        $('.user_id:checked').each(function(i)
        {
            user_id[i] = this.value;
        });
        if(user_id.length > 0)
        {
            if($scope.status)
            {
                showloading();
                var PostData = {ui:user_id,status:$scope.status};
                commonService.commonApiCall(PostData, 'fantasyadmin/adminusers/update_user_status').then(function (response) 
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
                    $scope.get_all_user_detail();
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
//    $scope.get_all_withdrawal_request = function (name, order) 
//    { 
//        s_name = [];
//        if (typeof name != "undefined") 
//        {
//            $scope.order_by = name;
//            $scope.order_sequence = $scope.order_sequence;
//            s_name = name.split(".");
//        }
//        var paramObj = {start: $scope.start,league_id: $scope.league_id,search_keyword: $scope.search_keyword,limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by};
//        showloading();
//        $scope.serverApiCall(paramObj, 'get_all_withdrawal_request',s_name[1]);
//
//    };
//    // update user status
//    $scope.update_batch_status_of_user = function ()
//    {
//        var total_checked = $('.user_id:checked').length;
//        if (total_checked == 0)
//        {
//            jAlert('Please select user.');
//            return false;
//        }
//        if (!$('#status').val())
//        {
//            jAlert('Please select status.');
//            return false;
//        }
//        $scope.update_user_status($('#user_list').serialize());
//    }
//
//    $scope.update_user_status = function (user_data)
//    {
//        $.ajax({
//            url: site_url + 'admin/update_user_status',
//            type: 'POST',
//            dataType: 'json',
//            async: true,
//            data: user_data,
//            success: function (response)
//            {
//                $scope.rosterObj[ 'status_1' ] = "images/active.png";
//                $scope.rosterObj[ 'status_0' ] = "images/deactivate.png";
//                if (response.response != 0)
//                {
//                    if (typeof user_data === "string")
//                    {
//                        var status = $('#status').val();
//                        $.each($('.user_id:checked'), function (key, obj) {
//                            var s = 1;
//                            if (status == 1)
//                                s = 0;
//                            $('.status_' + $(obj).val()).attr('src', $scope.rosterObj['status_' + status]);
//                            $('[data-ui=' + $(obj).val() + ']').data('status', s);
//                        });
//                    }
//                    else
//                    {
//                        var ui = user_data.ui;
//                        var status = user_data.status;
//                        $.each(ui, function (key, value)
//                        {
//                            var s = 1;
//                            if (status == 1)
//                                s = 0;
//                            $('.status_' + value).attr('src', $scope.rosterObj['status_' + status]);
//                            $('[data-ui=' + value + ']').data('status', s);
//                        });
//                    }
//                }
//            }
//        });
//    }
//
//    $scope.get_all_user_detail = function (name, order) {
//        if (typeof name != "undefined")
//        {
//            $scope.order_by = name;
//        }
//        var post_data = {"start": $scope.start, "limit": angular.element('#limit').val(), "filter_name": $scope.filter_name,
//            "order": $scope.order_sequence, "field": $scope.order_by};
//        dataSavingHttp({
//            method: "POST",
//            url: site_url + 'admin/get_all_user_detail',
//            dataType: "json",
//            data: post_data
//        }).success(function (response)
//        {
//            $scope.limit = Number(angular.element('#limit').val());
//            $scope.start = response.data.start;
//            $scope.user_data = response.data.user_data;
//            $scope.total = response.data.total;
//            $scope.order_sequence = response.data.order_sequence;
//            $scope.order_by = response.data.field_name;
//
//            if (response.data.order_sequence == 'ASC')
//            {
//                $('.ui-icon-' + name).removeClass('ui-icon-triangle-1-s');
//                $('.ui-icon-' + name).addClass('ui-icon-triangle-1-n');
//            }
//            else
//            {
//                $('.ui-icon-' + name).removeClass('ui-icon-triangle-1-n');
//                $('.ui-icon-' + name).addClass('ui-icon-triangle-1-s');
//            }
//
//        }).error(function (error) {
//            $scope.error = error;
//        });
//    };

});
