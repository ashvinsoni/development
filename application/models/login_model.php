<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Login_model extends MY_Model 
{
	public function __construct()
 	{
  		parent::__construct();
  		$this->load->model('mail_model');
  		
 	}

 	public function get_user_data($input_arry=array()){
 		$this->db->select()->from(USER);
 		
 		if(array_key_exists('email', $input_arry) && $input_arry['email'] != '') {
 			$this->db->or_where('email', $input_arry['email']);
 		}

 		if(array_key_exists('facebook_id', $input_arry) && $input_arry['facebook_id'] != ''){
 			$this->db->or_where('facebook_id', $input_arry['facebook_id']);
 		}

 		if(array_key_exists('twitter_id', $input_arry) && $input_arry['twitter_id'] != ''){
 			$this->db->or_where('twitter_id', $input_arry['twitter_id']);
 		}

 		if(array_key_exists('user_name', $input_arry) && $input_arry['user_name'] != ''){
 			$this->db->or_where('user_name', $input_arry['user_name']);
 		}

 		$rs = $this->db->get();
 		$result = $rs->row_array();

 		return $result;
 	}

 	
	public function registration($post)
	{/*
		$this->table_name = USER;
		$config[ 'where' ]= array( 'email' =>  $post['email']);
		$config [ 'count_only' ] = TRUE;
		$count = $this->get( $config );

        $social_type = '';
        if(isset($post['facebook_id'])){ $social_type = 'facebook';}
        elseif(isset($post['twitter_id'])){ $social_type = 'twitter';}

		if($count>0)
		{	
			$response = array(
						'status'=>FALSE,
						'msg'=>'email-exist',
						'acc_type' => $social_type
					);
		}
		else
		{	
			$rand=rand();
			$random=md5($rand);
			$reset_key = substr($random, 3, 5);
			$time=time();
			$post['unique_id'] = $reset_key;
			// print_r($post);
			// die;
			$inserted_id = $this->insert($post);

			if(isset($inserted_id))
			{
				$rows=$this->get_single_row('*',USER,array('user_id'=>$inserted_id));
				$rows['first_name'] = $rows['email'];
				$rows['last_name'] = '';
				 
				 if ((isset($post['twitter_id']) && $post['twitter_id'] != "") OR (isset($post['facebook_id']) && $post['facebook_id'] != "") ) 
				 {
                    
				 	$response = array(
						'status'=>TRUE,
						'msg'=>'',
						'acc_type' => $social_type,
						'data' => $post
					);	
				 	
				 } else {
				 	$this->mail_model->send_registration_confirmation_link($rows,$time,$reset_key);
				 	$response = array(
						'status'=>TRUE,
						'msg'=>'Mail sent you for activation'
					);	
				 }
			}
			else
			{				
				$response = array(
						'status'=>FALSE,
						'msg'=>'Problem in singup'
					);
        		
			}

		}
		return $response;
	*/

		$user_data = $this->get_user_data($post);		

		if(empty($user_data)){
			// Registration for new user
			$reset_key = $post['unique_id'] = uniqid();

			$this->db->insert(USER, $post);
			$inserted_id = $this->db->insert_id();
			$rows        = $this->get_single_row('*',USER,array('user_id'=>$inserted_id));

			$rows['first_name'] = $rows['email'];
			$rows['last_name']  = '';
			

			$post['user_id'] = $inserted_id;
			 
			if ( (isset($post['facebook_id']) && $post['facebook_id'] != "") ) 
			{
             	$response = array(
								'status'   =>TRUE,
								'msg'      =>'',
								'acc_type' => 'facebook',
								'data'     => $post
							);	
			 	
			} 
			else if((isset($post['twitter_id']) && $post['twitter_id'] != "")){
				$response = array(
								'status'   =>TRUE,
								'msg'      =>'',
								'acc_type' => 'twitter',
								'data'     => $post
							);
			}
			else {
				$time=time();
			 	$this->mail_model->send_registration_confirmation_link($rows,$time,$reset_key);
			 	
			 	$response = array(
					'status'=>TRUE,
					'msg'=>'Mail sent you for activation'
				);	
			}

		} else {
			//  Post data already exist 
			if( array_key_exists('email', $post) &&  $post['email'] == $user_data['email']){
				// Email already exist in db
				// Check user comes as a  facebook user
				if ( (isset($post['facebook_id']) && $post['facebook_id'] != "") ){
					$update_data = array('facebook_id'=> $post['facebook_id']);
					$where       = array('user_id'=> $user_data['user_id']);
					$this->db->update(USER, $update_data , $where);

					$response = array(
								'status'   =>TRUE,
								'msg'      =>'',
								'acc_type' => 'facebook',
								'data'     => $user_data
							);
				}
				//  Check user comes as a twitter user
				else if((isset($post['twitter_id']) && $post['twitter_id'] != "")){
					$update_data = array('twitter_id'=> $post['twitter_id']);
					$where       = array('user_id'=> $user_data['user_id']);
					$this->db->update(USER,$update_data , $where);
					$response = array(
								'status'   =>TRUE,
								'msg'      =>'',
								'acc_type' => 'twitter',
								'data'     => $user_data
							);	
				}
				else {
					// Returning ERROR 
					$response = array(
										'status' => FALSE,
										'msg'    => $this->lang->line('email_exist')
									);
				}
			}
			else if( array_key_exists('user_name', $post) && $post['user_name'] == $user_data['user_name']){
				// Returning ERROR 
				$response = array(
								'status' => FALSE,
								'msg'    => $this->lang->line('user_name_exist')
							);
			}
			else if($post['facebook_id'] == $user_data['facebook_id']){
				// FAcebook id exist in database
				$response = array(
								'status'   =>TRUE,
								'msg'      =>'',
								'acc_type' => 'facebook',
								'data'     => $user_data
							);
			}
			else if($post['twitter_id'] == $user_data['twitter_id']){
				// Twitter id exist in database
				$response = array(
								'status'   =>TRUE,
								'msg'      =>'',
								'acc_type' => 'twitter',
								'data'     => $user_data
							);	
			}

		}
		
		return $response;
	
	}

    function clear_attempts($ip_address, $login, $expire_period = 86400)
    {
        $this->db->where(array('ip_address' => $ip_address, 'login' => $login));
        // Purge obsolete login attempts
        // $this->db->or_where('UNIX_TIMESTAMP(time) <', time() - $expire_period);

        $this->db->delete( LOGIN_ATTEMPTS );
    }
    
    function get_invitation_list($email){

		$sql="SELECT email
				FROM ".$this->db->dbprefix( INVITE )."
					WHERE
					email='".$email."' 
						";
		$rs = $this->db->query($sql);
		$result = $rs->row_array();
		return $result ;
	}

	public function get_plan_details(){
		$result = $this->db->select()
							->from(MASTER_MEMBER_FEES)
							->where('is_active', '1')
							->order_by('amount','ASC')
							->get()
							->result_array();

		return $result ;

	}

   //check username exist
   public function check_user_name($username = ''){
      $result = $this->db->select()
							->from('user')
							->where('user_name', $username)
							->get();
     return $result->num_rows;   
   }

   //check email exist
   public function check_user_email($email = ''){
      $result = $this->db->select()
							->from('user')
							->where('email', $email)
							->get();
      return $result->num_rows;   
   }

   public function check_password_update(){
       $is_login = ($this->user_id) ? $this->user_id : 0;
       $result = $this->db->select('password')
							->from('user')
							->where('user_id', $is_login)
							->get();
      //echo $this->db->last_query();
      return $result->row_array();
   }
   
}