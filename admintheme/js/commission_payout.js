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
	oTable = $( '#commission' ).dataTable({
		"aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 0 , 8] }],
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""f>t<"F"lp>'
	});
}

$( "select , input:checkbox , input:radio , input:file" ).uniform();

$( document ).ready( function(){

	window.setTimeout( function(){ showloading(); } , 100 );

	Commission = new Commissionfn();

	Commission.commissionlist =commissionlist;

	Commission.InitializeCommissionListing();

	Commission.showValidMonth( true );
});

var Commissionfn = function()
{
	commissionObj = this;
};

$.extend( Commissionfn.prototype , {

	commissionObj 		: {},
	commissionlist		: {},
	status_0		: 'images/deactivate.png',
	status_1		: 'images/active.png',

	InitializeCommissionListing : function()
	{
		if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); oTable = {}; }

		var CommissionListingTemplete        = $( "#CommissionListingTemplete" ).html();
		var CommissionListingCompileTemplete = Handlebars.compile( CommissionListingTemplete );

		var CommissionListingData            = CommissionListingCompileTemplete( commissionObj.commissionlist );

		$( '#commissionlisting_container' ).empty().html( CommissionListingData );

		if ( commissionObj.commissionlist.length == 0 || commissionObj.commissionlist.length === undefined)
		{
			$( '.commission' ).hide();
			$( '#commission_wrapper' ).append( '<span class="p10"><h3><p class="center red">No record found</p></h3></span>' );
		}
		else
		{
			$( '.commission' ).show();
			window.setTimeout( function(){ createdatatable(); } , 200 );
			$( '#commission_wrapper span' ).hide().remove();
		}

		$( '.all_th' ).empty().append( '<input type="checkbox" id="all" onclick="Commission.toggle_checkbox();">' );

		$( ".promo_code_id , #all" ).uniform();

		Commission.numbersOnly();
		resize();
		window.setTimeout( function(){ hideloading(); } , 600 );
		// hideloading();
	},

	SerializeCommissionListForm : function()
	{
		return $( '#commission_list' ).serialize();
	},

	FilterData : function( value , colum_index )
	{
		oTable.fnFilter( value , colum_index );
	},

	UpdateCommission : function ()
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
			url			: site_url+'admin/update_commission_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: commissionObj.SerializeCommissionListForm(),
			success		: function( response )
			{
				commissionObj.UpdateCommissionStatus();
			}
		});
	},

	changestatusbybutton : function(id,change_status)
	{
		promo_code_id=[];
		promo_code_id.push(id);
		var month_selected = $( '#month_selected' ).val();
		var year_selected  = $( '#year_selected' ).val();
		$.ajax({
			url			: site_url+'admin/update_commission_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: {'promo_code_id':promo_code_id,'status':change_status,'month_selected':month_selected,'year_selected':year_selected},
			success		: function( response )
			{
				if(response==1)
				{
					if(change_status==0)
					{
						$('.new_'+id).html('');
						$('.new_'+id).append('<img src="images/deactivate.png" onclick="Commission.changestatusbybutton(\''+id+'\',1);" class="status_'+id+'">');				
					}
					else if(change_status==1)
					{
						$('.new_'+id).html('');
						$('.new_'+id).append('<img src="images/active.png" onclick="Commission.changestatusbybutton(\''+id+'\',0);" class="status_'+id+'">');
					}
				}
			}
		});
	},
	
	UpdateCommissionStatus : function()
	{
		var status = $( '#status' ).val();
		$.each( $( '.promo_code_id:checked' ) , function( key , promo_code_id_obj )
		{
			var promo_code_id = $( promo_code_id_obj ).val();
			$( '.status_'+promo_code_id ).attr( 'src' , commissionObj[ 'status_'+status ] );
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

	showValidMonth : function( reset_month )
	{
		var year = $( '#year' ).val();
		if ( year == Y )
		{
			for ( var i = M; i < 13; i++ )
			{
				o = i;
				if ( i <= 9 ) o = '0'+i;
				$( "option[value='"+o+"']" ).attr( 'disabled' , 'disabled' );
			};
			if ( reset_month === undefined ) $( '#month option:first' ).attr( "selected", "selected" ).trigger( 'change' );
		}
		else
		{
			$( '#month option' ).attr( "disabled" , false );
		}
	}
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

$( '#search' ).click( function(e){
	if ( ! $( '#year' ).val() )
	{
		jAlert( YEAR_ERROR );
		return false;
	}
	if ( ! $( '#month' ).val() )
	{
		jAlert( MONTH_ERROR );
		return false;
	}
});