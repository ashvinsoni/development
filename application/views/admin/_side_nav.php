<!-- Left navigation -->
<div class="leftNav">
	<ul id="menu">
		<!--
		<li>
			<a href="<?php //echo site_url( 'admin' ); ?>" title="Game" class="<?php //if ( in_array( $this->uri->segment(2) , array( 'new_game' , 'index' ,'' ) ) ) echo 'active'; ?>">
				<span>Game</span>
			</a>
		</li>
		-->

		<li>
			<a href="<?php echo site_url( 'admin' ); ?>" title="Game" class="exp<?php if ( in_array( $this->uri->segment(2) , array( 'new_game' , 'index' , '' ) ) ) echo ' active'; ?>">
				<span>Game</span>
			</a>
			<ul class="sub">
				<li>
					<a href="<?php echo site_url( 'admin' );?>" title="">Current</a>
				</li>
				<li>
					<a href="<?php echo site_url( 'admin/cancelled_game' ); ?>" title="">Cancelled</a>
				</li>
				<li class="last">
					<a href="<?php echo site_url( 'admin/completed_game' ); ?>" title="">Completed</a>
				</li>
			</ul>
		</li>

		<li>
			<a href="<?php echo site_url( 'admin/roster' ); ?>" title="Roster Management" class="<?php if ( $this->uri->segment(2) == 'roster' ) echo 'active'; ?>">
				<span>Roster Management</span>
			</a>
		</li>
		
		<li>
			<a href="<?php echo site_url( 'admin/user' ); ?>" title="" class="<?php if ( $this->uri->segment(2) == 'user' ) echo 'active'; ?>">
				<span>User Monitoring</span>
			</a>
		</li>

		<li>
			<a href="<?php echo site_url( 'admin' ); ?>" title="" class="exp<?php if ( in_array( $this->uri->segment(2) , array( 'user_report' , 'contest_report' , 'games_report' ) ) ) echo ' active'; ?>">
				<span>Reports</span>
			</a>
			<ul class="sub">
				<li>
					<a href="<?php echo site_url( 'admin/user_report' );?>" title="">User Wise Report</a>
				</li>
				<li>
					<a href="<?php echo site_url( 'admin/contest_report' ); ?>" title="">Contest Report</a>
				</li>
				<li class="last">
					<a href="<?php echo site_url( 'admin/games_report' ); ?>" title="">Games Report</a>
				</li>
			</ul>
		</li>
		<li>
			<a href="<?php echo site_url( 'admin' ); ?>" title="" class="exp<?php if ( in_array( $this->uri->segment(2) , array( 'sales_person' , 'promo_code' , 'commission_payout' ) ) ) echo ' active'; ?>">
				<span>Promo Codes</span>
			</a>
			<ul class="sub">
				<li>
					<a href="<?php echo site_url( 'admin/sales_person' );?>" title="">Sales Persons</a>
				</li>
				<li>
					<a href="<?php echo site_url( 'admin/promo_code' ); ?>" title="">Promo Codes</a>
				</li>
				<li class="last">
					<a href="<?php echo site_url( 'admin/commission_payout' ); ?>" title="">Commission Payout</a>
				</li>
			</ul>
		</li>
 
		<li>
			<a href="<?php echo site_url( 'admin' ); ?>" class="exp<?php if ( in_array( $this->uri->segment(2) , array( 'withdrawal_request' , 'withdrawal_request_paypal' ) ) ) echo ' active'; ?>">
				<span>Withdrawal Request</span>
			</a>
			<ul class="sub">
				<li>
					<a href="<?php echo site_url( 'admin/withdrawal_request' ); ?>">Live Check</a>
				</li>
				<li>
					<a href="<?php echo site_url( 'admin/withdrawal_request_paypal' ); ?>">Paypal</a>
				</li>
			</ul>
		</li>
		<li>
		<li>
		<li>
			<a href="<?php echo site_url( 'admin/news' ); ?>" title="" class="<?php if (in_array( $this->uri->segment(2) , array( 'news' , 'add_news' , 'edit_news' ) ) == 'news' ) echo 'active'; ?>">
				<span>Manage News</span>
			</a>
		</li>
		<li>
			<a href="<?php echo site_url( 'admin/youtube_url' ); ?>" title="Youtube Url" class="<?php if ( $this->uri->segment(2) == 'youtube_url' ) echo 'active'; ?>">
				<span>Youtube Url</span>
			</a>
		</li>
		<?php /* ?>
		<li>
			<a href="<?php echo site_url( 'admin/calculated_player_salary_football' ); ?>" title="Player Salary" class="<?php if ( $this->uri->segment(2) == 'calculated_player_salary_football' ) echo 'active'; ?>">
				<span>Player Salary Calculate</span>
			</a>
		</li>		
	   <?php */ ?>
		<li>
			<a href="<?php echo site_url( 'admin/my_profile' ); ?>" title="My Profile" class="<?php if ( $this->uri->segment(2) == 'my_profile' ) echo 'active'; ?>">
				<span>My Profile</span>
			</a>
		</li>
	 
		<li>
			<a href="<?php echo site_url( 'admin/send_emails' ); ?>" title="Send Emails" class="<?php if ( $this->uri->segment(2) == 'send_emails' ) echo 'active'; ?>">
				<span>Send Email to Users</span>
			</a>
		</li>
	 
		<li>
			<a href="<?php echo site_url( 'admin/date_time' ); ?>" title="Manage Date" class="<?php if ( $this->uri->segment(2) == 'date_time' ) echo 'active'; ?>">
				<span>Manage Date</span>
			</a>
		</li>
	</ul>
</div>