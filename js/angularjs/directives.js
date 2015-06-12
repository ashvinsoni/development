// directive to show data season secduel date in format
app.directive('seasonDateformat', function ($timeout) { 
		return{
				restrict: 'EA',        
				replace: true,
				template:'<span></span>',
				link: function (scope, element, attrs) {     
						$timeout(function(){
							var t = attrs.sechDate.split(/[- :]/);
							// Apply each element to the Date function
							var d   = new Date( t[0] , t[1]-1 , t[2] , t[3] , t[4] , t[5] );
							var m   = [ 'Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec' ];
							var day = [ 'Sun' ,'Mon' ,'Tue' ,'Wed' , 'Thu' , 'Fri' , 'Sat' ];

							var hours   = d.getHours();
							var minutes = d.getMinutes();
							var ampm    = hours >= 12 ? 'PM' : 'AM';
							hours       = hours % 12;
							hours       = hours ? hours : 12; // the hour '0' should be '12'
							hours       = hours < 10 ? '0'+hours : hours;
							minutes     = minutes < 10 ? '0'+minutes : minutes;
							var strTime = hours + ':' + minutes + ' ' + ampm;
							if (attrs.team_slider == 1) {
								var format = '<label>' +m[d.getMonth()]+' '+d.getDate()+ ' ' +d.getFullYear()+ ' '+strTime+' EST'+'<label>';                
							} else {                
								var format = m[d.getMonth()]+' '+d.getDate()+ ', ' +d.getFullYear()+ ' '+strTime+' EST';
							}            
							element.append(format);
						},1000);     
												
				}
		}
});

// directive to create salary format
app.filter('salaryFormat', function ($sce) {
	return function (item) {   
			if(item || item == 0)
			{
				formattedsalary = item.toString().replace( /(^\d{1,3}|\d{3})(?=(?:\d{3})+(?:$|\.))/g , '$1,' );
				// Universal Currency code
				return $sce.trustAsHtml( currency_code +formattedsalary );
			}
	};
});


// directive to show 0 value for null value case in player card
app.filter('placeholdEmpty', function(){
	return function(input){
		if(!(input == undefined || input == null)){
			return input;
		} else {
			return "0.00";
		}
	}
});

app.directive('uixInput',function(){
	return {
		restrict: 'E',
		replace: true,
		template: '<input>',
		link: function($scope, iElm, iAttrs) {
							iElm.loadControl();
			}
	}
}).directive('uixTextarea',function(){
	return {
		restrict: 'E',
		replace: true,
		template: '<textarea />',
		link: function($scope, iElm, iAttrs) {
			iElm.loadControl();
			}
	}
})
// uixConfirmPassword Common Control (Password confirmation Field)
.directive('match', function () {
		return {
				require: 'ngModel',
				restrict: 'A',
				scope: {
						match: '='
				},
				link: function(scope, elem, attrs, ctrl) {
						scope.$watch(function() {
								return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
						}, function(currentValue) {
								ctrl.$setValidity('match', currentValue);
						});
				}
		};
})

//filter added to format date
app.filter('toSec', function($filter) {
	return function(input) {
			var result = new Date(input).getTime();
			return result || '';
	};
});


// check if ng-repeat is done 
app.directive('myPostRepeatDirective', function() {
	return function(scope, element, attrs) {
		 if (scope.$last === true) {      
								setTimeout(function () {
									//invoking your controller function
									scope.$emit('ngRepeatFinished');
								});
						}
	};
});

// tooltip directory to show multiple records on run time
app.directive('tooltipDir', ['$timeout',function (timer) { 
		return{
				restrict: 'A',       
				replace: false,
				link: function (scope, element, attrs) {
					var showTooltip = function(){
						if (attrs.titles) {
							var pars = JSON.parse(attrs.titles);          
							var pos = 1;
							var strVal = "";
							strVal += '<div style="height:150px;overflow:auto;width:150px;">';
							for (var i = 0; i < pars.length; i++) {
								strVal += '<label>'+pos+'-</label><label>$'+pars[i]+'</label><br/>'; 
								pos++;
							}
							strVal += '</div>';
							attrs.$set('title',strVal);
							$('[rel=tipsys]').tipsy({fade: true,html:true, gravity: 'w'});
						}            
					}
					timer(showTooltip, 0);
				}
		}
}]);

