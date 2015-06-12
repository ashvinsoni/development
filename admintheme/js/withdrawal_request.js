var oTable             = {};
var status_in_progress = false;
var img =
		{
			status_0: 'images/deactivate.png',
			status_1: 'images/active.png'
		};

$( document ).ready( function(){
	InitializeWithdrawalRequest();
	$( "select" ).uniform();
});

function createdatatable()
{
	oTable = $( '#withdrawal_request' ).dataTable({
		"aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 0 , 6 ] }],
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""f>t<"F"lp>'
	});
}

function InitializeWithdrawalRequest()
{
	showloading();
	var WithdrawalRequestTemplete        = $( "#WithdrawalRequestTemplete" ).html();
	var WithdrawalRequestCompileTemplete = Handlebars.compile( WithdrawalRequestTemplete );
	var WithdrawalRequestData            = WithdrawalRequestCompileTemplete( withdrawal_request );

	$( '#withdrawal_request_container' ).empty().html( WithdrawalRequestData );
	window.setTimeout( function(){ createdatatable();hideloading(); $( "input:checkbox" ).uniform(); } , 50 );
}

function update_batch_status_of_live_check()
{
	var total_checked = $( '.user_payment_withdraw_id:checked' ).length;
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
	update_live_check_status( $( '#withdrawal_request_frm' ).serialize() );
}

function update_live_check_status( user_data )
{
	$.ajax({
		url			: site_url+'admin/update_live_check_status',
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
					$.each( $( '.user_payment_withdraw_id:checked' ) , function( key , obj ){
						var s = 1;
						if ( status == 1 ) s = 0;
						$( '.status_'+$(obj).val() ).attr( 'src' , img[ 'status_'+status ] );
						$( '[data-upwi='+$(obj).val()+']' ).data( 'status' , s );
					});
				}
				else
				{
					var upwi   = user_data.upwi;
					var status = user_data.status;
					$.each( upwi , function( key , value ){
						var s = 1;
						if ( status == 1 ) s = 0;
						$( '.status_'+value ).attr( 'src' , img [ 'status_'+status ] );
						$( '[data-upwi='+value+']' ).data( 'status' , s );
					});
				}
			}
			status_in_progress = false;
		}
	});
}

function toggle_checkbox()
{
	$all = $( '#all' );
	var $checkboxes = $( '.user_payment_withdraw_id' );
	$checkboxes.attr( 'checked' , $all.is( ':checked' ) ? true : false );
	$all.is( ':checked' ) ? $( '.user_payment_withdraw_id' ).parent( 'span' ).addClass( 'checked' ) : $( '.user_payment_withdraw_id' ).parent( 'span' ).removeClass( 'checked' );
}

$( window ).on( 'click' , '.user_payment_withdraw_id' , function(){

	var total_checked = $( '.user_payment_withdraw_id:checked' ).length;
	var total         = $( '.user_payment_withdraw_id' ).length;
	total_checked < total ? $( '#all' ).attr( 'checked' , false ).parent( 'span' ).removeClass( 'checked' ) : $( '#all' ).attr( 'checked' , true ).parent( 'span' ).addClass( 'checked' );

});

$( window ).on( 'click' , '#live_check_status' , function(){
	if ( status_in_progress === true ) return false;
	status_in_progress = true;
	var user_data = { 'upwi' : [ $( this ).data( 'upwi' ) ] , 'status' : $( this ).data( 'status' ) }
	update_live_check_status( user_data );
});