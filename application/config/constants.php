<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
define('FILE_READ_MODE', 0644);
define('FILE_WRITE_MODE', 0666);
define('DIR_READ_MODE', 0755);
define('DIR_WRITE_MODE', 0777);
define('GEOIP_USERID', '97832');
define('GEOIP_LICENSE_KEY', '9IhzscgMfxuu');

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/

define('FOPEN_READ',							'rb');
define('FOPEN_READ_WRITE',						'r+b');
define('FOPEN_WRITE_CREATE_DESTRUCTIVE',		'wb'); // truncates existing file data, use with care
define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE',	'w+b'); // truncates existing file data, use with care
define('FOPEN_WRITE_CREATE',					'ab');
define('FOPEN_READ_WRITE_CREATE',				'a+b');
define('FOPEN_WRITE_CREATE_STRICT',				'xb');
define('FOPEN_READ_WRITE_CREATE_STRICT',		'x+b');

define( 'IS_LOCAL_TIME' , TRUE );
define( 'BACK_YEAR', '0 month' );

//For Main setting

define( 'MAILPATH'			,	'' );
define( 'MAILTYPE'			,	'html' );
define( 'CHARSET'			,	'iso-8859-1' );
define( 'WORD_WRAP'			,	TRUE );

define( 'FROM_ADMIN_EMAIL'	,	'vinod@vinfotech.com' );
define( 'BCC_EMAIL'			,	'vinod@vinfotech.com' );
define( 'FROM_EMAIL_NAME'	,	'Vfantasysports' );
define( 'FROM_EMAIL_TITLE'	,	'Vfantasysports' );
define( 'NO_REPLY_EMAIL'	,	'noreply@vfantasysports.com' );

define('PROFILE', 'upload/');
define('PROFILE_THUMB','upload/logo/');

		define( 'SUPPORT_EMAIL'		,	'sujalr@vinfotech.com' );
		define( 'FEEBACK_EMAIL'		,	'vinod@vinfotech.com' );
		define( 'SMTP_HOST'			,	'mail.vinfotech.com' );
		define( 'SMTP_USER'			,	'vishalp@vinfotech.com' );
		define( 'SMTP_PASS'			,	'V452001' );
		define( 'SMTP_PORT'			,	'25' );
		define( 'PROTOCOL'			,	'smtp' );
		define( 'SMTP_CRYPTO'		,	'tls' );
		define( 'ROOT_PATH'			,	$_SERVER['DOCUMENT_ROOT'].'/vfantasysports/' );
		define( 'PATH_URL'			,	'http://'.$_SERVER['SERVER_NAME'].'/vfantasysports/' );
		
		// define( 'FACEBOOK_ID'		,  '1440313729597142' );
		define( 'FACEBOOK_ID'		,  '1440313729597142' );    // Will work on http://localhost/vfantasysports/
		define(	'TWITTER_API'			,	'4aW9wL4JLavtcNNq35QQ5pVto' );
		
		define(	'TWITTER_SECRET_KEY'	,	'F4dtRNmJGejUZ0SPn1aUiqYH0pBKuiEBzp07vCUox4oajk4whH' );
		define(	'TWITTER_OAUTH_CALLBACK',	PATH_URL.'twitter/twitter_user_info' );
		
		define('CAPTCHA_PUBLIC_KEY', '6LcxJ-wSAAAAAGNHBPMgtYZPKf-5FMraSmsVxouA');
		define('CAPTCHA_PRIVATE_KEY', '6LcxJ-wSAAAAAEwF1TEdj74vd-6e_KQUjrUQxffG');

		define('IMAGE_SERVER','local');

		define('IMAGE_PATH',        'http://'.$_SERVER['SERVER_NAME'].'/vfantasysports/');
		//define( 'IMAGE_PATH'	,	'' );
		define( 'BUCKET'		,	'' );
		define( 'AWS_ACCESS_KEY',	'' );
		define( 'AWS_SECRET_KEY',	'' );

		define( 'NODE_ADDR' , '' );
		define( 'IMAGE_PATH_USERS'	,	'upload/logo/' );	
	


define( 'TIMEOUT_INTERVAL' , 60000 );  /*Scoring Feed Update time in millisecond Default 4 Minute(240000) */
define( 'USER_TYPE' , 	'USER' );
define( 'ADMIN_TYPE' ,	'ADMIN' );

define( 'USER_DEFAULT_REDIRECT' , 'dashboard' );
define( 'ADMIN_DEFAULT_REDIRECT' , 'fantasyadmin/dashboard' );

define( 'ACTIVE' , '1' );
define( 'INACTIVE' , '0' );

define( 'FIXED'		, '0' );
define( 'VARIABLE'	, '1' );

define( 'PER_PAGE_LIMIT' , 10 );

define( 'GAME_TYPE_DAILY',			'1' );
define( 'GAME_TYPE_WEEKLY',			'2' );
//define( 'GAME_TYPE_SEASON_LONG',	'3' );
define( 'GAME_TYPE_CUSTOM_WEEKLY',	'3' );

