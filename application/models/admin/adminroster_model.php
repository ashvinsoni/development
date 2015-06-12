<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Adminroster_model extends MY_Model
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
	    $configs['where']  = array('active' => ACTIVE ,PLAYER_TEMP.'.league_id'=>$this->input->post( 'league_id' ));
	 
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
	 
	        $this->insert_batch( $player_temp_data );
             return TRUE;
	    }
	    else
	    {
	        return FALSE;
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
}