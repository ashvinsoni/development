<div class="content">
	<div class="title">
		<h5>Payment Withdrawal Request</h5>
	</div>
	<?php $attr = 'id="withdrawal_request_frm"'; echo form_open( current_url() , $attr ); ?>
		<div class="widget mrt20" id="withdrawal_wrapper">
			<div class="head">
				<h5 class="iFrames">Withdrawal Request</h5>
			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="display resize" id="withdrawal_request">
				<thead>
					<tr>
						<th><input type="checkbox" id="all" onclick="toggle_checkbox();"></th>
						<th  align="left">Name</th>
						<th  align="left">Email</th>
						<th  align="left">Address</th>
						<th  align="right">Current Balance</th>
						<th  align="right">Withdrawal Amount</th>
						<th  align="center">Check Processed</th>
					</tr>
				</thead>
				<tbody id="withdrawal_request_container"></tbody>
			</table>
			<!-- <span><h3><p class="center red">No record found</p></h3></span> -->
		</div>
		<div class="pagination person">
			<span class="action">
				<?php if ( isset( $status) ){ $attr = 'id="status" class="jw125" '; echo form_dropdown( 'status' , $status , '' , $attr ); } ?>
				<input type="button" value="Update" class="greyishBtn submitForm" style="float:left;" onclick="update_batch_status_of_live_check();">
			</span>
			<!-- Pagination -->
		</div>
	<?php echo form_close(); ?>
</div>
<script type="text/x-handlebars-template" id="WithdrawalRequestTemplete">
	{{#each this}}
		<tr>
			<td><input type="checkbox" name="upwi[]" id="user_payment_withdraw_id_{{this.user_payment_withdraw_id}}" class="user_payment_withdraw_id" value="{{this.user_payment_withdraw_id}}"></td>
			<td>{{this.name}}</td>
			<td>{{this.email}}</td>
			<td>{{this.address}}</td>
			<td align="right">{{this.balance}}</td>
			<td align="right">{{this.transaction_amount}}</td>
			<td align="center">
				<a href="../paypal/process_live_check_request/{{this.user_payment_withdraw_id}}" onclick="showloading();">Approve</a> | 
				<a href="../paypal/reject_live_check_request/{{this.user_payment_withdraw_id}}" onclick="showloading();">Reject</a>
			</td>
		</tr>
	{{/each}}
</script>
<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/withdrawal_request.js<?php version_control(); ?>"></script>
<script type="text/javascript">
	var withdrawal_request = {};
	<?php if ( isset( $withdrawal_request ) ) echo 'withdrawal_request = '. json_encode( $withdrawal_request ).';'; ?>
</script>