define('PAYMENT_TRIAL_PERIOD' , '+14 days');

/* TABLE NAME CONSTANT */

define( 'ADMIN'								,	'admin' );
define( 'USER'								,	'user' );
define( 'MASTER_SPORTS'						,	'master_sports' );
define( 'LEAGUE'							,	'league' );
define( 'LEAGUE_DURATION'					,	'league_duration' );
define( 'MASTER_DURATION'					,	'master_duration' );
define( 'SEASON'							,	'season' );
define( 'MASTER_DATA_ENTRY'					,	'master_data_entry' );
define( 'LEAGUE_DRAFTING_STYLES'			,	'league_drafting_styles' );
define( 'MASTER_DRAFTING_STYLES'			,	'master_drafting_styles' );
define( 'MASTER_SALARY_CAP'					,	'master_salary_cap' );
define( 'LEAGUE_SALARY_CAP'					,	'league_salary_cap' );
define( 'SEASON_WEEK'						,	'season_week' );
define( 'MASTER_NUMBER_OF_WINNER'			,	'master_number_of_winner' );
define( 'LEAGUE_NUMBER_OF_WINNER'			,	'league_number_of_winner' );
define( 'GAME'								,	'game' );
define( 'PLAYER'							,	'player' );
define( 'MASTER_SITE_RAKE'					,	'master_site_rake' );
define( 'PRIZE_MONEY_FOR_WINNER'    		,   'prize_money_for_winner');
define( 'PLAYER_TEMP'						,	'player_temp' );
define( 'PLAYER_SALARY_MASTER'				,	'player_salary_master' );
define( 'PLAYER_SALARY_TRANSACTION'			,	'player_salary_transaction' );
define( 'MASTER_STATE'						,	'master_state' );
define( 'MASTER_COUNTRY'					,	'master_country' );
define(	'PAYPAL_TRANSACTION'				,	'paypal_transaction' );
define(	'PAYMENT_HISTORY_TRANSACTION'		,	'payment_history_transaction' );
define(	'USER_PAYMENT_WITHDRAW'				,	'user_payment_withdraw' );
define(	'LINEUP_MASTER'						,	'lineup_master' );
define(	'LEAGUE_POSITION'					,	'league_position' );
define(	'MASTER_POSITION'					,	'master_position' );
define(	'LEAGUE_LINEUP_ALLOWED_POSITIONS'	,	'league_lineup_allowed_positions' );
define(	'LEAGUE_LINEUP_POSITION'			,	'league_lineup_position' );
define(	'MASTER_SCORING'					,	'master_scoring' );
define(	'MASTER_SCORING_CATEGORY'			,	'master_scoring_category' );
define(	'GAME_STATISTICS'					,	'game_statistics' );
define(	'GAME_PLAYER_SCORING'				,	'game_player_scoring' );
define(	'LINEUP'							,	'lineup' );
define(	'PROMO_CODE_EARNING'				,	'promo_code_earning');
define(	'PROMO_CODE'						,	'promo_code');
define(	'PROMO_SALES_PERSON'				,	'sales_person');
define(	'NEWS'								,	'news');
define(	'NEWS_FEED'							,	'news_feed');
define(	'YOUTUBE'							,	'youtube');
define(	'CHAT'								,	'chat');
define(	'LOGIN_ATTEMPTS'					,	'login_attempts');
define( 'TEAM_MLB'							,   'team_mlb' );
define( 'BOXSCORE'							,   'boxscore' );
define( 'MASTER_LEAGUE_WEEK'				,	'master_league_week');
define( 'GAME_STATISTICS_BASEBALL'          ,   'game_statistics_baseball');
define( 'GAME_STATISTICS_FOOTBALL'      	,   'game_statistics_football');
define( 'GAME_STATISTICS_NHL'      	,   'game_statistics_nhl');
define( 'GAME_STATISTICS_BASKETBALL'      	,   'game_statistics_basketball');
define( 'GAME_STATISTICS_NFL'         		,   'game_statistics_nfl');
define( 'GAME_STATISTICS_NRL'          		,   'game_statistics_nrl');
define( 'GAME_STATISTICS_NFL_OMO'     		,   'game_statistics_nfl_omo');

define('GAME_STATISTICS_SOCCER'				,	'game_statistics_soccer');

define( 'INVITE'							,	'invite' );
define( 'MASTER_SIZE'						,	'master_size');
define( 'MASTER_ENTRY_FEE'					,	'master_entry_fee');
define( 'QUESTION'							,	'question');
define( 'QUESTION_PATTERN'					,	'question_pattern');
define( 'QUESTION_ANSWER_PATTERN'			,	'question_answer_pattern');
define( 'TEAM'								, 	'team');
define( 'PLAYER_SEASONAL_STATISTICS_NFL'	, 'player_seasonal_statistics_nfl');
define( 'PLAYER_SCORE_SEASONAL'				, 	'player_score_seasonal');
define( 'OMO_PLAYER_POINT'					,   'omo_player_point');

