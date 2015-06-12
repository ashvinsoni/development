// Header User Drop Down Start
function UserDropdown(){
	$('.profile-dropdown > a').on('click',function(e){
		if(!$(this).next('.user-dropdown').is(':visible')){
			$(this).next('.user-dropdown').slideDown();
			$(this).addClass('active');
		} else {
			$(this).next('.user-dropdown').slideUp();
			$(this).removeClass('active');
		}
		e.stopPropagation();
	});
	$(".profile-dropdown").on('touchstart',function(e){
		e.stopPropagation();
	});
	$(document).on('click touchstart',function(){
		$(".profile-dropdown > a").removeClass("active");
		$(".user-dropdown").slideUp();
	});
			
};
// End

// Header Menu Drop Down Start
function MenuDropdown(){
	$('.menu-drop > a').on('click',function(e){
		if(!$(this).next('.menu-dropdown').is(':visible')){
			$(this).next('.menu-dropdown').slideDown();
			$(this).addClass('active');
		} else {
			$(this).next('.menu-dropdown').slideUp();
			$(this).removeClass('active');
		}
		e.stopPropagation();
	});
	$(".menu-drop").on('touchstart',function(e){
		e.stopPropagation();
	});
	$(document).on('click touchstart',function(){
		$(".menu-drop > a").removeClass("active");
		$(".menu-dropdown").slideUp();
	});
			
};
// End
// Own Team Drop Down Start
function OwnTeamDropdown(){
	$(document).on('click', '.team-name-drop > a', function(e){
		if(!$(this).next('.team-dropdown').is(':visible')){
			$(this).next('.team-dropdown').slideDown();
			$(this).addClass('active');
		} else {
			$(this).next('.team-dropdown').slideUp();
			$(this).removeClass('active');
		}
		e.stopPropagation();
	});
	$(".team-name-drop").on('touchstart',function(e){
		e.stopPropagation();
	});
	$(document).on('click touchstart',function(){
		$(".team-name-drop > a").removeClass("active");
		$(".team-dropdown").slideUp();
	});
			
};

function OwnPrizeDropdown(){
	$(document).on('click', '.prize-details > a', function(e){
		if(!$(this).next('.prize-details-dropdown').is(':visible')){
			$(this).next('.prize-details-dropdown').slideDown();
			$(this).addClass('active');
		} else {
			$(this).next('.prize-details-dropdown').slideUp();
			$(this).removeClass('active');
		}
		e.stopPropagation();
	});
	$(".prize-details").on('touchstart',function(e){
		e.stopPropagation();
	});
	$(document).on('click touchstart',function(){
		$(".prize-details > a").removeClass("active");
		$(".prize-details-dropdown").slideUp();
	});
			
};
// End
// Opponent Team Drop Down Start
function OpponentTeamDropdown(){
	$(document).on('click', '.oppeonent-name-drop > a', function(e){
		if(!$(this).next('.oppeonent-dropdown').is(':visible')){
			$(this).next('.oppeonent-dropdown').slideDown();
			$(this).addClass('active');
		} else {
			$(this).next('.oppeonent-dropdown').slideUp();
			$(this).removeClass('active');
		}
		e.stopPropagation();
	});
	$(".team-name-drop").on('touchstart',function(e){
		e.stopPropagation();
	});
	$(document).on('click touchstart',function(){
		$(".oppeonent-name-drop > a").removeClass("active");
		$(".oppeonent-dropdown").slideUp();
	});
			
};
// End
// Left Wedget icon Start



