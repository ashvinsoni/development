$( document ).ready( function(){
	InitializeDatepicker();
});

function InitializeDatepicker()
{
	$( "#from_date" ).datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat:"yy-mm-dd",
		maxDate:0,
		minDate:"2013-01-01",
		onSelect:function( selectedDate )
		{
			$( '.dateformError' ).hide().remove();
		},
		onClose: function( selectedDate ) {
			$( "#to_date" ).datepicker( "option", "minDate", selectedDate );
		}
	});

	$( "#to_date" ).datepicker({
		
		changeMonth: true,
		changeYear: true,
		dateFormat:"yy-mm-dd",
		maxDate : 0,
		onSelect:function( selectedDate )
		{
			$( '.dateformError' ).hide().remove();		
		},
		onClose: function( selectedDate ) {
			$( "#from_date" ).datepicker( "option", "maxDate", selectedDate );
		}
	});
}

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
	oTable = $( '.report' ).dataTable({
		// "aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 0 , 5 , 6  , 7] }],
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""f>t<"F"lp>'
	});
}

function validate_form()
{
	if ( ! $( '#from_date' ).val() )
	{
		jAlert( FROM_DATE_ERROR );
		return false;
	}

	if ( ! $( '#to_date' ).val() )
	{
		jAlert( TO_DATE_ERROR );
		return false;
	}

	return true;
}

function create_user_report()
{
	if ( ! validate_form() )
		return false;

	$( '.user_report' ).fadeOut();
	showloading();

	$.ajax({
		url			: site_url+'admin/get_all_user_report',
		type		: 'POST',
		dataType	: 'json',
		async		: true,
		data		: $( '#report_frm' ).serialize(),
		success		: function( response )
		{
			if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); $( oTable ).css( 'width' , '' ); oTable = {}; }

			if ( $.isEmptyObject( response ) )
			{
				$( '#report_wrapper' ).append( '<span><h3><p class="center red">No record found</p></h3></span>' );
				window.setTimeout( function(){ $( '#report_wrapper span' ).fadeOut().remove(); } , 5000 );
				hideloading();
				return false;
			}

			var UserReportTemplete        = $( "#UserReportTemplete" ).html();
			var UserReportCompileTemplete = Handlebars.compile( UserReportTemplete );
			var UserReportData            = UserReportCompileTemplete( response );

			$( '#userreport_container' ).empty().html( UserReportData );
			window.setTimeout( function(){ createdatatable();hideloading(); $( '.user_report' ).fadeIn(); } , 50 );
		}
	});
}

function create_contest_report()
{
	if ( ! validate_form() )
		return false;

	$( '.contest_report' ).fadeOut();
	showloading();

	$.ajax({
		url			: site_url+'admin/get_all_contest_report',
		type		: 'POST',
		dataType	: 'json',
		async		: true,
		data		: $( '#report_frm' ).serialize(),
		success		: function( response )
		{
			if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); $( oTable ).css( 'width' , '' ); oTable = {}; }

			if ( $.isEmptyObject( response ) )
			{
				$( '#contest_report_wrapper' ).append( '<span><h3><p class="center red">No record found</p></h3></span>' );
				window.setTimeout( function(){ $( '#contest_report_wrapper span' ).fadeOut().remove(); } , 5000 );
				hideloading();
				return false;
			}

			var ContestReportTemplete        = $( "#ContestReportTemplete" ).html();
			var ContestReportCompileTemplete = Handlebars.compile( ContestReportTemplete );
			var ContestReportData            = ContestReportCompileTemplete( response );

			$( '#contest_report_container' ).empty().html( ContestReportData );
			window.setTimeout( function(){ createdatatable();hideloading(); $( '.contest_report' ).fadeIn(); } , 50 );
		}
	});
}

function create_game_report()
{
	if ( ! validate_form() )
		return false;

	$( '.game_report' ).fadeOut();
	showloading();

	$.ajax({
		url			: site_url+'admin/get_all_games_report',
		type		: 'POST',
		dataType	: 'json',
		async		: true,
		data		: $( '#report_frm' ).serialize(),
		success		: function( response )
		{
			if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); $( oTable ).css( 'width' , '' ); oTable = {}; }

			if ( $.isEmptyObject( response ) )
			{
				$( '#game_report_wrapper' ).append( '<span><h3><p class="center red">No record found</p></h3></span>' );
				window.setTimeout( function(){ $( '#game_report_wrapper span' ).fadeOut().remove(); } , 5000 );
				hideloading();
				return false;
			}

			var GameReportTemplete        = $( "#GameReportTemplete" ).html();
			var GameReportCompileTemplete = Handlebars.compile( GameReportTemplete );
			var GameReportData            = GameReportCompileTemplete( response );

			$( '#game_report_container' ).empty().html( GameReportData );
			window.setTimeout( function(){ createdatatable();hideloading(); $( '.game_report' ).fadeIn(); } , 50 );
		}
	});
}

function export_to_csv()
{
	if ( validate_form() )
		$( '#report_frm' ).submit();
}