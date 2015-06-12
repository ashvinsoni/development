<?php
class MY_Model extends CI_Model {

	public $prefix="";

	//name of the table for this Model
	public $table_name="";

	//name of the primary key in this table
	public $primary_key="";

	private $default=array();

	function __construct()
	{
		// Call the Model constructor
		parent::__construct();

		//initialize all the global variables
		$this->init();
	}

	function get($config=array()){
		// debug($config);
		$config=array_merge($this->default,$config);

		if($config["fields"]){
			$this->db->select($config["fields"],false);
		}

		$this->db->from($this->table_name);

		if($config["join"]!=""){
			if(is_array($config["join"])){

				foreach($config["join"] as $join_table=>$join_condition){
					if(isset($config["join_type"]) && $config["join_type"]!=""){
						$join_type=$config["join_type"];
					}else{
						$join_type="";
					}
					$this->db->join($join_table,$join_condition,$join_type);
				}
			}
		}
		$where     ="";
		$where_arr =array();

		if(isset( $config["where"] ) && $config["where"] ){
			$this->db->where( $config["where"] );
		}

		if(isset($config["or_where"])){
			// $this->db->or_where($config["or_where"]);
			foreach($config['or_where'] as $field=>$value){
				$where_arr[] = "$field '$value'" ;
			}
			$where=implode(" OR ", $where_arr);
			$this->db->where(" ($where) ", NULL, FALSE);
		}

		if(isset($config['where_in'])){
			foreach ($config['where_in'] as $field => $value) {
				$values = @implode(",", $value);
				$this->db->where_in($field,$value);
			}
		}

		if(isset($config['Orwhere'])){
			foreach($config['Orwhere'] as $field=>$value){
				$this->db->or_where($field, $value); 
			}
		}

		if(isset($config['between'])){
			foreach($config['between'] as $field=>$value){
				foreach($value as $keys => $between_value){
					$this->db->where($field.' '.$between_value, NULL, FALSE); 
				}
			}
		}

		if(isset($config['mysql_find_set'])){
			$this->db->where($config['mysql_find_set']);
		}

		if(isset($config['mysql_function'])){
			if(is_array($config["mysql_function"])){
				foreach ($config["mysql_function"] as $key => $value) {
					$this->db->where($value);
				}
			}else{
				$this->db->where($config['mysql_function']);
			}
		}

		if(isset($config['or_where_in'])){
			foreach($config['or_where_in'] as $field => $value){
				$this->db->or_where_in($field,$value);
			}
		}

		if(isset($config['min'])){
			foreach ($config['min'] as $key => $value) {
				$this->db->select_min($key,$value);
			}
		}		

		if(isset($config['max'])){
			foreach ($config['max'] as $key => $value) {
				$this->db->select_max($key,$value);
			}
		}		

		if(isset($config['group_by'])){
			$this->db->group_by($config['group_by']); 
		}

		if($config["limit"]!="" && !$config["count_only"]){
			$this->db->limit($config["limit"],$config["start"]);
		}

		if($config["count_only"]){
			$result = $this->db->count_all_results();
		}else{
			if($config["sort_field"] != ""){
				// debug("Sort field was present");
				$this->db->order_by($config["sort_field"],$config["sort_order"]);
			}
			$query = $this->db->get();
			$result =  !$config["only_one_record"]  ? $query->result_array() : $query->row_array() ;
		}
		// debug($this->db->last_query());
		return $result;
	}

	
	function insert($data){
		$this->db->insert($this->table_name, $data);         
		if ($this->db->affected_rows() == 1)
		{
			return $this->db->insert_id();
		}
		
		return FALSE;       
	}

	function insert_batch( $data )
	{
		$this->db->insert_batch( $this->table_name , $data );         
		if ($this->db->affected_rows() > 0 )
		{
			return TRUE;
		}
		
		return FALSE;       
	}

	function insert_unique($condition, $data){
		$arr_where=array();
		foreach($condition as $field_name=>$field_value){
			$arr_where[$field_name]=$field_value;
		}
		$config["where"]=$arr_where;

		$resp=$this->get($config);

		if (count($resp)>=1) {
			$resp[0][0];
			//return the first field of the first record
		}
		//debug($data);

		//Otherwise return the insert id
		$insert_id=$this->insert($data);
		return $insert_id;
	}

