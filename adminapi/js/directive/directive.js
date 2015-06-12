MdApp.directive('validationEngine', function(){
	return {
		link: function(scope, element, attrs, ctrl) {
			if(typeof scope.onValidationComplete == 'undefined' ) scope.onValidationComplete = function(){};
			element.validationEngine('attach', {onValidationComplete:function(form,status){scope.onValidationComplete(form,status);}});
		}
	}
});

MdApp.directive('resizeTable', function(){
	return {
		link: function(scope, element, attrs, ctrl) {
			var onSampleResized = function(e){
				var columns = $(e.currentTarget).find("th");
				var msg = "columns widths: ";
				columns.each(function(){ msg += $(this).width() + "px; "; })
			};	
			element.colResizable({
				liveDrag:true, 
				gripInnerHtml:"<div class='grip'></div>", 
				draggingClass:"dragging", 
				onResize:onSampleResized
			});
			element.removeClass('CRZ');
			//Disable the plugin first    
			// $( "#container table" ).colResizable({ disable : true });
			// insert_column();
			// Re-init the plugin on the new elements
			// $( "#container table" ).colResizable({ liveDrag : true });
		}
	};
});

MdApp.directive('activeNav', ['$location', function($location){
	return {
		restrict:'A',
		scope: {
			navclass:'@navclass',
		},
		link: function(scope, elem, attrs){
			//things happen here
			scope.$watch(function(locationPath) {
				var l = $location.path();
				if( l.indexOf(scope.navclass) >= 0 )
				{
					angular.element('#menu a').removeClass('active');
					elem.addClass('active');
				}
			});
		}
	};
}]);

MdApp.directive('perPagelimit', function(){
	return {
		restrict: 'E',
		scope: {
			onChangelimit: '&',
			start:'=bind'
		},
		replace: true,
		template: "<select id=\"limit\" name=\"limit\"></select>",
		link: function(scope, element, attrs) {
			var limits = [10,25,50,100];
			angular.forEach(limits,function(v,k){
				var opt = angular.element(document.createElement('option')).attr('value',v).append(v);
				element.append(opt);
			});
			element.uniform();
			element.bind("change", function(e){scope.start=0;scope.$apply();scope.onChangelimit();});
		}
	}
});

MdApp.directive('uniform', [function () {
	return {
		restrict: 'A',
		link: function (scope, element, iAttrs) {
			element.uniform();
		}
	};
}]);

MdApp.directive('checkAll', [function () {
	return {
		restrict: 'A',
		link: function (scope, element, iAttrs) {
			element.bind('click', function($event){
				var isChecked = $event.target.checked;
				var $checkboxes = angular.element('input[name="player_unique_id[]"]');
				$checkboxes.attr('checked', isChecked ? true : false );
				isChecked?$checkboxes.parent('span').addClass('checked'):$checkboxes.parent('span').removeClass('checked');
			});
		}
	};
}]);

MdApp.directive('autoF', ['$timeout',function ($timeout) {
	return {
		restrict: 'C',
		link: function (scope, element, iAttrs) {
			$timeout(function() {
				element[0].focus(); 
			});
		}
	};
}]);

MdApp.directive('dateTime', function(){
	return {
		link: function(scope, element, attrs, ctrl) {
			element.datetimepicker({
				changeMonth: true,
				changeYear: true,
				dateFormat:"yy-mm-dd",
				timeFormat: 'HH:mm:ss',
				beforeShow: function(input, inst) {
					// Handle calendar position before showing it.
					// It's not supported by Datepicker itself (for now) so we need to use its internal variables.
					var calendar = inst.dpDiv;
					// Dirty hack, but we can't do anything without it (for now, in jQuery UI 1.8.20)
					setTimeout(function() {
						calendar.position({
							my: 'right top',
							at: 'right bottom',
							collision: 'none',
							of: input
						});
					}, 1);
				}
			});
		}
	};
});