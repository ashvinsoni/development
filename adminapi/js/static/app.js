var MdApp = angular.module('mdapp', ['ngRoute','googlechart']);
//var MdApp = angular.module('mdapp', ['ui.router','googlechart']);


MdApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {       
    $routeProvider
        .when('/fantasyadmin', {
            templateUrl: "adminauth/template/login",
            controller: 'LoginCtrl'
        })        
        .when('/fantasyadmin/dashboard', {
            templateUrl: "admindashboard/template/dashboard",
            controller: 'DashboardCtrl'
        })
        .when('/fantasyadmin/create_advertisement', {
            templateUrl: "advertisements/template/create_advertisement",
            controller:'AdvertisementCtrl'
            
        })
        .when('/fantasyadmin/advertisement_list', {
            templateUrl: "advertisements/template/advertisement_list",
            controller:'AdvertisementCtrl'
            
        })
        .when('/fantasyadmin/edit_advertisement/:editId', {
            templateUrl: "advertisements/template/edit_advertisement",
            controller:'AdvertisementCtrl'           
        })
        .when('/fantasyadmin/gamelist', {
            templateUrl: "admingame/template/gamelist",
            controller:'AdminGameCtrl'
        })
       .when('/fantasyadmin/newgame', {
           templateUrl: "admingame/template/newgame",
           controller:'AdminGameCtrl'
       })
        .when('/fantasyadmin/roster', {
            templateUrl: "adminroster/template/roster",
            controller:'RosterCtrl'
        })
        .when('/fantasyadmin/date_time', {
            templateUrl: "adminsetting/template/date_time",
            controller:'SettingCtrl'
        })
        .when('/fantasyadmin/send_emails', {
            templateUrl: "adminsetting/template/send_emails",
            controller:'SettingCtrl'
        })
        .when('/fantasyadmin/my_profile', {
            templateUrl: "adminsetting/template/my_profile",
            controller:'SettingCtrl'
        })
        .when('/fantasyadmin/youtube_url', {
            templateUrl: "adminsetting/template/youtube_url",
            controller:'SettingCtrl'
        })
        .when('/fantasyadmin/news', {
            templateUrl: "adminsetting/template/news",
            controller:'SettingCtrl'
        })
        .when('/fantasyadmin/add_news', {
            templateUrl: "adminsetting/template/add_news",
            controller:'SettingCtrl'
        })
        .when('/fantasyadmin/edit_news/:editId', {
            templateUrl: "adminsetting/template/edit_news",
            controller:'SettingCtrl'           
        })
        .when('/fantasyadmin/withdrawal_request', {
            templateUrl: "adminwithdrawal/template/withdrawal_request",
            controller:'WithdrawalCtrl'           
        })
        .when('/fantasyadmin/withdrawal_request_paypal', {
            templateUrl: "adminwithdrawal/template/withdrawal_request_paypal",
            controller:'WithdrawalCtrl'           
        })        
        .when('/fantasyadmin/sales_person', {
            templateUrl: "adminpromocode/template/sales_person",
            controller:'PromoCodeCtrl'           
        })
        .when('/fantasyadmin/edit_sales_person/:editId', {
            templateUrl: "adminpromocode/template/edit_sales_person",
            controller:'PromoCodeCtrl'           
        })
        .when('/fantasyadmin/new_sales_person', {
            templateUrl: "adminpromocode/template/new_sales_person",
            controller:'PromoCodeCtrl'           
        })
        .when('/fantasyadmin/promo_code', {
            templateUrl: "adminpromocode/template/promo_code",
            controller:'PromoCodeCtrl'           
        })
        .when('/fantasyadmin/new_promo_code', {
            templateUrl: "adminpromocode/template/new_promo_code",
            controller:'PromoCodeCtrl'           
        })
        .when('/fantasyadmin/commission_payout', {
            templateUrl: "adminpromocode/template/commission_payout",
            controller:'PromoCodeCtrl'           
        })
        .when('/fantasyadmin/user_report', {
            templateUrl: "adminreport/template/user_report",
            controller:'ReportCtrl'           
        })
        .when('/fantasyadmin/contest_report', {
            templateUrl: "adminreport/template/contest_report",
            controller:'ReportCtrl'           
        })
        .when('/fantasyadmin/games_report', {
            templateUrl: "adminreport/template/games_report",
            controller:'ReportCtrl'           
        })
        .when('/fantasyadmin/user', {
            templateUrl: "adminusers/template/user",
            controller:'AdminUsersCtrl'           
        });       
        
    $locationProvider.html5Mode(true);
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);