MdApp.controller('UserCtrl', ['$scope', 'dataSavingHttp', function ($scope, dataSavingHttp) {
        $scope.limit = 100;
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

        // update user status
        $scope.update_batch_status_of_user = function()
        {
            var total_checked = $( '.user_id:checked' ).length;
            if ( total_checked == 0 )
            {
                jAlert( 'Please select user.' );
                return false;
            }
            if( ! $( '#status' ).val() )
            {
                jAlert( 'Please select status.' );
                return false;
            }
            $scope.update_user_status( $( '#user_list' ).serialize() );
        }

        $scope.update_user_status = function( user_data )
        {
            $.ajax({
                url         : site_url+'admin/update_user_status',
                type        : 'POST',
                dataType    : 'json',
                async       : true,
                data        : user_data,
                success     : function( response )
                {
                    $scope.rosterObj[ 'status_1' ] = "images/active.png";
                    $scope.rosterObj[ 'status_0' ] = "images/deactivate.png";
                    if ( response.response != 0 )
                    {
                        if ( typeof user_data === "string" )
                        {
                            var status = $( '#status' ).val();
                            $.each( $( '.user_id:checked' ) , function( key , obj ){
                                var s = 1;
                                if ( status == 1 ) s = 0;
                                $( '.status_'+$(obj).val() ).attr( 'src' , $scope.rosterObj['status_'+status] );
                                $( '[data-ui='+$(obj).val()+']' ).data( 'status' , s );
                            });
                        }
                        else
                        {
                            var ui     = user_data.ui;
                            var status = user_data.status;                            
                            $.each( ui , function( key , value )
                            {
                                var s = 1;
                                if ( status == 1 ) s = 0;
                                $( '.status_'+value ).attr( 'src' , $scope.rosterObj['status_'+status] );
                                $( '[data-ui='+value+']' ).data( 'status' , s );
                            });
                        }
                    }                
                }
            });
        }

        $scope.get_all_user_detail = function (name, order) {            
            if (typeof name != "undefined") 
            {
                $scope.order_by = name;                
            }
            var post_data = {"start": $scope.start, "limit": angular.element('#limit').val(), "filter_name": $scope.filter_name, 
            "order": $scope.order_sequence, "field": $scope.order_by};
            dataSavingHttp({
                method: "POST",
                url: site_url + 'admin/get_all_user_detail',
                dataType: "json",
                data: post_data
            }).success(function (response) 
            {
                $scope.limit = Number(angular.element('#limit').val());
                $scope.start = response.data.start;
                $scope.user_data = response.data.user_data;            
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

            }).error(function (error) {
                $scope.error = error;
            });
        };


    }]);

MdApp.controller('RosterCtrl', ['$scope', 'dataSavingHttp', function ($scope, dataSavingHttp) {        
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
            dataSavingHttp({
                method: "POST",
                url: site_url + 'admin/'+url,
                dataType: "json",
                data: paramObj
            }).success(function (response) 
            {                
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
            }).error(function (error) {
                $scope.error = error;
            });
        }


        setTimeout(function(){
            var league_id_default = document.getElementById("league_id").options[1].value;            
            // $("#league_id").val(league_id_default ).change();
            $("#league_id").val( '' ).change();
        },2000);
        $scope.get_all_roster = function (name, order) 
        {            
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

        ///
        $scope.get_roster_position_team_by_league = function () 
        {
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

        

        // $scope.get_all_roster();

        $scope.SetPagingAct = function (text, page) 
        {
            $scope.start = (page - 1) * $scope.limit;
            $scope.get_all_roster();
        };
       
               
        $scope.leagueList = leagueList;
        
        $scope.SerializeRosterListForm = function()
        {
            // var serializeData = $( '#roster_list' ).serialize();
            var serializeData = "league_id="+$scope.league_id;
            if($('.player_unique_id:checked').is(":checked")) {

                $.each( $( '.player_unique_id:checked' ) , function()
                {
                    var player_unique_id = $(this).val();
                    var injury_name = 'injury_status_'+player_unique_id;
                    var injury = $( '[name="'+injury_name+'"]').val();  
                    var salary_name = 'salary_'+player_unique_id;
                    var salary = $( '[name="'+salary_name+'"]' ).val();
                    salary = (salary == undefined) ? 0 : salary;
                    serializeData += '&'+salary_name+'='+salary+'&'+injury_name+'='+injury+'&player_unique_id[]='+player_unique_id;
                })
            }            
            return serializeData;
        }

        $scope.UpdateRosterStatus = function()
        {
            var status = $( '#status' ).val();
            $scope.rosterObj[ 'status_1' ] = "images/active.png";
            $scope.rosterObj[ 'status_0' ] = "images/deactivate.png";
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

            $.ajax({
                url         : site_url+'admin/update_temp_roster',
                type        : 'POST',
                dataType    : 'json',
                async       : true,
                data        : $scope.SerializeRosterListForm(),
                success     : function( response )
                {
                    $scope.UpdateRosterStatus();
                }
            });
        },

        $scope.ReleasePlayer = function ()
        {
            jConfirm( 'Are you sure you want to release player?' , 'Please confirm' , function( r )
            {
                if ( r == true )
                {
                    showloading();
                    var serializeObj = $scope.SerializeRosterListForm();                     
                    $.ajax({
                        url         : site_url+'admin/release_player',
                        type        : 'POST',
                        async       : true,
                        data        : serializeObj,
                        success     : function( response )
                        {
                            
                            hideloading();
                            if ( $.trim( response ) == '1' )
                            {
                                //jAlert( 'Player Information Released Successfully.' );
                                location.reload();
                            }
                            else
                            {
                                jAlert( 'There was some error releasing player. You have to activate some player first.' );
                            }
                            $scope.UpdateRosterStatus();
                        },
                        complete : function ()
                        {
                            hideloading();
                        }
                    });
                }
            });
        }
    }]);
