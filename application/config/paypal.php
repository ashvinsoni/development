<?php  
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/** 
 * Sandbox / Test Mode
 * -------------------------
 * TRUE means you'll be hitting PayPal's sandbox/test servers.  FALSE means you'll be hitting the live servers.
 */

switch ( $_SERVER[ 'SERVER_NAME' ] )
{
	case 'www.vfantasysports.com':
			$config['Sandbox'] = FALSE;
	break;
	default:
			$config['Sandbox'] = TRUE;		
}	


/* 
 * PayPal API Version
 * ------------------
 * The library is currently using PayPal API version 98.0.  
 * You may adjust this value here and then pass it into the PayPal object when you create it within your scripts to override if necessary.
 */
$config['APIVersion'] = '98.0';

/*
 * PayPal Developer Account Email Address
 * This is the email address that you use to sign in to http://developer.paypal.com
 */
/*
Developer Account details
sportsfantasypro@vinfotech.com
sp258258
Sandbox account details
webvensure_sports@vinfotech.com
sp258258
*/

$config[ 'business_email' ] = $config[ 'Sandbox' ] ? 'webvensure_sports@vinfotech.com' : 'paypal@webvensure.com';

$config[ 'DeveloperEmailAccount' ] = $config[ 'Sandbox' ] ? 'webvensure_sports@vinfotech.com' : 'PRODUCTION_PAYPAL_EMAIL_GOES_HERE';




/*
 * PayPal Gateway API Credentials
 * ------------------------------
 * These are your PayPal API credentials for working with the PayPal gateway directly.
 * These are used any time you're using the parent PayPal class within the library.
 * 
 * We're using shorthand if/else statements here to set both Sandbox and Production values.
 * Your sandbox values go on the left and your live values go on the right.
 * 
 * You may obtain these credentials by logging into the following with your PayPal account: https://www.paypal.com/us/cgi-bin/webscr?cmd=_login-api-run
 */

/*$config[ 'APIUsername' ]  = $config[ 'Sandbox' ] ? 'webvensure_sports_api1.vinfotech.com' : 'PRODUCTION_PAYPAL_EMAIL_GOES_HERE';

$config[ 'APIPassword' ]  = $config[ 'Sandbox' ] ? '1405418300' : 'PRODUCTION_PAYPAL_EMAIL_GOES_HERE';
$config[ 'APISignature' ] = $config[ 'Sandbox' ] ? 'AFcWxV21C7fd0v3bYYYRCpSSRl31AgT2maU9ZNdFpXFuzQDNtQzwzWQS' 	: 'PRODUCTION_PAYPAL_EMAIL_GOES_HERE';*/

$config['APIUsername'] = $config['Sandbox'] ? 'jay.hardia-facilitator_api1.vinfotech.com' : 'PRODUCTION_USERNAME_GOES_HERE';
$config['APIPassword'] = $config['Sandbox'] ? '1392377880' : 'PRODUCTION_PASSWORD_GOES_HERE';
$config['APISignature'] = $config['Sandbox'] ? 'AlJfepJqBXM20LhSAcF9dg.7pHDZAC7PxZGR6F65J.4PHB2Vl1wbNQ2n' : 'PRODUCTION_SIGNATURE_GOES_HERE';


/*
 * Payflow Gateway API Credentials
 * ------------------------------
 * These are the credentials you use for your PayPal Manager:  http://manager.paypal.com
 * These are used when you're working with the PayFlow child class.
 * 
 * We're using shorthand if/else statements here to set both Sandbox and Production values.
 * Your sandbox values go on the left and your live values go on the right.
 * 
 * You may use the same credentials you use to login to your PayPal Manager, 
 * or you may create API specific credentials from within your PayPal Manager account.
*/
$config[ 'PayFlowUsername' ] = $config[ 'Sandbox' ] ? 'tester' 		: 'PRODUCTION_USERNAME_GOGES_HERE';
$config[ 'PayFlowPassword' ] = $config[ 'Sandbox' ] ? 'Passw0rd~' 	: 'PRODUCTION_PASSWORD_GOES_HERE';
$config[ 'PayFlowVendor' ]   = $config[ 'Sandbox' ] ? 'angelleye' 	: 'PRODUCTION_VENDOR_GOES_HERE';
$config[ 'PayFlowPartner' ]  = $config[ 'Sandbox' ] ? 'PayPal' 		: 'PRODUCTION_PARTNER_GOES_HERE';

/*
 * PayPal Application ID
 * --------------------------------------
 * The application is only required with Adaptive Payments applications.
 * You obtain your application ID but submitting it for approval within your 
 * developer account at http://developer.paypal.com
 *
 * We're using shorthand if/else statements here to set both Sandbox and Production values.
 * Your sandbox values go on the left and your live values go on the right.
 * The sandbox value included here is a global value provided for developrs to use in the PayPal sandbox.
 */

$config['ApplicationID'] = $config['Sandbox'] ? 'APP-80W284485P519543T' : 'PRODUCTION_APP_ID_GOES_HERE';


/**
 * Third Party User Values
 * These can be setup here or within each caller directly when setting up the PayPal object.
 */
$config[ 'DeviceID' ] = $config['Sandbox'] ? '' : 'PRODUCTION_DEVICE_ID_GOES_HERE';

$config[ 'host' ] = $config[ 'Sandbox' ] ? 'https://www.sandbox.paypal.com/cgi-bin/webscr' : 'https://www.paypal.com/cgi-bin/webscr';

$config[ 'paypal_status' ] = array( 'completed' );

$ipnurl = $config['Sandbox'] ? 'https://www.sandbox.paypal.com/cgi-bin/webscr' : 'https://www.paypal.com/cgi-bin/webscr';
define('IPN_CALLBACK_URL', $ipnurl);

/* End of file paypal.php */
/* Location: ./system/application/config/paypal.php */