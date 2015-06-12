<!-- Content -->
<div class="content">
	<div class="title">
		<h5>Sales Person</h5>
	</div>
	<?php $frm_attr = 'id="person_list"'; echo form_open( current_url() , $frm_attr ); ?>
		<div class="stats roster_ul frm_input">
			
			<div class="fix"></div>
		</div>
		<div style="float:right;padding-bottom:10px;">
               <input onclick="window.location.href='<?php echo site_url( 'admin/new_sales_person' ) ?>'" class="redBtn" type="button" value="Create New">
        </div>
		<div class="widget mrt20" id="person_wrapper">
			<div class="head">
				<h5 class="iFrames">Manage Sales Person</h5>

			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="display resize frm_input roster" id="person">
				<thead>
					<tr class="roster_th">
						<th class="all_th" style="width:4%;">
							<input type="checkbox" id="all" onclick="Person.toggle_checkbox();">
						</th>
						<th  align="left">First Name</th>
						<th  align="left">Last Name</th>
						<th  align="left">Email</th>	
						<th  align="left">Dob</th>
						<th align="left" >Created Date</th>
						<th  align="center">Status</th>
						<th  align="center">Action</th>
					</tr>
				</thead>
				<tbody id="personlisting_container"></tbody>
			</table>
		</div>

		<div class="pagination person">
			<span class="action">
				<?php if ( isset( $status) ){ $attr = 'id="status" class="jw125" '; echo form_dropdown( 'status' , $status , '' , $attr ); } ?>
				<input type="button" value="Update" class="greyishBtn submitForm" style="float:left;" onclick="Person.UpdatePerson();">
			</span>
			<!-- Pagination -->
		</div>

	<?php echo form_close(); ?>
</div>

<script type="text/x-handlebars-template" id="PersonListingTemplete">
	{{#each this}}
		<tr>
			<td><input type="checkbox" name="sales_person_unique_id[]" id="sales_person_unique_id" class="sales_person_unique_id" value="{{this.sales_person_unique_id}}"></td>
			<td>{{this.first_name}}</td>
			<td>{{this.last_name}}</td>
			<td>{{this.email}} </td>
			<td>{{this.dob}}</td>
			<td>{{this.date_added}}</td>
			<td class="new_{{this.sales_person_unique_id}}" align="center">
				{{#compare this.status 1 operator="=="}}
					<img src="images/active.png" id="imgactive_{{this.sales_person_unique_id}}" onclick="Person.changestatusbybutton('{{this.sales_person_unique_id}}',0);" class="status_{{this.sales_person_unique_id}}">
				{{/compare}}
				{{#compare this.status 0 operator="=="}}
					<img src="images/deactivate.png" id="imgdeactive_{{this.sales_person_unique_id}}" onclick="Person.changestatusbybutton('{{this.sales_person_unique_id}}',1);" class="status_{{this.sales_person_unique_id}}">
				{{/compare}}
			</td>
			<td align="center">
				<a href="javascript:void(0);" title="Edit" class="btn14 game_edit_{{@index}}" onclick="window.location = '<?php echo site_url( 'admin/edit_sales_person' ); ?>/{{this.sales_person_unique_id}}';">
					<img src="images/icons/color/pencil.png" alt="">
				</a>
			</td>
		</tr>
	{{/each}}
</script>
<?php echo '<script type="text/javascript"> var personlist = {}; '; if ( isset( $sales_person ) ) echo 'personlist = '.json_encode( $sales_person  ).';'; echo '</script>'; ?>


<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/view_sales_person.js<?php version_control(); ?>"></script>