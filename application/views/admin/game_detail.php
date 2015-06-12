<style type="text/css">
.user_lineup_detail{display: inline-block;vertical-align: top;width: 25%;padding: 10px;border-right:1px solid #CCC;height: 21px;cursor: pointer;}
.bbtm{border-bottom: 1px solid #CCC;}
#lineupDataHTML .user_lineup_detail{width:15%;}
.export{padding:2px 10px 2px 10px;display:inline-block;vertical-align-top;margin-top:10px;}
</style>
<div class="content">
	<div class="title">
		<h5>Game Detail</h5>
	</div>
	<a href="<?php echo site_url( 'admin/download_reports' ) ?>/<?php echo $game_id?>" target="_blank" class="redBtn export">Export</a>
	<a href="<?php echo site_url( 'admin' ) ?>" class="redBtn export" style="float:right;">Back</a>

	<div class="widget mrt20">
		<div class="head">
			<h5 class="iFrames"><label>Game Detail</label></h5>
		</div>
		<table cellpadding="0" cellspacing="0" width="100%" class="tableStatic resize display">
			<thead>
				<tr>
					<td>Game Name</td>
					<td>League Name</td>
					<td>League Type</td>
					<td>Drafting Style</td>
					<td>Max Participants</td>
					<td>Participant Joined</td>
					<td>Participant Remaining</td>
					<td>Entry Fee</td>
					<td>salary Cap</td>
					<td>Prize Type</td>
					<td>Serial Number</td>
					<td>Scheduled Date</td>
				</tr>
			</thead>
			<tbody id="gamelisting_container">
            <tr>
				<td><span><?php echo $game_detail['game_name'];?></span></td>
				<td><span><?php echo $game_detail['league_desc'];?></span></td>
				<td><span><?php echo $game_detail['duration_desc'];?></span></td>
				<td><span><?php echo $game_detail['drafting_styles_desc'];?></span></td>
				<td align="center"><?php echo $game_detail['size'];?></td>
				<td align="center"><?php echo $game_detail['participant_joined'];?></td>
				<td align="center"><?php echo $game_detail['size'] - $game_detail['participant_joined'];?></td>
				<td align="center">$ <?php echo $game_detail['entry_fee'];?></td>
				<td><span><?php echo $game_detail['salary_cap'];?></span></td>
				<td><span><?php echo $game_detail['number_of_winner_desc'];?></span></td>
				<td><span><?php echo $game_detail['serial_no'];?></span></td>
				<td><span><?php echo date('M d, D g:i A' , strtotime( $game_detail[ 'season_scheduled_date' ]));?></span></td>

			</tr>
            </tbody>
		</table>

		<aside class="total_score_detail">
			
			<div class="head mt20">
			<h5 class="iFrames"><label>Total Score and winning detail</label></h5>
		</div>	
		<div class="user_detail">
			<?php 
			if(!empty($total_score))
			{?>
				<div class="user_lineup_detail bbtm" >User Name
				</div><div class="user_lineup_detail bbtm">Score
				</div><div class="user_lineup_detail bbtm">Winning
				</div>	
				<?php 
				foreach ($total_score as $key => $lineup_score) 
				{
					?>
					<div onclick="funObj.viewUserDetail('<?php echo $lineup_score['user_id'];?>','<?php echo $this->uri->segment(3);?>');">
						<div class="user_lineup_detail">
							<?php echo $lineup_score['name'];?>
						</div><div class="user_lineup_detail">
							<?php echo $lineup_score['score'];?>
						</div><div class="user_lineup_detail" id="user_<?php echo $lineup_score['user_id']?>">
							<?php if( isset( $prize_by_position[ $lineup_score['user_id'] ] ) ) echo $prize_by_position[ $lineup_score['user_id'] ]; ?>
						</div>
					</div>
				<?php 
				}
			}
			else
			{?>
				<h5 style="padding:10px;">No Record Found</h5>
			<?php }?>
		</div>

		</aside>

		<aside class="lineup_detail"><div class="head">
			<h5 class="iFrames"><label>Line up Detail</label></h5>
		</div>
		
		<div id="lineupDataHTML"></div></aside>
		
			
	</div>
</div>
<script type="text/x-handlebars-template" id="userLineTemplate">

			{{#each this}}
					<div class="head">
						<h5 class="iFrames"><label>{{this.name}} ({{this.email}})</label></h5>
					</div>
					<div class="user_detail">
					<div class="user_lineup_detail bbtm">Position
					</div><div class="user_lineup_detail bbtm">Player Name
					</div><div class="user_lineup_detail bbtm">Team Name
					</div><div class="user_lineup_detail bbtm">
					
					<?php if ($game_detail['drafting_styles_desc'] == 'OMO') {?>						
						PPA
					<?php } else {?>	
					
						Player Salary		
					<?php } ?>
					
					</div><div class="user_lineup_detail bbtm">Score</div>	
					{{#each this.user_lineup}}	
							<div>
								<div class="user_lineup_detail">{{this.position}}
								</div><div class="user_lineup_detail"> {{this.full_name}}
								</div><div class="user_lineup_detail"> {{this.team_abbreviation}}
								</div><div class="user_lineup_detail">
								{{#if this.player_salary}}
									{{#compare this.player_salary '' operator="=="}}
									 {{this.weightage}}
									{{/compare}}
									{{#compare this.player_salary 0 operator="=="}}
									 {{this.weightage}}
									{{/compare}}
								{{else}}	
										{{this.player_salary}}							
								{{/if}}
								
								</div><div class="user_lineup_detail"> {{this.score}}</div>
							</div>
						
						
					{{/each}}
				</div>
				{{/each}}
</script>	
<?php echo '<script type="text/javascript"> var Gamelist = {}; '; if ( isset( $current_game_data[ 'current_game' ] ) ) echo 'Gamelist = '.json_encode( $current_game_data[ 'current_game' ]  ).';'; echo '</script>'; ?>
<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>

<script src="js/drag.ui.core.js"></script>
<script src="js/drag.ui.widget.js"></script>
<script src="js/game.js"></script>
<script src="js/game_detail.js"></script>
<script src="js/drag.ui.mouse.js"></script>
<script src="js/drag.ui.draggable.js"></script>
<script src="js/drag.ui.sortable.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js?v=1.4"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>