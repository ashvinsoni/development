var oTable             = {};
var status_in_progress = false;
var img =
		{
			status_0: 'images/deactivate.png',
			status_1: 'images/active.png'
		};

$( document ).ready( function(){
	InitializeWithdrawalRequest();
});

function createdatatable()
{
	oTable = $( '#withdrawal_request' ).dataTable({
		"aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 5 ] }],
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
	window.setTimeout( function(){ createdatatable();hideloading(); } , 50 );
}