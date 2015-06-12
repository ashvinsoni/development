$( "#valid" ).validationEngine( 'attach' , {
	onValidationComplete : function( form , status )
	{

		//If all the validations are checked
		if (status == true) {
			var no_of_games   	= $('.insert_games > span').length;
			var entry_fee 		= $('#entry_fees').val();
			var duration_id 	= $( '#duration_id' ).val();
			var league_id 		= $( '#league_id' ).val();

			//alert(no_of_games);
			if(no_of_games < 1 && entry_fee == 0 && league_id == 2)
			{
				jAlert ( 'Min 1 Games should be selected' );
				return false;
			}
			else if(no_of_games < 2 && entry_fee != 0 && league_id == 2)
			{
				jAlert ( 'Min 2 Games should be selected' );
				return false;
			}
			else if(no_of_games < 1 && league_id == 3)
			{
				jAlert ( 'Min 1 Games should be selected' );
				return false;
			}
			else if($('#is_feature').is(":checked") == true && league_id == 2 && no_of_games < 2)
			{
				jAlert ( 'Min 2 Games should be selected' );
				return false;
			}
			//console.log(newgameobj.buckets_status);
			if ( status === true && newgameobj.buckets_status == false )
			{
				jAlert ( 'You can\'t create a game for the selected date/time.' );
				return false;
			}
			else if ( status === true && newgameobj.buckets_status == true )
			{
				
				form[0].submit();
				return true;
			}
		}
	}
});

$( "select, input:checkbox, input:radio, input:file" ).uniform();

$( document ).ready( function(){
	new_game = new NewGame();
	new_game.InitializeSport();
	new_game.InitializeGameField();
	$( '#league_id' ).change( function(){

	});
	$( '#is_uncapped' ).change( function(){
		if ($(this).is(":checked")) 
		{
			$('.featuresize').hide()
		}
		else
		{
			$('.featuresize').show()	
		}
	});

});

var NewGame = function()
{
	newgameobj = this;
};

