var MdApp = angular.module('mdapp', ['ngRoute']);

MdApp.config(['$routeProvider','$locationProvider','$httpProvider', function($routeProvider,$locationProvider,$httpProvider) {
	$routeProvider.
		when('/sudo', {
			templateUrl: "sudo/template/login",
			controller:'LoginCtrl'
		}).when('/sudo/user/',{
			templateUrl: "sudo/template/user",
			controller:'UserCtrl'
		}).when('/sudo/dashboard/', {
			templateUrl: "sudo/template/dashboard",
		}).when('/sudo/setting/', {
			templateUrl: "sudo/template/setting",
			controller:'SettingCtrl'
		}).when('/sudo/roster/', {
			templateUrl: "sudo/template/roster",
			controller:'RosterCtrl'
		}).when('/sudo/byeweek/', {
			templateUrl: "sudo/template/byeweek",
			controller:'ByeweekCtrl'
		}).when('/sudo/addplayer/', {
			templateUrl: "sudo/template/addplayer",
			controller:'AddPlayerCtrl'
		});
	$locationProvider.html5Mode(true);
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);