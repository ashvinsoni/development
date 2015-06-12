<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

class Adminauth extends REST_Controller {

    function __construct()
    {
        parent::__construct();

        $this->load->model('admin/Adminauth_model', 'Adminauth_model');
        $this->load->library('security');
        $this->load->helper('url');
        
        $data = json_decode(file_get_contents('php://input'),true);
  		$_POST = $data;
    }

    public function template_get($view = "")
    {
        $this->load->view("admintemplate/$view", $this->data);
    }

    public function login_get() 
    {
        if ($this->input->post()) 
        {
            $this->form_validation->set_rules('email', 'Login', 'trim|required|xss_clean|valid_email');
            $this->form_validation->set_rules('password', 'Password', 'trim|required|xss_clean');
            $this->form_validation->set_rules('remember', 'Remember me', 'integer');
            if ($this->form_validation->run()) 
            {                
                $data = $this->Adminauth_model->admin_login($this->input->post('email'), $this->input->post('password'));
                
                if ($data != NULL) 
                {
                    $this->session->set_userdata(array('admin_id' => $data->id, 'email' => $data->email, 'name' => $data->firstname . ' ' . $data->lastname, 'user_type_admin' => ADMIN_TYPE));
                    
                    if ($this->input->is_ajax_request())
                    {
                        $this->echo_Jason(array('status' => TRUE));
                        die;
                    } 
                    else 
                    {
                        redirect(ADMIN_DEFAULT_REDIRECT);
                    }
                }

                $this->session->set_flashdata('error_message', 'Incorrect credentials!');

                if ($this->input->is_ajax_request()) 
                {
                    $this->echo_Jason(array('status' => FALSE, 'error' => array('error_message' => 'Incorrect credentials!')));
                } else 
                {
                    redirect('fantasyadmin');
                }
            } 
            else 
            {
                if ($this->input->is_ajax_request()) 
                {
                    $this->echo_Jason(array('status' => FALSE, 'error' => $this->form_validation->get_error_arr()));
                } 
                else 
                {
                    $this->data['error_message'] = strip_tags(validation_errors());
                }
            }
        }

        if (isset($this->data['error_message']) && $this->data['error_message'] != '')
        {
            $this->data['error_messages'] = $this->data['error_message'];
            unset($this->data['error_message']);
        }

        $this->data['page'] = 'login';
        
        if ( $this->user_type_admin == ADMIN_TYPE )
            redirect(ADMIN_DEFAULT_REDIRECT);
        
        $this->load->view('admintemplate/layout', $this->data);
    }
    
    public function check_login_post() 
    {        
        $this->login_get();
    }
    
    public function logout_get() 
    {        
        $this->user_type_admin='';
        $this->session->sess_destroy();
        redirect( 'fantasyadmin' );
    }
}
