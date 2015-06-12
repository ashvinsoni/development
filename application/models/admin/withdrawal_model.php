<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Withdrawal_model extends MY_Model
{
    function __construct()
    {
         parent::__construct();
    }  
    
    function withdrawal_request($config = array(), $is_total = false)
    {
        $sql = $this->db->select('U.user_id ,email, CONCAT(first_name, '.', last_name) AS name, ADDRESS AS address , balance , UPW.L_AMT0 AS transaction_amount , user_payment_withdraw_id , LIVE_CHECK_STATUS AS live_check_status, user_payment_withdraw_unique_id ', FALSE)
                        ->from(USER_PAYMENT_WITHDRAW.' AS UPW')
                        ->join(USER.' AS U', 'U.user_id = UPW.user_id','LEFT')
                        ->where('WITHDRAW_TYPE', LIVE_CHECK)
                        ->where('UPW.paypal_withdraw_status','0');
        if ($config['filter_name'] != '') 
        {

            $this->db->like('U.first_name', $config['filter_name'], 'both');
            $this->db->like_or('U.last_name', $config['filter_name'], 'both');
        }

        if ($config['limit'] == 'null') 
        {
            $config['limit'] = 10;
        }

        if ($is_total === FALSE) 
        {
            $this->db->limit($config['limit'], $config['start']);
        }

        if ($config['fieldname'] != '' && $config['order'] != '') 
        {
            $this->db->order_by($config['fieldname'], $config['order']);
        } 
        else 
        {
            $this->db->order_by("UPW.DATE_ADDED", 'DESC');
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
    
    function paypal_withdrawal_request($config = array(), $is_total = false)
	{
        $this->db->select('U.user_id , CONCAT(first_name, ' . ', last_name) AS name  , email , balance , UPW.L_EMAIL0 AS paypal_id , UPW.L_AMT0 AS transaction_amount , user_payment_withdraw_unique_id , paypal_withdraw_status ', FALSE)
                ->from(USER_PAYMENT_WITHDRAW.' AS UPW')
                ->join(USER.' AS U', 'U.user_id = UPW.user_id','LEFT')
                ->where('WITHDRAW_TYPE', PAYPAL_WITHDRAW)
                ->where('UPW.paypal_withdraw_status','0');
        if ($config['filter_name'] != '') 
        {
          $this->db->like('U.first_name', $config['filter_name'], 'both');
          $this->db->like_or('U.last_name', $config['filter_name'], 'both');
        }

        if ($config['limit'] == 'null')
        {
            $config['limit'] = 10;
        }

        if ($is_total === FALSE) 
        {
            $this->db->limit($config['limit'], $config['start']);
        }

        if ($config['fieldname'] != '' && $config['order'] != '') 
        {
            $this->db->order_by($config['fieldname'], $config['order']);
        } 
        else
        {
            $this->db->order_by("UPW.DATE_ADDED", 'DESC');
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
    function update_live_check_status($withdraw_id)
    {
        $status = $this->input->post( 'status' );
        $this->db->where_in( 'user_payment_withdraw_id' , $withdraw_id );
        $this->db->update( USER_PAYMENT_WITHDRAW , array( 'LIVE_CHECK_STATUS' => $status ) );
        return $this->db->affected_rows();
    }
}