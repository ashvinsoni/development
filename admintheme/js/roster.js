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

var oTable = {};
function createdatatable()
{
	oTable = $( '#roster' ).dataTable({
		"aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 0 , 5 , 6  , 7 , 8 , 9] }],
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""f>t<"F"lp>'
	});
}

$( "select , input:checkbox , input:radio , input:file" ).uniform();

$( document ).ready( function(){

	showloading();

	Roster = new Rosterfn();

	Roster.rosterlist = rosterlist;
	Roster.position   = position;
	Roster.team       = team;
	window.setTimeout( function(){
		Roster.InitializeRosterListing();
		Roster.InitializePosition( true );
		Roster.InitializeTeam( true );
	} , 100 );
});

var Rosterfn = function()
{
	rosterObj = this;
};

$.extend( Rosterfn.prototype , {
	
	rosterObj 		: {},
	rosterlist		: {},
	position 		: {},
	team 			: {},
	position_combo 	: 'Select position',
	team_combo 		: 'Select team',
	status_0		: 'images/deactivate.png',
	status_1		: 'images/active.png',

	InitializeRosterListing : function()
	{
		if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); $( oTable ).css( 'width' , '' ); oTable = {}; }

		var RosterListingTemplete        = $( "#RosterListingTemplete" ).html();
		var RosterListingCompileTemplete = Handlebars.compile( RosterListingTemplete );
		var RosterListingData            = RosterListingCompileTemplete( rosterObj.rosterlist );

		$( '#rosterlisting_container' ).empty().html( RosterListingData );

		if ( rosterObj.rosterlist.length == 0 )
		{
			$( '.roster' ).hide();
			$( '#roster_wrapper' ).append( '<span><h3><p class="center red">No record found</p></h3></span>' );
		}
		else
		{
			$( '.roster' ).show();
			// createdatatable();
			window.setTimeout( function(){ createdatatable(); } , 50 );
			$( '#roster_wrapper span' ).hide().remove();
		}

		$( '.all_th' ).empty().append( '<input type="checkbox" id="all" onclick="Roster.toggle_checkbox();">' );

		$( ".player_unique_id , #all" ).uniform();

		rosterObj.numbersOnly();
		resize();
		window.setTimeout( function(){ hideloading(); } , 60 );
	},

	InitializePosition : function( hide_loading )
	{
		$( '#position' ).prev( 'span' ).empty().html( rosterObj.position_combo );
		$( '#position' ).empty().append( '<option value="">'+rosterObj.position_combo+'</option>' );
		$.each( rosterObj.position , function( key , value ){
			$( '#position' ).append( '<option value="'+key+'">'+value+'</option>' );
		});

		if ( hide_loading != true )
			hideloading();
	},

	InitializeTeam : function( hide_loading )
	{
		$( '#team_abbreviation' ).prev( 'span' ).empty().html( rosterObj.team_combo );
		$( '#team_abbreviation' ).empty().append( '<option value="">'+rosterObj.team_combo+'</option>' );
		$.each( rosterObj.team , function( key , value ){
			$( '#team_abbreviation' ).append( '<option value="'+value.team_market+' '+value.team_name+'">'+value.team_market+' '+value.team_name+'</option>' );
		});
		if ( hide_loading != true )
			hideloading();
	},

	SerializeRosterListForm : function()
	{
		var serializeData = $( '#roster_list' ).serialize();
		// if condition added by mahendra sujal
		if($('.player_unique_id:checked').is(":checked")) {
			$.each( $( '.player_unique_id:checked' , oTable.fnGetNodes() ) , function( key , player_unique_id_obj )
			{

				var player_unique_id = $( player_unique_id_obj ).val();

				var injury_name = 'injury_status_'+player_unique_id;
				var injury = $( '[name="'+injury_name+'"]' , oTable.fnGetNodes() ).val();

				var salary_name = 'salary_'+player_unique_id;
				var salary = $( '[name="'+salary_name+'"]' , oTable.fnGetNodes() ).val();
				serializeData += '&'+salary_name+'='+salary+'&'+injury_name+'='+injury+'&player_unique_id[]='+player_unique_id;
			});
		}
		

		return serializeData;
	},

	FilterData : function( value , colum_index )
	{
		oTable.fnFilter( value , colum_index );
	},

	SearchByName : function( obj )
	{
		var full_name = $( obj ).val();
		rosterObj.FilterData( full_name , 1 );
	},

	SearchByPosition : function ( obj )
	{
		var position = $( obj ).val();
		rosterObj.FilterData( position , 4 );
	},

	SearchByTeam : function ( obj )
	{
		var team_abbreviation = $( obj ).val();
		rosterObj.FilterData( team_abbreviation , 3 );
	},

	SearchByLeague : function ()
	{
		showloading();

		$.ajax({
			url			: site_url+'admin/get_roster_position_team_by_league',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: rosterObj.SerializeRosterListForm(),
			success		: function( response )
			{
				//console.log(response);

				$( '#all' ).attr( 'checked' , false );
				$( '#all' ).parent( 'span' ).removeClass( 'checked' );
				rosterObj.rosterlist = response.rosterlist;
				rosterObj.position   = response.position;
				rosterObj.team       = response.team;

				rosterObj.InitializeRosterListing();
				rosterObj.InitializePosition();
				rosterObj.InitializeTeam();
				hideloading();
			}
		});
	},

	UpdateRoster : function ()
	{
		showloading();
		var total_checked = $( '.player_unique_id:checked' , oTable.fnGetNodes() ).length;
		if ( total_checked == 0 )
		{
			hideloading();
			jAlert( 'Please select player.' );
			return false;
		}

		$.ajax({
			url			: site_url+'admin/update_temp_roster',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: rosterObj.SerializeRosterListForm(),
			success		: function( response )
			{
				rosterObj.UpdateRosterStatus();
			}
		});
	},
	
	UpdateRosterStatus : function()
	{
		var status = $( '#status' ).val();
		$.each( $( '.player_unique_id:checked' , oTable.fnGetNodes() ) , function( key , player_unique_id_obj )
		{
			var player_unique_id = $( player_unique_id_obj ).val();
			$( '.status_'+player_unique_id , oTable.fnGetNodes()  ).attr( 'src' , rosterObj[ 'status_'+status ] );
		});
		hideloading();
	},

	ReleasePlayer : function ()
	{
		jConfirm( 'Are you sure you want to release player?' , 'Please confirm' , function( r )
		{
			if ( r == true )
			{
				showloading();
				$.ajax({
					url			: site_url+'admin/release_player',
					type		: 'POST',
					async		: true,
					data		: rosterObj.SerializeRosterListForm(),
					success		: function( response )
					{
						console.log(response);
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
						rosterObj.UpdateRosterStatus();
					},
					complete : function ()
					{
						hideloading();
					}
				});
			}
		});
	},

	numbersOnly : function()
	{
		$( '.numbersOnly' ).keypress( function( event )
		{
			if ( ( event.which != 46 || $( this ).val().indexOf( '.' ) != -1 ) && ( event.which < 48 || event.which > 57 ) && event.which != 0 && event.which != 8 )
			{
				event.preventDefault();
			}
		});
	},

	toggle_checkbox : function()
	{
		$all = $( '#all' );
		var $checkboxes = $( '.player_unique_id' );
		$checkboxes.attr( 'checked' , $all.is( ':checked' ) ? true : false );
		$all.is( ':checked' ) ? $( '.player_unique_id' ).parent( 'span' ).addClass( 'checked' ) : $( '.player_unique_id' ).parent( 'span' ).removeClass( 'checked' );
	}
});

$( window ).on( 'click' , '.player_unique_id' , function(){

	var total_checked = $( '.player_unique_id:checked' ).length;
	var total         = $( '.player_unique_id' ).length;
	total_checked < total ? $( '#all' ).attr( 'checked' , false ).parent( 'span' ).removeClass( 'checked' ) : $( '#all' ).attr( 'checked' , true ).parent( 'span' ).addClass( 'checked' );

});

$( document ).ready( function(){
	$( '.jw125' ).each( function(){
		$( this ).css( 'width' , '125px' );
		$( this ).prev( 'span' ).css( {'width' : '125px' , 'text-align' : 'left' } );
		$( this ).parent( 'div' ).css( 'width' , '125px' );
	});
});

$( window ).on( 'keydown' , '#salary' , function(){
	var pui = $( this ).data( 'pui' );
	$( "input[type=checkbox][value="+pui+"]" ).attr( "checked" , true );
	$( "input[type=checkbox][value="+pui+"]" ).parent( 'span' ).addClass( 'checked' );
});