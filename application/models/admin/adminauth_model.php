<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Users
 *
 * This model represents admin authentication data. It operates the following tables:
 * - admin
 *
 * 
 * 
 */
class Adminauth_model extends CI_Model
{

	function __construct()
	{
		parent::__construct();
	}

	/**
	 * Get admin record by email
	 *
	 * @param	string
	 * @return	object
	 */

	function admin_login( $email , $password )
	{
		$table_name = 'admin';

		$this->db->where( 'LOWER(email)=', strtolower( $email ) );
		$this->db->where( 'password' , md5( $password ) );

		$query = $this->db->get( $table_name );
		if ( $query->num_rows() == 1 ) return $query->row();
		return NULL;
	}

}