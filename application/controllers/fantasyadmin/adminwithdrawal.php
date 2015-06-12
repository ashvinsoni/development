<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Adminwithdrawal extends REST_Controller 
{

    function __construct() {
        parent::__construct();
        $this->load->model('admin/Withdrawal_model', 'Withdrawal_model');
        $this->load->library('encrypt');
        if ($this->user_type_admin != ADMIN_TYPE) {
            redirect('./fantasyadmin');
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = $data;
    }

    public function template_get($view = "") {
        $this->load->view("withdrawal/$view", $this->data);
    }    

    public function withdrawal_request_paypal_get() {
        $this->data['page'] = 'withdrawal';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    public function withdrawal_request_get() {
        $this->data['page'] = 'withdrawal';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }    

    /**
     * @Summary		: Get List of withdrawal request	
     * @access 		: public
     * @param            : Null
     * @return 		: player list json array
     */
    public function get_all_withdrawal_request_post() {

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

        $livecheck = $this->Withdrawal_model->withdrawal_request($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Withdrawal_model->withdrawal_request($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'livecheck' => $livecheck,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }

    function process_live_check_request_post()
    {
        $user_payment_withdraw_id = $this->input->post('withdraw_id');
        $this->user_type_admin = $this->session->userdata('user_type_admin');

        $this->isAllowedUser( array( ADMIN_TYPE ), 'user_type_admin');

        set_time_limit(0);

        $this->load->model( 'User_model' );

        /*$configs[ 'where' ]           = array( 'user_payment_withdraw_unique_id' => $user_payment_withdraw_unique_id );
        $configs[ 'only_one_record' ] = TRUE;*/

        $configs[ 'where' ]           = array( 'user_payment_withdraw_id' => $user_payment_withdraw_id );
        $configs[ 'join' ]            = array( USER => USER.'.user_id ='.USER_PAYMENT_WITHDRAW.'.user_id' );
        $configs[ 'join_type' ]       = 'LEFT';
        $configs[ 'only_one_record' ] = TRUE;

        $this->User_model->table_name = USER_PAYMENT_WITHDRAW;

        $result = $this->User_model->get( $configs );



        if ( $result )
        {
            $amount                   			= $result[ 'L_AMT0' ];
            $paypal_email_id          			= $result[ 'L_EMAIL0' ];
            //$user_payment_withdraw_unique_id 	= $result[ 'user_payment_withdraw_unique_id' ];
            $user_email 			  			= $result[ 'email' ];

            $this->data[ 'paypal_email_id' ]     = $paypal_email_id;

            $config[ 'paypal_withdraw_status' ] = '1';

            $condition = array( 'user_payment_withdraw_id' => $user_payment_withdraw_id );
            $this->User_model->update( $condition , $config );

            $this->data['type'] = 'Live Check';
            $this->data['status'] = 'Approved';

            $message 					= $this->load->view( 'emailer/withdrawl_request_emailer' , $this->data, TRUE );
            $to      					= $user_email;
            $subject 					= PROJECT_NAME_WITHOUT_SPACE.' Live Check Approved';
            send_email( $to , $subject , $message );
            $this->return[$this->rest_status_field_name] = TRUE;
            $this->return['message'] = $this->lang->line( 'withdrawal_req_sucessful' );
            $this->response($this->return, 200);
        }
        else
        {            
            $this->return[$this->rest_status_field_name] = FALSE;
            $this->return['message'] = $this->lang->line( 'withdrawal_user_detail_not_found' );
            $this->response($this->return, 200);
        }
        
	}
    function reject_live_check_request_post()
    {		
        $user_payment_withdraw_id  = $this->input->post('withdraw_id');
        $this->user_type_admin = $this->session->userdata('user_type_admin');

        $this->isAllowedUser( array( ADMIN_TYPE ), 'user_type_admin');

        set_time_limit(0);

        $this->load->model( 'User_model' );

        /*$configs[ 'where' ]           = array( 'user_payment_withdraw_unique_id' => $user_payment_withdraw_unique_id );
        $configs[ 'only_one_record' ] = TRUE;*/

        $configs[ 'where' ]           = array( 'user_payment_withdraw_id' => $user_payment_withdraw_id );
        $configs[ 'join' ]            = array( USER => USER.'.user_id ='.USER_PAYMENT_WITHDRAW.'.user_id' );
        $configs[ 'join_type' ]       = 'LEFT';
        $configs[ 'only_one_record' ] = TRUE;

        $this->User_model->table_name = USER_PAYMENT_WITHDRAW;

        $result = $this->User_model->get( $configs );

        if ( $result )
        {
            $amount                   = $result[ 'L_AMT0' ];
            $paypal_email_id          = $result[ 'L_EMAIL0' ];
            $user_email 			  = $result[ 'email' ];
            $this->data[ 'paypal_email_id' ]     = $paypal_email_id;


            $config[ 'paypal_withdraw_status' ] = '2';
            
            $condition = array( 'user_payment_withdraw_id' => $user_payment_withdraw_id );
            $this->User_model->update( $condition , $config );

            $data_insert_payment_history_transaction = array(
            'user_id' => $result[ 'user_id' ] ,
            'description' => 'Paypal Rejected',
            'payment_type' => 2,
            'transaction_amount' => $amount,
            'user_balance_at_transaction' => $result[ 'balance' ],
            'date_added' => format_date( 'today' , 'Y-m-d H:i:s' )
            );

            $this->db->insert(PAYMENT_HISTORY_TRANSACTION, $data_insert_payment_history_transaction); 
            $this->data['type'] = 'Live Check';
            $this->data['status'] = 'Rejected';
            $data = array('balance' => $result[ 'balance' ] + $amount);
            $this->db->where('user_id', $result[ 'user_id' ]);
            $this->db->update(USER, $data); 


            $message 					= $this->load->view( 'emailer/withdrawl_request_emailer' , $this->data, TRUE );
            $to      					= $user_email;
            $subject 					= PROJECT_NAME_WITHOUT_SPACE.' Live Check Rejected';
            //send_email( $to , $subject , $message );
            $this->return[$this->rest_status_field_name] = TRUE;
            $this->return['message'] = $this->lang->line( 'withdrawal_req_sucessful' );
            $this->response($this->return, 200);
        }
        else
        {
            $this->return[$this->rest_status_field_name] = FALSE;
            $this->return['message'] = $this->lang->line( 'withdrawal_user_detail_not_found' );
            $this->response($this->return, 200);
        }
    }

    function update_live_check_status_post()
    {
        $withdraw_id = $this->input->post('withdraw_id');
        
        if(!empty($withdraw_id))
        {       
            foreach ($withdraw_id as $id)
            {
                $this->Withdrawal_model->update_live_check_status($id);
            }
            $this->return[$this->rest_status_field_name] = TRUE;
            $this->return['message'] = "Update live check status updated successfully.";
            $this->response($this->return, 200);
        }
        else
        {
            $this->return[$this->rest_status_field_name] = FALSE;
            $this->return['message'] = "Try again.......";
            $this->response($this->return, 200);
        }
    }
    
     /**
     * @Summary		: Get List of withdrawal request paypal
     * @access 		: public
     * @param            : Null
     * @return 		: player list json array
     */
    public function get_all_withdrawal_request_paypal_post() 
    {

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

        $paypal= $this->Withdrawal_model->paypal_withdrawal_request($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Withdrawal_model->paypal_withdrawal_request($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'paypal' => $paypal,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }
    
    function process_user_paypal_withdrawal_request_post()
    {	
        $user_payment_withdraw_unique_id = $this->input->post('withdraw_id');
        $this->user_type_admin = $this->session->userdata('user_type_admin');

        $this->isAllowedUser( array( ADMIN_TYPE ), 'user_type_admin');

        set_time_limit(0);

        $this->load->model( 'User_model' );

        /*$configs[ 'where' ]           = array( 'user_payment_withdraw_unique_id' => $user_payment_withdraw_unique_id );
        $configs[ 'only_one_record' ] = TRUE;*/

        $configs[ 'where' ]           = array( 'user_payment_withdraw_unique_id' => $user_payment_withdraw_unique_id );
        $configs[ 'join' ]            = array( USER => USER.'.user_id ='.USER_PAYMENT_WITHDRAW.'.user_id' );
        $configs[ 'join_type' ]       = 'LEFT';
        $configs[ 'only_one_record' ] = TRUE;

        $this->User_model->table_name = USER_PAYMENT_WITHDRAW;

        $result = $this->User_model->get( $configs );

        if ( $result )
        {
            $amount                   = $result[ 'L_AMT0' ];
            $paypal_email_id          = $result[ 'L_EMAIL0' ];
            $user_payment_withdraw_id = $result[ 'user_payment_withdraw_id' ];
            $user_email 			  = $result[ 'email' ];

            $this->data[ 'paypal_email_id' ]     = $paypal_email_id;

            $config[ 'paypal_withdraw_status' ] = '1';

            $condition = array( 'user_payment_withdraw_unique_id' => $user_payment_withdraw_unique_id , 'user_payment_withdraw_id' => $user_payment_withdraw_id );
            $this->User_model->update( $condition , $config );

            $this->data['type'] = 'Paypal';
            $this->data['status'] = 'Approved';

            $message 					= $this->load->view( 'emailer/withdrawl_request_emailer' , $this->data, TRUE );
            $to      					= $user_email;
            $subject 					= PROJECT_NAME_WITHOUT_SPACE.' Paypal Approved';
            send_email( $to , $subject , $message );
            $this->return[$this->rest_status_field_name] = TRUE;
            $this->return['message'] = $this->lang->line( 'withdrawal_req_sucessful' );
            $this->response($this->return, 200);
        }
        else
        {
            $this->return[$this->rest_status_field_name] = FALSE;
            $this->return['message'] = $this->lang->line( 'withdrawal_user_detail_not_found' );
            $this->response($this->return, 200);
        }
    }

    function reject_user_paypal_withdrawal_request_post()
    {		

        $user_payment_withdraw_unique_id = $this->input->post('withdraw_id');
        $this->user_type_admin = $this->session->userdata('user_type_admin');

        $this->isAllowedUser( array( ADMIN_TYPE ), 'user_type_admin');

        set_time_limit(0);

        $this->load->model( 'User_model' );

        /*$configs[ 'where' ]           = array( 'user_payment_withdraw_unique_id' => $user_payment_withdraw_unique_id );
        $configs[ 'only_one_record' ] = TRUE;*/

        $configs[ 'where' ]           = array( 'user_payment_withdraw_unique_id' => $user_payment_withdraw_unique_id );
        $configs[ 'join' ]            = array( USER => USER.'.user_id ='.USER_PAYMENT_WITHDRAW.'.user_id' );
        $configs[ 'join_type' ]       = 'LEFT';
        $configs[ 'only_one_record' ] = TRUE;

        $this->User_model->table_name = USER_PAYMENT_WITHDRAW;

        $result = $this->User_model->get( $configs );

        if ( $result )
        {
            $amount                   = $result[ 'L_AMT0' ];
            $paypal_email_id          = $result[ 'L_EMAIL0' ];
            $user_payment_withdraw_id = $result[ 'user_payment_withdraw_id' ];
            $user_email 			  = $result[ 'email' ];
            $this->data[ 'paypal_email_id' ]     = $paypal_email_id;


            $config[ 'paypal_withdraw_status' ] = '2';
            $condition = array( 'user_payment_withdraw_unique_id' => $user_payment_withdraw_unique_id , 'user_payment_withdraw_id' => $user_payment_withdraw_id );
            $this->User_model->update( $condition , $config );

            $data_insert_payment_history_transaction = array(
            'user_id' => $result[ 'user_id' ] ,
            'description' => 'Paypal Rejected',
            'payment_type' => 2,
            'transaction_amount' => $amount,
            'user_balance_at_transaction' => $result[ 'balance' ],
            'date_added' => format_date( 'today' , 'Y-m-d H:i:s' )
            );

            $this->db->insert(PAYMENT_HISTORY_TRANSACTION, $data_insert_payment_history_transaction); 

            $data = array('balance' => $result[ 'balance' ] + $amount);
            $this->db->where('user_id', $result[ 'user_id' ]);
            $this->db->update(USER, $data); 

            $this->data['type'] = 'Paypal';
            $this->data['status'] = 'Rejected';


            $message 					= $this->load->view( 'emailer/withdrawl_request_emailer' , $this->data, TRUE );
            $to      					= $user_email;
            $subject 					= PROJECT_NAME_WITHOUT_SPACE.' Paypal Rejected';
            send_email( $to , $subject , $message );
            $this->return[$this->rest_status_field_name] = TRUE;
            $this->return['message'] = $this->lang->line( 'withdrawal_req_sucessful' );
            $this->response($this->return, 200);
        }
        else
        {
            $this->return[$this->rest_status_field_name] = TRUE;
            $this->return['message'] = $this->lang->line( 'withdrawal_user_detail_not_found' );
            $this->response($this->return, 200);
        }
    }
}
