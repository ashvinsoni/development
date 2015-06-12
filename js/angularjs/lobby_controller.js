/*  Controller Name : Lobby Controller
    Service Name    : commonService */
  var mySlider;
  app.controller('lobbyController',function($scope,$http,commonService,$timeout){
    // post model
    $scope.searchgame = {};
    $scope.searchgame.limit     = 10;
    $scope.searchgame.total     = 0;
    $scope.searchgame.start     = 0;
    $scope.searchgame.pageno     = 0;
    $scope.searchgame.order_sequence ='ASC' ;
    $scope.searchgame.order_by = 'game_name';
    $scope.searchgame.order_class = 'icon-down-arrw';
    $scope.searchgame.leagueIds = 0;
    $scope.searchgame.leagueType = {};
    $scope.searchgame.contest = {};
    $scope.searchgame.entryFee ={};
    
    $scope.lobbyResult = {};
    $scope.filtermasterdata = [];
    $scope.selectedsportsid = null;
    $scope.SelectedLeagueId = [];
    $scope.filteredleaguelist = [];

    $scope.sports_list        = [];
    $scope.LeagueList         = [];
    $scope.lgSportid = 'all';
    $scope.leagueTypeList = [];
    
    commonService.commonApiCall('','lobby/get_lobby_filter_list').then(function(response){
        $scope.filtermasterdata = response;
        $scope.sports_list      = response.sports_list;
        $scope.LeagueList       = response.league_list;
        if (response.featured_games.featured_game_list != undefined) {         
          $scope.featured_game_list       = response.featured_games.featured_game_list;       
        }
        $scope.leagueTypeList   = response.league_type_list;
    },function(error){
    });

    //Used to show login alert in case of non login view
    $scope.isLogin = isLogin;
    
    $scope.showLoginAlert = function(){
      showErrMsg( NON_LOGIN_VIEW_MSG );
    }

    $scope.showLeagueList = function(sportid){
       $scope.lgSportid = sportid;
    }
    
    $scope.searchGame = function(value,action){
        var parmArry = '';
               
        if(action == 'game_name_orderby'){

            if(value == 'ASC'){
               $scope.searchgame.order_by = 'game_name';
               $scope.searchgame.order_sequence ='DESC';
               $scope.searchgame.order_class = 'icon-up-arrw'; 
            }else{
              $scope.searchgame.order_by = 'game_name';
              $scope.searchgame.order_sequence ='ASC';
              $scope.searchgame.order_class = 'icon-down-arrw'; 
            }
            
        }

        if(action == 'game_entry_orderby'){

          if(value == 'ASC'){
               $scope.searchgame.order_sequence ='DESC';
               $scope.searchgame.order_class = 'icon-up-arrw';
               $scope.searchgame.order_by = 'size';

            }else{
              $scope.searchgame.order_sequence ='ASC';
              $scope.searchgame.order_class = 'icon-down-arrw';
              $scope.searchgame.order_by = 'size'; 
            }

        }

        if(action == 'game_fee_orderby'){

          if(value == 'ASC'){
               $scope.searchgame.order_sequence ='DESC';
               $scope.searchgame.order_class = 'icon-up-arrw';
               $scope.searchgame.order_by = 'entry_fee';

            }else{
              $scope.searchgame.order_sequence ='ASC';
              $scope.searchgame.order_class = 'icon-down-arrw';
              $scope.searchgame.order_by = 'entry_fee'; 
            }

        }

        if(action == 'game_win_orderby'){

          if(value == 'ASC'){
               $scope.searchgame.order_sequence ='DESC';
               $scope.searchgame.order_class = 'icon-up-arrw';
               $scope.searchgame.order_by = 'prize_pool';

            }else{
              $scope.searchgame.order_sequence ='ASC';
              $scope.searchgame.order_class = 'icon-down-arrw'; 
              $scope.searchgame.order_by = 'prize_pool';
            }

        }

      if(action == 'game_date_orderby'){

          if(value == 'ASC'){
               $scope.searchgame.order_sequence ='DESC';
               $scope.searchgame.order_class = 'icon-up-arrw';
               $scope.searchgame.order_by = 'season_scheduled_date';

            }else{
              $scope.searchgame.order_sequence ='ASC';
              $scope.searchgame.order_by = 'season_scheduled_date';
              $scope.searchgame.order_class = 'icon-down-arrw'; 
            }

        }

        if(value && action == 'sportsid'){
             $scope.searchgame.sportType = value;
             $scope.searchgame.leagueIds = 0;
             $scope.searchgame.elecount = $('[data-id="'+value+'"]').length;

             
          }
        
        if(value && action == 'leagueList'){
           $scope.searchgame.leagueIds = value;
        }

        if( $scope.searchgame.leagueType ){
           if($scope.searchgame.leagueType.daily == ''){
              delete $scope.searchgame.leagueType.daily;
            }
            if($scope.searchgame.leagueType.week == ''){
              delete $scope.searchgame.leagueType.week;
            }
        }

        if(action == 'start_page'){
           
           $scope.searchgame.start = value;
        }

        if(action == 'sportsid' || action == 'leagueList' || action == 'leagueType' || action == 'contest' || action == 'entryFee' ){
          $scope.searchgame.start = 0;
        }

        var parmArry = $scope.searchgame;
         commonService.commonApiCall(parmArry,'lobby/lobby_game_list').then(function(response)//Used to call list of matches team name from searchGame service
        {     
          if(response.status)
          {
            $scope.searchgame.data_length = response.data.game_data.game_list.length;
            $scope.searchgame.limit       = 10;
            $scope.searchgame.start       = response.data.start; 
            $scope.searchgame.total       =  response.data.total;
            $scope.lobbyResult            = response.data.game_data.game_list;
          }
        });
      }

$scope.SetPagingAct = function(text, page){
        //console.log((page-1) * $scope.searchgame.limit);
        var start_page = (page-1) * $scope.searchgame.limit;
        $scope.searchGame(start_page,'start_page');
};
$scope.searchGame('all','sportsid');


  /** game details popup funtion***/
  $scope.get_game_details= function(game_unique_id){    
    angular.element('#GameDetailsCount').empty();
    $scope.param = {game_unique_id:game_unique_id};
    $scope.gameDetailsList = {};
    commonService.commonApiCall($scope.param,'lobby/get_game_detail').then(function(response)    { 
       $scope.gameDetailsList = response.game_detail;
       $scope.entrantsList = response.participants_detail;
       //console.log($scope.entrantsList);
       $scope.teamDetail  = response.team_detail;
       var timestamp                   = $scope.gameDetailsList.game_starts_in;
       var from                        = $scope.gameDetailsList.today;

       setTimeout(function(){
           angular.element('#GameDetailsCount').countdown( { timestamp:timestamp , from:from , timeup : function () { } } ); 
       },1000);          
       openPopDiv('GameDetailsPopup', 'bounceInDown');
       },function(error){
    }); 
    
  }

  $scope.show_entrants_details = function(userid){
    closePopDiv('GameDetailsPopup','bounceInDown'); 
    $scope.param = {user_id:userid};
    $scope.entrantsList = {};
    commonService.commonApiCall($scope.param,'lobby/get_participant_profile_popup').then(function(response)    { 
       $scope.participantProfile = response.participant_profile;
       $scope.participantLocation = response.participant_profile.state_name+','+response.participant_profile.country_name;
       
       openPopDiv('MyProfilePopup', 'bounceInDown');
       },function(error){
    });   

  }

  setTimeout( function (){ CloseMessage( 'error_message' , 'bounceOutUp' ); } , 3000 );
  setTimeout( function (){ CloseMessage( 'success_message' , 'bounceOutUp' ); } , 3000 ); 

});
