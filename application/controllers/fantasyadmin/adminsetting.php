<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Adminsetting extends REST_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('admin/Adminsetting_model', 'Adminsetting_model');
        $this->load->library('encrypt');
        if ($this->user_type_admin != ADMIN_TYPE) {
            redirect('./fantasyadmin');
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = $data;
    }

    public function template_get($view = "") {
        $this->load->view("setting/$view", $this->data);
    }

    public function date_time_get() {
        $this->data['page'] = 'setting';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    public function update_date_time_post() {
        $data = $this->input->post();
        if (!empty($data)) {
            $this->load->helper('file');
            $date = $this->input->post('date');
            $date_time = '';

            if ($date)
                $date_time = $date;

            $path = ROOT_PATH . 'date_time.php';
            $data = '<?php $date_time = "' . $date_time . '";';
            write_file($path, $data);
            $this->return[$this->rest_status_field_name] = TRUE;
            $this->return['message'] = 'Date time updated successfully.';
            $this->response($this->return, 200);
        }else {
            $this->return[$this->rest_status_field_name] = FALSE;
            $this->return['message'] = 'Try again...........';
            $this->response($this->return, 200);
        }
    }

    public function send_emails_get() {
        $this->data['page'] = 'setting';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    public function sendemails_post() {
        if ($this->input->post()) {
            $this->form_validation->set_rules('subject', 'subject', 'trim|required');
            $this->form_validation->set_rules('message', 'message', 'trim|required');
            $this->form_validation->set_rules('action', 'action', 'trim|required');
            if ($this->form_validation->run()) {
                $email_data = $this->input->post();
                $email_data['subject'] = htmlentities($email_data['subject']);
                $email_data['message'] = nl2br($email_data['message']);

                if ($email_data['action'] == "add") {
                    unset($email_data['action']);
                    if (isset($email_data['ret_email']) && $email_data['ret_email'] != '') {
                        $this->data['message'] = preg_replace('/<br[^\>]*?>/', '', $email_data['message']);
                        $subject = $email_data['subject'];
                        send_email($email_data['ret_email'], $subject, $this->data['message']);
                    } else {
                        $list_of_emails = $this->Adminsetting_model->get_list_of_emails();
                        $mail_list = array();
                        $i = 0;

                        foreach ($list_of_emails as $key => $value) {
                            $this->data['message'] = preg_replace('/<br[^\>]*?>/', '', $email_data['message']);
                            $subject = $email_data['subject'];
                            send_email(trim($value['email']), $subject, $this->data['message']);

                            $i++;
                            if ($i % 5 == 0) {
                                sleep(1);
                            }
                        }
                    }
                    $this->session->set_flashdata('success_message', $this->lang->line('mail_send'));
                    //redirect( 'admin/user' );//
                    $this->return[$this->rest_status_field_name] = TRUE;
                    $this->return['message'] = 'Emails send successfully.';
                    $this->response($this->return, 200);
                } else {
                    $this->session->set_flashdata('warning_message', $this->lang->line('unknown_error'));
                    $this->return[$this->rest_status_field_name] = FALSE;
                    $this->return['message'] = 'Try Again........';
                    $this->response($this->return, 200);
                }
            } else {
                $this->data['error_message'] = validation_errors();
            }
        }
    }

    public function my_profile_get() {
        $this->data['page'] = 'setting';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    function update_profile_post() {

        if ($this->input->post()) {
            $this->form_validation->set_rules('old_password', 'Old Password', 'trim|required|xss_clean');
            $this->form_validation->set_rules('new_password', 'New Password', 'trim|required|xss_clean|min_length[5]');
            $this->form_validation->set_rules('confirm_new_password', 'Confirm new Password', 'trim|required|xss_clean|matches[new_password]');
            if ($this->form_validation->run()) {
                $old_password = $this->input->post('old_password');
                $new_password = $this->input->post('new_password');
                $config['fields'] = 'password';
                $config['where'] = array('id' => $this->admin_id);
                $config['only_one_record'] = TRUE;
                $this->Adminsetting_model->table_name = ADMIN;
                $user_data = $this->Adminsetting_model->get($config);

                if (isset($user_data['password'])) {
                    if (md5($old_password) == $user_data['password']) {
                        $configs['password'] = md5($new_password);
                        $condition = array('id' => $this->admin_id);
                        $this->Adminsetting_model->update($condition, $configs);

                        $this->return[$this->rest_status_field_name] = TRUE;
                        $this->return['message'] = $this->lang->line('auth_message_password_changed');
                        $this->response($this->return, 200);
                    } else {
                        $this->return[$this->rest_status_field_name] = FALSE;
                        $this->return['message'] = $this->lang->line('auth_incorrect_password');
                        $this->response($this->return, 200);
                    }
                } else {
                    $this->session->set_flashdata('error_message', $this->lang->line('unknown_error'));
                    redirect('fantasyadmin/logout');
                }
            } else {
                $this->return[$this->rest_status_field_name] = FALSE;
                $this->return['message'] = validation_errors();
                $this->response($this->return, 200);
            }
        }
    }

    public function youtube_url_get() {
        $this->data['page'] = 'setting';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    /**
     * @Summary		: Get List of Youtube Url	
     * @access 		: public
     * @param 		: Null
     * @return 		: player list json array
     */
    public function get_all_youtube_url_post() {

        $limit = 100;
        $data_post = $this->input->post();
        // print_r($data_post);die;
        $start = $data_post['start'];
        $filter_name = (isset($data_post['search_keyword'])) ? $data_post['search_keyword'] : '';
        $fieldname = $data_post['field'];
        $order = $data_post['order'];
        if ($data_post['limit']) {
            $limit = $data_post['limit'];
        }
        $offset = $start;

        $config['limit'] = $limit;
        $config['start'] = $start;
        $config['filter_name'] = $filter_name;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;

        $youtube = $this->Adminsetting_model->get_all_youtube_url($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Adminsetting_model->get_all_youtube_url($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'youtube' => $youtube,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }

    public function update_youtube_url_post() {
        if ($this->input->post()) {
            $this->form_validation->set_rules('youtube_url', 'Url', 'trim|required');
            if ($this->form_validation->run()) {
                $url_str = 'https://www.youtube.com/embed/';
                $find = 'http://youtu.be/';
                $str = $this->input->post('youtube_url');

                preg_match('/[\\?\\&]v=([^\\?\\&]+)/', $str, $match);

                if (strpos($str, $find) !== FALSE)
                    $match2 = str_replace($find, '', $str);

                if (isset($match[1]) || isset($match2)) {
                    $youtube_code = '';
                    if (isset($match[1]))
                        $youtube_code = $match[1];
                    else if (isset($match2))
                        $youtube_code = $match2;

                    $insert_record['youtube_url'] = $url_str . $youtube_code;
                    $insert_record['created_date'] = format_date();

                    $this->Adminsetting_model->table_name = YOUTUBE;

                    $youtube_id = $this->Adminsetting_model->insert($insert_record);

                    $where = array('youtube_id !=' => $youtube_id);

                    $set_value = array('status' => '0');

                    $this->Adminsetting_model->table_name = YOUTUBE;
                    $this->Adminsetting_model->update($where, $set_value);
                    $this->return[$this->rest_status_field_name] = TRUE;
                    $this->return['message'] = $this->lang->line('url_added');
                    $this->response($this->return, 200);
                }
                else {
                    $msg = $this->lang->line('unknown_error') . ' Incorrect url.';

                    $this->return[$this->rest_status_field_name] = FALSE;
                    $this->return['message'] = $msg;
                    $this->response($this->return, 200);
                }
            } else {
                $this->session->set_flashdata('warning_message', $this->lang->line('unknown_error'));
                redirect('fantasyadmin/youtube_url');
            }
        }
    }

    public function news_get() {
        $this->data['page'] = 'setting';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    /**
     * @Summary		: Get List of Youtube Url	
     * @access 		: public
     * @param 		: Null
     * @return 		: player list json array
     */
    public function get_all_news_post() {

        $limit = 100;
        $data_post = $this->input->post();
        // print_r($data_post);die;
        $start = $data_post['start'];
        $filter_name = (isset($data_post['search_keyword'])) ? $data_post['search_keyword'] : '';
        $fieldname = $data_post['field'];
        $order = $data_post['order'];
        if ($data_post['limit']) {
            $limit = $data_post['limit'];
        }
        $offset = $start;

        $config['limit'] = $limit;
        $config['start'] = $start;
        $config['filter_name'] = $filter_name;
        $config['fieldname'] = $fieldname;
        $config['order'] = $order;

        $news = $this->Adminsetting_model->get_all_news($config, false);
        $config['count_only'] = TRUE;

        $total = $this->Adminsetting_model->get_all_news($config, TRUE);
        $order_sequence = $order == 'ASC' ? 'DESC' : 'ASC';
        $this->echo_Jason(array('status' => TRUE, 'data' => array(
                            'news' => $news,
                            'start' => $offset,
                            'total' => $total,
                            'field_name' => $fieldname,
                            'order_sequence' => $order_sequence
                  )
        ));
    }

    public function add_news_get() {
        $this->data['page'] = 'setting';
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }

    public function create_news_post() {
        if ($this->input->post()) {
            $this->form_validation->set_rules('title', 'Title', 'trim|required');
            $this->form_validation->set_rules('description', 'Description', 'trim|required');
            $this->form_validation->set_rules('action', 'Action', 'required|trim');

            if ($this->form_validation->run()) {
                $news_data = $this->input->post();
                $news_data['title'] = htmlentities($news_data['title']);
                $news_data['description'] = htmlentities($news_data['description']);
                if ($news_data['action'] == "add") {
                    unset($news_data['action']);
                    $this->Adminsetting_model->table_name = NEWS;

                    $news_data['create_date'] = format_date();
                    $news_data['status'] = '1';
                    $news_data['created_by'] = $this->admin_id;

                    $sales_person_id = $this->Adminsetting_model->insert($news_data);
                    
                    $this->return[$this->rest_status_field_name] = TRUE;
                    $this->return['message'] = $this->lang->line('news_added');
                    $this->response($this->return, 200);
                } else if ($news_data['action'] == "update") {
                    unset($news_data['action']);

                    if ($news_data['news_id'] != "") {
                        $news_data['modify_date'] = format_date();
                        $where = array('news_id' => $news_data['news_id']);
                        $set_value = $news_data;

                        $this->Adminsetting_model->table_name = NEWS;
                        $this->Adminsetting_model->update($where, $set_value);

                        $this->return[$this->rest_status_field_name] = TRUE;
                        $this->return['message'] = $this->lang->line('news_updated');
                        $this->response($this->return, 200);
                    } else {
                        $this->return[$this->rest_status_field_name] = FALSE;
                        $this->return['message'] = $this->lang->line('unknown_error');
                        $this->response($this->return, 200);
                    }
                } else {
                    $this->return[$this->rest_status_field_name] = FALSE;
                    $this->return['message'] = $this->lang->line('unknown_error');
                    $this->response($this->return, 200);
                }
            } else {
                $this->return[$this->rest_status_field_name] = FALSE;
                $this->return['message'] = validation_errors();
                $this->response($this->return, 200);
            }
        }
    }
    public function edit_news_get() 
    {
        $this->data['page'] = 'setting';        
        $this->load->view('admintemplate/layout', $this->data, FALSE);
    }
    
    public function get_news_by_id_post() 
    {
        $news_id = $this->input->post('news_id');
        $config[ 'where' ] = array( 'news_id' =>$news_id);
        $config[ 'only_one_record' ] = TRUE;
        $this->Adminsetting_model->table_name = NEWS;
        $news_data = $this->Adminsetting_model->get( $config );
        
        $this->return[$this->rest_status_field_name] = FALSE;
        $this->return['data'] = $news_data;
        $this->response($this->return, 200);
        
    }
    
    function delete_news_post()
    {
        $news_id = $this->input->post('news_id');
        if ( ! $news_id )
        {
            $this->return[$this->rest_status_field_name] = FALSE;
            $this->return['message'] = $this->lang->line( 'invalid_url' ) ;
            $this->response($this->return, 200);
        }

        $condition = array( 'news_id' => $news_id );
        $this->Adminsetting_model->table_name = NEWS;
        $this->Adminsetting_model->delete( $condition );
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['message'] = $this->lang->line( 'game_deleted' ) ;
        $this->response($this->return, 200);
    }
    function update_news_status_post()
    {
//         debug($this->input->post(),true );
        $news_ids = $this->input->post( 'news_id' );
        $active = $this->input->post( 'status' );
        if ( empty( $news_ids ) )
        {
             $news_ids = array();
        }
        foreach ( $news_ids as $news_id)
        {
             $where = array( 'news_id' => $news_id );
             $set_value=array('status'=>$active);
             $this->Adminsetting_model->table_name = NEWS;
             $this->Adminsetting_model->update($where,$set_value);
        } 
        $this->return[$this->rest_status_field_name] = TRUE;
        $this->return['message'] = 'News Status Updated Successfully.';
        $this->response($this->return, 200);
    }   

}