	function update($condition,$data){
		if(is_array($condition)){
			$this->db->where($condition);    
		}else{
			$this->db->where($this->primary_key,$condition);
		}

		$this->db->update($this->table_name, $data);
		if ($this->db->affected_rows())
		{
			return TRUE;
		}
		
		return FALSE;       
	}
	
	function delete($condition){
		if(is_array($condition)){
			$this->db->where($condition);
		}else{
			$this->db->where($this->primary_key,$condition);
		}
		$this->db->delete($this->table_name);
		if ($this->db->affected_rows() == 1)
		{
			return TRUE;
		}
		
		return FALSE;        
	}   
	
	function count($config){
		$config["count_only"]=true;
		return $this->get($config);
	}

	function get_combo_data( $value_field , $label_field , $combo_data=array() , $condition="" ){

		$config["fields"]     ="$value_field,$label_field";
		$config["sort_field"] =$label_field;
		$config["sort_order"] ="ASC";
		if($condition!=""){
			$config["where"]=$condition;
		}
		$response=$this->get($config);

		if($response){
			// $combo_data=array(""=>"Select");
			foreach($response as $row){
				$index=$row[$value_field];
				$combo_data["$index"]=$row[$label_field];
				// debug()
			}
			return $combo_data;
		}else{
			return $response;
		}
	}

	/*common function used to get all data from any table
	* @param String $select
	* @param String $table
	* @param Array/String $where
	*/
	function get_all_table_data ($select = '*', $table, $where = "") {
		$this->db->select($select);
		$this->db->from($table);
		if ($where != "") {
			$this->db->where($where);
		}
		$query = $this->db->get();
		return $query->result_array();
	}


	
	/*common function used to get single row from any table
	* @param String $select
	* @param String $table
	* @param Array/String $where
	*/
	function get_single_row ($select = '*', $table, $where = "") {
		$this->db->select($select);
		$this->db->from($table);
		if ($where != "") {
			$this->db->where( $where );
		}
		$query = $this->db->get();
	    $this->db->last_query();
		return $query->row_array();
	}

	function run_query($sql,$result_type = 'result_array'){
		$rs = $this->db->query($sql);
		if ($rs->num_rows() > 0) {
			if ($result_type == 'row_array') {
				return $rs->row_array();
			} else {
				return $rs->result_array();
			}
		} else {
			return false;
		}
	}
	//This function clears all global variables so that we can use it again.
	//
	function init(){
		$this->default=array(
			"fields"          => "*",
			"join"            => "",
			"where"           => "",
			"search_exact"    => false,
			"sort_field"      => $this->primary_key,
			"sort_order"      => "DESC",
			"limit"           => "",
			"start"           => 0,
			"only_one_record" => false,
			"count_only"      => false,
			"format"          => "array" //json, or objects
		);
	}
	
/**********************USE IN SPORTS MODEL************************************************/
	
    /**
    * Replace into Batch statement
    *
    * Generates a replace into string from the supplied data
    *
    * @access    public
    * @param    string    the table name
    * @param    array    the update data
    * @return    string
    */
    public function replace_into_batch($table, $data)
    {
        $this->db->insert_on_duplicate_update_batch($table,$data);
    } 

	/**
	 * @Summary: This function for use check attribute existing on array or not
	 * @access: protected
	 * @param:$key, $arry
	 * @return: return exist value or assing value
	 */
	protected function check_value_exist($key, $arry)
	{
		if(array_key_exists($key,$arry))
		{
			return floatval($arry[$key]);
		}else
		{
			return "0.00";
		}
	}
	
	/**
	 * @Summary: This function for use check URL hit by Webbrowser or schedular by cron(wget)
	 * @access: protected
	 * @param:
	 * @return: true or false
	 */
	protected function check_url_hit()
	{
		//Check url hit by server or manual
			if ( $_SERVER['SERVER_NAME'] == 'www.vfantasysports.com'  )
			{		
				$http_user_agent = substr($_SERVER['HTTP_USER_AGENT'],0,4);
				if(strtolower($http_user_agent) != 'wget')
				{
					redirect('');
				}
			}	
			return TRUE;	
	}
	
