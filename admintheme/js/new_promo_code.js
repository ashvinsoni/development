
//$( "#valid" ).validationEngine();

$( "select, input:checkbox, input:radio, input:file" ).uniform();

$( document ).ready( function(){
	$( 'input[name=type]' ).attr( 'checked' , false );
	new_promo_code = new Newpromo();
	new_promo_code.InitializeState();
	new_promo_code.InitializeDates();
});

var Newpromo = function()
{
	newpromoobj = this;
};

$.extend( Newpromo.prototype , {

	newpromoobj						: {},
	state_id_combo					: 'Select State',
	sales_person_id_combo			: 'Select Person',


	
	InitializeState : function()
	{
		newpromoobj.ComboFill( 'state_id' , state );
		$( '#state_id' ).val(sales_person.state_id ).trigger( 'change' );
	},

	InitializeDates : function ()
	{
		$( "#start_date" ).datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat:"yy-mm-dd",
			minDate:today,
			onSelect:function( selectedDate )
			{
				$( '.dateformError' ).hide().remove();
			},
			onClose: function( selectedDate ) {
				$( "#expiry_date" ).datepicker( "option", "minDate", selectedDate );
			}
		})

		$( "#expiry_date" ).datepicker({
			minDate: '+1d',
			changeMonth: true,
			changeYear: true,
			dateFormat:"yy-mm-dd",
			//minDate:mindate,
			onSelect:function( selectedDate )
			{
				$( '.dateformError' ).hide().remove();		
			},
			onClose: function( selectedDate ) {
				$( "#start_date" ).datepicker( "option", "maxDate", selectedDate );
			}
		})
	},

	InitializePerson : function( obj )
	{
		var type = $( obj ).val();
		newpromoobj.ResetCombo( 'sales_person_id' );
		if ( type == '' )
		{
			newpromoobj.ResetCombo( 'sales_person_id' );

		}
		else
		{
		
			$.ajax({
				url			: site_url+'admin/get_all_person',
				type		: 'POST',
				dataType	: 'json',
				async		: false,
				data		: 'type='+type,
				success		: function( response )
				{
					if(type==0)
					{
						for(i=0;i<response.length;i++)
						{
							$( '#sales_person_id' ).append(  '<option value="'+response[i]['sales_person_id']+'">'+response[i]['first_name']+' '+response[i]['last_name']+'</option>' );
						}
					}	
					else if(type==1)
					{
						for(i=0;i<response.length;i++)
						{
							$( '#sales_person_id' ).append(  '<option value="'+response[i]['user_id']+'">'+response[i]['first_name']+' '+response[i]['last_name']+' ('+response[i]['email']+')</option>' );
						}
					}			
				}
			});
		}
	},

	ResetCombo : function( combo )
	{
		var label = combo+'_combo';
		$( '#'+combo ).empty().append( '<option value="">'+newpromoobj[label]+'</option>' ).trigger( 'change' );
	},
	ComboFill : function( obj_id , item )
	{
		newpromoobj.ResetCombo( obj_id );
		$.each( item , function( key , value ) {
			$( '#'+obj_id ).append( '<option value="'+key+'">'+value+'</option>' );
		});
	},


});

$( '.intigerOnly' ).keyup(function (e) { 
	// this.value = this.value.replace(/[^0-9\.]/g,'');
	var key = e.keyCode;
	var allowed_key = [ 37 , 38 , 39 , 40 ];
	if ( $.inArray ( key , allowed_key ) != -1 ) return;
	this.value = this.value.replace(/[^0-9]/g,'');
});

$( '.numbersOnly' ).keypress( function( event )
{
	if ( ( event.which != 46 || $( this ).val().indexOf( '.' ) != -1 ) && ( event.which < 48 || event.which > 57 ) && event.which != 8 && event.which != 0 )
	{
		event.preventDefault();
	}
});

$( '.alphanumeric' ).keyup(function (e) { 
	//this.value = this.value.replace([A-Za-z0-9])[A-Za-z0-9,.!@#$%^&*()_]{1,6};
	this.value = this.value.replace(/[^a-zA-Z 0-9\n\r]+/g, '');

});

	$( '#newpromo_submit' ).click( function(e){

		e.preventDefault();
		if( ! $("#valid").validationEngine( 'validate' ) )
		{
			return false;
		}
	
		var promo_code=$('#promo_code').val();

		$.ajax({
			url			: site_url+'admin/check_duplicate_promo_code',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: {'promo_code':promo_code},
			success		: function( response )
			{
				if(response.status==0)
				{
					jAlert('Promo code already exists','','');
				 	return false;
				}
				else if(response.status==1)
				{
					$('#valid').submit();
				}
			}
		});
	
	});
/*$( "#newpromo_submit" ).click(function(event){
	event.preventDefault();
	//alert("hii");
	var ret=true;
	//var league_duration_id=$('#league_duration_id').val();
	//var duration_id = $( '#duration_id' ).val();
	//var size_value=Number($('#size').val());
	//var entry_fee_value=Number($('#entry_fee').val());
	if($('input[name=type]:checked').length<=0)
	{
		//alert("get");
		//$('#red-error-league_id').show();
		//$('#red-error-league_id').html(league_error);
		ret=false;	
	}
	else
	{
		//$('#red-error-league_id').hide();
		ret=true;
	}
	
	console.log(ret);
	if(ret)
	{
		
		//new_game.GetPrizeDetails();
	}
return false;
}); 
*/