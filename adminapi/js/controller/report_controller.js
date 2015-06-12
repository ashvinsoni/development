MdApp.controller('ReportCtrl', function ($scope,$routeParams, commonService, $location, $timeout)
{
    $scope.message = 0;
    $scope.messagedetail = '';
    $scope.limit = 10;
    $scope.reportObj = {};
    $scope.total = 0;
    $scope.start = 0;
    $scope.report = {};
    $scope.reportlen = 0;
    $scope.active = '';
    $scope.order_sequence = 'ASC';
    $scope.order_by = 'first_name';
    $scope.serverApiCall = function (paramObj, url, name,file_name)
    {        
        commonService.commonApiCall(paramObj, 'fantasyadmin/adminreport/' + url).then(function (response)
        { 
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
                $scope.report = response.data.report;
                $scope.reportlen = response.data.report.length;
                $scope.total = response.data.total;
                $scope.order_sequence = response.data.order_sequence;
                $scope.order_by = response.data.field_name;
                if (response.data.order_sequence == 'ASC') {
                    $('.ui-icon-' + name).removeClass('ui-icon-triangle-1-s');
                    $('.ui-icon-' + name).addClass('ui-icon-triangle-1-n');
                }
                else
                {
                    $('.ui-icon-' + name).removeClass('ui-icon-triangle-1-n');
                    $('.ui-icon-' + name).addClass('ui-icon-triangle-1-s');
                }
            }
            
        });
    }

    $scope.get_all_user_report = function (name, order)
    {
        if($("#valid").validationEngine('validate')){
            if (typeof name != "undefined")
            {
                $scope.order_by = name;
                $scope.order_sequence = $scope.order_sequence;
            }
            var from_date = angular.element('#from_date').val();
            var to_date = angular.element('#to_date').val();
            var paramObj = {start: $scope.start,from_date: from_date, to_date: to_date,limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by,'is_csv':'false'};
            $scope.serverApiCall(paramObj, 'get_all_user_report', name,'');
        }
    };
    
    
    $scope.userExportToCsv = function (name, order)
    {
        if($("#valid").validationEngine('validate')){
            if (typeof name != "undefined")
            {
                $scope.order_by = name;
                $scope.order_sequence = $scope.order_sequence;
            }
            var from_date = angular.element('#from_date').val();
            var to_date = angular.element('#to_date').val();
            var paramObj = {start: $scope.start,from_date: from_date, to_date: to_date, limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by,'is_csv':'true'};
            var file_name = 'UserWiseReport-'+from_date;
            $scope.serverApiCall(paramObj, 'get_all_user_report', name,file_name);
            
        }
    };
    
    
    $scope.get_all_contest_report = function (name, order)
    {
        if($("#valid").validationEngine('validate')){
            if (typeof name != "undefined")
            {
                $scope.order_by = name;
                $scope.order_sequence = $scope.order_sequence;
            }
            var from_date = angular.element('#from_date').val();
            var to_date = angular.element('#to_date').val();
            var paramObj = {start: $scope.start,from_date: from_date, to_date: to_date,limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by,'is_csv':'false'};
            $scope.serverApiCall(paramObj, 'get_all_contest_report', name,'');
        }
    };
    
    $scope.contestExportToCsv = function (name, order)
    {
        if($("#valid").validationEngine('validate')){
            if (typeof name != "undefined")
            {
                $scope.order_by = name;
                $scope.order_sequence = $scope.order_sequence;
            }
            var from_date = angular.element('#from_date').val();
            var to_date = angular.element('#to_date').val();
            var paramObj = {start: $scope.start,from_date: from_date, to_date: to_date, limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by,'is_csv':'true'};
            var file_name = 'ContestWiseReport-'+from_date;
            $scope.serverApiCall(paramObj, 'get_all_contest_report', name,file_name);
            
        }
    };
    
    
    $scope.get_all_game_report = function (name, order)
    {
        if($("#valid").validationEngine('validate')){
            if (typeof name != "undefined")
            {
                $scope.order_by = name;
                $scope.order_sequence = $scope.order_sequence;
            }else{                
                $scope.order_by = 'game_created_by';
            }
            var from_date = angular.element('#from_date').val();
            var to_date = angular.element('#to_date').val();
            var paramObj = {start: $scope.start,from_date: from_date, to_date: to_date,limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by,'is_csv':'false'};
            $scope.serverApiCall(paramObj, 'get_all_games_report', name,'');
        }
    };
    
    $scope.gameExportToCsv = function (name, order)
    {
        if($("#valid").validationEngine('validate')){
            if (typeof name != "undefined")
            {
                $scope.order_by = name;
                $scope.order_sequence = $scope.order_sequence;
            }else{                
                $scope.order_by = 'game_created_by';
            }
            var from_date = angular.element('#from_date').val();
            var to_date = angular.element('#to_date').val();
            var paramObj = {start: $scope.start,from_date: from_date, to_date: to_date, limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by,'is_csv':'true'};
            var file_name = 'GameWiseReport-'+from_date;
            $scope.serverApiCall(paramObj, 'get_all_games_report', name,file_name);
            
        }
    };
    $scope.SetPagingAct = function (text, page)
    {
        $scope.start = (page - 1) * $scope.limit;
        $scope.get_all_withdrawal_request();
    };  
    
    
});