	/**
	 * @Summary: This function for use get all games start from current date and continues fatching from atleast spent 6 0r more than hour which are specify by league wise
	 * @access: protected
	 * @param:$league_id
	 * @return: game array
	 */
	protected function get_current_game($league_id)
	{
		$interval = game_interval($league_id);

		$current_date_time =  format_date();
		// $current_date_time =  '2014-08-16 11:45:00';

		$sql = "SELECT 
					S.`home`, S.`away`,S.`api_week`, S.`week`, S.`season_game_unique_id`, S.`scheduled_date_time`,S.`season_scheduled_date` ,T.team_id
				FROM ".$this->db->dbprefix(SEASON)."  AS S
                                INNER JOIN ".$this->db->dbprefix(TEAM)."  AS T ON T.team_abbr = S.home and T.league_id = $league_id
				WHERE 
					DATE_FORMAT ( S.season_scheduled_date ,'%Y-%m-%d %H:%i:%s' ) <=	'$current_date_time' 
    			AND
    			    DATE_FORMAT ( S.season_scheduled_date ,'%Y-%m-%d %H:%i:%s' ) >= DATE_SUB('$current_date_time' , INTERVAL $interval HOUR)
				AND 
					S.league_id = $league_id
				";
		//echo $sql;die;		
		$result = $this->db->query($sql);
		$teams  = $result->result_array();
		return $teams;
	}


	/**
	 * @Summary: This function for use set season week in season_week table  as per our requirement like Thusday-Wednesday
	 * @access: protected
	 * @param: $league_id,$season_type,$season_year
	 * @return: 
	 */
	protected function set_season_week($league_id,$season_type,$season_year)
	{
		$sql = "SELECT 
					MAX(scheduled_date) AS max_date ,MIN(scheduled_date) AS min_date 
				FROM 
					".$this->db->dbprefix(SEASON)."	
	            WHERE
					league_id = $league_id
				AND
					type = '".$season_type."'
				AND
					year = '".$season_year."'	 		
			   ";
	    $rs = $this->db->query($sql);
		$result = $rs->row_array();		   
		//echo "<pre>";print_r($result['min_date']);
		//echo "<pre>";print_r($result['max_date']);
		//delete week from table
		if(!empty($result))
		{
			$this->common_model->delete(SEASON_WEEK,array('league_id' => $league_id,'type'=>$season_type));
			
			$start_day = '';
			$end_day = '';
			//get start & end day in week from DB
			$query = $this->db->get_where(MASTER_LEAGUE_WEEK,array('league_id'=>$league_id));
			if($query->num_rows() > 0)
			{
				$res = $query->row_array();
				$start_day = $res['start_week_day'];
				$end_day = $res['end_week_day'];
			}
			
			$predate = strtotime($result['min_date']);
			$nextdate = strtotime($result['max_date']);
			if(date('l', $predate) != 'Monday')
				$previous_date = date('Y-m-d', strtotime('previous '.$start_day, strtotime($result['min_date'])));
			else
				$previous_date = $result['min_date'];
			if(date('l', $nextdate) != 'Sunday')		
				$next_date = date('Y-m-d', strtotime('next '.$end_day, strtotime($result['max_date'])));
			else
				$next_date = $result['max_date'];
			
			$startdate = strtotime($previous_date);
			$enddate = strtotime($next_date);
			
			$weeks = array();
			
			while ($startdate < $enddate)
			{  
				$weeks[] = date('W', $startdate); 
				$startdate += strtotime('+1 week', 0);
			}
			
			$season_week 					= 1;
			$season_week_start_date_time 	= date('Y-m-d 00:00:00',strtotime($previous_date));
			$season_week_end_date_time 		= date('Y-m-d 23:59:59', strtotime('next '.$end_day, strtotime($previous_date)));
			$season_week_close_date_time	= date('Y-m-d 23:59:59', strtotime('next '.$end_day, strtotime($previous_date)));
			for($i=1;$i <= count($weeks);$i++)
			{
				//echo "<pre>";
				//echo $season_week.'-'.$season_week_start_date_time.'-'.$season_week_end_date_time.'-'.$season_week_close_date_time;
				$data = array(
								'type'          			    => trim($season_type),
								'season_week'          			=> trim($season_week),
								'season_week_start_date_time' 	=> trim($season_week_start_date_time),
								'season_week_end_date_time'     => trim($season_week_end_date_time),
								'season_week_close_date_time'   => trim($season_week_close_date_time),
								'league_id'         			=> $league_id
							);	
				
				//Insert data into database
				$this->common_model->insert_data(SEASON_WEEK, $data);
				
				$season_week 					= $season_week+1;
				$season_week_start_date_time	= date('Y-m-d 00:00:00', strtotime('next '.$start_day, 
																		 strtotime($season_week_start_date_time)));
				$season_week_end_date_time 		= date('Y-m-d 23:59:59', strtotime('next '.$end_day, 
																		 strtotime($season_week_end_date_time)));
				$season_week_close_date_time	= date('Y-m-d 23:59:59', strtotime('next '.$end_day, 
																		 strtotime($season_week_close_date_time)));
			}
		}	
	}			
	
