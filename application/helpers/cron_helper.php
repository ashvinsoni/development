<?php


/**
 * xml2array() will convert the given XML text to an array in the XML structure.
 * Link: http://www.bin-co.com/php/scripts/xml2array/
 * Arguments : $contents - The XML text
 *                $get_attributes - 1 or 0. If this is 1 the function will get the attributes as well as the tag values - this results in a different array structure in the return value.
 *                $priority - Can be 'tag' or 'attribute'. This will change the way the resulting array sturcture. For 'tag', the tags are given more importance.
 * Return: The parsed XML in an array form. Use print_r() to see the resulting array structure.
 * Examples: $array =  xml2array(file_get_contents('feed.xml'));
 *              $array =  xml2array(file_get_contents('feed.xml', 1, 'attribute'));
 */
function xml2array($contents, $get_attributes = 1, $priority = 'attribute')
{
    if (!$contents) return array();

    if (!function_exists('xml_parser_create')) {
        //print "'xml_parser_create()' function not found!";
        return array();
    }

    //Get the XML parser of PHP - PHP must have this module for the parser to work
    $parser = xml_parser_create('');
    xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, "UTF-8"); # http://minutillo.com/steve/weblog/2004/6/17/php-xml-and-character-encodings-a-tale-of-sadness-rage-and-data-loss
    xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
    xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
    xml_parse_into_struct($parser, trim($contents), $xml_values);
    xml_parser_free($parser);

    if (!$xml_values) return; //Hmm...

    //Initializations
    $xml_array = array();
    $parents = array();
    $opened_tags = array();
    $arr = array();

    $current = & $xml_array; //Refference

    //Go through the tags.
    $repeated_tag_index = array(); //Multiple tags with same name will be turned into an array
    foreach ($xml_values as $data) {
        unset($attributes, $value); //Remove existing values, or there will be trouble

        //This command will extract these variables into the foreach scope
        // tag(string), type(string), level(int), attributes(array).
        extract($data); //We could use the array by itself, but this cooler.

        $result = array();
        $attributes_data = array();

        if (isset($value)) {
            if ($priority == 'tag') $result = $value;
            else $result['value'] = $value; //Put the value in a assoc array if we are in the 'Attribute' mode
        }

        //Set the attributes too.
        if (isset($attributes) and $get_attributes) {
            foreach ($attributes as $attr => $val) {
                if ($priority == 'tag') $attributes_data[$attr] = $val;
                else $result['attr'][$attr] = $val; //Set all the attributes in a array called 'attr'
            }
        }

        //See tag status and do the needed.
        if ($type == "open") { //The starting of the tag '<tag>'
            $parent[$level - 1] = & $current;
            if (!is_array($current) or (!in_array($tag, array_keys($current)))) { //Insert New tag
                $current[$tag] = $result;
                if ($attributes_data) $current[$tag . '_attr'] = $attributes_data;
                $repeated_tag_index[$tag . '_' . $level] = 1;

                $current = & $current[$tag];

            } else { //There was another element with the same tag name

                if (isset($current[$tag][0])) { //If there is a 0th element it is already an array
                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
                    $repeated_tag_index[$tag . '_' . $level]++;
                } else { //This section will make the value an array if multiple tags with the same name appear together
                    $current[$tag] = array($current[$tag], $result); //This will combine the existing item and the new item together to make an array
                    $repeated_tag_index[$tag . '_' . $level] = 2;

                    if (isset($current[$tag . '_attr'])) { //The attribute of the last(0th) tag must be moved as well
                        $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                        unset($current[$tag . '_attr']);
                    }

                }
                $last_item_index = $repeated_tag_index[$tag . '_' . $level] - 1;
                $current = & $current[$tag][$last_item_index];
            }

        } elseif ($type == "complete") { //Tags that ends in 1 line '<tag />'
            //See if the key is already taken.
            if (!isset($current[$tag])) { //New Key
                $current[$tag] = $result;
                $repeated_tag_index[$tag . '_' . $level] = 1;
                if ($priority == 'tag' and $attributes_data) $current[$tag . '_attr'] = $attributes_data;

            } else { //If taken, put all things inside a list(array)
                if (isset($current[$tag][0]) and is_array($current[$tag])) { //If it is already an array...

                    // ...push the new element into that array.
                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;

                    if ($priority == 'tag' and $get_attributes and $attributes_data) {
                        $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                    }
                    $repeated_tag_index[$tag . '_' . $level]++;

                } else { //If it is not an array...
                    $current[$tag] = array($current[$tag], $result); //...Make it an array using using the existing value and the new value
                    $repeated_tag_index[$tag . '_' . $level] = 1;
                    if ($priority == 'tag' and $get_attributes) {
                        if (isset($current[$tag . '_attr'])) { //The attribute of the last(0th) tag must be moved as well

                            $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                            unset($current[$tag . '_attr']);
                        }

                        if ($attributes_data) {
                            $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                        }
                    }
                    $repeated_tag_index[$tag . '_' . $level]++; //0 and 1 index is already taken
                }
            }

        } elseif ($type == 'close') { //End of tag '</tag>'
            $current = & $parent[$level - 1];
        }
    }

    return ($xml_array);
}

