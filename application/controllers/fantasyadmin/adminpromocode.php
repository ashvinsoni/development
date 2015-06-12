<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Adminpromocode extends REST_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('admin/Promocode_model', 'Promocode_model');
        $this->load->library('encrypt');
        if ($this->user_type_admin != ADMIN_TYPE) {
            redirect('./fantasyadmin');
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = $data;
    }

    public function template_get($view = "") {
        $this->load->view("promocode/$view", $this->data);
    }

    public function sales_person_get() {
        $this->data['page'] = 'promocode';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }    
    
    /**
     * @Summary		: Get List of sales person
     * @access 		: public
     * @param            : Null
     * @return 		: sales person list json array
     */
    public function get_all_sales_person_post() {

        $limit = 100;
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
        $config['filter_name'] = $filter_name;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;
        $config['where'] = array();
        $salesperson = $this->Promocode_model->get_all_sales_person($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Promocode_model->get_all_sales_person($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'salesperson' => $salesperson,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }

    function update_person_status_post()
    {		
        $sales_person_unique_ids = $this->input->post( 'sales_person_unique_id' );
        $active = $this->input->post( 'status' );
        if ( empty( $sales_person_unique_ids ) )
        {
             $sales_person_unique_ids = array();
        }
        foreach ( $sales_person_unique_ids as $sales_person_unique_id)
        {
             $where = array( 'sales_person_unique_id' => $sales_person_unique_id );
             $set_value=array('status'=>$active);
             $this->Promocode_model->table_name = PROMO_SALES_PERSON;
             $this->Promocode_model->update($where,$set_value);
        }
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['message'] = "Sales Person Status Updated Successfully..";
        $this->response($this->return, 200);
    }
    
    function get_states_post()
    {
        $country = $this->input->post('country');
        $state_list = $this->Promocode_model->get_all_state($country);
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['data'] = $state_list;
        $this->response($this->return, 200);
    }
    
    function get_country_post()
    {    
        $state_list = $this->Promocode_model->get_all_country();
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['data'] = $state_list;
        $this->response($this->return, 200);
    }
    function new_sales_person_get()
    {
        $this->data['page'] = 'promocode';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }
    
    function edit_sales_person_get()
    {
        $this->data['page'] = 'promocode';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }
    
    /**
     * @Summary		: This create new sales person and also update detail
     * @access 		: public
     * @param            : Null
     * @return 		: message
     */
    function sales_person_update_post()
    {
        
        $data_post = $this->input->post();
        if ( $data_post )
        {
            $this->form_validation->set_rules( 'first_name', 'First name', 'trim|required' );
            $this->form_validation->set_rules( 'last_name', 'last name', 'trim|required' );
            $this->form_validation->set_rules( 'email', 'Email', 'trim|required|valid_email|xss_clean' );
            $this->form_validation->set_rules( 'dob', 'Date of Birth', 'trim|required' );
            $this->form_validation->set_rules('zip_code','Zip code','required|trim');
            $this->form_validation->set_rules('country','Country','required|trim');
            $this->form_validation->set_rules('state_id','State','required|trim');
            $this->form_validation->set_rules('street1','Street1','required|trim');			
            $this->form_validation->set_rules('city','City','required|trim');
            $this->form_validation->set_rules('action','action','required|trim');

            if ( $this->form_validation->run() )
            {
                $person_data = $this->input->post();
                if($person_data['action']=="add")
                {
                    unset($person_data['action']);
                    $this->Promocode_model->table_name = PROMO_SALES_PERSON;
                    $conut_email_config[ 'count_only' ] = TRUE;
                    $conut_email_config[ 'where' ] = array( 'email' =>$person_data['email']);
                    $count_email_record = $this->Promocode_model->get( $conut_email_config );
                    $this->load->helper( 'string' );
                    $person_data[ 'sales_person_unique_id' ] = random_string( 'alnum' , 9 );	
                    $this->Promocode_model->table_name = PROMO_SALES_PERSON;
                    $person_data[ 'date_added' ]  = format_date();
                    $person_data[ 'status' ] ='1';
                    $sales_person_id = $this->Promocode_model->insert( $person_data );
                    
                    $this->return[$this->rest_status_field_name] = TRUE;
                    $this->return['message'] = $this->lang->line( 'sales_person_added' );
                    $this->response($this->return, 200);
                }
                else if($person_data['action']=="update")
                {
                    unset($person_data['action']);
                    if($person_data['sales_person_unique_id']!="")
                    {
                        $where = array( 'sales_person_unique_id' => $person_data['sales_person_unique_id'] );
                        $set_value=$person_data;
                        $this->Promocode_model->table_name = PROMO_SALES_PERSON;
                        $this->Promocode_model->update($where,$set_value);                       
                        
                        $this->return[$this->rest_status_field_name] = TRUE;
                        $this->return['message'] = $this->lang->line( 'sales_person_updated' );
                        $this->response($this->return, 200);
                    }
                    else
                    {
                        $this->return[$this->rest_status_field_name] = FALSE;
                        $this->return['message'] = $this->lang->line( 'unknown_error' );
                        $this->response($this->return, 200);
                    }
                }
                else
                {
                    $this->return[$this->rest_status_field_name] = FALSE;
                    $this->return['message'] = $this->lang->line( 'unknown_error' );
                    $this->response($this->return, 200);
                }				
            }
            else
            {
                $this->return[$this->rest_status_field_name] = FALSE;
                $this->return['message'] = validation_errors();
                $this->response($this->return, 200);
            }
        }
    }
    
    
    public function get_sales_person_by_id_post()
    {
        $sales_person_unique_id  = $this->input->post('sales_person_unique_id');
        $config[ 'where' ] = array( 'sales_person_unique_id' =>$sales_person_unique_id);
        $config[ 'only_one_record' ] = TRUE;
        $this->Promocode_model->table_name = PROMO_SALES_PERSON;
        $person_data = $this->Promocode_model->get( $config );
        
        $this->return[$this->rest_status_field_name] = FALSE;
        $this->return['data'] = $person_data;
        $this->response($this->return, 200);
    }
    
    function promo_code_get()
    {
        $this->data['page'] = 'promocode';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }
    
    
    function new_promo_code_get()
    {
        $this->data['page'] = 'promocode';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }
    /**
     * @Summary		: Get List of Promo code
     * @access 		: public
     * @param            : Null
     * @return 		: PRomo code list json array
     */
    public function get_all_promo_code_post() {

        $limit = 100;
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
        $config['filter_name'] = $filter_name;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;
        $config['where'] = array();
        $promocode = $this->Promocode_model->get_all_promo_code($config, false);
        $config['count_only'] = TRUE;
        $total = $this->Promocode_model->get_all_promo_code($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'promocode' => $promocode,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }
    
    function update_promocode_status_post()
    {		
        $promo_code_ids = $this->input->post( 'promo_code_id' );
        $active = $this->input->post( 'status' );
        if ( empty( $promo_code_ids ) )
        {
            $promo_code_ids = array();
        }
        foreach ( $promo_code_ids as $promo_code_id)
        {
            $where = array( 'promo_code_id' => $promo_code_id );
            $set_value=array('status'=>$active);
            $this->Promocode_model->table_name = PROMO_CODE;
            $this->Promocode_model->update($where,$set_value);
        }
          
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['message'] = "PromoCode Status Updated Successfully..";
        $this->response($this->return, 200);
    }
    
    function get_all_person_post()
    {
        $person_type = $this->input->post('type');
        if($person_type == 0)
        {
            $where=array( 'status' => '1' );
            $person_record = $this->Promocode_model->get_all_sales_persons($where);
        }
        else if($person_type == 1)
        {
            $person_record = $this->Promocode_model->get_all_user_sales_person();
        }
        
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['data'] = $person_record;
        $this->response($this->return, 200);

    }
    
    
    function create_promo_code_post()
    {

        if ( $this->input->post() )
        {
            $this->form_validation->set_rules( 'promo_code', 'promo', 'trim|required' );
            $this->form_validation->set_rules( 'type', 'Type', 'trim|required' );
            $this->form_validation->set_rules( 'sales_person_id', 'Sales Person', 'trim|required' );
            $this->form_validation->set_rules( 'discount', 'Discount', 'trim|required' );
            $this->form_validation->set_rules( 'benefit_cap', 'Benifit cap', 'trim|required' );
            $this->form_validation->set_rules('sales_person_commission','Commission','required|trim');
            $this->form_validation->set_rules('start_date','Start date','required|trim');
            $this->form_validation->set_rules('expiry_date','Expiry date','required|trim');

            if ( $this->form_validation->run() )
            {
                $check_promo = $this->check_duplicate_promo_code($this->input->post('promo_code'));
                if($check_promo)
                {
                    $promo_data = $this->input->post();	
                    $promo_data['promo_code']=strtoupper($promo_data['promo_code']);
                    $this->Promocode_model->table_name = PROMO_CODE;
                    $conut_promo_config[ 'count_only' ] = TRUE;
                    $conut_promo_config[ 'where' ] = array( 'promo_code' =>$promo_data['promo_code']);
                    $count_promo_record = $this->Promocode_model->get( $conut_promo_config );
                    $promo__id = $this->Promocode_model->insert( $promo_data );
                    
                    $this->return[$this->rest_status_field_name] = TRUE;
                    $this->return['message'] = $this->lang->line( 'promo_code_added' ) ;
                    $this->response($this->return, 200);
                }
                else
                {
                    $this->return[$this->rest_status_field_name] = FALSE;
                    $this->return['message'] = "Promo Code already exists." ;
                    $this->response($this->return, 200);
                }
            }
            else
            {
                $this->return[$this->rest_status_field_name] = FALSE;
                $this->return['message'] = validation_errors() ;
                $this->response($this->return, 200);
            }
        }
	}

    function check_duplicate_promo_code($promo_code)
    {
		//$promo_code=strtoupper($this->input->post('promo_code'));
        $this->Promocode_model->table_name = PROMO_CODE;
        $conut_promo_config[ 'count_only' ] = TRUE;
        $conut_promo_config[ 'where' ] = array( 'promo_code' => $promo_code);
        $count_promo_record = $this->Promocode_model->get( $conut_promo_config );
        if($count_promo_record==0)
        {
            return TRUE;
        }
        else
        {
            return FALSE;
        }		

    }
    
    
    function commission_payout_get()
    {
        $this->data['page'] = 'promocode';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }
    
    function get_promo_code_earning_post()
    {
        $where = array();
        $sales_person = array();
        if ( $this->input->post( 'month' ) && $this->input->post( 'year' ) )
        {
            $where = array( 'month' => $this->input->post( 'month' ) , 'year' => $this->input->post( 'year' ) );        
            $sales_person = $this->Promocode_model->get_promo_code_earning( $where );
        }
        
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['data'] = array('promocode'=>$sales_person);
        $this->response($this->return, 200);

    }
    
    
    function update_commission_status_post()
    {
        $promo_code_ids = $this->input->post( 'promo_code_id' );
        $active         = $this->input->post( 'status' );
        $y              = $this->input->post( 'year' );
        $m              = $this->input->post( 'month' );

        if ( empty( $promo_code_ids ) )
        {
             $promo_code_ids = array();
        }

        foreach ( $promo_code_ids as $promo_code_id )
        {
             $this->Promocode_model->update_commission_status( $promo_code_id , $active , $m , $y );
        }
        
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['message'] = "Process Updated Successfully..";
        $this->response($this->return, 200);
    }
}
