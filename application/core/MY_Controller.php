<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {
	
	public $layout         = "<br><br>Please don't forget to set a layout for this page. <br>Layout file must be kept in views/layout folder ";
	public $data           = array( "content_view" => "<br><br>Please select a content view for this page" );
	public $title          = PROJECT_NAME_FORMATED;
	public $site_name      = PROJECT_NAME_FORMATED;

	public $user_email     = "";
	public $admin_email    = "";
	public $user_fullname  = "";
	public $admin_fullname = "";
	public $user_status    = "";
	public $user_type      = "";
	public $user_type_admin= "";

	public $user_unique_id = "";
	public $user_id        = "";	
	public $admin_id       = "";

	public $balance = "";

	public $success_message     = "";
	public $error_message       = "";
	public $warning_message     = "";
	public $information_message = "";

	public $base_controller = "";
	public $login_user_league_id = "";
	public $non_login_allow_methods = array();

	function __construct()
	{
		parent::__construct();

		$this->UserAutologin();
		// $this->output->enable_profiler(TRUE);
		$this->non_login_allow_methods = array('get_lobby_list','lobby','get_lobby_filter_list','lobby_game_list','index','get_week_list','get_game_list','reset_password','forgotpasswordcode','activate-account','get_area_list','contactus','aboutus','faq','privacypolicy','howitworks','games','rules','save_contact','error_404','terms','get_lobby_featured_list','get_participant_profile_popup','get_game_detail','template','lang');

		$this->base_controller = get_class ( $this );

		$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
		$this->output->set_header("Cache-Control: post-check=0, pre-check=0");
		$this->output->set_header("Pragma: no-cache");

		if(!$this->session->userdata('language')){
			$this->session->set_userdata('language',$this->config->item('language'));
		}
		$this->lang->load( 'general' , $this->session->userdata('language') );

		$this->layout = 'layout/layout';

		$this->data['site_language'] = $this->config->item('site_language');
		$this->InitializeUserSessiondata();
           //Set REST API Validation Configuration
		$this->GetMessages();
          //die('ddd');
	}

	function GetMessages()
	{
		$warning_message     = $this->session->flashdata( 'warning_message' );
		$information_message = $this->session->flashdata( 'information_message' );
		$success_message     = $this->session->flashdata( 'success_message' );
		$error_message       = $this->session->flashdata( 'error_message' );

		$this->data[ 'open_login' ] = $this->session->flashdata( 'login' );

		if ( $warning_message )		$this->data[ 'warning_message' ]		= $warning_message;
		if ( $information_message ) $this->data[ 'information_message' ]	= $information_message;
		if ( $success_message )		$this->data[ 'success_message' ]		= $success_message;
		if ( $error_message )		$this->data[ 'error_message' ]			= $error_message;
	}

	function echo_Jason( $data )
	{
		echo json_encode( $data );
		exit;
	}

	function InitializeUserSessiondata()
	{
		$user_type = $this->session->userdata( 'user_type' );

		if ( $this->session->userdata( 'user_type_admin' ) == ADMIN_TYPE)
		{
			$this->user_type_admin = $this->session->userdata( 'user_type_admin' );
			$this->admin_id       = $this->session->userdata( 'admin_id' );
			$this->admin_email    = $this->session->userdata( 'email' );
			$this->admin_fullname = $this->session->userdata( 'name' );
			$this->user_email     = $this->session->userdata( 'email' );
		}
		else if ( $user_type == USER_TYPE && $this->uri->segment(1) != 'admin'  )
		{
			$this->user_type     = $this->session->userdata( 'user_type' );
			$this->user_id       = $this->session->userdata( 'user_id' );
			$this->login_user_league_id = $this->session->userdata( 'country_league' );
			$this->user_fullname = ($this->session->userdata( 'user_name' )) ? 
										$this->session->userdata( 'user_name' ) 
										:
										$this->session->userdata( 'first_name' ).' '.$this->session->userdata( 'last_name' );
			$this->user_email    = $this->session->userdata( 'email' );
			$this->balance       = $this->session->userdata( 'balance' );
			$this->profile_image = $this->session->userdata( 'image' );
		}
	}

	public function generateUniqueId ()
	{
		$unicode = strtoupper ( substr ( md5 ( time () ) , 0 , 10 ) );
		return $unicode;
	}

	function isAllowedUser( $allowed_user_type , $user_type = 'user_type' )
	{
		$message = $this->lang->line( 'invalid_login' );
		$user_type_value = '';

		if( 'user_type' == $user_type )
		{
			$user_type_value = $this->user_type;
		}
		elseif( 'user_type_admin' == $user_type )
		{
			$user_type_value = $this->user_type_admin;
		}

		if( in_array( $user_type_value , $allowed_user_type ) )
		{
			return TRUE;
		}

		$not_in = array( 'my_games','my_finance','my_profile','new_game','game_lineup' );

		if ( in_array( $this->uri->segment( 1 ) , $this->non_login_allow_methods ) ||  in_array( $this->uri->segment( 2 ) , $this->non_login_allow_methods ) )
		{
			return TRUE;
			// $this->set_messages( 'TRUE' , 'login' );
			// $this->session->set_userdata( 'redirect_url' , current_url() );
		}

		if(!$this->uri->segment(1))return TRUE;
		if($this->input->is_ajax_request()){
			$this->response(array('login'=>FALSE));
		}
		else{
			redirect( '' );
		}
	}

	public function CheckLoginStatus()
	{
		if ( $this->user_type )
		{
			if ( $this->user_type == USER_TYPE )
			{
				$redirect = USER_DEFAULT_REDIRECT;
			}
			else if ( $this->user_type == ADMIN_TYPE )
			{
				// $redirect = '';
			}
			else
			{

			}

			if ( isset( $redirect ) )
			redirect( $redirect );
		}
		return true;
	}

	function is_logged_in()
	{
		if ( $this->session->userdata( 'user_type' ) )
		{
			return TRUE;
		}
		return FALSE;
	}

	function set_messages( $message = 'There was some error.' , $key = 'error_message' )
	{
		$this->session->set_flashdata( $key , $message );
	}

	function check_redirect_url()
	{
		if ( $this->session->userdata( 'redirect_url' ) )
		{
			$redirect_url = $this->session->userdata( 'redirect_url' );
			$this->session->unset_userdata( 'redirect_url' );
			$this->session->unset_userdata( 'redirect_url' );
			redirect( $redirect_url );
			return TRUE;
		}
		return TRUE;
	}

	public function UserAutologin()
	{
		$this->load->model( 'login_model' );
		$this->load->helper( 'cookie' );
		$cookie = get_cookie( 'users' , TRUE );
		//echo $cookie;
		//	die;
		if ( $cookie != '' )
		{
			$data  = unserialize( $cookie );
			$email = $data[ 'email' ];
			if ( $email !='' )
			{
				$Userdata = $this->login_model->get_single_row('*',USER,array('email'=>$email));
				if ( !is_null( $Userdata ) && $Userdata )
				{
					$country_league = $this->login_model->get_single_row( 'GROUP_CONCAT(league_id) as league_id' , LEAGUE_COUNTRY , array( 'country_abbr' => $Userdata[ 'country' ] ) );
					$newdata = array(
						'user_id'    => $Userdata[ 'user_id' ],
						'email'      => $Userdata[ 'email' ],
						'first_name' => $Userdata[ 'first_name' ],
						'user_name' => $Userdata[ 'user_name' ],
						'last_name'  => @$Userdata[ 'last_name' ],
						'country_league' => $country_league[ 'league_id' ],
						'user_country' => $Userdata[ 'country' ],
						'balance'    => $Userdata[ 'balance' ],
						'user_type'  =>	USER_TYPE,
						'logged_in'  => TRUE,
						);
						$this->session->set_userdata( $newdata );
					//$this->create_user_autologin( $Userdata[ 'email' ] );
					//redirect('dashboard');
				}

			}
		}

		//delete_cookie( 'users' );
	}

	public function check_user_profile_completeness($user_id)
	{
		$this->load->model('User_model');

		$user_profile = $this->User_model->get_single_row('*',USER,array('user_id'=>$user_id));

		//Check Profile is completed.			
		$email      = (isset($user_profile['email'])) 		? $user_profile['email'] 		: '';
		$zip_code   = (isset($user_profile['zip_code'])) 	? $user_profile['zip_code'] 	: '';
		$dob        = (isset($user_profile['dob'])) 		? $user_profile['dob'] 			: '';
		$first_name = (isset($user_profile['first_name'])) 	? $user_profile['first_name'] 	: '';
		$last_name  = (isset($user_profile['last_name'])) 	? $user_profile['last_name'] 	: ''; 


		if($zip_code =="" || $dob =="" || $first_name =="" || $last_name =="" || $email =="")
		{
		 	$response_array = array('status'=>'error','msg'=> $this->lang->line('update_profile') );			
		}
		else {
			$response_array = array('status'=>'success','msg'=> '' );	
		}
		
		return $response_array ;
	}

}

/* End of file MY_Controller.php */
/* Location: application/core/MY_Controller.php */