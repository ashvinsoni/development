<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Mail_model extends MY_Model 
{
	public function __construct()
 	{
  		parent::__construct();
 	}
 	
  
    public function send_registration_confirmation_link($rows,$time,$reset_key)
   {
   		$data['username']=($rows['user_name'] == "") ? $rows['first_name']." ".$rows['last_name']: $rows['user_name'];
   		$data['email']=$rows['email'];
   		$data['link']=base_url()."activate-account/".base64_encode($reset_key.'_'.$time);	 					
   		$message = $this->load->view('emailer/signup_emailer',$data,true);	
		   $to=$rows['email'];
         $subject='['.PROJECT_NAME_FORMATED.'] Thank you for registering with us';
         $message=$message;
				
		  send_email($to,$subject,$message);
   }

    public function forgot_password_mail($rows,$time,$reset_key)
   {  

      $data['username']=($rows['user_name'] == "") ? $rows['first_name'] : $rows['user_name'];
      $data['email']=$rows['email'];
      $data['link']=base_url()."forgotpasswordcode/".base64_encode($reset_key.'_'.$time);
      $message=$this->load->view('emailer/forgot_pass_emailer',$data,true); 
      $to=$rows['email'];
      $subject='['.PROJECT_NAME_FORMATED.'] Password reminder';
      $message=$message;    
      send_email($to,$subject,$message);
   
   }
   
   public function game_cancellation_fee_refund_mail($to,$first_name,$last_name,$game_id,$season_scheduled_date,$user_id,$user_name)
   {  
      
      $this->load->model('User_model');
       $to              =  $to;
      $data['first_name']  = ($user_name == "") ? $first_name : $user_name;
      $data['last_name']   = $last_name;
      $data['game_id']     = $game_id;
      $data['game_name']  = $this->User_model->get_single_row('game_name',GAME,array('game_unique_id'=>$game_id));
      $data['game_date']   = $season_scheduled_date;
      
      // $to					=	$to;
      // $data['first_name'] 	= ($user_name == "") ? $first_name : $user_name;
      // $data['last_name'] 	= $last_name;
      // $data['game_id'] 		= $game_id;
      // $data['game_name']  = $this->User_model->get_single_row('game_name',GAME,array('game_unique_id'=>$game_id));
      // $data['game_date']	= $season_scheduled_date;
      $subject				= '['.PROJECT_NAME_FORMATED.'] Game cancellation information';
      $message				= $this->load->view('emailer/game_cancellation_emailer',$data,true); 
      //add notification
         $this->User_model->add_notification('2','0',$user_id,$data['game_name']['game_name'],$game_id);
      send_email($to,$subject,$message);
   
   }
      
   public function win_game_transfer_prize_money_to_user_mail($to,$first_name,$last_name,$game_id,$win_amount,$user_id,$user_name)
   {  
      $this->load->model('User_model');
      
      $to					= $to;
      $data['first_name'] 	= ($user_name == "") ? $first_name : $user_name;
      $data['last_name'] 	= $last_name;
      $data['game_id'] 		= $game_id;
      $data['game_name']   = $this->User_model->get_single_row('game_name',GAME,array('game_unique_id'=>$game_id));
      $data['win_amount'] 	= $win_amount;
      $subject				= '['.PROJECT_NAME_FORMATED.'] Win Game information';
      $message				= $this->load->view('emailer/win_game_emailer',$data,true); 
      
      //add notification
         $this->User_model->add_notification('1','0',$user_id,$data['game_name']['game_name'],$game_id);
      send_email($to,$subject,$message);
   }


}
