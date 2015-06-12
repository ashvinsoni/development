<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Advertisements extends REST_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('admin/Advertisement_model', 'Advertisement_model');
        $this->load->library('encrypt');
        if ($this->user_type_admin != ADMIN_TYPE) {
            redirect('./fantasyadmin');
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = $data;
    }

    public function template_get($view = "") {
        $this->load->view("advertisement/$view", $this->data);
    }

    public function edit_advertisement_get() {
        $this->data['page'] = 'advertisement';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    public function create_advertisement_get() {
        
        if ($this->input->post()) {
            $data = $this->input->post();
            $this->form_validation->set_rules('name', 'name', 'trim|required');
            $this->form_validation->set_rules('target_url', 'target_url', 'trim|required');
            $this->form_validation->set_rules('type', 'type', 'trim|required');
            $this->form_validation->set_rules('image_adsense', 'image_adsense', 'trim|required');
            if ($this->form_validation->run()) {
                $result = $this->Advertisement_model->create_ads($data);
                if ($result) {
                    $msg = array('status' => true, 'message' => "Advertisment successfully created.");
                } else {
                    $msg = array('status' => true, 'message' => "Please try again.");
                }
            } else {
                $msg = array('status' => false, 'message' => validation_errors());
            }

            $this->echo_Jason($msg);
        }
        $this->data['page'] = 'advertisement';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    public function create_ads_post() 
    {
        $this->create_advertisement_get();
    }

    public function advertisement_list_get() 
    {
        $this->data['page'] = 'advertisement';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    function do_upload_post() 
    {
        $pos_type = $this->post('position_type');
        //$type_detail  = $this->Advertisement_model->get_position_type($pos_type);  
        $file_field_name = 'userfile';
        $dir = 'upload/advertisement/';
        $temp_file = $_FILES['userfile']['tmp_name'];
        $ext = pathinfo($_FILES['userfile']['name'], PATHINFO_EXTENSION);
        $vals = @getimagesize($temp_file);
        $width = $vals[0];
        $height = $vals[1];

        if ($height < 150 || $width < 150) {
            $msg = array('status' => '0', 'data' => 'Please upload image of size greater than 150x150 and less than 2MB.');
            $this->echo_Jason($msg);
            exit;
        }

        $this->check_folder_exist($dir);

        $file_name = time() . "." . $ext;

        /* --Start amazon server upload code-- */
        if (strtolower(IMAGE_SERVER) == 'remote') {
            $this->load->library('S3');

            //if upload on s3 is enabled
            //instantiate the class

            $s3 = new S3(AWS_ACCESS_KEY, AWS_SECRET_KEY);
            $filePath = $dir . $file_name;
            $is_s3_upload = $s3->putObjectFile($temp_file, BUCKET, $filePath, S3::ACL_PUBLIC_READ);

            if ($is_s3_upload) {
                $msg = array('status' => '1', 'success' => '1', 'data' => IMAGE_PATH . $dir . $file_name, 'file_name' => $file_name);
            } else {
                $msg = array('status' => '0', 'data' => 'not uploaded.');
            }
            /* --End amazon server upload code-- */
        } else {
            $config['allowed_types'] = 'jpg|png|jpeg|gif';
            $config['max_size'] = '4048'; //204800
            $config['max_width'] = '1024';
            $config['max_height'] = '1000';
            $config['upload_path'] = $dir;
            $config['file_name'] = $file_name;

            $this->load->library('upload', $config);

            if (!$this->upload->do_upload($file_field_name)) {
                $msg = array('status' => '0', 'data' => strip_tags($this->upload->display_errors()));
            } else {
                $uploaded_data = $this->upload->data();
                $image_path = IMAGE_PATH . $dir . $uploaded_data['file_name'];
                $msg = array('status' => '1', 'data' => $image_path, 'file_name' => $uploaded_data['file_name']);
            }
        }
        $this->echo_Jason($msg);
        exit;
    }

    /**
     * @Summary: check if folder exists otherwise create new
     * @create_date: 18 may, 2015
     * @last_update_date: 18 may, 2015
     * @access: public
     * @param:
     * @return:
     */
    public function check_folder_exist($dir) 
    {
        if (!is_dir($dir))
            mkdir($dir, 0777);
    }

    public function get_positions_post() 
    {
        $positions = $this->Advertisement_model->get_positions();
        $msg = array('status' => '1', 'data' => $positions);
        $this->echo_Jason($msg);
    }

    public function remove_image_post() 
    {
        $image_name = $this->input->post('image_name');
        $dir = 'upload/advertisement/';
        unlink(ROOT_PATH . $dir . $image_name);
        $msg = array('status' => '1', 'message' => "image removed successfully.");
        $this->echo_Jason($msg);
    }

    public function get_advertisement_post() {
        $advertisement = $this->Advertisement_model->get_advertisement();
        $result = array();
        foreach ($advertisement as $rs) {
            $rs['key'] = $this->encrypt->encode($rs['ad_management_id']);
            $result[] = $rs;
        }
        $msg = array('status' => '1', 'data' => $result);
        $this->echo_Jason($msg);
    }

    function edit_ads_post() {
        if ($this->input->post()) {
            $this->form_validation->set_rules('name', 'name', 'trim|required');
            $this->form_validation->set_rules('target_url', 'target_url', 'trim|required');
            $this->form_validation->set_rules('type', 'type', 'trim|required');
            $this->form_validation->set_rules('image', 'image', 'trim|required');
            if ($this->form_validation->run()) {
                $result = $this->Advertisement_model->create_ads($data);
                if ($result) {
                    $msg = array('status' => true, 'message' => "Advertisment successfully created.");
                } else {
                    $msg = array('status' => true, 'message' => "Please try again.");
                }
            } else {
                $msg = array('status' => false, 'message' => validation_errors());
            }

            $this->echo_Jason($msg);
        }
        $this->data['content_view'] = 'admin/create_ads';
        $this->load->view('admin/layout', $this->data);
    }

    public function get_ads_by_id_post() {
        if ($this->input->post()) {

            $id = $this->input->post('ads_id');
            $this->form_validation->set_rules('ads_id', 'advertisment_id', 'trim|required');
            if ($this->form_validation->run()) {
                $result = $this->Advertisement_model->get_advertisement_by_id($id);

                if ($result) {
                    $msg = array('status' => true, 'data' => $result);
                }
            } else {
                $msg = array('status' => false, 'message' => validation_errors());
            }

            $this->echo_Jason($msg);
        }
    }

    public function update_advertisement_by_id_post() {        
        if ($this->input->post()) 
        {
            $this->form_validation->set_rules('name', 'name', 'trim|required');
            $this->form_validation->set_rules('target_url', 'target_url', 'trim|required');
            $this->form_validation->set_rules('ad_position_id', 'ad_position_id', 'trim|required');
            $this->form_validation->set_rules('image', 'image', 'trim|required');

            if ($this->form_validation->run()) 
            {
                $dataArr = array(
                                "name"              => $this->input->post('name'),
                                "ad_position_id"    => $this->input->post('ad_position_id'),
                                "target_url"        => $this->input->post('target_url'),
                                "image"             => $this->input->post('image')
                           );
                $id = $this->input->post('ad_management_id');
                $result = $this->Advertisement_model->update_advertisement_by_id($id, $dataArr);

                if ($result) 
                {
                    $msg = array('status' => true, 'message' => "Advertisement Updated Successfully.");
                } 
                else 
                {
                    $msg = array('status' => false, 'message' => "Try Again.");
                }
            } 
            else
            {
                $msg = array('status' => false, 'message' => validation_errors());
            }

            $this->echo_Jason($msg);
        }
    }
    public function update_status_post() {  
        //print_r($this->input->post('status'));die;
        if ($this->input->post()) 
        {
            $this->form_validation->set_rules('status', 'status', 'required');         
            $this->form_validation->set_rules('ad_management_id', 'ad_management_id', 'trim|required');            

            if ($this->form_validation->run()) 
            {
                $dataArr = array(
                                "status"            => $this->input->post('status')
                           );
                $id = $this->input->post('ad_management_id');
                $result = $this->Advertisement_model->update_advertisement_by_id($id, $dataArr);

                if ($result) 
                {
                    $msg = array('status' => true, 'message' => "Advertisement Status Updated Successfully.");
                } 
                else 
                {
                    $msg = array('status' => false, 'message' => "Try Again.");
                }
            } 
            else
            {
                $msg = array('status' => false, 'message' => validation_errors());
            }

            $this->echo_Jason($msg);
        }
    }
    public function remove_image_db_post() 
    {       
        if ($this->input->post()) 
        {
            $this->form_validation->set_rules('ad_management_id', 'ad_management_id', 'trim|required');
            $image_name = $this->input->post('image');
            if ($this->form_validation->run()) 
            {
                $dataArr = array(
                                "image" => ''
                           );
                $id = $this->input->post('ad_management_id');
                $result = $this->Advertisement_model->update_advertisement_by_id($id, $dataArr);
                $dir = 'upload/advertisement/';
                $result = unlink(ROOT_PATH . $dir . $image_name);
                if ($result) 
                {                    
                    $msg = array('status' => true, 'message' => "Removed image successfully.");
                } 
                else 
                {                    
                    $msg = array('status' => false, 'message' => "Try Again.");
                }
            } 
            else 
            {
                $msg = array('status' => false, 'message' => validation_errors());
            }

            $this->echo_Jason($msg);
        }
    }
}
