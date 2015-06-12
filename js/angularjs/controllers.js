var matrixRowCol = "";
var lazyLoadOnLineUpPlayerList = false;
/*
* Logout user from system
*/

app.controller('homeController',function($scope,$http,factoryLobby,Lobby,$timeout){

});

app.controller('logoutController',['$scope','$http','Auth',function($scope,$http,Auth)
{    
    $scope.Logout = function()
    {       
        Auth.Logout().then(function(response){                    
            if(response.status == true)
            {
                window.location.href= siteUrl;
            }
        },function(error){
        });
    };

}]);

  /*  Controller Name : Scoring Controller
      Service Name    : commonService */

  app.controller('scoringController',function($scope,$routeParams,$location,$timeout,$compile,socket,commonService){

    $('.news-ticker').show();

    var gameUniqueId = {gameUniqueId : $routeParams.gameUniqueId};

    $scope.imagePath    = imagePath;

    $scope.parentobj = {};

    $scope.tpl = {};

    $scope.parentobj.listView=true;

    $scope.opponentLineup = {}; 

    $('.middle-loader-scoring').show();

    $('.middle-loader').hide();
    $scope.opponent = [];
    $scope.opponentList = {};

    $scope.sports_desc  = '';    
    //Scoring.gameDetail(gameUniqueId).then(function(response) 
    commonService.commonApiCall(gameUniqueId,'scoring/game_scoring').then(function(response)//Used to call list of matches team name form searchGame service
    {
      $timeout(function(){
        $('.middle-loader-scoring').hide();
      },300);

      if(response.msg == 'not_started'){
        $location.path('line-up/'+$routeParams.gameUniqueId);
        return;
      }  
      
      $scope.tpl.contentUrl = siteUrl+'template/scoring_salarycap';  
            
      $scope.gameDetail             = response.game_detail;
      $scope.currentUser            = response.user;
      $scope.opponentList           = response.user_detail;
      $scope.leagueId               = $scope.gameDetail.league_id;
      $scope.userLineup             = $scope.userLineupSmall  = response.user_lineup;
      $scope.siteUrl                = response.site_url+'upload/logo/';
      $scope.siteUrlPlayerDefault   = response.site_url;
      $scope.playersMatrixOwn       = response.players_matrix_own;
      $scope.playersMatrixOopponent = response.players_matrix_opponent;
      $scope.gameType               = response.game_type;
      $scope.prizePosition          = response.prize_by_position;
      matrixRowCol                  = response.no_of_rows_cols;
      $scope.sports_desc     = angular.lowercase(response.game_detail.sports_desc);
      $scope.predicate = '-total_score';
      
      $scope.firstOppentLoadData = {};
      if ($scope.opponentList != undefined) 
      {      
        $.each($scope.opponentList,function(key,val)
        { 
          //Loop in opponent list, response from user_detail
          $scope.opponentList[key]['total_score'] = Number(val.total_score); // Retrieve Total Score
          $scope.opponentList[key]['prizeAmount']  = "";
          $.each($scope.prizePosition,function(keyAmount,valAmount)
          { 
            //Loop in prize position, response from prize_by_position
            if(keyAmount == val.user_id) 
            {
              $scope.opponentList[key]['prizeAmount'] = valAmount;          
            }
          });
          $scope.opponentSmallView = {};
          if ($scope.currentUser.user_id != val.user_id)
          {
            $scope.opptName             = val.name;          
            $scope.opptImage            = val.image; 
            $scope.scoreLineUpMasterID  = val.lineup_master_id;
            $scope.scoreUserID          = val.user_id;
            $scope.firstOppentLoadData  = val;
            return;
          }
        });
      }

      //Used to load data of opponent random user wise
      $timeout(function () {
        $scope.selectOpponent($scope.firstOppentLoadData);   
        $scope.currentUserScoring();    
      },'1000'); 
      
      //Used to change view ie, grid or list
      $scope.changeView = function(showView)
      {          
        if (showView == 'list') 
        {
          $("#"+showView+"-tab").addClass('active');
          $("#grid-tab").removeClass('active');    
          $scope.parentobj.listView=false;
          $scope.parentobj.fieldView=true;                
        } 
        else 
        {
          $("#"+showView+"-tab").addClass('active'); 
          $("#list-tab").removeClass('active');       
          $scope.parentobj.fieldView=false;
          $scope.parentobj.listView=true;                 
        }              
      }

      /*Matrix view for login user*/
      $scope.currentUserScoring = function() 
      { 
        $('.hide_view_user').html('');  
        var sumuser = 0;
        if ($scope.userLineup != undefined) 
        {
          $.each($scope.userLineup,function(userLineupKey,userLineupIndex)
          { 
            sumuser  = parseFloat(sumuser) +parseFloat(userLineupIndex.score); 
            $.each($scope.playersMatrixOwn,function(playerMatrixKey,playerMatrixIndex)
            { 
              //Check of matrix position name equals user lineup position name

              if(playerMatrixIndex.position_name == userLineupIndex.position) 
              {
                //Check if html is blank then append
            //console.log(userLineupIndex);
                if($('#matrix_'+playerMatrixIndex.row+'_'+playerMatrixIndex.col+'_user').html() == "")
                {   
                  salaryCapScore  = parseFloat(userLineupIndex.score);              
                  str_field     =  '<div class="player" data-field-view="'+userLineupIndex.player_unique_id+'"><span class="jerseyicon"><i class="jersey-own"></i></span> <span class="player-details"><label class="position-name">'+userLineupIndex.position+'</label><label class="player-score">'+salaryCapScore.toFixed(2)+'</label></span> <span class="player-name"><label>'+userLineupIndex.full_name.substring(0,10)+'</label></span> </div></div>';              
                  $('#matrix_'+playerMatrixIndex.row+'_'+playerMatrixIndex.col+'_user').empty().html(str_field); //Append data in matrix view
                  return false;  
                }
              }   
              $scope.currentUserTotol =  sumuser.toFixed(2);  //Append total Score                  
            }); 
          });
        }        
      }
      
      //Function to select Opponent list and showing opponent matrix and grid view according the opponent selected
      $scope.selectOpponent = function(opponents) 
      {  
        var values      = {lmid : opponents.lineup_master_id,leagueId : $scope.leagueId};
        $scope.opponent = opponents;
        if ($scope.currentUser.user_id != opponents.user_id) 
        {
          //Scoring.opponentLineups(values).then(function(response)
          commonService.commonApiCall(values,'scoring/user_get_opponent_lineup').then(function(response)
          {
            $scope.opponentSmallView    = opponents;
            $scope.opponentLineup       = response.opponent_lineup;
            $scope.opptName             = opponents.name;          
            $scope.opptImage            = opponents.image;      
            $scope.showOppoLineup();
            MobileListviewTab();
          }); 
        }
      }

      /*Matrix view for oppponent user*/ 
      $scope.showOppoLineup = function()
      {   
        $('.hide_view_opp').html('');  
        var sum = 0;
        $.each($scope.opponentLineup,function(oppLineupKey,oppLineupIndex)
        {
          sum  = parseFloat(sum) +parseFloat(oppLineupIndex.score); 
          $.each($scope.playersMatrixOopponent,function(playerMatrixKey,playerMatrixIndex)
          {
            //Check of matrix position name equals user lineup position name
             if(playerMatrixIndex.position_name == oppLineupIndex.position) 
             {
              //Check if html is blank then append
              if($('#matrix_'+playerMatrixIndex.row+'_'+playerMatrixIndex.col+'_opp').html() == "")
              {
                salaryCapScore  = parseFloat(oppLineupIndex.score);       
                str_field =  '<div class="player" data-field-view="'+oppLineupIndex.player_unique_id+'"><span class="jerseyicon"><i class="jersey-opp"></i></span> <span class="player-details"><label class="position-name">'+oppLineupIndex.position+'</label><label class="player-score">'+salaryCapScore.toFixed(2)+'</label></span> <span class="player-name"><label>'+oppLineupIndex.full_name.substring(0,8)+'</label></span> </div></div>';      
                $('#matrix_'+playerMatrixIndex.row+'_'+playerMatrixIndex.col+'_opp').empty().html(str_field);
                return false;
              }
             }  
            $scope.opponentUserTotal =  sum.toFixed(2);//Used to append total score    
          }); 
        });
      }
    },function(error){        
    }); 


  socket.emit('JoinLiveScore',{game_unique_id:$routeParams.gameUniqueId});

  socket.on('RecieveliveScore', function(data){
    if( typeof data == 'object' && data )
    {
      var currentUserLMI = $scope.currentUser.lineup_master_id;
      if( typeof data[currentUserLMI] != 'undefined' )
      {
        var temp = $scope.userLineup;
        var currentUserData = data[currentUserLMI];
        temp.forEach(function(v,k){
          var player_unique_id = v.player_unique_id;
          if( typeof currentUserData == 'object' )
          {
            currentUserData.forEach(function(userlineup,kk){
              if(player_unique_id==userlineup.player_unique_id){
                
                $scope.userLineup[k].score = userlineup.score;
              }
            });
          }
        });
      }
      if( typeof $scope.opponent.lineup_master_id != 'undefined' )
      {
        var oppLMI = $scope.opponent.lineup_master_id;
        if( typeof data[oppLMI] != 'undefined' )
        {
          var opponenettemp = $scope.opponentLineup;
          var opponenetData = data[oppLMI];
          opponenettemp.forEach(function(v,k){
            var player_unique_id = v.player_unique_id;
            if( typeof opponenetData == 'object' )
            {
              opponenetData.forEach(function(opponenetuserlineup,kk){
                if(player_unique_id==opponenetuserlineup.player_unique_id){
                  $scope.opponentLineup[k].score = opponenetuserlineup.score;
                }
              });
            }
          });
        }
      }
      if( typeof data['user_detail'] != 'undefined' )
      {
        var temp_user_detail = data['user_detail'];
        
        temp_user_detail.forEach(function(v,k){
          var lmi = v.lineup_master_id;
          if(typeof $scope.opponentList[lmi] != 'undefined')
            $scope.opponentList[lmi].total_score = Number(v.total_score);
        });
      }
      if( typeof data == 'object' && data )
      {
        $scope.currentUserScoring();
        $scope.showOppoLineup();
      }
    }
  });
  
  //Is used to load more user
  $scope.isLoading == false;
  $scope.moreUser = function(){
    $scope.loadMoreParam = {total:Object.keys($scope.opponentList).length,game_unique_id:$routeParams.gameUniqueId};        
    if ($scope.isLoading == true) {return false;}
    if($scope.gameDetail.size > Object.keys($scope.opponentList).length)
    {
      $scope.isLoading == true;
      //Scoring.loadMoreScoringUser($scope.loadMoreParam).then(function(response)
      commonService.commonApiCall($scope.loadMoreParam,'scoring/get_all_user_detail_scoring_scroll').then(function(response)
      {
          var temp = response.user_detail;
          $.each(temp, function(k, v)
          {
            if ($scope.prizePosition[temp[k].user_id] != undefined) 
            {          
              temp[k]['prizeAmount'] = $scope.prizePosition[temp[k].user_id];
            }
            temp[k].total_score = Number(temp[k].total_score);
            $scope.opponentList[temp[k].lineup_master_id] = temp[k];              
          });        
          $scope.isLoading = false;
          $scope.loadingScoreUser = false;
      }), function(error){}
    }
  };

  //onclick get game price list
  $scope.getGamePriceList = function() 
  {          
      $('#price_list_loader').show();
      //Scoring.getScoringGamePriceList($scope.gameDetail).then(function(response)
      commonService.commonApiCall($scope.gameDetail,'lineup/get_game_price_list').then(function(response)
      {   
        $('#price_list_loader').hide();
        $scope.prizeDistribute        = response.prize_list;
    },function(error){});
  }

  // Function to show player card for scoring
  $scope.showPlayerCardScoring = function(players)
  {
   /* var paramObj = {  
    game_unique_id:             $scope.gameDetail.game_unique_id,
    player_salary_master_id:    $scope.gameDetail.player_salary_master_id,
    game_name:                  $scope.gameDetail.game_name,
    league_id:                  $scope.gameDetail.league_id,
    league_duration_id:         $scope.gameDetail.league_duration_id,
    season_scheduled_date:      $scope.gameDetail.season_scheduled_date,
    season_week_id:             $scope.gameDetail.season_week_id,
    league_drafting_styles_id:  $scope.gameDetail.league_drafting_styles_id,
    league_salary_cap_id:       $scope.gameDetail.league_salary_cap_id,
    size:                       $scope.gameDetail.size,
    entry_fee:                  $scope.gameDetail.entry_fee,
    prize_pool:                 $scope.gameDetail.prize_pool,
    league_number_of_winner_id: $scope.gameDetail.league_number_of_winner_id,
    is_cancel:                  $scope.gameDetail.is_cancel,
    buckets:                    $scope.gameDetail.buckets,
    league_desc:                $scope.gameDetail.league_desc,
    duration_desc:              $scope.gameDetail.duration_desc,
    drafting_styles_desc:       $scope.gameDetail.drafting_styles_desc,
    salary_cap:                 $scope.gameDetail.salary_cap,
    duration_id:                $scope.gameDetail.duration_id,
    drafting_styles_id:         $scope.gameDetail.drafting_styles_id,
    number_of_winner_desc:      $scope.gameDetail.number_of_winner_desc,
    player_unique_id:           players.player_unique_id,
    scoring:                    "true"
    };*/  

    var paramObj = { gameDetail:$scope.game_detail,player_unique_id:players.player_unique_id,scoring:"true"};

    //Scoring.showPlayerCardDetails(paramObj).then(function(response)    
    commonService.commonApiCall(paramObj,'dashboard/get_player_card').then(function(response)
    {  
      console.log(response) ;
      $scope.playerProfile      = response.data.player;
      $scope.playerCard         = response.data.player_card;
      var height                = $scope.playerProfile.height;
      if(height != '' && height != null){
      $scope.numFirst           = height.substr(0,1);
      $scope.numSecond          = height.substr(1,1); 
      }
            
      $scope.numThird           = "";
      if(height>99 && height != '' && height != null)
       {
         $scope.numThird = height.substr(2,1);
      }

      console.log('height',$scope.numSecond);
      openPopDiv("PlayerCardPopup","bounceInDown");
    },function(error){
    });
  };
});

