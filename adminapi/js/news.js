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
	oTable = $( '#news' ).dataTable({
		"aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 0 ,4, 5 ] }],
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""f>t<"F"lp>'
	});
}

$( "select , input:checkbox , input:radio , input:file" ).uniform();

$( document ).ready( function(){

	window.setTimeout( function(){ showloading(); } , 10 );

	News = new Newsfn();

	News.newslist = newslist;

	News.InitializeNewsListing();
	
});

var Newsfn = function()
{
	newsObj = this;
};

$.extend( Newsfn.prototype , {

	newsObj 		: {},
	newslist		: {},
	status_0		: 'images/deactivate.png',
	status_1		: 'images/active.png',

	InitializeNewsListing : function()
	{
		if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); oTable = {}; }

		var NewsListingTemplete        = $( "#NewsListingTemplete" ).html();
		var NewsListingCompileTemplete = Handlebars.compile( NewsListingTemplete );

		var NewsListingData            = NewsListingCompileTemplete( newsObj.newslist );

		$( '#newslisting_container' ).empty().html( NewsListingData );

		if ( newsObj.newslist.length == 0 )
		{
			$( '.news' ).hide();
			$( '#news_wrapper' ).append( '<span><h3><p class="center red">No record found</p></h3></span>' );
		}
		else
		{
			$( '.news' ).show();
			window.setTimeout( function(){ createdatatable(); } , 50 );
			$( '#news_wrapper span' ).hide().remove();
		}

		$( '.all_th' ).empty().append( '<input type="checkbox" id="all" onclick="News.toggle_checkbox();">' );

		$( ".news_id , #all" ).uniform();

		News.numbersOnly();
		resize();
		window.setTimeout( function(){ hideloading(); } , 60 );
		// hideloading();
	},

	SerializeNewsListForm : function()
	{
		return $( '#news_list' ).serialize();
	},

	FilterData : function( value , colum_index )
	{
		oTable.fnFilter( value , colum_index );
	},

	UpdateNews : function ()
	{
		showloading();
		var total_checked = $( '.news_id:checked' ).length;
		if ( total_checked == 0 )
		{
			hideloading();
			jAlert( 'Please select news.' );
			return false;
		}
		var status = $( '#status' ).val();
		if(status=="")
		{
			hideloading();
			jAlert( 'Please select status.' );
			return false;
		}

		$.ajax({
			url			: site_url+'admin/update_news_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: newsObj.SerializeNewsListForm(),
			success		: function( response )
			{
				newsObj.UpdateNewsStatus();
			}
		});
	},
	changestatusbybutton : function(id,change_status)
	{
		news_id=[];
		news_id.push(id);
		$.ajax({
			url			: site_url+'admin/update_news_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: {'news_id':news_id,'status':change_status},
			success		: function( response )
			{
				if(response==1)
				{
					if(change_status==0)
					{
						$('.new_'+id).html('');
						$('.new_'+id).append('<img src="images/deactivate.png" onclick="News.changestatusbybutton(\''+id+'\',1);" class="status_'+id+'">');				
					}
					else if(change_status==1)
					{
						$('.new_'+id).html('');
						$('.new_'+id).append('<img src="images/active.png" onclick="News.changestatusbybutton(\''+id+'\',0);" class="status_'+id+'">');
					}
				}
			}
		});
	},
	
	UpdateNewsStatus : function()
	{
		var status = $( '#status' ).val();

		$.each( $( '.news_id:checked' ) , function( key , news_id_obj )
		{
			var news_id = $( news_id_obj ).val();
			$( '.status_'+news_id ).attr( 'src' , newsObj[ 'status_'+status ] );
		});
		hideloading();
	},

	Editnews : function(id)
	{
		//var random_number=Math.floor((Math.random()*1000)+1);
		window.location.href=site_url+'admin/edit_news/'+id;
	},

	
	numbersOnly : function()
	{
		$( '.numbersOnly' ).keypress( function( event )
		{
			if ( ( event.which != 46 || $( this ).val().indexOf( '.' ) != -1 ) && ( event.which < 48 || event.which > 57 ) )
			{
				event.preventDefault();
			}
		});
	},

	toggle_checkbox : function()
	{
		$all = $( '#all' );
		var $checkboxes = $( '.news_id' );
		$checkboxes.attr( 'checked' , $all.is( ':checked' ) ? true : false );
		$all.is( ':checked' ) ? $( '.news_id' ).parent( 'span' ).addClass( 'checked' ) : $( '.news_id' ).parent( 'span' ).removeClass( 'checked' );
	},
});

$( window ).on( 'click' , '.news_id' , function(){

	var total_checked = $( '.news_id:checked' ).length;
	var total         = $( '.news_id' ).length;
	total_checked < total ? $( '#all' ).attr( 'checked' , false ).parent( 'span' ).removeClass( 'checked' ) : $( '#all' ).attr( 'checked' , true ).parent( 'span' ).addClass( 'checked' );

});

$( document ).ready( function(){
	$( '.jw125' ).each( function(){
		$( this ).css( 'width' , '125px' );
		$( this ).prev( 'span' ).css( {'width' : '125px' , 'text-align' : 'left' } );
		$( this ).parent( 'div' ).css( 'width' , '125px' );
	});
});