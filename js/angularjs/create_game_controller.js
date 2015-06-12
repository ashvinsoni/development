/*
  Create Salary Cap Controller Starts
  Service Used : createSalaryCapService
*/
app.controller('createGameController', ['$scope', '$http','$compile','$location','$timeout','commonService', function($scope,$http,$compile,$location,$timeout,commonService){
  
  // $timeout(function(){
  //       var league_id = $('input[name="league_id"]').val();        
  //       angular.element('#league_id_'+league_id).trigger('click');          //Click the league id when the page loads                                  
  // },2000);  

  //Defining the scopes
  $scope.league_duration_id_combo         = 'Select Game Duration';
  $scope.duration_id_combo                = 'Select Game Duration';
  $scope.season_week_id_combo             = 'Select Week';
  $scope.buckets_combo                    = 'Select Time';
  $scope.league_drafting_styles_id_combo  = 'Select Drafting Style';
  $scope.league_salary_cap_id_combo       = 'Select Salary Cap';
  $scope.league_number_of_winner_id_combo = 'Select Prize';
  $scope.all_available_week               = {};
  $scope.all_number_of_winner             = {};
  $scope.number_of_winner_validation      = {};
  $scope.seasons_dates                    = {};
  $scope.size_upper_limit                 = 0;
  $scope.size_lower_limit                 = 0;
  $scope.entry_fee_upper_limit            = 0;
  $scope.entry_fee_lower_limit            = 0;
  $scope.position                         = 0;
  $scope.percentage                       = 1;
  $scope.duration_id                      = {};
  $scope.buckets_status                   = false;
  $scope.weekDay                          = [ "Sun" , "Mon" , "Tue" , "Wed" , "Thu" , "Fri" , "Sat" ];
  $scope.year                             = [ "Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" ,"Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec" ];
  var master_data_entry = {};
  $scope.values = {};


  /*
    Function to Get all game data
    Service Used : getAllData
  */
  
  $scope.createGameGetAllData = function()
  {
    $scope.values = {};
    
    commonService.commonApiCall('','dashboard/new_game').then(function(response)  
    {
      $scope.master_data_entry      = response.master_data_entry; //Retreive user_lower_limit,user_upper_limit
      $scope.daily_label            = response.daily_label;       //Retrieve Time label ie,All,Early,Late
      $scope.fee_list               = response.fee_list;          //Retrieve Fee List
      $scope.size_list              = response.size_list;         //Retrieve Size List
      $scope.sport                  = response.sport;             //Retrieve League Name ie, MLB or NFL
      $scope.league_desc            = response.league_desc;       //Retrieve League description is, daily,weekly,custom weekly
      $scope.InitializeGameField();
      console.log($scope.master_data_entry);
    });
  };
  
  /*
    Function to Initialize Game Field ie, setting user lower limit, upper limit for size and fee
  */
 
  $scope.InitializeGameField = function()
  {
      angular.forEach( $scope.master_data_entry , function( value , key ){ 
      $scope.data_desc        = value.data_desc;
      $scope.user_fixed       = value.user_fixed;
      $scope.user_lower_limit = value.user_lower_limit;
      $scope.user_upper_limit = value.user_upper_limit;
      if ( $scope.data_desc == 'Entry_Fee' )
      {
        $scope.entry_fee_upper_limit = value.user_upper_limit;
        $scope.entry_fee_lower_limit = value.user_lower_limit;
        if ( $scope.user_fixed == 1 )
        {
          $( 'input#entry_fee' ).show();
        }
        else
        {
          $( 'input#entry_fee' ).remove();
        }
      }

      if ( $scope.data_desc == 'Size' )
      {
        $scope.size_upper_limit = value.user_upper_limit;
        $scope.size_lower_limit = value.user_lower_limit;
        if ( $scope.user_fixed == 1 )
        {
          $( 'input#size' ).show();
        }
        else
        {
          $( 'input#size').remove();
          $( '#uniform-size' ).show();
        }
      }
    });
  },
  $scope.createGameGetAllData();
  $scope.InitializeGameField();
  
  $scope.InitializeDuration = function( obj )
  {

    
    $scope.buckets_status = false;
    $( '.total_game' ).hide();
    var league_id = obj;
    $scope.CreateGameName('false');
    $( '.selected-game' ).html('');
    $scope.ResetCombo( 'league_duration_id' );
    if ( league_id == '' )
    {
      $scope.ResetCombo( 'league_drafting_styles_id' );
      $scope.ResetCombo( 'league_salary_cap_id' );
      $scope.ResetCombo( 'league_number_of_winner_id' );
      $scope.ResetCombo( 'buckets' );
      $('#daily').hide();
      $('#weekly').hide();
      $( '#date_create_game , #buckets' ).val( '' );
      $( '.selected-game' ).html('');
    }
    else
    {
      $('#daily').hide();
      $('#weekly').hide();
      $( '#date_create_game , #buckets' ).val( '' );
      var values = {league_id : league_id};  
      commonService.commonApiCall(values,'dashboard/get_all_game_data').then(function(response)  //Retrieving value of all game data
      {
        var all_duration                        = response.all_duration;

        var all_salary_cap                      = response.all_salary_cap; 
        $scope.seasons_dates                    = response.seasons_dates;
        $scope.all_available_week               = response.all_available_week;
        var all_number_of_winner                = response.all_number_of_winner;
        $scope.number_of_winner_validation      = response.number_of_winner_validation;

        if($scope.seasons_dates == ''){
          return;
        }
        //$( '#league_duration_id' ).selectbox( 'detach' );
        $('#league_duration_id').val('').trigger("chosen:updated"); 
        $.each( all_duration , function( key , value ){
          $scope.duration_id[ value.league_duration_id ] = value.duration_id;
          $( '#league_duration_id' ).append(  '<option value="'+value.league_duration_id+'">'+value.duration_desc+'</option>' );
        });
        $scope.ComboFill( 'league_salary_cap_id', all_salary_cap );
        $scope.ComboFill( 'league_number_of_winner_id', all_number_of_winner );
        $('#league_duration_id').val('').trigger("chosen:updated"); 
          
      },function(error){
      });
      
    }
  },

  angular.element('#league_duration_id').bind('change',function(e){
    $scope.ShowWeekDates(this);
  });
  $scope.ShowWeekDates = function ( obj )
  {

    $('.select_all_daily').hide();
    $('.select_all_weekly').hide();
    $('.selected-game ').html('');
    $scope.buckets_status = false;
    $( '.total_game' ).hide();
    var league_duration_id = $( '#league_duration_id' ).val();
    var temp_duration_id = $scope.duration_id[ league_duration_id ];

    $( '#duration_id' ).val( temp_duration_id );
    var duration_id = $( '#duration_id' ).val();

    $scope.CreateGameName('false');

    if ( league_duration_id == '' || duration_id == '' )
    {
      $scope.ResetCombo( 'season_week_id' );
      $scope.ResetCombo( 'buckets' );
      $('#daily , #weekly').hide();
      $( '#date_create_game , #buckets' ).val( '' );
    }
    else
    {
      $scope.GetAllDraftingStyle( league_duration_id );

      $( ".timeformError , .dateformError , .weekformError" ).remove()
      if ( duration_id == 1 ) //Daily
      {
        $('#red-error-season_week_id').hide();
        $( '#date_create_game' ).val( '' );
        $( '#weekly' ).hide();
        $( '#daily , #time' ).show();
        $( '#buckets' ).val( '' );
        $scope.InitializeDates();        
        $scope.ResetCombo( 'season_week_id' );
        
      }
      else if ( duration_id == 2 ) //Custom Weekly
      {
        $( '#daily , #time' ).hide();
        $( '#weekly' ).show();
        $('#red-error-date').hide();
        $('#red-error-buckets').hide();
        $scope.ResetCombo( 'buckets' );
        $scope.GetAllAvailableWeek();
      }
      else if ( duration_id == 3 ) //Weekly
      {
        $( '#daily , #time' ).hide();
        $( '#weekly' ).show();
        $('#red-error-date').hide();
        $('#red-error-buckets').hide();
        $scope.ResetCombo( 'buckets' );
        $scope.GetAllAvailableWeek();
      }
      else
      {
        $( '#weekly' ).hide();
        $( '#daily' ).hide();
      }
    }
  },

  $scope.GetAllDraftingStyle = function ( league_duration_id )
  {

    if(league_duration_id == 1)
    {
      $('.select_all_daily').show();
      
    }
    else
    {
      $('.select_all_daily').hide();  
      
    }
    var values = {league_duration_id : league_duration_id};
    
    commonService.commonApiCall(values,'dashboard/get_all_drafting_style').then(function(response)    
    {
      $scope.ComboFill( 'league_drafting_styles_id' , response );
    },function(error)
    {
    });
  },

  $scope.GetAllAvailableWeek = function ()
  {

    $scope.ComboFill( 'season_week_id' , $scope.all_available_week );
  },

  $scope.InitializeDates = function ()
  {
  $( "#date_create_game" ).datepicker({   
      changeMonth: true,
      changeYear: true,
      autoSize:true,
      beforeShowDay: $scope.available,
      dateFormat:"yy-mm-dd",
      minDate:mindate,
      
      onSelect:function( selectedDate )
      {
        $('#buckets').val('').trigger("chosen:updated"); 
        $('#buckets').val('').trigger('liszt:updated');
        $( '#buckets' ).val('');
        $scope.buckets_status = false;
        $( '.total_game,.sticky-placeholder-label' ).hide();
        $scope.ComboFill( 'buckets' , $scope.daily_label );         
        $scope.CreateGameName();
        $timeout(function(){
          $scope.GetAvailableGameOfTheDayOrWeek();
        },2000);
        /*$scope.GetAvailableGameOfTheDayOrWeek();*/
      }
    });
    

    $(document).on("click", function(e) {

      var elem = $(e.target);
      if(!elem.hasClass("hasDatepicker") && 
        !elem.hasClass("ui-datepicker") && 
        !elem.hasClass("ui-icon") && 
        !elem.hasClass("ui-datepicker-next") && 
        !elem.hasClass("ui-datepicker-prev") && 
        !$(elem).parents(".ui-datepicker").length){
          $('.hasDatepicker').datepicker('hide');
        }
    });
  },

  $scope.GetPrizeDetails = function ( is_submit )
  {
    var league_number_of_winner_id = $scope.league_number_of_winner_id;
    var size                       = Number($scope.sizelistmodel);
    var entry_fee                  = $scope.feelistmodel;
    $scope.size                    = $scope.sizelistmodel;
    $scope.entry_fee               = $scope.feelistmodel;
    $('.sizeList').val($scope.sizelistmodel);
    $('.feeList').val($scope.feelistmodel);

    if ( league_number_of_winner_id != '' && !isNaN( size ) && size >= Number ( $scope.size_lower_limit ) && size <= Number ( $scope.size_upper_limit ) && entry_fee != '' && entry_fee >= Number ( $scope.entry_fee_lower_limit ) && entry_fee <= Number ( $scope.entry_fee_upper_limit ) )
    {
      
      $( '#prizes_detail' ).empty();
      angular.forEach( $scope.number_of_winner_validation , function ( value , key ){
        if ( league_number_of_winner_id == value.league_number_of_winner_id )
        {
          var position_or_percentage = value.position_or_percentage;
          var places                 = value.places;
          //var url = site_url+'common/prize_details/'+size+'/'+entry_fee+'/'+league_number_of_winner_id;
          if ( position_or_percentage == $scope.position )
          {
            if ( size < places  )
            {
              $( '#prizes_detail' ).empty();
              $( "#league_number_of_winner_id" ).trigger("chosen:updated"); 
              
              $( '#league_number_of_winner_id' ).val( '' );
              $( "#league_number_of_winner_id" ).trigger("chosen:updated");
              setTimeout( function () {
                $('#red-error-league_number_of_winner_id').html( league_prize_invalid_error ).show();
              } , 50 );
              return false;
            }
            else
            {
              if(places == 30 && size < 4)
              {
                  $( '#prizes_detail' ).empty();
                  $( "#league_number_of_winner_id" ).trigger("chosen:updated"); 
                
                  $( '#league_number_of_winner_id' ).val( '' );
                  $( "#league_number_of_winner_id" ).trigger("chosen:updated");
                  setTimeout( function () {
                      $('#red-error-league_number_of_winner_id').html( league_prize_invalid_error ).show();
                  } , 50 );
                  return false;
              }else
              {  
                $('#red-error-league_number_of_winner_id').hide();
                /*$( '#create_game_loader' ).show();
                $( '#newgame_submit' ).hide();*/
                $scope.GetPrizeDetailsAndShow( is_submit );
              }  
            }
          }
          else
          {
            /*$( '#create_game_loader' ).show();
            $( '#newgame_submit' ).hide();*/
            $scope.GetPrizeDetailsAndShow( is_submit );
          }
        }
      });
    }
    else
    {
      $( '#prizes_detail' ).empty();
    }
  },

  $scope.GetPrizeDetailsAndShow = function ( is_submit )
  {
    var values = {size : $scope.size,entry_fee : $scope.entry_fee,league_number_of_winner_id : $scope.league_number_of_winner_id};
    $scope.prizeDetailAmount = {};
    commonService.commonApiCall(values,'common/prize_details_for_game').then(function(response)//Retrieving value of all game data
    {
      $scope.prizeDetailAmount = response.result;
      var prize_details = "";
      prize_details = '$'+ array_sum(response.result);

      $( '#prizes_detail' ).empty().html( prize_details+'<i class="icon-dropdown"></i>' );

      if ( is_submit === true )
      {
        $( '#create_game_loader' ).show();
        $( '#newgame_submit' ).hide();
      }
      else
      {
        $( '#create_game_loader' ).hide();
        $( '#newgame_submit' ).show();
      }
    },function(error){
    });
  },

  $scope.ShowPrizeDetail = function()
  {
    $scope.GetPrizeDetails( false );
  },
  $scope.createGameSlider = "";
 
  $scope.GetAvailableGameOfTheDayOrWeek = function ()
  {
    $('#selectall_daily').prop('checked', false);
    $('#selectall_weekly').prop('checked', false);
    $('.selected-game').html('');
    
    var duration_id = $( '#duration_id' ).val();


    if ( duration_id == '' )
    {
      return false;
    }
    else if ( duration_id == 1 )
    {
      $('.select_all_daily').show();
      $('.select_all_weekly').hide();
      if ( ! $( '#date_create_game' ).val() || ! $( '#buckets' ).val() )
        return false;
    }
    else if ( duration_id == 2 )
    {
      $('.select_all_daily').hide();
      $('.select_all_weekly').show();
      if ( ! $( '#season_week_id' ).val() )
        return false;
    }
    else if ( duration_id == 3 )
    {
      $('.select_all_daily').hide();
      $('.select_all_weekly').show();
      if ( ! $( '#season_week_id' ).val() )
        return false;
    }
    $scope.buckets_status = false;
    $( '.total_game,.game_list' ).hide();
    var values = $( '.new_game' ).serialize();
    $scope.isDisableGameList = false;
    commonService.commonApiCall(values,'dashboard/get_available_game_of_the_day_or_week').then(function(response)//Retrieving value of all game data
    {
      var result = response.result
      var list   = response.game_list;
      $scope.list = response.game_list;
      $scope.buckets_status = result;
      if($scope.list==undefined)
      {
        $( '#total_game' ).html('');
      }
      
      var league_label = $( '#league_id' ).find( ":selected" ).text();
      if(duration_id == 1 && list!=undefined )
      {
        $( '#total_game' ).empty().append( 'Includes '+list.length+' '+league_label+' game(s)' ).show();
        $('#game_list').show();
        $('.select_all_daily').show();
        $('.select_all_weekly').hide();
      }
      else
      {
        $('.select_all_daily').hide();
      }
      if(duration_id == 2 && list!=undefined)
      {         
          // setTimeout(function(){
            $scope.isDisableGameList = true;
            $scope.selectAll();
            $('.remove_game').hide();
          // },2000);
        $( '#total_game' ).empty().append( 'Includes '+list.length+' '+league_label+' game(s)' ).show();
        $('#game_list').show();
        $('.select_all_daily').hide();
        $('.select_all_weekly').show();
      }
      if(duration_id == 3 && list!=undefined)
      {

        $( '#total_game' ).empty().append( 'Includes '+list.length+' '+league_label+' game(s)' ).show();
        $('#game_list').show();
        $('.select_all_daily').hide();
        $('.select_all_weekly').show();
      }
      $( '.game_list' ).empty();
      angular.forEach( $scope.list , function ( value, key   ){
        var gameName = value.away+'vs'+value.home;
        var gameDate = value.season_scheduled_date+'('+value.day_name+')';
        // $timeout(function() {
              var addDisableClass = ($scope.isDisableGameList == true) ? 'sel-inactive' : '';
              ContestCreateGameFilterSlider();
             $( '.game_list' ).append( $compile('<div class="block '+addDisableClass+'" ng-click=\'listOfGame("'+value.season_game_unique_id+'","'+gameName+'","'+gameDate+'")\' id="my_'+value.season_game_unique_id+'"><span Style="display:none;">'+value.away+' vs '+value.home+'</span><div class="team-group"><figure class="team-logo left"><img src="img/'+value.away+'.gif" ></figure><figure class="team-logo right"><img src="img/'+value.home+'.gif" ></figure><div class="team-info"><span class="teams-name"><label>'+value.away+'</label> VS <label>'+value.home+'</label></span><span class="match-date"><label>'+value.season_scheduled_date+'('+value.day_name+')</label></span><span class="match-time"><label>EST</label></span></div></div></div>' )($scope));  
          // }, 200);    
        
        
      });
      
      $( '#total_game,.game_list' ).show();
    },function(error){
    });
  },

  $scope.selectAll = function()
  {
    
    var league_id                     = $('input[name="league_id"]:checked').val();
    var league_duration_label         = $( '#league_duration_id' ).find( ":selected" ).text();
    if(league_id == 3)
    {
      if(league_duration_label == 'Weekly')
      {
        $('#selectall_weekly').prop('checked',true); 
        $('#selectall_weekly').attr("disabled",true);      
        // $('.active').addClass('sel-inactive');         
      }
      else
      { 
        $('.active').removeClass('sel-inactive'); 
        $("#selectall_weekly").attr("disabled", false);
      }
    }


    angular.forEach( $scope.list , function ( value, key   ){ 

        var season_id = value.season_game_unique_id;
        var gameName = value.away+'vs'+value.home;
        var gameDate = value.season_scheduled_date;
        $('#my_'+season_id).removeClass('active');
        $('#season_'+season_id).remove();
        if($('#selectall_daily').prop('checked') == true)
        {
          $('#my_'+season_id).addClass('active');
          $( '.selected-game' ).append( '<aside id=season_'+season_id+'><span class="selected_games"><input type="hidden" value='+season_id+' name="gamelist[]"/><a class="close remove_game" onclick="$(\'#season_'+season_id+'\').remove();$(\'#my_'+season_id+'\').removeClass(\'active\');"><i class="icon-close"></i></a><div class="creategameblock"><span><label>'+gameName+'</label></span><span class="gamedate"><label>'+gameDate+'</label></span></div></span></aside>' );
        }

        if($('#selectall_weekly').prop('checked') == true)
        {          
          $('#my_'+season_id).addClass('active');
          $( '.selected-game' ).append( '<aside id=season_'+season_id+'><span class="selected_games"><input type="hidden" value='+season_id+' name="gamelist[]"/><a class="close remove_game" onclick="$(\'#season_'+season_id+'\').remove();$(\'#my_'+season_id+'\').removeClass(\'active\');"><i class="icon-close"></i></a><div class="creategameblock"><span><label>'+gameName+'</label></span><span class="gamedate"><label>'+gameDate+'</label></span></div></span></aside>' );
        }
        
         //$(ths).prop('checked');
        
      });
      if($('#selectall_weekly').prop('checked') == true)
      {
        setTimeout(function(){
        $('.block').addClass('active');
        },'300');
      }

    /*$('.block').each(function() { //loop through each checkbox
       // $('.block').addClass('active');            
                   
      });*/

  }

  $scope.listOfGame = function(season_id,game_name,game_date)
  {
    if($('#my_'+season_id).hasClass('sel-inactive'))
    {
      return false;
    }
    if($('#my_'+season_id).hasClass('active'))
    { 
      $('#my_'+season_id).removeClass('active');
      $('#season_'+season_id).remove();
    }
    else
    {
        $('#my_'+season_id).addClass('active');
        $( '.selected-game' ).append( '<aside id=season_'+season_id+'><span class="selected_games"><input type="hidden" value='+season_id+' name="gamelist[]"/><a class="close remove_game" onclick="$(\'#season_'+season_id+'\').remove();$(\'#my_'+season_id+'\').removeClass(\'active\');"><i class="icon-close"></i></a><div class="creategameblock"><span><label>'+game_name+'</label></span><span class="gamedate"><label>'+game_date+'</label></span></div></span></aside>' );
    }
    //Used to uncheck the selectall checkbox if no games are selected.
    
    if($('.selected_games').length == '0')
        {
          $('#uniform-selectall span').removeClass('checked');  
          $('#uniform-selectall_daily span').removeClass('checked');  
        }
    
  },

  $scope.available = function ( date )
  {
    var Y = date.getFullYear();
    var M = (date.getMonth()+1);
    var D = date.getDate();

    if ( M < 10 )
    {
      M ='0'+M;
    }

    if ( D < 10 )
    {
      D = '0'+D;
    }

    dmy = Y + "-" + M + "-" + D;

    if ( $.inArray ( dmy , $scope.seasons_dates ) != -1 )
    {
      return [ true , "" , "Available" ];
    }
    else
    {
      return [ false , "" , "No Game" ];
    }
  },

  $scope.ResetCombo = function( combo )
  {
    $(function(){
      //$( "#"+combo ).selectbox( "detach" );
      $( "#"+combo ).trigger("chosen:updated"); 
      var label = combo+'_combo';
      $( '#'+combo ).empty();
      $( '#'+combo ).append( '<option value="">'+$scope[label]+'</option>' );
      $( "#"+combo ).trigger("chosen:updated"); 
    });
  },

  $scope.ComboFill = function( obj_id , item )
  {
    $scope.ResetCombo( obj_id );
    $(function(){
      $("#"+obj_id ).trigger("chosen:updated"); 
      //$( "#"+obj_id ).selectbox( 'detach' );
      $.each( item , function( key , value ) {

        $( '#'+obj_id ).append( '<option value="'+key+'">'+value+'</option>' );
      });

      $("#"+obj_id ).trigger("chosen:updated"); 
    });
  },

  $scope.CreateGameName = function(val)
  {    

    //alert(val);
    var league_id                     = $('input[name="league_id"]:checked').val();
    var league_label                  = $("input:checked[name=league_id] + label").text();   
    var league_duration_id            = $( '#league_duration_id' ).val();
    var league_duration_label         = $( '#league_duration_id' ).find( ":selected" ).text();
    var league_drafting_styles_id     = $( '#league_drafting_styles_id' ).val();
    var league_drafting_styles_label  = $( '#league_drafting_styles_id' ).find( ":selected" ).text();
    var season_week_id                = $( '#season_week_id' ).val();
    var season_week_id_label          = $( '#season_week_id' ).find( ":selected" ).text();
    var league_salary_cap_id          = $( '#league_salary_cap_id' ).val();
    var league_salary_cap_label       = $( '#league_salary_cap_id' ).find( ":selected" ).text();
    var date                          = $( '#date_create_game' ).val();
    var date_label = '';

    if ( league_id == '' )
    {
      league_label = '';
    }

    if ( league_duration_id == '' )
    {
      league_duration_label = '';
    }

    if ( league_drafting_styles_id == '' )
    {
      league_drafting_styles_label = '';
    }

    if ( league_salary_cap_id == '' )
    {
      league_salary_cap_label = '';
    }
    else
    {
      league_salary_cap_label = league_salary_cap_label.replace( /0+/ ,'' ) + '0k';
    }
    
      if ( league_duration_label == 'Daily'  && date !='' )
      {
        $("#selectall_weekly").attr("disabled", false);
        dateObj = $( '#date_create_game' ).datepicker( 'getDate' );
        day        = $scope.weekDay[ dateObj.getDay() ];
        year_label = $scope.year[ dateObj.getMonth() ];
        full_year  = dateObj.getFullYear();
        date_only  = dateObj.getDate();
        date_label = day+' '+year_label+' '+$scope.getPos(date_only);
      }
      else if ( $.trim( league_duration_label ) == 'Weekly' && season_week_id != '' )
      {
        $("#selectall_weekly").attr("disabled", false);
        league_duration_label = 'Week '+season_week_id_label;
        if(val!='true' && val!='false')
        {
          $scope.GetAvailableGameOfTheDayOrWeek();
        }
      }

    var game_name = league_label+' '+league_duration_label+' '+league_drafting_styles_label+' '+league_salary_cap_label+' '+date_label;

    $( '.gm_name' ).val( '' );
    $( '.gm_name' ).val( $.trim( game_name ) );
    $( '.gm_name' ).empty().html( $.trim( game_name ) );
  },

  $scope.getPos = function( pos )
  {
    var deci = pos % 100;
    if ( deci > 10 && deci < 20 ) return pos + "th";
    switch( pos % 20 )
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
  },

  $scope.createSubmit = function(){
    var ret                     = true;
    var values                  = $( '.new_game' ).serialize();
    var regex                   = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    var league_duration_id      = $('#league_duration_id').val();
    //alert(league_duration_id);
    var duration_id             = $( '#duration_id' ).val();
    var size_value              = Number($('#size').val());
    var entry_fee_value         = Number($('#entry_fee').val());
    var invite_email            = $( '#invite_email' ).val();
    var invite_emails           = invite_email.split( ',' );
    var no_of_games             = $('.selected-game > aside').length;
    var league_id               = $('input[name="league_id"]:checked').val();
    var email_response          =  true;
    $.each( invite_emails , function ( key , value ) {
      if ( !regex.test( $.trim( value ) ) )
      {
        email_response = false;
      }
    });


  if($('input[name=league_id]:checked').length<=0)
  {
    $('#red-error-league_id').show();
    $('#red-error-league_id').html(league_error);
    ret=false;  
  }
  else
  {
    $('#red-error-league_id').hide();
    ret=true;
  }
  
  if(checkEmpty('league_duration_id',league_duration_error)==false)
  {
    ret=false;
  }

  if(duration_id==1)
  {
    if(checkEmpty('date',league_date_error)==false)
    {
      ret=false;
    }
    if(checkEmpty('buckets',league_time_error)==false)
    {
      ret=false;
    }
  }
  else if(duration_id==2 || duration_id==3)
  {
    if(checkEmpty('season_week_id',league_week_error)==false)
    {
      ret=false;
    } 
  }
  else
  {
    $('#red-error-league_duration_id').show();
    $('#red-error-league_duration_id').html(league_duration_error);
    ret=false;  
  }


  if(checkEmpty('league_drafting_styles_id',league_drafting_error)==false)
  {
    ret=false;
  }

  if(checkEmpty('league_salary_cap_id',league_salary_cap_error)==false)
  {
    ret=false;
  }

  if(checkEmpty('size',league_size_error)==false)
  {

    ret=false;
  }
  

  if(checkEmpty('entry_fee',league_fee_error)==false)
  {

    ret=false;
  }
  
  
  if(checkEmpty('league_number_of_winner_id',league_prize_error)==false)
  {
    ret=false;
  } 

if(no_of_games < 2 && league_id == 2)
    {
      showErrMsg( GAME_ATLEAST_TWO );
      ret = false;
    }
  
  if(email_response || invite_email=='') {
      
      $('#red-error-invite_email').hide();
      if( ret == true ) {
        ret=true; 
      }
      
    } else {
      $('#red-error-invite_email').show();
      $('#red-error-invite_email').html(game_invite_email_error);
      ret=false;      
    }

    

    /*if(no_of_games < 2 && league_id == 3)
    {
      showErrMsg( GAME_ATLEAST_ONE );
      ret == false;
    }*/

    if( ret == true )
    {
      $('#create_odd_man_out_loader').addClass('loaderBtn');
      commonService.commonApiCall(values,'dashboard/new_game').then(function(response)
      {     
        $('#create_odd_man_out_loader').removeClass('loaderBtn');
        showSuccessMsg( SUCCESSFULL_GAME_CREATE );
        $timeout(function(){
            $location.path('/lobby');
        },3000); 
      },function(error){        
      }); 
    }
    else
    {
      return false;          
    }
  };

}]);


function array_sum(array)
{
  
  //   example 1: array_sum([4, 9, 182.6]);
  //   example 2: total = []; index = 0.1; for (y=0; y < 12; y++){total[y] = y + index;}
  //   example 2: array_sum(total);
  //   returns 2: 67.2

  var key, sum = 0;

  if (array && typeof array === 'object' && array.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
    return array.sum.apply(array, Array.prototype.slice.call(arguments, 0));
  }

  // input sanitation
  if (typeof array !== 'object') {
    return null;
  }

  for (key in array) {
    if (!isNaN(parseFloat(array[key]))) {
      sum += parseFloat(array[key]);
    }
  }

  return numberWithCommas(sum);
}

function numberWithCommas(x) {
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


angular.element(document).ready(function () {
  setTimeout(function(){
        angular.element('#league_id_2').trigger('click');                                            
  },1000);  
});
