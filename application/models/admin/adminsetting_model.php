<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Adminsetting_model extends MY_Model {

    function __construct() {
        parent::__construct();
    }

    function get_list_of_emails() {
        $sql = $this->db->select('email,user_name')
          ->from(USER . " AS U")
          ->where('varified_email', '1')
          ->where('status', '1')
          ->where('is_banned', '1')
          ->get();
        $config = $sql->result_array();
        return $config;
    }

    function get_all_youtube_url($config = array(), $is_total = false) {
        $this->table_name = PLAYER;
        $this->db->select("Y.youtube_id,Y.youtube_url,Y.created_date,Y.status,DATE_FORMAT ( created_date , ('%d-%M-%Y') ) AS created_date")
          ->from(YOUTUBE . ' AS Y');

        if ($config['filter_name'] != '') {

            $this->db->like('Y.youtube_url', $config['filter_name'], 'both');
        }

        if ($config['limit'] == 'null') {
            $config['limit'] = 10;
        }

        if ($is_total === FALSE) {
            $this->db->limit($config['limit'], $config['start']);
        }

        if ($config['fieldname'] != '' && $config['order'] != '') {
            $this->db->order_by("Y." . $config['fieldname'], $config['order']);
        } else {
            $this->db->order_by("Y.created_date", 'desc');
        }

        if ($is_total === FALSE) {
            return $this->db->get()->result_array();
        } else {
            return $this->db->get()->num_rows();
        }
    }

    function get_all_news($config = array(), $is_total = false) {
        $this->db->select("N.news_id,N.title,N.status,N.create_date,N.description,DATE_FORMAT ( create_date , ('%d-%M-%Y') ) AS create_date")
                 ->from(NEWS . ' AS N');          
        if ($config['filter_name'] != '') {

            $this->db->like('N.title', $config['filter_name'], 'both');
        }

        if ($config['limit'] == 'null') {
            $config['limit'] = 10;
        }

        if ($is_total === FALSE) {
            $this->db->limit($config['limit'], $config['start']);
        }

        if ($config['fieldname'] != '' && $config['order'] != '') {
            $this->db->order_by("N." . $config['fieldname'], $config['order']);
        } else {
            $this->db->order_by("N.create_date", 'DESC');
        }

        if ($is_total === FALSE) {
            return $this->db->get()->result_array();
        } else {
            return $this->db->get()->num_rows();
        }
    }

}
