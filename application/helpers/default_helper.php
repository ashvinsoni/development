<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

//function to display a debug message
function debug( $msg , $die=FALSE )
{
	echo ( "<style> pre{background-color:chocolate;font-weight:bolder;} .debug{color: black;text-align:center;background-color:yellow;font-weight:bolder;padding:10px;font-size:14px;}</style>" );

	echo ("\n<p class='debug'>\n");

	echo ("MSG".time().": ");

	if ( is_array ( $msg ) )
	{
		echo ( "\n<pre>\n" );
		print_r ( $msg );
		echo ( "\n</pre>\n" );
	}
	elseif ( is_object ( $msg ) )
	{
		echo ( "\n<pre>\n" );
		var_dump ( $msg );
		echo ( "\n</pre>\n" );
	}
	else
	{
		echo ( $msg );
	}

	echo ( "\n</p>\n" );

	if ( $die )
	{
		die;
	}
}


function format_date( $date = 'today' , $format = 'Y-m-d H:i:s' )
{

	if( $date=="today" )
	{
		if ( IS_LOCAL_TIME === TRUE )
		{
			$back_time = strtotime( BACK_YEAR );
			$dt = date( $format , $back_time );
		}
		else
		{
			$dt = date( $format );
		}
	}
	else
	{
		if( is_numeric ( $date ) )
		{
			$dt = date( $format , $date );
		}
		else
		{
			if( $date != null )
			{
				$dt = date( $format , strtotime ( $date ) );
			}
			else
			{
				$dt="--";
			}
		}
	}

	$path = ROOT_PATH.'date_time.php';
	include( $path );

	if ( isset( $date_time ) && $date_time &&  ($_SERVER['SERVER_NAME'] != 'www.vfantasysports.com' ) )
	{
		$dt = date( $format , strtotime( $date_time ) );
	}
	return $dt;
	//return "2015-05-24 14:00:00";
}


if (!function_exists('array_column')) {
	function array_column($input, $column_key, $index_key = null)
	{
		if ( empty( $input ) )
		{
			return array();
		}

		if ($index_key !== null) {
			// Collect the keys
			$keys = array();
			$i = 0; // Counter for numerical keys when key does not exist

			foreach ($input as $row) {
				if (array_key_exists($index_key, $row)) {
					// Update counter for numerical keys
					if (is_numeric($row[$index_key]) || is_bool($row[$index_key])) {
						$i = max($i, (int)$row[$index_key] + 1);
					}

					// Get the key from a single column of the array
					$keys[] = $row[$index_key];
				} else {
					// The key does not exist, use numerical indexing
					$keys[] = $i++;
				}
			}
		}

		if ($column_key !== null) {
			// Collect the values
			$values = array();
			$i = 0; // Counter for removing keys

			foreach ($input as $row) {
				if (array_key_exists($column_key, $row)) {
					// Get the values from a single column of the input array
					$values[] = $row[$column_key];
					$i++;
				} elseif (isset($keys)) {
					// Values does not exist, also drop the key for it
					array_splice($keys, $i, 1);
				}
			}
		} else {
			// Get the full arrays
			$values = array_values($input);
		}

		if ($index_key !== null) {
			return array_combine($keys, $values);
		}

		return $values;
	}

}

function get_player_image( $player_unique_id = '' )
{
	
		if ( $player_unique_id )
		{
			$file = ROOT_PATH.'upload/player/NFL/195/'.$player_unique_id.'.jpg';
			if ( file_exists( $file ) )
			{
				$file = base_url( 'upload/player/NFL/195/'.$player_unique_id.'.jpg' );
				return $file;
			}
		}
		
	return;
}

function get_player_image_mlb( $player_unique_id = '' )
{
	if ( IMAGE_SERVER == 'local' )
	{
		if ( $player_unique_id )
		{
			$file = ROOT_PATH.'upload/player/MLB/195/'.$player_unique_id.'.jpg';
			if ( file_exists( $file ) )
			{
				$file = base_url( 'upload/player/MLB/195/'.$player_unique_id.'.jpg' );
				return $file;
			}
		}
	}
	else
	{
		$img = IMAGE_PATH.'upload/player/MLB/195/'.$player_unique_id.'.jpg';

		$headers  = @get_headers( $img );

		if (  strpos( $headers[0] , '200' ) )
		{
			return $img;
		}
	}
	return;
}

function get_player_image_nfl( $player_unique_id = '' )
{
	
		if ( $player_unique_id )
		{
			$file = ROOT_PATH.'upload/player/NFL/195/'.$player_unique_id.'.jpg';
			if ( file_exists( $file ) )
			{
				$file = base_url( 'upload/player/NFL/195/'.$player_unique_id.'.jpg' );
				return $file;
			}
		}
	
	
	return;
}



function show_user_image( $image = '' , $big_default = FALSE )
{
	$default = 'img/default_small.png';
	if ( $big_default )
	{
		$default = 'img/default.png';
	}
	if ( $image )
	{
		$root_file = ROOT_PATH.PROFILE_THUMB.$image;
		$file      = IMAGE_PATH.PROFILE_THUMB.$image;

		if ( IMAGE_SERVER == 'local' )
		{
			if ( file_exists( $root_file ) )
			{
				$default = $file;
			}
		}
		else
		{
			$default = $file;
			// Server code goes here (S3).
		}
	}
	return $default;
}

