MdApp.controller('PromoCodeCtrl', function ($scope,$routeParams, commonService, $location, $timeout)
{
    $scope.message = 0;
    $scope.messagedetail = '';
    $scope.limit = 10;
    $scope.salespersonObj = {};
    $scope.total = 0;
    $scope.start = 0;
    $scope.salesperson = {};
    $scope.salespersonlen = 0;
    $scope.active = '';
    $scope.order_sequence = 'ASC';
    $scope.order_by = 'first_name';
    $scope.serverApiCall = function (paramObj, url, name)
    {
        commonService.commonApiCall(paramObj, 'fantasyadmin/adminpromocode/' + url).then(function (response)
        {
            //console.log(response);return false;
            $scope.limit = Number(angular.element('#limit').val());
            $scope.start = response.data.start;
            $scope.salesperson = response.data.salesperson;
            $scope.salespersonlen = response.data.salesperson.length;
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
        });
    }

    $scope.get_all_sales_person = function (name, order)
    {
        if (typeof name != "undefined")
        {
            $scope.order_by = name;
            $scope.order_sequence = $scope.order_sequence;
        }
        var paramObj = {start: $scope.start, league_id: $scope.league_id, search_keyword: $scope.search_keyword, limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by};
        $scope.serverApiCall(paramObj, 'get_all_sales_person', name);

    };
    $scope.SetPagingAct = function (text, page)
    {
        $scope.start = (page - 1) * $scope.limit;
        $scope.get_all_withdrawal_request();
    };

    $scope.UpdatePersonStatus = function ()
    {
        var sales_person_id = [];
        $('.sales_person_id:checked').each(function (i)
        {
            sales_person_id[i] = this.value;
        });
        if (sales_person_id.length > 0)
        {
            if ($scope.status)
            {
                showloading();
                var PostData = {sales_person_unique_id: sales_person_id, status: $scope.status};
                commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/update_person_status').then(function (response)
                {
                    hideloading();
                    if (response.status) {
                        $scope.message = 1;
                        $scope.messagedetail = response.message;
                    } else {
                        $scope.message = 2;
                        $scope.messagedetail = response.message;
                    }
                    $('html, body').animate({
                        scrollTop: $('body').offset().top
                    }, 1000);
                    $scope.get_all_sales_person();
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
    
    $scope.getCountry = function()
    {
        var PostData = {};
        commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/get_country').then(function (response)
        {
            $scope.countries = response.data;           
            
        });
    }
    $scope.getStates = function()
    {
        var PostData = {country:$scope.salesperson.country};
        commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/get_states').then(function (response)
        {
            $scope.state = response.data;
            $.uniform.update();
            
        });
    }
    
    $scope.createSalesPerson = function()
    {
        if($( "#valid" ).validationEngine('validate')){
            var PostData = $scope.salesperson;
            PostData.action = 'add';
            PostData.dob = angular.element('#dob').val();
            commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/sales_person_update').then(function (response)
            {
                hideloading();
                if (response.status) {
                    $scope.message = 1;
                    $scope.messagedetail = response.message;
                } else {
                    $scope.message = 2;
                    $scope.messagedetail = response.message;
                }
                $('html, body').animate({
                    scrollTop: $('body').offset().top
                }, 1000);
                $timeout(function () {  location.href = siteUrl+"fantasyadmin/sales_person";}, 1300);
            });
        }
    }
    
    $scope.editObj = {};
    $scope.editSalesPerson  = function(){
        var PostData = {sales_person_unique_id:$routeParams.editId};
        showloading();
        commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/get_sales_person_by_id').then(function (response) {              
            $scope.salesperson = response.data;
            //console.log(response.data.state_id);
            //$('#state_id').val(response.data.state_id);
           // $.uniform.update('#state_id');
            $timeout(function () { $.uniform.update(); }, 300);
            hideloading();
        }, function (error) {

        });
    }
    $scope.updateSalesPerson = function()
    {
        if($( "#valid" ).validationEngine('validate')){
            var PostData = $scope.salesperson;
            PostData.action = 'update';
            PostData.dob = angular.element('#dob').val();
            //PostData.sales_person_unique_id = angular.element('#sales_person_unique_id').val();
            commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/sales_person_update').then(function (response)
            {
                hideloading();
                if (response.status) {
                    $scope.message = 1;
                    $scope.messagedetail = response.message;
                } else {
                    $scope.message = 2;
                    $scope.messagedetail = response.message;
                }
                $('html, body').animate({
                    scrollTop: $('body').offset().top
                }, 1000);
                //console.log(siteUrl+"fantasyadmin/sales_person");
               
                $timeout(function () {  location.href = siteUrl+"fantasyadmin/sales_person";}, 1300);
            });
        }
    }
    
    $scope.promoCodeInit = function ()
    {
        $scope.limit = 10;
        $scope.promocodeObj = {};
        $scope.total = 0;
        $scope.start = 0;
        $scope.promocode = {};
        $scope.promocodelen = 0;
        $scope.active = '';
        $scope.order_sequence = 'ASC';
        $scope.order_by = 'U.first_name';
    }
    
    $scope.serverPromoApiCall = function (paramObj, url, name)
    {
        commonService.commonApiCall(paramObj, 'fantasyadmin/adminpromocode/' + url).then(function (response)
        {
            //console.log(response);return false;
            $scope.limit = Number(angular.element('#limit').val());
            $scope.start = response.data.start;
            $scope.promocode = response.data.promocode;
            $scope.promocodelen = response.data.promocode.length;
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
        });
    }

    $scope.get_all_promo_code = function (name, order)
    {
        if (typeof name != "undefined")
        {
            $scope.order_by = name;
            $scope.order_sequence = $scope.order_sequence;
        }
        var paramObj = {start: $scope.start, search_keyword: $scope.search_keyword, limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by};
        $scope.serverPromoApiCall(paramObj, 'get_all_promo_code', name);

    };
    $scope.UpdatePromoCodeStatus = function()
    {
        var promo_code_id = [];
        $('.promo_code_id:checked').each(function (i)
        {
            promo_code_id[i] = this.value;
        });
        if (promo_code_id.length > 0)
        {
            if ($scope.status)
            {
                showloading();
                var PostData = {promo_code_id: promo_code_id, status: $scope.status};
                commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/update_promocode_status').then(function (response)
                {
                    hideloading();
                    if (response.status) {
                        $scope.message = 1;
                        $scope.messagedetail = response.message;
                    } else {
                        $scope.message = 2;
                        $scope.messagedetail = response.message;
                    }
                    $('html, body').animate({
                        scrollTop: $('body').offset().top
                    }, 1000);
                    $scope.get_all_promo_code();
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
    
    $scope.InitializePerson = function ()
    {
        var PostData  = {type:$scope.promocode.type}
        commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/get_all_person').then(function (response)
        {
            $scope.Person = response.data;
        });
    }
    
    $scope.createPromoCode = function()
    {
        if($( "#valid" ).validationEngine('validate')){
            var PostData = $scope.promocode;
            
            commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/create_promo_code').then(function (response)
            {
                hideloading();
                if (response.status) {
                    $scope.message = 1;
                    $scope.messagedetail = response.message;
                } else {
                    $scope.message = 2;
                    $scope.messagedetail = response.message;
                }
                $('html, body').animate({
                    scrollTop: $('body').offset().top
                }, 1000);
                $timeout(function () {  location.href = siteUrl+"fantasyadmin/promo_code";}, 1300);
            });
        }
    }
    
    $scope.InitYearMonth = function ()
    {
        var date = new Date();
        var years = [],months = [],
            monthNames = { '01':'January', '02':'February', '03':'March', '04':'April', '05':'May', '06':'June',
            '07':'July', '08':'August', '09':'September', '10':'October', '11':'November', '12':'December' };
        for(var i = 2012; i <= date.getFullYear() ; i++) {
            years.push(i);

        }
        $scope.months = monthNames;
        $scope.years = years;
    }
    $scope.getPromoCodeEarning = function (name, order)
    {
        if (typeof name != "undefined")
        {
            $scope.order_by = name;
            $scope.order_sequence = $scope.order_sequence;
        }
        var paramObj = {start: $scope.start, search_keyword: $scope.search_keyword, limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by,"year": $scope.year,"month": $scope.month};
        $scope.serverPromoApiCall(paramObj, 'get_promo_code_earning', name);

    }
    
    $scope.UpdateCommission = function()
    {
        var promo_code_id = [];
        $('.promo_code_id:checked').each(function (i)
        {
            promo_code_id[i] = this.value;
        });
        if (promo_code_id.length > 0)
        {
            if ($scope.status)
            {
                showloading();
                var PostData = {promo_code_id: promo_code_id, status: $scope.status,year:$scope.year,month:$scope.month};
                commonService.commonApiCall(PostData, 'fantasyadmin/adminpromocode/update_commission_status').then(function (response)
                {
                    hideloading();
                    if (response.status) {
                        $scope.message = 1;
                        $scope.messagedetail = response.message;
                    } else {
                        $scope.message = 2;
                        $scope.messagedetail = response.message;
                    }
                    $('html, body').animate({
                        scrollTop: $('body').offset().top
                    }, 1000);
                    
                    $scope.getPromoCodeEarning();
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
    
});