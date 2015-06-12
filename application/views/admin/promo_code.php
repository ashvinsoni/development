<!-- Content -->
<div class="content">
	<div class="title">
		<h5>Promo Codes</h5>
	</div>
	<?php $frm_attr = 'id="promo_list"'; echo form_open( current_url() , $frm_attr ); ?>
		<div class="stats roster_ul frm_input">
			
			<div class="fix"></div>
		</div>
		<div style="float:right;padding-bottom:10px;">
                	<input onclick="window.location.href='<?php echo site_url( 'admin/new_promo_code' ) ?>'" class="redBtn" type="button" value="Create New">
               </div>
		<div class="widget mrt20" id="promo_wrapper">
			<div class="head">
				<h5 class="iFrames">Manage Promo Code</h5>
                

			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="display resize frm_input roster" id="promo">
				<thead>
					<tr class="roster_th">
						<th class="all_th" style="width:4%;">
							<input type="checkbox" id="all" onclick="Promo.toggle_checkbox();">
						</th>
						<th align="left">Promo Code</th>
						<th align="left">Sales Person </th>
						<th align="right">Discount(%)</th>
						<th align="right">Benifit Cap</th>
						<th align="right">Commission(%)</th>
						<th align="left">Start Date</th>
						<th align="left">Expiry Date</th>
						<th align="left">Type</th>
						<th align="center">Status</th>
					</tr>
				</thead>
				<tbody id="promolisting_container"></tbody>
			</table>
		</div>

		<div class="pagination promo">
			<span class="action">
				<?php if ( isset( $status) ){ $attr = 'id="status" class="jw125" '; echo form_dropdown( 'status' , $status , '' , $attr ); } ?>
				<input type="button" value="Update" class="greyishBtn submitForm" style="float:left;" onclick="Promo.UpdatePromo();">

			</span>
			<!-- Pagination -->
		</div>

	<?php echo form_close(); ?>
</div>

<script type="text/x-handlebars-template" id="PromoListingTemplete">
	{{#each this}}
		<tr>
			<td><input type="checkbox" name="promo_code_id[]" id="promo_code_id" class="promo_code_id" value="{{this.promo_code_id}}"></td>
			<td>{{this.promo_code}}</td>
			<td>{{this.sales_person_name}}</td>
			<td align="right">{{this.discount}}</td>
			<td align="right">{{this.benefit_cap}} </td>
			<td align="right">{{this.sales_person_commission}}</td>
			<td>{{this.start_date}}</td>
			<td>{{this.expiry_date}}</td>
			<td>{{this.type}}</td>
			
			<td class="new_{{this.promo_code_id}}" align="center">
			
				{{#compare this.status 1 operator="=="}}
					<img src="images/active.png" id="imgactive_{{this.promo_code_id}}" onclick="Promo.changestatusbybutton('{{this.promo_code_id}}',0);" class="status_{{this.promo_code_id}}">
				{{/compare}}
				{{#compare this.status 0 operator="=="}}
					<img src="images/deactivate.png" id="imgdeactive_{{this.promo_code_id}}" onclick="Promo.changestatusbybutton('{{this.promo_code_id}}',1);" class="status_{{this.promo_code_id}}">
				{{/compare}}
			
		</td>
		</tr>
	{{/each}}
</script>
<?php echo '<script type="text/javascript"> var promolist = {}; '; if ( isset( $promo_code ) ) echo 'promolist = '.json_encode( $promo_code  ).';'; echo '</script>'; ?>


<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/view_promo_code.js<?php version_control(); ?>"></script>