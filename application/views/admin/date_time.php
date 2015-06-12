<?php //die; ?>
<!-- Content -->
<div class="content" style="padding-bottom:20px;">
	<div class="title">
		<h5>Manage Date</h5>
	</div>
	<?php $attr = 'class="mainForm" id="valid"'; echo form_open( current_url() , $attr ); ?>
		<fieldset>
			<div class="widget">
				<div class="head">
					<h5 class="iList">Change Site Date</h5>
				</div>
				<div class="rowElem">
					<label for="game_name">Current Date:</label>
					<div class="formRight">
						<input type="text" name="current_date" id="current_date" style="width:25%;" value="<?php echo format_date( ); ?>" readonly>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="game_name">New Date:</label>
					<div class="formRight">
						<input type="text" name="date" id="date" class="validate[required]" style="width:25%;">
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="">&nbsp;</label>
					<div class="formRight">
						<input type="submit" value="Change Date" class="greyishBtn" />
					</div>
					<div class="fix"></div>
				</div>
				<div class="fix"></div>
			</div>
		</fieldset>
	<?php echo form_close(); ?>
</div>
<script type="text/javascript" src="js/jquery-ui-1.10.2.custom.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript">
$( document ).ready( function(){
	$( "#date" ).datetimepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat:"yy-mm-dd",
		minDate:'2013-01-01',
		maxDate:'2014-12-31',
		beforeShow: function(input, inst) {
    	// Handle calendar position before showing it.
    	// It's not supported by Datepicker itself (for now) so we need to use its internal variables.
        var calendar = inst.dpDiv;
        // Dirty hack, but we can't do anything without it (for now, in jQuery UI 1.8.20)
        setTimeout(function() {
            calendar.position({
                my: 'right top',
                at: 'right bottom',
                collision: 'none',
                of: input
            });
        }, 1);
	    }
	});
});
</script>

<!-------------FOR SCORE TESTING------------------------------------------------> 


<div class="content" style="display:none;" >
	<div class="title">
		<h5>Scheduler Files </h5>
	</div>
	
		<fieldset>
			<div class="widget" style="margin-top:15px;">
				<div class="head">
					<h5 class="iList">Get Game score from Sports data LLC </h5>
				</div>
				<div class="rowElem">
					<div>
						<a href="<?php echo PATH_URL; ?>cron/get_game_statistics_nfl" target="_blank"><?php echo PATH_URL; ?>cron/get_game_statistics_nfl</a>
					</div>
					<div class="fix"></div>
				</div>
			</div>
            <div class="widget" style="margin-top:15px;">
				<div class="head">
					<h5 class="iList">Game Cancellation due to insufficient entry</h5>
				</div>
				<div class="rowElem">
					<div>
						<a href="<?php echo PATH_URL; ?>cron/game_cancellation" target="_blank"><?php echo PATH_URL; ?>cron/game_cancellation</a>
					</div>
					<div class="fix"></div>
				</div>
			</div>
            <div class="widget" style="margin-top:15px;">
				<div class="head">
					<h5 class="iList">Daily prize distribute</h5>
				</div>
				<div class="rowElem">
					<div>
						<a href="<?php echo PATH_URL; ?>cron/daily_prize_distribute_to_winner" target="_blank"><?php echo PATH_URL; ?>cron/daily_prize_distribute_to_winner</a>
					</div>
					<div class="fix"></div>
				</div>
			</div>
            <div class="widget" style="margin-top:15px;">
				<div class="head">
					<h5 class="iList">Weekly prize distribute</h5>
				</div>
				<div class="rowElem">
					<div>
						<a href="<?php echo PATH_URL; ?>cron/weekly_prize_distribute_to_winner_nfl" target="_blank"><?php echo PATH_URL; ?>cron/weekly_prize_distribute_to_winner_nfl</a>
					</div>
					<div class="fix"></div>
				</div>
			</div>
            
		</fieldset>
	
</div>