$.extend( NewGame.prototype , {

	newgameobj						: {},
	league_id_combo					: 'Select Sports',
	league_duration_id_combo		: 'Select Game Duration',
	season_week_id_combo			: 'Select Week',
	buckets_combo					: 'Select Time',
	league_drafting_styles_id_combo	: 'Select Drafting Style',
	league_salary_cap_id_combo		: 'Select Salary Cap',
	league_number_of_winner_id_combo: 'Select Prize',
	all_available_week				: {},
	all_number_of_winner			: {},
	number_of_winner_validation		: {},
	seasons_dates 					: {},
	size_upper_limit : 0,
	size_lower_limit : 0,
	entry_fee_upper_limit : 0,
	entry_fee_lower_limit : 0,
	position : 0,
	percentage : 1,
	duration_id : {},
	buckets_status : false,
	weekDay : [ "Sun" , "Mon" , "Tue" , "Wed" , "Thu" , "Fri" , "Sat" ],
	year : [ "Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" ,"Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec" ],

	InitializeGameField : function()
	{
		$.each( master_data_entry , function( key , value ){

			var data_desc         = value.data_desc;
			var admin_fixed       = value.admin_fixed;
			var admin_lower_limit = value.admin_lower_limit;
			var admin_upper_limit = value.admin_upper_limit;

			if ( data_desc == 'Entry_Fee' )
			{
				newgameobj.entry_fee_upper_limit = value.admin_upper_limit;
				newgameobj.entry_fee_lower_limit = value.admin_lower_limit;

				if ( admin_fixed == VARIABLE )
				{
					$( 'input#entry_fee' ).addClass( 'validate[max['+admin_upper_limit+']min['+admin_lower_limit+']custom[number]]');
					$( 'select#entry_fee' ).remove();
					$( '#uniform-entry_fee' ).remove();
					$( 'input#entry_fee' ).show();
				}
				else
				{
					$( 'input#entry_fee' ).remove();
					$( '#uniform-entry_fee' ).show();
				}
			}

			if ( data_desc == 'Size' )
			{
				newgameobj.size_upper_limit = value.admin_upper_limit;
				newgameobj.size_lower_limit = value.admin_lower_limit;

				if ( admin_fixed == VARIABLE )
				{
					$( 'input#size').addClass( 'validate[max['+admin_upper_limit+']min['+admin_lower_limit+']custom[number]]');
					$( 'select#size' ).remove();
					$( '#uniform-size' ).remove();
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

	InitializeSport : function()
	{
		newgameobj.ComboFill( 'league_id' , sport );
      
	},

	InitializeDuration : function( obj )
	{
		newgameobj.buckets_status = false;
		var league_id = $( obj ).val();
		$( '.total_game' ).hide();
		newgameobj.CreateGameName();
		$( '.insert_games' ).html('');
		$( '.insert_weekly_games' ).html('');

		if ( league_id == '' )
		{
			newgameobj.ResetCombo( 'league_duration_id' );
			newgameobj.ResetCombo( 'league_drafting_styles_id' );
			newgameobj.ResetCombo( 'league_salary_cap_id' );
			newgameobj.ResetCombo( 'league_number_of_winner_id' );
			newgameobj.ResetCombo( 'buckets' );
			$( '.insert_games' ).html('');
			$( '.insert_weekly_games' ).html('');

			$( '.weekly , .daily' ).hide();
			$( '#date , #buckets' ).val( '' );
		}
		else
		{
			$.ajax({
				url			: site_url+'admin/get_all_game_data',
				type		: 'POST',
				dataType	: 'json',
				async		: false,
				data		: 'league_id='+league_id,
				success		: function( response )
				{
					var all_duration                       = response.all_duration;
					var all_salary_cap                     = response.all_salary_cap;

					newgameobj.seasons_dates               = response.seasons_dates;
					newgameobj.all_available_week          = response.all_available_week;
					newgameobj.all_number_of_winner        = response.all_number_of_winner;
					newgameobj.number_of_winner_validation = response.number_of_winner_validation;

					newgameobj.ResetCombo( 'league_duration_id' );

					$.each( all_duration , function( key , value ){
						newgameobj.duration_id[ value.league_duration_id ] = value.duration_id;
						$( '#league_duration_id' ).append(  '<option value="'+value.league_duration_id+'">'+value.duration_desc+'</option>' );
					});

					newgameobj.ComboFill( 'league_salary_cap_id', all_salary_cap );
					newgameobj.ComboFill( 'league_number_of_winner_id', newgameobj.all_number_of_winner );
				}
			});
		}
	},

	ShowWeekDates : function ( obj )
	{
		newgameobj.buckets_status = false;
		$( '.total_game' ).hide();
		var league_duration_id = $( obj ).val();
		$('.select_all_week ').hide();

		newgameobj.CreateGameName();

		var temp_duration_id = newgameobj.duration_id[ league_duration_id ];
		$( '#duration_id' ).val( temp_duration_id );
		var duration_id = $( '#duration_id' ).val();

		if ( league_duration_id == '' || duration_id == '' )
		{
			$( '.insert_weekly_games' ).html('');
			newgameobj.ResetCombo( 'season_week_id' );
			newgameobj.ResetCombo( 'buckets' );
			$( '.weekly , .daily' ).hide();
			$( '#date , #buckets' ).val( '' );
		}
		else
		{
			newgameobj.GetAllDraftingStyle( league_duration_id );

			$( ".timeformError , .dateformError , .weekformError" ).remove()
			if ( duration_id == 1 ) //Daily
			{
				$( '.weekly' ).hide();
				$( '.daily' ).show();
				$( '#date' ).val( '' );
				$( '#buckets' ).val( '' );
				$( '.insert_weekly_games' ).html('');

				newgameobj.ResetCombo( 'season_week_id' );
				newgameobj.InitializeDates();
			}
			else if ( duration_id == 3 ) //Custom Weekly
			{
				$( '.insert_games' ).html('');
				newgameobj.ResetCombo( 'buckets' );
				newgameobj.GetAllAvailableWeek();

				$( '.daily' ).hide();
				$( '.weekly' ).show();
			}
			else if ( duration_id == 2 ) //Weekly
			{
				$( '.insert_games' ).html('');
				newgameobj.ResetCombo( 'buckets' );
				newgameobj.GetAllAvailableWeek();

				$( '.daily' ).hide();
				$( '.weekly' ).show();
			}
			else
			{
				$( '.daily' ).hide();
				$( '.weekly' ).hide();
			}
		}
	},

	GetAllDraftingStyle : function ( league_duration_id )
	{
		if(league_duration_id == 1)
		{
			$('.select_all_daily').show();
		}
		else
		{
			$('.select_all_daily').hide();	
		}
		$.ajax({
			url			: site_url+'admin/get_all_drafting_style',
			type		: 'POST',
			dataType	: 'json',
			async		: false,
			data		: 'league_duration_id='+league_duration_id,
			success		: function( response )
			{
				newgameobj.ComboFill( 'league_drafting_styles_id' , response );	
			}
			

			
		});
	},

	GetAllAvailableWeek : function ()
	{
		newgameobj.ComboFill( 'season_week_id' , newgameobj.all_available_week );
	},

	InitializeDates : function ()
	{
		$( "#date" ).datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat:"yy-mm-dd",
			minDate:mindate,
			beforeShowDay: new_game.available,
			onSelect:function( selectedDate )
			{
				newgameobj.buckets_status = false;
				$( '.total_game' ).hide();
				$( '.dateformError' ).hide().remove();
				newgameobj.ComboFill( 'buckets' , daily_label );
				newgameobj.CreateGameName();
				newgameobj.GetAvailableGameOfTheDayOrWeek();
			}
		});
	},

	GetPrizeDetails : function ()
	{
		//alert($( '#league_number_of_winner_id' ).val());
		var league_number_of_winner_id = $( '#league_number_of_winner_id' ).val();
		var size                       = Number ( $( '#sizes' ).val() );
		var entry_fee                  = $( '#entry_fees' ).val();		

		if ( league_number_of_winner_id != '' && !isNaN( size ) && size >= Number ( newgameobj.size_lower_limit ) && size <= Number ( newgameobj.size_upper_limit ) && entry_fee != '' && entry_fee >= Number ( newgameobj.entry_fee_lower_limit ) && entry_fee <= Number ( newgameobj.entry_fee_upper_limit ) )
		{
			$( '#prizes_detail' ).empty();
			$.each( newgameobj.number_of_winner_validation , function ( key , value ){

				if ( league_number_of_winner_id == value.number_of_winner_id )
				{
					var position_or_percentage = value.position_or_percentage;
					var places                 = value.places;
					var url = site_url+'common/prize_details/'+size+'/'+entry_fee+'/'+league_number_of_winner_id;
					if ( position_or_percentage == newgameobj.position )
					{
						if ( size < places )
						{
							$( '#league_number_of_winner_id' ).val( '' ).trigger( 'change' );
							jAlert( 'Invalid combination of Size and Prize.' );
							return false;
						}
						else
						{
							newgameobj.GetPrizeDetailsAndShow( url , league_number_of_winner_id);
						}
					}
					else
					{	
						if(places == 30 && size < 4)
						{
							$( '#league_number_of_winner_id' ).val( '' ).trigger( 'change' );
							jAlert( 'Invalid combination of Size and Prize.' );
							return false;
						}else
						{	
							newgameobj.GetPrizeDetailsAndShow( url , league_number_of_winner_id);
						}	
					}
				}
			});
		}
		else
		{
			$( '#prizes_detail' ).empty();
		}
	},

	GetPrizeDetailsAndShow : function ( url , league_number_of_winner_id)
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
				$( '#prizes_detail' ).empty().html( prize_details );
			}
		});
	},

	GetAvailableGameOfTheDayOrWeek : function ()
	{
		var duration_id = $( '#duration_id' ).val();
		if ( duration_id == '' )
		{
			return false;
		}
		else if ( duration_id == 1 )
		{
			if ( ! $( '#date' ).val() || ! $( '#buckets' ).val() )
				return false;
		}
		else if ( duration_id == 2 )
		{
			if ( ! $( '#season_week_id' ).val() )
				return false;
		}
		else if ( duration_id == 3 )
		{
			if ( ! $( '#season_week_id' ).val() )
				return false;
		}
		newgameobj.buckets_status = false;
		$.ajax({
			url			: site_url+'admin/get_available_game_of_the_day_or_week',
			type		: 'POST',
			dataType	: 'json',
			async		: false,
			data		: $( '.new_game' ).serialize(),
			success		: function( response )
			{
				var result = response.result
				var list   = response.game_list;
				
				newgameobj.buckets_status = result;
				//console.log(newgameobj.buckets_status);

				var league_label = $( '#league_id' ).find( ":selected" ).text();

				$( '#total_game' ).empty().append( 'Includes '+list.length+' '+league_label+' game(s)' ).show();

				$('#game_list').show();
				
				$( '.game_list' ).empty();

				if(duration_id == 1 && list.length > 0 )
				{
					$( '#total_game' ).empty().append( 'Includes '+list.length+' '+league_label+' game(s)' ).show();
					$('.select_all_daily').show();
				}
				else
				{
					$('.select_all_daily').hide();
				}

				if(duration_id == 2)
				{
					$( '#total_game_week' ).empty().append( 'Includes '+list.length+' '+league_label+' game(s)' ).show();
					$('.select_all_daily').hide();
				}
				if(duration_id == 3)
				{
					$( '#total_game_week' ).empty().append( 'Includes '+list.length+' '+league_label+' game(s)' ).show();
					$('.select_all_daily').hide();
				}

				// selected team array
				 
				var i=0;
				var game_selected = [];
				$('input[name^="gamelist"]').each(function() {
					game_selected[i] = $(this).val();
					i++;
				});
				if(duration_id == 1)
				{
					$.each( list , function ( key , value ){
						if($.inArray(value.season_game_unique_id,game_selected) != -1)
						{
							$( '.game_list' ).append( '<div class="show_week_list"><input type="checkbox" checked value='+value.season_game_unique_id+' class="checkbox_sel" onchange="new_game.list_of_game(this)" id="my_'+value.season_game_unique_id+'" ><span class="mtch_name">'+value.home+'@'+value.away+' '+value.season_scheduled_date+' ('+value.day_name+') </span></input></div>' );
						}else
						{
							$( '.game_list' ).append( '<div class="show_week_list"><input type="checkbox"  value='+value.season_game_unique_id+' class="checkbox_sel" onchange="new_game.list_of_game(this)" id="my_'+value.season_game_unique_id+'" ><span class="mtch_name">'+value.home+'@'+value.away+' '+value.season_scheduled_date+' ('+value.day_name+') </span></input></div>' );
						}
					});
				}
				else if(duration_id == 2)
				{
					$.each( list , function ( key , value ){
						if($.inArray(value.season_game_unique_id,game_selected) != -1)
						{
							$( '.insert_weekly_games' ).append( '<div class="show_week_list"><input type="checkbox" checked value='+value.season_game_unique_id+' class="checkbox_sel" onchange="new_game.list_of_game(this)" id="my_'+value.season_game_unique_id+'" ><span class="mtch_name">'+value.home+'@'+value.away+' '+value.season_scheduled_date+' ('+value.day_name+') </span></input></div>' );
						}else
						{
							$( '.insert_weekly_games' ).append( '<div class="show_week_list"><input type="checkbox"  value='+value.season_game_unique_id+' class="checkbox_sel"  onchange="new_game.list_of_game(this)" id="my_'+value.season_game_unique_id+'" ><span class="mtch_name">'+value.home+'@'+value.away+' '+value.season_scheduled_date+' ('+value.day_name+') </span></input></div>' );
						}
					});
				}
				else if(duration_id == 3)
				{
					$.each( list , function ( key , value ){
						if($.inArray(value.season_game_unique_id,game_selected) != -1)
						{
							$( '.insert_weekly_games' ).append( '<div class="show_week_list"><input type="checkbox" checked value='+value.season_game_unique_id+' class="checkbox_sel" onchange="new_game.list_of_game(this)" id="my_'+value.season_game_unique_id+'" ><span class="mtch_name">'+value.home+'@'+value.away+' '+value.season_scheduled_date+' ('+value.day_name+') </span></input></div>' );
						}else
						{
							$( '.insert_weekly_games' ).append( '<div class="show_week_list"><input type="checkbox"  value='+value.season_game_unique_id+' class="checkbox_sel"  onchange="new_game.list_of_game(this)" id="my_'+value.season_game_unique_id+'" ><span class="mtch_name">'+value.home+'@'+value.away+' '+value.season_scheduled_date+' ('+value.day_name+') </span></input></div>' );
						}
					});
				}
			}
		});
	},
	list_of_game : function(ths,val)
	{

		var isChecked = $(ths).prop('checked');
		var game_name = $(ths).next().text();
		var season_id = $(ths).val();
		var no_of_games = $('.insert_games > span').length;
		//alert(isChecked);
		if(val=='true')
		{
			$('#season_'+season_id).remove( );
		}

		if(isChecked == true)
		{	
			$( '.insert_games' ).append( '<span class="selected_games" id=season_'+season_id+'><input type="hidden" value='+season_id+' name="gamelist[]"/><span>'+game_name+'</span><span class="remove_game" onclick="$(\'#season_'+season_id+'\').remove();$(\'#my_'+season_id+'\').prop(\'checked\',false);">x</span></span>' );
		}
		else
		{
			$('#season_'+season_id).remove( );
		}
		//Used to uncheck the selectall checkbox if no games are selected.
		
		if($('.selected_games').length == '0')
        {
        	$('#uniform-selectall span').removeClass('checked');	
        	$('#uniform-selectall_daily span').removeClass('checked');	
        }
		
	},
	available : function ( date )
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

		if ( $.inArray ( dmy , newgameobj.seasons_dates ) != -1 )
		{
			return [ true , "" , "Available" ];
		}
		else
		{
			return [ false , "" , "No Game" ];
		}
	},

	ResetCombo : function( combo )
	{
		var label = combo+'_combo';
		$( '#'+combo ).empty().append( '<option value="">'+newgameobj[label]+'</option>' ).trigger( 'change' );
	},

	ComboFill : function( obj_id , item )
	{
		newgameobj.ResetCombo( obj_id );
		$.each( item , function( key , value ) {
			$( '#'+obj_id ).append( '<option value="'+key+'">'+value+'</option>' );
		});
	},

	CreateGameName : function(val)
	{
		var league_id    = $( '#league_id' ).val();
		var league_label = $( '#league_id' ).find( ":selected" ).text();

		var league_duration_id    = $( '#league_duration_id' ).val();
		var league_duration_label = $( '#league_duration_id' ).find( ":selected" ).text();

		var league_drafting_styles_id    = $( '#league_drafting_styles_id' ).val();
		var league_drafting_styles_label = $( '#league_drafting_styles_id' ).find( ":selected" ).text();

		var season_week_id       = $( '#season_week_id' ).val();
		var season_week_id_label = $( '#season_week_id' ).find( ":selected" ).text();

		var league_salary_cap_id    = $( '#league_salary_cap_id' ).val();
		var league_salary_cap_label = $( '#league_salary_cap_id' ).find( ":selected" ).text();

		var date = $( '#date' ).val();
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
		if(league_id == '2')
		{
			if ( league_duration_label == 'Daily'  && date != '' )
			{
				$("#selectall").attr("disabled", false);
				$('.select_all_week').show();
				$('#uniform-selectall span').removeClass('checked');	
				dateObj = $( '#date' ).datepicker( 'getDate' );
				day        = newgameobj.weekDay[ dateObj.getDay() ];
				year_label = newgameobj.year[ dateObj.getMonth() ];
				full_year  = dateObj.getFullYear();
				date_only  = dateObj.getDate();
				date_label = day+' '+year_label+' '+newgameobj.getPos( date_only );
			}
			else if ( $.trim( league_duration_label ) == 'Weekly' && season_week_id != '' )
			{
				$("#selectall").attr("disabled", false);
				$('.select_all_week').show();
				league_duration_label = 'Week '+season_week_id_label;
				$('#uniform-selectall span').removeClass('checked');	
			}
		}
		if(league_id == '3')
		{
			if ( league_duration_label == 'Daily'  && date != '' )
			{
				$("#selectall").attr("disabled", false);
				$('.select_all_week').show();
				$('#uniform-selectall span').removeClass('checked');	
				dateObj = $( '#date' ).datepicker( 'getDate' );
				day        = newgameobj.weekDay[ dateObj.getDay() ];
				year_label = newgameobj.year[ dateObj.getMonth() ];
				full_year  = dateObj.getFullYear();
				date_only  = dateObj.getDate();
				date_label = day+' '+year_label+' '+newgameobj.getPos( date_only );
			}
			else if ( $.trim( league_duration_label ) == 'Weekly' && season_week_id != '' )
			{

				$('.select_all_week').show();
				league_duration_label = 'Week '+season_week_id_label;
				$('#uniform-selectall span').removeClass('checked');	
				if(val!='true')
				{
					setTimeout(function(){
					    $('#selectall').prop('checked',true); 
					    $('#selectall').trigger('click'); 
					    $("#selectall").attr("disabled", true);
					    $('.checkbox_sel').attr("disabled", true);
					    $('.remove_game').hide();
					},100);
				}
			}
			else if ( $.trim( league_duration_label ) == 'Custom (Weekly)' && season_week_id != '' )
			{
				$("#selectall").attr("disabled", false);
				$('.select_all_week').show();
				league_duration_label = 'Week '+season_week_id_label;
				$('#uniform-selectall span').removeClass('checked');	
			}
		}

		var game_name = league_label+' '+league_duration_label+' '+league_drafting_styles_label+' '+league_salary_cap_label+' '+date_label;
		$( '#game_name' ).val( '' );
		$( '#game_name' ).val( $.trim( game_name ) );
		$( '#game_name_label' ).empty().html( $.trim( game_name ) );
	},

	getPos : function( pos )
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
	}
});