function WidgetFn(){
	
$.fn.singleAndDouble = function(singleClickFunc, doubleClickFunc) {

  var timeOut = 200;
  var timeoutID = 0;
  var ignoreSingleClicks = false;
  
  this.on('click', function(event) {
  	var obj  = this;
    if (!ignoreSingleClicks) {
      clearTimeout(timeoutID);
      
      timeoutID = setTimeout(function() {
        singleClickFunc(event,obj);
      }, timeOut);
    }
  });
  
  this.on('dblclick', function(event) {
  	var obj  = this;
    clearTimeout(timeoutID);
    ignoreSingleClicks = true;
    
    setTimeout(function() {
      ignoreSingleClicks = false;
    }, timeOut);
    
    doubleClickFunc(event,obj);
  });
  
};

var singleClickCalled = false;

$('.widgets-verticle-bar > ul > li').singleAndDouble(
  function(event,obj) {
    singleClickCalled = true;
		var This = $('.widgets-verticle-bar > ul > li');
		var contentRel = $(obj).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){			
			$('.widget-cover').show();
			$('.temp-wedgets').hide();
			$('.widgets-verticle-bar > ul > li').removeClass('active');
			$(obj).addClass('active');
			$('#' + contentRel).fadeIn();
			$('[rel=tipsys]').tipsy({fade: true,html:true, gravity: 'w'});
		}

    setTimeout(function() {
      singleClickCalled = false;
    }, 300);
  },

  function(event,obj) {
    if (singleClickCalled) {
      
    }
    else {

    	/*if( $( '.widgets-container:visible' ).length >= 2 )
    	{	
			openPopDiv('Wedgetspopup', 'bounceInDown');    		
    		return false;
    	}*/

	  var This = $('.widgets-verticle-bar > ul > li');
      var contentRole = $(obj).attr('data-role');
	  if(!$('#' + contentRole).is(':visible')){	
	  	$('.widgets-rightbar').show();
		$('#' + contentRole).fadeIn();
		$('.widget-cover').fadeOut();
		$('.widgets-verticle-bar > ul > li').removeClass('active');
		 
	  }
	 
	  //TopBottomClass();
    }
    singleClickCalled = false;
  });
	

	$('.close-div').click(function(){
		if($(this).closest('.temp-wedgets').is(':visible')){
			$(this).closest('.temp-wedgets').fadeOut();
			$('.widget-cover').hide();
			$('.widgets-verticle-bar > ul > li').removeClass('active');
		}
	});
	
	$('.close-widget').click(function(){
		alert('test');
		if($(this).closest('.widgets-container').is(':visible')){
			// $('.widgets-container').hide();
			$(this).closest('.widgets-container').fadeOut();
			/*$(this).closest('.widgets-container').removeClass('top');
			$(this).closest('.widgets-container').removeClass('bottom');*/
		}
		setTimeout(function(){
			//TopBottomClass();
		}, 500);
	});
	
	$('.full-widget').click(function(){
		
    	/*if( $( '.widgets-container:visible' ).length >= 2 ){
    		
    		openPopDiv('Wedgetspopup', 'bounceInDown');
    		return false;
    	}*/
		var contentFull = $(this).attr('data-full');
		if(!$('#' + contentFull).is(':visible')){
		  $('.widgets-rightbar').show();		
		  $('#' + contentFull).fadeIn();
		  $('.widgets-verticle-bar > ul > li').removeClass('active');
		  $(this).closest('.widget-cover').hide();
		}
		TopBottomClass();
	});

};
function TopBottomClass() {
	if( $( '.widgets-container:visible' ).length == 1 ){
		$($('.widgets-container:visible')[0]).addClass('top').removeClass('bottom');
	} else if( $( '.widgets-container:visible' ).length > 1 ) {
		$($('.widgets-container:visible')[1]).addClass('bottom').removeClass('top');
	}
}
// Left Wedget icon End
function GridListView() {
	$('.gridlistview-tab > a').click(function () {
		var contentRel = $(this).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){			
			$('.gridlistview-content').hide();
			$('.gridlistview-tab > a').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
		}
	});
}

// Mobile List View Tab
function MobileListviewTab() {
	if($(window).width() <= 767){

	$('.team-block').click(function () {
		var contentRel = $(this).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){			
			$('.mobilelistviewtab-content').hide();
			$('.team-block').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
		}
	});
	}
}
// For All Popup's
function MobpopupNoScroll(){
$(window).scroll(function(){$("#"+compDiv).stop()})
};
// End

//New Lobby Page Team selected

