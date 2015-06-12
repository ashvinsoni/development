<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';
class Adminusers extends REST_Controller {

    function __construct() 
    {
        parent::__construct();
        $this->load->model('admin/Users_model','Users_model');
        $this->load->library('encrypt');
        if($this->user_type_admin!=ADMIN_TYPE)
        {
            redirect('./fantasyadmin');
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = $data;        
    }
    public function template_get($view = "") 
    {               
        $this->load->view("adminusers/$view", $this->data);
    }

    public function user_get() 
    {   $this->data['page'] = 'users';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }
 
    /**
     * @Summary		: Get List all user list
     * @access 		: public
     * @param            : Null
     * @return 		: player list json array
     */
    public function get_all_user_detail_post() 
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
        $config['is_csv'] = $data_post['is_csv'];
        $config['filter_name'] = $filter_name;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;

        $user_data = $this->Users_model->get_all_user_detail($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Users_model->get_all_user_detail($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'user_data' => $user_data,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }
    
    
    function update_user_status_post()
    {
        $user_id = $this->input->post('ui');
        $status = $this->input->post('status');
        if(!empty($user_id))
        {       
            $this->Users_model->update_user_status($user_id,$status);
            $this->return[$this->rest_status_field_name] = TRUE;
            $this->return['message'] = "User status updated successfully.";
            $this->response($this->return, 200);
        }
        else
        {
            $this->return[$this->rest_status_field_name] = FALSE;
            $this->return['message'] = "Try again.......";
            $this->response($this->return, 200);
        }
    }
}
