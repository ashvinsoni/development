<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Dashboard_model extends MY_Model {

    function __construct() {
        parent::__construct();
    }

    /**
     * @summary : This function get dashboard summary detail (Game,Earning,User)
     * @function : get_dashboard_detail
     * @param array $data
     * @return array
     */
    function get_dashboard_detail($data) {
        $current_date = date('Y-m-d',strtotime(format_date()));
        
        /*-------------------------------Dashboard Filter------------------------------------------------------------*/
        $filter = $data['filter'];
        if ($filter == '') {
            $where_class = "";
        } elseif ($filter == 'today') {
            $where_class = "DATE_FORMAT(created_date,'%Y-%m-%d') = '$current_date'";
        } elseif ($filter == 'yesterday') {
            $where_class = "DATE_FORMAT(created_date,'%Y-%m-%d') = '" . date('Y-m-d', strtotime('-1 day',$current_date)) . "'";
        } elseif ($filter == 'week') {
            $where_class = "WEEK(created_date) = WEEK('$current_date') and YEAR(created_date) = YEAR('$current_date')";
        } elseif ($filter == 'month') {
            $where_class = "MONTH(created_date) = MONTH('$current_date') and YEAR(created_date) = YEAR('$current_date')";
        } elseif ($filter == 'threemonth') {
            $where_class = "created_date BETWEEN DATE_SUB('$current_date', INTERVAL 3 MONTH) AND DATE_SUB('$current_date', INTERVAL 1 MONTH)";
        } elseif ($filter == 'year') {
            $where_class = "YEAR(created_date) = YEAR('$current_date')";
        } elseif ($filter == 'custom') {
            if($data['from_date']!='' && $data['to_date']!=''){
                $where_class = "DATE_FORMAT(created_date,'%Y-%m-%d') BETWEEN '".$data['from_date']."'  AND '".$data['to_date']."'";
            }
        }
        /*--------------------------------End filter------------------------------------------------------------------*/
        $dashboard_detail = array();
        
        
        /*---------------------------User Section Query------------------------------------*/       
        $sql = $this->db->select("user_id")
                        ->from(USER.' U')
                        ->get();

        $this->db->select("user_id")
                 ->from(USER.' U');
        
        if ($where_class != '') {
            $this->db->where($where_class);
        }
        $sql2 = $this->db->get();
        /*------------------------------------End--------------------------------------------------*/
        
        
        /*---------------------------Earning section Query-----------------------------------------*/
        
        $temp = 'SELECT  
                    SUM(TM.total_entry_fees) AS total_entries 
                 FROM 
                    (SELECT 
                        G.game_unique_id,(entry_fee*size) AS total_entry_fees,COUNT(LM.game_unique_id) AS total_game_size,`G`.`size` AS size 
                    FROM 
                        ('.$this->db->dbprefix(GAME).' as G)
                    INNER JOIN 
                        '.$this->db->dbprefix(LINEUP_MASTER).' as LM  ON `LM`.`game_unique_id` = `G`.`game_unique_id` ';
        if ($where_class != '') {
            $temp .= " where ".$where_class;
        }
        $temp .='GROUP BY 
                    `G`.`game_unique_id`
                 HAVING 
                    total_game_size = size) AS TM';

        $temp1 = 'SELECT 
                        SUM(TM.total_entry_fees) AS total_entries 
                  FROM 
                       (SELECT 
                            G.game_unique_id,(entry_fee*size) AS total_entry_fees,COUNT(LM.game_unique_id) AS total_game_size,`G`.`size` AS size
                            FROM 
                                ('.$this->db->dbprefix(GAME).' as G)
                            INNER JOIN 
                                 '.$this->db->dbprefix(LINEUP_MASTER).' as LM  ON `LM`.`game_unique_id` = `G`.`game_unique_id` 
                            GROUP BY 
                                 `G`.`game_unique_id` 
                            HAVING 
                                total_game_size = size
                        ) AS TM';
        /*------------------------------------End--------------------------------------------------*/
        
          
        /*------------------------------In progess game--------------------------------------------*/
        $sql5 = $this->db->select("count(game_unique_id) as in_progress")
                         ->from(GAME)
                         ->where('is_cancel','0')
                         ->where('prize_distributed','0')
                         ->get();
        
        $this->db->select("sum(entry_fee*size) in_progress_comm")
                 ->from(GAME)
                 ->where('is_cancel','0')
                 ->where('prize_distributed','0');
        
        if ($where_class != '') {
            $this->db->where($where_class);
        }
        
        $sql6 = $this->db->get();
        
        $comm = $this->db->select("site_rake")
                            ->from(MASTER_SITE_RAKE)
                            ->get();
        /*------------------------------------End--------------------------------------------------*/
        //echo $this->db->last_query();      
        
        
        /*------------------------Getting User Section Summary Detail------------------------------*/
        $userInfo = $sql->num_rows();
        $Curretnuser = $sql2->num_rows();
        $userPercent = ($Curretnuser * 100) / $userInfo;  
       
        /*------------------------Getting Earning Section Summary Detail---------------------------*/
        $sql3 = $this->db->query($temp1);
        $sql4 = $this->db->query($temp);
        $total_Earning = $sql3->row_array();
        $current_Earning = $sql4->row_array();
        
        /*------------------------Getting In Progress Game Section Summary Detail---------------------------*/
        $in_progress_game = $sql5->row_array();        
        $in_progress_comm = $sql6->row_array();
        $site_comm = $comm->row_array();
        $in_progress_game_comm = ($in_progress_comm['in_progress_comm']*$site_comm['site_rake'])/100;
        //echo $this->db->last_query();
        
        
        $dashboard_detail = array(
                                "total_user" => $userInfo, 
                                'user_percentage' => sprintf('%0.2f', $userPercent), 
                                "total_earning" => sprintf('%0.2f', $total_Earning['total_entries']), 
                                "current_earning" => sprintf('%0.2f', $current_Earning['total_entries']),
                                "total_in_progess"=>$in_progress_game['in_progress'],
                                'in_progress_comm'=>$in_progress_game_comm
                            );

        return $dashboard_detail;
    }
    /**
     * Summary : This function generat chart data for show on dashboard for(Game,Earning etc)
     * Function : get_dashboard_chart
     * @param array $data
     * @return array
     */
    function get_dashboard_chart($data) {
       $current_date = date('Y-m-d',strtotime(format_date()));
        $filter = $data['filter'];
        $radio_where_class = '';
        /*--------------------------------------Filter Section------------------------------------*/
        if ($filter == '') 
        {
            $where_class = "";
            $group_by='  GROUP BY DATE_FORMAT(season_scheduled_date,"%Y-%m-%d") ';
            
        } 
        elseif ($filter == 'today') 
        {
            $where_class        = "DATE_FORMAT(season_scheduled_date,'%Y-%m-%d') = '".$current_date."'";
            $group_by           = " AND DATE_FORMAT(season_scheduled_date,'%Y-%m-%d') = '$current_date' GROUP BY season_scheduled_date";
            $radio_where_class  = "DATE_FORMAT(season_scheduled_date,'%Y-%m-%d') = '" . date('Y-m-d', strtotime('-1 day '.$current_date)) . "'";
        } 
        elseif ($filter == 'yesterday') 
        {
            $where_class        = "DATE_FORMAT(season_scheduled_date,'%Y-%m-%d') = '" . date('Y-m-d', strtotime('-1 day '.$current_date)) . "'";
            $group_by           = " AND DATE_FORMAT(season_scheduled_date,'%Y-%m-%d') = '" . date('Y-m-d', strtotime('-1 day '.$current_date)) . "' GROUP BY season_scheduled_date";
            $radio_where_class  = "DATE_FORMAT(season_scheduled_date,'%Y-%m-%d') = '" . date('Y-m-d', strtotime('-2 day '.$current_date)) . "'";
        } 
        elseif ($filter == 'week') 
        {
            $where_class        = "WEEK(season_scheduled_date) = WEEK('".$current_date."') AND YEAR(season_scheduled_date) = YEAR('".$current_date."')";
            $group_by           = " AND YEAR(season_scheduled_date) = YEAR('".$current_date."')  GROUP BY WEEK(season_scheduled_date)";
            $radio_where_class  = "WEEK(season_scheduled_date) = '".date('W',strtotime('-1 week '.$current_date))."' and YEAR(season_scheduled_date) = YEAR('".$current_date."')";
        } 
        elseif ($filter == 'month') 
        {
            $where_class        = "MONTH(season_scheduled_date) = MONTH('".$current_date."') AND YEAR(season_scheduled_date) = YEAR('".$current_date."')";
            $group_by           = " AND YEAR(season_scheduled_date) = YEAR('".$current_date."')  GROUP BY MONTH(season_scheduled_date)";
            $radio_where_class  = "MONTH(season_scheduled_date) = '".date('m',strtotime('-1 month '.$current_date))."' AND YEAR(season_scheduled_date) = YEAR('".$current_date."')";
        } 
        elseif ($filter == 'threemonth') 
        {
            $where_class        = "season_scheduled_date BETWEEN DATE_SUB('".$current_date."', INTERVAL 3 MONTH) AND DATE_SUB('".$current_date."', INTERVAL 1 MONTH)";
            $group_by           = " AND season_scheduled_date BETWEEN DATE_FORMAT('".$current_date."' - INTERVAL 3 MONTH, '%Y-%m-01') AND DATE_FORMAT('".$current_date."' ,'%Y-%m-01') GROUP BY season_scheduled_date";
            $radio_where_class  = "season_scheduled_date BETWEEN DATE_SUB('".$current_date."', INTERVAL 6 MONTH) AND DATE_SUB('".$current_date."', INTERVAL 4 MONTH)";
        } 
        elseif ($filter == 'year') 
        {
            $where_class        = "YEAR(season_scheduled_date) = YEAR('".$current_date."')";
            $group_by           = " AND YEAR(season_scheduled_date) = YEAR('".$current_date."') GROUP BY season_scheduled_date";
            $radio_where_class  = "YEAR(season_scheduled_date) = '".date('Y',strtotime('-1 year'.$current_date))."'";
        } 
        elseif ($filter == 'custom') 
        {            
            if($data['from_date']!='' && $data['to_date']!='')
            {
                $where_class    = "DATE_FORMAT(season_scheduled_date,'%Y-%m-%d') BETWEEN '".$data['from_date']."'  AND '".$data['to_date']."'";
                $group_by       = " AND season_scheduled_date BETWEEN '".$data['from_date']."'  AND '".$data['to_date']."'  GROUP BY season_scheduled_date";
            }            
        }
        /*-----------------------------------------End Filter-------------------------------------*/
        
        
        /*------------------------------------Game Created Chart Data Query------------------------  */
        
        $game_created_1 = $this->db->select("count(game_unique_id) as total_game",FALSE)
                        ->from(GAME)
                        ->get();
        
        $this->db->select("game_unique_id,user_id,game_type", FALSE)
                        ->from(GAME);
        if ($where_class != '') 
        {
            $this->db->where($where_class);
        }
        $game_created_2 = $this->db->get();
        
        $this->db->select("game_unique_id,user_id,game_type")
                        ->from(GAME);
        if ($radio_where_class != '') 
        {
            $this->db->where($radio_where_class);
        }
        $game_created_3 = $this->db->get();
//                echo $this->db->last_query();die;
        /*--------------------------------------End Game-------------------------------------------*/
        
        /*--------------------------------Entry Fee Chart Data Query---------------------------------*/
        
        $entry_fee_temp = 'SELECT  
                    SUM(TM.total_entry_fees) AS total_entries 
                FROM 
                    (SELECT 
                        G.game_unique_id,(entry_fee*size) AS total_entry_fees,COUNT(LM.game_unique_id) AS total_game_size,`G`.`size` AS size 
                    FROM 
                        '.$this->db->dbprefix(GAME).' as G
                    INNER JOIN 
                        '.$this->db->dbprefix(LINEUP_MASTER).' LM  ON `LM`.`game_unique_id` = `G`.`game_unique_id` 
                    GROUP BY 
                        `G`.`game_unique_id` 
                    HAVING 
                        total_game_size = size
                    ) AS TM';
        
        $this->db->select("(entry_fee*size) as totat_entryfee,G.size as game_size,count(LM.game_unique_id) as total_parti,G.user_id,G.game_type")
                        ->from(GAME.' as G')
                        ->join(LINEUP_MASTER.' LM','LM.game_unique_id = G.game_unique_id','inner');
        if ($where_class != '') 
        {
            $this->db->where($where_class);
        }
        $entry_fee_2 = $this->db->group_by('G.game_unique_id')
                        ->having('total_parti = size')
                        ->get();
        //echo $this->db->last_query();die;
        $this->db->select("(entry_fee*size) as totat_entryfee,G.size as game_size,count(LM.game_unique_id) as total_parti,G.user_id,G.game_type")
                        ->from(GAME.' as G')
                        ->join(LINEUP_MASTER.' LM','LM.game_unique_id = G.game_unique_id','inner');
        if ($radio_where_class != '') 
        {
            $this->db->where($radio_where_class);
        }
        $entry_fee_3 = $this->db->group_by('G.game_unique_id')
                        ->having('total_parti = size')
                        ->get();
        /*--------------------------------------End Entery Fee-------------------------------------------*/

        
        /*--------------------------------------PRIZE Details Chart Data Query-----------------------------*/      
        
        $prize_detail_1 = $this->db->select("sum(G.prize_pool) as total_prize")
                        ->from(GAME.' as G')
                        ->where("G.is_cancel",'0')
                        ->where("G.prize_distributed",'1')
                        ->get();
        
        $this->db->select("G.prize_pool as total_prize,G.user_id,G.game_type",FALSE)
                 ->from(GAME.' as G')
                 ->where("G.is_cancel",'0')
                 ->where("G.prize_distributed",'1');
        if ($where_class != '') 
        {
            $this->db->where($where_class);
        }
        $prize_detail_2 = $this->db->get();
        
        
        $this->db->select("G.prize_pool as total_prize,G.user_id,G.game_type",FALSE)
                ->from(GAME.' as G')
                ->where("G.is_cancel",'0')
                ->where("G.prize_distributed",'1');
        if ($radio_where_class != '') 
        {
            $this->db->where($radio_where_class);
        }
        $prize_detail_3 = $this->db->get();
        
        $comm = $this->db->select("site_rake")
                            ->from(MASTER_SITE_RAKE)
                            ->get();
        /*------------------------------------------End Prize Detail ------------------------------------*/
        
        
        /*-------------------Generate General chart Query for Game and Earning----------------------------*/
    
        $general_chart_temp1 = 'SELECT 
                                        sum(entry_fee*size) as entry_fee,count(game_unique_id) as game,
                                        DATE_FORMAT(season_scheduled_date,"%Y-%m-%d") as created_date
                                FROM '.$this->db->dbprefix(GAME).' 
                                WHERE is_cancel="0" and prize_distributed = "1" ';
        
        if ($group_by != '') 
        {
            $temp1 .= $group_by;
        }
        $general_chart_1 = $this->db->query($general_chart_temp1);
        //echo $this->db->last_query();die;
        /*-----------------------------------End General Chart-------------------------------------------*/
        
        $admin = 0;
        $user = 0;
        $public_game = 0;
        $private_game = 0;
        $public_game_percent = 0;
        $private_game_percent = 0;
        $user_game_percent = 0;
        $admin_game_percent = 0;
        
        $entry_fee_admin = 0;
        $entry_fee_user = 0;
        $entry_fee_game = 0;
        $entry_fee_private_game = 0;
        $entry_fee_private_game_percent = 0;
        $entry_fee_private_game_percent = 0;
        $entry_fee_user_game_percent = 0;
        $entry_fee_admin_game_percent = 0;
        
        $prize_detail_admin = 0;
        $prize_detail_user = 0;
        $prize_detail_public_game = 0;
        $prize_detail_private_game = 0;
        $prize_detail_public_game_percent = 0;
        $prize_detail_private_game_percent = 0; 
        $prize_detail_user_game_percent = 0;
        $prize_detail_admin_game_percent = 0;
        
        $site_commission_admin = 0;
        $site_commission_user = 0;
        $site_commission_public_game = 0;
        $site_commission_private_game = 0;
        $site_commission_public_game_percent = 0;
        $site_commission_private_game_percent = 0;
        $site_commission_user_game_percent = 0;
        $site_commission_admin_game_percent = 0;
        
        
        /*-------------------------------Total Game Created Data Calculation For generating chart---------------*/
        
        $game = $game_created_1->row_array();
        $commission = $comm->row_array();
        
        /*----------------------------Total Game Created Current Data-------------------------*/
        $game_detail = $game_created_2->result_array();
        
        foreach($game_detail as $games){
            if($games['game_type']==0)
            {
                $public_game += 1;
            }
            else
            {
                $private_game += 1;
            }            
            if($games['user_id']==0)
            {
               $admin += 1; 
            }
            else
            {
               $user += 1; 
            }            
        }
        /*---------------------------Total Game Created Previous Data-------------------------*/
        $pre_game_detail = $game_created_3->result_array();
        
        foreach($pre_game_detail as $games){
            if($games['game_type']==0)
            {
                $public_game_percent += 1;
            }
            else
            {
                $private_game_percent += 1;
            }  
            if($games['user_id']==0)
            {
               $admin_game_percent+= 1; 
            }
            else
            {
               $user_game_percent += 1; 
            }
        }
        
        $public_game_percent = (($public_game - $public_game_percent)*100)/$public_game_percent;
        
        $private_game_percent = (($private_game - $private_game_percent)*100)/$private_game_percent;
        
        $admin_game_percent = (($admin_game_percent - $admin_game_percent)*100)/$admin_game_percent;
        
        $user_game_percent = (($user_game_percent - $user_game_percent)*100)/$user_game_percent;
        
        
        /*---------------------------------------End Game Chart-----------------------------------------*/
        
        
        /*----------------------Entry Fee Detail And Site Commission Calculartion For Generating Chart---------------------*/
        
        $entry_fee_1 = $this->db->query($entry_fee_temp);
        $total_entry_fees = $entry_fee_1->row_array();
        $total_site_comm = (($total_entry_fees['total_entries']*$commission['site_rake'])/100);
        
        /*--------------------------------Entry Fee And Site Commission Current Data Calculation -----------------------*/
        $entry_fee_detail = $entry_fee_2->result_array();
        foreach($entry_fee_detail as $entry_fee)
        {
            if($entry_fee['game_type']==0)
            {
                $entry_fee_game += $entry_fee['totat_entryfee'];
                $site_commission_public_game += (($entry_fee['totat_entryfee']*$commission['site_rake'])/100);
                
            }
            else
            {
                $entry_fee_private_game += $entry_fee['totat_entryfee'];
                $site_commission_private_game += (($entry_fee['totat_entryfee']*$commission['site_rake'])/100);
            }            
            if($entry_fee['user_id']==0)
            {
               $entry_fee_admin += $entry_fee['totat_entryfee'];  
               $site_commission_admin += (($entry_fee['totat_entryfee']*$commission['site_rake'])/100);
            }
            else
            {
               $entry_fee_user += $entry_fee['totat_entryfee']; 
               $site_commission_user += (($entry_fee['totat_entryfee']*$commission['site_rake'])/100);
            }            
        }
        
        /*---------------------------Entry Fee And Site Commission Previous Data Calculation---------------------------*/
        $entry_fee_detail_pre = $entry_fee_3->result_array();
        foreach($entry_fee_detail_pre as $entry_fee)
        {
            if($entry_fee['game_type']==0)
            {
                $entry_fee_private_game_percent += $entry_fee['totat_entryfee'];
                $site_commission_public_game_percent += (($entry_fee['totat_entryfee']*$commission['site_rake'])/100);
                
            }
            else
            {
                $entry_fee_private_game_percent += $entry_fee['totat_entryfee'];
                $site_commission_private_game_percent += (($entry_fee['totat_entryfee']*$commission['site_rake'])/100);
            }  
            
            if($entry_fee['user_id']==0)
            {
               $entry_fee_admin_game_percent += $entry_fee['totat_entryfee'];  
               $site_commission_admin_game_percent += (($entry_fee['totat_entryfee']*$commission['site_rake'])/100);
            }
            else
            {
               $entry_fee_user_game_percent += $entry_fee['totat_entryfee']; 
               $site_commission_user_game_percent += (($entry_fee['totat_entryfee']*$commission['site_rake'])/100);
            }
        }
        
        $entry_fee_public_game_percent = (($entry_fee_game - $entry_fee_public_game_percent)*100)/$entry_fee_public_game_percent;
        
        $entry_fee_private_game_percent = (($entry_fee_private_game - $entry_fee_private_game_percent)*100)/$entry_fee_private_game_percent;
        
        $site_commission_public_game_percent = (($site_commission_public_game - $site_commission_public_game_percent)*100)/$site_commission_public_game_percent;
        
        $site_commission_private_game_percent = (($site_commission_private_game - $site_commission_private_game_percent)*100)/$site_commission_private_game_percent;
        
        
        $entry_fee_admin_game_percent = (($entry_fee_admin - $entry_fee_admin_game_percent)*100)/$entry_fee_admin_game_percent;
        
        $entry_fee_user_game_percent = (($entry_fee_user- $entry_fee_user_game_percent)*100)/$entry_fee_user_game_percent;
        
        $site_commission_admin_game_percent = (($site_commission_admin - $site_commission_admin_game_percent)*100)/$site_commission_admin_game_percent;
        
        $site_commission_user_game_percent = (($site_commission_user - $site_commission_user_game_percent)*100)/$site_commission_user_game_percent;
        /*-----------------------------------------End Entry Fees Chart---------------------------------*/
        
        
        /*-------------------------------------------Getting Prize Detail Calculation For Chart----------*/
        $tolal_prize = $prize_detail_1->row_array();
        
        /*-----------------------------Current Data Calculation---------------------------------*/
        
        $prize_detail = $prize_detail_2->result_array();
        foreach($prize_detail as $prize)
        {
            if($prize['game_type']==0)
            {
                $prize_detail_public_game += $prize['total_prize'];
            }
            else
            {
                $prize_detail_private_game += $prize['total_prize'];
            }            
            if($prize['user_id']==0)
            {
               $prize_detail_admin += $prize['total_prize'];  
            }
            else
            {
               $prize_detail_user += $prize['total_prize']; 
            }            
        }
        
        /*-----------------------------Prize Detail Previous Data Calculation----------------------------------*/
        
        $prize_detail_pre = $prize_detail_3->result_array();
        foreach($prize_detail_pre as $prize)
        {
            if($prize['game_type']==0)
            {
                $prize_detail_public_game_percent += $prize['total_prize'];
            }
            else
            {
                $prize_detail_private_game_percent += $prize['total_prize'];
            }   
            
            if($prize['user_id']==0)
            {
                $prize_detail_admin_game_percent += $prize['total_prize'];
            }
            else
            {
                $prize_detail_user_game_percent += $prize['total_prize'];
            } 
        } 
        $prize_detail_public_game_percent = (($prize_detail_public_game - $prize_detail_public_game_percent)*100)/$prize_detail_public_game_percent;
        
        $prize_detail_private_game_percent = (($prize_detail_private_game - $prize_detail_private_game_percent)*100)/$prize_detail_private_game_percent;
        $prize_detail_admin_game_percent = (($prize_detail_admin - $prize_detail_admin_game_percent)*100)/$prize_detail_admin_game_percent;
        
        $prize_detail_user_game_percent = (($prize_detail_user - $prize_detail_user_game_percent)*100)/$prize_detail_user_game_percent;
        
        /*---------------------------------------------End Prize Detail Chart----------------------------*/
        
        
        
        /*---------------------------------------General Chart data Calculation for generating chart------*/
        
        $general_chart = $general_chart_1->result_array();
        if(empty($general_chart))
        {
            $general_chart = array('entry_fee'=>0,"game"=>0,"created_date"=>'');
        }
        
        /*----------------------------------End General Chart--------------------------------------------*/
        //print_r($prize_detail);
         $dashboard_detail = array(
                                    "games_chart_user_admin"=>array(
                                                         "User"=>$user,"Admin"=>$admin
                                                        ),
                                    "games_chart_public_private"=>array(
                                                         "Private"=>$private_game,"Public"=>$public_game
                                                        ),
                                    "game_detail"=>array(
                                                        'total_game'=>$game['total_game'],
                                                        "per_private"=>sprintf('%d', $private_game_percent),"per_public"=>sprintf('%d', $public_game_percent),
                                                        "per_admin"=>sprintf('%d', $admin_game_percent),"per_user"=>sprintf('%d', $user_game_percent)
                                                        ),
                                    "entry_fee_chart_user_admin"=>array(
                                                             "User"=>$entry_fee_user,"Admin"=>$entry_fee_admin
                                                            ),
                                    "entry_fee_chart_public_private"=>array(
                                                             "Private"=>$entry_fee_private_game,"Public"=>$entry_fee_game
                                                            ),
                                    "entry_fee_detail"=>array(
                                                             "user"=>sprintf('%0.2f',$entry_fee_user),"admin"=>sprintf('%0.2f',$entry_fee_admin),
                                                             "private"=>sprintf('%0.2f',$entry_fee_private_game),"public"=>sprintf('%0.2f',$entry_fee_game),
                                                             'total_entry_fees'=>$total_entry_fees['total_entries'],
                                                             "per_private"=>sprintf('%d', $entry_fee_private_game_percent),"per_public"=>sprintf('%d', $entry_fee_private_game_percent),
                                                             "per_admin"=>sprintf('%d', $entry_fee_admin_game_percent),"per_user"=>sprintf('%d', $entry_fee_user_game_percent)
                                                             ),
                                    "prize_chart_user_admin"=>array(
                                                                    "User"=>$prize_detail_user,"Admin"=>$prize_detail_admin
                                                                   ),
                                    "prize_chart_public_private"=>array(
                                                                        "Private"=>$prize_detail_private_game,"Public"=>$prize_detail_public_game
                                                                       ),
                                    "prize_detail"=>array(
                                                         'total_prize'=>$tolal_prize['total_prize'],
                                                         "user"=>$prize_detail_user,"admin"=>$prize_detail_admin,
                                                         "private"=>sprintf('%0.2f', $prize_detail_private_game),"public"=>sprintf('%0.2f', $prize_detail_public_game),
                                                         "per_private"=>sprintf('%d', $prize_detail_private_game_percent),"per_public"=>sprintf('%d', $prize_detail_public_game_percent),
                                                         "per_admin"=>sprintf('%d', $prize_detail_admin_game_percent),"per_user"=>sprintf('%d', $prize_detail_user_game_percent)
                                                         ),
                                    "comm_chart_user_admin"=>array(
                                                        "User"=>$site_commission_user,"Admin"=>$site_commission_admin
                                                        ),
                                    "comm_chart_public_private"=>array(
                                                        "Private"=> $site_commission_private_game ,"Public"=> $site_commission_public_game,
                                                        ),   
                                    "comm_detail"=>array(
                                                        'total_comm'=>$total_site_comm,
                                                        "user"=>sprintf('%0.2f', $site_commission_user),"admin"=>sprintf('%0.2f', $site_commission_admin),
                                                        "private"=>sprintf('%0.2f', $site_commission_private_game),"public"=>sprintf('%0.2f', $site_commission_public_game),
                                                        "per_private"=>sprintf('%d', $site_commission_private_game_percent),"per_public"=>sprintf('%d', $site_commission_public_game_percent),
                                                        "per_admin"=>sprintf('%d', $site_commission_admin_game_percent),"per_user"=>sprintf('%d', $site_commission_user_game_percent)
                                                        ),
                                    "general_chart"=>$general_chart

                             );
         return $dashboard_detail;
    }
    
}