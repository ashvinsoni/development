//=====Resizable table columns =====//

var onSampleResized = function(e){
	var columns = $( e.currentTarget ).find( "th" );
	var msg = "columns widths: ";
	columns.each(function(){ msg += $( this ).width() + "px; "; });
};	

function resize()
{
	
	$( ".resize" ).colResizable({
		liveDrag:true, 
		gripInnerHtml:"<div class='grip'></div>", 
		draggingClass:"dragging", 
		onResize:onSampleResized
	});
}


$( "select, input:checkbox, input:radio, input:file" ).uniform();

// $( 'div.selector span,#per_page_limit,[name="league_id"]' ).css('width', '90px');
// $( 'div.selector' ).css('width', '50px');
// $( '#game_list ul li .selector' ).css('width', '85px');

$( document ).ready( function(){
	Games = new GameFunction();
	Games.Gamelist = Gamelist;
	Games.link = link;
	Games.InitializeGameListing();
});

var GameFunction = function () {
	Game_Obj = this;
};

$.extend( GameFunction.prototype, {

	Game_Obj	: {},
	Gamelist	: {},
	link		: '',
	header_link	: {},

	InitializeGameListing : function()
	{
		( Game_Obj.Gamelist.length < 10 ) ? $( '.per_page' ).hide() : $( '.per_page' ).show();
		var GameListingTemplete        = $( "#GameListingTemplete" ).html();
		var GameListingCompileTemplete = Handlebars.compile( GameListingTemplete );
		var GameListingData            = GameListingCompileTemplete( Game_Obj.Gamelist );

		$( '#gamelisting_container' ).empty().html( GameListingData );
		$( '#link' ).empty().html( Game_Obj.link );

		hideloading();
		resize();
	},

	SerializeGameListForm : function()
	{
		return $( '#game_list' ).serialize();
	},

	SerializeGameData : function( dataobj , is_parse )
	{

		var data = $.parseJSON( dataobj );
		//console.log(data);
		if ( is_parse === false ) data = dataobj;

		Game_Obj.Gamelist    = data.data;
		Game_Obj.link        = data.pagilink;
		Game_Obj.header_link = data.header_link;

		Games.InitializeGameListing();
		Games.ShowHeaderSortLink();
	},

	ShowHeaderSortLink : function()
	{
		$.each( Game_Obj.header_link , function( key , value ) {
			$( '.'+key ).attr( 'onclick', value );
		});
	},

	ShowGameNameForEdit : function( index )
	{
		var game_data = Game_Obj.Gamelist;
		if ( game_data [ index ] != undefined )
		{
			$( '.game_edit_'+index+' , #game_nam_label_'+index ).hide();
			$( '.game_save_'+index+' , #game_name_'+index ).show();
		}
	},

	SaveGameName : function ( index )
	{
		var game_data = Game_Obj.Gamelist;
		if ( game_data [ index ] != undefined )
		{
			var game_name_old  = game_data[ index ].game_name;
			var new_game_name  = $.trim( $( '#game_name_'+index ).val() );
			var game_unique_id = game_data [ index ].game_unique_id;
			var game_id        = game_data [ index ].game_id;

			if ( ! new_game_name )
			{
				$( '#game_name_'+index ).val(game_name_old);
				jAlert( GAME_NAME_ERROR );
				return false;
			}

			if ( game_name_old != new_game_name )
			{
				showloading();
				var post_data = 'game_name='+new_game_name+'&game_id='+game_id+'&game_unique_id='+game_unique_id;

				$.ajax({
					url			: site_url+'admin/update_game_name',
					type		: 'POST',
					async		: false,
					data		: post_data,
					success		: function( response )
					{
						$( '#game_nam_label_'+index ).empty().append( new_game_name );
					}
				});
			}

			$( '.game_save_'+index+' , #game_name_'+index ).hide();
			$( '.game_edit_'+index+' , #game_nam_label_'+index ).show();
			hideloading();
		}
	},

	SearchGame : function ()
	{
		showloading();

		$.ajax({
			url			: site_url+'admin/game_listing',
			type		: 'POST',
			dataType	: 'json',
			async		: false,
			data		: Game_Obj.SerializeGameListForm(),
			success		: function( response )
			{
				Game_Obj.SerializeGameData( response , false );
			}
		});
	},

	SearchGameCancelled : function ()
	{
		showloading();

		$.ajax({
			url			: site_url+'admin/game_listing_cancelled',
			type		: 'POST',
			dataType	: 'json',
			async		: false,
			data		: Game_Obj.SerializeGameListForm(),
			success		: function( response )
			{
				Game_Obj.SerializeGameData( response , false );
			}
		});
	},

	SearchGameCompleted : function ()
	{
		showloading();

		$.ajax({
			url			: site_url+'admin/game_listing_completed',
			type		: 'POST',
			dataType	: 'json',
			async		: false,
			data		: Game_Obj.SerializeGameListForm(),
			success		: function( response )
			{
				Game_Obj.SerializeGameData( response , false );
			}
		});
	}
	

});

