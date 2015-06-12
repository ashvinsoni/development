<div class="content">
	<div class="title">
		<h5>Reports</h5>
	</div>
	<div class="stats mainForm rep">
		<?php $attr='id="report_frm" target="_blank"'; echo form_open( site_url( 'admin/get_all_games_report' ) , $attr ); ?>
		<ul>
			<li>
				<input type="text" name="from_date" id="from_date" placeholder="From Date">
			</li>
			<li>
				<input type="text" name="to_date" id="to_date" placeholder="To Date">
			</li>
			<li class="mar-3">
				<a href="javascript:void(0);" class="greyishBtn submitForm" onclick="create_game_report();">&nbsp; Go &nbsp;</a>
			</li>
			<li class="mar-1">
				<a href="javascript:void(0);" class="redBtn submitForm game_report hide" onclick="export_to_csv();">&nbsp;Export to CSV&nbsp;</a>
			</li>
		</ul>
		<?php echo form_close(); ?>
	</div>
	<div class="widget mrt20" id="game_report_wrapper">
		<div class="head">
			<h5 class="iFrames">Games Report</h5>
		</div>
		<table cellpadding="0" cellspacing="0" width="100%" class="hide display resize game_report report" id="game_report">
			<thead>
				<tr>
					<th>Game Created By</th>
					<th>Total Game Created</th>
					<th>Total Game Completed</th>
					<th>Total Game Cancelled</th>
					<th>Total Game In Progress</th>
				</tr>
			</thead>
			<tbody id="game_report_container"></tbody>
		</table>
		<!-- <span><h3><p class="center red">No record found</p></h3></span> -->
	</div>
</div>

<script type="text/x-handlebars-template" id="GameReportTemplete">
	{{#each this}}
		<tr>
			<td align="center">{{this.game_created_by}}</td>
			<td align="center">{{this.total_game_created}}</td>
			<td align="center">{{this.total_game_completed}}</td>
			<td align="center">{{this.total_game_cancelled}}</td>
			<td align="center">{{this.total_game_in_progress}}</td>
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