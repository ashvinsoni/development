
$( '.autoF' ).focus();

//===== Information boxes =====//
	
$(".hideit").click(function() {
	$(this).fadeTo(200, 0.00, function(){ //fade
		$(this).slideUp(300, function() { //slide up
			$(this).remove(); //then remove from the DOM
		});
	});
});

//===== Side Menu Collapsible elements management =====//
if ( $( '.exp' ) != null && $( '.exp' ).length > 0 )

$( '.exp' ).collapsible({
	defaultOpen: 'current',
	cookieName: 'navAct',
	cssOpen: 'active corner',
	cssClose: 'inactive',
	speed: 300
});
$( "#valid" ).validationEngine();
/*$(".exp").click(function(){
	alert('haha');
});
*/
//===== Multiple select with dropdown =====//
function showloading()
{
	$( "body" ).addClass( "loading" );
	$( ".modal" ).fadeIn( "slow" );
}

function hideloading()
{
	$( ".modal" ).fadeOut( "slow" );
	$( "body" ).removeClass( "loading" );
}
window.setTimeout( function(){ $( '.nNote' ).fadeOut(); } , 5000 );