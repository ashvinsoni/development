MdApp.controller('RosterCtrl', function ($scope, commonService, $location) {
    $scope.message = 0;
    $scope.messagedetail = '';
    $scope.limit = 100;
    $scope.rosterObj = {};
    $scope.total = 0;
    $scope.start = 0;
    $scope.roster = {};
    $scope.rosterlen =0;
    $scope.active = '';
    $scope.order_sequence = 'ASC';
    $scope.order_by = 'full_name';  
    $scope.serverApiCall = function(paramObj, url)
    {
        commonService.commonApiCall(paramObj, 'fantasyadmin/adminroster/'+url).then(function (response) 
        {
            hideloading();
            if (paramObj.league_changed != undefined) 
            {
                $scope.team = response.data.team;
                $scope.position = response.data.position;    
            }
            $scope.limit = Number(angular.element('#limit').val());
            $scope.start = response.data.start;
            $scope.roster = response.data.roster;
            $scope.rosterlen = response.data.roster.length;
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
    $scope.get_all_sports = function(){
        var PostData = {};
        commonService.commonApiCall(PostData, 'fantasyadmin/adminroster/get_all_sports').then(function (response) {
            $scope.leagueList = response.data;
        }, function (error) {

        });
    }
    $scope.get_all_sports();
    setTimeout(function(){
            var league_id_default = document.getElementById("league_id").options[1].value;            
            // $("#league_id").val(league_id_default ).change();
            $("#league_id").val( '' ).change();
        },2000);
    $scope.get_roster_position_team_by_league = function () 
    {
        showloading();
        $scope.limit = 100;
        $scope.rosterObj = {};
        $scope.total = 0;
        $scope.start = 0;
        $scope.roster = {};
        $scope.active = '';
        $scope.order_sequence = 'ASC';
        $scope.order_by = 'full_name';

         var paramObj = {
                        start: $scope.start,
                        league_id: $scope.league_id,
                        search_keyword: $scope.search_keyword,
                        team_abbreviation: $scope.team_abbreviation, 
                        limit: angular.element('#limit').val(), 
                        filter_name: $scope.search, 
                        league_changed: "1", 
                        filterposition: $scope.filter, 
                        "order": $scope.order_sequence, 
                        "field": $scope.order_by
                    };
        $scope.serverApiCall(paramObj, 'get_all_roster');

    }
    $scope.get_all_roster = function (name, order) 
    {            
        showloading();
        $scope.filter = $scope.filterposition;                              

        if (typeof name != "undefined") 
        {
            $scope.order_by = name;
            $scope.order_sequence = $scope.order_sequence;
        }
        var paramObj = {start: $scope.start,league_id: $scope.league_id,search_keyword: $scope.search_keyword,
        team_abbreviation: $scope.team_abbreviation, limit: angular.element('#limit').val(), 
        filter_name: $scope.search, filterposition: $scope.filter, "order": $scope.order_sequence, "field": $scope.order_by};
        $scope.serverApiCall(paramObj, 'get_all_roster');

    };
    
    $scope.SetPagingAct = function (text, page) 
        {
            $scope.start = (page - 1) * $scope.limit;
            $scope.get_all_roster();
        };
     
        
        $scope.SerializeRosterListForm = function()
        {
            var serializeData = $( '#roster_list' ).serialize();
            var serializeData = {league_id:$scope.league_id}
            var ser_data = {};
            var player_id = {};
            if($('.player_unique_id:checked').is(":checked")) {

                $.each( $( '.player_unique_id:checked' ) , function(i)
                {
                    var player_unique_id = $(this).val();
                    var injury_name = 'injury_status_'+player_unique_id;
                    var injury = $( '[name="'+injury_name+'"]').val();  
                    var salary_name = 'salary_'+player_unique_id;
                    var salary = $( '[name="'+salary_name+'"]' ).val();
                    salary = (salary == undefined) ? 0 : salary;
                    ser_data[salary_name] = salary;
                    ser_data[injury_name] = injury;
                    player_id[i] = player_unique_id;
                })
                ser_data['player_unique_id'] = player_id;
                ser_data['league_id'] = $scope.league_id;
                ser_data['status'] = $scope.status;
            }              
            return ser_data;
        }

        $scope.UpdateRosterStatus = function()
        {
            var status = $( '#status' ).val();
            $scope.rosterObj[ 'status_1' ] = siteUrl+"adminapi/images/active.png";
            $scope.rosterObj[ 'status_0' ] = siteUrl+"adminapi/images/deactivate.png";
            $.each( $( '.player_unique_id:checked' ) , function( )
            {
                var player_unique_id = $( this ).val();
                $( '.status_'+player_unique_id  ).attr( 'src' , $scope.rosterObj[ 'status_'+status ] );
            });
            hideloading();
        }

        $scope.UpdateRoster = function()
        {
            showloading();
            var total_checked = $( '.player_unique_id:checked').length;
            if ( total_checked == 0 )
            {
                hideloading();
                jAlert( 'Please select player.' );
                return false;
            }
            var PostData = $scope.SerializeRosterListForm();
            
            commonService.commonApiCall(PostData, 'fantasyadmin/adminroster/update_temp_roster').then(function (response) {
                $scope.UpdateRosterStatus();
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
        },

        $scope.ReleasePlayer = function ()
        {
            jConfirm( 'Are you sure you want to release player?' , 'Please confirm' , function( r )
            {
                if ( r == true )
                {
                    showloading();
                    var PostData = $scope.SerializeRosterListForm();            
                    commonService.commonApiCall(PostData, 'fantasyadmin/adminroster/release_player').then(function (response) {
                        hideloading();
                        if(response.status){
                            $scope.message = 1;
                            $scope.messagedetail = response.message;
                        }else{
                            $scope.message = 2;
                            $scope.messagedetail = 'There was some error releasing player. You have to activate some player first.';
                        }     
                        $( 'html, body').animate({
                            scrollTop: $('body').offset().top
                          }, 1000); 
                        location.reload();
                        $scope.UpdateRosterStatus();
                    }, function (error) {

                    });   
                }
            });
        }
});
