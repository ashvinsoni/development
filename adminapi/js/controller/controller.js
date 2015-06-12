MdApp.controller('LoginCtrl', ['$scope', 'dataSavingHttp', '$location', function ($scope, dataSavingHttp, $location) {

        $scope.onValidationComplete = function (form, status) {
            if (status) {
                dataSavingHttp({
                    method: "POST",
                    url: "./sudo/login",
                    dataType: "json",
                    data: $scope.user
                }).success(function (response) {
                    if (response.status) {
                        window.location.href = site_url + 'sudo/dashboard';
                    }
                }).error(function (error) {
                    $scope.error = error;
                });
            }
        };
    }]);
MdApp.controller('NotifyCtrl', ['$scope', 'dataSavingHttp', '$location', function ($scope, dataSavingHttp, $location) {
        $scope.notify = {};
        
        $scope.sendNotify = function () {
            var postarr = {'message':$scope.notify.message,'user_ids':''}
                dataSavingHttp({
                    method: "POST",
                    url: "./sudo/send_notification",
                    dataType: "json",
                    data: postarr
                }).success(function (response) {
                    setTimeOut(function(){
                       window.location.href  = window.location.href
                    },1000);
                }).error(function (error) {
                    $scope.error = error;
                });
            
        };
    }]);
MdApp.controller('UserCtrl', ['$scope', 'dataSavingHttp', function ($scope, dataSavingHttp) {
        $scope.limit = 10;
        $scope.total = 0;
        $scope.start = 0;
        $scope.user_data = {};
        $scope.order_sequence = 'ASC';
        $scope.order_by = 'user_name';
        $scope.get_all_user_detail = function (name, order) {
            if (typeof name != "undefined") {
                $scope.order_by = name;
                $scope.order_sequence = order;
            }
            var post_data = {"start": $scope.start, "limit": angular.element('#limit').val(), "filter_name": $scope.filter_name, "order": $scope.order_sequence, "field": $scope.order_by};
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/get_all_user_detail',
                dataType: "json",
                data: post_data
            }).success(function (response) {
                $scope.limit = Number(angular.element('#limit').val());
                $scope.start = response.data.start;
                $scope.user_data = response.data.user_data;
                $scope.total = response.data.total;
                $scope.order_sequence = response.data.order_sequence;
                $scope.order_by = response.data.field_name;
            }).error(function (error) {
                $scope.error = error;
            });
        };
        $scope.get_all_user_detail();

        $scope.SetPagingAct = function (text, page) {
            $scope.start = (page - 1) * $scope.limit;
            $scope.get_all_user_detail();
        };
        $scope.paid_member = function (status,user_id) 
        {
            $scope.message = 0;
            $scope.messagedetail = '';
            var post_data = {"is_paid_member": status,"user_id":user_id};
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/update_membership',
                dataType: "json",
                data: post_data
            }).success(function (response) {                
                if(response.status){
                    $scope.message = 1;
                    $scope.messagedetail = response.Message;
                }else{
                    $scope.message = 2;
                    $scope.messagedetail = response.Message;
                }
                $scope.get_all_user_detail('','');
                
            }).error(function (error) {
                $scope.error = error;
            });
        }
        $scope.notify_message = '';
        $scope.alluser = '';
        $scope.sendNotify = function(){
            var user_ids = [];
            
            
            if($scope.alluser==1){
                user_ids = '';
            }else{
                angular.forEach(angular.element('.user_ids:checked'), function (obj, i) {                
                    user_ids[i] = obj.value;
                });
            }
            var postarr = {'message':$scope.notify_message,'user_ids':user_ids}
                dataSavingHttp({
                    method: "POST",
                    url: "./sudo/send_notification",
                    dataType: "json",
                    data: postarr
                }).success(function (response) {                    
                    if(response.status){
                        $scope.message = 1;
                        $scope.messagedetail = response.Message;
                        setTimeout(function(){
                            window.location.href  = window.location.href
                        },1000);
                        
                    }else{
                        $scope.message = 2;
                        $scope.messagedetail = response.Message;
                    }

                }).error(function (error) {
                    $scope.error = error;
                });
        }
        $scope.hidemsg = function () {
            $('.nNote').fadeOut(1000);
        };
    }]);