function SportsSelected(){
	$(document).on('click', '#SportsBlock > li .game-thumb', function(){
		$('#SportsBlock > li .game-thumb').removeClass('active');	
		$(this).addClass('active');	
		});	
	}

function LobbyFeesSelected(){
	$(document).on('click', '#FeesBlock > li', function(){
		$('#FeesBlock > li').removeClass('active');	
		$(this).addClass('active');	
		});	
	}
	
function LobbyEntrantSelected(){
	$(document).on('click', '#EntrantsBlock > li', function(){
		$('#EntrantsBlock > li').removeClass('active');	
		$(this).addClass('active');	
		});	
	}
	
function LobbyLeagueTypeSelected(){
	$(document).on('click', '#LeagueBlock > li', function(){
		$('#LeagueBlock > li').removeClass('active');	
		$(this).addClass('active');	
		});	
	}
function LobbyGameTypeSelected(){
	$(document).on('click', '#GameTypeBlock > li', function(){
		$('#GameTypeBlock > li').removeClass('active');	
		$(this).addClass('active');	
		});	
	}
function LobbyPrizeSelected(){
	$(document).on('click', '#PrizeSBlock > li', function(){
		$('#PrizeSBlock > li').removeClass('active');	
		$(this).addClass('active');	
		});	
	}
	
// Line Up Tab Content
function LineUpTab() {	
	$(document).on('click', '.line-up-tab > .tab-nav > a', function(){
		var contentRel = $(this).attr('data-rel');
		//if(!$('#' + contentRel).is(':visible')){			
			$('.tabs-content').hide();
			$('.tab-nav > a').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
		//}
	});	
}
// Focus Input Area
function inputAreaFocus() {
    $('.field input').on('blur', function () {
        $(this).closest('.field').removeClass('focus');
    }).on('focus', function () {
        $(this).closest('.field').addClass('focus');
    });
}
// Lineup Mobile Tab
function LineupMobileTab() {
	$(document).on('click', '.lineup-mobile-tab > a', function(){
		var contentRel = $(this).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){			
			$('.lineupmobiletab-content').hide();
			$('.lineup-mobile-tab > a').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
		}
	});
}
//Odd Man Out Lineup Category Tab Selected
function LineOMOCategorySelected(){
	$(document).on('click', '.category-block > span > a', function(){
		$('.category-block > span > a').removeClass('active');	
		$(this).addClass('active');	
		});	
	}
//Odd Man Out Lineup Teams Tab Selected
function LineOMOTeamsSelected(){
	 $(document).on('click', '.teams-block > span > a', function(){
		$('.teams-block > span > a').removeClass('active');	
		$(this).addClass('active');	
		});	
	}
//Odd Man Out Lineup Player Tab Selected
function LineOMOPlayerSelected(){
	$(document).on('click', '.player-list > li', function(){
		$('.player-list > li').removeClass('active');	
		$(this).addClass('active');	
		});	
	}
// Mobile Lineup OMO Filter View Tab
function MobileLineupOMOFilterTab() {
	if($(window).width() <= 767){
		$(document).on('click', '.lineup-omo-filter-tab > a', function(){
		var contentRel = $(this).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){			
			$('.lineup-omo-filter-tab-container').hide();
			$('.lineup-omo-filter-tab > a').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
		}
	});
	}
}
// Mobile Lineup OMO Category and Team View Tab
function MobileLineupOMOCatTeamTab() {
	if($(window).width() <= 767){
		$(document).on('click', '.lineup-omo-cateteam-tab > a', function(){
		var contentRel = $(this).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){			
			$('.lineup-omo-cateteam-tab-container').hide();
			$('.lineup-omo-cateteam-tab > a').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
		}
	});
	}
}
// Mobile Lineup OMO Players and Your Lineup View Tab
function MobileLineupOMOPlaLineTab() {
	if($(window).width() <= 767){
		$(document).on('click', '.lineup-omo-plaline-tab > a', function(){
		var contentRel = $(this).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){			
			$('.lineup-omo-plaline-tab-container').hide();
			$('.lineup-omo-plaline-tab > a').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
		}
	});
	}
}
function ContestFilterSlider() {
	var a=0;
	var BoxSliderWidth=0;
	$( '.contest-content' ).each(function(k,v){		
		var TotalBlock = $(this).find( '.block' ).length;
		var TotalContestContentWidth = (TotalBlock*480)+40;
		$(this).css({'width':TotalContestContentWidth+'px'});
		if(a!==0)$(this).css({'margin-left':'15px'});
		BoxSliderWidth = TotalContestContentWidth+BoxSliderWidth;
		if(a!==0)BoxSliderWidth =BoxSliderWidth+15;

		a++;
		if($(window).width() <= 767){
			$(this).css({'width':290+'px'});
			$('.choose-contest > .contest-block > .box-slider > .contest-content').css({'margin-left':0+'px'});
		}
	});
	$( '.choose-contest > .contest-block > .box-slider' ).css({'width':BoxSliderWidth+'px'});
	if($(window).width() <= 767){
			$('.choose-contest > .contest-block > .box-slider').css({'width':290+'px'});
		}
}

