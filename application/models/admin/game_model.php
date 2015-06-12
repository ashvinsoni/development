<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Game_model extends MY_Model
{

    function __construct()
    {
        parent::__construct();
    }

    function get_all_sports()
    {
        $sql = $this->db->select('league_id`, league_desc')
          ->from(LEAGUE . " AS L")
          ->join(MASTER_SPORTS . " AS MS", "MS.sports_id = L.sports_id", 'INNER')
          ->where('L.active', ACTIVE)
          ->where('MS.active', '1')
          ->order_by('L.league_id', 'ASC')
          ->get();
        $config = $sql->result_array();
        return array_column($config, 'league_desc', 'league_id');
    }

    function get_all_games($config = array(),$is_total = false)
    {        
        $league_condition = (isset($config['league_id']) && $config['league_id'] != '-' && $config['league_id'] != '') ? " `G`.`league_id` = " . $config['league_id'] . " AND " : "";

        switch ($config['list_for'])
        {
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

        $limit_condition = ($config['is_total'] === FALSE) ? "limit  " . $config['start'] . ", " . $config['limit'] . "" : "";


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
			 	" . $league_condition . " 
			 	" . $game_type_condition . "";
			
  
        if ($config['filter_name'] != '')
        {
            $sql.= ' Where  U.user_name LIKE "%' . $config['filter_name'] . '%"  ';
        }
        $sql.= " GROUP BY 
				`G`.`game_unique_id`";
        if ($config['fieldname'] != '' && $config['order'] != '')
        {
            $sql.= ' ORDER BY ' . $config['fieldname'] . ' ' . $config['order'] . '';
        } else
        {
            $sql.= ' ORDER BY G.game_id DESC';
        }
        if ($config['limit'] == 'null')
        {
            $sql.= ' LIMIT 10';
        }

        if ($is_total === FALSE)
        {
            $sql.= ' LIMIT ' . $config['start'] . ', ' . $config['limit'] . '';
        }
        //echo $sql;die;
        $query = $this->db->query($sql);
        if ($is_total === FALSE)
        {
            return $query->result_array();
        } else
        {
            return $query->num_rows();
        }
    }

    function get_all_duration()
    {
        $league_id = $this->input->post('league_id');
        $sql = $this->db->select('MD.duration_desc, LD.league_duration_id, MD.duration_id')
          ->from(LEAGUE_DURATION . " AS LD")
          ->join(MASTER_DURATION . " AS MD", "MD.duration_id = LD.duration_id", 'INNER')
          ->where('LD.active', ACTIVE)
          ->where('LD.league_id', $league_id)
          ->get();
        $config = $sql->result_array();
        return $config;
    }

    function get_all_salary_cap()
    {
        $league_id = $this->input->post('league_id');
        $sql = $this->db->select('salary_cap, league_salary_cap_id')
          ->from(MASTER_SALARY_CAP . " AS MSC")
          ->join(LEAGUE_SALARY_CAP . " AS LSC", "LSC.salary_cap_id = MSC.salary_cap_id", 'INNER')
          ->where('LSC.admin_active', ACTIVE)
          ->where('LSC.league_id', $league_id)
          ->get();
        $config = $sql->result_array();
        return array_column($config, 'salary_cap', 'league_salary_cap_id');
    }

    function get_all_available_week()
    {
        $this->table_name = SEASON_WEEK;
        $league_id = $this->input->post('league_id');

        $this->load->model('api_credential_model');
        $api = $this->api_credential_model->active_feed_provide_season_year($league_id);
        //echo "<pre>";print_r($api);die;
        $season_type = $api['season'];
        $season_year = $api['year'];

        $sql = $this->db->select('season_week, season_week_start_date_time, season_week_end_date_time')
          ->from(SEASON_WEEK . " AS SW")
          ->where('SW.league_id', $league_id)
          ->where('SW.season_week_start_date_time > ', format_date('today', 'Y-m-d H:i:s'))
          ->where('SW.type', $season_type)
          ->order_by('SW.season_week', 'ASC')
          ->get();
        $result = $sql->result_array();
        $final_result = array();
        foreach ($result as $key => $value)
        {
            $season_week = $value['season_week'];
            $season_week_start_date_time = $value['season_week_start_date_time'];
            $season_week_end_date_time = $value['season_week_end_date_time'];
            $final_result[$season_week] = $season_week . ' ( ' . date('d-M-y', strtotime($season_week_start_date_time)) . ' ' . date('d-M-y', strtotime($season_week_end_date_time)) . ' )';
        }
        return $final_result;
    }

    function get_all_number_of_winner()
    {
        $league_id = $this->input->post('league_id');
        $sql = $this->db->select('MNOW.number_of_winner_id,number_of_winner_desc,league_number_of_winner_id,position_or_percentage,places')
          ->from(MASTER_NUMBER_OF_WINNER . " AS MNOW")
          ->join(LEAGUE_NUMBER_OF_WINNER . " AS LNW", "LNW.number_of_winner_id = MNOW.number_of_winner_id", 'INNER')
          ->where('LNW.active', ACTIVE)
          ->where('LNW.league_id ', $league_id)
          ->where('MNOW.status', '1')
          ->order_by('order', 'ASC')
          ->get();
        $result = $sql->result_array();

        return array('all_number_of_winner' => array_column($result, 'number_of_winner_desc', 'number_of_winner_id'), 'number_of_winner_validation' => $result);
    }

    function get_season_date()
    {
        $league_id = $this->input->post('league_id');
        $this->load->model('api_credential_model');
        $api = $this->api_credential_model->active_feed_provide_season_year($league_id);
        //echo "<pre>";print_r($api);die;
        $season_type = $api['season'];
        $season_year = $api['year'];

        $sql = $this->db->select('scheduled_date')
          ->from(SEASON . " AS S")
          ->where('S.league_id', $league_id)
          ->where('S.type', $season_type)
          ->where('S.year', $season_year)
          ->where('S.season_scheduled_date >', format_date())
          ->group_by('scheduled_date')
          ->order_by('scheduled_date', 'DESC')
          ->get();
        $result = $sql->result_array();

        $season_time = array();

        foreach ($result as $key => $value)
        {
            $seasone_date_time_format = $value['scheduled_date'];
            $timestamp = strtotime($seasone_date_time_format);
            // $season_time[] = format_date ( $timestamp , 'Y-m-d' );
            $season_time[] = $seasone_date_time_format;
        }

        return $season_time;
    }

    function get_all_drafting_style()
    {
        $league_duration_id = $this->input->post('league_duration_id');
        $sql = $this->db->select('league_drafting_styles_id, drafting_styles_desc')
          ->from(MASTER_DRAFTING_STYLES . " AS MDS")
          ->join(LEAGUE_DRAFTING_STYLES . " AS LDS", "LDS.drafting_styles_id = MDS.drafting_styles_id", 'INNER')
          ->where('league_duration_id', $league_duration_id)
          ->where('active', ACTIVE)
          ->where('LDS.drafting_styles_id !=', '4')
          ->get();
        $result = $sql->result_array();
        return array_column($result, 'drafting_styles_desc', 'league_drafting_styles_id');
    }

    function get_all_master_data_entry()
    {
        $sql = $this->db->select('data_desc,admin_fixed,admin_lower_limit,admin_upper_limit')
          ->from(MASTER_DATA_ENTRY . " AS MDE")
          ->get();
        $result = $sql->result_array();
        return $result;
    }

    function get_available_game_of_the_day_or_week()
    {
        $result = array();

        if ($this->input->post('duration_id') == 1 && $this->input->post('date') && $this->input->post("buckets")) //Daily
        {
            $date = $this->input->post('date');
            $time = "`S` . `scheduled_date` = '$date'";

            if ($this->input->post("buckets") == '1') //All
            {
                $time = "`S` . `scheduled_date` = '$date'";
            } elseif ($this->input->post("buckets") == '2') //Early
            {
                $start_time = $date . ' 00:00:00';
                $end_time = $date . ' 13:59:59';
                $time = "( DATE_FORMAT( `S`.`season_scheduled_date` , '%Y-%m-%d %H:%i:%s' ) BETWEEN '$start_time' AND '$end_time' )";
            } elseif ($this->input->post("buckets") == '3') //Later
            {
                $start_time = $date . ' 14:00:00';
                $end_time = $date . ' 23:59:59';
                $time = "( DATE_FORMAT( `S`.`season_scheduled_date` , '%Y-%m-%d %H:%i:%s' ) BETWEEN '$start_time' AND '$end_time' )";
            } elseif ($this->input->post("buckets") == '4') //Night
            {
                $start_time = $date . ' 19:00:00';
                $end_time = $date . ' 23:59:59';
                $time = "( DATE_FORMAT( `S`.`season_scheduled_date` , '%Y-%m-%d %H:%i:%s' ) BETWEEN '$start_time' AND '$end_time' )";
            }

            $sql = "SELECT `season_game_unique_id`,`home` , `away` , DATE_FORMAT( `S`.`season_scheduled_date` , '%l:%i %p' ) AS `season_scheduled_date`, DATE_FORMAT(`S`.`scheduled_date`, '%W') AS day_name 
                        FROM 
                                `" . $this->db->dbprefix(SEASON) . "` AS `S` 
                        WHERE 
                                $time 
                        AND
                                `league_id` = '" . $this->input->post('league_id') . "' 
                        AND 
                                ('" . format_date() . "'<`S`.`season_scheduled_date` || '" . format_date() . "'=`S`.`season_scheduled_date`)
                        ORDER BY 
                                `S`.`season_scheduled_date`
                        ASC
                        ";

            $result = $this->run_query($sql);
        } else if ($this->input->post('duration_id') == 2 && $this->input->post('season_week_id')) //Weekly
        {
            $week = $this->input->post('season_week_id');
            $sql = "SELECT `season_game_unique_id`,`home` , `away` , DATE_FORMAT( `S`.`season_scheduled_date` , '%l:%i %p' ) AS `season_scheduled_date`,DATE_FORMAT(`S`.`scheduled_date`, '%W') AS day_name
                        FROM 
                                `" . $this->db->dbprefix(SEASON) . "` AS `S` 
                        WHERE 
                                `week` = $week 
                        AND
                                `league_id` = '" . $this->input->post('league_id') . "' 
                        AND 
                                ('" . format_date() . "'<`S`.`season_scheduled_date` || '" . format_date() . "'=`S`.`season_scheduled_date`)
                        ORDER BY 
                                `S`.`season_scheduled_date` 
                        ASC
                        ";
            $result = $this->run_query($sql);
        } else if ($this->input->post('duration_id') == 3 && $this->input->post('season_week_id')) //Custom Weekly
        {
            $week = $this->input->post('season_week_id');
            $sql = "SELECT `season_game_unique_id`,`home` , `away` , DATE_FORMAT( `S`.`season_scheduled_date` , '%l:%i %p' ) AS `season_scheduled_date`,DATE_FORMAT(`S`.`scheduled_date`, '%W') AS day_name
                        FROM 
                                `" . $this->db->dbprefix(SEASON) . "` AS `S` 
                        WHERE 
                                `week` = $week 
                        AND
                                `league_id` = '" . $this->input->post('league_id') . "' 
                        AND 
                                ('" . format_date() . "'<`S`.`season_scheduled_date` || '" . format_date() . "'=`S`.`season_scheduled_date`)
                        ORDER BY 
                                `S`.`season_scheduled_date` 
                        ASC
					";
            $result = $this->run_query($sql);
        }

        return $result;
    }

    public function get_list_of_game_date_wise($gamelist)
    {
        foreach ($gamelist as $key => $value)
        {
            $a[] = "'" . $value . "'";
        }
        $id_string = implode(',', $a);

        $sql = "SELECT `season_game_unique_id`,`home`,`away`,`season_scheduled_date`
					FROM " . $this->db->dbprefix . SEASON . " 
						WHERE `season_game_unique_id` IN (" . $id_string . ") ORDER BY season_scheduled_date ASC";
        //echo $sql;
        $rs = $this->db->query($sql);
        $result = $rs->result_array();
        return $result;
    }

    function get_season_scheduled_date($season_game_unique_id, $league_id)
    {
        $sql = "SELECT
                        `S`.`season_scheduled_date`
                FROM
                        `" . $this->db->dbprefix(SEASON) . "` AS `S` 
                WHERE
                        `S`.`season_game_unique_id` = '" . $season_game_unique_id . "'
                AND
                        `S`.`league_id` = " . $league_id . "
                GROUP BY
                        `S`.`season_scheduled_date`
                ORDER BY
                        `S`.`season_scheduled_date` ASC
                LIMIT
                        0 , 1
                ";
        //echo $sql;die;
        $result = $this->run_query($sql, 'row_array');
        $season_scheduled_date = '0000-00-00 00:00:00';
        if (isset($result['season_scheduled_date']))
            $season_scheduled_date = $result['season_scheduled_date'];
        return $season_scheduled_date;
    }

}
