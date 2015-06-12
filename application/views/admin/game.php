<style type="text/css">
.dataTables_filter{width: 280px;}
#game_table_filter label{width: 50px;}
#game_table_filter input{width: 78%;}
.dataTables_filter .srch{right:10px;top: 9px;}
</style>
<!-- Content -->
<div class="content">
	<div class="title">
		<h5>Game</h5>
	</div>
	<!-- Static table with resizable columns -->
	<?php $frm_attr = 'id="game_list" class="frm_input"'; echo form_open( current_url() , $frm_attr ); ?>
		<div class="stats">
			<ul>
				<li>
					<?php $attr = ' onchange="Games.SearchGame();"'; if ( isset( $sport) ) echo form_dropdown( 'league_id' , $sport ,'' , $attr ); ?>
				</li>
			</ul>
			<div class="num" style="float:right;margin-left:20px;">
					<input onclick="window.location.href='<?php echo site_url( 'admin/new_game' ) ?>'" class="redBtn" type="button" value="Create New Game">
			</div>
			<div class="num" style="float:right;">
					<input onclick="window.location.href='<?php echo site_url( 'admin/new_beat_the_best_game' ) ?>'" class="redBtn" type="button" value="Create Odd Man Out Game">
			</div>
			<div class="fix"></div>
		</div>
		<div class="widget mrt20">
			<div class="head">
				<h5 class="iFrames">Manage Games</h5>
				<!--
				<div class="num">
					<input onclick="window.location.href='<?php //echo site_url( 'admin/new_game' ) ?>'" class="redBtn" type="button" value="Create New Game">
				</div>-->
			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="tableStatic resize display" id="game_table">
				<thead>
					<tr>
						<th style="width:325px;">Game Name</th>
						<th>League</th>
						<th>Duration</th>
						<th>Maximum <br/>Participant</th>
						<th>Participant <br/>Joined</th>
						<th>Entry Fee</th>
						<th>Is Feature</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody id="gamelisting_container"></tbody>
			</table>
		</div>
	<?php echo form_close(); ?>
</div>

<script type="text/x-handlebars-template" id="GameListingTemplete">
	{{#each this}}
		<tr>
			<td><span id="game_nam_label_{{@index}}">{{this.game_name}}</span><input type="text" name="game_name_{{@index}}" class="displayNone" id="game_name_{{@index}}" value="{{this.game_name}}"></td>
			<td align="center">{{this.league_desc}}</td>
			<td align="center">{{this.duration_desc}}</td>
			<td align="center">{{this.size}}</td>
			<td align="center">{{this.participant_joined}}</td>
			<td align="center">$ {{this.entry_fee}}</td>
			<td align="center">
			<input type="checkbox" id="is_feature" onclick="makeRemoveFeature(this);" value="{{this.game_unique_id}}" {{this.is_feature}} />
			</td>
			<td>
				<a href="javascript:void(0);" title="Edit" class="links game_edit_{{@index}}" onclick="Games.ShowGameNameForEdit({{@index}});">
					<img src="images/icons/color/pencil.png" alt="">
				</a>
				<a href="javascript:void(0);" title="Save" style="display:none;" class="links game_save_{{@index}}" onclick="Games.SaveGameName({{@index}});" >
					<img src="images/icons/color/disk-return-black.png" alt="">
				</a>
				<a href="javascript:void(0);" title="Delete" class="links" onclick="jConfirm( DELETE_CONFIRM , 'Please Confirmation', function(r) { if (r) window.location = '<?php echo site_url( 'admin/delete_game' ); ?>/{{this.game_unique_id}}'; });">
					<img src="images/icons/color/cross.png" alt="">
				</a>

				{{#compare this.league_drafting_styles_id "6" operator="!="}}
					{{#compare this.league_drafting_styles_id "7" operator="!="}}
						{{#compare this.participant_joined this.size operator="<"}}
							{{#compare this.is_cancel "0" operator="=="}}
								<a href="javascript:void(0);" title="Merge" class="links" onclick="window.location.href='<?php echo site_url( 'admin/merge_game' ) ?>/{{this.game_unique_id}}'">
									<img src="images/icons/color/merge.png" alt="">
								</a>
							{{/compare}}
						{{/compare}}
					{{/compare}}	
				{{/compare}}

				{{#compare this.league_drafting_styles_id "6" operator="=="}}
						<a href="javascript:void(0);" title="Odd Man Out" class="links" onclick="window.location.href='<?php echo site_url( 'admin/odd_man_out' ) ?>/{{this.game_unique_id}}'">
							<img src="images/icons/color/beatthebest.png" alt="">
						</a>
				{{/compare}}

				{{#compare this.league_drafting_styles_id "7" operator="=="}}
						<a href="javascript:void(0);" title="Odd Man Out" class="links" onclick="window.location.href='<?php echo site_url( 'admin/odd_man_out' ) ?>/{{this.game_unique_id}}'">
							<img src="images/icons/color/beatthebest.png" alt="">
						</a>
				{{/compare}}
			</td>
		</tr>
	{{else}}
		<tr>
			<td colspan="6"><h3><p class="center red">No record found</p></h3></td>
		</tr>
	{{/each}}
</script>

<?php echo '<script type="text/javascript"> var Gamelist = {}; '; if ( isset( $game_data[ 'games' ] ) ) echo 'Gamelist = '.json_encode( $game_data[ 'games' ]  ).';'; echo '</script>'; ?>

<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/game.js<?php version_control(); ?>"></script>