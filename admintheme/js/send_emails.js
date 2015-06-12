
//$( "#valid" ).validationEngine();

$( "select, input:checkbox, input:radio, input:file" ).uniform();

$( document ).ready( function(){
	send_emails = new SendEmails();
});

var SendEmails = function()
{
	SendEmailsobj = this;
};

$.extend( SendEmails.prototype , {
	SendEmailsobj : {},
});

$( '#send_emails' ).click( function(e){
	showloading();
	//return false;
	e.preventDefault();
	if( ! $("#emailvalid").validationEngine( 'validate' ) )
	{
		hideloading();
		$('.formError').show();
		return false;
	}
	else
	{
		$('.formError').hide();
		$('#emailvalid').submit();
	}
});