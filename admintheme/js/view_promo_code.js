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
	oTable = $( '#promo' ).dataTable({
		"aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 0 , 8,9 ] }],
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""f>t<"F"lp>'
	});
}

$( "select , input:checkbox , input:radio , input:file" ).uniform();

$( document ).ready( function(){

	window.setTimeout( function(){ showloading(); } , 100 );

	Promo = new Promofn();

	Promo.promolist = promolist;

	Promo.InitializePromoListing();
	
});

var Promofn = function()
{
	promoObj = this;
};

$.extend( Promofn.prototype , {

	promoObj 		: {},
	promolist		: {},
	status_0		: 'images/deactivate.png',
	status_1		: 'images/active.png',

	InitializePromoListing : function()
	{
		if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); oTable = {}; }

		var PromoListingTemplete        = $( "#PromoListingTemplete" ).html();
		var PromoListingCompileTemplete = Handlebars.compile( PromoListingTemplete );

		var PromoListingData            = PromoListingCompileTemplete( promoObj.promolist );

		$( '#promolisting_container' ).empty().html( PromoListingData );

		if ( promoObj.promolist.length == 0 )
		{
			$( '.promo' ).hide();
			$( '#promo_wrapper' ).append( '<span><h3><p class="center red">No record found</p></h3></span>' );
		}
		else
		{
			$( '.promo' ).show();
			window.setTimeout( function(){ createdatatable(); } , 200 );
			$( '#promo_wrapper span' ).hide().remove();
		}

		$( '.all_th' ).empty().append( '<input type="checkbox" id="all" onclick="Promo.toggle_checkbox();">' );

		$( ".sales_person_id , #all" ).uniform();

		Promo.numbersOnly();
		resize();
		window.setTimeout( function(){ hideloading(); } , 600 );
		// hideloading();
	},

	SerializePromoListForm : function()
	{
		return $( '#promo_code' ).serialize();
	},

	FilterData : function( value , colum_index )
	{
		oTable.fnFilter( value , colum_index );
	},

	UpdatePromo : function ()
	{
		showloading();
		var total_checked = $( '.promo_code_id:checked' ).length;
		if ( total_checked == 0 )
		{
			hideloading();
			jAlert( 'Please select promo code.' );
			return false;
		}
		if($( '#status' ).val()=="")
		{
			hideloading();
			jAlert( 'Please select status.' );
			return false;
		}

		$.ajax({
			url			: site_url+'admin/update_promo_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: promoObj.SerializePromoListForm(),
			success		: function( response )
			{
				promoObj.UpdatePromoStatus();
			}
		});
	},
	changestatusbybutton : function(id,change_status)
	{
		promo_code_id=[];
		promo_code_id.push(id);
		$.ajax({
			url			: site_url+'admin/update_promo_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: {'promo_code_id':promo_code_id,'status':change_status},
			success		: function( response )
			{
				if(response==1)
				{
					if(change_status==0)
					{
						$('.new_'+id).html('');
						$('.new_'+id).append('<img src="images/deactivate.png" onclick="Promo.changestatusbybutton(\''+id+'\',1);" class="status_'+id+'">');				
					}
					else if(change_status==1)
					{
						$('.new_'+id).html('');
						$('.new_'+id).append('<img src="images/active.png" onclick="Promo.changestatusbybutton(\''+id+'\',0);" class="status_'+id+'">');
					}
				}
			}
		});
	},
	
	UpdatePromoStatus : function()
	{
		var status = $( '#status' ).val();
		$.each( $( '.promo_code_id:checked' ) , function( key , promo_code_id_obj )
		{
			console.log(promo_code_id_obj);
			var promo_code_id = $( promo_code_id_obj ).val();
			$( '.status_'+promo_code_id ).attr( 'src' , promoObj[ 'status_'+status ] );
		});
		hideloading();
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
		var $checkboxes = $( '.promo_code_id' );
		$checkboxes.attr( 'checked' , $all.is( ':checked' ) ? true : false );
		$all.is( ':checked' ) ? $( '.promo_code_id' ).parent( 'span' ).addClass( 'checked' ) : $( '.promo_code_id' ).parent( 'span' ).removeClass( 'checked' );
	},
});

$( window ).on( 'click' , '.promo_code_id' , function(){

	var total_checked = $( '.promo_code_id:checked' ).length;
	var total         = $( '.promo_code_id' ).length;
	total_checked < total ? $( '#all' ).attr( 'checked' , false ).parent( 'span' ).removeClass( 'checked' ) : $( '#all' ).attr( 'checked' , true ).parent( 'span' ).addClass( 'checked' );

});

$( document ).ready( function(){
	$( '.jw125' ).each( function(){
		$( this ).css( 'width' , '125px' );
		$( this ).prev( 'span' ).css( {'width' : '125px' , 'text-align' : 'left' } );
		$( this ).parent( 'div' ).css( 'width' , '125px' );
	});
});