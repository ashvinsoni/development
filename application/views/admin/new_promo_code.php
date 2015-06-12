<div class="content" id="container">
	<div class="title"><h5>Create New Promo Code</h5></div>
	<!-- Form begins -->
	<?php $attr = 'class="mainForm new_promo_code" id="valid"'; echo form_open( current_url() , $attr ); ?>
		<fieldset>
			<div class="widget first">
				<div class="head">
					<h5 class="iList">Promo Code Detail</h5>
				</div>
				
				<div class="rowElem">
					<label for="size">Promo Code:</label>
					<div class="formRight">
						<input type="text" name="promo_code" id="promo_code" maxlength="7" class="per23 validate[required,minSize[7]maxSize[7]custom[onlyLetterNumber]]"/>
					</div>
					<div class="fix"></div>
					<span class="promo-help-txt">Please enter seven alphanumeric character for promocode</span>
				</div>
				<div class="rowElem">
					<label for="t">Select Type:</label>
					<div class="formRight">
						<input type="radio" id="radio1" name="type" value="0"  onclick='new_promo_code.InitializePerson(this);' class="per23 validate[required]"/><label for="radio1">Sales Person</label>
                        <input type="radio" id="radio2" name="type" value="1" onclick='new_promo_code.InitializePerson(this);' class="per23 validate[required]" /><label for="radio2">User</label>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">Sales Person :</label>
					<div class="formRight">
						<select name="sales_person_id" class=" validate[required]" id="sales_person_id">
							<option value="">Select Person</option>
						</select>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">Discount %:</label>
					<div class="formRight">
						<input type="text" name="discount" maxlength="5" id="discount" class="per23 numbersOnly validate[required,max[100]min[1]]"/>
					</div>
					<div class="fix"></div>
					<span class="promo-help-txt">Discount to be given to user on entry fee</span>
				</div>
				<div class="rowElem">
					<label for="size">Benefit Cap:</label>
					<div class="formRight">
						<input type="text" name="benefit_cap" id="benefit_cap" class=" per23 numbersOnly validate[required]"/>
					</div>
					<div class="fix"></div>
					<span class="promo-help-txt">Maximum dollar value of the discount</span>
				</div>
				<div class="rowElem">
					<label for="size">Commission For Sales Person % :</label>
					<div class="formRight">
						<input type="text" name="sales_person_commission" id="sales_person_commission" class=" per23 numbersOnly validate[required],max[100]min[1]"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="date">Start Date:</label>
					<div class="formRight">
						<input type="text" name="start_date" id="start_date" class="per23 validate[required]"/>
					</div>
					<div class="fix"></div>
					<span class="promo-help-txt">Effective start date of promo code</span>
				</div>
				<div class="rowElem">
					<label for="date">Expiry Date:</label>
					<div class="formRight">
						<input type="text" name="expiry_date" id="expiry_date" class="per23 validate[required]"/>
					</div>
					<div class="fix"></div>
					<span class="promo-help-txt">Effective end date of promo code</span>
				</div>
				<div class="rowElem">
					<label for="">&nbsp;</label>
					<div class="formRight">
						<input type="submit" value="Submit" class="greyishBtn"  id="newpromo_submit" />
						<a href="<?php echo site_url( 'admin/promo_code' ); ?>" class="blueNum">Cancel</a>
					</div>
					<div class="fix"></div>
				</div>
				<div class="fix"></div>
			</div>
		</fieldset>
	<?php echo form_close(); ?>
</div>

<?php echo '<script type="text/javascript"> var state = {};'; if ( isset( $state ) ) echo 'state = '.json_encode( $state ).'</script>'; ?>
<?php echo '<script type="text/javascript"> var sales_person = {};'; if ( isset( $sales_person ) ) echo 'sales_person = '.json_encode( $sales_person ); echo '</script>'; ?>
<?php echo '<script type="text/javascript"> var mindate = "'.format_date( 'today' , 'Y-m-d' ).'";</script>'; ?>

<script type="text/javascript" src="js/jquery-ui-1.10.2.custom.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine-en.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/chosen.jquery.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/new_promo_code.js<?php version_control(); ?>"></script>
<script type="text/javascript">
	var today = '<?php echo format_date(); ?>';
</script>