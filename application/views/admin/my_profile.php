<!-- Content -->
<div class="content">
	<div class="title">
		<h5>My Profile</h5>
	</div>
	<?php $attr = 'class="mainForm" id="valid"'; echo form_open( current_url() , $attr ); ?>
		<fieldset>
			<div class="widget">
				<div class="head">
					<h5 class="iList">Change Password</h5>
				</div>
				<div class="rowElem">
					<label for="game_name">Old password:</label>
					<div class="formRight">
						<input type="password" name="old_password" id="old_password" class="validate[required,minSize[5]]" style="width:50%;">
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="game_name">New password:</label>
					<div class="formRight">
						<input type="password" name="new_password" id="new_password" class="validate[required,minSize[5]]" style="width:50%;">
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="game_name">Confirm new password:</label>
					<div class="formRight">
						<input type="password" name="confirm_new_password" id="confirm_new_password" class="validate[required,equals[new_password]]" style="width:50%;">
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="">&nbsp;</label>
					<div class="formRight">
						<input type="submit" value="Submit" class="greyishBtn" />
					</div>
					<div class="fix"></div>
				</div>
				<div class="fix"></div>
			</div>
		</fieldset>
	<?php echo form_close(); ?>
</div>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine-en.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/my_profile.js<?php version_control(); ?>"></script>