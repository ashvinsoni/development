<style type="text/css">
.dataTables_filter{width: 280px;}
#game_table_filter label{width: 50px;}
#game_table_filter input{width: 78%;}
.dataTables_filter .srch{right:10px;top: 9px;}
</style>
<!-- Content -->
<div class="content">
	<div class="title">
		<h5>Completed Game</h5>
	</div>
	<!-- Static table with resizable columns -->
	<?php $frm_attr = 'id="game_list" class="frm_input"'; echo form_open( current_url() , $frm_attr ); ?>
		<div class="stats">
			<ul>
				<li>
					<?php $attr = ' onchange="Games.SearchGameCompleted();"'; if ( isset( $sport) ) echo form_dropdown( 'league_id' , $sport ,'' , $attr ); ?>
				</li>
			</ul>
			<div class="fix"></div>
		</div>
		<div class="widget mrt20">
			<div class="head">
				<h5 class="iFrames">Manage Games</h5>
				<div class="num">
					<input onclick="window.location.href='<?php echo site_url( 'admin/new_game' ) ?>'" class="redBtn" type="button" value="Create New Game">
				</div>
			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="tableStatic resize display">
				<thead>
					<tr>
						<td style="width:125px;">Game Serial No.</td>
						<td style="width:225px;"><a class="game_name_sort_link" href="javascript:void(0);" <?php if ( isset( $game_name_sort_link ) ){ ?> onclick="<?php echo $game_name_sort_link; ?>" <?php } ?>>Game Name</a></td>
						<td><a class="league_desc_sort_link" href="javascript:void(0);" <?php if ( isset( $league_desc_sort_link ) ){ ?> onclick="<?php echo $league_desc_sort_link; ?>" <?php } ?>>League</a></td>
						<td><a class="duration_desc_sort_link" href="javascript:void(0);" <?php if ( isset( $duration_desc_sort_link ) ){ ?> onclick="<?php echo $duration_desc_sort_link; ?>" <?php } ?>>Duration</a></td>
						<td><a class="size_sort_link" href="javascript:void(0);" <?php if ( isset( $size_sort_link ) ){ ?> onclick="<?php echo $size_sort_link; ?>" <?php } ?>>Maximum Entrants</a></td>
						<td><a class="participant_sort_link" href="javascript:void(0);" <?php if ( isset( $participant_sort_link ) ){ ?> onclick="<?php echo $participant_sort_link; ?>" <?php } ?>>Entrants Joined</a></td>
						<td><a class="entry_fee_sort_link" href="javascript:void(0);" <?php if ( isset( $entry_fee_sort_link ) ){ ?> onclick="<?php echo $entry_fee_sort_link; ?>" <?php } ?>>Entry Fee</a></td>
						<td>Is Feature</td>
						<td>Action</td>
					</tr>
				</thead>
				<tbody id="gamelisting_container"></tbody>
			</table>
		</div>
		<!-- Pagination -->
		<div class="pagination">
			<div id="link" style="float:right;display:inline-table;margin-left:10px;">
				<?php if ( isset( $link ) ) echo $link; ?>
			</div>
			<div class="per_page">
				<?php if ( isset( $per_page_limit ) ){ $attr = 'id="per_page_limit" onchange="Games.SearchGameCompleted();"'; echo form_dropdown( 'per_page_limit' , $per_page_limit , '' , $attr );  } ?>
				<label for="per_page_limit" style="float:right;margin-right:5px;">Records Per Page:</label>
			</div>
		</div>
	<?php echo form_close(); ?>
</div>

<script type="text/x-handlebars-template" id="GameListingTemplete">
	{{#each this}}
		<tr>
			<td align="center">{{this.serial_no}}</td>
			<td><span id="game_nam_label_{{@index}}">{{this.game_name}}</span><input type="text" name="game_name_{{@index}}" class="displayNone" id="game_name_{{@index}}" value="{{this.game_name}}"></td>
			<td align="center">{{this.league_desc}}</td>
			<td align="center">{{this.duration_desc}}</td>
			<td align="center">{{this.size}}</td>
			<td align="center">{{this.participant_joined}}</td>
			<td align="center">$ {{this.entry_fee}}</td>
			<td align="center">
							{{#if this.is_feature }}
								{{#compare this.is_feature 1 operator="=="}}
									Yes
								{{/compare}}
								{{#compare this.is_feature 0 operator="=="}}
									No
								{{/compare}}
							{{else}}					
							{{/if}}		
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
				<strong><a href="javascript:void(0)" onclick="window.location.href='<?php echo site_url( 'admin/game_detail' ) ?>/{{this.game_unique_id}}'">D</a></strong>
			</td>
		</tr>
	{{else}}
		<tr>
			<td colspan="6"><h3><p class="center red">No record found</p></h3></td>
		</tr>
	{{/each}}
</script>

<?php echo '<script type="text/javascript"> var Gamelist = {}; '; if ( isset( $current_game_data[ 'current_game' ] ) ) echo 'Gamelist = '.json_encode( $current_game_data[ 'current_game' ]  ).';'; echo '</script>'; ?>
<?php echo '<script type="text/javascript"> var Gamelist = {}; '; if ( isset( $game_data[ 'games' ] ) ) echo 'Gamelist = '.json_encode( $game_data[ 'games' ]  ).';'; echo '</script>'; ?>
<?php echo '<script type="text/javascript"> var link = {}; '; if ( isset( $game_data[ 'link' ] ) ) echo 'link = '.json_encode( $game_data[ 'link' ]  ).';'; echo '</script>'; ?>

<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/game.js<?php version_control(); ?>"></script>