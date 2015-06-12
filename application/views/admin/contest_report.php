<div class="content">
	<div class="title">
		<h5>Reports</h5>
	</div>
	<div class="stats mainForm rep">
		<?php $attr='id="report_frm" target="_blank"'; echo form_open( site_url( 'admin/get_all_contest_report' ) , $attr ); ?>
		<ul>
			<li>
				<input type="text" name="from_date" id="from_date" placeholder="From Date">
			</li>
			<li>
				<input type="text" name="to_date" id="to_date" placeholder="To Date">
			</li>
			<li class="mar-3">
				<a href="javascript:void(0);" class="greyishBtn submitForm" onclick="create_contest_report();">&nbsp; Go &nbsp;</a>
			</li>
			<li class="mar-1">
				<a href="javascript:void(0);" class="redBtn submitForm contest_report hide" onclick="export_to_csv();">&nbsp;Export to CSV&nbsp;</a>
			</li>
		</ul>
		<?php echo form_close(); ?>
	</div>
	<div class="widget mrt20" id="contest_report_wrapper">
		<div class="head">
			<h5 class="iFrames">Contest Report</h5>
		</div>
		<table cellpadding="0" cellspacing="0" width="100%" class="hide display resize contest_report report" id="contest_report">
			<thead>
				<tr>
					<th>Name</th>
					<th>Username</th>
					<th>Country</th>
					<th>Game Unique Id</th>
					<th>Game Serial No.</th>
					<th>Entrants</th>
					<th>Entry Fees</th>
					<th>League Description</th>
					<th>Salary Cap</th>
					<th>Prize Type</th>
					<th>Game Status</th>
					<th>Won</th>
					<th>Promo Code</th>
					<th>Amount Received</th>
					<th>Promo Code Benefit</th>
				</tr>
			</thead>
			<tbody id="contest_report_container"></tbody>
		</table>
		<!-- <span><h3><p class="center red">No record found</p></h3></span> -->
	</div>
</div>

<script type="text/x-handlebars-template" id="ContestReportTemplete">
	{{#each this}}
		<tr>
			<td>{{this.name}}</td>
			<td>{{this.user_name}}</td>
			<td>{{this.country}}</td>
			<td>{{this.game_unique_id}}</td>
			<td>{{this.serial_no}}</td>
			<td align="center">{{this.size}}</td>
			<td align="right">{{this.entry_fee}}</td>
			<td>{{this.league_desc}}</td>
			<td align="right">{{this.salary_cap}}</td>
			<td>{{this.prize_type}}</td>
			<td>{{this.game_status}}</td>
			<td>{{this.won}}</td>
			<td>{{this.promo_code}}</td>
			<td align="right">{{this.amount_received}}</td>
			<td align="right">{{this.promo_code_benefit}}</td>
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