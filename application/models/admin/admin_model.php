<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Admin_model extends MY_Model
{

	function __construct()
	{
		parent::__construct();
	}

	function get_all_sports()
	{
		$sql = 	$this->db->select('league_id`, league_desc')
	                    ->from(LEAGUE." AS L")
	                    ->join(MASTER_SPORTS." AS MS", "MS.sports_id = L.sports_id", 'INNER')
	                    ->where('L.active',ACTIVE)
	                    ->where('MS.active','1')
	                    ->order_by('L.league_id','ASC')
	                    ->get();
	    $config = $sql->result_array();  
   		return array_column ( $config , 'league_desc' , 'league_id' );
	}

	function get_all_duration()
	{
		$league_id = $this->input->post( 'league_id' );
		$sql = 	$this->db->select('MD.duration_desc, LD.league_duration_id, MD.duration_id')
	                    ->from(LEAGUE_DURATION." AS LD")
	                    ->join(MASTER_DURATION." AS MD", "MD.duration_id = LD.duration_id", 'INNER')
	                    ->where('LD.active',ACTIVE)
	                    ->where('LD.league_id',$league_id)
	                    ->get();
        $config = $sql->result_array();                        
   		return $config;
	}

	function get_all_salary_cap()
	{
		$league_id = $this->input->post( 'league_id' );
		$sql = 	$this->db->select('salary_cap, league_salary_cap_id')
	                    ->from(MASTER_SALARY_CAP." AS MSC")
	                    ->join(LEAGUE_SALARY_CAP." AS LSC", "LSC.salary_cap_id = MSC.salary_cap_id", 'INNER')
	                    ->where('LSC.admin_active',ACTIVE)
	                    ->where('LSC.league_id',$league_id)
	                    ->get();
	    $config = $sql->result_array();  
   		return array_column ( $config , 'salary_cap' , 'league_salary_cap_id' );
	}

	function get_all_available_week()
	{
		$this->table_name = SEASON_WEEK;
		$league_id = $this->input->post( 'league_id' );

		$this->load->model('api_credential_model');
		$api = $this->api_credential_model->active_feed_provide_season_year($league_id);
		//echo "<pre>";print_r($api);die;
		$season_type = $api['season'];
		$season_year = $api['year'];

		$sql = 	$this->db->select('season_week, season_week_start_date_time, season_week_end_date_time')
	                    ->from(SEASON_WEEK." AS SW")
	                    ->where('SW.league_id',$league_id)
	                    ->where('SW.season_week_start_date_time > ',format_date( 'today' , 'Y-m-d H:i:s' ) )
	                    ->where('SW.type',$season_type)
	                    ->order_by('SW.season_week','ASC')
	                    ->get();
	    $result = $sql->result_array();
		$final_result = array();
		foreach ( $result as $key => $value )
		{
			$season_week                 	= $value[ 'season_week' ];
			$season_week_start_date_time 	= $value[ 'season_week_start_date_time' ];
			$season_week_end_date_time   	= $value[ 'season_week_end_date_time' ];
			$final_result[ $season_week ] 	= $season_week.' ( '.date( 'd-M-y' , strtotime( $season_week_start_date_time ) ).' '.date( 'd-M-y' , strtotime( $season_week_end_date_time ) ).' )';
		}
		return $final_result;
	}

	function get_all_number_of_winner()
	{
		$league_id = $this->input->post( 'league_id' );
		$sql = 	$this->db->select('MNOW.number_of_winner_id,number_of_winner_desc,league_number_of_winner_id,position_or_percentage,places')
	                    ->from(MASTER_NUMBER_OF_WINNER." AS MNOW")
	                    ->join(LEAGUE_NUMBER_OF_WINNER." AS LNW", "LNW.number_of_winner_id = MNOW.number_of_winner_id", 'INNER')
	                    ->where('LNW.active',ACTIVE)
	                    ->where('LNW.league_id ', $league_id )
	                    ->where('MNOW.status','1')
	                    ->order_by('order','ASC')
	                    ->get();
	    $result = $sql->result_array();

		return array( 'all_number_of_winner' => array_column ( $result , 'number_of_winner_desc' , 'number_of_winner_id' ) , 'number_of_winner_validation' => $result );
	}

	function get_season_date()
	{
		$league_id = $this->input->post( 'league_id' );
		$this->load->model('api_credential_model');
		$api = $this->api_credential_model->active_feed_provide_season_year($league_id);
		//echo "<pre>";print_r($api);die;
		$season_type = $api['season'];
		$season_year = $api['year'];
		
		$sql = 	$this->db->select('scheduled_date')
	                    ->from(SEASON." AS S")
	                    ->where('S.league_id',$league_id)
	                    ->where('S.type',$season_type)
	                    ->where('S.year',$season_year)
	                    ->where('S.season_scheduled_date >',format_date())
	                   	->group_by('scheduled_date')
	                    ->order_by('scheduled_date','DESC')
	                    ->get();
	    $result = $sql->result_array();

		$season_time = array();

		foreach ( $result as $key => $value )
		{
			$seasone_date_time_format = $value[ 'scheduled_date' ];
			$timestamp                = strtotime( $seasone_date_time_format );
			// $season_time[] = format_date ( $timestamp , 'Y-m-d' );
			$season_time[] = $seasone_date_time_format;
		}

		return $season_time;
	}

	function get_available_game_of_the_day_or_week()
	{
		$result = array();

		if ( $this->input->post( 'duration_id' ) == 1 && $this->input->post( 'date' ) && $this->input->post( "buckets" ) ) //Daily
		{
			$date = $this->input->post( 'date' );
			$time = "`S` . `scheduled_date` = '$date'";

			if ( $this->input->post( "buckets" ) == '1' ) //All
			{
				$time = "`S` . `scheduled_date` = '$date'";
			}
			elseif ( $this->input->post( "buckets" ) == '2' ) //Early
			{
				$start_time = $date.' 00:00:00';
				$end_time = $date.' 13:59:59';
				$time = "( DATE_FORMAT( `S`.`season_scheduled_date` , '%Y-%m-%d %H:%i:%s' ) BETWEEN '$start_time' AND '$end_time' )";
			}
			elseif ( $this->input->post( "buckets" ) == '3' ) //Later
			{
				$start_time = $date.' 14:00:00';
				$end_time = $date.' 23:59:59';
				$time = "( DATE_FORMAT( `S`.`season_scheduled_date` , '%Y-%m-%d %H:%i:%s' ) BETWEEN '$start_time' AND '$end_time' )";
			}
			elseif ( $this->input->post( "buckets" ) == '4' ) //Night
			{
				$start_time = $date.' 19:00:00';
				$end_time = $date.' 23:59:59';
				$time = "( DATE_FORMAT( `S`.`season_scheduled_date` , '%Y-%m-%d %H:%i:%s' ) BETWEEN '$start_time' AND '$end_time' )";
			}

			$sql = "SELECT 
						`season_game_unique_id`,`home` , `away` , DATE_FORMAT( `S`.`season_scheduled_date` , '%l:%i %p' ) AS `season_scheduled_date`, DATE_FORMAT(`S`.`scheduled_date`, '%W') AS day_name 
					FROM 
						`".$this->db->dbprefix( SEASON )."` AS `S` 
					WHERE 
						$time 
					AND
						`league_id` = '".$this->input->post( 'league_id' )."' 
					AND 
						('".format_date()."'<`S`.`season_scheduled_date` || '".format_date()."'=`S`.`season_scheduled_date`)
					ORDER BY 
						`S`.`season_scheduled_date`
					ASC
					";

			$result = $this->run_query( $sql );
		}
		else if ( $this->input->post( 'duration_id' ) == 2 && $this->input->post( 'season_week_id' ) ) //Weekly
		{
			$week  = $this->input->post( 'season_week_id' );
			$sql = "SELECT 
						`season_game_unique_id`,`home` , `away` , DATE_FORMAT( `S`.`season_scheduled_date` , '%l:%i %p' ) AS `season_scheduled_date`,DATE_FORMAT(`S`.`scheduled_date`, '%W') AS day_name
					FROM 
						`".$this->db->dbprefix( SEASON )."` AS `S` 
					WHERE 
						`week` = $week 
					AND
						`league_id` = '".$this->input->post( 'league_id' )."' 
					AND 
						('".format_date()."'<`S`.`season_scheduled_date` || '".format_date()."'=`S`.`season_scheduled_date`)
					ORDER BY 
						`S`.`season_scheduled_date` 
					ASC
					";
			$result = $this->run_query( $sql );
		}
		else if ( $this->input->post( 'duration_id' ) == 3 && $this->input->post( 'season_week_id' ) ) //Custom Weekly
		{
			$week  = $this->input->post( 'season_week_id' );
			$sql = "SELECT 
						`season_game_unique_id`,`home` , `away` , DATE_FORMAT( `S`.`season_scheduled_date` , '%l:%i %p' ) AS `season_scheduled_date`,DATE_FORMAT(`S`.`scheduled_date`, '%W') AS day_name
					FROM 
						`".$this->db->dbprefix( SEASON )."` AS `S` 
					WHERE 
						`week` = $week 
					AND
						`league_id` = '".$this->input->post( 'league_id' )."' 
					AND 
						('".format_date()."'<`S`.`season_scheduled_date` || '".format_date()."'=`S`.`season_scheduled_date`)
					ORDER BY 
						`S`.`season_scheduled_date` 
					ASC
					";
			$result = $this->run_query( $sql );
		}

		return $result;
	}

	function get_all_master_data_entry()
	{
		$sql = 	$this->db->select('data_desc,admin_fixed,admin_lower_limit,admin_upper_limit')
	                ->from(MASTER_DATA_ENTRY." AS MDE")
	                ->get();
	    $result = $sql->result_array();
	    return $result;
	}

	function get_all_drafting_style()
	{
		$league_duration_id  	= $this->input->post( 'league_duration_id' );
		$sql = 	$this->db->select('league_drafting_styles_id, drafting_styles_desc')
	                    ->from(MASTER_DRAFTING_STYLES." AS MDS")
	                    ->join(LEAGUE_DRAFTING_STYLES." AS LDS", "LDS.drafting_styles_id = MDS.drafting_styles_id", 'INNER')
	                    ->where('league_duration_id',$league_duration_id)
	                    ->where('active',ACTIVE)
	                    ->where('LDS.drafting_styles_id !=','4')
	                    ->get();
	    $result = $sql->result_array();
		return array_column ( $result , 'drafting_styles_desc' , 'league_drafting_styles_id' );
	}

	function get_all_games( $config = array() )
	{
		$offset = 0;
		$limit = 10;		  
		if(isset($config['start'])&&$config['start']=='-') $config['start'] = 0;
		if(isset($config['limit'])&&$config['limit']=='-') $limit = 10;		
		$league_condition = (isset($config['league_id'])&&$config['league_id']!='-'&&$config['league_id']!='') ? " `G`.`league_id` = ".$config['league_id']." AND " : ""; 

		switch ($config['list_for']) {
			case 'current_game':				
				$game_type_condition = " `G`.`is_cancel` = '0' AND `G`.`prize_distributed` = '0' "; 
				break;
			case 'completed_game':				
				$game_type_condition = " `G`.`prize_distributed` = '1' "; 
				break;
			case 'cancelled_game':				
				$game_type_condition = " `G`.`is_cancel` = '1' "; 
				break;			
			default:				
				break;
		}
				
		$limit_condition = ($config['is_total'] === FALSE) ? "limit  ".$config['start'].", ".$config['limit']."" : "";
		

		$sql = "SELECT 
				`G`.`game_id`, `G`.`is_feature`, `G`.`game_unique_id`, `G`.`game_name`, `L`.`league_desc`, `MD`.`duration_desc`, `G`.`size`, `G`.`entry_fee`,
			 	`G`.`serial_no`, COUNT(LM.lineup_master_id) AS participant_joined 
			 FROM 
			 	(`vi_game` AS G) 
			 INNER JOIN 
			 	`vi_league` AS L ON `L`.`league_id` = `G`.`league_id` 
			 INNER JOIN 
			 	`vi_league_duration` AS LD ON `LD`.`league_duration_id` = `G`.`league_duration_id` 
			 INNER JOIN 
			 	`vi_master_duration` AS MD ON `MD`.`duration_id` = `LD`.`duration_id` 
			 LEFT JOIN 
			 	`vi_lineup_master` AS LM ON `LM`.`game_unique_id` = `G`.`game_unique_id` 
			 WHERE 
			 	".$league_condition." 
			 	".$game_type_condition."
			 GROUP BY 
			 	`G`.`game_unique_id` 
			 ORDER BY 
			 	".$config [ "sort_field" ]." ".$config["sort_order"]." ".$limit_condition." ";


		/*$sql_current = 	$this->db->select('G.game_id,G.is_feature,G.game_unique_id,G.game_name,L.league_desc,MD.duration_desc,G.size,G.entry_fee,G.serial_no,COUNT(LM.lineup_master_id) AS participant_joined')
                    ->from(GAME." AS G")
                    ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
                    ->join(LEAGUE_DURATION." AS LD", 'LD.league_duration_id = G.league_duration_id','INNER')
                    ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
                    ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
                 	->where('G.league_id',$config['league_id'])
                	->where('G.is_cancel','0')
                    ->where('G.prize_distributed','0')
                    ->group_by('G.game_unique_id','DESC')
                    ->order_by($config [ "sort_field" ],$config["sort_order"])
                    ->limit($config["limit"],$config["start"])
                    ->get();*/		    	
		$query=$this->db->query($sql);	
		if ($config['is_total'] === TRUE) 
		{			
			return $query->num_rows();
		}
		else
		{			
 			return $query->result_array();
		}
		
	}

	/*Function to get count of Current Game*/
	/*function get_count_of_all_games( $config = array() )
	{
		if(!empty($config['league_id']))
		{
			$query_total = $this->db->select('G.game_id')
	                                ->from(GAME." AS G")
	                                ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
	                                ->join(LEAGUE_DURATION." AS LD", 'LD.league_duration_id = G.league_duration_id','INNER')
	                                ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
	                                ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
	                                ->where('G.league_id',$config['league_id'])
	                                ->where('G.is_cancel','0')
	                                ->where('G.prize_distributed','0')
	                                ->group_by('G.game_unique_id','DESC')
	                                ->get();
			return $query_total->num_rows();
		}
		else
		{
			$query_total = $this->db->select('G.game_id')
	                                ->from(GAME." AS G")
	                                ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
	                                ->join(LEAGUE_DURATION." AS LD", 'LD.league_duration_id = G.league_duration_id','INNER')
	                                ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
	                                ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
	                                ->where('G.league_id','3')
	                                ->where('G.is_cancel','0')
	                                ->where('G.prize_distributed','0')
	                                ->group_by('G.game_unique_id','DESC')
	                                ->get();
			return $query_total->num_rows();
		}
	}*/


	/*function get_all_games_cancelled( $config = array() )
	{
		$offset = 0;
		$limit = 10;
		
		if(isset($config['start'])&&$config['start']!='-') $offset = $config['start'];
		if(isset($config['limit'])&&$config['limit']!='-') $limit = $limit+$offset;
		if(isset($config['league_id'])&&$config['league_id']!='') {$config['league_id'] = $config['league_id'];}else{$config['league_id'] = '3';}
		$sql_current = 	$this->db->select('G.game_id,G.game_unique_id,G.game_name,G.is_feature,L.league_desc,MD.duration_desc,G.size,G.entry_fee,G.serial_no,COUNT(LM.lineup_master_id) AS participant_joined')
	                    ->from(GAME." AS G")
	                    ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
	                    ->join(LEAGUE_DURATION." AS LD", 'LD.league_duration_id = G.league_duration_id','INNER')
	                    ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
	                    ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
	                    ->where('G.league_id',$config['league_id'])
	                    ->where('G.is_cancel','1')
	                    ->group_by('G.game_unique_id','DESC')
	                    ->order_by($config [ "sort_field" ],$config["sort_order"])
	                    ->limit($config["limit"],$config["start"])
	                    ->get();
        $config= $sql_current->result_array();                        
   		return $config;
		
	}*/

	/*Function to get count of Cancelled Game*/
	/*function get_count_of_all_cancelled_games( $config = array() )
	{
		if(!empty($config['league_id']))
		{
			$query_total = $this->db->select('G.game_id,G.game_unique_id,G.game_name,L.league_desc,MD.duration_desc,G.size,G.entry_fee,G.serial_no')
	                                ->from(GAME." AS G")
	                                ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
	                                ->join(LEAGUE_DURATION." AS LD", 'LD.league_duration_id = G.league_duration_id','INNER')
	                                ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
	                                ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
	                                ->where('G.league_id',$config['league_id'])
	                                ->where('G.is_cancel','1')
	                                ->group_by('G.game_unique_id','DESC')
	                               	->get();
	                               	// $this->db->count_all_results();
	       	return $query_total->num_rows();
		}
		else
		{
			$query_total = 	$this->db->select('G.game_id')
	                    ->from(GAME." AS G")
	                    ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
	                    ->join(LEAGUE_DURATION." AS LD", 'LD.league_duration_id = G.league_duration_id','INNER')
	                    ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
	                    ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
	                    ->where('G.league_id','3')
	                    ->where('G.is_cancel','1')
	                    ->group_by('G.game_unique_id','DESC')
	                    ->get();
	                         	
        	return $query_total->num_rows();
		}
		
	}*/

	/*function get_all_games_completed( $config = array() )
	{
		$offset = 0;
		$limit = 10;
		if(isset($config['start'])&&$config['start']!='-') $offset = $config['start'];
		if(isset($config['limit'])&&$config['limit']!='-') $limit = $limit+$offset;
		if(isset($config['league_id'])&&$config['league_id']!='') {$config['league_id'] = $config['league_id'];}else{$config['league_id'] = '3';}
		$sql_current = 	$this->db->select('G.game_id,G.game_unique_id,G.game_name,G.is_feature,L.league_desc,MD.duration_desc,G.size,G.entry_fee,G.serial_no,COUNT(LM.lineup_master_id) AS participant_joined')
	                    ->from(GAME." AS G")
	                    ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
	                    ->join(LEAGUE_DURATION." AS LD", 'LD.league_duration_id = G.league_duration_id','INNER')
	                    ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
	                    ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
	                    ->where('G.league_id',$config['league_id'])
	                    ->where('G.prize_distributed','1')
	                    ->group_by('G.game_unique_id','DESC')
	                    ->order_by($config [ "sort_field" ],$config["sort_order"])
	                    ->limit($config["limit"],$config["start"])
	                    ->get();
        $config = $sql_current->result_array();                        
   		return $config;
	}*/

	/*Function to get count of Completed Game*/
	/*function get_count_of_all_completed_games( $config = array() )
	{
		if(!empty($config['league_id']))
		{
			$query_total = $this->db->select('G.game_id')
	                                ->from(GAME." AS G")
	                                ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
	                                ->join(LEAGUE_DURATION." AS LD", 'LD.league_duration_id = G.league_duration_id','INNER')
	                                ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
	                                ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
	                                ->where('G.league_id',$config['league_id'])
	                                ->where('G.prize_distributed','1')
	                                ->group_by('G.game_unique_id','DESC')
	                                ->get();
			return $query_total->num_rows();
		}
		else
		{
			$query_total = $this->db->select('G.game_id')
	                                ->from(GAME." AS G")
	                                ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
	                                ->join(LEAGUE_DURATION." AS LD", 'LD.league_duration_id = G.league_duration_id','INNER')
	                                ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
	                                ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
	                                ->where('G.league_id','3')
	                                ->where('G.prize_distributed','1')
	                                ->group_by('G.game_unique_id','DESC')
	                                ->get();
			return $query_total->num_rows();

		}
	}*/



	

	function get_all_roster( $config = array(), $is_total = false )
	{
		$this->table_name = PLAYER;
        $this->db->select('P.player_unique_id,team_name,team_market,injury_status,full_name,first_name,last_name,position,
        				IFNULL(salary,0) as salary,IFNULL(active,0) as active,IFNULL(weightage,0) as weightage,first_salary,
        				IFNULL(previous_salary,0) as previous_salary', false)
            ->from("player P")
            ->join("player_temp PT", 'PT.player_unique_id=P.player_unique_id', 'left');           

        if ($config['filter_name'] != '') 
        {

            $this->db->like('P.full_name', $config['filter_name'], 'both');
        }
        if ($config['filterposition'] != '') 
        {

            $this->db->where('P.position', $config['filterposition']);
        }
		
		if ($config['team_abbreviation'] != '') 
		{

            $this->db->where('team_abbreviation', $config['team_abbreviation']);
        }

        if ($config['league_id'] != '') 
        {
            $this->db->where('P.league_id', $config['league_id']);
        }

        if ($config['limit'] == 'null') 
        {
            $config['limit'] = 10;
        }

        if ($is_total === FALSE) 
        {
        	$this->db->limit($config['limit'], $config['start']);
        }

        if ($config['fieldname']!='' && $config['order']!='') 
        {
            $this->db->order_by("P.".$config['fieldname'], $config['order']);
        }
        else
        {
            $this->db->order_by("P.full_name", 'asc');
        }

        if ($is_total === FALSE) 
        {
        	return $this->db->get()->result_array();
        }
        else
        {
        	return $this->db->get()->num_rows();
        }
	}

	function get_all_position( $league_id = '' )
	{
		$this->table_name = PLAYER;
		if ( $league_id  == '' )
		{
			$league_id = $this->input->post( 'league_id' );
		}

		$config[ 'where' ]      = array( 'league_id' => $league_id, 'position !='=> '' );
		$config[ 'fields' ]     = 'position';
		$config[ 'group_by' ]   = 'position';
		$config[ 'sort_field' ] = 'position';
		$config[ 'sort_order' ] = 'ASC';
		return array_column ( $this->get( $config ) , 'position' , 'position' );
	}

	function get_all_team( $league_id = '' )
	{
		$this->table_name = PLAYER;
		if ( $league_id  == '' )
		{
			$league_id = $this->input->post( 'league_id' );
		}

		$config[ 'where' ]      = array( 'league_id' => $league_id );
		$config[ 'fields' ]     = 'team_abbreviation,team_name,team_market';
		$config[ 'group_by' ]   = 'team_name';
		$config[ 'sort_field' ] = 'team_name';
		$config[ 'sort_order' ] = 'ASC';
		return $this->get( $config );
	}
	
	function release_player()
	{
	    $this->table_name = PLAYER_TEMP;
	    // player_salary_master_id,player_unique_id,salary
	 
	    $configs['fields'] = PLAYER_TEMP.'.player_unique_id,salary,weightage';
	    $configs['join']   = array(PLAYER=>PLAYER.'.player_unique_id ='.PLAYER_TEMP.'.player_unique_id');
	    $configs['where']  = array('active' => ACTIVE ,'league_id'=>$this->input->post( 'league_id' ));
	 
	    $player_temp_data = $this->get( $configs );
	 
	    if ( !empty( $player_temp_data ) )
	    {
	        $this->table_name = PLAYER_SALARY_MASTER;
	 
	        $config[ 'league_id' ]  = $this->input->post( 'league_id' );
	        $config[ 'date_added' ] = format_date();
	        $config[ 'updated_by' ] = $this->admin_id;
	 
	        $player_salary_master_id = $this->insert( $config );
	 
	        foreach ( $player_temp_data as $key => $temp )
	        {
	            $player_temp_data[ $key ][ 'player_salary_master_id' ] = $player_salary_master_id;
	        }
	 
	        $this->table_name = PLAYER_SALARY_TRANSACTION;
	 
	        return $this->insert_batch( $player_temp_data );
	    }
	    else
	    {
	        return FALSE;
	    }
	}

	function get_all_state()
	{
		$sql = 	$this->db->select('id,name')
	                    ->from(MASTER_STATE." AS MS")
	                    ->get();
	    $result = $sql->result_array();
		return array_column ( $result  , 'name' , 'id' );


	}

	function get_all_sales_person($where)
	{
		$this->table_name = PROMO_SALES_PERSON;
		$config[ 'fields' ]     = 'sales_person_id,first_name,last_name,email,dob,date_added,sales_person_unique_id,status';
		$config[ 'where'  ]     = $where;
		$config[ 'sort_field' ] = 'first_name';
		$config[ 'sort_order' ] = 'ASC';
		return $this->get( $config );
	}

	function get_all_user_sales_person()
	{
		$sql = 	$this->db->select('user_id,first_name,last_name,email')
	                    ->from(USER." AS U")
	                    ->where('varified_email','1')
	                    ->order_by('first_name','ASC')
	                    ->get();
	   
	    $result = $sql->result_array();
	    return $result;
	}

	function get_all_promo_code()
	{
		$sql=	"SELECT 
 					PC.*,
 				CASE 
  					WHEN PC.type = 1 THEN CONCAT(U.first_name,' ',U.last_name)
  					WHEN PC.type = 0 THEN CONCAT(PSP.first_name,' ',PSP.last_name)
 					END AS sales_person_name,
 				CASE 
  					WHEN PC.type = 1 THEN U.email
 					WHEN PC.type = 0 THEN PSP.email
 					END AS sales_person_email,
 				CASE
 					WHEN PC.type=0 THEN 'Sales Person'
 					WHEN PC.type=1 THEN 'User'  
 					END AS type 	
				FROM 
 					".$this->db->dbprefix( PROMO_CODE )." AS PC
 				LEFT JOIN 
 					".$this->db->dbprefix( PROMO_SALES_PERSON )." AS PSP ON PSP.sales_person_id = PC.sales_person_id AND PC.type = 0
				LEFT JOIN 
 					".$this->db->dbprefix( USER )." AS U ON U.user_id = PC.sales_person_id AND PC.type = 1";
 		$query=$this->db->query($sql);	
 		return $query->result_array();
	}

	function get_promo_code_earning($where)
	{
		if( !empty( $where ) )
		{
			$search= "	AND	DATE_FORMAT( G.season_scheduled_date , '%Y' ) = '".$where[ 'year' ]."' 
						AND DATE_FORMAT( G.season_scheduled_date , '%m' ) = '".$where[ 'month' ]."'";
		}
		else
		{
			$search="";
		}

		$sql=	"SELECT 
					PCE.promo_code_earning_id,PCE.is_processed,DATE_FORMAT(PCE.date,'%M,%Y') as date,SUM( PCE.amount_received ) AS amount_received,PC.promo_code,PC.sales_person_commission,
					TRUNCATE((sum(PC.sales_person_commission)*PCE.amount_received)/100,2) as commission_payout,PC.promo_code_id,
				CASE
					WHEN PC.type=1	then  CONCAT(U.first_name,' ',U.last_name)
					WHEN PC.type = 0 THEN CONCAT(PSP.first_name,' ',PSP.last_name)
					END AS sales_person_name,
				CASE	
					WHEN PC.type = 1 THEN U.email
 					WHEN PC.type = 0 THEN PSP.email
 					END AS sales_person_email,
 				CASE
 					WHEN PC.type=0 THEN 'Sales Person'
 					WHEN PC.type=1 THEN 'User'  
 					END AS type 	
				FROM
					".$this->db->dbprefix( PROMO_CODE_EARNING )." AS PCE
				INNER JOIN
					".$this->db->dbprefix( PROMO_CODE )." AS PC ON PCE.promo_code_id=PC.promo_code_id
				INNER JOIN 
					".$this->db->dbprefix( GAME )." AS G ON G.game_unique_id = PCE.game_unique_id
				LEFT JOIN 
 					".$this->db->dbprefix( PROMO_SALES_PERSON )." AS PSP ON PSP.sales_person_id = PC.sales_person_id AND PC.type = 0
				LEFT JOIN 
 					".$this->db->dbprefix( USER )." AS U ON U.user_id = PC.sales_person_id AND PC.type = 1
 				WHERE
					1 = 1
				AND	
					G.is_cancel = '0'
				".$search."
				GROUP BY 
					  PCE.promo_code_id  
				ORDER BY 
					PCE.date	
 				";	
		$query=$this->db->query($sql);	
 		return $query->result_array();
	}

	function update_commission_status( $promo_code_id , $is_processed , $m , $y )
	{
		$sql = "UPDATE
					".$this->db->dbprefix( PROMO_CODE_EARNING )."
				SET
					`is_processed` = '$is_processed'
				WHERE
					`promo_code_id` = $promo_code_id
				AND
					DATE_FORMAT( `date` , '%m' ) = '$m'
				AND
					DATE_FORMAT( `date` , '%Y' ) = '$y'
				";

		return $this->db->query( $sql );

	}

	function get_all_news()
	{
 		$sql = 	$this->db->select("N.news_id,N.title,N.status,N.create_date,N.description")
				->select("DATE_FORMAT ( create_date , ('%d-%M-%Y') ) AS create_date")
				->from(NEWS.' AS N')
				->order_by('N.create_date','DESC')
				->get();
		$result = $sql->result_array();
		return $result;
	}

	function get_all_user_detail($is_csv = FALSE, $limit = 10, $offset = 0, $fieldname = '', $order = '' )
	{
		$name = $this->input->post('filter_name');
		$field = " CONCAT_WS( ' ' ,UPPER(`U`.`first_name`) , `U`.`last_name` ) AS `name` , CONCAT_WS( ' ',LOWER(`U`.`first_name`),LOWER(`U`.`last_name`)  ) AS `nameOrder` ,`U`.`country`,`U`.`balance` AS `Balance` , `U`.`email` AS `Email` , `U`.`status` AS `Status` , DATE_FORMAT( `U`.`created_date` ,'%d-%M-%Y' ) AS `Joined` , `U`.`is_banned` AS `Banned Status`, `U`.`user_name` ";
		if ( ! $is_csv )
		{
			$field = " `U`.`user_id` , CONCAT_WS( ' ' , `U`.`first_name` , `U`.`last_name` ) AS `name` ,CONCAT_WS( ' ',LOWER(`U`.`first_name`),LOWER(`U`.`last_name`)  ) AS `nameOrder` ,`U`.`country`, `U`.`balance` , `U`.`email` , `U`.`status` , DATE_FORMAT( `U`.`created_date` ,'%d-%M-%Y' ) AS `created_date` , `U`.`is_banned`, `U`.`user_name`  ";
		}

		$sql = "SELECT 
					$field 
				FROM 
					`".$this->db->dbprefix( USER )."` AS `U` 				
				";

		if( ! $is_csv )
		{
			if ($name != '') {
	            $sql .= " where `user_name` like '%" . $name . "%'";
	        }

			if ($fieldname != '' && $order != '') {
	            $sql .= "   ORDER BY 
						$fieldname 
					$order LIMIT $limit OFFSET $offset 
					";
	        } else {
	            $sql .= "   ORDER BY 
						`user_name` 
					ASC LIMIT $limit OFFSET $offset 
					";
	        }        
			return $this->run_query( $sql );
		}
		else
		{
			$this->load->dbutil();
			$this->load->helper( 'download' );
			$query     = $this->db->query( $sql );
			$data      = $this->dbutil->csv_from_result( $query );
			$data      = "Created on ".format_date( 'today' , 'Y-m-d' )."\n\n".html_entity_decode( $data );
			$name      = 'User-Detail-'.format_date( 'today' , 'Y-m-d' ).'.csv';
			force_download( $name , $data );
			return TRUE;
		}
	}

	public function get_all_user_total($fieldname = '', $order = '') {
       	$name = $this->input->post('filter_name');
		$sql = "SELECT 
					COUNT(U.user_id) as total_user
				FROM 
					".$this->db->dbprefix( USER )." AS U 				
				";
		if ($name != '') {
            $sql .= " where `user_name` like '%" . $name . "%'";
        }
					
		$cnt_data = $this->run_query( $sql,"row_array" );		
		return $cnt_data['total_user'];
    }

	function update_user_status()
	{
		$this->db->where_in( 'user_id' , $this->input->post( 'ui' ) );
		if ( $this->input->post( 'status' ) == '2' )
		{
			$this->db->update( USER , array( 'varified_email' => '1' ) );
		}
		else
		{
			$this->db->update( USER , array( 'is_banned' => $this->input->post( 'status' ) ) );
		}
		return $this->db->affected_rows();
	}

	function get_all_youtube_url()
	{
 		$sql = 	$this->db->select("Y.youtube_id,Y.youtube_url,Y.created_date,Y.status")
				->select("DATE_FORMAT ( created_date , ('%d-%M-%Y') ) AS created_date")
				->from(YOUTUBE.' AS Y')
				->order_by('Y.created_date','DESC')
				->get();
		$result = $sql->result_array();
		return $result;

	}

	function get_all_user_report( $is_csv = TRUE )
	{
		$from_date = $this->input->post( 'from_date' );
		$to_date   = $this->input->post( 'to_date' );

		$sql = "SELECT
					CONCAT( `U`.`first_name` , ' ' , `U`.`last_name` ) AS `name` ,
					`U`.`user_name`,U.country, `U`.`email` , DATE_FORMAT ( `U`.`dob` , '%Y-%m-%d' ) AS `dob` , `MS`.`name` AS `state_name` , `U`.`balance`, 
					( SELECT SUM( `transaction_amount` ) FROM `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."` WHERE `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."`.`user_id` = `U`.`user_id` AND `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."`.`description` = 'DEPOSIT' AND  DATE_FORMAT( `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."`.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'  ) AS `deposite_by_user` ,
					( SELECT SUM( `transaction_amount` ) FROM `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."` WHERE `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."`.`user_id` = `U`.`user_id` AND `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."`.`description` = 'WITHDRAW' AND  DATE_FORMAT( `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."`.`date_added` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'  ) AS `withdraw_by_user` ,
					
					( SELECT COUNT( LM.`game_unique_id` ) FROM ".$this->db->dbprefix( LINEUP_MASTER )." AS LM 
						INNER JOIN `".$this->db->dbprefix( GAME )."` AS G ON G.game_unique_id = LM.game_unique_id
						WHERE G.is_cancel = '0' AND U.user_id = LM.user_id 
					) 
						AS `matches_played`, 
					
					( SELECT COUNT( LM.`lineup_master_id` ) 
							FROM ".$this->db->dbprefix( LINEUP_MASTER )." AS LM 
							INNER JOIN `".$this->db->dbprefix( GAME )."` AS G ON G.game_unique_id = LM.game_unique_id 
							WHERE G.is_cancel = '0' 
								AND LM.is_winner = '1' AND U.user_id = LM.user_id
								AND  DATE_FORMAT( PHT.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
								
					) AS `matches_won`,
					( SELECT COUNT( LM.`lineup_master_id` ) 
							FROM ".$this->db->dbprefix( LINEUP_MASTER )." AS LM 
							INNER JOIN `".$this->db->dbprefix( GAME )."` AS G ON G.game_unique_id = LM.game_unique_id 
							WHERE G.is_cancel = '0' 
								AND LM.is_winner = '0' AND U.user_id = LM.user_id
								AND  DATE_FORMAT( PHT.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
						)  AS `matches_lost`, 
					( SELECT SUM( `transaction_amount` ) 
						FROM `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."` AS PHT 
						INNER JOIN ".$this->db->dbprefix( LINEUP_MASTER )." AS LM ON LM.game_unique_id = PHT.game_unique_id 
						WHERE  LM.is_winner = '1' 
						AND U.user_id = LM.user_id 
						AND
							U.user_id = PHT.user_id 
						AND PHT.payment_type = 2 
				AND  DATE_FORMAT( PHT.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
						) AS `prize_amount_won` , 
					( SELECT SUM( `transaction_amount` ) 
						FROM `".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."` AS PHT 
						INNER JOIN ".$this->db->dbprefix( LINEUP_MASTER )." AS LM ON LM.game_unique_id = PHT.game_unique_id 
						WHERE  LM.is_winner = '0' 
						AND U.user_id = LM.user_id 
						AND
							U.user_id = PHT.user_id 
						AND PHT.payment_type = 1 
				AND  DATE_FORMAT( PHT.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
						) AS `prize_amount_lost`
				FROM 
					`".$this->db->dbprefix( USER )."` AS `U` 
				LEFT JOIN 
					`".$this->db->dbprefix( MASTER_STATE )."` AS `MS` ON `MS`.`id` = `U`.`state_id` 
				INNER JOIN 
					`".$this->db->dbprefix( PAYMENT_HISTORY_TRANSACTION )."` AS `PHT` ON `PHT`.`user_id` = `U`.`user_id` 
				WHERE 
					DATE_FORMAT( `PHT`.`date_added` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date' 
				GROUP BY 
					`U`.`user_id` 
					HAVING 
					( `deposite_by_user` != '' OR `withdraw_by_user` != '' )
 				";
 				//echo $sql;die;

		if( ! $is_csv )
		{
			return $this->run_query( $sql );

		}
		else
		{
			$this->load->dbutil();
			$this->load->helper( 'download' );
			$query     = $this->db->query( $sql );
			$data      = $this->dbutil->csv_from_result( $query );
			$data      = "Created on ".format_date( 'today' , 'Y-m-d' )."\n\n"."From Date $from_date\nTo Date $to_date\n\n".html_entity_decode( $data );
			$name      = 'UserWiseReport-'.format_date( 'today' , 'Y-m-d' ).'.csv';
			force_download( $name , $data );
			return TRUE;
		}
	}

	function get_all_contest_report( $is_csv = TRUE )
	{
		$from_date = $this->input->post( 'from_date' );
		$to_date   = $this->input->post( 'to_date' );

		$sql = "SELECT 
					CONCAT( `U`.`first_name` , ' ' , `U`.`last_name` ) AS `name` 
					,U.user_name,U.country,`G`.`game_unique_id` , `G`.`size` ,
					 `G`.`entry_fee` ,`G`.`serial_no` , `L`.`league_desc` ,
					  IF(`MSC`.`salary_cap`=0,'OMO',`MSC`.`salary_cap`) AS salary_cap , `MNOW`.`number_of_winner_desc` AS `prize_type` ,
					CASE
						WHEN `G`.`is_cancel` = '1' THEN 'Cancelled'
						WHEN `G`.`prize_distributed` = '1' THEN 'Completed'
						ELSE 'In Progress' 
						END AS `game_status` ,
					CASE
						WHEN `LM`.`is_winner` = '0' THEN 'No'
						WHEN `LM`.`is_winner` = '1' THEN 'Yes'
						END AS `won` ,
						`PC`.`promo_code` , `PCE`.`amount_received` , ( `G`.`entry_fee` - `PCE`.`amount_received` ) AS `promo_code_benefit`
					FROM
						`".$this->db->dbprefix( USER )."` AS `U`
					INNER JOIN
						`".$this->db->dbprefix( LINEUP_MASTER )."` AS `LM` ON `LM`.`user_id` = `U`.`user_id`
					INNER JOIN
						`".$this->db->dbprefix( GAME )."` AS `G` On `G`.`game_unique_id` = `LM`.`game_unique_id`
					LEFT JOIN
						`".$this->db->dbprefix( PROMO_CODE_EARNING )."` AS `PCE` ON `PCE`.`game_unique_id` = `G`.`game_unique_id` AND `PCE`.`user_id` = `U`.`user_id`
					LEFT JOIN
						`".$this->db->dbprefix( LEAGUE_SALARY_CAP )."` AS `LSC` ON 	`LSC`.`league_salary_cap_id` = `G`.`league_salary_cap_id`
					LEFT JOIN
						`".$this->db->dbprefix( MASTER_SALARY_CAP )."` AS `MSC` ON 	`MSC`.`salary_cap_id` = `LSC`.`salary_cap_id`
					LEFT JOIN
						`".$this->db->dbprefix( LEAGUE )."` AS `L` ON `L`.`league_id` = `G`.`league_id`
					LEFT JOIN
						`".$this->db->dbprefix( PROMO_CODE )."` AS `PC` ON `PC`.`promo_code_id` = `PCE`.`promo_code_id` 
					LEFT JOIN
						`".$this->db->dbprefix( LEAGUE_NUMBER_OF_WINNER )."` AS `LNOW` ON `LNOW`.`league_number_of_winner_id` = `G`.`league_number_of_winner_id` 
					LEFT JOIN
						`".$this->db->dbprefix( MASTER_NUMBER_OF_WINNER )."` AS `MNOW` ON `MNOW`.`number_of_winner_id` = `LNOW`.`number_of_winner_id`
					WHERE
						DATE_FORMAT( `G`.`season_scheduled_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
				";
		//echo $sql;die;		
 		if( ! $is_csv )
 		{
 			return $this->run_query( $sql );
 		}
 		else
 		{
 			$this->load->dbutil();
 			$this->load->helper( 'download' );
			$query     = $this->db->query( $sql );
			$data      = $this->dbutil->csv_from_result( $query );
			$data      = "Created on ".format_date( 'today' , 'Y-m-d' )."\n\n"."From Date $from_date\nTo Date $to_date\n\n".html_entity_decode( $data );
			$name      = 'ContestReport-'.format_date( 'today' , 'Y-m-d' ).'.csv';
 			force_download( $name , $data );
 			return TRUE;
 		}
	}

	function get_all_games_report( $is_csv = TRUE )
	{
		$from_date = $this->input->post( 'from_date' );
		$to_date   = $this->input->post( 'to_date' );

		$sql = "SELECT 
					CASE
						WHEN `G`.`user_id` = '0' THEN 'Admin'
						WHEN `G`.`user_id` != '0' THEN 'User'
						END AS `game_created_by` ,
					(
						SELECT 
							COUNT( `game_id` )
						FROM
							`".$this->db->dbprefix( GAME )."` AS G1
						WHERE 
							DATE_FORMAT( `G1`.`created_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND 'to_date'
						AND 
							CASE
								WHEN `game_created_by` = 'Admin' THEN `G1`.`user_id` = '0'
								WHEN `game_created_by` = 'User' THEN `G1`.`user_id` != '0'
							END
					) AS `total_game_created` ,
					(
						SELECT 
							COUNT( `game_id` )
						FROM
							`".$this->db->dbprefix( GAME )."` AS G2
						WHERE 
							DATE_FORMAT( `G2`.`created_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
						AND 
							CASE
								WHEN `game_created_by` = 'Admin' THEN `G2`.`prize_distributed` = '1' AND `G2`.`user_id` = '0'
								WHEN `game_created_by` = 'User' THEN `G2`.`prize_distributed` = '1' AND `G2`.`user_id`  != '0'
							END
	
					) AS `total_game_completed` ,
					(
						SELECT 
							COUNT( `game_id` )
						FROM
							`".$this->db->dbprefix( GAME )."` AS G3 
						WHERE 
							DATE_FORMAT( `G3`.`created_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
						AND 
							CASE
								WHEN `game_created_by` = 'Admin' THEN `G3`.`is_cancel` = '1' AND `G3`.`user_id` = '0'
								WHEN `game_created_by` = 'User' THEN `G3`.`is_cancel` = '1' AND `G3`.`user_id`  != '0'
							END
					) AS `total_game_cancelled` ,
					(
						SELECT 
							COUNT( `game_id` )
						FROM
							`".$this->db->dbprefix( GAME )."` AS G4 
						WHERE 
							DATE_FORMAT( `G4`.`created_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
						AND 
							CASE
								WHEN `game_created_by` = 'Admin' THEN `G4`.`is_cancel` = '0' AND `G4`.`prize_distributed` = '0' AND `G4`.`user_id` = '0'
								WHEN `game_created_by` = 'User' THEN `G4`.`is_cancel` = '0' AND `G4`.`prize_distributed` = '0' AND `G4`.`user_id`  != '0'
							END
	
					) AS `total_game_in_progress`
				FROM 
					`".$this->db->dbprefix( GAME )."` AS G
				GROUP BY
					`game_created_by`
				";

 		if( ! $is_csv )
 		{
 			return $this->run_query( $sql );
 		}
 		else
 		{
 			$this->load->dbutil();
 			$this->load->helper( 'download' );
			$query     = $this->db->query( $sql );
			$data      = $this->dbutil->csv_from_result( $query );
			$data      = "Created on ".format_date( 'today' , 'Y-m-d' )."\n\n"."From Date $from_date\nTo Date $to_date\n\n".html_entity_decode( $data );
			$name      = 'GamesReport-'.format_date( 'today' , 'Y-m-d' ).'.csv';
 			force_download( $name , $data );
 			return TRUE;
 		}
	}

	function withdrawal_request()
	{
		$sql = $this->db->select('U.user_id ,email, CONCAT(first_name, '.', last_name) AS name, ADDRESS AS address , balance , UPW.L_AMT0 AS transaction_amount , user_payment_withdraw_id , LIVE_CHECK_STATUS AS live_check_status, user_payment_withdraw_unique_id ', FALSE)
							->from(USER_PAYMENT_WITHDRAW.' AS UPW')
							->join(USER.' AS U', 'U.user_id = UPW.user_id','LEFT')
							->where('WITHDRAW_TYPE', LIVE_CHECK)
							->where('UPW.paypal_withdraw_status','0')
							->order_by('DATE_ADDED','DESC')
							->get();
		$result = $sql->result_array();
		return $result;
	}

	function update_live_check_status()
	{
		$this->db->where_in( 'user_payment_withdraw_id' , $this->input->post( 'upwi' ) );
		$this->db->update( USER_PAYMENT_WITHDRAW , array( 'LIVE_CHECK_STATUS' => $this->input->post( 'status' ) ) );
		return $this->db->affected_rows();
	}

	function paypal_withdrawal_request()
	{
		$sql = $this->db->select('U.user_id , CONCAT(first_name, ' . ', last_name) AS name  , email , balance , UPW.L_EMAIL0 AS paypal_id , UPW.L_AMT0 AS transaction_amount , user_payment_withdraw_unique_id , paypal_withdraw_status ', FALSE)
							->from(USER_PAYMENT_WITHDRAW.' AS UPW')
							->join(USER.' AS U', 'U.user_id = UPW.user_id','LEFT')
							->where('WITHDRAW_TYPE', PAYPAL_WITHDRAW)
							->where('UPW.paypal_withdraw_status','0')
							->order_by('DATE_ADDED','DESC')
							->get();
		$result = $sql->result_array();
		return $result;
	}

	

	public function get_list_of_game_date_wise($gamelist)
    {
    	foreach ($gamelist as $key => $value) {
    		$a[] = "'".$value."'";
    	}
    	$id_string = implode(',', $a);

		$sql = "SELECT `season_game_unique_id`,`home`,`away`,`season_scheduled_date`
					FROM ".$this->db->dbprefix.SEASON." 
						WHERE `season_game_unique_id` IN (".$id_string.") ORDER BY season_scheduled_date ASC";
						//echo $sql;
		$rs = $this->db->query($sql);
		$result = $rs->result_array();
		return $result;

    }

    function get_season_scheduled_date( $season_game_unique_id , $league_id )
	{
		$sql = "SELECT
					`S`.`season_scheduled_date`
				FROM
					`".$this->db->dbprefix( SEASON )."` AS `S` 
				
				WHERE
					`S`.`season_game_unique_id` = '".$season_game_unique_id."'
				AND
					`S`.`league_id` = ". $league_id ."
				GROUP BY
					`S`.`season_scheduled_date`
				ORDER BY
					`S`.`season_scheduled_date` ASC
				LIMIT
					0 , 1
				";
				//echo $sql;die;
		$result 					= $this->run_query( $sql , 'row_array' );
		$season_scheduled_date 		= '0000-00-00 00:00:00';
		if ( isset( $result[ 'season_scheduled_date' ] ) )
			$season_scheduled_date 	= $result[ 'season_scheduled_date' ];
		return $season_scheduled_date;
	}
	
	function reset_game_feature_status($is_feature = "",$game_unique_id = ""){
		$other_sql = "UPDATE 
				".$this->db->dbprefix( GAME )." 
			SET 
				is_feature = '".$is_feature."' 
			WHERE 
				game_unique_id = '".$game_unique_id."' 						
			";
	 		$this->db->query( $other_sql );	
	}

	function get_all_game_team($selected_matches)
	{
		$selected_matches = "'".str_replace(",", "','" , $selected_matches)."'";
		$sql = "SELECT
					`S`.`season_game_unique_id` , `S`.`home` , `S`.`away` , `S`.`season_scheduled_date`
				FROM
					`".$this->db->dbprefix( SEASON )."` AS `S`
				
				WHERE  
					`S`.`season_game_unique_id` IN (".$selected_matches.") 
				ORDER BY
					`S`.`season_scheduled_date`
				ASC
				";
		$result = $this->run_query( $sql );
		return ( is_array( $result ) ) ? $result : array();
	}

	function get_all_question_details()
	{
		$sql = "SELECT 
					`Q`.`question_id`,`Q`.`question` , `Q`.`question_description` 
				FROM 
					`".$this->db->dbprefix( QUESTION )."` AS `Q` 
				WHERE 
					`Q`.`status` = '1' 
				ORDER BY 
					`Q`.`order` 
				ASC 
				";
		$result = $this->run_query( $sql );
		return ( is_array( $result ) ) ? $result : array();
	}

	function get_list_of_option($question_id,$team_id_in,$player_salary_master_id,$game_unique_id)
	{
		if ($team_id_in) 
		{
			$sql_a = "SELECT  
						`QP`.`pattern_name` as pattern_name
					FROM 
						".$this->db->dbprefix( QUESTION_PATTERN )." AS QP
					INNER JOIN  ".$this->db->dbprefix( QUESTION_ANSWER_PATTERN )." AS `QAP` ON QAP.question_pattern_id = QP.question_pattern_id	
					WHERE
						QAP.question_id = $question_id GROUP BY QP.pattern_name
					";
			$rs_a = $this->db->query($sql_a);
			$result_a = $rs_a->result_array();	
			foreach($result_a as $value)
			{
				switch ($value['pattern_name']) {
					case 'Position' : 
					$sql_b  = "SELECT P.full_name,P.player_unique_id,QAP.question_id,OPP.point,PPP.Q1,PPP.Q2,PPP.Q3,PPP.Q4,PPP.Q5,PPP.Q6,PPP.Q7,PPP.Q8 FROM ".$this->db->dbprefix( PLAYER )." AS P 
								LEFT JOIN `".$this->db->dbprefix( PLAYER_SALARY_TRANSACTION )."` AS `PST` ON `PST`.`player_unique_id` = `P`.`player_unique_id`
								LEFT JOIN `".$this->db->dbprefix( PLAYER_PREDICTION_POINT )."` AS `PPP` ON `PPP`.`player_unique_id` = `P`.`player_unique_id`
								LEFT JOIN ".$this->db->dbprefix( QUESTION_ANSWER_PATTERN )." AS `QAP` ON P.position = QAP.metakey
								LEFT JOIN ".$this->db->dbprefix( OMO_PLAYER_POINT )." AS `OPP` ON OPP.player_unique_id = P.player_unique_id
								AND  `OPP`.`game_unique_id` = '".$game_unique_id."'
								AND `OPP`.`question_id` = '".$question_id."'
								WHERE 
									P.team_id IN ('".$team_id_in."')
								AND
									`PST`.`player_salary_master_id` = ".$player_salary_master_id."	
								AND 
									`QAP`.`question_id` = '".$question_id."'
													
								GROUP BY 
									P.player_unique_id
							";
					//echo $sql_b;
					break;
				}
				$rs_b     = $this->db->query($sql_b);
				$result_b = $rs_b->result_array();
				return $result_b;
			}
		}
	}

	public function add_points($data)
	{
		$this->db->insert(POINTS, $data);
	}

	function release_question()
	{
		$data[ 'omo_release' ] = '1';
		$this->db->where( 'game_unique_id' , $this->input->post( 'game_unique_id' ) );
		$this->db->update( GAME , $data );

		
		return $this->db->affected_rows();
	}

	function get_is_release_of_option($game_unique_id)
	{
		$sql = "SELECT 
					`G`.`game_unique_id`
				FROM 
					`".$this->db->dbprefix( GAME )."` AS `G` 
				WHERE 
					`G`.`omo_release` = '1' AND `G`.`game_unique_id` = '".$game_unique_id."'
				";
		$result = $this->run_query( $sql );
		return ( is_array( $result ) ) ? $result : array();
	}
	/**********************FOR PLAYER SALRY CALCULATION*****************************************/
	
	public function calculated_player_salary_football($league_id)
	{
		
			$sql = "SELECT
					PSS.*
				FROM 
					".$this->db->dbprefix(PLAYER_SCORE_SEASONAL)." AS PSS 
				WHERE 
					leauge_id = '".$league_id."'							
				";		
		$result = $this->db->query($sql);	
		$player_data = $result->result_array();
		$game_data = $player_data;

		if(!empty($game_data) && count($game_data) > 0)
		{
			
			$player_salary_points = array();			
			foreach ($game_data as $key => $value)
			{
				if (!array_key_exists($value['player_unique_id'], $player_salary_points)) {
					$player_salary_points[$value['player_unique_id']]['score'] = 0;
					$player_salary_points[$value['player_unique_id']]['position'] = $value['position'];
				}
				if($value['season'] == 2011)
				{				
					$player_salary_points[$value['player_unique_id']]['score'] += round(floatval(($value['score']*20)/100));
				}			
				if($value['season'] == 2012)
				{				
					$player_salary_points[$value['player_unique_id']]['score'] += round(floatval(($value['score']*30)/100));
				}
				if($value['season'] == 2013)
				{				
					$player_salary_points[$value['player_unique_id']]['score'] += round(floatval(($value['score']*50)/100));
				}

			}

			$players_sal_points = array();

			foreach ($player_salary_points as $pt_key => $val)
			{		
				
				if ( $val['position'] == 'DEF') 
				{
					$players_sal_points[$pt_key] = round(12000 + (floatval($val['score'])));
				}
				else if ($val['score'] < 0 ) 
				{
					$players_sal_points[$pt_key] = 0;
				}
				else if ($val['score'] > 0 &&  $val['score'] <= 100) 
				{
					$players_sal_points[$pt_key] = round(1000 + (floatval($val['score']*10)));
				}
				else if ($val['score'] > 100 &&  $val['score'] <= 200) 
				{
					$players_sal_points[$pt_key] = round(4000 + (floatval($val['score']*10)));
				}
				else if ($val['score'] > 200 &&  $val['score'] <= 300) 
				{
					$players_sal_points[$pt_key] = round(6000 + (floatval($val['score']*10)));
				}
				else if ($val['score'] > 300 &&  $val['score'] <= 400) 
				{
					$players_sal_points[$pt_key] = round(8000 + (floatval($val['score']*5)));
				}
				else if ($val['score'] > 400 &&  $val['score'] <= 500) 
				{
					$players_sal_points[$pt_key] = round(1000 + (floatval($val['score']*5)));
				}
				else if ($val['score'] > 500) 
				{
					$players_sal_points[$pt_key] = round(13000 + (floatval($val['score']*5)));
				}
			}
			/*echo "<pre>";
			print_r($players_sal_points);
			exit;*/
			
			// chcek if already in temp table
			$tmp_sql = "SELECT
						player_unique_id 
					FROM 
						".$this->db->dbprefix(PLAYER_TEMP)." 
					WHERE 
						1=1 LIMIT 1							
					";		
			$tmp_result = $this->db->query($tmp_sql);	
			$temp_exist = $tmp_result->row_array();
			//$temp_exist = ($is_temp) ? TRUE : '';
			//print_r(count($temp_exist));die;
			// Inert into player temp table
			$data = array();
			foreach ($players_sal_points as $player_unique_id => $points)
			{
				//run olny one then comment
					//$this->set_first_salary_season_start($player_unique_id,$points);

				if (isset($temp_exist) && count($temp_exist) > 0) 
				{
					$data[] = array(				
						'player_unique_id' 	=> $player_unique_id,				
						'salary' 			=> $points,
						'weightage' 		=> ''
					);
				} else {
					$data[] = array(				
						'player_unique_id' 	=> $player_unique_id,
						'active' 			=> "1",
						'salary' 			=> $points,
						'weightage' 		=> ''
					);
				}		
					
			}

			if(isset($data) && count($data) > 0)
			{	
				//update previous salary 
					$this->update_previous_salary_to_current();
				//Add New Salary
				$this->db->insert_on_duplicate_update_batch(PLAYER_TEMP , $data);
			}
			//update player salary 1500 if salary 0
			$sql = "UPDATE
						".$this->db->dbprefix(PLAYER_TEMP)." 
					SET 
						salary = '1500'
					WHERE 
						salary <= '0'						
					";		
			$this->db->query($sql);		
		}
	}

	public function update_previous_salary_to_current()
	{
		//update previous salary 
		$sql = "UPDATE
					".$this->db->dbprefix(PLAYER_TEMP)." 
				SET 
					previous_salary = salary
				";
		$this->db->query($sql); 
	}

	private function set_first_salary_season_start($player_unique_id,$salary)
	{
		//update player salary 1500 if salary 0
			$sql = "UPDATE
						".$this->db->dbprefix(PLAYER)." 
					SET 
						first_salary = ".$salary."
					WHERE 
						player_unique_id = '".$player_unique_id."'						
					";		
			$this->db->query($sql);	

			//update player salary 1500 if salary 0
			$sql = "UPDATE
						".$this->db->dbprefix(PLAYER)." 
					SET 
						first_salary = '1500'
					WHERE 
						first_salary <= '0'
					";		
			$this->db->query($sql);		
	} 

	function player_active($league_id = 2)
	{
		$sql = "SELECT
						player_unique_id 
					FROM 
						".$this->db->dbprefix(PLAYER)." 
					WHERE 
						league_id = '".$league_id."'							
					";	
		$result = $this->db->query($sql);	
		$players = $result->result_array();
		if(!empty($players) && count($players) > 0)
		{
			$data = array();
			foreach ($players as $key => $value)
			{
				$data[] = array(				
									'player_unique_id' 	=> $value['player_unique_id'],
									'active' 			=> "1",
									'salary' 			=> "0",
									'weightage' 		=> ''
								);
			}
		}	
		if(isset($data) && count($data) > 0)
		{	
			//echo "<pre>";print_r($data);die;
			$this->db->insert_on_duplicate_update_batch(PLAYER_TEMP , $data);
		}
	}

	function get_game_detail_by_game_unique_id()
	{
		$sql = 	$this->db->select('G.game_unique_id , G.player_salary_master_id , G.game_name , G.league_id , G.league_duration_id , G.season_scheduled_date , G.season_week_id , G.league_drafting_styles_id , G.league_salary_cap_id , G.size , G.entry_fee , G.prize_pool , G.league_number_of_winner_id , G.is_cancel , G.buckets , G.status , G.league_drafting_styles_id , L.league_desc , MD.duration_desc , MDS.drafting_styles_desc , MSC.salary_cap , MD.duration_id , MDS.drafting_styles_id , MNW.number_of_winner_desc,G.prize_distributed,G.serial_no,COUNT(LM.lineup_master_id) AS participant_joined')
	                    ->from(GAME." AS G")
	                    ->join(LEAGUE." AS L", "L.league_id = G.league_id", 'INNER')
	                    ->join(MASTER_SPORTS." AS MS", 'MS.sports_id = L.sports_id','INNER')
	                    ->join(LEAGUE_DURATION." AS LD",'LD.league_duration_id = G.league_duration_id', 'INNER')
	                    ->join(MASTER_DURATION." AS MD",'MD.duration_id = LD.duration_id', 'INNER')
	                    ->join(LEAGUE_DRAFTING_STYLES." AS LDS",'LDS.league_drafting_styles_id = G.league_drafting_styles_id', 'INNER')
	                    ->join(MASTER_DRAFTING_STYLES." AS MDS",'MDS.drafting_styles_id = LDS.drafting_styles_id', 'INNER')
	                    ->join(LEAGUE_SALARY_CAP." AS LSC",'LSC.league_salary_cap_id = G.league_salary_cap_id', 'INNER')
	                    ->join(MASTER_SALARY_CAP." AS MSC",'MSC.salary_cap_id = LSC.salary_cap_id', 'INNER')
	                    ->join(LEAGUE_NUMBER_OF_WINNER." AS LNW",'LNW.league_number_of_winner_id = G.league_number_of_winner_id', 'LEFT')
	                    ->join(MASTER_NUMBER_OF_WINNER." AS MNW",'MNW.number_of_winner_id = LNW.number_of_winner_id', 'LEFT')
	                    ->join(LINEUP_MASTER." AS LM",'LM.game_unique_id = G.game_unique_id', 'LEFT')
	                    ->where('G.game_unique_id',$this->game_unique_id)
	                    ->where('L.active','1')
	                    ->where('MS.`active','1')
	                    ->where('LD.`active','1')
	                    ->where('LDS.`active','1')
	                    ->get();
	    $config = $sql->row_array();                        
		return $config;
	}

	function get_list_of_emails()
	{
		$sql = 	$this->db->select('email,user_name')
	                    ->from(USER." AS U")
	                    ->where('varified_email','1')
	                    ->where('status','1')
	                    ->where('is_banned','1')
	                    ->get();
	    $config = $sql->result_array();                        
		return $config;
	}
	

	// selected game detail for merging
	function get_game_detail_by_id($game_unique_id = ""){		
		$sql = "SELECT 
					g.league_id,g.game_name,g.game_unique_id,g.size,g.league_salary_cap_id,g.entry_fee,g.season_scheduled_date,
					g.league_duration_id,g.buckets,g.season_scheduled_date,g.season_week_id,g.league_drafting_styles_id,g.buckets,
					g.league_drafting_styles_id,g.league_salary_cap_id,count(lm.lineup_master_id) AS joined_player_count
					
				FROM 
					".$this->db->dbprefix(GAME)." AS g 
				LEFT JOIN 
					".$this->db->dbprefix( LINEUP_MASTER )." as lm on lm.game_unique_id = g.game_unique_id
				WHERE 
					g.game_unique_id = '".$game_unique_id."' LIMIT 1
				";
		$query = $this->db->query($sql);	
 		return $query->row_array();				
	}

	function get_games_for_merging($game_unique_id = "", $league = "", $entry_fee = "", $season_week_id, $bucket = "", $league_duration_id = "",$season_scheduled_date = "",$bucket = "",$league_drafting_styles_id,$league_salary_cap_id = ""){	
		// if merging for daily game
		$daily_game_condition = ($bucket != '0') ? " AND g.season_scheduled_date ='".$season_scheduled_date."' AND g.buckets = '".$bucket."' AND g.league_drafting_styles_id = '".$league_drafting_styles_id."' " : " AND g.buckets = '".$bucket."'";

		$sql = "SELECT 
					g.league_id,g.game_name,g.game_unique_id,g.game_unique_id,g.size,g.league_salary_cap_id,g.entry_fee,
					g.league_duration_id,g.buckets,g.season_scheduled_date,g.season_week_id,g.league_drafting_styles_id,
					(SELECT COUNT(lineup_master_id) FROM ".$this->db->dbprefix( LINEUP_MASTER )." WHERE game_unique_id = g.game_unique_id) AS joined_player_count 
				FROM 
					".$this->db->dbprefix(GAME)." AS g 									
				WHERE g.league_id = '".$league."' 				
				AND g.entry_fee = '".$entry_fee."' 				
				AND g.league_duration_id = '".$league_duration_id."' 
				AND g.league_salary_cap_id = '".$league_salary_cap_id."' 
				AND g.season_week_id = '".$season_week_id."'
				AND g.game_unique_id!='".$game_unique_id."' ".$daily_game_condition."				
				AND g.is_cancel = '0' 
				AND g.size>(SELECT COUNT(lineup_master_id) FROM vi_lineup_master WHERE game_unique_id = g.game_unique_id)
				";
		
		$query=$this->db->query($sql);	
 		return $query->result_array();				
	}

	function get_all_game_merging_player($gameId){
		$sql = "SELECT 
					CONCAT_WS(' ',u.first_name,u.last_name) as full_name,u.user_id 				
				FROM 
					".$this->db->dbprefix(USER)." AS u 
				LEFT JOIN 
					".$this->db->dbprefix(LINEUP_MASTER)." AS m 
				ON 
					m.user_id = u.user_id 				
				WHERE 				
					m.game_unique_id = '".$gameId."' 
				";
		
		$query = $this->db->query($sql);	
 		$game_user_arr['game_user'] =  $query->result_array();		

 		$sql_nm = "SELECT game_name,game_unique_id,size  FROM ".$this->db->dbprefix(GAME)." WHERE game_unique_id = '".$gameId."'";
 		$query_nm = $this->db->query($sql_nm);	
 		$gm_name =  $query_nm->row_array();	
 		$game_user_arr['game_name'] = $gm_name['game_name'];
 		$game_user_arr['size'] = $gm_name['size'];
 		$game_user_arr['game_unique_id'] = $gm_name['game_unique_id'];
 		return $game_user_arr;
	}

	function save_user_game_merge($first_game_id = "",$second_game_id = "",$user_id = ""){
		$sql = "SELECT 
					 game_unique_id
				FROM 
					".$this->db->dbprefix(LINEUP_MASTER)." 
				WHERE 
					game_unique_id='".$first_game_id."'
				AND 
					user_id = '".$user_id."'
		";
		$if_already_in = $this->db->query($sql)->row_array();
		
		// if already not in this game then update the other game details
		if(empty($if_already_in)) {						
			$other_sql = "UPDATE
				".$this->db->dbprefix( LINEUP_MASTER )."
			SET
				game_unique_id = '".$first_game_id."'
			WHERE
				game_unique_id = '".$second_game_id."' 
			AND user_id = '".$user_id."'				
			";
	 		$this->db->query( $other_sql );			
		}
	}
     
     /*----------------------------------Advertisement management -------------------------------------------------*/
     /*
      * function : get_positions
      * def: get all active positions
      * @params : 
      * @return : array positions
      */
     public function get_positions(){
         $sql = $this->db->select('*')
                         ->from(ADS_POSITION)
                         ->where('status',1)
                         ->get();
         return $sql->result_array();
     }

     /*
      * function : get_positions
      * def: get all active positions
      * @params : 
      * @return : array positions
      */
     public function create_ads($data){
     	$post_data = array( 
							'name'           => $data['name'], 
							'target_url'     => $data['target_url'], 
							'image'          => $data['image'], 
							'ad_position_id' => $data['type'], 
							'created_date'   => date('Y-m-d H:i:s')
     				);
        $this->db->insert(ADS_MANAGEMENT,$post_data);
	   return $this->db->insert_id();
     }
     
     /*
      * function : get_advertisement
      * def: get all active positions
      * @params : 
      * @return : array positions
      */
     public function get_advertisement(){
         $sql = $this->db->select('ADM.name,ADM.ad_management_id,ADM.target_url,ADP.type as ads_position ,CONCAT(ADP.height,"*",ADP.width) as ads_size,ADM.view,ADM.click,ADM.status',FALSE)
                         ->from(ADS_MANAGEMENT.' as ADM')
                         ->join(ADS_POSITION. " as ADP","ADP.ad_position_id = ADM.ad_position_id","inner")
                         ->where('ADM.status',1)
                         ->get();
         return $sql->result_array();
     }
     
}