	/**
	 * @Summary: This function for use update season week in season table from season_week table  
	 * @access: protected
	 * @param: $league_id,$season_type,$season_year
	 * @return: 
	 */
	protected function update_season_week($league_id,$season_type,$season_year)
	{
		$sql = "SELECT 
					DATE_FORMAT(season_week_start_date_time,'%Y-%m-%d') AS start_date,
					DATE_FORMAT(season_week_end_date_time,'%Y-%m-%d') AS end_date 
				FROM 
					".$this->db->dbprefix(SEASON_WEEK)."	
	            WHERE
					league_id = $league_id
				AND
					type = '".$season_type."'
				ORDER BY 
					season_week		
			   ";
	    $rs = $this->db->query($sql);
		$result = $rs->result_array();
		//echo "<pre>";print_r($result);	
		if(!empty($result))
		{
			foreach($result as $key=>$value)
			{
				$sql = "SELECT 
							season_game_unique_id
						FROM 
							".$this->db->dbprefix(SEASON)."	
						WHERE
							league_id = $league_id	
						AND
							scheduled_date BETWEEN 	'".$value['start_date']."' AND '".$value['end_date']."'
					   	AND
							type = '".$season_type."'
						AND
							year = '".$season_year."'
					   ";
				$rs2 = $this->db->query($sql);
				$result2 = $rs2->result_array();
				//echo "<pre>";print_r($result2);	
				if(!empty($result2))
				{
					$season_game_unique_id = array();
					for($i=0;$i<count($result2);$i++)
					{
						$season_game_unique_id[] =  $result2[$i]['season_game_unique_id'];
					}
					$i = $key+1;

					$update_sql = "UPDATE ".$this->db->dbprefix(SEASON)." SET week=".$i." 
									WHERE 
										league_id = $league_id	
									AND
										type = '".$season_type."'
									AND
										year = '".$season_year."'
									AND	
										season_game_unique_id in (".implode( ',' , array_map( function( $n ){ return '\''.$n.'\''; } , $season_game_unique_id ) ).")";
					$rs = $this->db->query($update_sql);
				}
			}
		}
	}

	/**
	 * @Summary: This function for use update score in lineup master table wich is coming from sum of score in lineup table   
	 * @access: protected
	 * @param: $week,$season_game_unique_id ,$league_id 
	 * @return: 
	 */
	protected function update_scores_in_lineup_master($week,$season_game_unique_id = 0,$league_id = '2')
    {
        $sql = "UPDATE  
						".$this->db->dbprefix(LINEUP_MASTER)."  AS LUM
				INNER JOIN 
						".$this->db->dbprefix(LINEUP)." ON ".$this->db->dbprefix(LINEUP).".lineup_master_id = LUM.lineup_master_id 
						AND ".$this->db->dbprefix(LINEUP).".season_game_unique_id = '".$season_game_unique_id."'
				SET 
						LUM.total_score = (SELECT IFNULL(SUM(score),'0.00') FROM ".$this->db->dbprefix(LINEUP)."  AS LU
											WHERE LU.`lineup_master_id` = LUM.`lineup_master_id`
											GROUP BY lineup_master_id
										   ),
 						LUM.current_week_score = (SELECT IFNULL(SUM(score),'0.00') FROM ".$this->db->dbprefix(LINEUP)."  AS LU
													WHERE LU.`lineup_master_id` = LUM.`lineup_master_id`
													AND LU.week = ".$week."
													GROUP BY lineup_master_id
												)											

				WHERE 
					".$this->db->dbprefix(LINEUP).".week = ".$week." 
				";
		//echo "<pre>";echo $sql;
		$this->db->query($sql);
 	}