app.directive('repeatDone', function() {
				return function(scope, element, attrs) {
						if (scope.$last) { // all are rendered
								scope.$eval(attrs.repeatDone);
								 
						}
				}
});


app.filter('unsafe', function ($sce) {
		return function (val) {
				return $sce.trustAsHtml(val);
		};
});

// we create a simple directive to modify behavior of <ul>
app.directive("whenScrolled", function(){
	return{
		restrict: 'A',
		link: function(scope, elem, attrs){
			// we get a list of elements of size 1 and need the first element
			raw = elem[0];
			if(raw.nodeName.toLowerCase() === 'input')
			{
				elem.bind("keyup", function(){
					if( scope.req.searchSendText.length >= 3 )
					{
						scope.loading = true;
						scope.req.sendrequest = [];
						scope.$apply(attrs.whenScrolled);
					}
					else if( !scope.req.searchSendText )
					{
						scope.$apply(attrs.whenScrolled);
					}
				});
			}
			else
			{
				// we load more elements when scrolled past a limit
				elem.bind("scroll", function(){
					if(raw.scrollTop+raw.offsetHeight+5 >= raw.scrollHeight){
						scope.loading = true;
						// we can give any function which loads more elements into the list
						scope.$apply(attrs.whenScrolled);
					}
				});
			}
		}
	}
});


// directive to allow numbers only in text box
app.directive("numbersOnly", function(){
	return{    
		restrict: 'A',
		link: function(scope, elem, attrs){     
			// we load more elements when scrolled past a limit
			elem.bind("keypress", function(event){        
				if ( ( event.which != 46 || $( this ).val().indexOf( '.' ) != -1 ) && ( event.which < 48 || event.which > 57 ) && event.which != 8 && event.which != 0 )
					{
						event.preventDefault();
					} 
			});
		}
	}
});
app.directive("ngFormCommit", [function(){
		return {
				require:"form",
				link: function($scope, $el, $attr, $form) {
						$form.commit = function() {           
								$el[0].submit();
						};
				}
		};
}]);


// directive to show data season secduel date in format
app.directive('linupPlayer', function ( $compile ) { 
		function createTpl(scope, element, attrs) 
				{
					
					var str = '';          
					if( scope.ismobile == '1' && $(window).width() > 768 )
					{
						return true;
					}
					
					if( scope.ismobile == '0' && $(window).width() < 768 )
					{
						// return true;
					}          
					// console.log("Directive ", scope.linupplayerdata);
					// console.log("Is movile value", scope.ismobile);  
					if(scope.linupplayerdata != undefined) 
					{   
						angular.element("#linupPlayerLoader").show();
						setTimeout(function()
							{        
								
								if( scope.ismobile == '0' )
								{                 
									
									str += '<tr ng:repeat="players in linupplayerdata | orderBy:sortingObj:filterBy | PlayerRosterSearchFilter:searchedPlayerName:tabPosition:remainingSalary" class="{{players.position}}_pos all_pos" data-player-container="{{players.player_unique_id}}">\
											 <td class="pos-name"><label>{{players.position}}</label></td>\
											 <td class="player-name player_name" ><label><a href="" ng:click="showplayercard({players:players})">{{players.full_name}}</a></label></td>\
											 <td class="team-name"><label>{{players.team_abbreviation}}</label></td>\
											 <td class="game-name"><label>{{players.match_name}}</label></td>\
											 <td class="salary">\
												 <label   ng-bind-html="players.salary | salaryFormat"></label>\
											 </td>\
											<td class="action" >\
												<a href="javascript:void(0);" ng-show="!selectedPlayers.hasOwnProperty(players.player_unique_id)" ng-class="{disable:completedPosition.hasOwnProperty(players.position) }"  class=" button-yellow {{players.player_unique_id}}_add {{players.position}}_pos_add "  ng:click="addlineupplayer({obj:players});" ">Add</a>\
												<a href="javascript:void(0);" ng-show="selectedPlayers.hasOwnProperty(players.player_unique_id)"  class="  button-yellow {{players.player_unique_id}}_drop" ng-click="removePlayerLineup({obj:players})" >Drop</a>\
											</td>\
										 </tr>';   
										 
								}
								
								element.append($compile(angular.element(str))(scope));
								angular.element("#linupPlayerLoader").hide();
							},800);

					}
					
					if (lazyLoadOnLineUpPlayerList === true)
					{
						// show player image from lazy load
						setTimeout(function()
						{           
							jQuery("img.lazy").lazy({
									beforeLoad: function(element) {
											element.removeClass("lazy"); 
									},
									onLoad: function(element) {
											element.addClass("loading"); 
									},
									afterLoad: function(element) { 
											element.removeClass("loading").addClass("loaded"); 
									},
									onError: function(element) {
										element.attr("src",siteUrl+"img/default_small.png");
											// console.log("image loading error: " + element.attr("src"));
									},
									onFinishedAll: function() {
											// console.log("finished loading all images");
									},
							});
						},1000);
					} 
					// });
					
				}
		return{
				restrict: 'E', 
				replace: true,         
				scope:{
						linupplayerdata:'=',           
						ismobile: '=',
						filterBy: '=',
						sortingObj: '=',
						addlineupplayer: "&",   
						showplayercard: "&",
						searchedPlayerName :'=',
						tabPosition:'=',
						removePlayerLineup : '&',
						completedPosition: '=',
						selectedPlayers:'=',
						remainingSalary :'='
					},
				template:'<table></table>',
				link: createTpl
		}
});


