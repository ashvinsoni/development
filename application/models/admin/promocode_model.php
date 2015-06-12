<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Promocode_model extends MY_Model {

    function __construct() {
        parent::__construct();
    }

    function get_all_sales_person($config = array(), $is_total = false) {
        $this->db->select('sales_person_id,first_name,last_name,email,dob,date_added,sales_person_unique_id,status', FALSE)
                ->from(PROMO_SALES_PERSON)
                ->where($config['where']);
        if ($config['filter_name'] != '') {
            $this->db->like('first_name', $config['filter_name'], 'both');
            $this->db->or_like('last_name', $config['filter_name'], 'both');
        }
        if ($config['limit'] == 'null') {
            $config['limit'] = 10;
        }

        if ($is_total === FALSE) {
            $this->db->limit($config['limit'], $config['start']);
        }

        if ($config['fieldname'] != '' && $config['order'] != '') {
            $this->db->order_by($config['fieldname'], $config['order']);
        } else {
            $this->db->order_by("first_name", 'ASC');
        }
        if ($is_total === FALSE) {
            return $this->db->get()->result_array();
        } else {
            return $this->db->get()->num_rows();
        }
    }

    function get_all_state($country) {
        $sql = $this->db->select('id,name')
                        ->from(MASTER_STATE . " AS MS")
                        ->where('country',$country)
                        ->get();
        $result = $sql->result_array();
        return $result;
    }
    
    function get_all_country() {
        $sql = $this->db->select('abbr,country_name')
                        ->from(MASTER_COUNTRY . " AS MS")
                        ->get();
        $result = $sql->result_array();
        return $result;
    }
    function get_all_promo_code($config = array(), $is_total = false) 
    {        
        $sql = "SELECT 
 					PC.*,
 				CASE 
  					WHEN PC.type = 1 THEN CONCAT(U.first_name,' ',U.last_name)
  					WHEN PC.type = 0 THEN CONCAT(PSP.first_name,' ',PSP.last_name)
 					END AS sales_person_name,
 				CASE 
  					WHEN PC.type = 1 THEN U.email
 					WHEN PC.type = 0 THEN PSP.email
 					END AS sales_person_email,
 				CASE
 					WHEN PC.type=0 THEN 'Sales Person'
 					WHEN PC.type=1 THEN 'User'  
 					END AS type 	
				FROM 
 					" . $this->db->dbprefix(PROMO_CODE) . " AS PC
 				LEFT JOIN 
 					" . $this->db->dbprefix(PROMO_SALES_PERSON) . " AS PSP ON PSP.sales_person_id = PC.sales_person_id AND PC.type = 0
				LEFT JOIN 
 					" . $this->db->dbprefix(USER) . " AS U ON U.user_id = PC.sales_person_id AND PC.type = 1";
        
        if ($config['filter_name'] != '')
        {
            $sql.= ' Where  U.first_name LIKE "%'.$config['filter_name'].'%" or U.last_name LIKE "%'.$config['filter_name'].'%" 
                    or PSP.first_name LIKE "%'.$config['filter_name'].'%" or PSP.last_name LIKE "%'.$config['filter_name'].'%" ';
        }        

        if ($config['fieldname'] != '' && $config['order'] != '') 
        {
            $sql.= ' ORDER BY '.$config['fieldname'].' '.$config['order'].'';
        } 
        else 
        {
            $sql.= ' ORDER BY U.first_name ASC';
        }
        
        if ($config['limit'] == 'null') 
        {
            $sql.= ' LIMIT 10';
        }

        if ($is_total === FALSE) 
        {
            $sql.= ' LIMIT '.$config['start'].', '.$config['limit'].'';
        }
        $query = $this->db->query($sql);
        if ($is_total === FALSE) 
        {
            return $query->result_array();
        } 
        else 
        {
            return $query->num_rows();
        }
    }
    
    function get_all_sales_persons($where)
    {
		$this->table_name = PROMO_SALES_PERSON;
		$config[ 'fields' ]     = 'sales_person_id,first_name,last_name,email,dob,date_added,sales_person_unique_id,status';
		$config[ 'where'  ]     = $where;
		$config[ 'sort_field' ] = 'first_name';
		$config[ 'sort_order' ] = 'ASC';
		return $this->get( $config );
	}

    function get_all_user_sales_person()
    {
        $sql = $this->db->select('user_id,first_name,last_name,email')
                        ->from(USER." AS U")
                        ->where('varified_email','1')
                        ->order_by('first_name','ASC')
                        ->get();

        $result = $sql->result_array();
        return $result;
    }
     
     
    function get_promo_code_earning($where)
    {
        if( !empty( $where ) )
        {
            $search= "	AND	DATE_FORMAT( G.season_scheduled_date , '%Y' ) = '".$where[ 'year' ]."' 
						AND DATE_FORMAT( G.season_scheduled_date , '%m' ) = '".$where[ 'month' ]."'";
        }
        else
        {
            $search="";
        }

        $sql=	"SELECT 
					PCE.promo_code_earning_id,PCE.is_processed,DATE_FORMAT(PCE.date,'%M,%Y') as date,SUM( PCE.amount_received ) AS amount_received,PC.promo_code,PC.sales_person_commission,
					TRUNCATE((sum(PC.sales_person_commission)*PCE.amount_received)/100,2) as commission_payout,PC.promo_code_id,
				CASE
					WHEN PC.type=1	then  CONCAT(U.first_name,' ',U.last_name)
					WHEN PC.type = 0 THEN CONCAT(PSP.first_name,' ',PSP.last_name)
					END AS sales_person_name,
				CASE	
					WHEN PC.type = 1 THEN U.email
 					WHEN PC.type = 0 THEN PSP.email
 					END AS sales_person_email,
 				CASE
 					WHEN PC.type=0 THEN 'Sales Person'
 					WHEN PC.type=1 THEN 'User'  
 					END AS type 	
				FROM
					".$this->db->dbprefix( PROMO_CODE_EARNING )." AS PCE
				INNER JOIN
					".$this->db->dbprefix( PROMO_CODE )." AS PC ON PCE.promo_code_id=PC.promo_code_id
				INNER JOIN 
					".$this->db->dbprefix( GAME )." AS G ON G.game_unique_id = PCE.game_unique_id
				LEFT JOIN 
 					".$this->db->dbprefix( PROMO_SALES_PERSON )." AS PSP ON PSP.sales_person_id = PC.sales_person_id AND PC.type = 0
				LEFT JOIN 
 					".$this->db->dbprefix( USER )." AS U ON U.user_id = PC.sales_person_id AND PC.type = 1
 				WHERE
					1 = 1
				AND	
					G.is_cancel = '0'
				".$search."
				GROUP BY 
					  PCE.promo_code_id  
				ORDER BY 
					PCE.date	
 				";	
        $query=$this->db->query($sql);
        return $query->result_array();
	}

    function update_commission_status( $promo_code_id , $is_processed , $m , $y )
    {
        $sql = "UPDATE
					".$this->db->dbprefix( PROMO_CODE_EARNING )."
				SET
					`is_processed` = '$is_processed'
				WHERE
					`promo_code_id` = $promo_code_id
				AND
					DATE_FORMAT( `date` , '%m' ) = '$m'
				AND
					DATE_FORMAT( `date` , '%Y' ) = '$y'
				";

        return $this->db->query( $sql );


    }

}
