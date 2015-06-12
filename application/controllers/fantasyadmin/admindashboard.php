<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';
class Admindashboard extends REST_Controller {

    function __construct() {
        
        parent::__construct();
        // $this->isAllowedUser(array(ADMIN_TYPE), 'user_type_admin');
        $this->load->model( 'admin/Dashboard_model','Dashboard_model' );
        // debug($this->session->all_userdata());die;
        if ($this->user_type_admin != ADMIN_TYPE) {
            redirect('./fantasyadmin');
        }
    }

    public function template_get($view = "") { 
        $this->load->view("dashboard/$view", $this->data);
    }

    public function dashboard_get() {  
        $this->data['page'] = 'dashboard';
        $this->load->view('admintemplate/layout', $this->data);
    }
    
    public function get_dashboard_detail_post(){
        $filter = $this->post();
        $result = $this->Dashboard_model->get_dashboard_detail($filter);
        if(!empty($filter)){
                $this->return[$this->rest_status_field_name] = TRUE;
                $this->return['data'] = $result;
                $this->response($this->return, 200);
        }else{
            $error = "please";
            $this->return[$this->rest_status_field_name] = FALSE;
            $this->return['error'] = $error;
            $this->response($this->return, 400);
        }
    }
    public function get_dashboard_chart_post(){
        $filter = $this->post();
        $result = $this->Dashboard_model->get_dashboard_chart($filter);
        if(!empty($filter)){
                $this->return[$this->rest_status_field_name] = TRUE;
                $this->return['data'] = $result;
                $this->response($this->return, 200);
        }else{
            $error = "please";
            $this->return[$this->rest_status_field_name] = FALSE;
            $this->return['error'] = $error;
            $this->response($this->return, 400);
        }
    }
}