app.filter("PlayerRosterSearchFilter",function(){

	return function(items, searched_player_name, tab_position,remaining_salary){
		
		 var filtered = [];
				var letterMatch = new RegExp(searched_player_name, 'i');

				if(tab_position != 'all')
				{ 
					pos = tab_position.replace(/,/g, "|");
					var positionMatch = new RegExp(pos,'i');
				}

				for (var i = 0; i < items.length; i++) {
						var item = items[i];

						/*if(item.salary > remaining_salary)
							continue;*/

						if(tab_position != 'all')
						{
							if(positionMatch.test(item.position.substring(0)))
							{
								if (letterMatch.test(item.full_name.substring(0)) || searched_player_name == '') 
								{
										filtered.push(item);
								}   
							}
						}
						else 
						{
							if (letterMatch.test(item.full_name.substring(0))) 
							{
									filtered.push(item);
							}
							
						}

				}
				return filtered;    
	}
});


// we create a simple directive to modify behavior of <ul>
app.directive("whenScoreUserScrolled", function(){
	return{
		restrict: 'A',
		link: function(scope, elem, attrs){      
				raw = elem[0];              
				elem.bind("scroll", function(){              
					if(raw.scrollTop+raw.offsetHeight+5 >= raw.scrollHeight){
						scope.loadingScoreUser = true;            
						scope.$apply(attrs.whenScoreUserScrolled);
					}
				});      
		},
	}
});

//Filter to show prize detail
app.filter("customPrize", function (numberFilter)
{
		function isNumeric(value)
		{
			return (!isNaN(parseFloat(value)) && isFinite(value));
		}

		return function (inputNumber, currencySymbol, decimalSeparator, thousandsSeparator, decimalDigits) {
			if (isNumeric(inputNumber))
			{
				// Default values for the optional arguments
				currencySymbol = (typeof currencySymbol === "undefined") ? "" : currencySymbol;
				decimalSeparator = (typeof decimalSeparator === "undefined") ? "." : decimalSeparator;
				thousandsSeparator = (typeof thousandsSeparator === "undefined") ? "," : thousandsSeparator;
				decimalDigits = (typeof decimalDigits === "undefined" || !isNumeric(decimalDigits)) ? 2 : decimalDigits;

				if (decimalDigits < 0) decimalDigits = 0;

				// Format the input number through the number filter
				// The resulting number will have "," as a thousands separator
				// and "." as a decimal separator.
				var formattedNumber = numberFilter(inputNumber, decimalDigits);

				// Extract the integral and the decimal parts
				var numberParts = formattedNumber.split(".");

				// Replace the "," symbol in the integral part
				// with the specified thousands separator.
				numberParts[0] = numberParts[0].split(",").join(thousandsSeparator);

				// Compose the final result
				var result = currencySymbol + numberParts[0];

				if (numberParts.length == 2)
				{
					result += decimalSeparator + numberParts[1];
				}

				return result;
			}
			else
			{
				return inputNumber;
			}
		};
});


