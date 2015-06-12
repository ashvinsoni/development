/**
 * @name    jQuery Countdown Plugin
 * @author  Martin Angelov
 * @version 1.0
 * @url     http://tutorialzine.com/2011/12/countdown-jquery/
 * @license MIT License
**/

(function ($) {

	// Number of seconds in every time division
		var days = 24 * 60 * 60,
		hours    = 60 * 60,
		minutes  = 60;
	// Creating the plugin
	$.fn.countdown = function (prop) {

		var options = $.extend({
			callback: function () {
			},
			timestamp: 0,
			from: 0,
			timeup : function(){}
		}, prop);

		var left, d, h, m, s, positions;
		var count = 0;

		// Initialize the plugin
		init(this, options);

		positions = this.find( '.position' );

		(function tick() {
			count++;
			// Time left
			var frm = options.from;
			// frm = frm+count;
			left = Math.floor((options.timestamp - frm ) / 1000);
			left = left - count;
			var milisecond = left;
			if (left < 0) {
				options.timeup();
				return;
				left = 0;
			}

			// Number of days left
			d = Math.floor(left / days);
			// console.log('d'+d);
			updateDuo(0, 1, d);
			// console.log(  Math.floor(d / 10) );
			left -= d * days;

			// Number of hours left
			h = Math.floor(left / hours);
			updateDuo(2, 3, h);
			left -= h * hours;

			// Number of minutes left
			m = Math.floor(left / minutes);
			updateDuo(4, 5, m);
			left -= m * minutes;

			// Number of seconds left
			s = left;
			updateDuo(6, 7, s);
			// Calling an optional user supplied callback
			options.callback(d, h, m, s, milisecond);

			// Scheduling another call of this function in 1s
			setTimeout(tick, 1000);
		})();

		// This function updates two digit positions at once
		function updateDuo(minor, major, value) {
			switchDigit(positions.eq(minor), Math.floor(value / 10) );
			switchDigit(positions.eq(major), value % 10);
		}

		return this;
	};


	function init(elem, options) {
		elem.addClass( 'countdownHolder' );

var str = '<span class="countdown_row countdown_show4 countdown_holding">\
	<span class="countdown_section">\
		<span class="countdown_amount countDays"><span class="position"><span class="digit static">0</span></span><span class="position"><span class="digit static">0</span></span></span>\
		<br>DAYS\
	</span>\
	<span class="countdown_section">\
		<span class="countdown_amount countHours"><span class="position"><span class="digit static">0</span></span><span class="position"><span class="digit static">0</span></span></span>\
		<br>HOURS\
	</span>\
	<span class="countdown_section">\
		<span class="countdown_amount countMinutes"><span class="position"><span class="digit static">0</span></span><span class="position"><span class="digit static">0</span></span></span>\
		<br>MINS\
	</span>\
	<span class="countdown_section">\
		<span class="countdown_amount countSeconds"><span class="position"><span class="digit static">0</span></span><span class="position"><span class="digit static">0</span></span></span>\
		<br>SECS\
	</span>\
</span>';
elem.append(str);
		// Creating the markup inside the container
		$.each(['Days', 'Hours', 'Minutes', 'Seconds'], function (i) {
			// var delimeter = ': ';
			// if (this == 'Days') {
				// delimeter = '';
			// }
			// $('<span class="count' + this + '">').html(
				// '<span class="position">\
				  // ' + delimeter + '<span class="digit static">0</span>\
		// </span>\
		// <span class="position">\
		  // <span class="digit static">0</span>\
		// </span>'
			// ).appendTo(elem);

			// if (this != "Seconds") {
				// elem.append('<span class="countDiv countDiv' + i + '"></span>');
			// }
		});

	}

	// Creates an animated transition between the two numbers
	function switchDigit(position, number) {
		var digit = position.find('.digit')

		if (digit.is(':animated')) {
			return false;
		}

		if (position.data('digit') == number) {
			// We are already showing this number
			return false;
		}

		position.data('digit', number);

		var replacement = $('<span>', {
			'class': 'digit',
			css: {
				top: '-1em',
				opacity: 0
			},
			html: number
		});

		// The .static class is added when the animation
		// completes. This makes it run smoother.

		digit
			.before(replacement)
			.removeClass('static');
		digit.remove();
		// .animate({top:'0em',opacity:0},'fast',function(){

		// })

		replacement
			.delay(10)
			.animate({top: 0, opacity: 1}, 'fast', function () {
				replacement.addClass('static');
			});
	}
})(jQuery);