/* Controller Name : Lineup Controller
   Service Name    : commonService */

var myLineupSlider; 

app.controller('lineupController',function($scope,$routeParams,commonService,$location,$timeout,$filter,$compile){
    
    $('.news-ticker').show();   
    
    $('.middle-loader').show();

    var gameUniqueId    = {gameUniqueId : $routeParams.gameUniqueId};

    $scope.imagePath    = imagePath;

    $scope.tpl          = {};

    $scope.directiveVal = {};

    $scope.gameDetail   = {};

    $scope.salaryCapPlrObj    = {};

    $scope.salarySorting = '-salary';

    $scope.league_lineup_position_id  = {};   

    $scope.Lineup_Obj = {};      

    $scope.str = [];

    $scope.tmpPlayerList = {};  
    
    $scope.filteredItem = {};    

    $scope.salaryCapSelecTabFilter = [];

    $scope.Lineup = {};

    $scope.Lineup.team_added = [];

    $scope.selectedTab = "all";

    $scope.deleteIndex = [];

    var salaryCapPlrCnt = [];
      
    var tmpCaptainList = [];    

    $scope.startTime  = new Date().getTime() + 10060*60*1000;

    $scope.sports_desc  = '';
    //Calling LineupGameDetail From Lineup Service
    //LineUp.lineUpGameDetail(gameUniqueId).then(function(response){ 
    commonService.commonApiCall(gameUniqueId,'lineup/game_lineup').then(function(response){//Used to call list of matches team name form searchGame service
    //If time of the game passed then calling scoring template
    if (response.status == 2)
    {
      $location.path('score/'+$routeParams.gameUniqueId);
      return;
    }

    //If game yet to be started then calling lineup template
    if (response.data != undefined) 
    {
      matrixRowCol              = response.data.no_of_rows_cols;
      $scope.tpl.contentUrl = siteUrl+'template/lineup_salarycap';  
    } 
    else 
    {
      return false;
    }

    /*List of response for all the details of lineup needed*/
    $scope.gameDetail             = response.data.game_detail;
    $scope.lineUpMasterID         = response.data.lineup_master_id;
    $scope.playersMatrix          = response.data.players_matrix;
    $scope.teamList               = response.data.team_list;        
    $scope.existing_lineup        = response.data.existing_lineup;
    $scope.siteUrl                = response.data.site_url;
    $scope.directiveVal.startTime = response.data.game_starts_in;        
    $scope.directiveVal.today     = response.data.today;      
    $scope.lineupGameType         = response.data.game_type;
    $scope.entry_fee_new          = '$'+response.data.game_detail.entry_fee;
    $scope.usersProfile           = response.data.user_profile;
    $scope.teamDetail             = response.data.team_detail;
    $scope.tabPosition            = response.data.tab_position;
    $scope.tabPositionSorted      = response.data.tab_position_sorted;
    $scope.allowedPosition        = response.data.allowed_position;
    $scope.playerList             = response.data.players_list;
    $scope.sports_desc     = angular.lowercase(response.data.game_detail.sports_desc);
    // $scope.playerList             = [];
    // var playerList             = response.data.players_list;
    $scope.lineUp                 = response.data.line_up;        
    $scope.updatedSalary          = Number( $scope.gameDetail.salary_cap );        
    $scope.userAlreadyJoined      = response.data.user_already_joined;
    $scope.roster_salary          = $scope.total_salary = 0;
    $scope.total_salary           = Number( $scope.gameDetail.salary_cap );
    $scope.old_descount           = $scope.gameDetail.entry_fee;
    var PER_TEAM_ALLOWED          = response.data.per_team_allowed; 

    angular.forEach($scope.playerList, function (player) {
      player.salary = parseFloat(player.salary);  
      $scope.salaryCapPlrObj[player.player_unique_id] = player;    
    });

    /*angular.forEach($scope.playerList,function(values,key){
      $scope.salaryCapPlrObj[values['player_unique_id']] = $scope.playerList[key];          
    });  */    

    /*$scope.checkIfContinue = function()
    {
      $scope.listedPlayer = Object.keys($scope.playerList).length;
      $scope.old = $scope.lessThan;
      if ($scope.listedPlayer < total_Player) 
      {
        setTimeout(function(){
          console.log("listed player less than total player");  
          $scope.processPlayerList();
        },2000);
      }      
    }

    var total_Player = Object.keys(playerList).length;
    $scope.old = 0
    $scope.processPlayerList = function()
    {
      $scope.lessThan = $scope.old + 50;       
      for (var i = $scope.old; i < $scope.lessThan; i++) 
      {        
        playerList[i].salary = parseFloat(playerList[i].salary);
        $scope.salaryCapPlrObj[playerList[i].player_unique_id] = playerList[i];
        $scope.playerList[i] = playerList[i];
      }
      $scope.checkIfContinue();     
    }
    $scope.processPlayerList();*/
      
    // If lineup already filled then initialize old lineup
    if ($scope.lineUp ) 
    {
      $timeout(function () {                
        $scope.InitializeOldLineUp(); 
      },'500');            
    }

    //Creating Tab Position for lineup
    if($scope.tabPosition != undefined) 
    {
        $.each($scope.tabPosition,function(key,value)
        {
          for (var i = 0; i < Number( value.number_of_players ); i++ )
          {               
            $scope.str.push({lineup_position_name:value.lineup_position_name,league_lineup_position_id:value.league_lineup_position_id});          
          };
        }); 
    }

    //Function used to save lineup
    $scope.lineupSubmit = function()
    {
      $('#lineup_submit_loader').addClass('loaderBtn');
      var total_entry = $( '[data-roster]' ).length;
      var added_entry = $( '[data-add-container]' ).length;
      if ( added_entry < total_entry )
      {
        $('#lineup_submit_loader').removeClass('loaderBtn');
        $scope.showMsg( PLAYER_SELECT_POSITION );
      }
      else
      {
        //Check if lineup is not filled and entry fee is zero then save the lineup else open popup
        if($scope.userAlreadyJoined == true || $scope.gameDetail.entry_fee == '0.00')
        {
          //LineUp.lineupSubmit($('#lineup_submit').serialize()).then(function(response)
          commonService.commonApiCall($('#lineup_submit').serialize(),'lineup/process_user_lineup').then(function(response)
          {       
            if(response.status == true)
            {
              $('#lineup_submit_loader').removeClass('loaderBtn');
              $scope.successMsg( SALARY_CAP_LINE_UP_SUCCESSFULL );
              $scope.lineUpMasterID = response.lineup_master_id;
            }
            else if( response.status == 3 )
            {
              $('#lineup_submit_loader').removeClass('loaderBtn');

            }
          },function(error){        
          }); 
        }
        else
        {
          $('#lineup_submit_loader').removeClass('loaderBtn');
          openPopDiv( 'paymentPopup' , 'bounceInDown' );
        }
      }
      return false;          
    };

    //Remove all attribute after lineup submition
    $scope.lineupEnd = function()
    {
      $( '[data-role=remove]' ).remove();
      $( '[data-role=clear]' ).remove();
      $( '[data-role=add]' ).remove();        
      $( '#lineup_submit' ).remove();        
    }

    //Function for processing fees if lineup yet not submitted or fees is greater than Zero
    $scope.lineupProcessFees = function(){  
      //LineUp.lineupSubmit($('#lineup_submit').serialize()).then(function(response)
      commonService.commonApiCall($('#lineup_submit').serialize(),'lineup/process_user_lineup').then(function(response)
      {       
        if(response.status == true)
        {
          $scope.lineUpMasterID     = response.lineup_master_id;
          $scope.userAlreadyJoined  = response.user_already_joined;
          closePopDiv( 'paymentPopup' , 'bounceInDown' )
          $scope.successMsg( SALARY_CAP_LINE_UP_SUCCESSFULL );
        }
      },function(error){        
      });     
    };
    
    //Function to validate promo code  
    $scope.validatePromoCode = function()
    {
      promo_code = $scope.pcode;     
      var values = {promoCode : $scope.pcode,gameUniqueId : $routeParams.gameUniqueId};      
      if ( promo_code )
      {        
        //LineUp.validatePromoCode(values).then(function(response)
        commonService.commonApiCall(values,'lineup/validate_promo_code').then(function(response)
        {       
          if(response.status == true)
          {
            $scope.entry_fee_new = '$'+response.fees;
            $scope.promoCode     = response.promo_code;
          }
          else
          {           
            $scope.showMsg(response.message);
          }
        },function(error){        
        }); 
      } 
    }
     
    $scope.selectedPositionSalaryCap = function (index, lineupPositionId) 
    {        
        $(".all_pos").hide(); 
        $scope.salaryCapSelecTabFilter = [];         
        index = (index == undefined) ? 'all' : index;
        $scope.selectedTab= index;           
   
        if (index == 'all') 
        {
          $("tbody").animate({ scrollTop: 0 }, "slow");
          $(".all_pos").show();        
        } 
        else 
        {              
            $("tbody").animate({ scrollTop: 0 }, "slow");
            var allowed_position_name_array = $scope.position_validation[index].allowed_position_name.split( ',' );                          
            $.each(allowed_position_name_array, function(key, val)
            {
                 $("."+val+"_pos").show();
                 $scope.salaryCapSelecTabFilter.push(val);
            });
        }      
        var ths = $('#filterText_salcap');        
        $scope.SearchPlayerNameSalaryCap(ths );                
    }

    // Function to initialize position 
    $scope.InitializePositions = function()
    {
      $scope.position_validation = {};
      if ($scope.tabPositionSorted != undefined) 
      {
          $.each( $scope.tabPositionSorted , function( key , value )
          {
          var temp = $scope.allowedPosition[ key ];
          var league_lineup_position_id = value.league_lineup_position_id;
          if ( league_lineup_position_id == temp.league_lineup_position_id )
          {
            $scope.position_validation[ value.lineup_position_name ] = value;
            $scope.position_validation[ value.lineup_position_name ][ 'allowed_position_name' ] = temp.position_name;
          }
        });
      }
    }

    //Calling Initialize Position when page loads
    $scope.InitializePositions();

    //Function to process player
    $scope.ProcessPlayerToAdd = function(obj)
    {
      $scope.player_unique_id         = obj.player_unique_id;    
      $scope.season_game_unique_id    = obj.season_game_unique_id;        
      var index                       = obj.player_unique_id;
      $scope.player_name              = obj.full_name;

      if( $scope.selectedTab == 'all' )
      {
        $scope.isAvailableParentPosition( index );
      }
      else
      {
        $scope.isAvailableChildPosition( index , $scope.selectedTab );     
      }
    }        

    //Function to check position available or not for child
    $scope.isAvailableChildPosition = function( index)
    {
      var temp = {};     
      $.each( $scope.position_validation , function( key , value )
      {      
        if ( value.lineup_position_name == $scope.selectedTab )
        {
          temp = value;
          return false;
        }
      });
      var available = $scope.isPositionAvailable( temp.league_lineup_position_id , temp.number_of_players );
      if ( available )
      {
        $scope.IsAllowedPlayerWithTeam( temp.league_lineup_position_id , index );
        return false;
      }
      else
      {
        $scope.showMsg( "Player cannot be added - all '" + temp.lineup_position_name + "' positions are filled." );
        return false;
      }
    }

    //Function to check position available or not for parent
    $scope.isAvailableParentPosition = function( index )
    {
      var p    = $scope.getPlayerObjectFromPlayerList( index );
      var temp = $scope.position_validation[ p.position ];
      if ( temp != undefined )
      {
        var available = $scope.isPositionAvailable( temp.league_lineup_position_id , temp.number_of_players );
        if ( available )
        {
          $scope.IsAllowedPlayerWithTeam( temp.league_lineup_position_id , index );
          return false;          
        }
      }
      $scope.isAvailableOnOtherPosition( index );
    }

    //Function to check position available on other position
    $scope.isAvailableOnOtherPosition =function( index )
      {
        var p                =  $scope.getPlayerObjectFromPlayerList( index );
        var player_positions = p.position;
        var is_error         = true;
        $.each(  $scope.position_validation , function( key , value )
        {
          var allowed_position_name_array = value.allowed_position_name.split( ',' );
          var number_of_players           = value.number_of_players;
          var league_lineup_position_id   = value.league_lineup_position_id;
          if ( allowed_position_name_array.indexOf( player_positions ) != -1 )
          {
            var available =  $scope.isPositionAvailable( league_lineup_position_id , number_of_players );
            if ( available )
            {
              is_error = false;
              $scope.IsAllowedPlayerWithTeam( league_lineup_position_id , index );
              return false;  
            }
          }
        });
        if ( is_error )
        {
          $scope.showMsg( "Player cannot be added - all '" + p.position + "' positions are filled" );
          return false;
        }
        return false;
      },

    //Get list of player object from player list
    $scope.getPlayerObjectFromPlayerList =function( player_unique_id )
    {          
      var p =  $scope.salaryCapPlrObj[player_unique_id]    
      return p;
    }
    
    //Used to check whether the position avalibale or not
    $scope.isPositionAvailable = function( a  , t )
    {
      return $( '.roster-'+a ).length < t;
    }

    //Used to check the list of players allowed with team  
    $scope.IsAllowedPlayerWithTeam = function( container , index )
    {
      var p         = $scope.getPlayerObjectFromPlayerList( index );    
      var team      = p.team_abbreviation;
      var now_added = PER_TEAM_ALLOWED;
      if ( ! $scope.Lineup.hasOwnProperty( 'team_added' ) )
      {
        $scope.Lineup.team_added = [];
      }
      if ( ! $scope.Lineup.hasOwnProperty( team ) )
      {
        $scope.Lineup[ team ] = 0;
        $scope.Lineup.team_added.push( team );
      }
      now_added = $scope.Lineup[ team ];
      
      if ( PER_TEAM_ALLOWED <= now_added )
      {
        
        $scope.showMsg( PLAYER_ATLEAST_THREE );
        
        return false;
      }
      else
      {
        now_added = Number( $scope.Lineup[ team ] ) + 1;
        $scope.Lineup[team] = now_added;
      }
      $scope.canAddPlayerSalaryCap( container , index );
    }

    // Used to see whether the salary cap exceeds limit or not  
      $scope.canAddPlayerSalaryCap = function( container , index )
      {
        var p = $scope.getPlayerObjectFromPlayerList( index );
        if ( ( Number( p.salary ) + $scope.roster_salary ) > $scope.total_salary )
        {
          $scope.showMsg( SALARY_CAP_LIMIT );
          return false;
        }
        else
        {
          $scope.updateSalaryCapDisplay( index );
          $scope.AddPlayer( container , index );
        }
      }

      // Used to update the total salary cap remaining to create the lineup
      $scope.updateSalaryCapDisplay = function( index )
      {
        var p = $scope.getPlayerObjectFromPlayerList( index );                       
        $scope.updatedSalary = $scope.format_salary(  $scope.total_salary - ( $scope.roster_salary + Number( p.salary ) ) ) ;
        $scope.roster_salary = $scope.roster_salary + Number ( p.salary );
        return false;
      }

      $scope.selectedItems = [];

      //Used to remove player from lineup
      $scope.removePlayerLineup = function(index)
      {
        var index             = index;
        var p                 = $scope.getPlayerObjectFromPlayerList( index );
        var player_unique_id  = p.player_unique_id;
        var team              = p.team_abbreviation;
        var now_added         = Number( $scope.Lineup[ team ] ) - 1;
        $scope.Lineup[ team ] = now_added;
        $('[data-tmp-remove="'+player_unique_id+'"]').each(function()
        {
          $( this ).remove();
        });
        
        $( '[data-field-view='+player_unique_id+']' ).remove();
        $( '[data-add-container='+player_unique_id+']' ).remove();
        $( 'input[value="'+player_unique_id+'"]' ).remove();
        $scope.updatedSalary =  $scope.format_salary(  $scope.total_salary - ( $scope.roster_salary - Number( p.salary ) ) );
        $scope.roster_salary = $scope.roster_salary - Number ( p.salary );
        if ($scope.selectedTab == 'all')
        {
          $( '[data-player-container='+player_unique_id+']' ).removeClass( 'rosterFilterApplied' ).show();         
        } 
        else 
        {
          var allowed_position_name_array = $scope.position_validation[$scope.selectedTab].allowed_position_name.split( ',' );
          $.each(allowed_position_name_array, function(key, allowed_position){
            if (p.position == allowed_position) 
            {
              $( '[data-player-container='+player_unique_id+']' ).removeClass( 'rosterFilterApplied' ).show();            
            } 
            else 
            {
              $( '[data-player-container='+player_unique_id+']' ).removeClass( 'rosterFilterApplied' );            
            }
          });
        }
        return false;                  
      }

      //Function to remove player from field view
      $scope.removePlayerField = function ( player_unique_id )
      {          
        $timeout(function() 
        {
          angular.element('[data-add-container='+player_unique_id+'] .close').trigger('click');

        }, 100);
        return false; 
      }
      
     $scope.deleteIndex = [];
      var salaryCapPlrCnt = [];
      var tmpCaptainList = [];

      //salary cap lineup
      $scope.AddPlayer =function ( container , index )
      {
        //console.log($scope.position_validation);
        //console.log($scope.playersMatrix);
        $scope.AddPlayerDetail( container , index );
        var p                = $scope.getPlayerObjectFromPlayerList( index );
        //console.log('-',p);
        var player_unique_id = p.player_unique_id;

        var obj =  $('li.roster-container-'+container+':not(:has(aside.roster-'+container+'))')[0].attributes[ 'data-roster' ].value;
        var str =  '<aside data-add-container="'+player_unique_id+'" class="roster-'+container+' list-right lineup-selected-block"><span class="player-name" data-player="'+p.player_unique_id+'"><label>'+p.full_name+'</label></span><span class="team-salary"><label>'+p.team_abbreviation+'$'+$scope.format_salary(p.salary)+'</label></span><span class="action"><a class="close" href="javascript:void(0);"  data-index="'+index+'" data-role="remove" ng-click=\'removePlayerLineup("'+player_unique_id+'")\'>X</a></span></aside>';          
        $( "[data-roster="+obj+"]" ).append($compile(str)($scope));

        //Used for adding players in field view starts
        var str_field =  '';
        var added = false;
            // var temp = v.allowed_position_name.split(',');
            angular.forEach($scope.playersMatrix, function(vv,kk){
              // console.log(temp);
              //console.log(vv.position_name);
                if(vv.position_name == p.position){
                var ele_id= "";
                ele_id= vv.row+'_'+vv.col;
                if($('#matrix_'+ele_id).html() == ""&&!added)
                {
                  added = true;
                  str_field =  '<div data-field-view="'+player_unique_id+'" data-field-team="'+p.team_abbreviation+'" class="player"><span class="jerseyicon"><i class="jersey-own"></i></span><span class="player-details"><label class="position-name">'+p.position+'</label><label class="player-score">'+$scope.format_salary(p.salary)+'</label></span> <span class="player-name"><label>'+p.full_name+'</label></span><span class="close"><a href="javascript:void(0);" ng-click=\'removePlayerField("'+player_unique_id+'")\'>X</a></span></div>';
                  //console.log(ele_id);
                  // console.log(v.league_position_id);
                  //console.log(vv.position_name);
                  $('#matrix_'+ele_id).html( $compile(str_field)($scope));
                  return false;
                }
              }
            });

        //Used for adding players in field view ends  
        $( '[data-player-container='+player_unique_id+']' ).addClass( 'rosterFilterApplied' ).hide();
        return false;
      }

      //salary cap lineup
      $scope.isAvailableOnOtherPosition =function( index )
      {
        var p                =  $scope.getPlayerObjectFromPlayerList( index );
        var player_positions = p.position;
        var is_error         = true;
        $.each(  $scope.position_validation , function( key , value )
        {
          var allowed_position_name_array = value.allowed_position_name.split( ',' );
          var number_of_players           = value.number_of_players;
          var league_lineup_position_id   = value.league_lineup_position_id;
          if ( allowed_position_name_array.indexOf( player_positions ) != -1 )
          {
            var available =  $scope.isPositionAvailable( league_lineup_position_id , number_of_players );
            if ( available )
            {
              is_error = false;
              $scope.IsAllowedPlayerWithTeam( league_lineup_position_id , index , value.league_position_id );
              return false;
            }
          }
        });
        if ( is_error )
        {
          $scope.showMsg( "Player cannot be added - all '" + p.position + "' positions are filled" );
          return false;
        }
        return false;
      },

      //Function to search list of players
      $scope.SearchPlayerNameSalaryCap = function ( ths ) 
      {    
        var text  = $('#filterText_salcap').val().toLowerCase() ;

        var items = "";
        if ($scope.selectedTab == 'all')
        {
          var items = $( '[data-player-container]' );
        } 
        else 
        {                              
            if (parseInt($scope.salaryCapSelecTabFilter.length) >= 1) 
            {               
              var cls_str = "";               
              for(var i=0;i < $scope.salaryCapSelecTabFilter.length; i++)
              {   
                  cls_str += '.'+$scope.salaryCapSelecTabFilter[i]+'_pos'+',';                   
              } 
              var lastChar = cls_str.slice(-1);
              
              
              if(lastChar == ',') {
                var removeLastComma = cls_str.slice(0, -1);                  
                var items = $(removeLastComma);
              }                           
            } else {                
               items = $( '.'+$scope.selectedTab+'_pos');
            } 
        }
        
        ( text ) ? $( '#clear_search' ).show() : $( '#clear_search' ).hide();          
        items.hide();
        //show only those matching user input:
        items.filter(function () {
        if ( $( this ).hasClass( 'rosterFilterApplied' ) ) return;
          var FirstLetterArray = $( this ).find( ".player_name" ).text().toLowerCase().split( '' );
          return $( this ).find( ".player_name" ).text().toLowerCase().indexOf( text ) != -1;
        }).show();
      }
  
      // Function to add details of player
      $scope.AddPlayerDetail = function( container , index )
      {
        var p                               = $scope.getPlayerObjectFromPlayerList( index );
        var player_unique_id                = p.player_unique_id;
        var player_input                    = $( '<input type="hidden" data-tmp-remove="'+player_unique_id+'" name="player_unique_id[]" value="'+player_unique_id+'" />' );
        var season_game_input               = $( '<input type="hidden" data-tmp-remove="'+player_unique_id+'" name="season_game_unique_id[]" value="'+p.season_game_unique_id+'" />' );
        var league_lineup_position_id_input = $( '<input type="hidden" data-tmp-remove="'+player_unique_id+'" name="league_lineup_position_id_'+player_unique_id+'" value="'+container+'" />' );
        var salary_id_input                 = $( '<input type="hidden" data-tmp-remove="'+player_unique_id+'" name="player_salary_'+player_unique_id+'" value="'+p.salary+'" />' );
        $( '.temp_remove' ).remove();
        $( '#input_container' ).append( player_input ).append( salary_id_input ).append( league_lineup_position_id_input ).append( season_game_input );
      }

      $scope.format_salary = function( formattedsalary )
      {
        formattedsalary = formattedsalary.toString().replace( /(^\d{1,3}|\d{3})(?=(?:\d{3})+(?:$|\.))/g , '$1,' );
        return formattedsalary;
      }

      $scope.showMsg = function( msg )
      {
        $( '#error_message .msg' ).empty().append( msg );
        ShowMessage( 'error_message' , 'bounceInDown' );
        setTimeout( function (){ CloseMessage( 'error_message' , 'bounceOutUp' ); } , 3000 );
      }

      $scope.successMsg = function( msg )
      {
        $( '#success_message .msg' ).empty().append( msg );
        ShowMessage( 'success_message' , 'bounceInDown' );
        setTimeout( function (){ 
          CloseMessage( 'success_message' , 'bounceOutUp' ); 
        } , 3000 );
      }
    },function(error){        
    });

    //Function to initialize old lineup
    $scope.InitializeOldLineUp = function ()
    {
      $.each( $scope.lineUp , function( key , value ) {

        var player_unique_id          = value.player_unique_id;
        var league_lineup_position_id = value.league_lineup_position_id;
        var index                     = player_unique_id;
        var p         = $scope.getPlayerObjectFromPlayerList( player_unique_id );
        var team      = p.team_abbreviation;

        if ( ! Lineup.hasOwnProperty( 'team_added' ) )
        {
          $scope.Lineup[ 'team_added' ] = [];
        }

        if ( ! $scope.Lineup.hasOwnProperty( team ) )
        {
          $scope.Lineup[ team ] = 0;
          $scope.Lineup[ 'team_added' ].push( team );
        }

        now_added = $scope.Lineup[ team ];
        now_added = Number( $scope.Lineup[ team ] ) + 1;
        $scope.Lineup[team] = now_added;

        $scope.canAddPlayerSalaryCap( league_lineup_position_id , index );
      });
    }

    //Function to remove list of all player when clicked on remove all
    $scope.removeAll = function(e)
    {
      alertify.confirm( "Are you sure you want to clear all players from your team?" , function( e )
      {
        if ( e )
        {
           $timeout(function() {
              angular.element('.close').trigger('click');
              angular.element('.omo_close').trigger('click');
            }, 100);
        }
      });
      return e;
    }  

    //onclick get game price list from both lineup
    $scope.getGamePriceList = function() 
    {         
        $('#price_list_loader').show();       
        commonService.commonApiCall($scope.gameDetail,'lineup/get_game_price_list').then(function(response)
        {   
          $('#price_list_loader').hide();
          $scope.prizeDistribute        = response.prize_list;
      },function(error){});
    }

    // Function to get player card details
    $scope.showPlayerCard = function(players,type)
    {      
      var paramObj = {game_detail:$scope.gameDetail,player_unique_id:players.player_unique_id,lineup:"true"} ;

      //LineUp.showPlayerCardDetails(paramObj).then(function(response)    {  
      commonService.commonApiCall(paramObj,'dashboard/get_player_card').then(function(response){   
        $scope.playerProfile      = response.data.player;
        $scope.playerCard         = response.data.player_card;
        var height                = $scope.playerProfile.height;
        $scope.numFirst           = height.substr(0,1);
        $scope.numSecond          = height.substr(1,1);
        $scope.numThird           = "";
        if(height>99)
        {
          $scope.numThird=height.substr(2,1);
        }
        //$scope.otherDetails=response.data.all;
        openPopDiv("PlayerCardPopup","bounceInDown");
    },function(error){
    });
  };
});