function showMerginPlayer(mainGameId,selectedId)
	{
		showloading();

		$.ajax({
			url			: site_url+'admin/ajax_get_game_merging_player',
			type		: 'POST',
			dataType	: 'json',
			async		: false,
			data		: 'mainGameId='+mainGameId+'&selectedId='+selectedId,
			success		: function( response )
			{
				
				$('#merging_response').html(response.view);
				hideloading();
			}
		});
	}

function saveMergeGame(){
	var main_game_id_array = new Array();
	var selected_game_id_array = new Array();
	// check duplicate id in main game
	$('#merge_lft tr').each(function(){
		main_game_id_array.push($(this).attr('rel'));		
	});
	var main_sorted_arr = main_game_id_array.sort();
	
	var duplicate_id_main_game = [];
	for (var i = 0; i < main_game_id_array.length - 1; i++) {
	    if (main_sorted_arr[i + 1] == main_sorted_arr[i]) {
	        duplicate_id_main_game.push(main_sorted_arr[i]);
	    }
	}

	// check duplicate id in selected game
	$('#merge_rht tr').each(function(){
		selected_game_id_array.push($(this).attr('rel'));		
	});
	var selected_sorted_arr = selected_game_id_array.sort();
	
	var duplicate_id_selected_game = [];
	for (var i = 0; i < selected_game_id_array.length - 1; i++) {
	    if (selected_sorted_arr[i + 1] == selected_sorted_arr[i]) {
	        duplicate_id_selected_game.push(selected_sorted_arr[i]);
	    }
	}
	
	if (duplicate_id_selected_game.length !=0) {
		jAlert(MERGING_SAME_USER);
		return false;
	}if (duplicate_id_main_game.length !=0) {
		jAlert(MERGING_SAME_USER);		
		return false;
	} if(main_game_id_array.length > $("#game_main_size").val()) {
		jAlert(MERGING_GAME_USER_SIZE);
		return false;
	}if(selected_game_id_array.length > $("#game_selected_size").val()) {
		jAlert(MERGING_GAME_USER_SIZE);		
		return false;
	}


	var main_game_array = {
						game_main_user_id:main_game_id_array,
						game_main_unique_id:$("#game_main_unique_id").val(),
						game_selected_user_id:selected_game_id_array,
						game_selected_unique_id:$("#game_selected_unique_id").val()
					};
	
	showloading();
	$.ajax({
		url			: site_url+'admin/save_merge_game',
		type		: 'POST',
		dataType	: 'json',
		async		: false,
		data		: main_game_array,
		success		: function( response ) {	
			if (response.back_to_list == '1'){
				jAlert('Game merged sucessfuly');
				setTimeout(function(){
					window.location.href=site_url+'admin';
				},'2000');
				
			} else{
				jAlert('Game merged sucessfuly');
				setTimeout(function(){
					window.location.reload();
				},'2000');
				
			}			
			
			hideloading();
		}
	});
}

function makeRemoveFeature(ths){
	showloading();
	var game_unique_id = $(ths).val();
	var is_feature = ths.checked;
	$.ajax({
		url			: site_url+'admin/ajax_make_remove_feature',
		type		: 'POST',
		dataType	: 'json',
		async		: false,
		data		: 'is_feature='+is_feature+'&game_unique_id='+game_unique_id,
		success		: function( response ) {			
			hideloading();
		}
	});
}