MdApp.controller('DraftCtrl', ['$scope', 'dataSavingHttp', function ($scope, dataSavingHttp) {
        $scope.limit = 10;
        $scope.total = 0;
        $scope.start = 0;
        $scope.user_data = {};
        $scope.order_sequence = 'ASC';
        $scope.order_by = 'user_name';
        $scope.get_all_draft_detail = function (name, order) {
            if (typeof name != "undefined") {
                $scope.order_by = name;
                $scope.order_sequence = order;
            }
            var post_data = {"start": $scope.start, "limit": angular.element('#limit').val(), "filter_name": $scope.filter_name};
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/get_all_draft_detail',
                dataType: "json",
                data: post_data
            }).success(function (response) {
                $scope.limit = Number(angular.element('#limit').val());
                $scope.start = response.data.start;
                $scope.draft_data = response.data.draft_data;
                $scope.total = response.data.total;
            }).error(function (error) {
                $scope.error = error;
            });
        };
        $scope.get_all_draft_detail();

        $scope.SetPagingAct = function (text, page) {
            $scope.start = (page - 1) * $scope.limit;
            $scope.get_all_draft_detail();
        };        
        $scope.hidemsg = function () {
            $('.nNote').fadeOut(1000);
        };
}]);

MdApp.controller('RosterCtrl', ['$scope', 'dataSavingHttp', function ($scope, dataSavingHttp) {

        $scope.limit = 10;
        $scope.total = 0;
        $scope.start = 0;
        $scope.roster = {};
        $scope.active = '';
        $scope.order_sequence = 'ASC';
        $scope.order_by = 'full_name';
        $scope.get_all_roster = function (name, order) {
            $scope.search = angular.element('#filter_name').val();
            $scope.filter = angular.element('#filterposition').val();
            if (typeof name != "undefined") {
                $scope.order_by = name;
                $scope.order_sequence = order;
            }
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/get_all_roster',
                dataType: "json",
                data: {start: $scope.start, limit: angular.element('#limit').val(), filter_name: $scope.search, filterposition: $scope.filter, "order": $scope.order_sequence, "field": $scope.order_by}
            }).success(function (response) {
                $scope.limit = Number(angular.element('#limit').val());
                $scope.start = response.data.start;
                $scope.roster = response.data.roster;
                $scope.total = response.data.total;
                $scope.order_sequence = response.data.order_sequence;
                $scope.order_by = response.data.field_name;
            }).error(function (error) {
                $scope.error = error;
            });
        };


        $scope.get_all_roster();

        $scope.UpdateRoster = function () {
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/update_roster',
                dataType: "json",
                data: angular.element('form[name="roster"]').serialize(),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (response) {
                $scope.ChangeRoster();
            }).error(function (error) {
                $scope.error = error;
            });
        };

        $scope.ChangeRoster = function () {
            var img = (angular.element('#active').val() == '1') ? '1' : '0';
            var temp = [];

            angular.forEach(angular.element('input[name="player_unique_id[]"]:checked'), function (v, k) {
                var PUI = v.value;
                temp[PUI] = img;
            });

            angular.forEach($scope.roster, function (v, k) {
                var PUI = v.player_unique_id;
                if (temp[PUI] != undefined)
                    $scope.roster[k].active = temp[PUI];
            });

            setTimeout(function () {
                angular.element('#active').val('').trigger('change');
                angular.element('input[name="player_unique_id[]"]').attr('checked', false).parent('span').removeClass('checked');
                angular.element('#all').attr('checked', false).parent('span').removeClass('checked');
            }, 100);
        };

        $scope.SetPagingAct = function (text, page) {
            $scope.start = (page - 1) * $scope.limit;
            $scope.get_all_roster();
        };


        $scope.changeSuspension = function (id) {
            //alert(angular.element('#suspension_'+id).val());
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/update_roster_suspension',
                dataType: "json",
                data: {player_id: id, suspension: angular.element('#suspension_' + id).val()}

            }).success(function (response) {

            }).error(function (error) {

            });

        };

        $scope.changestock = function (id) {

            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/update_roster_stock',
                dataType: "json",
                data: {player_id: id, stock: angular.element('#stock_' + id).val()}
            }).success(function (response) {

            }).error(function (error) {

            });
        };

        $scope.get_all_position = function () {

            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/get_all_position',
                dataType: "json",
                data: {}
            }).success(function (response) {
                $scope.position = response.data.position;
            }).error(function (error) {
                $scope.error = error;
            });
        };

        $scope.get_all_position();

    }]);