function replace_quotes($string)
{
	return preg_replace(array("/`/", "/'/", "/&acute;/"), "",$string);
}

define('PRIZE_WON_DESCRIPTION', 'Won prize for game - ');

/*This function for get api data through curl if file_get_contents have create some issue */

function get_api_data($url)
{
	$curl_handle=curl_init();
	curl_setopt($curl_handle,CURLOPT_URL,$url);
	curl_setopt($curl_handle,CURLOPT_CONNECTTIMEOUT,2);
	curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,1);
	$buffer = curl_exec($curl_handle);
	curl_close($curl_handle);
	if (empty($buffer)){
		return  "Nothing returned from url.<p>";
	}else{
		return  $buffer;
	}
}


//Time Interval for game closed

function game_interval($league_id)
{
    $interval = 10;
    if($league_id = 1) //FOR MLB
    {
        $interval = 20;
    }elseif ($league_id = 2) { //for NFL
      $interval = 20;
    }
    elseif ($league_id = 3) { //for NRL
      $interval = 8;
    }
    elseif ($league_id = 4) { //for EPL
      $interval = 20;
    }
    elseif ($league_id = 5) { //for EPL
      $interval = 8;
    }
    elseif ($league_id = 6) { //for EPL
      $interval = 8;
    }
    elseif ($league_id = 7) { //for EPL
      $interval = 8;
    }
    elseif ($league_id = 8) { //for EPL
      $interval = 8;
    }

    return $interval;
}

function get_team_abbr_epl_goalserve($team_name)
{
    $team_array = array('MUN'=>'Manchester United','MCI'=>'Manchester City' ,'WBA'=>'West Brom','WHU'=>'West Ham','AVL'=>'Aston Villa','STK'=>'Stoke City',);
    $abbr = array_search($team_name, $team_array);
    if($abbr) return $abbr; 
    $word_count = str_word_count($team_name);
    if ($word_count > 2) {
        $te = explode(' ', $team_name);
        $team_abbr = substr($te[0], 0, 1) . substr($te[1], 0, 1);
    } else {
        $te = explode(' ', $team_name);
        if (strlen($te[0]) == 2) {
            $team_abbr = substr($te[0], 0, 2) . substr($te[1], 0, 1);
        } else {
            $team_abbr = substr(strtok($te[0], " "), 0, 3);
        }
    }
    return strtoupper($team_abbr);
}

function get_team_abbr_nfl($team_name)
{
    $word_count = str_word_count($team_name);
    if ($word_count > 2) {
        $te = explode(' ', $team_name);
        $team_abbr = substr($te[0], 0, 1) . substr($te[1], 0, 1);
    } else {
        $te = explode(' ', $team_name);
        if (strlen($te[0]) == 2) {
            $team_abbr = substr($te[0], 0, 2) . substr($te[1], 0, 1);
        } else {
            $team_abbr = substr(strtok($te[0], " "), 0, 3);
        }
    }
    return strtoupper($team_abbr);
}

function get_team_abbr_nhl($team_name)
{
    $word_count = str_word_count($team_name);
    if ($word_count == 2) {
        $te = explode(' ', $team_name);
        $team_abbr = substr($te[0], 0, 1) . substr($te[1], 0, 1);
    } else {
        $te = explode(' ', $team_name);
        if (strlen($te[0]) == 2) {
            $team_abbr = substr($te[0], 0, 2) . substr($te[1], 0, 1);
        } else {
            $team_abbr = substr(strtok($te[0], " "), 0, 3);
        }
    }
    return strtoupper($team_abbr);
}
function get_team_abbr_nba($team_name)
{
    $team_array = array('PHX'=>'Phoenix Suns','POR'=>'Portland Trail Blazers','GS'=>'Golden State Warriors','UTAH'=>'Utah Jazz','SA'=>'San Antonio Spurs','NO'=>'New Orleans Pelicans','OKC'=>'Oklahoma City Thunder','NY'=>'New York Knicks','WSH'=>'Washington Wizards' ,'NJ'=>'Brooklyn Nets' );
    $abbr = array_search($team_name, $team_array);
    if($abbr) return $abbr; 
    $word_count = str_word_count($team_name);
    if ($word_count > 2) {
        $te = explode(' ', $team_name);
        if($word_count==2){
            $team_abbr = substr($te[0], 0, 1) . substr($te[1], 0, 1);
        }
        elseif ($word_count==3) {
            $team_abbr = substr($te[0], 0, 1) . substr($te[1], 0, 1). substr($te[2], 0, 1);
        }
    } else {
        $te = explode(' ', $team_name);
        if (strlen($te[0]) == 2) {
            $team_abbr = substr($te[0], 0, 2) . substr($te[1], 0, 1);
        } else {
            $team_abbr = substr(strtok($te[0], " "), 0, 3);
        }
    }
    return strtoupper($team_abbr);
}
function check_key_exist($str='',$array=array())
{
    if(isset($array[$str])){
        return $array[$str];
    }else{
        return array();
    }
}