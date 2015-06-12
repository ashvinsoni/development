<!------------------------------------------------------------------Controller selection ---------------------------->
<?php if($page=='login'){?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/auth_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }elseif($page=='dashboard'){?>
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/dashboard_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }elseif($page=='advertisement'){?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/advertisement_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }elseif($page=='admingame'){?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/game_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }elseif($page=='roster'){?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/roster_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }elseif($page=='setting'){?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/setting_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }elseif($page=='withdrawal'){?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/withdrawal_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }elseif($page=='promocode'){?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/promocode_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }elseif($page=='report'){?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/report_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }elseif($page=='users'){?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/adminusers_controller.js<?php version_control( TRUE ); ?>"></script>
<?php }else{?>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/controller/controller.js<?php version_control( TRUE ); ?>"></script>
<?php }?>

<!------------------------------------------------------------------End Controller selection ---------------------------->

<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/service/services.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/directive/directive.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/directive/paging.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/plugins/ui/jquery.collapsible.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/plugins/ui/jquery-ui-timepicker-addon.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/plugins/forms/jquery.validationEngine.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/plugins/forms/jquery.validationEngine-en.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/message.js<?php version_control(); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/js/common.js<?php version_control(); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('adminapi'); ?>/ckeditor/ckeditor.js"></script>

<!-- Footer -->
<div id="footer">
	<div class="wrapper">
		<span>&copy; Copyright <?php echo date( 'Y' ); ?>. All rights reserved.</span>
	</div>
</div>
<!-- Footer -->

<div class="modal displayNone"><!-- Place at bottom of page --></div>