function MobileLoginFunc() {
	$( document ).on( "click" , ".login-drpdwn" , function (e) {

		if(!$('.balance').is(':visible')){
			$('.balance').slideDown();
			//$(this).addClass('active');
			
		} else {
			$('.balance').slideUp();	
			$(this).removeClass('active');	
		}
		e.stopPropagation();
		
	});
	
	$(".balance").on('touchstart',function(e){
		e.stopPropagation();
	});
	$( document ).on( "click" , ".login-drpdwn" , function (e) {
		e.stopPropagation();
	});
	$(document).on('click touchstart',function() {
		$('.balance').slideUp();
	});
}	
$(document).ready(function(){
	
	$('#da-slider').cslider();
	var carousel = $("#owl-demo");
	carousel.owlCarousel({
		navigation:false,
		itemsDesktop : [1024,3],
		items:3
	});
	
	$('.featurdslider').bxSlider({ 
		minSlides:1,
	    maxSlides:3,
	    slideWidth:494,
	    slideMargin:100,	
	    pager:true,
	    infiniteLoop: false
	});

	$('.userslider').bxSlider({
	    minSlides:1,
	    maxSlides:3,
	    slideWidth:313,
	    slideMargin:15,
	    pager:true,
		auto:true,
		controls:false,
	    infiniteLoop: true
	});

	$('#fullpage').fullpage({
        afterLoad: function(anchorLink, index){
			activeNavigation(index);
            var loadedSection = $(this);
            if(index == 2){
            	$('#Header-cube').addClass('cube-animate',animateDone);
				
				$('.head-2').addClass('fadeInRight');
				$('#abc , #abc1, #abc2').addClass('state3 content');
				$('#owl-demo').addClass('fadeInLeft');
            }else{
            	if(index==1){
					$('#alt-header').hide();
     setTimeout(function(){
      $('#alt-header').hide();
      $('#Header-cube').removeClass('cube-animate');
     },200);
					
					 $('#abc , #abc1, #abc2').removeClass('state3');
					
            	}
			/*	else if(index==3){ $('.heading').removeClass('fadeInRight');}*/
				  if(index == 3){
				$('.head-3').addClass('fadeInRight');
				$('.xl').addClass('fadeInLeft');
				$('.xr').addClass('fadeInRight');
				$('.head-3').css('display', 'block');
				
				$('.head-3').addClass('temp');
				
            }
			 if(index == 4){
				 $('.play-game-details').addClass('fadeInDown');
				$('.box-slider').addClass('fadeInLeft');
				$('.head-4').addClass('fadeInRight');
				$('.head-4').css('display', 'block');
				$('.head-4').addClass('temp');
				
            }
			 if(index == 5){
				$('.play-game-details').addClass('fadeInDown');
				$('.head-xl').addClass('fadeInLeft');
				$('.head-xr').addClass('fadeInRight');
            }
            }
			
            
        }
	});
});

function animateDone(){
 setTimeout(function(){
  $('#alt-header').show();
 },1000)
}
$('#nav li').on('click',function(){
 var dataSlide = $(this).attr('data-slide');
 $.fn.fullpage.moveTo(dataSlide);
 activeNavigation(dataSlide);
 
});

$('.scrollable-button').on('click',function(){
 $.fn.fullpage.moveTo(2);
 activeNavigation(2);
});

function activeNavigation(dataSlide){
 var len = $('#nav li').length;
 for(i=1;i<=len;i++){
  $('#nav li').removeClass('active');
  $('#nav li:nth-child('+i+')').attr('id','NavList'+i);
 }
 $('#NavList'+dataSlide).addClass('active');
 if(dataSlide == 1){
   $('#abc , #abc1').removeClass('state3 content');
   $('#abc , #abc1').addClass('content');
  }else{
   $('#abc , #abc1').addClass('state3 content');
    
  setTimeout( function(){
  $('#section'+dataSlide).find('.bg'+dataSlide).addClass('zoomEffect');
 },100);
  }

}

var $window = $(window);		//Window object
var scrollTime = 1.2;			//Scroll time
var scrollDistance = 170;		//Distance. Use smaller value for shorter scroll and greater value for longer scroll

$window.on("mousewheel DOMMouseScroll", function(event){
	event.preventDefault();	
	var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
	var scrollTop = $window.scrollTop();
	var finalScroll = scrollTop - parseInt(delta*scrollDistance);
});
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf("msie") != -1 || ua.indexOf("opera") != -1) {
	jQuery('body').css('overflow','hidden');
	jQuery('html').css('overflow','hidden');
}				
jQuery(function() {
	jQuery('#bannerscollection_zoominout_opportune').bannerscollection_zoominout({
		skin: 'opportune',
		responsive:true,
		width: 1920,
		height: 1200,
		width100Proc:true,
		height100Proc:true,
		fadeSlides:1,
		showNavArrows:false,
		showBottomNav:true,
		autoHideBottomNav:false,
		thumbsWrapperMarginTop: -55,
		pauseOnMouseOver:false
	});		
	
});

if ($(window).width() < 750) {
	MobileLoginFunc();
	$('.mobslider').bxSlider({
	    minSlides:1,
	    maxSlides:3,
	    slideWidth:315,
	    slideMargin:5,
	    pager:true,
	    infiniteLoop: false
	});
}
// JavaScript Document