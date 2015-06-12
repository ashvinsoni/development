<style>
    body{background:url(adminapi/images/main-bg.jpg) top no-repeat;background-attachment: fixed;background-size: cover;height: 100%;}
</style>
<!-- Login form area -->
<div class="loginWrapper" style="margin-top:-195px;">
    <div class="loginLogo" style="display:none;">
        <img src="adminapi/images/loginLogo.png" alt="" />
    </div>
    <div class="loginPanel">
        <div class="nNote nSuccess hideit success_message errcont" ng-if="message == 1" ng-click="hidemsg()">
            <p><strong>SUCCESS: </strong><span ng-bind="messagedetail"></span></p>
        </div>
        <div class="nNote nFailure hideit error_message errcont" ng-if="message == 2" ng-click="hidemsg()">
            <p><strong>ERROR: </strong><span ng-bind="messagedetail"></span></p>
        </div>
        <div class="head">
            <h5 class="iUser">Login</h5>
        </div>

        <?php $attr = 'id="valid" class="mainForm" validation-Engine';
        echo form_open(site_url('fantasyadmin'), $attr); ?>
        <fieldset>
            <div class="loginRow noborder">
                <label for="email">Email:</label>
                <div class="loginInput">
                    <input type="text" name="email" class="autoF validate[required,custom[email]]" id="email" value="" ng-model="user.email" />
                </div>
                <div class="fix"></div>
            </div>

            <div class="loginRow">
                <label for="password">Password:</label>
                <div class="loginInput">
                    <input type="password" name="password" class="validate[required]" id="password" ng-model="user.password"/>
                </div>
                <div class="fix"></div>
            </div>

            <div class="loginRow">
                <div class="rememberMe" style="display:none;">
                    <input type="checkbox" id="check2" name="remember" />
                    <label for="check2">Remember me</label>
                </div>
                <div class="loginInput">
                    <input type="submit" value="Login" class="greyishBtn submitForm" />
                </div>
                <div class="fix"></div>
            </div>
        </fieldset>
<?php echo form_close(); ?>
    </div>
</div>
<!-- Login form area -->
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/plugins/forms/forms.js<?php version_control(TRUE); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/plugins/forms/jquery.validationEngine-en.js<?php version_control(TRUE); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/plugins/forms/jquery.validationEngine.js<?php version_control(TRUE); ?>"></script>