
/* Controller Name : Lineup Controller
	 Service Name    : commonService */

var myLineupSlider; 

app.controller('lineupController',function($scope,$routeParams,commonService,$location,$timeout,$filter,$compile){
		
		$('.news-ticker').show();   
		
		$('.middle-loader').show();
		$scope.isDataLoaded              = false;
		var gameUniqueId                 = {gameUniqueId : $routeParams.gameUniqueId};
		
		$scope.imagePath                 = imagePath;
		
		$scope.directiveVal              = {};
		
		$scope.gameDetail                = {};
		
		$scope.salaryCapPlrObj           = {};
		
		$scope.salarySorting             = '-salary';
		
		$scope.league_lineup_position_id = {};   
		
		$scope.Lineup_Obj                = {};      
		
		$scope.str                       = [];
		
		$scope.tmpPlayerList             = {};  
		
		$scope.filteredItem              = {};    
		
		$scope.salaryCapSelecTabFilter   = [];
		
		$scope.Lineup                    = {};
		
		$scope.Lineup.team_added         = [];
		
		$scope.selectedTab               = "all";
		
		$scope.deleteIndex               = [];
		
		$scope.selectedPlayers           = {};
		$scope.maxPlayerPerTeam          = 0;
		$scope.maxPlayerPerPosition      = {};
		$scope.completedPosition         = {};
		$scope.lineUpMasterID = 0;
		
		var salaryCapPlrCnt              = [];

		$scope.startTime  = new Date().getTime() + 10060*60*1000;

		//Calling LineupGameDetail From Lineup Service
		
		//Used to call list of matches team name form searchGame service
		commonService.commonApiCall(gameUniqueId,'lineup/game_lineup').then(function(response)
		{
			//If time of the game passed then calling scoring template
				
			if(response.status =='error')
			{
				var url = '';
				switch(response.next_uri)
				{
					case 'score':
						url = "score/"+$routeParams.gameUniqueId;
					break;
					case 'myprofile':
						url = "myprofile/";
					break;
					default:
						url = "lobby/";
					break;
				}
				
				$scope.showMsg(response.msg);
				$location.path(url);
				return;	
			}

			

			matrixRowCol              = response.data.no_of_rows_cols;			
		
			/*List of response for all the details of lineup needed*/
			$scope.gameDetail             = response.data.game_detail;

			$scope.maxPlayerPerTeam = $scope.gameDetail.max_player_per_team;
			
			// console.log("Game details ", $scope.gameDetail, $scope.maxPlayerPerTeam);

			$scope.lineUpMasterID         = response.data.lineup_master_id;
			$scope.playersMatrix          = response.data.players_matrix;
			$scope.teamList               = response.data.team_list;        
			$scope.existing_lineup        = response.data.existing_lineup;
			$scope.siteUrl                = response.data.site_url;
			$scope.directiveVal.startTime = response.data.game_starts_in;        
			$scope.directiveVal.today     = response.data.today;      
			$scope.lineupGameType         = response.data.game_type;
			$scope.entry_fee_new          = response.data.game_detail.entry_fee;
			$scope.usersProfile           = response.data.user_profile;
			$scope.teamDetail             = response.data.team_detail;
			$scope.tabPosition            = response.data.tab_position;

			// console.log("Tab Position ", $scope.tabPosition);

			$scope.allowedPosition        = response.data.allowed_position;
			$scope.playerList             = response.data.players_list;

			$scope.lineUp                 = response.data.line_up;        
			$scope.updatedSalary          = Number( $scope.gameDetail.salary_cap );        
			$scope.userAlreadyJoined      = response.data.user_already_joined;
			$scope.roster_salary          = $scope.total_salary = 0;
			$scope.total_salary           = Number( $scope.gameDetail.salary_cap );
			$scope.old_descount           = $scope.gameDetail.entry_fee;
			

			angular.forEach($scope.playerList, function (player) {
				player.salary = parseFloat(player.salary);  
				$scope.salaryCapPlrObj[player.player_unique_id] = player;    
			});
				


			$scope.isDataLoaded = true;
			//Calling Initialize Position when page loads  		
			$scope.InitializePositions();

			$scope.InitializeMatrix();

			// If lineup already filled then initialize old lineup
			if ($scope.lineUp ) 
			{
				$timeout(function () {                
					$scope.InitializeOldLineUp(); 
				},'500');            
			}

		},function(error){        
	});

	// Function to initialize position  for line up grid view  As well as position validation
	$scope.InitializePositions = function()
	{
		$scope.position_validation = {};
		if ($scope.tabPosition != undefined) 
		{
			$.each( $scope.tabPosition , function( key , value )
			{
				var temp                      = $scope.allowedPosition[ key ];
				var league_lineup_position_id = value.league_lineup_position_id;

				if ( league_lineup_position_id == temp.league_lineup_position_id )
				{
					$scope.position_validation[ value.lineup_position_name ] = value;
					$scope.position_validation[ value.lineup_position_name ][ 'allowed_position_name' ] = temp.position_name;
				}

				// Create an array for position name vs max player per position for validating maximum player per position 
					$scope.maxPlayerPerPosition[value.lineup_position_name ] = value.max_player_per_position ;

					for (var i = 0; i < Number( value.number_of_players ); i++ )
					{    
						var lineup_row = {
									"lineup_position_name"      : value.lineup_position_name,
									"league_lineup_position_id" : value.league_lineup_position_id,
									"max_player_per_position"   : value.max_player_per_position,
									"player_unique_id"                 : 0,
									"allowed_position_name"     : temp.position_name
								};
						// console.log(lineup_row);
						$scope.str.push(lineup_row);
					};

			});
				// console.log( "STR ",  $scope.str);
		}
	}

	$scope.InitializeMatrix = function()
	{
		$.each( $scope.playersMatrix  , function( key , value )
		{
			this.player_unique_id = 0;
		});

		// console.log("InitializeMatrix ", $scope.playersMatrix );
	}

	//Function to process player
	//  Start applying validation  before add to selected player array
	$scope.ProcessPlayerToAdd = function(player_obj)
	{
		// console.log(player_obj);

		if ($scope.completedPosition.hasOwnProperty(player_obj.position) )
		{
			// console.log('Completed position');
			return false;
		}

		if( $scope.validateMaxPlayerPerTeam(player_obj) )  					//  Check max player per team allowed
		{
			$scope.showMsg(' Maximum player per team exceeds ');
			return false;
		}		
		else if ( $scope.validateMaxPlayerPerPosition(player_obj) )  		// Check max player per position allowed
		{
			
			$scope.showMsg( "Player cannot be added - all '" + player_obj.position + "' positions are filled" );
			return false;	
		}		
		else if( $scope.updatedSalary < player_obj.salary )  				// Check remaining salary is enough for this player
		{
			$scope.showMsg( "Not enough salary remaining " );
			return false;	
		} 
		else 																// Now process for adding player in lineup 
		{
			$scope.AddPlayer(player_obj);
		}

	}       

	//  Validate maximum player per team  5/26/2015 2:45:51 PM
	$scope.validateMaxPlayerPerTeam = function(player_obj)
	{
		var player_teams_arry = {};
		var err = false;
		
		angular.forEach($scope.selectedPlayers , function(value, key) 
		{			
			if(!player_teams_arry.hasOwnProperty(value.team_abbreviation))
			{
				player_teams_arry[value.team_abbreviation] = 1;				
			}
			
			else 
			{
				player_teams_arry[value.team_abbreviation] ++ ; 					
			}
		});

		if(!player_teams_arry.hasOwnProperty(player_obj.team_abbreviation))  // If selected player team_abbreviation is empty , put 0 for that
			player_teams_arry[player_obj.team_abbreviation] = 0;

		if( player_teams_arry[player_obj.team_abbreviation] == $scope.maxPlayerPerTeam ) 
		{																						
			err = true;
		}

		// console.log("Max player per team ", player_teams_arry);
	
		return err ;
	}


	$scope.validateMaxPlayerPerPosition = function(player_obj)
	{
		var player_position_arry = {};
		var err = false;
	
		angular.forEach($scope.selectedPlayers , function(value, key) 
		{
			if(!player_position_arry.hasOwnProperty(value.position))
			{
				player_position_arry[value.position] = 1;				
			}			
			else 
			{
				player_position_arry[value.position] ++ ; 					
			}
		});
		
		
		if(!player_position_arry.hasOwnProperty(player_obj.position))  // If selected player position is empty , put 0 for that
			player_position_arry[player_obj.position] = 0;			
		

		if( player_position_arry[player_obj.position] == $scope.maxPlayerPerPosition[player_obj.position]  )  
		{
			err = true;
		}

		if(player_position_arry[player_obj.position] == ($scope.maxPlayerPerPosition[player_obj.position] -1 )  )  // Because player will add after this process and we need to know status before including this player
		{
			$('.'+player_obj.position+'_pos_add').addClass('disable');	
			$scope.completedPosition[player_obj.position] = true;
		}

		// console.log("player_position_arry ", player_position_arry);
		return err ;
	}


	//Function to add player
	$scope.AddPlayer = function(player_obj)
	{
		var break_loop = false;

		angular.forEach($scope.str, function(value, key ){
			// console.log("Add player str ", value);
			if(break_loop)
				return false;		

			var all_allowed_position = value.allowed_position_name.split(',');

			for(x in all_allowed_position)
			{
				if(all_allowed_position[x]  == player_obj.position  && value.player_unique_id == 0 &&  !$scope.selectedPlayers.hasOwnProperty(player_obj.player_unique_id) )
				{

					$scope.str[key].player_unique_id                    = player_obj.player_unique_id ;
					
					$scope.selectedPlayers[player_obj.player_unique_id] =  player_obj;

					$scope.selectedPlayers[player_obj.player_unique_id].league_lineup_position_id = value.league_lineup_position_id;

					$scope.updateRemainingSalary(player_obj);

					// Adding player in Field View
					$scope.AddPlayerFieldView(player_obj);

					$('.'+player_obj.player_unique_id+'_add').hide();
					$('.'+player_obj.player_unique_id+'_drop').show();

					break_loop  = true;
				}
			}
		});

		// console.log(" Selected player  ", $scope.selectedPlayers);
	}

	$scope.updateRemainingSalary = function(player_obj)
	{	
		$scope.updatedSalary =  $scope.updatedSalary - player_obj.salary  ;
	}

	$scope.AddPlayerFieldView = function(player_obj){
		var break_loop = false;
		angular.forEach($scope.playersMatrix, function(value, key )
		{
			if(break_loop)
				return false;

			if(value.position_name  == player_obj.position && value.player_unique_id == 0  )
			{
				
				value.player_unique_id = player_obj.player_unique_id;

				selected_player = $scope.selectedPlayers[value.player_unique_id] ;

				player_icon = '<div data-field-view="'+ selected_player.player_unique_id+'" data-field-team="'+selected_player.team_abbreviation+'" class="player">\
										<span class="jerseyicon"><i class="jersey-own"></i></span>\
										<span class="player-details">\
											<label class="position-name">'+selected_player.position+'</label>\
											<label class="player-score">'+  $filter('salaryFormat')(selected_player.salary) +'</label>\
										</span>\
										<span class="player-name"><label>'+selected_player.full_name+'</label></span>\
										<span class="close"><a href="javascript:void(0);" ng-click="removePlayerLineup(\''+selected_player.player_unique_id+'\')">X</a></span>\
							</div>';   
				
				ele = angular.element( document.querySelector( '#matrix_'+value.row+'_'+value.col ) );
				ele.append($compile(player_icon)($scope) );

				break_loop = true;
			}		
			
		});
	}

	//Used to remove player from lineup
	$scope.removePlayerLineup = function(player_obj)
	{
		// console.log(" remove player lineup player id", player_obj);

		if(typeof player_obj !== 'object')
		{
			player_obj = $scope.selectedPlayers[player_obj];
		}

		var break_loop = false;

		//  Remove player from GRID VIEW
		angular.forEach($scope.str, function(value, key ){
			// console.log(value);
			if(break_loop)
				return false;		
				
			if( value.player_unique_id == player_obj.player_unique_id )
			{
				$scope.str[key].player_unique_id = 0 ;								// Set $scope.str  player unique id to 0 for no player on this position
				

				break_loop  = true;
			}
			
		});

		//  Remove Player from FIELD VIEW
		break_loop =false;
		angular.forEach($scope.playersMatrix, function(value, key )
		{
			if(break_loop)
				return false;

			if( value.player_unique_id == player_obj.player_unique_id )
			{
				value.player_unique_id = 0;  								// Set $scope.playersMatrix player unique id  to 0 for no player on this position
				$('#matrix_'+value.row+'_'+value.col ).html('');
				break_loop = true;
			}		
		});

		delete $scope.selectedPlayers[player_obj.player_unique_id] ;		// delete that player data from selected player object
		$scope.updatedSalary = Number($scope.updatedSalary)  + Number(player_obj.salary)  ;	// Add player salary to remaining salary 
		$('.'+player_obj.player_unique_id+'_add').show();
		$('.'+player_obj.player_unique_id+'_drop').hide();
		
		$('.'+player_obj.position+'_pos_add').removeClass('disable');
		delete $scope.completedPosition[player_obj.position] ;
	}

	$scope.lineupSubmitData = function(){
		var data = {};
		data.lineup         = $scope.selectedPlayers;
		data.game_unique_id     = $scope.gameDetail.game_unique_id ;
		data.lineUpMasterID = $scope.lineUpMasterID || 0;

		return data;

	}

	//Function used to save lineup
	$scope.lineupSubmit = function()
	{
		$('#lineup_submit_loader').addClass('loaderBtn');
		var total_entry = $scope.str.length;
		var added_entry = Object.keys($scope.selectedPlayers).length;
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
				var post_data =  $scope.lineupSubmitData();
				
				// console.log(post_data);

				commonService.commonApiCall(post_data ,'lineup/process_user_lineup').then(function(response)
				{
					// console.log("Lineup submit", response);

					if(response.status == 'success')
					{
						$('#lineup_submit_loader').removeClass('loaderBtn');
						$scope.successMsg( SALARY_CAP_LINE_UP_SUCCESSFULL );
						$scope.lineUpMasterID = response.lineup_master_id;
					}
					else if( response.status == 'error' )
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

	//Function to initialize old lineup
	$scope.InitializeOldLineUp = function ()
	{
		angular.forEach($scope.lineUp, function(value, key ){
			$scope.AddPlayer(value);
		});
	}


		//Remove all attribute after lineup submition
		$scope.lineupEnd = function()
		{}

		//Function for processing fees if lineup yet not submitted or fees is greater than Zero
		$scope.lineupProcessFees = function(){};
		
		//Function to validate promo code  
		$scope.validatePromoCode = function()
		{}
		 
		
	
	$scope.selectPositionTab = function(position){

		if(position != 'all')
		{
			var allowed_position_name = $scope.position_validation[position].allowed_position_name
			$scope.TabPosition = allowed_position_name;
		} 
		else 
		{
			$scope.TabPosition	= position;
		}
	}

		 

		

		
		
		
		$scope.selectedItems = [];

		

		
		

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
		

		
		//Function to remove list of all player when clicked on remove all
		$scope.removeAll = function(e)
		{}  
		
		//onclick get game price list from both lineup
		$scope.getGamePriceList = function() 
		{}

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
