<!-- Login form area -->
<div class="loginWrapper" style="margin-top:-195px;">
	<div class="loginLogo" style="display:none;">
		<img src="images/loginLogo.png" alt="" />
	</div>
	<div class="loginPanel">

		<?php if ( isset ( $error_messages ) && !empty( $error_messages ) ){ ?>
			<div class="nNote nFailure hideit error_message">
				<p><strong>ERROR: </strong><?php echo $error_messages ?></p>
			</div>
		<?php } ?>

		<div class="head">
			<h5 class="iUser">Login</h5>
		</div>
		<?php $attr = 'id="valid" class="mainForm"'; echo form_open( current_url() , $attr ); ?>
			<fieldset>
				<div class="loginRow noborder">
					<label for="email">Email:</label>
					<div class="loginInput">
						<input type="text" name="email" class="autoF validate[required,custom[email]]" id="email" value="<?php echo set_value( 'email' ); ?>" />
					</div>
					<div class="fix"></div>
				</div>
				
				<div class="loginRow">
					<label for="password">Password:</label>
					<div class="loginInput">
						<input type="password" name="password" class="validate[required]" id="password" />
					</div>
					<div class="fix"></div>
				</div>
				
				<div class="loginRow">
					<div class="rememberMe" style="display:none;">
						<input type="checkbox" id="check2" name="remember" />
						<label for="check2">Remember me</label>
					</div>
					<div class="loginInput">
						<input type="submit" value="Log me in" class="greyishBtn submitForm" />
					</div>
					<div class="fix"></div>
				</div>
			</fieldset>
		<?php echo form_close(); ?>
	</div>
</div>
<!-- Login form area -->
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine-en.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/common.js<?php version_control(); ?>"></script>
<script type="text/javascript" src="js/login.js<?php version_control(); ?>"></script>