function truncate_number( $number = 0 , $decimals = 2 )
{
	$point_index = strrpos( $number , '.' );
	return substr( $number , 0 , $point_index + $decimals + 1 );
}

function version_control( $is_statics = FALSE , $v1 = VERSION_1 )
{
	$v2 = VERSION_2;
	if ( $is_statics )
	{
		echo "?v=$v1";
	}
	else
	{
		echo "?v=$v2";
	}
}
function get_list_heading($sort_field, $sort_order){
	$th =   array('game_name','size', 'entry_fee' ,'league_salary_cap_id' ,	'prize_pool' ,'season_scheduled_date' 	);


	$final_arry = array();
	
	foreach($th as  $val){
		
		$final_arry[$val] = array('sort'=>'ASC', 'icon'=>'<i class="icon-up" data-arrow="icon" id="'.$val.'"></i>');


		if($sort_field == $val){
			$final_arry[$val]['sort'] = $sort_order;
			if($sort_order == 'ASC'){
				$final_arry[$val]['icon'] = '<i class="icon-up" data-arrow="icon" id="'.$val.'"></i>';
			}
			else {
				$final_arry[$val]['icon'] = '<i class="icon-down" data-arrow="icon" id="'.$val.'"></i>';
			}
		}		
	}


	return $final_arry;
}

function prize_json()
{
    $json = '{  "Top 1":{"1":100},
    			"Top 2":{"1":60,"2":40},
    			"Top 3":{"1":50,"2":30,"3":20},
    			"Top 5":{"1":30,"2":25,"3":20,"4":15,"5":10},
    			"Top 10":{"1":19,"2":17,"3":15,"4":13,"5":11,"6":9,"7":7,"8":5,"9":3,"10":1},
    			"Top 30%":{"30":100},
    			"Top 50%":{"50":100}
    		 }
    	    ';
    return $json;
}


if (!function_exists('humanTiming')) {

    /**
     * Human Readble Time
     * @param type $time
     * @return type
     */
    function humanTiming($time) {
        $time = time() - strtotime($time); // to get the time since that moment
        $tokens = array(
            31536000 => 'year',
            2592000 => 'month',
            604800 => 'week',
            86400 => 'day',
            3600 => 'hour',
            60 => 'minute',
            1 => 'second'
        );
        foreach ($tokens as $unit => $text) {
            if ($time < $unit)
                continue;
            $numberOfUnits = floor($time / $unit);
            return $numberOfUnits . ' ' . $text . (($numberOfUnits > 1) ? 's' : '') . ' ago';
        }
    }

}
if (!function_exists('sprintf_message')) {

    function sprintf_message($str = '', $vars = array(), $start_char = '{{', $end_char = '}}') {
        if (!$str)
            return '';
        if (count($vars) > 0) {
            foreach ($vars as $k => $v) {
                $str = str_replace($start_char . $k . $end_char, $v, $str);
            }
        }

        return $str;
    }

}


if (!function_exists('creat_image_full_url')) {

    /**
     * Human Readble Time
     * @param type $time
     * @return type
     */
    function creat_image_full_url($param) {
    	if (is_array($param)) {
    		if( isset( $param['image'] ) )
    		{
    			$param['image'] = show_user_image( $param[ 'image' ] , TRUE );	
    		} 
    		else 
    		{    			
    			foreach ($param as $key => $user_profile) {
    				if(!empty($user_profile))
    				{
            			$param[$key]['image'] = show_user_image( $user_profile[ 'image' ] , TRUE );				
            		}
        		} 
    		}
    	   
        	return $param;
    	} 
    }

}



function format_num_callback($n){
    return floatval( str_replace(',', '', $n) );
};

if (!function_exists('country_from_ip')) {
	/*
	* Method to get user location details from ip address
	*/
	function country_from_ip()
	{
		$location_data['countryCode'] =track_geoip_base_location();
		return (!isset($location_data['countryCode'])  || $location_data['countryCode'] == "" || $location_data['countryCode'] != "AU") ? "USA" : 'AU';
	}
}

if (!function_exists('get_country_name_by_code')) {
	/*
	* Method to get user location details from ip address
	*/
	function get_country_name_by_code($user_country_code = "")
	{		
		if ($user_country_code) {			
			$sql = "SELECT country_name FROM vi_master_country WHERE abbr='".$user_country_code."'";
			$CI =& get_instance();	
			$query = $CI->db->query($sql);
			$row = $query->row_array();
			return $row['country_name'];
		}
	}
}
	function track_geoip_base_location()
	{
		if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) && $_SERVER['HTTP_X_FORWARDED_FOR'] )
		{
			$ip = $_SERVER[ 'HTTP_X_FORWARDED_FOR' ];
		}
		else
		{
			$ip = $_SERVER[ 'REMOTE_ADDR' ];
		}
		// $ip = '54.79.52.185';
		$CI =& get_instance();
		$CI->load->library( 'Geoipt' );
		$countryCode = $CI->geoipt->get_isocode( $ip );

		$response        = TRUE;
		$track_geoip_log = FALSE;
		$log = array(
						'ip' => $ip
					);

		if ( $countryCode === FALSE ) //Detail not found but we allowed this user and track this ip for log
		{
			$error = $CI->geoipt->get_exception_detail();
			$log = array_merge( $error , $log );
			$track_geoip_log = TRUE;
		}
		else
		{
			return $countryCode;		
		}

		
	}