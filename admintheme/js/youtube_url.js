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
	oTable = $( '#url' ).dataTable({
		"aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 0 ,3 ] }],
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""f>t<"F"lp>'
	});
}

$( "select , input:checkbox , input:radio , input:file" ).uniform();

$( document ).ready( function(){

	window.setTimeout( function(){ showloading(); } , 10 );

	Url = new Urlfn();

	Url.urllist = urllist;

	Url.InitializeUrlListing();
	
});

var Urlfn = function()
{
	urlObj = this;
};

$.extend( Urlfn.prototype , {

	urlObj 		: {},
	urllist		: {},
	status_0		: 'images/deactivate.png',
	status_1		: 'images/active.png',

	InitializeUrlListing : function()
	{
		if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); oTable = {}; }

		var UrlListingTemplete        = $( "#UrlListingTemplete" ).html();
		var UrlListingCompileTemplete = Handlebars.compile( UrlListingTemplete );

		var UrlListingData            = UrlListingCompileTemplete( urlObj.urllist );

		$( '#urllisting_container' ).empty().html( UrlListingData );

		if ( urlObj.urllist.length == 0 )
		{
			$( '.url' ).hide();
			$( '#url_wrapper' ).append( '<span><h3><p class="center red">No record found</p></h3></span>' );
		}
		else
		{
			$( '.url' ).show();
			window.setTimeout( function(){ createdatatable(); } , 50 );
			$( '#url_wrapper span' ).hide().remove();
		}

		$( '.all_th' ).empty().append( '<input type="checkbox" id="all" onclick="News.toggle_checkbox();">' );

		$( ".youtube_id , #all" ).uniform();
		resize();
		window.setTimeout( function(){ hideloading(); } , 60 );
		// hideloading();
	},

	SerializeUrlListForm : function()
	{
		return $( '#url_list' ).serialize();
	},

	FilterData : function( value , colum_index )
	{
		oTable.fnFilter( value , colum_index );
	},

	changestatusbybutton : function(id)
	{
		
	$.ajax({
			url			: site_url+'admin/update_url_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: {'youtube_id':id},
			success		: function( response )
			{
				if(response==1)
				{
					window.location.href=window.location.href;
				}
			}
		});
	},
});

$( window ).on( 'click' , '.youtube_id' , function(){

	var total_checked = $( '.youtube_id:checked' ).length;
	var total         = $( '.youtube_id' ).length;
	total_checked < total ? $( '#all' ).attr( 'checked' , false ).parent( 'span' ).removeClass( 'checked' ) : $( '#all' ).attr( 'checked' , true ).parent( 'span' ).addClass( 'checked' );

});

$( document ).ready( function(){
	$( '.jw125' ).each( function(){
		$( this ).css( 'width' , '125px' );
		$( this ).prev( 'span' ).css( {'width' : '125px' , 'text-align' : 'left' } );
		$( this ).parent( 'div' ).css( 'width' , '125px' );
	});
});

$( '#add_url' ).click( function(e){
	e.preventDefault();
	if( ! $("#valid").validationEngine( 'validate' ) )
	{
		return false;
	}
	else
	{
		$('#valid').submit();
	}
});