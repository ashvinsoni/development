<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Form_validation extends CI_Form_validation
{
	/**
	 * return array of error.
	 * 
	 *
	 * @access public
	 *
	 * @param 
	 * @param 
	 *
	 * @return array
	 */
	public function __construct()
	{
		parent::__construct();
	}

	public function error_array()
    {
		return $this->_error_array;
	}
}