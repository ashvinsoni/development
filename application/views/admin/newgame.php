<div class="content" id="container">
	<div class="title">
		<h5>Create New Game</h5>
	</div>
	<!-- Form begins -->
	<?php $attr = 'class="mainForm new_game" id="valid"'; echo form_open( current_url() , $attr ); ?>
		<fieldset>
			<div class="widget first">
				<div class="head">
					<h5 class="iList">New Game</h5>
				</div>
				<div class="rowElem noborder">
					<label for="game_name">Game Name:</label>
					<div class="formRight">
						<span id="game_name_label"></span>
						<input type="text" name="game_name" id="game_name" class="displayNone per23 validate[required]"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="league_id">Is Featured (Promotional)</label>
					<div class="formRight">
						<input type="checkbox" name="is_feature" value="1" id="is_feature">
					</div>
					<div class="fix"></div>
				</div>
				<!-- <div class="rowElem">
					<label for="is_uncapped">Is Uncapped</label>
					<div class="formRight">
						<input type="checkbox" name="is_uncapped" value="1" id="is_uncapped">
					</div>
					<div class="fix"></div>
				</div> -->
				<div class="rowElem">
					<label for="league_id">Sport</label>
					<div class="formRight">
						<select name="league_id" class="validate[required]" id="league_id" onchange="new_game.InitializeDuration( this );">
							<option value="">Select Sports</option>
						</select>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="league_duration_id">Duration:</label>
					<div class="formRight">
						<input type="hidden" name="duration_id" id="duration_id" value="">
						<select name="league_duration_id" class="validate[required]" id="league_duration_id" onchange="new_game.ShowWeekDates(this);">
							<option value="">Select Game Duration</option>
						</select>&nbsp;
						<a href="javascript:void(0);" class="displayNone total_game" id="total_game" onclick="$( '#game_list' ).toggle();"></a>
					</div>
					<div class="fix"></div>
				</div>
				
				<div class="rowElem displayNone daily">
					<label for="date">Date:</label>
					<div class="formRight">
						<input type="text" name="date" id="date" class="per23 validate[required]" readonly="readonly"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem displayNone daily">
					<label for="buckets">Time:</label>
					<div class="formRight">
						<select name="buckets" class="validate[required]" id="buckets">
							<option value="">Select Time</option>
						</select>
					</div>
					<div class="fix"></div>
				</div>

				<div class="rowElem displayNone total_game" id="game_list">
					<div class="select_all_daily hide">
						<input type="checkbox" class="checkbox_sel_all" value="" id="selectall_daily">
						<span class="select_all_label">Select All</span>
					</div>
					<ul class="game_list"></ul>
				</div>
				<div class="fix"></div>
				<div class="rowElem displayNone weekly">
					<label for="season_week_id">Week:</label>
					<div class="formRight">
						<select name="season_week_id" class="validate[required]" id="season_week_id" onchange="new_game.CreateGameName();">
							<option value="">Select Week</option>
						</select>
					</div>
					<div class="fix"></div>
					<div class="select_all_week hide">
						<input type="checkbox" class="checkbox_sel_all" value="" id="selectall">
						<span class="select_all_label">Select All</span>
					</div>
					<div class="insert_weekly_games"></div>
					<div class="fix"></div>
				</div>
				<div class="insert_games"></div>
				<div class="rowElem">
					<label for="league_drafting_styles_id">Drafting Style:</label>
					<div class="formRight">
						<select name="league_drafting_styles_id" class="validate[required]" id="league_drafting_styles_id" onchange="new_game.CreateGameName('true');">
							<option value="">Select Drafting Style</option>
						</select>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="league_salary_cap_id">Salary Cap:</label>
					<div class="formRight">
						<select name="league_salary_cap_id" class="validate[required]" id="league_salary_cap_id" onchange="new_game.CreateGameName('true');">
							<option value="">Select Salary Cap</option>
						</select>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem featuresize">
					<label for="size">Size:</label>
					<div class="formRight">
						 <select name="size" class="validate[required]" id="sizes" onchange="new_game.GetPrizeDetails();">
							<option value="">Size</option>
							<?php foreach ($size_list as $size) { ?>
								<option value="<?php echo $size['size']?>"><?php echo $size['size']?></option>
							<?php } ?>
							
						</select> 

						<!-- <input type="text" name="size" id="size" class="intigerOnly per23 displayNone validate[required]"  onkeyup="new_game.GetPrizeDetails();"/> -->
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem featurefee">
					<label for="entry_fee">Entry fee:</label>
					<div class="formRight">

						<select name="entry_fee" class="validate[required]" onchange="new_game.GetPrizeDetails();" id="entry_fees" onchange="new_game.GetPrizeDetails();">
							<option value="">Entry fee</option>
							<?php foreach ($fee_list as $fee) { ?>
								<option value="<?php echo $fee['entry_fee']?>"><?php echo $fee['entry_fee']?></option>
							<?php } ?>
						</select>
						<!-- <input type="text" name="entry_fee" id="entry_fee" class="numbersOnly per23 displayNone validate[required]" onkeyup="new_game.GetPrizeDetails();"/> -->
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem featureprizing">
					<label for="league_number_of_winner_id">Prizing:</label>
					<div class="formRight">
						<select name="league_number_of_winner_id" class="validate[required]" id="league_number_of_winner_id" onchange="new_game.GetPrizeDetails();">
							<option value="">Select Prize</option>
						</select>
					</div>
					<div class="fix"></div>
				</div>
				
				<div class="rowElem featureprizeselection">
					<label for="prize_selection">Prize Selection:</label>
					<div class="formRight">
						<div class="prize_sel"><span class="prize_sel_top">Auto(Predefine)</span><input type="radio" value="Manual" name="prize_type" checked></div>
						<div class="prize_sel"><span class="prize_sel_top">Custom</span><input type="radio" value="Custom" name="prize_type"></div>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem manual">
					<label for="prizes">Prize Details:</label>
					<div class="formRight">
						<span id="prizes_detail"></span>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem custom hide">
					<label for="prizes">Prize Details:</label>
					<div class="formRight">
						<input type="text" name="prize_pool" value="" id="prize_pool" class="validate[required]" style="width:200px;">
					</div>
					<div class="fix"></div>
				</div>

				<div class="rowElem">
					<label for="">&nbsp;</label>
					<div class="formRight">
						<input type="submit" value="Submit" class="greyishBtn" />
						<a href="<?php echo site_url( 'admin' ); ?>" class="blueNum">Cancel</a>
					</div>
					<div class="fix"></div>
				</div>
				<div class="fix"></div>
			</div>
		</fieldset>
	<?php echo form_close(); ?>
