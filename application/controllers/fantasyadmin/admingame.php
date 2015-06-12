<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Admingame extends REST_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->model('admin/Game_model', 'Game_model');
        $this->load->library('encrypt');
        if ($this->user_type_admin != ADMIN_TYPE)
        {
            redirect('./fantasyadmin');
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = $data;
    }

    public function template_get($view = "")
    {
        $this->load->view("game/$view", $this->data);
    }

    public function gamelist_get()
    {
        $this->data['page'] = 'admingame';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    public function newgame_get()
    {
        $this->data['page'] = 'admingame';
        $this->data['content_view'] = 'game/newgame';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    public function get_all_sports_post()
    {
        $result = $this->Game_model->get_all_sports();
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['data'] = $result;
        $this->response($this->return, 200);
    }

    public function get_all_games_post()
    {
        $limit = 10;
        $data_post = $this->input->post();
//        print_r($data_post);die;
        $start = $data_post['start'];
        $fieldname = $data_post['field'];
        $order = $data_post['order'];
        if ($data_post['limit']) {
            $limit = $data_post['limit'];
        }
        $offset = $start;

        $config['limit'] = $limit;
        $config['start'] = $start;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;
        $config['list_for'] = $data_post['list_for'];
        $config['league_id'] = $data_post['league_id'];

        $gamelist = $this->Game_model->get_all_games($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Game_model->get_all_games($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'gamelist' => $gamelist,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }

    function get_all_game_data_post()
    {
        $this->load->model('Common_model');
        $seasons_dates = $this->Game_model->get_season_date();
        $all_duration = $this->Game_model->get_all_duration();
        $all_salary_cap = $this->Game_model->get_all_salary_cap();
        $all_available_week = $this->Game_model->get_all_available_week();
        $number_of_winner = $this->Game_model->get_all_number_of_winner();
        $size_list = $this->Common_model->get_all_fee_size(array('action_from' => 'admin', 'action_for' => 'size'));
        $fee_list = $this->Common_model->get_all_fee_size(array('action_from' => 'admin', 'action_for' => 'fee'));
        $master_data_entry = $this->Game_model->get_all_master_data_entry();
        $result = array(
                  'seasons_dates' => $seasons_dates,
                  'all_duration' => $all_duration,
                  'all_salary_cap' => $all_salary_cap,
                  'all_available_week' => $all_available_week,
                  'all_number_of_winner' => $number_of_winner['all_number_of_winner'],
                  'number_of_winner_validation' => $number_of_winner['number_of_winner_validation'],
                  'size_list' => $size_list,
                  'fee_list' => $fee_list,
                  'master_data_entry' => $master_data_entry
        );

        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['data'] = $result;
        $this->response($this->return, 200);
    }

    function get_all_drafting_style_post()
    {
        $result = $this->Game_model->get_all_drafting_style();
        $this->echo_Jason($result);
    }

    function get_available_game_of_the_day_or_week_post($return_only = FALSE)
    {
        $game_list = $this->Game_model->get_available_game_of_the_day_or_week();
        $result = TRUE;

        @$home = array_column($game_list, 'home');
        @$away = array_column($game_list, 'away');

        if (!is_array($home))
            $home = array();

        if (!is_array($away))
            $away = array();

        $home_away = array_merge($home, $away);
        $home_away = array_unique($home_away);

        if (!$game_list)
            $game_list = array();
        if ($this->input->post('entry_fee') != 0)
        {
            if (count($home_away) < 3)
                $result = FALSE;
        }
        
        $response['game_list'] = $game_list;
        $response['result'] = $result;

        if ($return_only)
            return $result;
        else
            $this->echo_Jason($response);
    }

    public function create_game_post()
    {
        $this->load->model('Common_model');
        if ($this->input->post())
        {
            $this->form_validation->set_rules('game_name', 'Game name', 'trim|required');
            $this->form_validation->set_rules('league_id', 'Sport', 'trim|required');
            $this->form_validation->set_rules('league_duration_id', 'Game duration', 'trim|required');
            $this->form_validation->set_rules('duration_id', 'Game duration', 'trim|required');

            if ($this->input->post('duration_id') == 1) //Daily
            {
                $this->form_validation->set_rules('date', 'Date', 'trim|required');
                $this->form_validation->set_rules("buckets", 'Game time', 'trim|required');
            } elseif ($this->input->post('duration_id') == 2) //Weekly
            {
                $this->form_validation->set_rules('season_week_id', 'Week', 'trim|required');
            } 

            $this->form_validation->set_rules('league_drafting_styles_id', 'Drafting style', 'trim|required');
            $this->form_validation->set_rules('league_salary_cap_id', 'Salary Cap', 'trim|required');
            $this->form_validation->set_rules('size', 'Size', 'trim|required');
            $this->form_validation->set_rules('entry_fee', 'Entry Fee', 'trim|required');
            $this->form_validation->set_rules('league_number_of_winner_id', 'Prizing', 'trim|required');

            if ($this->form_validation->run())
            {
                
                if (!$this->get_available_game_of_the_day_or_week_post(TRUE))
                {                    
                    $this->return[$this->rest_status_field_name] = FALSE;
                    $this->return['message'] = $this->lang->line('invalid_game_size');
                    $this->response($this->return, 200);
                }
                
                $game_data = $this->input->post();
                $game_data['gamelist'] = $game_data['gamelist[]'];
                unset($game_data['gamelist[]']);
                $list_game_date_wise = $this->Game_model->get_list_of_game_date_wise($game_data['gamelist']);

                $home_away = array_column($list_game_date_wise, 'home', 'away');
                $away_home = array_column($list_game_date_wise, 'away', 'home');

                foreach ($list_game_date_wise as $key => $value)
                {
                    $list_of_games[] = $value['season_game_unique_id'];
                }

                $game_data['selected_matches'] = implode(',', $list_of_games);

                if (!isset($game_data['season_week_id']) || !$game_data['season_week_id'])
                {
                    $game_data['season_week_id'] = '0';
                }
                
                $this->load->helper('string');
                $game_data['game_unique_id'] = random_string('alnum', 9);

                if ($this->input->post('duration_id') == 1) //Daily
                {
                    $game_data['season_scheduled_date'] = $this->Game_model->get_season_scheduled_date($list_of_games[0], $this->input->post('league_id'));
                    $game_data['season_week_id'] = $this->Common_model->get_current_week($this->input->post('league_id'), $game_data['season_scheduled_date']);
                } else if ($this->input->post('duration_id') == 2) //Weekly
                {
                    $game_data['season_scheduled_date'] = $this->Game_model->get_season_scheduled_date($list_of_games[0], $this->input->post('league_id'));

                    unset($game_data['buckets']);
                } 

                unset($game_data['date']);
                unset($game_data['duration_id']);
                unset($game_data['gamelist']);


                $config['where'] = array('league_id' => $this->input->post('league_id'));
                $config['fields'] = 'player_salary_master_id';
                $config['sort_field'] = 'player_salary_master_id';
                $config['sort_order'] = 'DESC';
                $config['limit'] = 0;
                $config['only_one_record'] = TRUE;
                
                $this->Game_model->table_name = PLAYER_SALARY_MASTER;
                $player_salary_master_data = $this->Game_model->get($config);

                if ($this->input->post('is_feature') == 1)
                {
                    $game_data['disable_auto_cancel'] = '1';
                }

                if ($this->input->post('is_uncapped') == 1)
                {
                    $game_data['size'] = UNCAPPED_GAME_SIZE;
                    $game_data['disable_auto_cancel'] = '1';
                }
                if (isset($game_data['is_uncapped']))
                {
                    unset($game_data['is_uncapped']);
                }

                if (isset($player_salary_master_data['player_salary_master_id']))
                {  
                   
                    $game_data['player_salary_master_id'] = $player_salary_master_data['player_salary_master_id'];
                    $game_data['created_date'] = format_date();
                    $game_data['modified_date'] = format_date();
                    if ($game_data['prize_type'] == 'Manual')
                    {
                        $prize_pool_data = ($this->Common_model->prize_details_by_size_fee_prizing($game_data['size'], $game_data['entry_fee'], $game_data['league_number_of_winner_id']) );
                        $game_data['prize_pool'] = array_sum(array_map("format_num_callback", $prize_pool_data));
                    } else
                    {
                        $game_data['prize_pool'] = $game_data['prize_pool'];
                    }
                    unset($game_data['prize_type']);

                    if($game_data['prize_pool']=='')
                    {
                       unset($game_data['prize_pool']);
                    }
                    
                    $game_data['serial_no'] = $this->genrate_game_serial_no($game_data, 'salary_cap');

                    $this->Game_model->table_name = GAME;
                    //print_r( $game_data);die;
                    $game_id = $this->Game_model->insert($game_data);
                    
                    $this->return[$this->rest_status_field_name] = FALSE;
                    $this->return['message'] = $this->lang->line('game_added');
                    $this->response($this->return, 200);
                } else
                {                    
                    $this->return[$this->rest_status_field_name] = FALSE;
                    $this->return['message'] = $this->lang->line('player_release_error');
                    $this->response($this->return, 200);
                }

                redirect('admin');
            } else
            {                
                $this->return[$this->rest_status_field_name] = FALSE;
                $this->return['message'] = validation_errors();
                $this->response($this->return, 200);
            }
        }
    }

    function genrate_game_serial_no($arg_array = array(), $genrate_no_for = "")
    {
        switch ($genrate_no_for)
        {
            case 'OMO':
                // get season week number 					
                $arg_array = array(
                          'year_of_competion' => substr(date('Y'), -2, 4),
                          'audience' => 1, // open for all created by admin
                          'sport' => 1, // 1: for NFL
                          'round_no' => $arg_array['season_week_id'],
                          'game_type' => 1, // 1: for odd man out
                          'game_selection' => 1, // 1: for pre match
                          'rs_player_selector' => 1, // 1: for solo
                          'game_duration' => 1, // 1: for double header
                          'real_game' => '', // Game in round
                          'fee_paid' => ($arg_array['entry_fee'] == '0') ? 'F' : 'P',
                          'entry_fee' => $arg_array['entry_fee'],
                          'allow_entrants' => $arg_array['size']
                );

                $serial_no = $arg_array['year_of_competion'] . $arg_array['audience'] . $arg_array['sport'] .
                  $arg_array['round_no'] . $arg_array['game_type'] . $arg_array['game_selection'] .
                  $arg_array['rs_player_selector'] . $arg_array['game_duration'] . $arg_array['real_game'] .
                  $arg_array['fee_paid'] . $arg_array['entry_fee'] . $arg_array['allow_entrants'];

                $check_exist = $this->db->query('SELECT serial_no  FROM ' . $this->db->dbprefix . GAME . ' 
					WHERE 
					serial_no 
					LIKE "' . $serial_no . '%" 
					order by game_id desc')->row_array();


                if (empty($check_exist))
                {
                    $return_serial_no = $serial_no . '.1';
                } else
                {
                    $split_dot = explode('.', $check_exist['serial_no']);
                    $return_serial_no = $serial_no . '.' . ($split_dot[1] + 1);
                }
                return $return_serial_no;
                break;
            case 'salary_cap':
                // get season week number 					
                $arg_array = array(
                          'year_of_competion' => substr(date('Y'), -2, 4),
                          'audience' => 1, // open for all created by admin
                          'sport' => 1, // 1: for NFL
                          'round_no' => $arg_array['season_week_id'],
                          'game_type' => 2, // 1: for odd man out
                          'game_selection' => 1, // 1: for pre match
                          'rs_player_selector' => 1, // 1: for solo
                          'game_duration' => 1, // 1: for double header
                          'real_game' => '', // Game in round
                          'fee_paid' => ($arg_array['entry_fee'] == '0') ? 'F' : 'P',
                          'entry_fee' => $arg_array['entry_fee'],
                          'allow_entrants' => $arg_array['size']
                );

                $serial_no = $arg_array['year_of_competion'] . $arg_array['audience'] . $arg_array['sport'] .
                  $arg_array['round_no'] . $arg_array['game_type'] . $arg_array['game_selection'] .
                  $arg_array['rs_player_selector'] . $arg_array['game_duration'] . $arg_array['real_game'] .
                  $arg_array['fee_paid'] . $arg_array['entry_fee'] . $arg_array['allow_entrants'];

                $check_exist = $this->db->query('SELECT serial_no  FROM ' . $this->db->dbprefix . GAME . ' 
					WHERE 
					serial_no 
					LIKE "' . $serial_no . '%" 
					order by game_id desc')->row_array();


                if (empty($check_exist))
                {
                    $return_serial_no = $serial_no . '.1';
                } else
                {
                    $split_dot = explode('.', $check_exist['serial_no']);
                    $return_serial_no = $serial_no . '.' . ($split_dot[1] + 1);
                }

                return $return_serial_no;
                break;
            default:
                break;
        }
    }

}