MdApp.controller('ByeweekCtrl', ['$scope', 'dataSavingHttp', function ($scope, dataSavingHttp) {

        $scope.team_data = {};
        $scope.byeweek = {};
        $scope.get_all_team_detail = function () {
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/get_all_team_detail',
                dataType: "json"
            }).success(function (response) {
                $scope.team_data = response.data.team_data;

            }).error(function (error) {
                $scope.error = error;
            });
        };
        $scope.get_all_team_detail();
         $scope.message = 0;
         $scope.messagedetail = '';
        $scope.UpdateTeamByeweek = function () {
            var postdata = {team_detail:$scope.byeweek}
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/update_team_byeweek',
                dataType: "json",
                data : postdata
            }).success(function (response) {
                if(response.status){
                    $scope.message = 1;
                    $scope.messagedetail = response.Message;
                    
                    $( 'html, body').animate({
                          scrollTop: $('body').offset().top
                        }, 1000);                        
                }
            }).error(function (error) {
                $scope.error = error;
            });
        };   
        $scope.hidemsg = function () {
            $('.nNote').fadeOut(1000);
        };
    }]);
MdApp.controller('AddPlayerRankCtrl', ['$scope', 'dataSavingHttp', function ($scope, dataSavingHttp) {
        $scope.players = {};
        
        
        $scope.get_all_players = function (name, order) {
            $scope.search = angular.element('#filter_name').val();
            $scope.filter = angular.element('#filterposition').val();
            if (typeof name != "undefined") {
                $scope.order_by = name;
                $scope.order_sequence = order;
            }
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/get_all_players',
                dataType: "json",
                data: {start: '', limit: '', filter_name: $scope.search, filterposition: $scope.filter, "order": $scope.order_sequence, "field": $scope.order_by}
            }).success(function (response) {
                $scope.limit ='';
                $scope.start = response.data.start;
                $scope.roster = response.data.roster;
                $scope.total = response.data.total;
                $scope.order_sequence = response.data.order_sequence;
                $scope.order_by = response.data.field_name;
                //
            }).error(function (error) {
                $scope.error = error;
            });
        };
        $scope.get_all_players();
        $scope.message = 0;
        $scope.messagedetail = "";
        $scope.update_player_ranking = function () {
            
           $('.players').each(function(i, obj) {
              $scope.players[i+1] = obj.value;              
            });
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/update_player_ranking',
                dataType: "json",
                data: {"players_rank":$scope.players}
            }).success(function (response) {
                if(response.status){
                    $scope.message = 1;
                    $scope.messagedetail = response.Message;
                }else{
                    $scope.message = 2;
                    $scope.messagedetail = response.Message;
                }
                $scope.get_all_players();
            }).error(function (error) {
                $scope.error = error;
            });
        }
        $scope.hidemsg = function () {
            $('.nNote').fadeOut(1000);
        };
        
}]);
MdApp.controller('SettingCtrl', ['$scope', 'dataSavingHttp', function ($scope, dataSavingHttp) {
        $scope.update_setting = function () {
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/setting',
                dataType: "json",
                data: angular.element('#setting').serialize(),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (response) {
                angular.element('#current_date').val(angular.element('#date').val());
            }).error(function (error) {
                $scope.error = error;
            });
        };
    }]);
MdApp.controller('AddPlayerCtrl', ['$scope', 'dataSavingHttp', function ($scope, dataSavingHttp) {
        $scope.getLeague = function(){
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/get_all_league',
                dataType: "json",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (response) {
                $scope.leagues = response.data.league;
            }).error(function (error) {
                $scope.error = error;
            }); 
        };
        $scope.getLeague();
        $scope.getTeamAndPosition = function(){
            var league_id = $scope.roster.league;    
            var postData = {league:league_id};
            dataSavingHttp({
                method: "POST",
                url: site_url + 'sudo/get_all_team_and_position',
                dataType: "json",
                data: postData
            }).success(function (response) {
                $scope.teams = response.data.teams;
                $scope.positions = response.data.positions;
            }).error(function (error) {
                $scope.error = error;
            });
        };
        
        $scope.addPlayer = function(){
           postData = {players:$scope.roster}
          if($("#valid").validationEngine('validate')){
                dataSavingHttp({
                    method: "POST",
                    url: site_url + 'sudo/add_player',
                    dataType: "json",
                    data: postData
                }).success(function (response) {
                    if(response.status){
                        $scope.message = 1;
                        $scope.messagedetail = response.Message;                    
                        $( 'html, body').animate({
                              scrollTop: $('body').offset().top
                            }, 1000); 
                        $
                        setTimeout(function () {
                            window.location.href = window.location.href;
                        }, 2000);
                    }else{
                        $scope.message = 2;
                        $scope.messagedetail = response.Message;                    
                        $( 'html, body').animate({
                              scrollTop: $('body').offset().top
                            }, 1000); 
                        setTimeout(function () {
                            window.location.href = window.location.href;
                        }, 2000);
                    }
                });
            }
        };
        $scope.hidemsg = function () {
            $('.nNote').fadeOut(1000);
        };
    }]);