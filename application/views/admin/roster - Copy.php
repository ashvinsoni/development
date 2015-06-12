<!-- Content -->
<div class="content">
	<div class="title">
		<h5>Roster</h5>
	</div>
	<?php $frm_attr = 'id="roster_list"'; echo form_open( current_url() , $frm_attr ); ?>
		<div class="stats roster_ul frm_input">
			<ul>
<!-- 				<li>
					<input type="text" name="full_name" id="full_name" placeholder="Search by name.."  onkeyup="Roster.SearchByName( this );">
				</li>
 -->				<li>
					<?php $attr = 'id="league_id" class="jw125" onchange="Roster.SearchByLeague();"'; if ( isset( $sport) ) echo form_dropdown( 'league_id' , $sport ,'' , $attr ); ?>
				</li>
				<li>
					<select name="position" id="position" class="jw125" onchange="Roster.SearchByPosition(this);">
						<option value="">Select position</option>
					</select>
				</li>
				<li>
					<select name="team_abbreviation" id="team_abbreviation" onchange="Roster.SearchByTeam( this );">
						<option value="">Select team</option>
					</select>
				</li>
			</ul>
			<div class="fix"></div>
		</div>

		<div class="widget mrt20" id="roster_wrapper">
			<div class="head">
				<h5 class="iFrames">Manage Player Roster</h5>
			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="display resize frm_input roster" id="roster">
				<thead>
					<tr class="roster_th">
						<th class="all_th" style="width:4%;">
							<input type="checkbox" id="all" onclick="Roster.toggle_checkbox();">
						</th>
						<th align='left'>First Name</th>
						<th align='left'>Last Name</th>
						<th align='left'>Team</th>
						<th>Position</th>
						
						<th align='left'>First Salary</th>
						<th align='left'>Previous Salary</th>
						<th>Current Salary</th>
                        <!--<th>Weightage</th>-->
						<th>Health / Injury</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody id="rosterlisting_container"></tbody>
			</table>
		</div>

		<div class="pagination roster">
			<span class="action">
				<?php if ( isset( $status) ){ $attr = 'id="status" class="jw125" '; echo form_dropdown( 'status' , $status , '' , $attr ); } ?>
				<input type="button" value="Save" class="greyishBtn submitForm" style="float:left;" onclick="Roster.UpdateRoster();">
				<input type="button" value="Release" class="redBtn" style="float:left;" onclick="Roster.ReleasePlayer();">
			</span>
			<!-- Pagination -->
		</div>

	<?php echo form_close(); ?>
</div>

<script type="text/x-handlebars-template" id="RosterListingTemplete">
	{{#each this}}
		<tr>
			<td><input type="checkbox" name="player_unique_id[]" id="player_unique_id" class="player_unique_id" value="{{this.player_unique_id}}"></td>
			<td>{{this.first_name}}</td>
			<td>{{this.last_name}}</td>
			<td>{{this.team_market}} {{this.team_name}}</td>
			<td align="center">{{this.position}}</td>
			
			<td>{{this.first_salary}}</td>
            <td>{{this.previous_salary}}</td>
           <td><input type="text" name="salary_{{this.player_unique_id}}" id="salary" value="{{#if this.active }}{{this.salary}}{{else}}0{{/if}}" data-pui="{{this.player_unique_id}}" class="numbersOnly" maxlength="9" style="width:65%;"></td>
           <?php /*<td><input type="text" name="weightage_{{this.player_unique_id}}" id="weightage" value="{{this.weightage}}" data-pui="{{this.player_unique_id}}" class="numbersOnly" maxlength="9" style="width:65%;">
           </td> */ ?>
			<td><input type="text" name="injury_status_{{this.player_unique_id}}" id="injury_status" value="{{this.injury_status}}" maxlength="10" style="width:65%;"></td>
			<td align="center">
				{{#if this.active }}
					{{#compare this.active 1 operator="=="}}
						<img src="images/active.png" class="status_{{this.player_unique_id}}">
					{{/compare}}
					{{#compare this.active 0 operator="=="}}
						<img src="images/deactivate.png" class="status_{{this.player_unique_id}}">
					{{/compare}}
				{{else}}
					<img src="images/deactivate.png" class="status_{{this.player_unique_id}}">
				{{/if}}
			</td>	
		</tr>
	{{/each}}
</script>
<script type="text/javascript">
	var rosterlist = {};
	var position   = {};
	var team       = {};
	<?php if ( isset( $roster ) )	echo 'rosterlist = '.json_encode( $roster  ).';'; ?>
	<?php if ( isset( $position ) )	echo 'position = '.json_encode( $position  ).';'; ?>
	<?php if ( isset( $team ) )	echo 'team = '.json_encode( $team  ).';'; ?>
</script>

<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/roster.js<?php version_control(); ?>"></script>


<script type="text/javascript" src="/js/service/services.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="/js/directive/directive.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="/js/directive/paging.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="/js/controller/controller.js<?php version_control( TRUE ); ?>"></script>