</div>

<script type="text/javascript">

	var sport             = {};
	var master_data_entry = {};
	var daily_label       = {};
	var VARIABLE          = '';
	var FIXED             = '';
	var mindate           = '0000-00-00';

	<?php if ( isset( $sport ) ) echo 'sport = '.json_encode( $sport  ).';'; ?>
	<?php if ( isset( $master_data_entry ) ) echo 'master_data_entry = '.json_encode( $master_data_entry  ).';'; ?>
	<?php if ( isset( $daily_label ) ) echo 'daily_label = '.json_encode( $daily_label  ).';'; ?>

	<?php if ( defined( 'VARIABLE' ) ) echo 'VARIABLE = '.VARIABLE.';'; ?>
	<?php if ( defined( 'FIXED' ) ) echo 'FIXED = '.FIXED.';'; ?>
	<?php echo 'var mindate = "'.format_date( 'today' , 'Y-m-d' ).'";' ?>

</script>

<script type="text/javascript" src="js/jquery-ui-1.10.2.custom.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine-en.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/chosen.jquery.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/newgame.js<?php version_control(); ?>"></script>
<script type="text/javascript">
$(document).ready(function() {
	$('#uniform-manual').hide();
	$('#prize_pool').keyup(function() {
    	this.value = this.value.replace(/[^0-9\.\-\s\(\)\+]/g,'');
 	});
});
</script>