function ContestCreateGameFilterSlider() {
	var a=0;
	var BoxSliderWidth=0;
	$( '.contest-content' ).each(function(k,v){		
		var TotalBlock = $(this).find( '.block' ).length;
		
		

		var TotalContestContentWidth = (TotalBlock*480);
		if(TotalBlock < 3)
		{
			TotalContestContentWidth = (TotalBlock*850);
		}
		$(this).css({'width':TotalContestContentWidth+'px'});
		if(a!==0)$(this).css({'margin-left':'15px'});
		BoxSliderWidth = TotalContestContentWidth+BoxSliderWidth;
		if(a!==0)BoxSliderWidth =BoxSliderWidth+150;

		a++;
		if($(window).width() <= 767){
			$(this).css({'width':320+'px'});
			$('.choose-contest > .contest-block > .box-slider > .contest-content').css({'margin-left':0+'px'});
		}
	});
	$( '.choose-contest > .contest-block > .box-slider' ).css({'width':BoxSliderWidth+'px'});
	if($(window).width() <= 767){
			$('.choose-contest > .contest-block > .box-slider').css({'width':320+'px'});
		}
	
}

// My Games Created By Me and Entered By Me Tab
function MyGamesTab() {
$(document).on( "click" , ".mygames-tab > a" , function ( e )
	{
		var contentRel = $(this).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){			
			$('.mygames-tab-content').hide();
			$('.mygames-tab > a').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
		}
	});
}


// Alert Messages
function ShowMessage(e, t) {
	if (t == undefined) {
		t = "bounceInDown"
	}
	LoadMessage(e, t)
}
function LoadMessage(e, t) {
	$("#" + e).addClass(t).fadeIn(200);
	$("#" + e).css({marginLeft: - $("#" + e).innerWidth()/2});
	setTimeout(function () {
		$("#" + e).removeClass(t)
	}, 1100)
}
function CloseMessage(e, t) {
	if (t == undefined) {
		t = "bounceOutUp"
	}
	DisableMessage(e, t)
}
function DisableMessage(e, t) {
	$("#" + e).addClass(t);
	setTimeout(function () {
		$("#" + e).fadeOut("fast", function () {
			$("#" + e).removeClass(t)
		})
	}, 200)
}

function WidgetBoxScore() {
	var a=0;
	var BoxSliderWidth=0;
	$( '.widget-team-container' ).each(function(k,v){
		var TotalBlock = $(this).find( '.widget-indv-team' ).length;
		var TotalContestContentWidth = (TotalBlock*122)+( $('.widget-indv-team:not(:first-child)').length*10 );
		$(this).css({'width':TotalContestContentWidth+'px'});
		$('.widget-indv-team:not(:first-child)').css({'margin-left':'10px'});
		BoxSliderWidth = TotalContestContentWidth+BoxSliderWidth;
		if(a!==0)BoxSliderWidth =BoxSliderWidth+15;

		a++;		
	});	
}

