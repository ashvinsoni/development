<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Adminroster extends REST_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('admin/Adminroster_model', 'Adminroster_model');
        $this->load->library('encrypt');
        if ($this->user_type_admin != ADMIN_TYPE) {
            redirect('./fantasyadmin');
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = $data;
    }

    public function template_get($view = "") {
        $this->load->view("rostermanagement/$view", $this->data);
    }

    public function roster_get() {
        $this->data['page'] = 'roster';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }
    
    public function get_all_sports_post()
    {
        $result = $this->Adminroster_model->get_all_sports();
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['data'] = $result;
        $this->response($this->return, 200);
    }
    
    /**
	* @Summary		: Get List of all players	
	* @access 		: public
	* @param 		: Null
	* @return 		: player list json array
	*/
	public function get_all_roster_post() { 
        $limit = 100;  
        $data_post = $this->input->post(); 
        //print_r($data_post);die;
        $start = $data_post['start'];
        $filter_name = (isset($data_post['search_keyword'])) ? $data_post['search_keyword'] : '';
        $filterposition = (isset($data_post['filterposition'])) ? $data_post['filterposition'] : '';
        $fieldname = $data_post['field'];
        $order = $data_post['order'];
        if ($data_post['limit']) {
            $limit = $data_post['limit'];
        }
        $offset = $start;
          
        $config['team_abbreviation'] = (isset($data_post['team_abbreviation'])) ? $data_post['team_abbreviation'] : '';
        $config['league_id'] = (isset($data_post['league_id'])) ? $data_post['league_id'] : '';
        $config['limit'] = $limit;
        $config['start'] = $start;
        $config['filter_name'] = $filter_name;
        $config['filterposition'] = $filterposition;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;

        $position  = $team  = "";
        if (isset($data_post['league_changed'])  && $data_post['league_changed'] != "") {
        	$position  = $this->Adminroster_model->get_all_position( $config['league_id'] );
			$team      = $this->Adminroster_model->get_all_team( $config['league_id'] );
        }

        $roster = $this->Adminroster_model->get_all_roster($config, false);
        $config['count_only'] = TRUE;
      
        $total = $this->Adminroster_model->get_all_roster($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
        						'roster' => $roster, 
        						'start' => $offset, 
        						'position' => $position, 
        						'team' => $team, 
        						'total' => $total, 
        						'field_name' => $fieldname, 
        						'order_sequence' => 
        						$order_sequence
        						)
        ));
    }
    
    
    function release_player_post()
	{
        
		$result = 0;
//		if ( $this->input->is_ajax_request() )
//		{			
			if ( $this->input->post( 'league_id' ) )
			{
				//update previous salary for every update
					$this->Adminroster_model->update_previous_salary_to_current();

				$this->update_temp_roster_post( FALSE );
				$result = $this->Adminroster_model->release_player();
			}
		//}
		if ( $result === TRUE )
		{
			 $this->return[$this->rest_status_field_name] = TRUE;
                $this->return['message'] = "Player Information Released Successfully..";
                $this->response($this->return, 200);
		}
		else
		{
			$this->return[$this->rest_status_field_name] = FALSE;
                $this->return['message'] = "Please try again......";
                $this->response($this->return, 200);
		}
	}
     
     
     function update_temp_roster_post( $external = TRUE )
	{
		$player_unique_ids = $this->input->post( 'player_unique_id' );          
		$active = $this->input->post( 'status' );

		if ( empty( $player_unique_ids ) )
		{
			$player_unique_ids = array();
		}

		foreach ( $player_unique_ids as $key => $player_unique_id )
		{
			$salary        = $this->input->post( 'salary_'.$player_unique_id );
			$injury_status = $this->input->post( 'injury_status_'.$player_unique_id );
			$weightage        = $this->input->post( 'weightage_'.$player_unique_id );
               	
			$condition = array( 'player_unique_id' => $player_unique_id , 'league_id' => $this->input->post('league_id') );

			$this->Adminroster_model->table_name = PLAYER;
			$player_configs[ 'injury_status' ] = $injury_status;

			$this->Adminroster_model->update( $condition , $player_configs );

			$this->Adminroster_model->table_name = PLAYER_TEMP;

			$conut_config[ 'count_only' ] = TRUE;
			$conut_config[ 'where' ]      = $condition;
			
			if ( $active != '' )
				$config[ 'active' ] = $active;
			$config[ 'player_unique_id' ] = $player_unique_id;
               $config[ 'league_id' ] = $this->input->post('league_id');
			$config[ 'salary' ] = $salary;
			$config[ 'weightage' ] = $weightage;
			$this->Adminroster_model->replace_into_batch(PLAYER_TEMP,array($config));				
		}

		if ( $external === TRUE )
		{
			 $this->return[$this->rest_status_field_name] = TRUE;
                $this->return['message'] = "Player Updated Successfully.";
                $this->response($this->return, 200);
		}
		else
		{
			return TRUE;
		}
	}
}
