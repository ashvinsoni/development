<div class="content">
	<div class="title">
		<h5>Reports</h5>
	</div>
	<div class="stats mainForm rep">
		<?php $attr='id="report_frm" target="_blank"'; echo form_open( site_url( 'admin/get_all_user_report' ) , $attr ); ?>
		<ul>
			<li>
				<input type="text" name="from_date" id="from_date" placeholder="From Date" readonly>
			</li>
			<li>
				<input type="text" name="to_date" id="to_date" placeholder="To Date" readonly>
			</li>
			<li class="mar-3">
				<a href="javascript:void(0);" class="greyishBtn submitForm" onclick="create_user_report();">&nbsp; Go &nbsp;</a>
			</li>
			<li class="mar-1">
				<a href="javascript:void(0);" class="redBtn submitForm user_report hide" onclick="export_to_csv();">&nbsp;Export to CSV&nbsp;</a>
			</li>
		</ul>
		<?php echo form_close(); ?>
	</div>
	<div class="widget mrt20" id="report_wrapper">
		<div class="head">
			<h5 class="iFrames">User Report</h5>
		</div>
		<table cellpadding="0" cellspacing="0" width="100%" class="hide display resize user_report report" id="user_report">
			<thead>
				<tr>
					<th>UserName</th>
					<th>Name</th>
					<th>Country</th>
					<th>Email</th>
					<th>DOB</th>
					<th>Deposited</th>
					<th>Withdrawal</th>
					<th>Current Balance</th>
					<th>Matches Played</th>
					<th>Matches Won</th>
					<th>Matches Lost</th>
					<th>Prize Amount Won</th>
					<th>Prize Amount Lost</th>
				</tr>
			</thead>
			<tbody id="userreport_container"></tbody>
		</table>
		<!-- <span><h3><p class="center red">No record found</p></h3></span> -->
	</div>
</div>
<script type="text/x-handlebars-template" id="UserReportTemplete">
	{{#each this}}
		<tr>
			<td>{{this.user_name}}</td>
			<td>{{this.name}}</td>
			<td>{{this.country}}</td>
			<td>{{this.email}}</td>
			<td>{{this.dob}}</td>
			<td align="right">{{this.deposite_by_user}}</td>
			<td align="right">{{this.withdraw_by_user}}</td>
			<td align="right">{{this.balance}}</td>
			<td>{{this.matches_played}}</td>
			<td>{{this.matches_won}}</td>
			<td>{{this.matches_lost}}</td>
			<td>{{this.prize_amount_won}}</td>
			/*{{#compare this.prize_amount_won "" operator="!="}}
				{{this.prize_amount_won}}</td>
			{{/compare}}
			{{#compare this.prize_amount_won "" operator="=="}}
				0  
			{{/compare}}*/
			<td>{{this.prize_amount_lost}}</td>
		</tr>
	{{/each}}
</script>
<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/jquery-ui-1.10.2.custom.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/report.js<?php version_control(); ?>"></script>