app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){  
  
    $routeProvider.when('/',
    {
        //templateUrl:siteUrl+'template/home',
        controller:'homeController'
    });
     $routeProvider.when('/forgotpasswordcode/:link',
    {
        //templateUrl:siteUrl+'template/home',
        controller:'homeController'
    });
    $routeProvider.when('/dashboard',
    {
       // templateUrl:siteUrl+'template/home',
        controller:'homeController'
    });

    $routeProvider.when('/lobby',
    {
        templateUrl:siteUrl+'template/lobby',
        controller:'lobbyController'
    });

    $routeProvider.when('/score/:gameUniqueId',
    {
        templateUrl:siteUrl+'template/scoring',
        controller:'scoringController'
    });
    $routeProvider.when('/line-up/:gameUniqueId',
    {
        templateUrl:siteUrl+'template/lineup',
        controller:'lineupController'
    });
    $routeProvider.when('/add-drop/:gameUniqueId',
    {
        templateUrl:siteUrl+'template/add_and_drop',
        controller:'addanddropcontroller'
    });
    $routeProvider.when('/mygames',
    {
        templateUrl:siteUrl+'template/mygames',
        controller:'mygamesController'
    });
    $routeProvider.when('/finance',
    {
        templateUrl:siteUrl+'template/finance',
        controller:'financeController'
    });
    $routeProvider.when('/invitation',
    {
        templateUrl:siteUrl+'template/invitation',
        controller:'myInvitesController'
    });
    $routeProvider.when('/myprofile',
    {
        templateUrl:siteUrl+'template/my-profile',
        controller:'profileController'
    });
    $routeProvider.when('/creategame',
    {
        templateUrl:siteUrl+'template/creategame',
        controller:'createGameController'
    });
    $routeProvider.when('/aboutus',
    {
        templateUrl:siteUrl+'template/aboutus',
        controller:'aboutUsController'
    });
    $routeProvider.when('/faq',
    {
        templateUrl:siteUrl+'template/faq',
        controller:'faqController'
    });
    $routeProvider.when('/privacypolicy',
    {
        templateUrl:siteUrl+'template/privacypolicy',
        controller:'privacyPolicyController'
    });
    $routeProvider.when('/contactus',
    {
        templateUrl:siteUrl+'template/contactus',
        controller:'contactUsController'
    });
    $routeProvider.when('/howitworks',
    {
        templateUrl:siteUrl+'template/howitworks',
        controller:'howItWorksController'
    });
    $routeProvider.when('/games',
    {
        templateUrl:siteUrl+'template/games',
        controller:'gamesController'
    });
    $routeProvider.when('/rules',
    {
        templateUrl:siteUrl+'template/rules',
        controller:'rulesController'
    });
    $routeProvider.when('/terms',
    {
        templateUrl:siteUrl+'template/terms',
        controller:'termsController'
    });

    /*$routeProvider.otherwise({
        templateUrl:siteUrl+'template/lobby',
        controller:'lobbyController'
      });*/
    $locationProvider.html5Mode(true);
  }
]);





