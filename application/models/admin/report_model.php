<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Report_model extends MY_Model
{

    function __construct()
    {
        parent::__construct();
    }

    function get_all_user_report($config = array(), $is_total = false)
    {
        $from_date = $config['from_date'];
        $to_date = $config['to_date'];

        $sql = "SELECT
                    CONCAT( `U`.`first_name` , ' ' , `U`.`last_name` ) AS `name` ,
                    `U`.`user_name`,U.country, `U`.`email` , DATE_FORMAT ( `U`.`dob` , '%Y-%m-%d' ) AS `dob` , `MS`.`name` AS `state_name` , `U`.`balance`, 
                    ( SELECT SUM( `transaction_amount` ) FROM `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "` WHERE `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "`.`user_id` = `U`.`user_id` AND `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "`.`description` = 'DEPOSIT' AND  DATE_FORMAT( `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "`.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'  ) AS `deposite_by_user` ,
                    ( SELECT SUM( `transaction_amount` ) FROM `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "` WHERE `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "`.`user_id` = `U`.`user_id` AND `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "`.`description` = 'WITHDRAW' AND  DATE_FORMAT( `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "`.`date_added` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'  ) AS `withdraw_by_user` ,

                    ( SELECT COUNT( LM.`game_unique_id` ) FROM " . $this->db->dbprefix(LINEUP_MASTER) . " AS LM 
                         INNER JOIN `" . $this->db->dbprefix(GAME) . "` AS G ON G.game_unique_id = LM.game_unique_id
                         WHERE G.is_cancel = '0' AND U.user_id = LM.user_id 
                    ) 
                         AS `matches_played`, 

                    ( SELECT COUNT( LM.`lineup_master_id` ) 
                              FROM " . $this->db->dbprefix(LINEUP_MASTER) . " AS LM 
                              INNER JOIN `" . $this->db->dbprefix(GAME) . "` AS G ON G.game_unique_id = LM.game_unique_id 
                              WHERE G.is_cancel = '0' 
                                   AND LM.is_winner = '1' AND U.user_id = LM.user_id
                                   AND  DATE_FORMAT( PHT.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'

                    ) AS `matches_won`,
                    ( SELECT COUNT( LM.`lineup_master_id` ) 
                              FROM " . $this->db->dbprefix(LINEUP_MASTER) . " AS LM 
                              INNER JOIN `" . $this->db->dbprefix(GAME) . "` AS G ON G.game_unique_id = LM.game_unique_id 
                              WHERE G.is_cancel = '0' 
                                   AND LM.is_winner = '0' AND U.user_id = LM.user_id
                                   AND  DATE_FORMAT( PHT.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
                         )  AS `matches_lost`, 
                    ( SELECT SUM( `transaction_amount` ) 
                         FROM `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "` AS PHT 
                         INNER JOIN " . $this->db->dbprefix(LINEUP_MASTER) . " AS LM ON LM.game_unique_id = PHT.game_unique_id 
                         WHERE  LM.is_winner = '1' 
                         AND U.user_id = LM.user_id 
                         AND
                              U.user_id = PHT.user_id 
                         AND PHT.payment_type = 2 
               AND  DATE_FORMAT( PHT.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
                         ) AS `prize_amount_won` , 
                    ( SELECT SUM( `transaction_amount` ) 
                         FROM `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "` AS PHT 
                         INNER JOIN " . $this->db->dbprefix(LINEUP_MASTER) . " AS LM ON LM.game_unique_id = PHT.game_unique_id 
                         WHERE  LM.is_winner = '0' 
                         AND U.user_id = LM.user_id 
                         AND
                              U.user_id = PHT.user_id 
                         AND PHT.payment_type = 1 
               AND  DATE_FORMAT( PHT.`date_added`  , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
                         ) AS `prize_amount_lost`
               FROM 
                    `" . $this->db->dbprefix(USER) . "` AS `U` 
               LEFT JOIN 
                    `" . $this->db->dbprefix(MASTER_STATE) . "` AS `MS` ON `MS`.`id` = `U`.`state_id` 
               INNER JOIN 
                    `" . $this->db->dbprefix(PAYMENT_HISTORY_TRANSACTION) . "` AS `PHT` ON `PHT`.`user_id` = `U`.`user_id` 
               WHERE 
                    DATE_FORMAT( `PHT`.`date_added` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date' ";

        if ($config['filter_name'] != '')
        {
            $sql.= ' Where  U.user_name LIKE "%' . $config['filter_name'] . '%"  ';
        }
        $sql.= " GROUP BY 
					`U`.`user_id` 
					HAVING 
					( `deposite_by_user` != '' OR `withdraw_by_user` != '' )
 				";
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
        //echo $sql;die;
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
            return exit;
        }
    }

    function get_all_contest_report($config = array(), $is_total = false)
    {
        $from_date = $this->input->post('from_date');
        $to_date = $this->input->post('to_date');

        $sql = "SELECT 
                    CONCAT( `U`.`first_name` , ' ' , `U`.`last_name` ) AS `name` 
                    ,U.user_name,U.country,`G`.`game_unique_id` , `G`.`size` ,
                     `G`.`entry_fee` ,`G`.`serial_no` , `L`.`league_desc` ,
                      IF(`MSC`.`salary_cap`=0,'OMO',`MSC`.`salary_cap`) AS salary_cap , `MNOW`.`number_of_winner_desc` AS `prize_type` ,
                    CASE
                            WHEN `G`.`is_cancel` = '1' THEN 'Cancelled'
                            WHEN `G`.`prize_distributed` = '1' THEN 'Completed'
                            ELSE 'In Progress' 
                            END AS `game_status` ,
                    CASE
                            WHEN `LM`.`is_winner` = '0' THEN 'No'
                            WHEN `LM`.`is_winner` = '1' THEN 'Yes'
                            END AS `won` ,
                            `PC`.`promo_code` , `PCE`.`amount_received` , ( `G`.`entry_fee` - `PCE`.`amount_received` ) AS `promo_code_benefit`
                    FROM
                            `" . $this->db->dbprefix(USER) . "` AS `U`
                    INNER JOIN
                            `" . $this->db->dbprefix(LINEUP_MASTER) . "` AS `LM` ON `LM`.`user_id` = `U`.`user_id`
                    INNER JOIN
                            `" . $this->db->dbprefix(GAME) . "` AS `G` On `G`.`game_unique_id` = `LM`.`game_unique_id`
                    LEFT JOIN
                            `" . $this->db->dbprefix(PROMO_CODE_EARNING) . "` AS `PCE` ON `PCE`.`game_unique_id` = `G`.`game_unique_id` AND `PCE`.`user_id` = `U`.`user_id`
                    LEFT JOIN
                            `" . $this->db->dbprefix(LEAGUE_SALARY_CAP) . "` AS `LSC` ON 	`LSC`.`league_salary_cap_id` = `G`.`league_salary_cap_id`
                    LEFT JOIN
                            `" . $this->db->dbprefix(MASTER_SALARY_CAP) . "` AS `MSC` ON 	`MSC`.`salary_cap_id` = `LSC`.`salary_cap_id`
                    LEFT JOIN
                            `" . $this->db->dbprefix(LEAGUE) . "` AS `L` ON `L`.`league_id` = `G`.`league_id`
                    LEFT JOIN
                            `" . $this->db->dbprefix(PROMO_CODE) . "` AS `PC` ON `PC`.`promo_code_id` = `PCE`.`promo_code_id` 
                    LEFT JOIN
                            `" . $this->db->dbprefix(LEAGUE_NUMBER_OF_WINNER) . "` AS `LNOW` ON `LNOW`.`league_number_of_winner_id` = `G`.`league_number_of_winner_id` 
                    LEFT JOIN
                            `" . $this->db->dbprefix(MASTER_NUMBER_OF_WINNER) . "` AS `MNOW` ON `MNOW`.`number_of_winner_id` = `LNOW`.`number_of_winner_id`
                    WHERE
                            DATE_FORMAT( `G`.`season_scheduled_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
                    ";

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

    function get_all_games_report($config = array(), $is_total = false)
    {
        $from_date = $this->input->post('from_date');
        $to_date = $this->input->post('to_date');

        $sql = "SELECT 
                    CASE
                            WHEN `G`.`user_id` = '0' THEN 'Admin'
                            WHEN `G`.`user_id` != '0' THEN 'User'
                            END AS `game_created_by` ,
                    (
                            SELECT 
                                    COUNT( `game_id` )
                            FROM
                                    `" . $this->db->dbprefix(GAME) . "` AS G1
                            WHERE 
                                    DATE_FORMAT( `G1`.`created_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND 'to_date'
                            AND 
                                    CASE
                                            WHEN `game_created_by` = 'Admin' THEN `G1`.`user_id` = '0'
                                            WHEN `game_created_by` = 'User' THEN `G1`.`user_id` != '0'
                                    END
                    ) AS `total_game_created` ,
                    (
                            SELECT 
                                    COUNT( `game_id` )
                            FROM
                                    `" . $this->db->dbprefix(GAME) . "` AS G2
                            WHERE 
                                    DATE_FORMAT( `G2`.`created_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
                            AND 
                                    CASE
                                            WHEN `game_created_by` = 'Admin' THEN `G2`.`prize_distributed` = '1' AND `G2`.`user_id` = '0'
                                            WHEN `game_created_by` = 'User' THEN `G2`.`prize_distributed` = '1' AND `G2`.`user_id`  != '0'
                                    END

                    ) AS `total_game_completed` ,
                    (
                            SELECT 
                                    COUNT( `game_id` )
                            FROM
                                    `" . $this->db->dbprefix(GAME) . "` AS G3 
                            WHERE 
                                    DATE_FORMAT( `G3`.`created_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
                            AND 
                                    CASE
                                            WHEN `game_created_by` = 'Admin' THEN `G3`.`is_cancel` = '1' AND `G3`.`user_id` = '0'
                                            WHEN `game_created_by` = 'User' THEN `G3`.`is_cancel` = '1' AND `G3`.`user_id`  != '0'
                                    END
                    ) AS `total_game_cancelled` ,
                    (
                            SELECT 
                                    COUNT( `game_id` )
                            FROM
                                    `" . $this->db->dbprefix(GAME) . "` AS G4 
                            WHERE 
                                    DATE_FORMAT( `G4`.`created_date` , '%Y-%m-%d' ) BETWEEN '$from_date' AND '$to_date'
                            AND 
                                    CASE
                                            WHEN `game_created_by` = 'Admin' THEN `G4`.`is_cancel` = '0' AND `G4`.`prize_distributed` = '0' AND `G4`.`user_id` = '0'
                                            WHEN `game_created_by` = 'User' THEN `G4`.`is_cancel` = '0' AND `G4`.`prize_distributed` = '0' AND `G4`.`user_id`  != '0'
                                    END

                    ) AS `total_game_in_progress`
            FROM 
                    `" . $this->db->dbprefix(GAME) . "` AS G ";
            if ($config['filter_name'] != '')
            {
                $sql.= ' Where  U.user_name LIKE "%' . $config['filter_name'] . '%"  ';
            }      
            
            $sql .=" GROUP BY
                    `game_created_by`
            ";  
            if ($config['fieldname'] != '' && $config['order'] != '')
            {
                $sql.= ' ORDER BY ' . $config['fieldname'] . ' ' . $config['order'] . '';
            } else
            {
                $sql.= ' ORDER BY game_created_by ASC';
            }

            if ($config['limit'] == 'null')
            {
                $sql.= ' LIMIT 10';
            }
            if ($is_total === FALSE)
            {
                $sql.= ' LIMIT ' . $config['start'] . ', ' . $config['limit'] . '';
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

}