app.filter("toArray", function(){
	return function(obj) {
		var result = [];
		angular.forEach(obj, function(val, key) {
			result.push(val);
		});
		return result;
	};
});

app.directive('teamSlider', function($compile) {
	 function link(scope,element,attrs) {      
			var str = "";      
					for (var i =  0; i < scope.sliderdata.length; i++) {
					str += '<div class=\"block\"><div class=\"team-group\"><figure class=\"team-logo left\">'+scope.sliderdata[i].away+'</figure>\
					<figure class=\"team-logo right\">'+scope.sliderdata[i].home+'</figure>\
					<div class=\"team-info\">\
					<span class=\"teams-name\">\
					<label>'+scope.sliderdata[i].away+'</label> VS <label>'+scope.sliderdata[i].home+'</label></span>\
					<span class=\"match-date\"><season-dateformat sech_date=\"'+scope.sliderdata[i].season_scheduled_date+'\" team_slider=\"1\"></season-dateformat></span>\
					</div></div></div>';  
				}        
				element.html($compile(str)(scope));         
				ContestFilterSlider();
				$('.middle-loader').hide();                                 
	}
		return {
				restrict: 'E',
				replace:true,
				scope:{
					sliderdata: '='
				},        
				template:' <div class="contest-content clearfix"></div>',        
				link: link
		}

});


app.directive('commonGameDetail', function($compile) {
		function linker(scope, element, attr)
		{
			console.log("commonGameDetail ", scope.gameDetail);
				var tpl = '<a href="javascript:void(0);">\
				<span class="profile-title" data-ng-bind="gameDetail.game_name"></span><i class="icon-dropdown1"></i></a>\
							<ul class="team-dropdown">\
								<li>\
									<label>Sports</label>\
									<span data-ng-bind="gameDetail.league_desc"></span></li>\
								<li>\
									<label>League</label>\
									<span data-ng-bind="gameDetail.duration_desc"></span></li>\
								<li>\
									<label>Entry Fee</label>\
									<span data-ng-bind-html="gameDetail.entry_fee | salaryFormat" ></span></li>\
								<li>\
									<label>Participants</label>\
									<span data-ng-bind="gameDetail.size">2</span></li>\
								<li>\
									<label>Salary Cap</label>\
									<span data-ng-bind-html="gameDetail.salary_cap | salaryFormat" ></span></li>\
								<li>\
									<label>Date &amp; Time</label>\
									<season-dateformat sech_date="{{gameDetail.season_scheduled_date}}"></season-dateformat>\
								</li>\
								<li>\
									<label>Prize</label>\
									<div class="other-option-content prize-details" >\
										<a class="prize_tag" href="javascript:void(0);" id="prizes_detail" data-ng-click="prizelistfun();">{{gameDetail.number_of_winner_desc}}<img src="img/loader.gif" id="price_list_loader" class="hide">\
										<i class="icon-dropdown"></i></a>\
										<div class="prize-details-dropdown">\
												<table data-ng-show = "prizeDistribute.length">\
														<thead>\
																<tr>\
																		<th><label>Pos</label></th>\
																		<th><label>Prize Amount</label></th>\
																</tr>\
														</thead>\
														<tbody>\
																<tr ng-repeat="amount in prizeDistribute track by $index">\
																		<td><label>{{$index+1}}</label></td>\
																		<td><label>${{amount}}</label></td>\
																</tr>\
														</tbody>\
												</table>\
										</div>\
									</div>\
								</li>\
								<li>\
									<label>Status</label>\
										<span ng-if="gameDetail.is_cancel==0">Open</span>\
										<span ng-if="gameDetail.is_cancel!=0">Completed</span></li></ul>';
										element.html($compile(tpl)(scope));
		} 
		return {
				restrict    : 'E',
				replace     : true,
				template    : '<div class="team-name-drop"></div>',
				scope       : {
						gameDetail : '=',
						prizeDistribute : '=',
						prizelistfun  : '&'
				},
				link : linker   
		}
});


