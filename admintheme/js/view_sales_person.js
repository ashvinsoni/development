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
	oTable = $( '#person' ).dataTable({
		"aoColumnDefs": [{ 'bSortable': false, 'aTargets': [ 0 ,6, 7 ] }],
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""f>t<"F"lp>'
	});
}

$( "select , input:checkbox , input:radio , input:file" ).uniform();

$( document ).ready( function(){

	window.setTimeout( function(){ showloading(); } , 100 );

	Person = new Personfn();

	Person.personlist = personlist;

	Person.InitializePersonListing();
	
});

var Personfn = function()
{
	personObj = this;
};

$.extend( Personfn.prototype , {

	personObj 		: {},
	personlist		: {},
	status_0		: 'images/deactivate.png',
	status_1		: 'images/active.png',

	InitializePersonListing : function()
	{
		if ( typeof oTable.fnDestroy === 'function' ){ oTable.fnDestroy(); oTable = {}; }

		var PersonListingTemplete        = $( "#PersonListingTemplete" ).html();
		var PersonListingCompileTemplete = Handlebars.compile( PersonListingTemplete );

		var PersonListingData            = PersonListingCompileTemplete( personObj.personlist );

		$( '#personlisting_container' ).empty().html( PersonListingData );

		if ( personObj.personlist.length == 0 )
		{
			$( '.person' ).hide();
			$( '#person_wrapper' ).append( '<span><h3><p class="center red">No record found</p></h3></span>' );
		}
		else
		{
			$( '.person' ).show();
			window.setTimeout( function(){ createdatatable(); } , 200 );
			$( '#person_wrapper span' ).hide().remove();
		}

		$( '.all_th' ).empty().append( '<input type="checkbox" id="all" onclick="Person.toggle_checkbox();">' );

		$( ".sales_person_unique_id , #all" ).uniform();

		Person.numbersOnly();
		resize();
		window.setTimeout( function(){ hideloading(); } , 600 );
		// hideloading();
	},

	SerializePersonListForm : function()
	{
		return $( '#person_list' ).serialize();
	},

	FilterData : function( value , colum_index )
	{
		oTable.fnFilter( value , colum_index );
	},

	UpdatePerson : function ()
	{
		showloading();
		var total_checked = $( '.sales_person_unique_id:checked' ).length;
		if ( total_checked == 0 )
		{
			hideloading();
			jAlert( 'Please select person.' );
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
			url			: site_url+'admin/update_person_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: personObj.SerializePersonListForm(),
			success		: function( response )
			{
				personObj.UpdatePersonStatus();
			}
		});
	},
	changestatusbybutton : function(id,change_status)
	{
		sales_person_unique_id=[];
		sales_person_unique_id.push(id);
		$.ajax({
			url			: site_url+'admin/update_person_status',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: {'sales_person_unique_id':sales_person_unique_id,'status':change_status},
			success		: function( response )
			{
				if(response==1)
				{
					if(change_status==0)
					{
						$('.new_'+id).html('');
						$('.new_'+id).append('<img src="images/deactivate.png" onclick="Person.changestatusbybutton(\''+id+'\',1);" class="status_'+id+'">');				
					}
					else if(change_status==1)
					{
						$('.new_'+id).html('');
						$('.new_'+id).append('<img src="images/active.png" onclick="Person.changestatusbybutton(\''+id+'\',0);" class="status_'+id+'">');
					}
				}
			}
		});
	},
	
	UpdatePersonStatus : function()
	{
		var status = $( '#status' ).val();

		$.each( $( '.sales_person_unique_id:checked' ) , function( key , sales_person_unique_id_obj )
		{
			var sales_person_unique_id = $( sales_person_unique_id_obj ).val();
			$( '.status_'+sales_person_unique_id ).attr( 'src' , personObj[ 'status_'+status ] );
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
		var $checkboxes = $( '.sales_person_unique_id' );
		$checkboxes.attr( 'checked' , $all.is( ':checked' ) ? true : false );
		$all.is( ':checked' ) ? $( '.sales_person_unique_id' ).parent( 'span' ).addClass( 'checked' ) : $( '.sales_person_unique_id' ).parent( 'span' ).removeClass( 'checked' );
	},
});

$( window ).on( 'click' , '.sales_person_unique_id' , function(){

	var total_checked = $( '.sales_person_unique_id:checked' ).length;
	var total         = $( '.sales_person_unique_id' ).length;
	total_checked < total ? $( '#all' ).attr( 'checked' , false ).parent( 'span' ).removeClass( 'checked' ) : $( '#all' ).attr( 'checked' , true ).parent( 'span' ).addClass( 'checked' );

});

$( document ).ready( function(){
	$( '.jw125' ).each( function(){
		$( this ).css( 'width' , '125px' );
		$( this ).prev( 'span' ).css( {'width' : '125px' , 'text-align' : 'left' } );
		$( this ).parent( 'div' ).css( 'width' , '125px' );
	});
});