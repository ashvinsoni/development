<div class="content" id="container">
	<div class="title"><h5>Create New Sales Person</h5></div>
	<!-- Form begins -->
	<?php $attr = 'class="mainForm new_sales_person" id="valid"'; echo form_open( current_url() , $attr ); ?>
		<fieldset>
			<input type="hidden" id="action" name="action" value="add">
			<div class="widget first">
				<div class="head">
					<h5 class="iList">Sales Person Detail</h5>
				</div>
				
				<div class="rowElem">
					<label for="size">First Name:</label>
					<div class="formRight">
						<input type="text" name="first_name" id="first_name" class=" per23 validate[required]"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">Last Name:</label>
					<div class="formRight">
						<input type="text" name="last_name" id="last_name" class=" per23 validate[required]"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">Email:</label>
					<div class="formRight">
						<input type="text" name="email" id="email" class=" per23 validate[required,custom[email]]"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="date">Date Of Birth:</label>
					<div class="formRight">
						<input type="text" name="dob" id="dob" class="per23 validate[required]"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">Zip Code:</label>
					<div class="formRight">
						<input type="text" name="zip_code" id="zip_code" class="intigerOnly per23 validate[required]"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">Street 1:</label>
					<div class="formRight">
						<input type="text" name="street1" id="street1" class=" per23 validate[required]"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">Street 2:</label>
					<div class="formRight">
						<input type="text" name="street2" id="street2" class=" per23 "/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">City:</label>
					<div class="formRight">
						<input type="text" name="city" id="city" class=" per23 validate[required]"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">State:</label>
					<div class="formRight">
						<select name="state_id" class="validate[required]" id="state_id">
							<option value="">Select state</option>
						</select>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">Country:</label>
					<div class="formRight">
						USA
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="">&nbsp;</label>
					<div class="formRight">
						<input type="submit" value="Submit" class="greyishBtn" id="new_salesperson" />
						<a href="<?php echo site_url( 'admin/sales_person' ); ?>" class="blueNum">Cancel</a>
					</div>
					<div class="fix"></div>
				</div>
				<div class="fix"></div>
			</div>
		</fieldset>
	<?php echo form_close(); ?>
</div>

<?php echo '<script type="text/javascript"> var state = {};'; if ( isset( $state ) ) echo 'state = '.json_encode( $state ).'</script>'; ?>
<?php echo '<script type="text/javascript"> var person_record = {};'; if ( isset( $person_record ) ) echo 'person_record = '.json_encode( $person_record ); echo '</script>'; ?>
<?php echo '<script type="text/javascript"> var mindate = "'.format_date( 'today' , 'Y-m-d' ).'";</script>'; ?>
<script type="text/javascript" src="js/jquery-ui-1.10.2.custom.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine-en.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/chosen.jquery.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/new_sales_person.js<?php version_control(); ?>"></script>