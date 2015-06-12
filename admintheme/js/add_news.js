
//$( "#valid" ).validationEngine();

$( "select, input:checkbox, input:radio, input:file" ).uniform();

$( document ).ready( function(){
	add_news = new Addnews();
});

var Addnews = function()
{
	Addnewsobj = this;
};

$.extend( Addnews.prototype , {
	Addnewsobj : {},
});

$( '#add_news' ).click( function(e){
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