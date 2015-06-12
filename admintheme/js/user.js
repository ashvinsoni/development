var onSampleResized = function(e){
	var columns = $( e.currentTarget ).find( "th" );
	var msg = "columns widths: ";
	columns.each(function(){ msg += $( this ).width() + "px; "; });
};

var oTable = {};
function createdatatable()
{
	oTable = $( '#user_tbl' ).dataTable({
		"aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 0 , 6 ] }],
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""f>t<"F"lp>',
		'iDisplayLength': 100
	});
}

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
$( 'div.selector span,#status' ).css('width', '155px');
$( 'div.selector' ).css('width', '130px');

$( document ).ready( function(){
	showloading();
	User = new User_Proto();
	User.user_list = user_list;
	window.setTimeout( function(){
		User.InitializeUserListing();
	} , 100 );
});

var User_Proto = function () {
	User_Obj = this;
};

$.extend( User_Proto.prototype, {

	User_Obj	: {},
	user_list 	: {},
	status_0  	: 'images/deactivate.png',
	status_1 	: 'images/active.png',
	status_in_progress : false,

	InitializeUserListing : function()
	{
		if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); oTable = {}; }

		var UserListingTemplete        = $( "#UserListingTemplete" ).html();
		var UserListingCompileTemplete = Handlebars.compile( UserListingTemplete );
		var UserListingData            = UserListingCompileTemplete( User_Obj.user_list );

		$( '#userdetail_container' ).empty().html( UserListingData );

		if ( User_Obj.user_list.length == 0 )
		{
			$( '.user_tbl' ).hide();
			$( '#user_wrapper' ).append( '<span><h3><p class="center red">No record found</p></h3></span>' );
		}
		else
		{
			$( '.user_tbl' ).show();
			// createdatatable();
			window.setTimeout( function(){ createdatatable(); } , 50 );
			$( '#user_wrapper span' ).hide().remove();
		}

		$( '.all_th' ).empty().append( '<input type="checkbox" id="all" onclick="User.toggle_checkbox();">' );

		$( ".user_id , #all" ).uniform();
		resize();
		window.setTimeout( function(){ hideloading(); } , 60 );
	},

	update_batch_status_of_user : function()
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
		User.update_user_status( $( '#user_list' ).serialize() );
	},

	update_user_status : function( user_data )
	{
		$.ajax({
			url			: site_url+'admin/update_user_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: user_data,
			success		: function( response )
			{
				if ( response.response != 0 )
				{
					if ( typeof user_data === "string" )
					{
						var status = $( '#status' ).val();
						$.each( $( '.user_id:checked' ) , function( key , obj ){
							var s = 1;
							if ( status == 1 ) s = 0;
							$( '.status_'+$(obj).val() ).attr( 'src' , User_Obj['status_'+status] );
							$( '[data-ui='+$(obj).val()+']' ).data( 'status' , s );
						});
					}
					else
					{
						var ui     = user_data.ui;
						var status = user_data.status;
						$.each( ui , function( key , value ){
							var s = 1;
							if ( status == 1 ) s = 0;
							$( '.status_'+value ).attr( 'src' , User_Obj['status_'+status] );
							$( '[data-ui='+value+']' ).data( 'status' , s );
						});
					}
				}
				User_Obj.status_in_progress = false;
			}
		});
	},

	toggle_checkbox : function()
	{
		$all = $( '#all' );
		var $checkboxes = $( '.user_id' );
		$checkboxes.attr( 'checked' , $all.is( ':checked' ) ? true : false );
		$all.is( ':checked' ) ? $( '.user_id' ).parent( 'span' ).addClass( 'checked' ) : $( '.user_id' ).parent( 'span' ).removeClass( 'checked' );
	}
});

$( window ).on( 'click' , '.user_id' , function(){

	var total_checked = $( '.user_id:checked' ).length;
	var total         = $( '.user_id' ).length;
	total_checked < total ? $( '#all' ).attr( 'checked' , false ).parent( 'span' ).removeClass( 'checked' ) : $( '#all' ).attr( 'checked' , true ).parent( 'span' ).addClass( 'checked' );

});

$( window ).on( 'click' , '#user_status' , function(){
	if ( User_Obj.status_in_progress === true ) return false;
	User_Obj.status_in_progress = true;
	var user_data = { 'ui' : [$(this).data( 'ui' )] , 'status' : $(this).data( 'status' ) }
	User.update_user_status( user_data );
});