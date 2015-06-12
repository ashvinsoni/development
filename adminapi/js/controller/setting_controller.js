MdApp.controller('SettingCtrl', function ($scope,$routeParams, commonService) {
    $scope.message = 0;
    $scope.messagedetail = '';
    $scope.updateDateTime = function()
    {
        showloading();
        var PostData = {date:$scope.date_time};
        commonService.commonApiCall(PostData, 'fantasyadmin/adminsetting/update_date_time').then(function (response) 
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
            
        }, function (error) {

        });
    }
    
    
    $scope.sendEmail = function()
    {
        if($("#valid").validationEngine( 'validate' ))
        {
            showloading();
            var message = angular.element("#message").text();        
            var PostData = {subject:$scope.subject,message:message,action:'add'};
            commonService.commonApiCall(PostData, 'fantasyadmin/adminsetting/sendemails').then(function (response) 
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
    }
    
    $scope.updateProfile = function()
    {
        if($("#valid").validationEngine( 'validate' ))
        {
            showloading();
            var PostData = {old_password:$scope.old_password,new_password:$scope.new_password,confirm_new_password:$scope.confirm_new_password};
            commonService.commonApiCall(PostData, 'fantasyadmin/adminsetting/update_profile').then(function (response) 
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
    }
    
    $scope.limit = 100;
    $scope.youtubeObj = {};
    $scope.total = 0;
    $scope.start = 0;
    $scope.youtube = {};
    $scope.youtubelen =0;
    $scope.active = '';
    $scope.order_sequence = 'ASC';
    $scope.order_by = 'youtube_url';  
    $scope.serverApiCall = function(paramObj, url,name)
    {
        commonService.commonApiCall(paramObj, 'fantasyadmin/adminsetting/'+url).then(function (response) 
        {
            hideloading();
            //console.log(response);return false;
            $scope.limit = Number(angular.element('#limit').val());
            $scope.start = response.data.start;
            $scope.youtube = response.data.youtube;
            $scope.youtubelen = response.data.youtube.length;
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
        }, function (error) {

        });
    }
    
    $scope.get_all_youtube_url = function (name, order) 
    { 
        showloading();
        if (typeof name != "undefined") 
        {
            $scope.order_by = name;
            $scope.order_sequence = $scope.order_sequence;
        }
        var paramObj = {start: $scope.start,league_id: $scope.league_id,search_keyword: $scope.search_keyword,limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by};
        $scope.serverApiCall(paramObj, 'get_all_youtube_url',name);

    };
    
    $scope.SetPagingAct = function (text, page) 
    {
        $scope.start = (page - 1) * $scope.limit;
        $scope.get_all_youtube_url();
    };
    
    $scope.updateYouTubeUrl = function(){
        if($("#valid").validationEngine( 'validate' ))
        {
            showloading();
            var PostData = {youtube_url:$scope.youtube_url};
            commonService.commonApiCall(PostData, 'fantasyadmin/adminsetting/update_youtube_url').then(function (response) 
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
    }
    
    $scope.newsInit = function(){
        $scope.limit = 100;
        $scope.newsObj = {};
        $scope.total = 0;
        $scope.start = 0;
        $scope.news = {};
        $scope.newslen =0;
        $scope.active = '';
        $scope.order_sequence = 'ASC';
        $scope.order_by = 'title'; 
    }
    
    $scope.serverApiNewsCall = function(paramObj, url,name)
    {
        commonService.commonApiCall(paramObj, 'fantasyadmin/adminsetting/'+url).then(function (response) 
        {
            hideloading();
            //console.log(response);return false;
            $scope.limit = Number(angular.element('#limit').val());
            $scope.start = response.data.start;
            $scope.news = response.data.news;
            $scope.newslen = response.data.news.length;
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
        }, function (error) {

        });
    }
    
    $scope.get_all_news = function (name, order) 
    { 
        if (typeof name != "undefined") 
        {
            $scope.order_by = name;
            $scope.order_sequence = $scope.order_sequence;
        }
        showloading();
        var paramObj = {start: $scope.start,league_id: $scope.league_id,search_keyword: $scope.search_keyword,limit: angular.element('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by};
        $scope.serverApiNewsCall(paramObj, 'get_all_news',name);

    };
    
    $scope.SetNewsPagingAct = function (text, page) 
    {
        $scope.start = (page - 1) * $scope.limit;
        $scope.get_all_news();
    };
    
    $scope.updateNews = function()
    {
        if($("#valid").validationEngine( 'validate' ))
        {
            showloading();
            var PostData = {news_id:$scope.news.news_id,title:$scope.news.title,description:$scope.news.description,action:'update'};
            commonService.commonApiCall(PostData, 'fantasyadmin/adminsetting/create_news').then(function (response) 
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
                location.href = siteUrl+'fantasyadmin/news';
            });
        }
    }
    
    $scope.create_news = function()
    {
        if($("#valid").validationEngine( 'validate' ))
        {
            showloading();
            var PostData = {title:$scope.title,description:$scope.description,action:'add'};
            commonService.commonApiCall(PostData, 'fantasyadmin/adminsetting/create_news').then(function (response) 
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
                 location.href = siteUrl+'fantasyadmin/news';               
            });
        }
    }
    
    $scope.news = {};
    $scope.editNews  = function()
    {         
        showloading();
        var PostData = {news_id:$routeParams.editId};
        commonService.commonApiCall(PostData, 'fantasyadmin/adminsetting/get_news_by_id').then(function (response) 
        {             
            hideloading();
            $scope.news = response.data; 
        }, function (error) {

        });
    }
    
    $scope.removeNews = function(id)
    {
        jConfirm( DELETE_CONFIRM_NEWS , 'Please Confirmation', function(r) 
        {
            if (r)
            {
                showloading();
                var PostData = {news_id:id};
                commonService.commonApiCall(PostData, 'fantasyadmin/adminsetting/delete_news').then(function (response) 
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
                    location.href = siteUrl+'fantasyadmin/news';
                });
            }
        });
    }
    
    $scope.updateNews = function()
    {        
        var news_id = [];
        $('.news_id:checked').each(function(i)
        {
            news_id[i] = this.value;
        });
        if(news_id.length > 0)
        {
            if($scope.status)
            {
                showloading();
                var PostData = {news_id:news_id,status:$scope.status};
                commonService.commonApiCall(PostData, 'fantasyadmin/adminsetting/update_news_status').then(function (response) 
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
                    location.href = siteUrl+'fantasyadmin/news';               
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