//Directive to increase the height off add drop box when only single box is present
app.directive("singleClass", function(){
	return{
		restrict: 'A',    
		link: function(scope, elem, attrs){
					setTimeout(function(){
						var chilLen = $(elem[0]).children().context.childElementCount;
						if(chilLen<2) 
						{
							elem.children().css('height','79px');
							elem.children().css('line-height','75px');
						}
					},1000);
		},
	}
});

app.directive('lobbyFilter', function () {
	return {
		restrict: 'A',
		scope:{
				type:'=',
				meantype:'=',
				filtermasterdata:'=',
				selectedsportsid:'=bind',
				filteredleaguelist:'=bind'
			},
		link: function (scope, element, iAttrs) {
			element.bind('click',function(e){
					switch(scope.type) {
						case 'sports_id':
								scope.selectedsportsid=(scope.meantype=='all')?null:scope.meantype;
									switch(scope.meantype) {
										case 'all':
												scope.filteredleaguelist = [];
											break;
										default:
												//console.log(scope.filteredleaguelist);
												scope.filteredleaguelist = [];
												angular.forEach(scope.filtermasterdata.league_list, function(v,k){
														if(v.sports_id==scope.meantype) scope.filteredleaguelist.push(v);
												});
												//console.log(scope.filteredleaguelist);
											break;
									}
							break;
						case 2:
							// execute code block 2
							break;
						default:
							//code to be executed if n is different from case 1 and 2
					}
					scope.$apply();
					scope.$digest();
			});
		}
	};
})
app.directive('uixBxslider', function(){
	return {
		restrict: 'A',
		link: function($scope, iElm, iAttrs, controller) {
			//console.log($scope.$eval('{' + iAttrs.uixBxslider + '}'));
			$scope.$on('repeatFinished', function () {
								console.log("ngRepeat has finished");
								iElm.bxSlider($scope.$eval('{' + iAttrs.uixBxslider + '}'));
						});
		}
	}
}).directive('notifyWhenRepeatFinished', ['$timeout',
		function ($timeout) {
				return {
						restrict: 'A',
						link: function ($scope, iElm, iAttrs) {
								if ($scope.$last === true) {
										$timeout(function () {
												$scope.$emit('repeatFinished');
										});
								}
						}
				}
		}
]);

app.directive('activeNav', ['$location', function($location){
	return {
		restrict:'A',
		scope: {
			navclass:'@navclass',
		},
		link: function(scope, elem, attrs){
			//things happen here
			scope.$watch(function(locationPath) {
				var l = $location.path();
				if( l.indexOf(scope.navclass) >= 0 ){
					angular.element('.tab-nav a').removeClass('active');
					elem.addClass('active');
				}
			});
		}
	};
}]);



app.directive('fieldViewDir', function($compile) {
		function linker(scope, element, attr)
		{
				// console.log("selectedPlayers matrix", scope.selectedPlayers);
				// console.log("playerMatrix ", scope.playerMatrix);
				var tpl = '';        
				var rowCol = matrixRowCol.split('x');
				for (var row = 1; row <= rowCol[0]; row++) 
				{
						tpl += '<tr>';
						for (var col = 1; col <= rowCol[1]; col++) 
						{
							if(attr.viewfor == 'user_scoring')
							{
								tpl += '<td class="top-margin"><div class="line-up-container hide_view_user" id="matrix_'+row+'_'+col+'_user"></div></td>';
							}
							else if(attr.viewfor == 'opp_scoring')
							{
								tpl += '<td class="top-margin"><div class="line-up-container hide_view_opp" id="matrix_'+row+'_'+col+'_opp"></div></td>'; 
							}
							else if(attr.viewfor == 'lineup')
							{
								
								tpl += '<td><div class="line-up-container" id="matrix_'+row+'_'+col+'"></div></td>';
							}
							if (col%rowCol[1] == 0) 
							{
								tpl += '</tr>';
							}  
						}            
				}        
				element.html(tpl);
		} 

		return {
				restrict    : 'A',
				replace     : true,
				scope :{
					selectedPlayers :'=',
					playerMatrix :'=',
					removePlayerLineup : '&',
				},
				
				link : linker   
		}
});



app.filter('moment', [
		function () {
			return function (date, method) {
				var momented = moment(date);
				return momented[method].apply(momented, Array.prototype.slice.call(arguments, 2));
			};
		}
]);