 	/**
	 * @Summary: This function for use get scoring formula wich is store in master_scoring_category table    
	 * @access: protected
	 * @param: $league_id 
	 * @return: resuly array
	 */
 	protected function get_scoring_formula($league_id)
    {

        $rs = $this->db->select("MS.score_position, MS.score_points, MS.master_scoring_category_id,
									MS.meta_key, MSC.scoring_category_name")
            ->from($this->db->dbprefix(MASTER_SCORING). " AS MS")
            ->join($this->db->dbprefix(MASTER_SCORING_CATEGORY) . " AS MSC",
					 "MSC.master_scoring_category_id = MS.master_scoring_category_id", "LEFT")
            ->join($this->db->dbprefix(LEAGUE) . " AS L",
					 "L.sports_id = MSC.sports_id")
            ->where("L.league_id", $league_id)
            ->get();
        // echo $this->db->last_query();
        $res = $rs->result_array();
        
		//return $res;
		
		$raw_formula_data = $res;

		$formula = array();
		foreach ($raw_formula_data as $val) {
			$formula[$val['scoring_category_name']][$val['meta_key']] = $val['score_points'];
		}
		//echo "<pre>";print_r($formula);
		return $formula;
		
    }

    /**
	 * @Summary: This function for use for update node client server to update score run time    
	 * @access: protected
	 * @param: $teams
	 * @return: 
	 */
	protected function update_node_client( $teams )
	{
		//send_email("vinod@vinfotech.com","Test update_node_client cron","Yes (fantasycentrepro LIVE), update_node_client cron working fine");
		debug($teams);//die;
		$FinalScoreResult = array();
		$games            = array();
		foreach ($teams as $key => $team)
		{
			$sql = "SELECT 
						`G`.`game_unique_id` 
					FROM 
						`".$this->db->dbprefix(GAME)."` AS `G` 
					WHERE 
						FIND_IN_SET( '".$team['season_game_unique_id']."', `G`.`selected_matches` ) 
					AND 
						is_cancel = '0' 
					AND 
						prize_distributed = '0' 
					";
			$games = $this->run_query($sql);
			debug( $games );
			if($games&&is_array($games))
			{
				foreach ($games as $games_key => $games_value)
				{
					$game_unique_id = $games_value['game_unique_id'];
					$sql = "SELECT 
								`LM`.`lineup_master_id` 
							FROM 
								`".$this->db->dbprefix(LINEUP_MASTER)."` AS `LM` 
							WHERE 
								`LM`.`game_unique_id` = '" . $game_unique_id . "' 
							";
					$result = $this->run_query( $sql );
					if( $result && isset( $result[0]['lineup_master_id'] ) )
					{
						if( !isset( $FinalScoreResult[$game_unique_id] ) )
						{
							$FinalScoreResult[$game_unique_id] = array();
						}
						foreach( $result as $k => $val )
						{
							$games[$game_unique_id] = $game_unique_id;

							if( !isset( $FinalScoreResult[$game_unique_id][$val['lineup_master_id']] ) )
							{
								$FinalScoreResult[$game_unique_id][$val['lineup_master_id']] = array();
							}
							// $FinalScoreResult[$val['game_unique_id']][$val['lineup_master_id']][$val['player_unique_id']] = $val['score'];
							$sql = "SELECT 
										`L`.`player_unique_id`,`L`.`score` 
									FROM 
										`".$this->db->dbprefix(LINEUP)."` AS `L` 
									WHERE 
										`lineup_master_id` = ".$val['lineup_master_id'];
							$total_score = $this->run_query($sql);
							$FinalScoreResult[$game_unique_id][$val['lineup_master_id']] = $total_score;
						}
					}
					$sqls = "SELECT
								CASE 
									WHEN (`U`.`user_name` IS NULL OR `U`.`user_name` = '' )
									THEN 
									CONCAT(`U`.`first_name`, ' ', `U`.`last_name`) 
									ELSE 
									`U`.`user_name` 
									END AS `name`,`U`.`image`,`U`.`user_id`,`LM`.`lineup_master_id`,`U`.`email`,`LM`.`total_score` 
							FROM 
								`".$this->db->dbprefix(USER)."` AS `U`
							INNER JOIN 
								`".$this->db->dbprefix(LINEUP_MASTER)."` AS `LM` ON `LM` . `user_id` = `U` . `user_id` 
							WHERE 
								`LM`.`game_unique_id` = '" . $game_unique_id . "' 
							ORDER BY 
								`LM`.`total_score` DESC
							";
					$res = $this->run_query($sqls);
					$FinalScoreResult[$game_unique_id]['user_detail'] = $res;

					if( $FinalScoreResult )
					{
						$data_string = json_encode($FinalScoreResult);

						$curlUrl = NODE_ADDR."/recieveScore";
						debug($curlUrl);
						debug($FinalScoreResult);
						$curl = curl_init();
						curl_setopt_array($curl, array(
							CURLOPT_POST           => 1,
							CURLOPT_POSTFIELDS     => $data_string,
							CURLOPT_RETURNTRANSFER => true,
							CURLOPT_URL            => $curlUrl,
							CURLOPT_SSL_VERIFYPEER => false
						));
						$result = curl_exec($curl);
						curl_close($curl);
						echo $result;
						$FinalScoreResult = array();
					}
				}
			}
		}
	exit();
	}

	/**
	 * @Summary: This function for use for save player scoring in game player scoring table after calculation of fantasy point    
	 * @access: protected
	 * @param: $game_id, $week, $player_score,$scheduled_date,$league_id
	 * @return: 
	 */
	protected function save_player_scoring($game_id, $week, $player_score,$scheduled_date,$league_id)
    {

      //echo "<pre>";print_r($player_score);die;
	    $table_value = array();
        $sql = "REPLACE INTO ".$this->db->dbprefix(GAME_PLAYER_SCORING)." (season_game_unique_id, player_unique_id, week, score, scheduled_date,league_id)
				VALUES ";

        foreach ($player_score as $player_id => $value) {
          
		    $str = " ('" . $game_id . "','" . $player_id . "','" . $week . "','" . $value. "','" . $scheduled_date. "','" . $league_id. "' )";
          
			$table_value[] = $str;
        }

        $sql .= implode(", ", $table_value);

        $this->db->query($sql);
    }


    /**
	 * @Summary: This function for use for game status closed when game in actualy closed and status get from boxscore or other APIS    
	 * @access: protected
	 * @param: $game_unique_id ,$league_id
	 * @return: 
	 */
    protected function change_game_status($game_unique_id ,$league_id)
	{
		$sql = "SELECT 
					G.`selected_matches`,G.`game_id`,G.`game_unique_id` 
				FROM 
					".$this->db->dbprefix(GAME)."  AS G
				WHERE 
					G.league_id = $league_id
				AND
					G.is_cancel = '0'
				AND
					G.prize_distributed = '0'
				AND
					G.season_scheduled_date < '".format_date()."'		
				";
		$result = $this->db->query($sql);		
		$games_data  = $result->result_array();
		//echo "<pre>";print_r($sql);die;
		if(isset($games_data) && count($games_data) > 0)
		{
			foreach ($games_data as $key => $value)
			{
				$games 	= explode(",",$value['selected_matches']);
				$game 	= end($games);
				if($game == $game_unique_id)
				{
					//$value['games_id'];
					$update_sql = "UPDATE 
										".$this->db->dbprefix(GAME)." 
									SET 
										status = 'closed' , 
										modified_date = '".format_date()."' 
									WHERE 
										game_unique_id = '".$value['game_unique_id']."' 
									AND
										game_id = '".$value['game_id']."'	
									AND
										league_id = $league_id
									";
					//echo "<br>";		
					$rs = $this->db->query($update_sql); 
				}	
			}
		}
	}


	protected function get_league_position($league_id ='')
	{
		$rs = $this->db->select('position_name, position_desc')
						->from(LEAGUE_POSITION ." AS LP")
						->join(MASTER_POSITION." AS MP" , 'MP.master_position_id = LP.master_position_id', 'inner')
						->where('LP.league_id', $league_id)
						->get();
		$result = $rs->result_array();

		if(!empty($result)){
			$positions = array();
			foreach($result as $val){
				$positions[] = $val['position_name'];
			}

			return $positions;

		} else {
			return array();
		}


	}

}


//End of file