MdApp.controller('AdminGameCtrl', ['$scope', 'commonService', '$location', '$compile', function ($scope, commonService, $location, $compile) {
        $scope.game_name = '';
        $scope.get_all_sports = function () {
            var PostData = {};
            commonService.commonApiCall(PostData, 'fantasyadmin/adminroster/get_all_sports').then(function (response) {
                $scope.leagueList = response.data;
            }, function (error) {

            });
        }
        $scope.message = 0;
        $scope.messagedetail = '';
        $scope.get_all_sports();
        $scope.limit = 10;
        $scope.gameObj = {};
        $scope.total = 0;
        $scope.start = 0;
        $scope.game_list = {};
        $scope.gamelen = 0;
        $scope.active = '';
        $scope.active = 'current_game';
        $scope.order_sequence = 'DESC';
        $scope.order_by = 'game_id';
        
        $scope.league_id = '';
        $scope.league_duration_id = '';
        $scope.league_drafting_styles_id = '';
        $scope.league_salary_cap_id = '';
        $scope.league_label = '';
        $scope.league_duration_label = '';
        $scope.league_drafting_styles_label = '';
        $scope.league_salary_cap_label = '';
        $scope.buckets_status = false;
        $scope.league_drafting_styles = {};
        $scope.daily_label = {'1': 'All', '2': 'Early', '3': 'Late'};
        $scope.duration_id = {};
        $scope.league_number_of_winner_id = '';
        $scope.sizes = '';
        $scope.entry_fees = '';
        $scope.admin_lower_limit = '';
        $scope.admin_upper_limit = '';
        $scope.entry_fee_upper_limit = '';
        $scope.entry_fee_lower_limit = '';
        $scope.data_desc = '';
        $scope.admin_fixed = '';

        $scope.serverApiCall = function (paramObj, url, name)
        {
            commonService.commonApiCall(paramObj, 'fantasyadmin/admingame/' + url).then(function (response)
            {
                hideloading();
                //console.log(response);return false;
                $scope.limit = Number(angular.element('#limit').val());
                $scope.start = response.data.start;
                $scope.game_list = response.data.gamelist;
                $scope.game_listlen = response.data.gamelist;
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

        $scope.get_all_games = function (name, order)
        {
            if (typeof name != "undefined")
            {
                $scope.order_by = name;
                $scope.order_sequence = $scope.order_sequence;
            }
            var PostData = {list_for: $scope.list_for, start: $scope.start, league_id: $scope.league_id, limit: $('#limit').val(), "order": $scope.order_sequence, "field": $scope.order_by, is_total: false};
            showloading();
            $scope.serverApiCall(PostData, 'get_all_games', name);

        };
        $scope.SetPagingAct = function (text, page)
        {
            $scope.start = (page - 1) * $scope.limit;
            $scope.is_total = true;
            $scope.get_all_games();
        };


        /*----------------------------------------------------------New Game--------------------------------------------*/
        $scope.InitializeDuration = function () {
            var PostData = {league_id: $scope.league_id}
            commonService.commonApiCall(PostData, 'fantasyadmin/admingame/get_all_game_data').then(function (response) {
                if (response != '') {
                    $scope.league_duration = response.data.all_duration;
                    $scope.seasons_dates = response.data.seasons_dates;
                    $scope.all_available_week = response.data.all_available_week;
                    $scope.master_data_entry = response.data.master_data_entry;
                    $scope.number_of_winner_validation = response.data.number_of_winner_validation;
                    $scope.size_list = response.data.size_list;
                    $scope.fee_list = response.data.fee_list;
                    $scope.salary_cap = response.data.all_salary_cap;
                    $scope.number_of_winner = response.data.all_number_of_winner;
                    $scope.InitializeGameField();
                    $.each(response.data.all_duration, function (key, value) {
                        $scope.duration_id[ value.league_duration_id ] = value.duration_id;
                    });
                    $scope.CreateGameName();
                }
            }, function (error) {

            });
        }

        $scope.weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.year = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];





        $scope.GetAvailableGameOfTheDayOrWeek = function ()
        {
            var duration_id = $('#duration_id').val();
            if (duration_id == '')
            {
                return false;
            }
            else if (duration_id == 1)
            {
                if (!$scope.date || !$scope.buckets)
                    return false;
            }
            else if (duration_id == 2)
            {
                if (!$scope.season_week_id)
                    return false;
            }
            else if (duration_id == 3)
            {
                if (!$scope.season_week_id)
                    return false;
            }
            $scope.buckets_status = false;
            $scope.buckets = angular.element("#buckets").find(":selected").val();
            var PostData = {season_week_id: $scope.season_week_id, league_id: $scope.league_id, buckets: $scope.buckets, date: $scope.date, duration_id: duration_id, league_duration_id: $scope.league_duration_id};
//        var PostData = $( '.new_game' ).serialize();
            commonService.commonApiCall(PostData, 'fantasyadmin/admingame/get_available_game_of_the_day_or_week').then(function (response) {

                var result = response.result;
                var list = response.game_list;
                $scope.list = response.game_list;

                $scope.buckets_status = result;
                $scope.isDisableGameList = false;
                //console.log(newgameobj.buckets_status);

                $scope.league_label = angular.element('#league_id').find(":selected").text();

                angular.element('#total_game').empty().append('Includes ' + list.length + ' ' + $scope.league_label + ' game(s)').show();

                angular.element('#game_list').show();

                angular.element('.game_list').empty();

                if (duration_id == 1 && list.length > 0)
                {
                    angular.element('#total_game').empty().append('Includes ' + list.length + ' ' + $scope.league_label + ' game(s)').show();
                    angular.element('.select_all_daily').show();
                }
                else
                {
                    angular.element('.select_all_daily').hide();
                }

                if (duration_id == 2)
                {
                    angular.element('#total_game_week').empty().append('Includes ' + list.length + ' ' + $scope.league_label + ' game(s)').show();
                    angular.element('.select_all_daily').hide();
                }


                // selected team array

                var i = 0;
                var game_selected = [];

                angular.element('input[name^="gamelist"]').each(function () {
                    game_selected[i] = $(this).val();
                    i++;
                });

                if (duration_id == 1)
                {
                    $.each(list, function (key, value) {
                        var gameName = value.away + 'vs' + value.home;
                        var gameDate = value.season_scheduled_date + '(' + value.day_name + ')';
                        if ($.inArray(value.season_game_unique_id, game_selected) != -1)
                        {
                            var addDisableClass = ($scope.isDisableGameList == true) ? 'sel-inactive' : '';
                            angular.element('.game_list').append($compile('<div class="show_week_list"><input type="checkbox" checked value=' + value.season_game_unique_id + ' class="checkbox_sel" ng-click=\'list_of_game ("' + value.season_game_unique_id + '","' + gameName + '","' + gameDate + '")\' id="my_' + value.season_game_unique_id + '" ><span class="mtch_name">' + value.home + '@' + value.away + ' ' + value.season_scheduled_date + ' (' + value.day_name + ') </span></input></div>')($scope));
                        } else
                        {
                            var addDisableClass = ($scope.isDisableGameList == true) ? 'sel-inactive' : '';
                            angular.element('.game_list').append($compile('<div class="show_week_list"><input type="checkbox"  value=' + value.season_game_unique_id + ' class="checkbox_sel" ng-click=\'list_of_game ("' + value.season_game_unique_id + '","' + gameName + '","' + gameDate + '")\' id="my_' + value.season_game_unique_id + '" ><span class="mtch_name">' + value.home + '@' + value.away + ' ' + value.season_scheduled_date + ' (' + value.day_name + ') </span></input></div>')($scope));
                        }
                    });
                }
                else if (duration_id == 2)
                {
                    $.each(list, function (key, value) {
                        var gameName = value.away + 'vs' + value.home;
                        var gameDate = value.season_scheduled_date + '(' + value.day_name + ')';
                        if ($.inArray(value.season_game_unique_id, game_selected) != -1)
                        {
                            angular.element('.insert_weekly_games').append($compile('<div class="show_week_list"><input type="checkbox" checked value=' + value.season_game_unique_id + ' class="checkbox_sel" ng-click=\'list_of_game ("' + value.season_game_unique_id + '","' + gameName + '","' + gameDate + '")\' id="my_' + value.season_game_unique_id + '" ><span class="mtch_name">' + value.home + '@' + value.away + ' ' + value.season_scheduled_date + ' (' + value.day_name + ') </span></input></div>')($scope));
                        } else
                        {
                            angular.element('.insert_weekly_games').append($compile('<div class="show_week_list"><input type="checkbox"  value=' + value.season_game_unique_id + ' class="checkbox_sel"  ng-click=\'list_of_game ("' + value.season_game_unique_id + '","' + gameName + '","' + gameDate + '")\' id="my_' + value.season_game_unique_id + '" ><span class="mtch_name">' + value.home + '@' + value.away + ' ' + value.season_scheduled_date + ' (' + value.day_name + ') </span></input></div>')($scope));
                        }
                    });
                }

            }, function (error) {

            });
        }
        
        //$scope.insert_weekly_games = {};
        $scope.CreateGameName = function (val)
        {

            $scope.league_label = angular.element("#league_id").find(":selected").text();

            $scope.league_duration_label = angular.element("#league_duration_id").find(":selected").text();

            $scope.league_drafting_styles_label = angular.element("#league_drafting_styles_id").find(":selected").text();

            $scope.season_week_id_label = angular.element("#season_week_id").find(":selected").text();

            $scope.league_salary_cap_label = angular.element("#league_salary_cap_id").find(":selected").text();


            $scope.date = $('#date').val();
            $scope.date_label = '';


            if ($scope.league_id == '')
            {
                $scope.league_label = '';
            }

            if ($scope.league_duration_id == '')
            {
                $scope.league_duration_label = '';
            }

            if ($scope.league_drafting_styles_id == '')
            {
                $scope.league_drafting_styles_label = '';
            }

            if ($scope.league_salary_cap_id == '')
            {
                $scope.league_salary_cap_label = '';
            }
            else
            {
                //$scope.league_salary_cap_label = $scope.league_salary_cap_label.replace( /0+/ ,'' ) + '0k';
            }



            $scope.game_name = $scope.league_label + ' ' + $scope.league_duration_label + ' ' + $scope.league_drafting_styles_label + ' ' + $scope.league_salary_cap_label + ' ' + $scope.date_label;
            /*angular.element( '#game_name' ).val( '' );
             angular.element( '#game_name' ).val( $.trim( $scope.game_name ) );
             angular.element( '#game_name_label' ).empty().html( $.trim( $scope.game_name ) );*/
            $scope.game_name = $scope.myTrim($scope.game_name);
        }
        $scope.myTrim = function (x) {
            return x.replace(/^\s+|\s+$/gm, ' ');
        }


        $scope.selectAll = function ()
        {


            angular.forEach($scope.list, function (value, key) {

                var season_id = value.season_game_unique_id;
                var gameName = value.away + 'vs' + value.home;
                var gameDate = value.season_scheduled_date;
                //$('#my_'+season_id).prop('checked',true);
                $('#my_' + season_id).removeClass('active');
                $('#season_' + season_id).remove();


                if ($('#selectall_daily').prop('checked') == true)
                {

                    $('#my_' + season_id).addClass('active');
                    $('.insert_games').append('<span class="selected_games" id=season_' + season_id + '><input type="hidden" value=' + season_id + ' name="gamelist[]"/><span>' + gameName + '' + gameDate + '</span><span class="close remove_game" onclick="$(\'#season_' + season_id + '\').remove();$(\'#my_' + season_id + '\').removeClass(\'active\');$(\'#my_' + season_id + '\').attr(\'checked\',false)">x</span></span>');
                }

                if ($('#selectall').prop('checked') == true)
                {
                    $('#my_' + season_id).addClass('active');
                    $('.insert_games').append('<span class="selected_games" id=season_' + season_id + '><input type="hidden" value=' + season_id + ' name="gamelist[]"/><span>' + gameName + '' + gameDate + '</span><span class="close remove_game" onclick="$(\'#season_' + season_id + '\').remove();$(\'#my_' + season_id + '\').removeClass(\'active\');$(\'#my_' + season_id + '\').attr(\'checked\',false)">x</span></span>');
                }

                //$(ths).prop('checked');

            });
            if ($('#selectall').prop('checked') == true)
            {
                setTimeout(function () {
                    $('.block').addClass('active');
                }, '300');
            }

            /*$('.block').each(function() { //loop through each checkbox
             // $('.block').addClass('active');            
             
             });*/

        }

        $scope.list_of_game = function (season_id, game_name, game_date)
        {
            //$('#my_'+season_id).addClass('active');
            if ($('#my_' + season_id).hasClass('sel-inactive'))
            {
                return false;
            }
            if ($('#my_' + season_id).hasClass('active'))
            {

                $('#my_' + season_id).removeClass('active');
                $('#season_' + season_id).remove();
            }
            else
            {

                $('#my_' + season_id).addClass('active');
                $('.insert_games').append('<aside id=season_' + season_id + '><span class="selected_games"><input type="hidden" value=' + season_id + ' name="gamelist[]"/><a class="close remove_game" onclick="$(\'#season_' + season_id + '\').remove();$(\'#my_' + season_id + '\').removeClass(\'active\');$(\'#my_' + season_id + '\').attr(\'checked\',false)"><i class="icon-close"></i></a><span>' + game_name + '' + game_date + '</span></span>');
            }
            //Used to uncheck the selectall checkbox if no games are selected.

            if ($('.selected_games').length == '0')
            {
                $('#uniform-selectall span').removeClass('checked');
                $('#uniform-selectall_daily span').removeClass('checked');
            }



        }

        $scope.getPos = function (pos)
        {
            var deci = pos % 100;
            if (deci > 10 && deci < 20)
                return pos + "th";
            switch (pos % 20)
            {
                case 1:
                    return pos + "st";
                case 2:
                    return pos + "nd";
                case 3:
                    return pos + "rd";
                default:
                    return pos + "th";
            }
        }

        $scope.ShowWeekDates = function ()
        {
            $scope.buckets_status = false;
            angular.element('.total_game').hide();

            angular.element('.select_all_week ').hide();

            $scope.CreateGameName();
            var temp_duration_id = $scope.duration_id[ $scope.league_duration_id ];

            angular.element('#duration_id').val(temp_duration_id);
            duration_id = angular.element('#duration_id').val();

            if ($scope.league_duration_id == '' || duration_id == '')
            {
                angular.element('.insert_games').html('');
                $scope.season_week_id = {};
                $scope.buckets = {};
                angular.element('.weekly , .daily').hide();
                angular.element('#date , #buckets').val('');
            }
            else
            {
                $scope.GetAllDraftingStyle($scope.league_duration_id);

                angular.element(".timeformError , .dateformError , .weekformError").remove()
                if (duration_id == 1) //Daily
                {
                    angular.element('.weekly').hide();
                    angular.element('.daily').show();
                    $scope.date = '';
                    $scope.buckets = '';
                    angular.element('.insert_games').html('');

                    $scope.season_week_id = '';
                    $scope.InitializeDates();
                }

                else if (duration_id == 2) //Weekly
                {
                    angular.element('.weekly').show();
                    angular.element('.daily').hide();
                    angular.element('.insert_games').html('');
                    $scope.buckets = {};
                    $scope.GetAllAvailableWeek();
                } else
                {
                    $('.weekly').hide();
                    $('.daily').hide();
                }
            }
            $scope.$watch('season_week_id', function (newValue) {
                $scope.buckets_status = false;
                $('.insert_weekly_games').html('');
                $('.insert_games').html('');
                $('.total_game').hide();
                $('#uniform-selectall_daily span').removeClass('checked');
                $scope.GetAvailableGameOfTheDayOrWeek();
            });
            angular.element('#buckets').change(function (argument)
            {
                $scope.buckets_status = false;
                $('.insert_weekly_games').html('');
                $('.insert_games').html('');
                $('.total_game').hide();
                $('#uniform-selectall_daily span').removeClass('checked');
                $scope.GetAvailableGameOfTheDayOrWeek();
            });
        }



        $scope.GetAllDraftingStyle = function (league_duration_id)
        {
            if (league_duration_id == 1)
            {
                angular.element('.select_all_daily').show();
            }
            else
            {
                angular.element('.select_all_daily').hide();
            }
            var PostData = {league_duration_id: league_duration_id};
            commonService.commonApiCall(PostData, 'fantasyadmin/admingame/get_all_drafting_style').then(function (response) {
                $scope.league_drafting_styles = response;
            }, function (error) {

            });
        }

        $scope.InitializeDates = function ()
        {
            $("#date").datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: "yy-mm-dd",
                minDate: mindate,
                beforeShowDay: $scope.available,
                onSelect: function (selectedDate)
                {
                    $scope.buckets_status = false;
                    $('.total_game').hide();
                    $('.dateformError').hide().remove();
                    $scope.buckets = $scope.daily_label;
                    $scope.CreateGameName();
                    $('#selectall_daily').parent().removeClass('checked');
                    $('.insert_games').html('');
                    $scope.GetAvailableGameOfTheDayOrWeek();
                }
            });
        }

        $scope.available = function (date)
        {
            var Y = date.getFullYear();
            var M = (date.getMonth() + 1);
            var D = date.getDate();

            if (M < 10)
            {
                M = '0' + M;
            }

            if (D < 10)
            {
                D = '0' + D;
            }

            dmy = Y + "-" + M + "-" + D;

            if ($.inArray(dmy, $scope.seasons_dates) != -1)
            {
                return [true, "", "Available"];
            }
            else
            {
                return [false, "", "No Game"];
            }
        }

        $scope.GetAllAvailableWeek = function ()
        {
            $scope.available_week = $scope.all_available_week;
        }
        $scope.InitializeSizeList = function ()
        {

            var PostData = {};
            commonService.commonApiCall(PostData, 'fantasyadmin/admingame/get_all_drafting_style').then(function (response) {
                $scope.league_drafting_styles = response;
            }, function (error) {

            });
        }

        $scope.InitializeGameField = function ()
        {
            angular.forEach($scope.master_data_entry, function (value, key) {
                console.log(value);
                $scope.data_desc = value.data_desc;
                $scope.admin_fixed = value.admin_fixed;
                $scope.admin_lower_limit = value.admin_lower_limit;
                $scope.admin_upper_limit = value.admin_upper_limit;
                console.log($scope.admin_upper_limit);
                if ($scope.data_desc == 'Entry_Fee')
                {
                    console.log(value.user_upper_limit);
                    $scope.entry_fee_upper_limit = value.admin_upper_limit;
                    $scope.entry_fee_lower_limit = value.admin_lower_limit;
                    if ($scope.user_fixed == 1)
                    {
                        $('input#entry_fee').show();
                    }
                    else
                    {
                        $('input#entry_fee').remove();
                    }
                }

                if ($scope.data_desc == 'Size')
                {
                    $scope.size_upper_limit = value.admin_upper_limit;
                    $scope.size_lower_limit = value.admin_lower_limit;
                    if ($scope.user_fixed == 1)
                    {
                        $('input#size').show();
                    }
                    else
                    {
                        $('input#size').remove();
                        $('#uniform-size').show();
                    }
                }
            });
        }

        $scope.createSubmit = function ()
        {
            if ($("#valid").validationEngine('validate'))
            {
                var no_of_games = $('.insert_games > span').length;

                if (no_of_games < 2)
                {
                    jAlert('Min 2 Games should be selected');
                    return false;
                }
                else
                {
                    showloading();
                    var Data = $('.new_game').serializeArray();

                    var PostData = {};

                    $.each(Data, function ()
                    {
                        if (PostData[this.name])
                        {
                            if (!PostData[this.name].push)
                            {
                                PostData[this.name] = [PostData[this.name]];
                            }
                            PostData[this.name].push(this.value || '');
                        }
                        else
                        {
                            PostData[this.name] = this.value || '';
                        }
                    });

                    commonService.commonApiCall(PostData, 'fantasyadmin/admingame/create_game').then(function (response) {
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
                    }, function (error) {

                    });
                }
            }
        };
        $scope.GetPrizeDetails = function ()
        {            
            var league_number_of_winner_id = $scope.league_number_of_winner_id;
            var size                       = Number ( $scope.sizes );
            var entry_fee                  = $scope.entry_fees;		
            console.log('size_lower_limit '+ $scope.size_lower_limit  + ' size_upper_limit ' + $scope.size_upper_limit + ' entry_fee_lower_limit' + $scope.entry_fee_lower_limit + ' entry_fee_upper_limit' + $scope.entry_fee_upper_limit)
            if ( league_number_of_winner_id != '' && !isNaN( size ) && size >= Number ( $scope.size_lower_limit ) && size <= Number ( $scope.size_upper_limit ) && entry_fee != '' && entry_fee >= Number ( $scope.entry_fee_lower_limit ) && entry_fee <= Number ( $scope.entry_fee_upper_limit ) )
            {
                console.log($scope.number_of_winner_validation);
                angular.element('#prizes_detail' ).empty();
                $.each( $scope.number_of_winner_validation , function ( key , value ){

                    if ( league_number_of_winner_id == value.number_of_winner_id )
                    {
                        var position_or_percentage = value.position_or_percentage;
                        var places                 = value.places;
                        var url = 'common/prize_details/'+size+'/'+entry_fee+'/'+league_number_of_winner_id;
                        if ( position_or_percentage == $scope.position )
                        {
                            if ( size < places )
                            {
                                angular.element('#league_number_of_winner_id' ).val( '' ).trigger( 'change' );
                                jAlert( 'Invalid combination of Size and Prize.' );
                                return false;
                            }
                            else
                            {
                                $scope.GetPrizeDetailsAndShow( url , league_number_of_winner_id);
                            }
                        }
                        else
                        {	
                            if(places == 30 && size < 4)
                            {
                                angular.element('#league_number_of_winner_id' ).val( '' ).trigger( 'change' );
                                jAlert( 'Invalid combination of Size and Prize.' );
                                return false;
                            }else
                            {	
                                $scope.GetPrizeDetailsAndShow( url , league_number_of_winner_id);
                            }	
                        }
                    }
                });
            }
            else
            {
                angular.element( '#prizes_detail' ).empty();
            }
        },

	$scope.GetPrizeDetailsAndShow = function ( url , league_number_of_winner_id)
	{       
		$.ajax({
			url			: url,
			type		: 'POST',
			async		: false,
			success		: function( response )
			{
				//alert(league_number_of_winner_id);
				var prize_details = "";
				//Top 1
				if(league_number_of_winner_id == 1)
				{	
					prize_details = '$'+ response +' to top '+ response.length;
				}
				//For Top 2,3,5,10
				if( league_number_of_winner_id == 2 || league_number_of_winner_id == 3 
					|| league_number_of_winner_id == 4 || league_number_of_winner_id == 5)
				{
					for(i=0;i<response.length;i++)
					{
						prize = (i+1) + ' prize $'+ response[i] +', ';
						prize_details = prize_details.concat(prize);
					}
						prize_details = $.trim(prize_details).slice(0, -1)

				}
				//For Top 30% or 50%
				if( league_number_of_winner_id == 6 || league_number_of_winner_id == 7)
				{
					prize_details = '$'+ array_sum(response) +' distribute to top ' + response.length;
				}	
				//alert(prize_details);
				angular.element( '#prizes_detail' ).empty().html( prize_details );
			}
		});
	}

    }]);

