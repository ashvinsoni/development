<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route[ 'default_controller' ] = "welcome";
$route[ '404_override' ]       = 'dashboard/four_o_four';

$route[ 'forgotpasswordcode/(:any)' ] = 'dashboard/reset_password/$1';
$route[ 'activate-account/(:any)' ]   = 'login/activate_account/$1';

$route['template/(:any)']     = 'dashboard/template/$1';
$route['lang/(:any)']     = 'dashboard/lang/$1';

$route['lobby']     = 'lobby/lobby';

/*---------------------------------------Start new admin-------------------------------------*/

// ------------------------------------------Admin Auth
$route['fantasyadmin']                              = 'fantasyadmin/adminauth/login';
$route['adminauth/template/(:any)']                 = 'fantasyadmin/adminauth/template/$1';
$route['fantasyadmin/login']                        = 'fantasyadmin/adminauth/check_login';
$route['fantasyadmin/logout']                       = 'fantasyadmin/adminauth/logout';

//-------------------------------------------Dashboard
$route['fantasyadmin/dashboard']                    = 'fantasyadmin/admindashboard/dashboard';
$route['admindashboard/template/(:any)']            = 'fantasyadmin/admindashboard/template/$1';

//---------------------------------------- Advertisement
$route['advertisements/template/(:any)']            = 'fantasyadmin/advertisements/template/$1';
$route['fantasyadmin/create_advertisement']         = 'fantasyadmin/advertisements/create_advertisement';
$route['fantasyadmin/advertisement_list']           = 'fantasyadmin/advertisements/advertisement_list';
$route['fantasyadmin/edit_advertisement/(:any)']    = 'fantasyadmin/advertisements/edit_advertisement/$1';

//-------------------------------------------- Game
$route['admingame/template/(:any)']                 = 'fantasyadmin/admingame/template/$1';
$route['fantasyadmin/gamelist']                     = 'fantasyadmin/admingame/gamelist';
$route['fantasyadmin/newgame']                      = 'fantasyadmin/admingame/newgame';

//------------------------------------------- Roster
$route['adminroster/template/(:any)']               = 'fantasyadmin/adminroster/template/$1';
$route['fantasyadmin/roster']                       = 'fantasyadmin/adminroster/roster';

//------------------------------------------ Setting
$route['adminsetting/template/(:any)']              = 'fantasyadmin/adminsetting/template/$1';
$route['fantasyadmin/date_time']                    = 'fantasyadmin/adminsetting/date_time';
$route['fantasyadmin/send_emails']                  = 'fantasyadmin/adminsetting/send_emails';
$route['fantasyadmin/my_profile']                   = 'fantasyadmin/adminsetting/my_profile';
$route['fantasyadmin/youtube_url']                  = 'fantasyadmin/adminsetting/youtube_url';
$route['fantasyadmin/news']                         = 'fantasyadmin/adminsetting/news';
$route['fantasyadmin/add_news']                     = 'fantasyadmin/adminsetting/add_news';
$route['fantasyadmin/edit_news/(:any)']             = 'fantasyadmin/adminsetting/edit_news/$1';

// -----------------------------------------Withdrawal
$route['adminwithdrawal/template/(:any)']           = 'fantasyadmin/adminwithdrawal/template/$1';
$route['fantasyadmin/withdrawal_request']           = 'fantasyadmin/adminwithdrawal/withdrawal_request';
$route['fantasyadmin/withdrawal_request_paypal']    = 'fantasyadmin/adminwithdrawal/withdrawal_request_paypal';


// -----------------------------------------PromoCode
$route['adminpromocode/template/(:any)']            = 'fantasyadmin/adminpromocode/template/$1';
$route['fantasyadmin/new_sales_person']             = 'fantasyadmin/adminpromocode/new_sales_person';
$route['fantasyadmin/edit_sales_person/(:any)']     = 'fantasyadmin/adminpromocode/edit_sales_person/$1';
$route['fantasyadmin/sales_person']                 = 'fantasyadmin/adminpromocode/sales_person';
$route['fantasyadmin/promo_code']                   = 'fantasyadmin/adminpromocode/promo_code';
$route['fantasyadmin/new_promo_code']               = 'fantasyadmin/adminpromocode/new_promo_code';
$route['fantasyadmin/commission_payout']            = 'fantasyadmin/adminpromocode/commission_payout';

// -----------------------------------------Report
$route['adminreport/template/(:any)']               = 'fantasyadmin/adminreport/template/$1';
$route['fantasyadmin/user_report']                  = 'fantasyadmin/adminreport/user_report';
$route['fantasyadmin/contest_report']               = 'fantasyadmin/adminreport/contest_report';
$route['fantasyadmin/games_report']                 = 'fantasyadmin/adminreport/games_report';

// -----------------------------------------Admin User
$route['adminusers/template/(:any)']                = 'fantasyadmin/adminusers/template/$1';
$route['fantasyadmin/user']                         = 'fantasyadmin/adminusers/user';


/*---------------------------------------End new admin-------------------------------------*/


$route[ 'add_new_chat' ] 				= 'dashboard/add_new_chat';
$route[ 'chat' ]         				= 'dashboard/get_all_chat';
$route[ 'line-up/(:any)' ] 				= 'dashboard/lineup/$1';
$route[ 'score/(:any)' ] 				= 'dashboard/scoring/$1';
$route[ 'mygames' ] 					= 'dashboard/mygames';
$route[ 'myprofile' ] 					= 'dashboard/myprofile';
$route[ 'invitation' ] 					= 'dashboard/invitation';
$route[ 'finance' ] 					= 'dashboard/finance';
$route[ 'creategame' ] 					= 'dashboard/creategame';
$route[ 'createsalarycap' ]                  = 'dashboard/createsalarycap';
$route[ 'createomo' ] 					= 'dashboard/createomo';
$route[ 'aboutus' ] 					= 'dashboard/aboutus';
$route[ 'contactus' ] 					= 'dashboard/contactus';
$route[ 'privacypolicy' ] 				= 'dashboard/privacypolicy';
$route[ 'howitworks' ] 					= 'dashboard/howitworks';
$route[ 'games' ] 						= 'dashboard/games';
$route[ 'rules' ] 						= 'dashboard/rules';
$route[ 'faq' ] 						= 'dashboard/faq';
$route[ 'terms' ] 						= 'dashboard/terms';
$route[ 'add-drop/(:any)' ]                  = 'dashboard/adddrop/$1';


/*----------------------------------FEED Routing--------------------------------*/


/* End of file routes.php */
/* Location: ./application/config/routes.php */