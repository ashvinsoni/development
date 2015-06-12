<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Users_model extends MY_Model
{

    function __construct()
    {
        parent::__construct();
    }   

    function get_all_user_detail($config = array(), $is_total = false)
    { 
        $field = " CONCAT_WS( ' ' ,UPPER(`U`.`first_name`) , `U`.`last_name` ) AS `name` , CONCAT_WS( ' ',LOWER(`U`.`first_name`),LOWER(`U`.`last_name`)  ) AS `nameOrder` ,`U`.`country`,`U`.`balance` AS `Balance` , `U`.`email` AS `Email` , `U`.`status` AS `Status` , DATE_FORMAT( `U`.`created_date` ,'%d-%M-%Y' ) AS `Joined` , `U`.`is_banned` AS `Banned Status`, `U`.`user_name` ";
        if ($config['is_csv'] == 'false')
        {
            $field = " `U`.`user_id` , CONCAT_WS( ' ' , `U`.`first_name` , `U`.`last_name` ) AS `name` ,CONCAT_WS( ' ',LOWER(`U`.`first_name`),LOWER(`U`.`last_name`)  ) AS `nameOrder` ,`U`.`country`, `U`.`balance` , `U`.`email` , `U`.`status` , DATE_FORMAT( `U`.`created_date` ,'%d-%M-%Y' ) AS `created_date` , `U`.`is_banned`, `U`.`user_name`  ";
        }

        $sql = "SELECT 
					$field 
				FROM 
					`" . $this->db->dbprefix(USER) . "` AS `U` 				
				";

        if ($config['is_csv'] == 'false')
        {
            if ($config['filter_name'] != '')
            {
                $sql.= ' Where  U.user_name LIKE "%' . $config['filter_name'] . '%"  ';
            }
            if ($config['fieldname'] != '' && $config['order'] != '')
            {
                $sql.= ' ORDER BY ' . $config['fieldname'] . ' ' . $config['order'] . '';
            } else
            {
                $sql.= ' ORDER BY U.first_name ASC';
            }
            if ($config['limit'] == 'null')
            {
                $sql.= ' LIMIT 10';
            }

            if ($is_total === FALSE)
            {
                $sql.= ' LIMIT ' . $config['start'] . ', ' . $config['limit'] . '';
            }
        }
        $query = $this->db->query($sql);
        if ($config['is_csv'] == 'false')
        {
            if ($is_total === FALSE)
            {
                return $query->result_array();
            } else
            {
                return $query->num_rows();
            }
        } else
        {
            $this->load->dbutil();
            $this->load->helper('download');
            $query = $this->db->query($sql);
            $data = $this->dbutil->csv_from_result($query);
            $data = "Created on " . format_date('today', 'Y-m-d') . "\n\n" . "From Date $from_date\nTo Date $to_date\n\n" . html_entity_decode($data);
            $name = 'file.csv';
            force_download($name, $data);
            return exit();
        }
    }

    public function get_all_user_total($fieldname = '', $order = '')
    {
        $name = $this->input->post('filter_name');
        $sql = "SELECT 
					COUNT(U.user_id) as total_user
				FROM 
					" . $this->db->dbprefix(USER) . " AS U 				
				";
        if ($name != '')
        {
            $sql .= " where `user_name` like '%" . $name . "%'";
        }

        $cnt_data = $this->run_query($sql, "row_array");
        return $cnt_data['total_user'];
    }

    function update_user_status($id,$status)
    {
        $this->db->where_in('user_id', $id);
        if ($status == '2')
        {
            $this->db->update(USER, array('varified_email' => '1'));
        } else
        {
            $this->db->update(USER, array('is_banned' => $status));
        }
        return $this->db->affected_rows();
    }

}