//Right Widget BoxScore Selected
function BoxScoreSelected(){
	$('.widget-indv-team').on('click',function(e){
		$('.widget-indv-team').removeClass('active');	
		$(this).addClass('active');	
		});	
	}
// Box Score Right Tab Content

function BoxScoreRight() {	
	$('.box-score-tab > a').on('click',function(e){
		var contentRel = $(this).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){			
			$('.box-score-tab-content').hide();
			$('.box-score-tab > a').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
		}
	});	
}

// For Date Picker
function DatePickerFn(){
	$(".date").datepicker({
		changeMonth: true,
		changeYear: true,
		 maxDate: '-18Y',
    	yearRange: '1920:-18Y',
		dateFormat: 'd M yy'
	});	
	$(document).on("click", function(e) {
    var elem = $(e.target);
    if(!elem.hasClass("hasDatepicker") && 
        !elem.hasClass("ui-datepicker") && 
        !elem.hasClass("ui-icon") && 
        !elem.hasClass("ui-datepicker-next") && 
        !elem.hasClass("ui-datepicker-prev") && 
        !$(elem).parents(".ui-datepicker").length){
            $('.hasDatepicker').datepicker('hide');
    }
});
};
/*Tab Carsual*/
function TabCarsual(){
	
var owl = $("#owl-demo");

      owl.owlCarousel({

      items :4, //10 items above 1000px browser width
      itemsDesktop : [1000,4], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,3], // 3 items betweem 900px and 601px
      itemsTablet: [600,2], //2 items between 600 and 0;
      itemsMobile :[480,1], // itemsMobile disabled - inherit from itemsTablet option
	  pagination : false,
	  rewindNav : false
      
      });

};
//End
//****** Draft Gaming ******//
/*Tab Function*/

function SubMenuTabIndexFunc() {
	$(document).on( "click" , ".game-nav a" , function ( e ) {
		var contentRel = $(this).attr('data-rel');
		$('.game-nav > a').removeClass('active');
		$(this).addClass('active');
	});
}

	
function gamenavnewFunc(){
	$(document).on( "click",'.game-nav-new > .owl-wrapper-outer > .owl-wrapper >  .owl-item > a, .game-nav-new >  a',function(e){
		$('.game-nav-new > .owl-wrapper-outer > .owl-wrapper >  .owl-item > a, .game-nav-new >  a').removeClass('active');	
		$(this).addClass('active');	
	});	
}

// Language Drop Down Start
function LanguageDropdown(){
	$( document ).on( "click" , ".drpdwn-filters-nav > a" , function ( e ) {
		if(!$(this).next('.language-dropdown').is(':visible')){
			$(this).next('.language-dropdown').slideDown();
			$(this).addClass('active');
		} else {
			$(this).next('.language-dropdown').slideUp();
			$(this).removeClass('active');
		}
		e.stopPropagation();
	});
	$(".drpdwn-filters-nav").on('touchstart',function(e){
		e.stopPropagation();
	});
	$(document).on('click touchstart',function(){
		$(".drpdwn-filters-nav > a").removeClass("active");
		$(".language-dropdown").slideUp();
	});
			
};
// End
/*Tab Carsual*/
function TabInsideCarsual(){
var owltab = $(".owl-demo");

      owltab.owlCarousel({

      items :8, //10 items above 1000px browser width
      itemsDesktop : [1000,8], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,4], // 3 items betweem 900px and 601px
      itemsTablet: [600,2], //2 items between 600 and 0;
      itemsMobile : [400,2], // itemsMobile disabled - inherit from itemsTablet option
	  pagination : false,
	  rewindNav : false
      });
};
/*Tab Carsual*/
function MainTabCarsual(){
	var owlThumb = $("#owl-tab-demo");
    owlThumb.owlCarousel({
		items :4, //10 items above 1000px browser width
		itemsDesktop : [1000,4], //5 items between 1000px and 901px
		itemsDesktopSmall : [900,3], // 3 items betweem 900px and 601px
		itemsTablet: [600,2], //2 items between 600 and 0;
		itemsMobile : [400,2], // itemsMobile disabled - inherit from itemsTablet option
		pagination : false,
		rewindNav : false
    });
};	
/*Hide-filters*/
function HideMobTabFunc(){
	$( document ).on( "click" , "#HideMob-menu" , function () {
	
		$('#swap-nav').slideToggle();
		
		});}
		/*Mob Menu*/
