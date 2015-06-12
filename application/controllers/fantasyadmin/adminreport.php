<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Adminreport extends REST_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('admin/Report_model', 'Report_model');
        $this->load->library('encrypt');
        if ($this->user_type_admin != ADMIN_TYPE) {
            redirect('./fantasyadmin');
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = $data;
    }

    public function template_get($view = "") {
        $this->load->view("report/$view", $this->data);
    }

    public function user_report_get() {
        $this->data['page'] = 'report';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }    
    
    /**
     * @Summary		: Get List of sales person
     * @access 		: public
     * @param            : Null
     * @return 		: sales person list json array
     */
    public function get_all_user_report_post() {

        $limit = 10;
        $data_post = $this->input->post();
//        print_r($data_post);die;
        $start = $data_post['start'];
        $filter_name = (isset($data_post['search_keyword'])) ? $data_post['search_keyword'] : '';
        $fieldname = $data_post['field'];
        $order = $data_post['order'];
        if ($data_post['limit']) {
            $limit = $data_post['limit'];
        }
        $offset = $start;

        $config['limit'] = $limit;
        $config['start'] = $start;
        $config['from_date'] = $data_post['from_date'];
        $config['to_date'] = $data_post['to_date'];
        $config['filter_name'] = $filter_name;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;
        $config['where'] = array();
        $config['is_csv'] = $data_post['is_csv'];
        $users = $this->Report_model->get_all_user_report($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Report_model->get_all_user_report($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'report' => $users,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }
    
    
    function contest_report_get()
    {
        $this->data['page'] = 'report';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }
    
    
    function get_all_contest_report_post()
    {
        $limit = 10;
        $data_post = $this->input->post();
//        print_r($data_post);die;
        $start = $data_post['start'];
        $filter_name = (isset($data_post['search_keyword'])) ? $data_post['search_keyword'] : '';
        $fieldname = $data_post['field'];
        $order = $data_post['order'];
        if ($data_post['limit']) {
            $limit = $data_post['limit'];
        }
        $offset = $start;

        $config['limit'] = $limit;
        $config['start'] = $start;
        $config['from_date'] = $data_post['from_date'];
        $config['to_date'] = $data_post['to_date'];
        $config['filter_name'] = $filter_name;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;
        $config['where'] = array();
        $config['is_csv'] = $data_post['is_csv'];
        $contests = $this->Report_model->get_all_contest_report($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Report_model->get_all_contest_report($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'report' => $contests,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
	}
        
    function games_report_get()
        {
        $this->data['page'] = 'report';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    function get_all_games_report_post()
    {
        $limit = 10;
        $data_post = $this->input->post();
        //        print_r($data_post);die;
        $start = $data_post['start'];
        $filter_name = (isset($data_post['search_keyword'])) ? $data_post['search_keyword'] : '';
        $fieldname = $data_post['field'];
        $order = $data_post['order'];
        if ($data_post['limit'])
        {
            $limit = $data_post['limit'];
        }
        $offset = $start;

        $config['limit'] = $limit;
        $config['start'] = $start;
        $config['from_date'] = $data_post['from_date'];
        $config['to_date'] = $data_post['to_date'];
        $config['filter_name'] = $filter_name;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;
        $config['where'] = array();
        $config['is_csv'] = $data_post['is_csv'];
        $games = $this->Report_model->get_all_games_report($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Report_model->get_all_games_report($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'report' => $games,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }

}