define( 'FIELD_VIEW'						,   'field_view');
define( 'FIELD_VIEW_PATTERN'				,   'field_view_pattern');
define( 'MASTER_FIELD_VIEW'					,   'master_field_view');
define( 'GAME_BOXSCORE_NFL'	 				,   'game_boxscore_nfl' );
//define( 'CHAT_READED'						,	'vi_chat_readed');
define( 'FRIENDS'							,	'friends');

define('NOTIFICATION_TYPE'					, 	'notification_type');
define('NOTIFICATION'						, 	'notification');
define(	'GAME_PLAY_BY_PLAY_NFL'				,	'game_play_by_play_nfl');
define(	'GAME_PLAY_BY_PLAY_NFL_MASTER'	,	'game_play_by_play_nfl_master');
define(	'GAME_WEATHER'						,	'game_weather');
define(	'PLAYER_PREDICTION_POINT'			,	'player_prediction_point');
define(	'LEAGUE_COUNTRY'			,	'league_country');

define( 'MASTER_MEMBER_FEES' , 'master_member_fees');
define( 'MAX_ADD_DROP_LIMIT' , '2' );

/* Advertisement Management*/
define( 'ADS_POSITION' , 'ad_position' );
define( 'ADS_MANAGEMENT' , 'ad_management' );


/* TABLE NAME CONSTANT */

/* Twitter Constant  */


/* Twitter Constant  */
define( 'AUTOLOGIN_COOKIE_LIFE', 60*60*24*31*2 );


define( 'LIVE_CHECK_COMPLETE'		,	'1');
define( 'LIVE_CHECK_NOT_COMPLETE'	,	'0');

define( 'DEBIT'	,	'1' );
define( 'CREDIT',	'2' );

define( 'TRANSACTION_HISTORY_DESCRIPTION_WITHDRAW'	, 'WITHDRAW' );
define( 'TRANSACTION_HISTORY_DESCRIPTION_DEPOSIT'	, 'DEPOSIT' );
define( 'TRANSACTION_HISTORY_DESCRIPTION_ENTRY_FEE'	, 'Entry fee for' );

define(	'PAYMENT_PENDING'	, 	'0' );
define(	'PAYMENT_COMPLETE'	, 	'1' );

define( 'PAYPAL'		,	'1' );
define( 'CREDIT_CARD'	,	'2' );

define( 'PAYPAL_WITHDRAW'	,	'1' );
define( 'LIVE_CHECK'		,	'2' );

define( 'DEPOSIT_AMOUNT_MAX_LIMIT' , 10000 );
define( 'DEPOSIT_AMOUNT_MIN_LIMIT' , 1 );

define( 'LOGIN_MAX_ATTEMPTS', 3 );

// Update this version for variable scripts.

define( 'VERSION_1' , time() );

// Update this version for variable scripts.
define( 'VERSION_2' , time() );

//timezone setting
define( 'EST_PST', 'EST' );
// site name constants
define( 'SITE_NAME',			             'VFantasySports' );
define( 'PROJECT_NAME_FORMATED',			 'Vfantasysports' );
define( 'PROJECT_NAME_SUPPORT' , 			 'Vfantasysports' );
define( 'PROJECT_NAME_WITHOUT_SPACE' , 		 'Vfantasysports' );
define( 'MAIL_TO_SUPPORT' ,                  'vinod@vinfotech.com' );
define( 'FB_PAGE_LINK' ,                     'https://www.facebook.com/' );
define( 'TWITTER_PAGE_LINK' ,                'https://twitter.com/' );
define( 'GOOGLE_PAGE_LINK' ,                 'https://plus.google.com/' );
define( 'FEED_PROVIDER_LINK' ,               'http://www.fantasydata.com' );
define( 'SITE_LOGO_LINK' ,                   'img/header-logo.png' );
define( 'SITE_LOGO_ALT_TXT' ,                'Vfantasysports' );
define( 'LOGO_IN_MAILER' ,                   'img/emailer-logo.png' );
define( 'FEED_PROVIDER_NAME' ,               'fantasydata' );
define( 'UNCAPPED_GAME_SIZE' ,               '10000' );



define('CURRENCY_CODE', '&#163;');


define('MYSQL_DATE_FORMAT', '%d/%m %h:%i %p');
//reCaptcha key
//define( 'RECAPTCHA_PUBLIC_KEY', '6LejcAMTAAAAABWtRjZzcdORhFSNeutNIY8FYnQd' );
//define( 'RECAPTCHA_PRIVET_KEY', '6LejcAMTAAAAAEo9ixq83B3BnmOGIk39QUukdkAT' );


/* End of file constants.php */
/* Location: ./application/config/constants.php */