function MobileTabFunc() {
	$( document ).on( "click" , "#tabMob-menu" , function () {
	
		if(!$('.tabs-index').is(':visible')){
			$('.tabs-index').slideDown();
			
			$(this).addClass('active');
		} else {
			$('.tabs-index').slideUp();
			$(this).removeClass('active');
		}
	});
}

/*Slider*/
function ContestFilterSlider() {
	var a=0;
	var BoxSliderWidth=0;
	$( '.contest-content' ).each(function(k,v){		
		var TotalBlock = $(this).find( '.block' ).length;
		var TotalContestContentWidth = (TotalBlock*350);
		$(this).css({'width':TotalContestContentWidth+'px'});
		if(a!==0)$(this).css({'margin-left':'15px'});
		BoxSliderWidth = TotalContestContentWidth+BoxSliderWidth;
		if(a!==0)BoxSliderWidth =BoxSliderWidth+15;

		a++;
		if($(window).width() >= 767){
			//$(this).css({'width':300+'px'});
			$('.contest-block > .box-slider > .contest-content').css({'margin-left':0+'px'});
		}
	});
	$( '.contest-block > .box-slider' ).css({'width':BoxSliderWidth+'px'});
	if($(window).width() <= 767){
			//$('.choose-contest > .contest-block > .box-slider').css({'width':290+'px'});
		}
}
function HomeMobileLoginFunc() {
	$( document ).on( "click" , "#home-login-drpdwn" , function (e) {
	
		if(!$(this).next('.balance').is(':visible')){
			
			$(this).next('.balance').slideDown();
			
		} else {
		
			$(this).next('.balance').slideUp();
		
		}
		e.stopPropagation();
	});
	$(document).on('click touchstart',function() {
		$(this).next('.balance').slideUp();
	});
}				
//****** DOCUMENT READY FUNCTION ******//
$(document).ready(function () {
    UserDropdown(); // Header User Dropdown
    MenuDropdown(); // Main Menu Dropdown
	WidgetFn(); // Left Wedget icon
	OwnTeamDropdown(); // Own Team Details Dropdown
	OwnPrizeDropdown(); // Own Prize Details Dropdown
	OpponentTeamDropdown(); // Opponent Team Details Dropdown
	GridListView();  // Grid and List View Tab
	MobileListviewTab(); // Mobile List View Tab
	MobpopupNoScroll(); // Popup
	SportsSelected();
	LobbyFeesSelected();
	LobbyEntrantSelected();
	LobbyLeagueTypeSelected();
	LobbyGameTypeSelected();
	LobbyPrizeSelected();
	LineUpTab();
	
	inputAreaFocus();
	LineupMobileTab();
	LineOMOCategorySelected();
	LineOMOTeamsSelected();
	LineOMOPlayerSelected();
	MobileLineupOMOFilterTab();
	MobileLineupOMOCatTeamTab();
	MobileLineupOMOPlaLineTab();
	//MyGamesTab();
	WidgetBoxScore();
	BoxScoreSelected();
	BoxScoreRight();
	/*new added*/
	if ($(window).width() <= 767) {

		setTimeout(function(){ 
		// MainTabCarsual();
		//TabInsideCarsual();
		 }, 100);
		 
		 gamenavnewFunc()

		 HideMobTabFunc();
		 MobileTabFunc();
		// MobileLoginFunc();
		 HomeMobileLoginFunc();
	}
	SubMenuTabIndexFunc();
	//gamenavnewFunc();
	LanguageDropdown();
	$('.marquee-with-options').marquee({
		speed:12000,
		gap:0,
		delayBeforeStart: 0,
		direction: 'left',
		duplicated: true,
		pauseOnHover: true
	}); // News Ticker
});
