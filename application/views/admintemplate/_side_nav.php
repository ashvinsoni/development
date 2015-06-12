<!-- Left navigation -->
<div class="leftNav">
    <ul id="menu">
        <li>
            <a href="<?php echo site_url(); ?>fantasyadmin/dashboard" title="Dashboard" active-Nav navclass="dashboard" target="_self">
                <span>Dashboard</span>
            </a>
        </li>
        <li>
            <a href="<?php echo site_url(); ?>fantasyadmin/roster" title="Roster Management" active-Nav navclass="roster" target="_self">
                <span>Roster Management</span>
            </a>
        </li>
        <li>
            <a href="<?php echo site_url(); ?>fantasyadmin/gamelist" title="Game List" active-Nav navclass="gamelist" target="_self">
                <span>Games</span>
            </a>
        </li>
        <li>
            <a href="<?php echo site_url(); ?>fantasyadmin/advertisement_list" title="Advertisement List" class="<?php
            if (in_array($this->uri->segment(2), array('create_advertisement', 'advertisement_list')))
            {
                echo " active";
            }
            ?>" target="_self" >
                <span>Advertise Management</span>
            </a>
        </li>
        <li>
            <a href="<?php echo site_url('fantasyadmin/user'); ?>" title="" class="<?php if ($this->uri->segment(2) == 'user') echo 'active'; ?>">
                <span>User Monitoring</span>
            </a>
        </li>
        <li>
            <a href="<?php echo site_url('fantasyadmin'); ?>" title="" class="exp<?php if (in_array($this->uri->segment(2), array('user_report', 'contest_report', 'games_report'))) echo ' active'; ?>">
                <span>Reports</span>
            </a>
            <ul class="sub">
                <li>
                    <a href="<?php echo site_url('fantasyadmin/user_report'); ?>" title=""  target="_self">User Wise Report</a>
                </li>
                <li>
                    <a href="<?php echo site_url('fantasyadmin/contest_report'); ?>" title="" target="_self">Contest Report</a>
                </li>
                <li class="last">
                    <a href="<?php echo site_url('fantasyadmin/games_report'); ?>" title="" target="_self">Games Report</a>
                </li>
            </ul>
        </li>
        <li>
            <a href="<?php echo site_url('fantasyadmin'); ?>" title="" class="exp<?php if (in_array($this->uri->segment(2), array('sales_person', 'promo_code', 'commission_payout'))) echo ' active'; ?>">
                <span>Promo Codes</span>
            </a>
            <ul class="sub">
                <li>
                    <a href="<?php echo site_url('fantasyadmin/sales_person'); ?>" title="" target="_self">Sales Persons</a>
                </li>
                <li>
                    <a href="<?php echo site_url('fantasyadmin/promo_code'); ?>" title="" target="_self">Promo Codes</a>
                </li>
                <li class="last">
                    <a href="<?php echo site_url('fantasyadmin/commission_payout'); ?>" title="" target="_self">Commission Payout</a>
                </li>
            </ul>
        </li>
        <li>
            <a href="<?php echo site_url('fantasyadmin'); ?>" class="exp<?php if (in_array($this->uri->segment(2), array('withdrawal_request', 'withdrawal_request_paypal'))) echo ' active'; ?>">
                <span>Withdrawal Request</span>
            </a>
            <ul class="sub">
                <li>
                    <a href="<?php echo site_url('fantasyadmin/withdrawal_request'); ?>"  target="_self">Live Check</a>
                </li>
                <li>
                    <a href="<?php echo site_url('fantasyadmin/withdrawal_request_paypal'); ?>"  target="_self">Paypal</a>
                </li>
            </ul>
        </li>
        <li>
            <a href="<?php echo site_url(); ?>fantasyadmin/news" title="Manage News" class="<?php
            if (in_array($this->uri->segment(2), array('news')))
            {
                echo " active";
            }
            ?>" target="_self" >
                <span>Manage News</span>
            </a>
        </li>
        <li>
            <a href="<?php echo site_url(); ?>fantasyadmin/youtube_url" title="Youtube Url" class="<?php
            if (in_array($this->uri->segment(2), array('youtube_url')))
            {
                echo " active";
            }
            ?>" target="_self" >
                <span>Youtube Url</span>
            </a>
        </li>

        <li>
            <a href="<?php echo site_url(); ?>fantasyadmin/my_profile" title="My Profile" class="<?php
               if (in_array($this->uri->segment(2), array('my_profile')))
               {
                   echo " active";
               }
               ?>" target="_self" >
                <span>My Profile</span>
            </a>
        </li>
        <li>
            <a href="<?php echo site_url(); ?>fantasyadmin/send_emails" title="Send Emails" class="<?php
               if (in_array($this->uri->segment(2), array('send_emails')))
               {
                   echo " active";
               }
               ?>" target="_self" >
                <span>Send Email to Users</span>
            </a>
        </li>
        <li>
            <a href="<?php echo site_url(); ?>fantasyadmin/date_time" title="Manage Date Time" class="<?php
               if (in_array($this->uri->segment(2), array('date_time')))
               {
                   echo " active";
               }
               ?>" target="_self" >
                <span>Manage Date</span>
            </a>
        </li>
    </ul>
</div>