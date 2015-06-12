$(document).ready(function(){
	funObj = new gameDetailFun();	
});

var gameDetailFun = function() {
	gameDetailObj = this;
};
$.extend( gameDetailFun.prototype, {
	gameDetailObj : {},
	viewUserDetail : function(userId, game_unique_id){
		var post_data = 'clickedUserId='+userId+'&game_unique_id='+game_unique_id;;
		$.ajax({
			url			: site_url+'admin/get_selected_user_lineup',
			type		: 'POST',
			async		: false,
			data		: post_data,
			dataType : 'json',
			success		: function( response )
			{
				gameDetailObj.lineup = response.user_detail;
				var lineupTemplate = $("#userLineTemplate").html();
				var compiledTemplate = Handlebars.compile(lineupTemplate);
				var bindingDone =  compiledTemplate(gameDetailObj.lineup);
				$("#lineupDataHTML").html(bindingDone);
			}
		});
		// gameDetailObj.lineup
		
		// console.log('hello i am running');
	}
});