// Controller to view to list of request
app.controller('mygamesController', ['$scope', '$http','myGamesService','commonService',function($scope,$http,myGamesService,commonService){
   
    $scope.searchgame = {};
    $scope.sportIds = 0;
    $scope.searchgame.limit     = 10;
    $scope.searchgame.total     = 0;
    $scope.searchgame.start     = 0;
    $scope.searchgame.pageno     = 0;
    $scope.searchgame.order_sequence ='ASC' ;
    $scope.searchgame.order_by = 'game_name';
    $scope.searchgame.order_class = 'icon-down-arrw';
    $scope.searchgame.leagueType = {};
    $scope.searchgame.contest = {};
    //$scope.searchgame.gameType ={};
   
    $scope.searchgame.gametab = 0;
    
    $scope.myGamesCreatedEmpty = MY_GAMES_CREATED_BY_ME_EMPTY;
    $scope.myGamesEnteredEmpty = MY_GAMES_JOINED_BY_ME_EMPTY; 

    $scope.mygameresults = []; 
   var values=[];
    commonService.commonApiCall(values,'dashboard/my_games').then(function(response){  
      
        $scope.sports_list              = response.sports_list
        $scope.leagueList               = response.league_list;
        $scope.myGamesList              = response.my_games_record;
        $scope.leagueTypeList           = response.league_type_list;
        $scope.gameTypeList             = response.game_type_list;
        $scope.countRecord              = response.participants_count;      
        $scope.selectionCreateType      = 0 ;

    },function(error){
    });

   $scope.filtergame = function(action,value){
      
     var parmArry = '';

     if(action == 'game_name_orderby')
     {
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
       if(action == 'game_date_audienca'){

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

     if(action == 'soprtType' && value > 0 ){
        $scope.sportIds = value;
        $scope.searchgame.sportsid  = value;
        $scope.searchgame.leagueIds  = 0;
        $scope.searchgame.elecount = $('[data-rel="'+value+'"]').length;
     }
     else if(action == 'soprtType'&&  value == 0){
        $scope.sportIds = 0;
        $scope.searchgame.sportsid  = 0;
        $scope.searchgame.leagueIds  = 0;
     }

     if(action == 'leaugeIds' && value > 0 ){
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


    if(action == 'gameTypetab'){

       $scope.searchgame.gametab = value;
    }

    if(action == 'start_page'){
          $scope.searchgame.start = value;
    }

    if(action == 'soprtType' || action == 'leaugeIds' || action == 'leagueType' || action == 'contest' || action == '' ){
          $scope.searchgame.start = 0;
      }
     
     parmArry  = $scope.searchgame;
     
     
      commonService.commonApiCall(parmArry,'dashboard/my_games_filter').then(function(response){   
       if(response.status){

            $scope.searchgame.data_length = response.data.my_games_record.length;
            $scope.searchgame.limit = 10;
            $scope.searchgame.start = response.start; 
            $scope.searchgame.total =  response.total;
            $scope.mygameresults = response.data.my_games_record;
            //console.log($scope.searchgame.data_length);
         }else{
           $scope.mygameresults = [];
         }
      },function(error){        
      }); 
   }

    $scope.SetPagingAct = function(text, page){
            //console.log((page-1) * $scope.searchgame.limit);
            var start_page = (page-1) * $scope.searchgame.limit;
            $scope.filtergame('start_page', start_page);
    };

    $scope.filtergame('soprtType',0);

    $scope.get_game_details= function(game_unique_id){
      
      angular.element('#GameDetailsCount').empty();
      $scope.param = {game_unique_id:game_unique_id};
      $scope.gameDetailsList = {};
      commonService.commonApiCall($scope.param,'dashboard/get_game_detail').then(function(response){ 
         $scope.gameDetailsList = response.game_detail;
         $scope.entrantsList = response.participants_detail;
         //console.log($scope.entrantsList);
         $scope.teamDetail  = response.team_detail;
         var timestamp                   = $scope.gameDetailsList.game_starts_in;
         var from                        = $scope.gameDetailsList.today;
         //console.log($scope.gameDetailsList);
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
      commonService.commonApiCall($scope.param,'dashboard/get_participant_profile_popup').then(function(response)    { 
         
         //console.log(response);
         $scope.participantProfile = response.participant_profile;
         $scope.participantLocation = response.participant_profile.state_name+','+response.participant_profile.country_name;
         
         openPopDiv('MyProfilePopup', 'bounceInDown');
         },function(error){
      });   

    }

}]);

  app.controller('financeController', function($scope,$http,commonService,$timeout)
  {  
    $('.news-ticker').show();
    var values=[];
    $scope.Deposite_Obj = {};
    response = false;
    $scope.param = {};
    $scope.withdrawform = {};
    $scope.checkform = {};
    $scope.stateList = [];
    $scope.depositeFormUrl = siteUrl+'paypal/Set_express_checkout';
    $scope.withdrawPaypalFormUrl = siteUrl+'paypal/withdrawal_paypal_request_send';
    $scope.withdrawCheckFormUrl = siteUrl+'paypal/live_check_request';

    
    commonService.commonApiCall($scope.param,'dashboard/get_state_list').then(function(response){      
      $scope.stateList = response.data;
      $scope.stateList = response.data.states;      
      $scope.stateList.unshift({name:'State/Province',abbreviation:'0'});     
       $timeout(function(){
          $('#paypal_state').val('0').trigger("chosen:updated");
       },1000);          
    });

    $scope.changeSate = function(obj)
    {
      $scope.paypal_state_val = obj;
    };

    $scope.ValidatePaypalDeposite = function($form)
    {

      
      $( '.amt-err,.paypal-err').hide();
      $scope.paypal_amount_error = $scope.paypal_state_error = "";
      $scope.Deposite_Obj.response = true;      
      $( '#pp_deposite_submit , #pp_deposite_loader' ).toggle();

      var paypal_amount = Number( $('#paypal_amount').val() );
      paypal_amount = (paypal_amount == 0 ) ? '' : paypal_amount; 
      if( paypal_amount > DEPOSIT_AMOUNT_MAX_LIMIT )
      {
        $scope.Deposite_Obj.response = false;
        // $( '#paypal_amount_error' ).empty().append( DEPOSIT_AMOUNT_MAX_LIMIT_ERROR+DEPOSIT_AMOUNT_MAX_LIMIT ).show();
        $scope.paypal_amount_error = DEPOSIT_AMOUNT_MAX_LIMIT_ERROR+DEPOSIT_AMOUNT_MAX_LIMIT;
      }
      else if( paypal_amount < DEPOSIT_AMOUNT_MIN_LIMIT )
      {
        $scope.Deposite_Obj.response = false;
        // $( '#paypal_amount_error' ).empty().append( DEPOSIT_AMOUNT_MIN_LIMIT_ERROR+DEPOSIT_AMOUNT_MIN_LIMIT ).show();
        $scope.paypal_amount_error = DEPOSIT_AMOUNT_MIN_LIMIT_ERROR+DEPOSIT_AMOUNT_MIN_LIMIT;
      }

      $scope.validate( paypal_amount , 'empty' , 'paypal_amount_error' , REQUIRED_DEPOSITE_ERROR );
      $scope.validate( paypal_amount , 'decimal' , 'paypal_amount_error' , VALID_AMOUNT_ERROR );

      $scope.paypal_state_val = ($scope.paypal_state_val == 'State/Province') ? '' : $scope.paypal_state_val;
 
      $scope.validate( $scope.paypal_state_val , 'empty' , 'paypal_state_error' , REQUIRED_STATE_ERROR );

      if ( ! $scope.Deposite_Obj.response ) $( '#pp_deposite_submit , #pp_deposite_loader' ).toggle();

       

       if ($scope.Deposite_Obj.response == true) {
          $('#paypal_state').val($scope.paypal_state_val);
          $form.commit();
       } else {
          return false;
       }
    };

    $scope.validate = function( obj_value , type , error_container , error_msg )
    {
      // var obj_value = $( '#'+obj ).val();
      var expr = "";

      switch ( type )
      {
        case "date"     : expr = /^[0-2]{0,1}([1-9]|30|31)\/0{0,1}([0-9]|11|12)\/[0-9]{4,4}$/; break;
        case "email"    : expr = /^(.)+@{1,1}((.)+\.(.)+)+$/; break;
        case "integer"    : expr = /^[0-9]*$/; break;
        case "decimal"    : expr = /^[0-9]*\.{0,1}[0-9]*$/; break;
        case "username"   : expr = /^([a-z]|[A-Z]|[0-9])*$/; break;
        case "password"   : expr = /^([a-z]|[A-Z]|[0-9])*$/; break;
        case "string"     : expr = /^([a-z]|[A-Z]|[ ]|[.])*$/; break;
        case "phonenumber"  : expr = /^([0-9]|[ ]|[+]|[-])*$/; break;
        case "threechar"  : expr = /^.{3,4}$/; break;
        case "char12-20"  : expr = /^.{12,20}$/; break;
        case "uptwo"    : expr = /^\d{0,6}(\.\d{0,2})?$/; break;
        case "empty"    : expr = /([^\s])/; break;
      }

      if( expr != "" )
      {
        if ( !expr.test( $.trim ( obj_value ) ) )
        {
          $scope.Deposite_Obj.response = false;          
          $scope.ShowErrorFiled( error_container , error_msg );
        }
        else
        {
          return null;
        }
      }
      else
      {
        $scope.Deposite_Obj.response = false;
        return false;
      }
    };

    $scope.ValidatePaypalTransfer  = function($form)
    {
      $scope.Deposite_Obj.response = true;
      $( '.error' ).hide();
      $( '#paypal_transfer_submit , #paypal_transfer_loader' ).toggle();

      $scope.validate( $('#withdrawl_amount').val() , 'empty' , 'withdrawl_amount_error' , REQUIRED_WITHDRAWL_ERROR );
      $scope.validate( $('#withdrawl_amount').val() , 'decimal' , 'withdrawl_amount_error' , VALID_AMOUNT_ERROR );

      if ( $scope.validate( $('#withdrawl_paypal_id').val() , 'empty' , 'withdrawl_paypal_id_error' , REQUIRED_PAYPAL_EMAIL ) === null )
        $scope.validate( $('#withdrawl_paypal_id').val() , 'email' , 'withdrawl_paypal_id_error' , PAYPAL_INVALID_EMAIL );

      if ( ! $scope.Deposite_Obj.response ) {
        $( '#paypal_transfer_submit , #paypal_transfer_loader' ).toggle()
      }
      
      if ($scope.Deposite_Obj.response == true) {                         
        commonService.commonApiCall( $scope.withdrawform,'paypal/withdrawal_paypal_request_send').then(function(response){      
                  $('#paypal_transfer_loader').hide();
                  $('#paypal_transfer_submit').show();                  
                   if (response.is_error == false) 
                   {
                      showSuccessMsg(response.msg);
                      $scope.withdrawform = {};                      
                   }
                   else
                   {
                      showErrMsg( response.msg );
                   }
          });
        // $form.commit();
      } else {      
        return false;
      }
    };

    $scope.ValidateLiveCheckWithdrawal = function($form)
    {
      $scope.Deposite_Obj.response = true;
      $( '.error' ).hide();
      $( '#live_check_submit , #live_check_loader' ).toggle();

      $scope.validate( $('#live_check_amount').val() , 'empty' , 'live_check_amount_error' , REQUIRED_WITHDRAWL_ERROR );
      $scope.validate( $('#live_check_amount').val() , 'decimal' , 'live_check_amount_error' , VALID_AMOUNT_ERROR );

      $scope.validate( $('#live_check_address').val() , 'empty' , 'live_check_address_error' , REQUIRED_WITHDRAWL_ADDRESS_ERROR );

      if ( ! $scope.Deposite_Obj.response ) {
        $( '#live_check_submit , #live_check_loader' ).toggle()
      }
      
      if ($scope.Deposite_Obj.response == true) {                 
         commonService.commonApiCall( $scope.checkform,'paypal/live_check_request').then(function(response){      
                  $('#live_check_loader').hide();
                  $('#live_check_submit').show();                  
                   if (response.is_error == false) 
                   {
                      showSuccessMsg(response.msg);
                      $scope.checkform.live_check_amount = "";                                          
                   }
                   else
                   {
                      showErrMsg( response.msg );
                   }
          }); 
        // $form.commit();
      } else {      
        return false;
      }
    };

    $scope.ShowErrorFiled = function ( error_container , error_msg )
    {
      
      switch(error_container) 
      {
        case 'paypal_amount_error':
          $scope.paypal_amount_error = error_msg;
          $( '.amt-err').show();
        break
        case 'paypal_state_error':
          $scope.paypal_state_error = error_msg;
          $( '.paypal-err').show();
        break; 
        case 'withdrawl_amount_error':
          $scope.withdrawl_amount_error = error_msg;
          $( '.with-amt-err').show();
        break;
        case 'withdrawl_paypal_id_error':
          $scope.withdrawl_paypal_id_error = error_msg;
          $( '.with-paypalid-err').show();
        break;
        case 'live_check_amount_error':
          $scope.live_check_amount_error = error_msg;
          $( '.live-amt-err').show();
        break;
        case 'live_check_address_error':
          $scope.live_check_address_error = error_msg;
          $( '.live-paypalid-err').show();
        break;
      }
    }

   $scope.transactionHistory = {};
   $scope.transactionHistory.limit     = 10;
   $scope.transactionHistory.total     = 0;
   $scope.transactionHistory.start     = 0;
   $scope.transactionHistory.pageno     = 0;
   $scope.transactionHistory.order_sequence ='DESC';
   $scope.transactionHistory.order_by = 'payment_history_transaction_id';
   $scope.transactionHistory.order_class = 'icon-up-arrw';
    
    // get payment history data
    $scope.getTrasactionHistory = function(action,value) {
   

      if(action == 'start_page'){
         $scope.transactionHistory.start = value;
      }
      if(action == 'short_transaction_id'){
           if(value == 'ASC'){
               $scope.transactionHistory.order_by = 'payment_history_transaction_id';
               $scope.transactionHistory.order_sequence ='DESC';
               $scope.transactionHistory.order_class = 'icon-up-arrw'; 
            }else{
              $scope.transactionHistory.order_by = 'payment_history_transaction_id';
              $scope.transactionHistory.order_sequence ='ASC';
              $scope.transactionHistory.order_class = 'icon-down-arrw'; 
            }
            
        }

       if(action == 'short_transaction'){

          if(value == 'ASC'){
               $scope.transactionHistory.order_sequence ='DESC';
               $scope.transactionHistory.order_class    = 'icon-up-arrw';
               $scope.transactionHistory.order_by       = 'date_added_format';

            }else{
              $scope.transactionHistory.order_sequence ='ASC';
              $scope.transactionHistory.order_by = 'date_added_format';
              $scope.transactionHistory.order_class = 'icon-down-arrw'; 
            }

        }

        if(action == 'short_description'){

          if(value == 'ASC'){
               $scope.transactionHistory.order_sequence ='DESC';
               $scope.transactionHistory.order_class    = 'icon-up-arrw';
               $scope.transactionHistory.order_by       = 'description';

            }else{
              $scope.transactionHistory.order_sequence ='ASC';
              $scope.transactionHistory.order_by = 'description';
              $scope.transactionHistory.order_class = 'icon-down-arrw'; 
            }

        }
          if(action == 'short_entrants'){

          if(value == 'ASC'){
               $scope.transactionHistory.order_sequence ='DESC';
               $scope.transactionHistory.order_class    = 'icon-up-arrw';
               $scope.transactionHistory.order_by       = 'short_entrants';

            }else{
              $scope.transactionHistory.order_sequence ='ASC';
              $scope.transactionHistory.order_by = 'description';
              $scope.transactionHistory.order_class = 'icon-down-arrw'; 
            }

        }


        var values = $scope.transactionHistory;

        //make call to server        
        commonService.commonApiCall( values,'dashboard/transaction_history').then(function(response){   
        console.log(response);  
             $scope.transactionData                   = response.data;
             $scope.transactionHistory.total          = response.total;
             $scope.transactionHistory.start          = response.start;
             $scope.transactionHistory.order_sequence = response.order_sequence;
             $scope.transactionHistory.order_by       = response.field_name;
          
        },function(error){
        });

        
    }
   
$scope.SetPagingAct = function(text, page){
        //console.log((page-1) * $scope.searchgame.limit);
          var start_page = (page-1) * $scope.transactionHistory.limit;
          $scope.getTrasactionHistory('start_page',start_page);
};

    // $scope.getTrasactionHistory(true);    
});

app.directive('counterDirect', function ($timeout) { 
    return{
        restrict: 'E',        
        replace: true,
        link: function (scope, element, attrs) {
            $timeout(function() {     
                var timestamp                   = attrs.gameStartsIn;
                var from                        = attrs.today;                        
                element.countdown( { timestamp:timestamp , from:from , timeup : function () { } } );            
              },'1700');
        }
    }
});

app.controller('profileController', ['$scope', '$timeout', '$http','profileService','commonService',function($scope,$timeout, $http,profileService,commonService){  
    $('.news-ticker').show();
    var values=[];
    $('.middle-loader').show();
    
    $scope.removeProfileImage = function() 
    {
      
      $scope.param = {};
      alertify.confirm( "Are you sure you want to remove your profile image?" , function( e ){
      if ( e )
      {
         $('#image_loader').show();
          commonService.commonApiCall($scope.param,'dashboard/remove_profile_picture').then(function(response){
            $('#image_loader').hide();
            if ( response.response )
            {          
              $('#logo,#top_img').attr('src',response.defaultImg);    
              $scope.userProfile.isDefault = '';
              $('.profile-picture:hover .remove-profile-pic').css('display','none');
            }       
          });
      }
      });
      //return e;     
    };


    $scope.intializeImageLoad  = function()
    {
        var btnupload = $('#upload_btn');
        new AjaxUpload( btnupload, {
        action: siteUrl+'upload_image/do_upload',
        name: 'userfile',
        responseType :'json',
        data: {field_name:'userfile'},
        onSubmit: function(file, ext)
        { 
          if (! (ext && /^(jpg|png|jpeg|gif)$/.test(ext))){        
            $( '#error_message span.msg' ).empty( '' ).append(IMAGE_ALLOWED);
            ShowMessage( 'error_message' , 'bounceInDown' );
                //return false;
              }
              $('#image_loader').show();
              $('.edit-remove').hide();

              setTimeout( function (){ 
                CloseMessage( 'error_message' , 'bounceOutUp' ); 
              } , 3000 );

            },
          onComplete: function(file, response)
          {
            $timeout(function(){
              $('#image_loader').hide();
            }),1200;                
            $('.edit-remove').show();              
            var output = response;
            if(output.status==1)
            {       
              $('#logo,#top_img').attr('src',output.data);     
              $scope.userProfile.isDefault = 1;
              $( '#success_message span.msg' ).empty( '' ).append(IMAGE_SUCCESSFULL_MSG);
              ShowMessage( 'success_message' , 'bounceInDown' );
              setTimeout( function (){ 
                CloseMessage( 'success_message' , 'bounceOutUp' ); 
              } , 3000 );
            }
            else
            {
              $( '#error_message span.msg' ).empty( '' ).append(output.data);
              ShowMessage( 'error_message' , 'bounceInDown' );

              setTimeout( function (){ 
                CloseMessage( 'error_message' , 'bounceOutUp' ); 
              } , 3000 ); 

            }
          }
        });
    }


    $scope.userProfile = {};
    profileService.getProfileData(values).then(function(response)    {
        $('.middle-loader').hide();
        $scope.userProfile = response.user_profile; 
        $scope.isDisable = (response.user_profile.user_name) ?  true : false;       
        if($scope.userProfile.phone_no == 0)
        {
          $scope.userProfile.phone_no = '';
        }
        setTimeout(function(){          
           $("#country").val($scope.userProfile.country).trigger('chosen:updated');
           $scope.stateList  =  $scope.states[$scope.userProfile.country];
           $("#country").val($scope.userProfile.country).trigger('change');
        },1000)
        $scope.countryList = response.country;
        $scope.states = response.states;
        var countries = [];
        angular.forEach($scope.countryList, function(value, key) {
          if($scope.states[value.abbr] !== undefined)
          {
            this.push(value);
          }
          else
          {
            //console.log('not fine',value.abbr)
          }
        }, countries);
        $scope.countryLists = countries;
        $scope.intializeImageLoad();     
  },function(error){
  }); 
  
  $scope.filterStates = function()
  {
      var country_abbr = $('#country').val();
      $scope.stateList = [];
      if(country_abbr != '')
      $scope.stateList  =  $scope.states[country_abbr] ;
  }


    // Function to save and update user profile
   $scope.saveUpdateProfile = function(){
    
    var errFlag = true;
    var integer = /^[0-9]+$/; 
    var charfilter = /^[a-zA-Z ]*$/;
    var letters = /^[a-zA-Z0-9_]+((\.(-\.)*-?|-(\.-)*\.?)[a-zA-Z0-9_]+)*$/;
    var data = $scope.userProfile;
    //console.log($scope.userProfile);
    
    if( data.first_name  == '' || data.first_name == null )
    {
      $('#errorFirst').show();
      $('#errorFirst').html(FIRST_NAME_ERROR);
    }
    else if(data.first_name.length < 3){
           $('#errorFirst').html(FIRST_NAME_MINI_ERROR).show();
           errFlag = false;  
    }else if(data.first_name.length > 25 ){

           $('#errorFirst').html(FIRST_NAME_MAX_ERROR).show();
           errFlag = false;  
    }else if(!charfilter.test(data.first_name)){

          $('#errorFirst').html(FIRST_NAME_VALID_ERROR).show();
          errFlag = false; 
    }else{
      $('#errorFirst').hide();
    }
    


    if( data.last_name == '' || data.last_name == null)
    {
      $('#errorLast').show();
      $('#errorLast').html(LAST_NAME_ERROR);
    }
    else if(data.last_name.length < 3){
           $('#errorLast').html(LAST_NAME_MINI_ERROR).show();
           errFlag = false;  
    }else if(data.last_name.length > 25 ){

           $('#errorLast').html(LAST_NAME_MAX_ERROR).show();
           errFlag = false;  
    }else if(!charfilter.test(data.last_name)){

          $('#errorLast').html(LAST_NAME_VALID_ERROR).show();
          errFlag = false; 
    }else{
      $('#errorLast').hide();
    }

    if(data.user_name == undefined || data.user_name == '' ){
            $('#errorFantasy').html(NICK_NAME_ERROR).show();
            errFlag = false;
    }else if(data.user_name.length < 4){
           
    $('#errorFantasy').html(NICK_NAME_MINI_ERROR).removeClass('hide').show();
            errFlag = false;  
    }else if(data.user_name.length > 50 ){
          
        $('#errorFantasy').html(NICK_NAME_MAX_ERROR).removeClass('hide').show();
           errFlag = false;  
    }else if(!letters.test(data.user_name)){
            $('#errorFantasy').html(NICK_NAME_VALID_ERROR).removeClass('hide').show();
            errFlag = false;
    }else{
       $('#errorFantasy').hide();
    } 

    if( !data.dob || data.dob == '')
    {
      $('#errorDob').show();
      $('#errorDob').html(DOB_ERROR);
      errFlag = false;
    }
    else
    {
      $('#errorDob').hide();
    }
  
    if( data.zip_code == '' || data.zip_code == null)
    {
      $('#errorZip').show();
      $('#errorZip').html(ZIP_ERROR);
    }else{
        $('#errorZip').hide();
    }
      


    if( !data.country || data.country == '')
    {
      $('#errorCountry').show();
      $('#errorCountry').html(COUNTRY_ERROR);
      errFlag = false;
    }
    else
    {
      $('#errorCountry').hide();
    }

    if( !data.state_id || data.state_id == '')
    {
      $('#errorState').show();
      $('#errorState').html(REQUIRED_STATE_ERROR);
      errFlag = false;
    }
    else
    {
      $('#errorState').hide();
    }


    if( !data.street || data.street == '' )
    {
      $('#errorStreet').show();
      $('#errorStreet').html(STREET_ERROR);
      errFlag = false;
    }
    else
    {
      $('#errorStreet').hide();
    }

    if( !data.street_2 || data.street_2 == '' )
    {
      $('#errorStreet_2').show();
      $('#errorStreet_2').html(STREET_ERROR);
      errFlag = false;
    }
    else
    {
      $('#errorStreet_2').hide();
    }

    if( !data.city || data.city == ''){
        $('#errorCity').show();
        $('#errorCity').html(CITY_ERROR);
        errFlag = false;
    }
    else if( !letters.test(data.city) )
     {
        $('#errorCity').show();
        $('#errorCity').html(CITY_VALID_ERROR);
        errFlag = false;
     }
    else
     {
        $('#errorCity').hide();
     }

    if( !data.phone_no || data.phone_no == ''){
        $('#errorNumber').show();
        $('#errorNumber').html(PHONE_ERROR);
        errFlag = false;
          return false;
      }  
      else if (isNaN( data.phone_no)) {        
        $('#errorNumber').show();
        $('#errorNumber').html(PHONE_INVALID_ERROR);
        errFlag = false;
          return false;
      }else{
        $('#errorNumber').hide();
      }

      if (isNaN( data.zip_code)) {    
        $('#errorZip').show();      
        $('#errorZip').html(ZIP_ERROR);
          errFlag = false;
      }
      
      if( !data.phone_no || data.phone_no != "")
      {
                
        if(maxminLength(data.phone_no,PHONE_MIN_LENGTH,PHONE_MAX_LENGTH)==false)
        { 
          $('#errorNumber').html(PHONE_LENGTH_ERROR).css('display','block');        
          errFlag = false;
        }else{
          $('#errorNumber').addClass('hide').css('display','none');;
        } 
      }
       if( data.dob == "" || data.dob == '0000-00-00')
      {       
         $('#errorDob').html(DOB_ERROR);
          errFlag = false;
      }

      var paramObj = {
        first_name: $scope.userProfile.first_name,
        last_name: $scope.userProfile.last_name,
        dob: $scope.userProfile.dob,
        phone_no: $scope.userProfile.phone_no,
        email: $scope.userProfile.email,
        user_name: $scope.userProfile.user_name,
        country  : $scope.userProfile.country,
        state_id: $scope.userProfile.state_id,
        street: $scope.userProfile.street,
        street_2: $scope.userProfile.street_2,
        city: $scope.userProfile.city,
        zip_code: $scope.userProfile.zip_code,

      };
      
      if (errFlag == true) {

          $('#prfile_loader').addClass('loaderBtn');
          profileService.saveUpdateProfile(paramObj).then(function(response)    {   
          $('#prfile_loader').removeClass('loaderBtn');
          if (response.status == 1) {
            $('#errorDob').html('');
            $('#name').html(paramObj.user_name);
             $( '#success_message .msg' ).empty().append( PROFILE_SUCCESSFULL_MSG );
              
              ShowMessage( 'success_message' , 'bounceInDown' );
              setTimeout( function (){ 
                CloseMessage( 'success_message' , 'bounceOutUp' ); 
              } , 3000 );
            }          
          
        },function(error){
        });
      }       
  };
   $scope.myprofileChange = {};
   $scope.myprofileAdd ={};

   $scope.check_password = function(profileid){
     var value = {req:'checkPass'} 
     commonService.commonApiCall(value,'login/changed_password').then(function(response){
        if(response.status == 'password_exist'){
            $('.textfield').val("");
            $('.error').addClass('hide');
             $timeout(function() {
               $scope.myprofileChange = {};
           }, 0);
             
           openPopDiv('changePasswordPopup','bounceInDown');
        }else if(response.status == 'password_empty'){
            $('.textfield').val("");
            $('.error').addClass('hide');
            $timeout(function() {
              $scope.myprofileAdd ={};
             }, 0);
            closePopDiv('changePasswordPopup','bounceOutUp');
            openPopDiv('addPasswordPopup','bounceInDown');
        }
      },function(error){
          
    });
  }

  $scope.add_password = function(){
     var info = $scope.myprofileAdd;
     var errFlag = true;
     if(!info.hasOwnProperty('new_pass')  || info.new_pass ==''){
         $('#add_new_pass').html(PASSWORD_ERROR).removeClass('hide');
          errFlag = false ; 
     }else if(info.new_pass.length < 6){
        $('#add_new_pass').html(PASSWORD_LENGTH_ERROR).removeClass('hide');
        errFlag = false; 
     }else{
          $('#add_new_pass').addClass('hide');
     }

     if(!info.hasOwnProperty('new_confirm_pass') || info.new_confirm_pass == ''){
            $('#add_new_confirm_pass').html(CONFIRM_PASSWORD_ERROR).removeClass('hide')
            errFlag = false ;

     } else if(info.new_pass != info.new_confirm_pass) {
            $('#add_new_confirm_pass').html(CONFIRM_PASSWORD_MATCH_ERROR).removeClass('hide')
             errFlag = false ;
    } else{
        $('#add_new_confirm_pass').addClass('hide')
    }

    if(errFlag){
        $('#reset_btn_add').addClass('loaderBtn');
        info.req = "addPass";
        var value = info;
        commonService.commonApiCall(value,'login/changed_password').then(function(response){
        $('#reset_btn_add').removeClass('loaderBtn');
        if(response.status == true){
          closePopDiv('addPasswordPopup','bounceOutUp');
          showSuccessMsg(response.msg);
          setTimeout(function() {
            CloseMessage( 'success_message' , 'bounceOutUp' );
          }, 3000);
        }
      },function(error){
          
      });
    }

  }

  $scope.update_password = function(){

     var info = $scope.myprofileChange;
     var errFlag = true;
     
     if(!info.hasOwnProperty('old_pass')  || info.old_pass ==''){
         $('#change_old_pass').html(OLD_PASSWORD_ERROR).removeClass('hide');
          errFlag = false ; 
     }else if(info.old_pass.length < 6){
        $('#change_old_pass').html(PASSWORD_LENGTH_ERROR).removeClass('hide');
        errFlag = false; 
     }else{
          $('#change_old_pass').addClass('hide');
     }

     if(!info.hasOwnProperty('new_pass') || info.new_pass == ''){
            $('#change_new_pass').html(NEW_PASSWORD_ERROR).removeClass('hide')
            errFlag = false ;
      } else if(info.new_pass.length < 6 ) {
            $('#change_new_pass').html(PASSWORD_LENGTH_ERROR).removeClass('hide')
            errFlag = false ;
     }else{
           $('#change_new_pass').addClass('hide');
     }
     
     if(!info.hasOwnProperty('new_confirm_pass') || info.new_confirm_pass == ''){
            $('#change_new_pass_confm').html(CONFIRM_PASSWORD_ERROR).removeClass('hide')
            errFlag = false ;

     } else if(info.new_pass != info.new_confirm_pass) {
            $('#change_new_pass_confm').html(CONFIRM_PASSWORD_MATCH_ERROR).removeClass('hide')
             errFlag = false ;
    } else{
        $('#change_new_pass_confm').addClass('hide')
    }

    if(errFlag){
      $('#reset_btn_change').addClass('loaderBtn');
      info.req = "changePass";
      var value = info;
      commonService.commonApiCall(value,'login/changed_password').then(function(response){
        $('#reset_btn_change').removeClass('loaderBtn');
        if(response.status == 'not_match'){
          $('#change_old_pass').html(WRONG_OLD_PASSWORD_ERROR).removeClass('hide');
        }else{
          closePopDiv('changePasswordPopup','bounceOutUp');
          showSuccessMsg(response.msg);
          setTimeout(function() {
            CloseMessage( 'success_message' , 'bounceOutUp' );
          }, 3000);

        }
        
      },function(error){
          
      });
    }
  }

}]);// my profile controller ends here

app.controller('myInvitesController', ['$scope', '$http','myInvitesService',function($scope,$http,myInvitesService){  
        $scope.noInviteList = NO_INVITATION_ERR;
        $('.news-ticker').show();
        var values=[];
        myInvitesService.getInvitationData(values).then(function(response)    {
          $scope.invitationDataList = response.data;  
    },function(error){
    }); 
  
}]);


//invite Friend popup controller
app.controller('inviteFriendPopup',['$scope','$http','$routeParams','myInvitesService','$location',function($scope,$http,$routeParams,myInvitesService,$location)
{   

  $scope.messageDetails = "Hi, You've been challenged by "+username+" to enter a Sports Fantasy Pro's fantasy competition! Click the link below, sign up, and play today.";
  $scope.currentLink = $location.absUrl();
  $scope.ErrorMessageInvite='';
  $scope.emailDetails = null;


    $scope.saveInviteValue = function(obj)
    {    
      var emailDetails = $('#emailDetails').val();
      $('#invite_loader').addClass('loaderBtn');
      var errFlag = false;
      $scope.ErrorMessageInvite = {};
      var regex     = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
      if (emailDetails == "" || emailDetails == undefined) {
      $('#invite_loader').removeClass('loaderBtn');
        // $scope.ErrorMessageInvite.emailErr = "Please enter emails with comma seperated";
        $('#errorEmail').html("Please enter valid email addresses separated by comma.");
        errFlag = true;
      } 
      else if(emailDetails != "" || emailDetails != undefined)
      {
        
        var emails    = emailDetails.split(',');
        angular.forEach(emails,function(value , key){
          if ( !regex.test( $.trim( value ) ) )
          {
            $('#invite_loader').removeClass('loaderBtn');
            // $scope.ErrorMessageInvite.emailErr = ;
            $('#errorEmail').html("Please enter valid emails");
            errFlag = true;
          }
          else
          {
            errFlag = false;
          }

        });
      }

       if (errFlag === false) {
        
         var paramObj = {game_unique_id: $routeParams.gameUniqueId,emails:$scope.emailDetails ,message:$scope.messageDetails};
         myInvitesService.inviteUsers(paramObj).then(function(response)    {

            if(response.status==true)
            {
              closePopDiv( 'InviteFriendPopup' , 'bounceInDown' );
              $scope.successMsg( response.msg );
              $scope.emailDetails = "";
              $('#invite_loader').removeClass('loaderBtn');
            }
            if(response.status='invite_err')
            {
             $('#invite_loader').removeClass('loaderBtn');
             /* $( '#error_message .msg' ).empty().append( response.msg );
              ShowMessage( 'error_message' , 'bounceInDown' );*/
              return false;
            }

          },function(error){
          });
       }
    };

}]);


//Game Details popup controller
app.controller('GameDetailsPopupCtrl',['$scope','$http','$routeParams', '$timeout',function($scope,$http,$routeParams,$timeout)
{    
    // var paramObj = {game_unique_id: 'gp1gcnkbF'};
    //   myGamesService.gamesDetailsData(paramObj).then(function(response)    { 
    //  $scope.gameDetailsList = response.game_detail;
    //  $scope.entrantsList = response.participants_detail;
    //  $scope.teamDetail  = response.team_detail;
    //  $scope.layoutDone = function() {
    //    $timeout(function() {
    //        //mySlider.destroySlider();
    //        mySlider = $('.bxslider').bxSlider({pager: false});                  
    //    }, 200);                            
    //  };
    //     },function(error){
    // });
}]);






app.controller('aboutUsController', ['$scope', '$http',function($scope,$http){ 
   /*$scope.toTheTop = function() {
      $document.scrollTop(0, 5000);
    }*/
  /*setTimeout(function(){
    $("body").animate({ scrollTop: 0 }, "slow");
  },1000);*/

 /* setTimeout(function(){                               
     $('html,body').animate({ scrollTop: top }, 400);
   },0);*/

  //$('html,body').animate({scrollTop: $('body').offset().top }, "slow");
 // $("html, body").animate({scrollTop: $(location).offset().top}, "slow");
 //$anchorScroll();
 
  //$document.scrollTop(0, 5000);
  $('html,body').animate({scrollTop: $('body').offset().top }, "slow");
  /*setTimeout(function(){
    $('#BackToTop').scrollTo(500);
  },2000);
  */
  $('.news-ticker').hide();
  $('.bxslider').bxSlider({minSlides:1,maxSlides:1,slideWidth:185,slideMargin:1,pager:false,auto:true,infiniteLoop: true});
}]);

app.controller('faqController', ['$scope', '$http',function($scope,$http){ 
  $("body").animate({ scrollTop: 0 }, "slow");
  if(isLogin == 1)
  {
    $('.lost_pwd').hide();
  }

  $('.news-ticker').hide();
  $('.bxslider').bxSlider({minSlides:1,maxSlides:1,slideWidth:185,slideMargin:1,pager:false,auto:true,infiniteLoop: true});
}]);

app.controller('privacyPolicyController', ['$scope', '$http',function($scope,$http){ 
  $("body").animate({ scrollTop: 0 }, "slow");
  $('.news-ticker').hide();
  $('.bxslider').bxSlider({minSlides:1,maxSlides:1,slideWidth:185,slideMargin:1,pager:false,auto:true,infiniteLoop: true});
}]);

app.controller('contactUsController', ['$scope', '$http','contactService','Auth','$sce','$location','$timeout',function($scope,$http,contactService,Auth,$sce,$location,$timeout){ 
  $("body").animate({ scrollTop: 0 }, "slow");
  $('.news-ticker').hide();
  $('.bxslider').bxSlider({minSlides:1,maxSlides:1,slideWidth:185,slideMargin:1,pager:false,auto:true,infiniteLoop: true});
  
  $scope.recaptcha_response_field = "";
  contactService.getArealist().then(function(response)    {
    $scope.contactArea = response.area;
    });

  $scope.changeArea = function()
  {
    var other = $scope.other;
    var area                    = $scope.area;
    if(area == 'Other')
    {
      $('.other').show();
      if(other == '' || other == undefined)
      {
        $('#red-error-other').show();
        $('#red-error-other').html(CONTACT_FEEDBACK_OTHER_AREA);
        return false;
      }
      else
      {
        $('#red-error-other').hide();
        $scope.saveContactUs();
      }

    }
    else
    {
      $('.other').hide(); 
    }
  }
  $scope.saveContactUs = function(){
   
    var ret                     = true;
    var values                  = $('.contact_us').serialize();
    var regex                   = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    var name                    = $scope.name;
    var emails                  = $('#email').val();
    var area                    = $scope.area;
    var description             = $('#description').val();
    var email_response          =  true;
    var other                  = $scope.other;
    if(area == 'Other')
    {
      if(other == undefined || other == '')
      {
        return false;
      }
    }
 
    if ( !regex.test( $.trim( emails ) ) )
    {
      email_response = false;
    }

    if(email_response || emails=='') {
      
      $('#red-error-email').hide();
      ret = true;
      
    } 
    else {

      $('#red-error-email').show();
      $('#red-error-email').html(CONTACT_VALID_EMAIL_ADDRESS);
      ret=false;      
    }

    if(name == '' || name == undefined)
    {
      $('#red-error-name').show();
      $('#red-error-name').html(CONTACT_FEEDBACK_NAME);
      ret=false;
    }
    else
    {
      $('#red-error-name').hide();
    }

    if(description == '' || description == undefined)
    {
      $('#red-error-description').show();
      $('#red-error-description').html(CONTACT_FEEDBACK_DESCRIPTION);
      ret=false;
    }
    else
    {
      $('#red-error-description').hide();
    }
    if(emails == '')
    {
      $('#red-error-email').show();
      $('#red-error-email').html(CONTACT_FEEDBACK_EMAIL);
      ret = false;
    }
    if(area == null || area == undefined)
    {
      $('#red-error-area').show();
      $('#red-error-area').html(CONTACT_FEEDBACK_AREA);
      ret = false;
    }
    else
    {
      $('#red-error-area').hide();
    }

    if ($scope.generated_captcha !== $scope.recaptcha_response_field) {
      $scope.loadCaptcha();
      $scope.recaptcha_response_field = "";
      $('#red-error-captcha').show();
      $('#red-error-captcha').html(CONTACT_FEEDBACK_CAPTCHA);
      ret = false;
    }
    else
    {
      $('#red-error-captcha').hide();
    }
    $('#create_contact_us_loader').addClass('loaderBtn');
    if(ret == true)
    {
      contactService.saveContact(values).then(function(response)    {
        
        
        if(response.response == true)
        {
          showSuccessMsg(CONTACT_SUCCESSFULL);
          $('#create_contact_us_loader').removeClass('loaderBtn');
          $timeout(function(){
            $location.path('/dashboard');
          },3000);
        }

      });
    }
    else
    {
      $('#create_contact_us_loader').removeClass('loaderBtn');
      return false;
    }
  },

  $scope.loadCaptcha = function()
    {        
        Auth.loadCaptcha().then(function(response)
        {
            $scope.recaptcha_image = $sce.trustAsHtml(response.cap_img);//Used to append the html of captcha in view
            $scope.generated_captcha = response.word;   
            
        },function(error){        
        });      
          
    };
    $scope.loadCaptcha();//used to load captcha onload



}]);

app.controller('howItWorksController', ['$scope', '$http',function($scope,$http){ 
  $("body").animate({ scrollTop: 0 }, "slow");
  $('.news-ticker').hide();
  $('.bxslider').bxSlider({minSlides:1,maxSlides:1,slideWidth:185,slideMargin:1,pager:false,auto:true,infiniteLoop: true});
}]);

app.controller('gamesController', ['$scope', '$http',function($scope,$http){ 
  $("body").animate({ scrollTop: 0 }, "slow");
  $('.news-ticker').hide();
  $('.bxslider').bxSlider({minSlides:1,maxSlides:1,slideWidth:185,slideMargin:1,pager:false,auto:true,infiniteLoop: true});
}]);

app.controller('rulesController', ['$scope', '$http',function($scope,$http){ 
  $("body").animate({ scrollTop: 0 }, "slow");
  $('.news-ticker').hide();
  $('.bxslider').bxSlider({minSlides:1,maxSlides:1,slideWidth:185,slideMargin:1,pager:false,auto:true,infiniteLoop: true});
}]);

app.controller('termsController', ['$scope', '$http',function($scope,$http){ 
  $("body").animate({ scrollTop: 0 }, "slow");
  $('.news-ticker').hide();
  $('.bxslider').bxSlider({minSlides:1,maxSlides:1,slideWidth:185,slideMargin:1,pager:false,auto:true,infiniteLoop: true});
}]);

function checkEmpty(theField,s)
{
  
  var field_val= $('#'+theField).val();
  
  if( field_val=="" )
  { 
    $('#red-error-'+theField).show();
    $('#red-error-'+theField).html(s);
    return false;
  }
  else
  {
    $('#red-error-'+theField).hide();
  }
} 




function showErrMsg( msg )
{
  $( '#error_message .msg' ).empty().append( msg );
  ShowMessage( 'error_message' , 'bounceInDown' );
  setTimeout( function (){ CloseMessage( 'error_message' , 'bounceOutUp' ); } , 3000 );
}

function showSuccessMsg( msg )
{
  $( '#success_message .msg' ).empty().append( msg );
  ShowMessage( 'success_message' , 'bounceInDown' );
  setTimeout( function (){ 
    CloseMessage( 'success_message' , 'bounceOutUp' ); 
  } , 3000 );
}

function maxminLength(field_value,min_length,max_length)
{
    if(field_value!=null)
    {
      if(field_value.length>max_length)
      {
        return false;
      }
      else if(field_value.length<min_length)
      {
        return false;
      }
      else
      {
        return true;
      }
    }
}



