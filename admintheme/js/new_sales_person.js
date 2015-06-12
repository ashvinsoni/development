
//$( "#valid" ).validationEngine();

$( "select, input:checkbox, input:radio, input:file" ).uniform();

$( document ).ready( function(){
	new_sales_person = new Newperson();
	new_sales_person.InitializeSport();
	new_sales_person.InitializeDates();
});

var Newperson = function()
{
	newpersonobj = this;
};

$.extend( Newperson.prototype , {

	newpersonobj						: {},
	state_id_combo					: 'Select state',


	
	InitializeSport : function()
	{
		newpersonobj.ComboFill( 'state_id' , state );
		$( '#state_id' ).val( person_record.state_id ).trigger( 'change' );
	},

	InitializeDates : function ()
	{
		$( "#dob" ).datepicker({
			maxDate: '-18Y',
			yearRange: '1920:-18Y',
			changeMonth: true,
			changeYear: true,
			dateFormat:"yy-mm-dd",
			//minDate:mindate,
			onSelect:function( selectedDate )
			{
				$( '.dateformError' ).hide().remove();		
			}
		})
	},
	ResetCombo : function( combo )
	{
		var label = combo+'_combo';
		$( '#'+combo ).empty().append( '<option value="">'+newpersonobj[label]+'</option>' ).trigger( 'change' );
	},
	ComboFill : function( obj_id , item )
	{
		newpersonobj.ResetCombo( obj_id );
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

$( '#new_salesperson' ).click( function(e){
		e.preventDefault();
		if( ! $("#valid").validationEngine( 'validate' ) )
		{
			return false;
		}
		var email=$('#email').val();
		var action=$('#action').val();
		var sales_person_unique_id=$('#sales_person_unique_id').val();

		$.ajax({
			url			: site_url+'admin/check_duplicate_sales_person_email',
			type		: 'POST',
			dataType	: 'json',
			async		: true,
			data		: {'email':email,'action':action,'sales_person_unique_id':sales_person_unique_id},
			success		: function( response )
			{
				if(response.status==0)
				{
					jAlert('Email already exists','','');
				 	return false;
				}
				else if(response.status==1)
				{
					$('#valid').submit();
				}
			}
		});
	});