$( '.numbersOnly' ).keypress( function( event )
{
	if ( ( event.which != 46 || $( this ).val().indexOf( '.' ) != -1 ) && ( event.which < 48 || event.which > 57 ) && event.which != 8 && event.which != 0 )
	{
		event.preventDefault();
	}
});

$( '.intigerOnly' ).keyup(function (e) { 
	// this.value = this.value.replace(/[^0-9\.]/g,'');
	var key = e.keyCode;
	var allowed_key = [ 37 , 38 , 39 , 40 ];
	if ( $.inArray ( key , allowed_key ) != -1 ) return;
	this.value = this.value.replace(/[^0-9]/g,'');
});

$( '#season_week_id,#buckets' ).change(function (argument) {
	newgameobj.buckets_status = false;
	$('.insert_weekly_games').html('');
	$('.insert_games').html('');
	$( '.total_game' ).hide();
	$('#uniform-selectall_daily span').removeClass('checked');	
	newgameobj.GetAvailableGameOfTheDayOrWeek();
});

$(document).ready(function() {
    $('#selectall,#selectall_daily').click(function(event) {  //on click 
        if(this.checked) { // check select status
            $('.checkbox_sel').each(function() { //loop through each checkbox
                this.checked = true;  //select all checkboxes with class "checkbox1"   
                new_game.list_of_game(this,'true');            
            });
        }
        else
        {
            $('.checkbox_sel').each(function() { //loop through each checkbox
                this.checked = false; //deselect all checkboxes with class "checkbox1"                       
                $('.selected_games').remove();
                new_game.list_of_game(this,'true');
            });         
        }        
    });

     $("input:radio[name=prize_type]").click(function(){
     	var sel_val = $(this).val();
     	if(sel_val == 'Custom')
     	{
     		$('.custom').show();
     		$('.manual').hide();
     	}
     	else
     	{
     		$('.custom').hide();	
     		$('.manual').show();
     	}
     });
    
});


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
