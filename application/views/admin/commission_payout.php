<!-- Content -->
<div class="content">
	<div class="title">
		<h5>Commission payout list</h5>
	</div>
	<?php $frm_attr = 'id="commission_list"'; echo form_open( current_url() , $frm_attr ); ?>
		<input type="hidden" name="year_selected" id="year_selected" value="<?php echo $year_selected ?>">
		<input type="hidden" name="month_selected" id="month_selected" value="<?php echo $month_selected ?>">
		<div class="stats roster_ul frm_input marl1">
			<ul>
				<li>
					<?php $attr='id="year" class="year" onchange="Commission.showValidMonth();"'; echo form_dropdown( 'year' , $year ,  $year_selected , $attr ); ?>
				</li>
				<li>
					<?php $attr='id="month" class="jw125"'; echo form_dropdown( 'month' , $month ,  $month_selected , $attr ); ?>
				</li>
				<li style="width:3%;"><input type="submit" name="search" value="Go" id="search" class="greyishBtn submitForm"></li>
			</ul>
			<div class="fix"></div>
		</div>
		
		<div class="widget mrt20" id="commission_wrapper">
			<div class="head">
				<h5 class="iFrames">Manage Commission Payout</h5>
			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="display resize frm_input roster commission" id="commission" style="display:none;">
				<thead>
					<tr class="roster_th">
						<th class="all_th" style="width:4%;">
							<input type="checkbox" id="all" onclick="Commission.toggle_checkbox();">
						</th>
						<th  align="left">Promo Code</th>
						<th  align="left">Sales Person </th>
						<th  align="left">Email</th>
						<th  align="left">Type</th>
						<th  align="left">Month Year</th>
						<th  align="right">Business Recieved</th>
						<th  align="right">Commission payout</th>
						<th  align="center">Proceed</th>
					</tr>
				</thead>
				<tbody id="commissionlisting_container"></tbody>
			</table>
		</div>

		<div class="pagination commission" style="display:none;">
			<span class="action">
				<?php if ( isset( $status) ){ $attr = 'id="status" class="jw125" '; echo form_dropdown( 'status' , $status , '' , $attr ); } ?>
				<input type="button" value="Update" class="greyishBtn submitForm" style="float:left;" onclick="Commission.UpdateCommission();">
			</span>
			<!-- Pagination -->
		</div>

	<?php echo form_close(); ?>
</div>

<script type="text/x-handlebars-template" id="CommissionListingTemplete">
	{{#each this}}
		<tr>
			<td><input type="checkbox" name="promo_code_id[]" id="promo_code_id" class="promo_code_id" value="{{this.promo_code_id}}"></td>
			<td>{{this.promo_code}}</td>
			<td>{{this.sales_person_name}}</td>
			<td>{{this.sales_person_email}}</td>
			<td>{{this.type}} </td>
			<td>{{this.date}}</td>
			<td align="right">{{this.amount_received}}</td>
			<td align="right">{{this.commission_payout}}</td>
			<td class="new_{{this.promo_code_id}}" align="center">
				{{#compare this.is_processed 1 operator="=="}}
					<img src="images/active.png" id="imgactive_{{this.promo_code_id}}" onclick="Commission.changestatusbybutton('{{this.promo_code_id}}',0);" class="status_{{this.promo_code_id}}">
				{{/compare}}
				{{#compare this.is_processed 0 operator="=="}}
					<img src="images/deactivate.png" id="imgdeactive_{{this.promo_code_id}}" onclick="Commission.changestatusbybutton('{{this.promo_code_id}}',1);" class="status_{{this.promo_code_id}}">
				{{/compare}}
			</td>
		</tr>
	{{/each}}
</script>

<script type="text/javascript">
	var commissionlist = {};
	var Y = <?php echo format_date( 'today' , 'Y' ); ?>;
	var M = <?php echo format_date( 'today' , 'm' ); ?>;
	<?php if ( isset( $promo_code_earning ) )	echo 'commissionlist = '.json_encode( $promo_code_earning  ).';'; ?>
</script>

<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/commission_payout.js<?php version_control(); ?>"></script>