//for widgets page
//dashboard accordian
function ExpandText(){
	$('.widgetone .rulesLable').click(function() {
		if(!$(this).closest('.top-widgetbar').next('.widget-expanded-field').is(':visible')){
			$(this).closest('.top-widgetbar').next('.widget-expanded-field').slideDown("slow");
			$(this).closest('.top-widgetbar').addClass('active');
		} else {
			$(this).closest('.top-widgetbar').next('.widget-expanded-field').slideUp("slow");
			$(this).closest('.top-widgetbar').removeClass('active');
		}
	});
	
$('.expand-all').click(function() {
		if(!$('.widget-expanded-field').is(':visible')){
			$('.widget-expanded-field').slideDown();
			$('.top-widgetbar').addClass('active');
			$('.expand-all').text('Collapse All');
		} else {
			$('.widget-expanded-field').slideUp();
			$('.top-widgetbar').removeClass('active');
			$('.expand-all').text('Expand All');
		}
	});	
 };

//dashboard tabs
function MyStandingTabs() {
	$('.widget-tab-view > a').click(function () {
		var contentRel = $(this).attr('data-rel');
		if(!$('#' + contentRel).is(':visible')){
			$('.tab-content').hide();
			$('.widget-tab-view > a').removeClass('active');
			$(this).addClass('active');
			$('#' + contentRel).fadeIn();
			$(this).parent().prev('.tab-text').text($(this).text());
		}
	});
	$('.widget-tab-view > a').each(function() {
        if($(this).hasClass('active')){
			$(this).parent().prev('.tab-text').text($(this).text());
		}
    });
}
//****** end widget page ******//
//****** DOCUMENT READY FUNCTION ******//
$(document).ready(function () {
	ExpandText();                    //widget page accordian
	MyStandingTabs();                //widget page tabs     
});